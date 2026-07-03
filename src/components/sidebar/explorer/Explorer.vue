<template>
  <div class="sidebar-explorer">
    <SidebarHeader @close="$emit('toggle-sidebar')">
      <template #title>{{ t('title:explorer') }}</template>
    </SidebarHeader>

    <SidebarActions @action="triggerCreate" />

    <FileTree
      :items="items"
      :active-id="activeId"
      :selected-folder="selectedFolder"
      :opened-folders="openedFolders"
      @click-folder="clickFolder"
      @select-file="(id) => $emit('select-file', id)"
      @open-menu="(item) => $emit('open-menu', item)"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SidebarHeader from '../SidebarHeader.vue';
import SidebarActions from './SidebarActions.vue';
import FileTree from './FileTree.vue';

export default {
  components: { SidebarHeader, SidebarActions, FileTree },
  props: {
    items: { type: Array, required: true },
    activeId: { type: String, required: true },
    selectedFolder: { type: String, default: '' },
  },

  emits: [
    'trigger-create',
    'select-file',
    'open-menu',
    'explore-folder',
    'click-folder',
    'toggle-sidebar',
  ],
  setup(props, { emit }) {
    const { t } = useI18n();
    const openedFolders = ref({});

    const clickFolder = (folderPath) => {
      emit('click-folder', folderPath);

      openedFolders.value[folderPath] = !openedFolders.value[folderPath];
      if (openedFolders.value[folderPath]) {
        emit('explore-folder', folderPath);
      }
    };

    const isFolderOpen = (folderPath) => !!openedFolders.value[folderPath];

    const triggerCreate = (type) => {
      emit('trigger-create', type, props.selectedFolder);
    };

    const openMenu = (item) => {
      emit('open-menu', item);
    };

    return {
      t,
      openedFolders,
      clickFolder,
      isFolderOpen,
      triggerCreate,
      openMenu,
    };
  },
};
</script>
