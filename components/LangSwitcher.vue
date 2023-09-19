<script setup lang="ts">
const { locales, locale, setLocale } = useI18n();

const language = computed({
  get: () => locale.value,
  set: (value) => {
    setLocale(value);
  },
});
</script>

<template>
  <div>
    <select class="p-4 rounded-sm dark:border dark:border-white dark:bg-gray-800" v-model="language">
      <option
          v-for="item in locales"
          :key="typeof item === 'object' ? item.code : item"
          :value="typeof item === 'object' ? item.code : item"
      >
        {{ typeof item === "object" ? item.name : item }}
      </option>
    </select>
  </div>
</template>
