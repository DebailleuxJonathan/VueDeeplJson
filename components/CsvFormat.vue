<template>
  <div class="w-full h-full border border-gray-200 bg-white rounded-lg p-3 shadow-inner -z-10 overflow-auto">
    <table class="w-full text-center" v-if="parsedData.length">
      <thead>
      <tr>
        <th class="text-gray-900 border-2 border-gray-800 bg-gray-300" v-for="header in headers" :key="header">{{
            header
          }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="border-2 border-gray-800" v-for="(row, index) in parsedData" :key="index">
        <td class="border-2 border-gray-800" :class="[(index % 2 && 'bg-gray-100')]" v-for="(value, key) in row"
            :key="key">{{ value }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';

const props = defineProps<{
  data: any
}>()

const parsedData = ref([]);
const headers = ref([]);
const dataCSV = computed(() => props.data)

const test = () => {
  if (dataCSV.value) {
    if (typeof dataCSV.value === 'string') {
      const toJSON = JSON.parse(dataCSV.value)
      parsedData.value = toJSON
      headers.value = toJSON.headers
    } else {
      parsedData.value = JSON.parse(JSON.stringify(dataCSV.value.csvData))
      headers.value = dataCSV.value.headers
    }
  }
}
onMounted(() => {
  test()
})

watch(dataCSV, () => {
  console.log(dataCSV.value)
  test()
})
//
// const handleFileChange = async () => {
//   // const file = event.target.files[0];
//   if (dataCSV.value) {
//     await parseCSV(dataCSV.value);
//   }
// };
//
// const parseCSV = async (file) => {
//   console.log(file)
//   const reader = new FileReader();
//   reader.onload = async (event) => {
//     const data = event.target.result;
//     Papa.parse(data, {
//       header: true,
//       dynamicTyping: true,
//       complete: (result) => {
//         parsedData.value = result.data;
//         headers.value = result.meta.fields;
//         const k = parsedData.value.filter((res) => Object.values(res)[0])
//         console.log(k);
//       }
//     });
//   };
//   reader.readAsText(file);
// }
</script>
