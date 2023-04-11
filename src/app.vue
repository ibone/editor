<script setup lang="ts">
import { ref, onMounted } from 'vue';
import editor from './editor.vue';
// reactive state
const count = ref(0);

// functions that mutate state and trigger updates
function increment() {
  count.value++;
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`);
});
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
  <editor />
</template>
