<template>
  <div class="editor-wrap" :class="{ 'sidebar-closed': !isSidebarOpen }">
    <Navbar
      :is-sidebar-open="isSidebarOpen"
      :file-name="currentFileName"
      @open-sidebar="isSidebarOpen = true"
    />

    <!-- Di bagian template App.vue lo -->
    <Sidebar
      :items="workspaceItems"
      :active-id="activeFileId"
      @select-file="loadFileContent"
      @create-file="createNewFile"
      @create-folder="createNewFolder"
      @explore-folder="readSubFolder"
      @rename-item="renameItem"
      @delete-item="deleteItem"
      @toggle-sidebar="isSidebarOpen = false"
    />

    <div ref="editorContainer" class="editor-container" />
  </div>
</template>

<script>
import './assets/styles/app.scss';
import './assets/styles/navbar.scss';
import './assets/styles/sidebar.scss';
import './assets/styles/editor.scss';
import { ref, onMounted, computed } from 'vue';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { useWorkspace } from './composables/useWorkspace';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  components: { Navbar, Sidebar },
  setup() {
    const editorContainer = ref(null);
    let view = null;
    const isSidebarOpen = ref(false);

    const loadFileContent = async (filePath) => {
      try {
        activeFileId.value = filePath;
        const contents = await Filesystem.readFile({
          path: filePath,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });

        if (view) {
          view.dispatch({
            changes: {
              from: 0,
              to: view.state.doc.length,
              insert: contents.data,
            },
          });
        }
      } catch (e) {
        console.error('Gagal baca file asli:', e);
      }
    };

    const {
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
    } = useWorkspace(loadFileContent);

    const currentFileName = computed(() => {
      const activeFile = getActiveFile();
      return activeFile ? activeFile.name : 'No File Open';
    });

    onMounted(async () => {
      await readWorkspaceStorage();

      const firstFile = workspaceItems.value.find(
        (item) => item.type === 'file'
      );
      if (firstFile) await loadFileContent(firstFile.id);

      const state = EditorState.create({
        doc: getActiveFile()?.content || '',
        extensions: [
          lineNumbers(),
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap]),
          javascript(),
          oneDark,
          EditorView.updateListener.of((update) => {
            if (update.docChanged && activeFileId.value) {
              saveFileContent(activeFileId.value, update.state.doc.toString());
            }
          }),
          EditorView.theme({
            '&': { height: '100%' },
            '.cm-scroller': { overflow: 'auto' },
          }),
        ],
      });

      view = new EditorView({ state, parent: editorContainer.value });
    });

    return {
      editorContainer,
      workspaceItems,
      activeFileId,
      isSidebarOpen,
      readSubFolder,
      loadFileContent,
      createNewFile,
      createNewFolder,
      renameItem,
      deleteItem,
      currentFileName,
    };
  },
};
</script>
