<template>
  <div id="app">
    <FolderSelector />
  </div>
</template>

<script>
import FolderSelector from "@/components/FolderSelector.vue";

export default {
  name: "app",
  components: {
    FolderSelector
  }
};
</script>

<style>
body {
  margin: 0;
}
</style>