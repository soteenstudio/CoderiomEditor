<template>
  <div class="activity-bar">
    <div
      class="activity-item"
      :class="{ active: modelValue === 'explorer' }"
      title="Explorer"
      @click="$emit('update:modelValue', 'explorer')"
    >
      <span class="act-icon">
        <font-awesome-icon icon="fa-solid fa-folder" />
      </span>
    </div>
    <div
      class="activity-item"
      :class="{ active: modelValue === 'addons' }"
      title="Addons"
      @click="$emit('update:modelValue', 'addons')"
    >
      <span class="act-icon">
        <font-awesome-icon icon="fa-solid fa-plug" />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
};
</script>
