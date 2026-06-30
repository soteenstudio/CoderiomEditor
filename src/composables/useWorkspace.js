// src/composables/useWorkspace.js
import { ref } from 'vue';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export function useWorkspace(loadFileContentCallback) {
  const activeFileId = ref('');
  const workspaceItems = ref([]);

  // Fungsi helper untuk mencari file di dalam struktur tree yang nested
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

  const getActiveFile = () => findFileInTree(workspaceItems.value, activeFileId.value);

  // Membaca root storage utama
  const readWorkspaceStorage = async () => {
    try {
      await Filesystem.requestPermissions();
      const result = await Filesystem.readdir({ path: '', directory: Directory.Documents });
      
      workspaceItems.value = result.files.map(file => ({
        id: file.name, // Pada level root, id memakai nama file langsung
        type: file.type, // 'file' atau 'directory'
        name: file.name,
        path: file.name, // Menyimpan relative path asli untuk operasional file
        content: '',
        children: file.type === 'directory' ? [] : null // Siapkan wadah untuk isi folder
      }));
    } catch (e) {
      console.error("Gagal membaca storage asli:", e);
    }
  };

  // Fungsi baru untuk membaca isi dari sub-folder tertentu saat di-expand di sidebar
  const readSubFolder = async (folderPath) => {
    try {
      const result = await Filesystem.readdir({ 
        path: folderPath, 
        directory: Directory.Documents 
      });

      // Cari foldernya di dalam tree statis kita, lalu update properti children-nya
      const updateChildren = (items) => {
        for (let item of items) {
          if (item.id === folderPath && item.type === 'directory') {
            item.children = result.files.map(file => ({
              id: `${folderPath}/${file.name}`, // Bikin id unik gabungan path
              type: file.type,
              name: file.name,
              path: `${folderPath}/${file.name}`,
              content: '',
              children: file.type === 'directory' ? [] : null
            }));
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
        encoding: Encoding.UTF8
      });
    } catch (e) {
      console.error("Gagal auto-save berkas:", e);
    }
  };

  const createNewFile = async () => {
    const name = prompt("Masukan nama berkas baru:", "untitled.js");
    if (!name) return;
    try {
      await Filesystem.writeFile({
        path: name,
        data: `// Berkas ${name}\n`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      await readWorkspaceStorage();
      
      if (loadFileContentCallback) {
        await loadFileContentCallback(name);
      }
    } catch (e) {
      alert("Gagal membuat berkas fisik!");
    }
  };

  const createNewFolder = async () => {
    const name = prompt("Masukan nama folder baru:", "components");
    if (!name) return;
    try {
      await Filesystem.mkdir({ path: name, directory: Directory.Documents, recursive: false });
      await readWorkspaceStorage();
    } catch (e) {
      alert("Gagal membuat folder fisik!");
    }
  };

  return {
    activeFileId,
    workspaceItems,
    getActiveFile,
    readWorkspaceStorage,
    readSubFolder, // Return fungsi baru ini agar bisa dipakai di App.vue / Sidebar
    saveFileContent,
    createNewFile,
    createNewFolder
  };
}
