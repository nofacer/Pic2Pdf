<template>
  <div></div>
</template>

<script>
import { format } from "path";
const electron = window.require("electron");

export default {
  data() {
    return {
      textInstruction: "Selector a folder",
      folderPath: null
    };
  },
  methods: {
    selectFolder: function(electronSession) {
      this.folderPath = electronSession.remote.dialog.showOpenDialogSync({
        properties: ["openDirectory"]
      });
      return this.folderPath;
    }
  }
};
</script>

<style>
</style>