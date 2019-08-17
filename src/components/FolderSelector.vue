<template>
  <div class="appContainer">
    <div id="choose" v-on:click="chooseByEnv()" class="chooseContainer">
      <div id="instruction">{{textInstruction}}</div>
      <p>{{folderPath}}</p>
    </div>
    <div class="buttonContainer" id="convertButton" v-on:click="convert()">Convert</div>
  </div>
</template>

<script>
const electron = window.require("electron");
const fs = window.require("fs");
const PDFDocument = window.require("pdfkit");
const path = window.require("path");

export default {
  data() {
    return {
      textInstruction: "Select a folder",
      folderPath: null,
      state: null
    };
  },
  methods: {
    selectFolder: function() {
      if (window.process.env.NODE_ENV != "test") {
        this.folderPath = electron.remote.dialog.showOpenDialogSync({
          properties: ["openDirectory"]
        })[0];
      } else {
        this.folderPath = path.resolve("./src/assets/content_fake_folder");
      }
      this.validPath(this.folderPath);
      return this.folderPath;
    },
    chooseByEnv: function() {
      if (window.process.env.NODE_ENV == "test") {
        this.folderPath = path.resolve("./src/assets/content_fake_folder");
      } else {
        this.folderPath = this.selectFolder(electron);
      }
      this.validPath(this.folderPath);
      return this.folderPath;
    },
    validPath: function(path) {
      const isExists = fs.existsSync(path);
      if (!isExists) {
        this.textInstruction = "Please select a correct folder";
        this.state = false;
      } else {
        let stat = fs.lstatSync(path);
        stat.isDirectory()
          ? (this.textInstruction = path)
          : (this.textInstruction = "Please select a correct folder");
        this.state = stat.isDirectory();
      }
      return this.state;
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
        console.log(doc.page.height)
        doc.image(images[0],0,0,{
          fit:[doc.page.width,doc.page.height],
          align: "center",
          valign: "center"
        });
        for (let i = 1; i < images.length; i++) {
          doc
            .addPage()
            .image(images[i],0,0, {
              fit:[doc.page.width,doc.page.height],
              align: "center",
              valign: "center"
            });
        }
        doc.end();
      });

      return p;
    }
  }
};
</script>
 
<style>
.appContainer {
  margin: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.chooseContainer {
  background-color: aquamarine;
  height: 50vh;
  width: 80vw;
}

.buttonContainer {
  background-color: salmon;
  width: 80vw;
  height: 10vh;
}
</style>