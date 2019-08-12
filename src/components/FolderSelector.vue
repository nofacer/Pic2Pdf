<template>
  <div>
    <div id="instruction">{{textInstruction}}</div>

    <button id="choose" v-on:click="chooseByEnv()"></button>
    <p>{{folderPath}}</p>
    <button id="click" v-on:click="convert()">CONVERT!!</button>
  </div>
</template>

<script>
const electron = window.require("electron");
const fs = window.require("fs");
const PDFDocument = window.require("pdfkit");

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
      })[0];
      return this.folderPath;
    },
    chooseByEnv: function() {
      if (window.process.env.NODE_ENV=='test') {
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
    },
    getFiles: function() {
      let names = fs.readdirSync(this.folderPath).sort();
      for (let i = 0; i < names.length; i++) {
        names[i] = this.folderPath + "/" + names[i];
      }
      return names;
    },
    convert: function() {
      const images = this.getFiles();
      const doc = new PDFDocument();
      const outputPath = this.folderPath + ".pdf";
      var p = new Promise(function(resolve) {
        doc.pipe(fs.createWriteStream(outputPath)).on("finish", function() {
          resolve(true);
        });
        doc.image(images[0]);
        for (let i = 1; i < images.length; i++) {
          doc.addPage().image(images[i]);
        }
        doc.end();
      });

      return p;
    }
  }
};
</script>
 
<style>
</style>