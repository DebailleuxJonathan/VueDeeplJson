<script setup lang='ts'>
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/vue";
import {ChevronUpDownIcon, CheckIcon} from '@heroicons/vue/20/solid'

const props = withDefaults(defineProps<{
  lang: any,
  isLoaded?: boolean
  title: string
  data: any
}>(), {
  isLoaded: true
})

const languages = ref(props.lang)

</script>
<template>
  <Listbox v-if="props.data.length > 0" as="div" v-model="languages">
    <div class="relative">
      <ListboxButton
          class="relative w-full cursor-pointer rounded-lg bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow ring-1 ring-inset ring-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
        <span class="block truncate">{{ languages.language }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
        </span>
      </ListboxButton>
      <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                  leave-to-class="opacity-0">
        <ListboxOptions
            class="absolute z-40 mt-1 max-h-60 w-full lg:w-max overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ListboxOption as="template" v-for="lang in data" :key="lang.name" :value="lang"
                         v-slot="{ active, selected }">
            <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{
                  `${lang.language} - ${lang.name}`
                }}</span>

              <span v-if="selected"
                    :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="h-5 w-5" aria-hidden="true"/>
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
