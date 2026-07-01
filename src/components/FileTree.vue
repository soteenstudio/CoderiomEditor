<template>
  <div class="file-tree" @click.self="$emit('click-folder', '')">
    <div class="tree-container">
      <FileTreeItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        :active-id="activeId"
        :selected-folder="selectedFolder"
        :opened-folders="openedFolders"
        @click-folder="(id) => $emit('click-folder', id)"
        @select-file="(id) => $emit('select-file', id)"
        @open-menu="(item) => $emit('open-menu', item)"
      />
    </div>
  </div>
</template>

<script>
import FileTreeItem from './FileTreeItem.vue';

export default {
  components: { FileTreeItem },
  props: {
    items: { type: Array, required: true },
    activeId: { type: String, required: true },
    selectedFolder: { type: String, default: '' },
    openedFolders: { type: Object, required: true },
  },
  emits: ['click-folder', 'select-file', 'open-menu'],
};
</script>
