<template>
  <div class="editor-wrap" :class="{ 'sidebar-closed': !isSidebarOpen }">
    <button v-if="!isSidebarOpen" class="open-sidebar-btn" @click="isSidebarOpen = true" title="Buka Sidebar">☰</button>

    <Sidebar 
      :items="workspaceItems"
      :activeId="activeFileId"
      @select-file="loadFileContent"
      @create-file="createNewFile"
      @create-folder="createNewFolder"
      @toggle-sidebar="isSidebarOpen = false"
    />

    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

// Import CSS & Composable Baru
import './assets/daylong-theme.css';
import { useWorkspace } from './composables/useWorkspace';
import Sidebar from './components/Sidebar.vue';

export default {
  components: { Sidebar },
  setup() {
    const editorContainer = ref(null);
    let view = null;
    const isSidebarOpen = ref(true);

    // 1. Definisikan loadFileContent duluan biar bisa di-pass sebagai callback
    const loadFileContent = async (fileName) => {
      try {
        activeFileId.value = fileName;
        const contents = await Filesystem.readFile({
          path: fileName,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        });

        if (view) {
          view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: contents.data }
          });
        }
      } catch (e) {
        console.error("Gagal baca file asli:", e);
      }
    };

    // 2. Kirim loadFileContent ke composable, lalu ambil fungsi create-nya di sini
    const { 
      activeFileId, 
      workspaceItems, 
      getActiveFile, 
      readWorkspaceStorage, 
      saveFileContent,
      createNewFile,
      createNewFolder
    } = useWorkspace(loadFileContent);

    onMounted(async () => {
      await readWorkspaceStorage();

      // Auto-load file pertama jika tersedia
      const firstFile = workspaceItems.value.find(item => item.type === 'file');
      if (firstFile) await loadFileContent(firstFile.id);

      const state = EditorState.create({
        doc: getActiveFile()?.content || "",
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
            "&": { height: "100%" },
            ".cm-scroller": { overflow: "auto" }
          })
        ]
      });

      view = new EditorView({ state, parent: editorContainer.value });
    });

    return {
      editorContainer,
      workspaceItems,
      activeFileId,
      isSidebarOpen,
      loadFileContent,
      createNewFile,
      createNewFolder
    };
  }
}
</script>
