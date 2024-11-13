<script setup lang="ts">
const colorMode = useColorMode()
const handleChange = (value) => {
  colorMode.preference = value ? colorMode.preference = 'dark' : colorMode.preference = 'light'
}

const iconName = computed(() => (colorMode.preference === 'dark' ? 'ph:moon' : 'ph:sun'))

</script>

<template>
  <div class="flex items-center gap-3">
    <Icon size="16" for="airplane-mode" :name="iconName"/>
    <Switch id="airplane-mode" :checked="colorMode.preference === 'dark'" @update:checked="handleChange"/>
  </div>
</template>
