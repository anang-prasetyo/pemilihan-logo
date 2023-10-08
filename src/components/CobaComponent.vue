<template>
  <div class="d-flex flex-column gap-2 my-4">
    <input class="form-control" type="file" @change="onFileChanged">
    <button class="btn btn-primary" @click="upload()">Upload</button>
    <div>coba : {{ coba }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const coba = ref(null)
const upload = () => {
  console.log(coba.value);
}
const onFileChanged = (event) => {
  // coba.value = event.target.file[0]
  console.log('event -> ', event.target);
}
</script>

<style>

</style>