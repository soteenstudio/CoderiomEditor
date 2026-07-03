<template>
  <div class="sidebar-addons">
    <SidebarHeader @close="$emit('toggle-sidebar')">
      <template #title>{{ t('title:addons') }}</template>
    </SidebarHeader>

    <div class="sidebar-actions-addons">
      <div class="search-box">
        <input type="text" :placeholder="t('placeholder:search-addons')" />
      </div>

      <button>
        <font-awesome-icon icon="fa-solid fa-filter" />
      </button>
    </div>

    <p class="coming-soon">{{ t('coming-soon') }}</p>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import SidebarHeader from '../SidebarHeader.vue';

export default {
  components: { SidebarHeader },
  emits: ['toggle-sidebar'],
  setup() {
    const { t } = useI18n();

    return { t };
  },
};
</script>
