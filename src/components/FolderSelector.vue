<template>
  <div>
    <div id="instruction">{{textInstruction}}</div>
    <button id="click" v-on:click="chooseByEnv()"></button>
    <p>{{folderPath}}</p>
  </div>
</template>

<script>
const electron = window.require("electron");
var fs = window.require("fs");

export default {
  data() {
    return {
      textInstruction: "Select a folder",
      folderPath: null
    };
  },
  methods: {
    selectFolder: function(electronSession) {
      this.folderPath = electronSession.remote.dialog.showOpenDialogSync({
        properties: ["openDirectory"]
      });
      return this.folderPath;
    },
    chooseByEnv: function(env = process.env.NODE_ENV) {
      if (env == "test") {
        this.folderPath = `${process.cwd()}/src/assets/fake_path_for_test`;
        return this.folderPath;
      } else {
        return this.selectFolder(electron);
      }
    },
    validPath: function(path) {
      const isExists = fs.existsSync(path);
      if (!isExists) {
        this.textInstruction = "Please select a correct folder";
        return false;
      } else {
        let stat = fs.lstatSync(path);
        stat.isDirectory()
          ? (this.textInstruction = path)
          : (this.textInstruction = "Please select a correct folder");
        return stat.isDirectory();
      }
    }
  }
};
</script>
 
<style>
</style>