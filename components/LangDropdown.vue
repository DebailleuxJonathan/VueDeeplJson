<script setup lang='ts'>
import {Lang, LangName} from "~/types/lang";
import {Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions} from "@headlessui/vue";
import {ChevronUpDownIcon, CheckIcon} from '@heroicons/vue/20/solid'
import {ClipboardIcon, ArrowDownTrayIcon} from "@heroicons/vue/24/outline"

const people = Lang

const props = withDefaults(defineProps<{
  lang: string,
  isLoaded?: boolean
  title: string
}>(), {
  isLoaded: true
})

</script>
<template>
  <Listbox as="div" v-model="props.lang">
    <div class="flex justify-between">
      <ListboxLabel v-if="!props.isLoaded" class="block text-sm font-medium leading-6 text-green-900">En attente...
      </ListboxLabel>
    </div>
    <div class="z-50 relative">
      <ListboxButton
          class="relative w-full cursor-pointer rounded-lg bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow ring-1 ring-inset ring-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
        <span class="block truncate">{{ props.lang }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
        </span>
      </ListboxButton>
      <div class="top-0 right-0 flex gap-2 py-2">
        <div class="flex gap-2 w-full justify-end items-center">
          <p v-if="isCopy" :class="isAnimationCopy && 'active'"
             class="pointer-events-none text-container text-sm p-2 bg-amber-500 text-white transition-all duration-300 rounded">
            Texte copié !</p>
          <button
              :disabled="value === ''"
              :class="value === '' && '!bg-gray-50 !text-gray-400 !cursor-not-allowed'"
              class="z-40 w-max p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md cursor-pointer shadow transition-all duration-300"
              @click="copy(value)"
          >
            <ClipboardIcon class="w-5 h-5"/>
          </button>
        </div>
        <div class="flex gap-2 w-full justify-end items-center">
          <p v-if="isDownload" :class="isAnimationDownload && 'active'"
             class="pointer-events-none text-container text-sm p-2 bg-blue-500 text-white transition-all duration-300 rounded">
            Texte téléchargé !</p>
          <button
              class="z-40 w-max p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer shadow transition-all duration-300"
              @click="download"
              :disabled="value === ''"
              :class="value === '' && '!bg-gray-50 !text-gray-400 !cursor-not-allowed'"
          >
            <ArrowDownTrayIcon class="w-5 h-5"/>
          </button>
        </div>
      </div>

      <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                  leave-to-class="opacity-0">
        <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-max overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ListboxOption as="template" v-for="person in people" :key="person.id" :value="person"
                         v-slot="{ active, selected }">
            <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{
                  `${person} - ${LangName[person]}`
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
