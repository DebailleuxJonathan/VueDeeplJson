<script setup lang='ts'>
import {Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions} from "@headlessui/vue";
import {ChevronUpDownIcon, CheckIcon} from '@heroicons/vue/20/solid'

const people = ['json', 'csv']

const props = defineProps<{
  format: string
}>()

</script>
<template>
  <Listbox as="div" v-model="props.format">
    <div class="relative">
      <ListboxButton
          class="relative flex py-2 px-3 justify-between items-center w-full text-left text-gray-900 gap-6 bg-white rounded-lg ring-1 ring-inset ring-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow">
        <p class="block truncate py-px">{{ 'Format : ' + props.format }}</p>
        <p class="pointer-events-none right-0 flex items-center">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
        </p>
      </ListboxButton>

      <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                  leave-to-class="opacity-0">
        <ListboxOptions
            class="absolute mt-1 z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ListboxOption as="template" v-for="person in people" :key="person" :value="person"
                         v-slot="{ active, selected }">
            <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ person }}</span>

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
