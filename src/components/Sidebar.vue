<template>
  <div class="sidebar-wrapper">
    <!-- Activity Bar -->
    <div class="activity-bar">
      <div class="activity-item active" title="Explorer"><span class="act-icon">📁</span></div>
      <div class="activity-item" title="Search"><span class="act-icon">🔍</span></div>
      <div class="activity-item" title="Source Control"><span class="act-icon">🌿</span></div>
      <div class="activity-item" title="Extensions"><span class="act-icon">🧩</span></div>
    </div>

    <!-- Container Utama Explorer -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <span>EXPLORER: REDDEAD</span>
        <button class="close-btn" @click="$emit('toggle-sidebar')" title="Tutup Sidebar">⌕</button>
      </div>
      
      <div class="sidebar-actions">
        <button @click="$emit('create-file')" title="New File..">📄+</button>
        <button @click="$emit('create-folder')" title="New Folder..">📁+</button>
      </div>

      <div class="file-tree">
        <div v-for="item in items" :key="item.id" class="tree-item">
          <!-- Render Folder dengan Fitur Klik Toggle -->
          <div v-if="item.type === 'directory'" class="item-folder" @click="toggleFolder(item.id)">
            <!-- Icon berubah dinamis tergantung kebuka atau ketutup -->
            <span class="icon">{{ isFolderOpen(item.id) ? '📂' : '📁' }}</span>
            <span class="name">{{ item.name }}</span>
          </div>
          
          <!-- Render File -->
          <div 
            v-else 
            class="item-file" 
            :class="{ active: item.id === activeId }"
            @click="$emit('select-file', item.id)"
          >
            <span class="icon">📄</span>
            <span class="name">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    items: { type: Array, required: true },
    // Ubah ke String karena activeFileId lo pake path string unik bawaan HP
    activeId: { type: String, required: true } 
  },
  emits: ['toggle-sidebar', 'create-file', 'create-folder', 'select-file', 'explore-folder'],
  setup(props, { emit }) {
    // State lokal untuk mencatat id/path folder yang sedang terbuka
    const openedFolders = ref({});

    const toggleFolder = (folderPath) => {
      // Toggle status true/false
      openedFolders.value[folderPath] = !openedFolders.value[folderPath];
      
      // Emit ke parent/composable buat nge-load isi file di dalam folder ini
      if (openedFolders.value[folderPath]) {
        emit('explore-folder', folderPath);
      }
    };

    const isFolderOpen = (folderPath) => {
      return !!openedFolders.value[folderPath];
    };

    return {
      toggleFolder,
      isFolderOpen
    };
  }
}
</script>
