<template>
  <div class="sidebar-actions">
    <button title="New File" @click="$emit('action', 'file')">
      <font-awesome-icon icon="fa-solid fa-file-circle-plus" />
    </button>
    <button title="New Folder" @click="$emit('action', 'folder')">
      <font-awesome-icon icon="fa-solid fa-folder-plus" />
    </button>
  </div>
</template>

<script>
export default {
  emits: ['action'],
};
</script>
