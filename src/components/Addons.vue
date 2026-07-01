<template>
  <div class="sidebar-addons">
    <SidebarHeader @close="$emit('toggle-sidebar')">
      <template #title>{{ t('title:addons') }}</template>
    </SidebarHeader>
    
    <p class="coming-soon">{{ t('coming-soon') }}</p>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import SidebarHeader from './SidebarHeader.vue';

export default {
  components: { SidebarHeader },
  emits: ['toggle-sidebar'],
  setup() {
    const { t } = useI18n();
    
    return { t };
  }
}
</script>