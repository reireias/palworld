<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-select
        v-model="target"
        label="ターゲット"
        :items="combinationPalList"
      ></v-select>
      <v-select
        v-model="source"
        label="スキル継承元"
        :items="palList"
      ></v-select>
      <VueMermaidRender v-if="target && graph" :content="graph"></VueMermaidRender>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { VueMermaidRender } from 'vue-mermaid-render'
import {
  palList,
  combinationPalList,
  searchCombinationRoute,
} from '@/utils/pal'

const target = ref<string | null>(null)
const source = ref<string | null>(null)

const graph = computed(() => {
  if (!target.value || !source.value) return ''
  const results = searchCombinationRoute(target.value, source.value)
  console.log(results.length)
  console.log(results)
  // TODO: 今は一番最初の結果のみ描画
  return results[0]
})

</script>
