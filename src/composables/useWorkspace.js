import { ref } from 'vue';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

// Tambahin fungsi ini di dalam useWorkspace
const sortWorkspaceItems = (items) => {
  return items.sort((a, b) => {
    // 1. Folder selalu di atas (type 'directory')
    if (a.type === 'directory' && b.type !== 'directory') return -1;
    if (a.type !== 'directory' && b.type === 'directory') return 1;

    // 2. Kalau sesama folder atau sesama file, urutin berdasarkan nama (alfabetis)
    return a.name.localeCompare(b.name);
  });
};

export function useWorkspace(loadFileContentCallback) {
  const activeFileId = ref('');
  const workspaceItems = ref([]);

  const findFileInTree = (items, id) => {
    for (const item of items) {
      if (item.id === id && item.type === 'file') return item;
      if (item.type === 'directory' && item.children) {
        const found = findFileInTree(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getActiveFile = () =>
    findFileInTree(workspaceItems.value, activeFileId.value);

  const readWorkspaceStorage = async () => {
    try {
      await Filesystem.requestPermissions();
      const result = await Filesystem.readdir({
        path: '',
        directory: Directory.Documents,
      });

      workspaceItems.value = sortWorkspaceItems(result.files.map((file) => ({
        id: file.name,
        type: file.type,
        name: file.name,
        path: file.name,
        content: '',
        children: file.type === 'directory' ? [] : null,
      })));
    } catch (e) {
      console.error('Gagal membaca storage asli:', e);
    }
  };

  const readSubFolder = async (folderPath) => {
    try {
      const result = await Filesystem.readdir({
        path: folderPath,
        directory: Directory.Documents,
      });

      const updateChildren = (items) => {
        for (let item of items) {
          if (item.id === folderPath && item.type === 'directory') {
            item.children = sortWorkspaceItems(result.files.map((file) => ({
              id: `${folderPath}/${file.name}`,
              type: file.type,
              name: file.name,
              path: `${folderPath}/${file.name}`,
              content: '',
              children: file.type === 'directory' ? [] : null,
            })));
            return true;
          }
          if (item.type === 'directory' && item.children) {
            if (updateChildren(item.children)) return true;
          }
        }
        return false;
      };

      updateChildren(workspaceItems.value);
    } catch (e) {
      console.error(`Gagal membaca sub-folder: ${folderPath}`, e);
    }
  };

  const saveFileContent = async (filePath, text) => {
    try {
      await Filesystem.writeFile({
        path: filePath,
        data: text,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    } catch (e) {
      console.error('Gagal auto-save berkas:', e);
    }
  };

  const createNewFile = async (targetPath = '', name) => {
    if (!name) return;
    const fullPath = targetPath ? `${targetPath}/${name}` : name;
    try {
      await Filesystem.writeFile({
        path: fullPath,
        data: `// ${name}\n`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      targetPath
        ? await readSubFolder(targetPath)
        : await readWorkspaceStorage();
      if (loadFileContentCallback) await loadFileContentCallback(fullPath);
    } catch (e) {
      console.error(e);
    }
  };

  const createNewFolder = async (targetPath = '', name) => {
    if (!name) return;

    const fullPath = targetPath ? `${targetPath}/${name}` : name;

    try {
      await Filesystem.mkdir({
        path: fullPath,
        directory: Directory.Documents,
        recursive: false,
      });

      if (targetPath) {
        await readSubFolder(targetPath);
      } else {
        await readWorkspaceStorage();
      }
      return true;
    } catch (e) {
      console.error('Gagal buat folder:', e);
      return false;
    }
  };

  const renameItem = async (oldPath, newName) => {
    if (!newName) return;

    const pathParts = oldPath.split('/');
    const oldName = pathParts[pathParts.length - 1];

    if (newName === oldName) return;

    pathParts[pathParts.length - 1] = newName;
    const newPath = pathParts.join('/');

    try {
      await Filesystem.rename({
        from: oldPath,
        to: newPath,
        directory: Directory.Documents,
      });

      const parentPath = pathParts.slice(0, -1).join('/');
      if (parentPath) {
        await readSubFolder(parentPath);
      } else {
        await readWorkspaceStorage();
      }

      if (activeFileId.value === oldPath) {
        activeFileId.value = newPath;
      }
      return true;
    } catch (e) {
      console.error('Gagal rename:', e);
      return false;
    }
  };

  const deleteItem = async (targetPath, type) => {
    try {
      if (type === 'directory')
        await Filesystem.rmdir({
          path: targetPath,
          directory: Directory.Documents,
          recursive: true,
        });
      else
        await Filesystem.deleteFile({
          path: targetPath,
          directory: Directory.Documents,
        });

      const parentPath = targetPath.split('/').slice(0, -1).join('/');
      parentPath
        ? await readSubFolder(parentPath)
        : await readWorkspaceStorage();
      if (activeFileId.value === targetPath) activeFileId.value = '';
    } catch (e) {
      console.error(e);
    }
  };

  return {
    activeFileId,
    workspaceItems,
    getActiveFile,
    readWorkspaceStorage,
    readSubFolder,
    saveFileContent,
    createNewFile,
    createNewFolder,
    renameItem,
    deleteItem,
  };
}
