<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      textInstruction: "Selector a folder",
      folderPath: null
    };
  },
  methods: {
    selectFolder: (electronSession) => {
      return electronSession.remote.dialog.showOpenDialogSync({
        properties: ["openDirectory"]
      });
    }
  }
};
</script>

<style>
</style>