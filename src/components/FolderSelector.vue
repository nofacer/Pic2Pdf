<template>
  <div
    class="appContainer flex-item"
    :class="{'convert-background':(convertState=='none'),'running-background':(convertState=='running'),'success-background':(convertState=='success'),'error-background':(state==false)}"
  >
    <div id="choose" v-on:click="selectFolder()" class="chooseContainer dark-blur flex-item">
      <div id="instruction">{{textInstruction}}</div>
    </div>

    <div
      id="choose"
      v-on:click="selectOutputPath()"
      class="outputChooseContainer dark-blur flex-item"
    >
      <div id="instruction">
        <p v-if="(outputPath==null)">Default Output Path : Same Place</p>
        <p v-else>{{outputPath}}</p>
      </div>
    </div>
    <div
      class="buttonContainer dark-blur flex-item"
      id="convertButton"
      v-on:click="convert()"
      :class="{'disable':(state!=true ),'disable-click':(state!=true || convertState=='running')}"
    >
      <transition name="fade" mode="out-in">
        <p v-bind:key="convertState">{{convertMessage}}</p>
      </transition>
    </div>
  </div>
</template>

<script>
import { Promise } from "q";
import { setTimeout } from "timers";
const electron = window.require("electron");
const fs = window.require("fs");
const PDFDocument = window.require("pdfkit");
const path = window.require("path");

export default {
  data() {
    return {
      folderPath: null,
      state: null,
      convertState: "none",
      outputPath: null
    };
  },
  computed: {
    convertMessage: function() {
      let result;
      switch (this.convertState) {
        case "none":
          result = "Convert";
          break;
        case "running":
          result = "Converting";
          break;
        case "success":
          result = "Success";
          break;
      }
      return result;
    },
    textInstruction: function() {
      if (this.state == null) {
        return "Select a folder";
      } else if (this.state == true) {
        return this.folderPath;
      } else {
        return "Please select a correct folder";
      }
    }
  },
  methods: {
    delay: function(ms) {
      return new Promise(res => {
        setTimeout(res, ms);
      });
    },
    selectFolder: function() {
      if (window.process.env.NODE_ENV != "test") {
        this.folderPath = electron.remote.dialog.showOpenDialogSync({
          properties: ["openDirectory"]
        })[0];
      } else {
        this.folderPath = path.resolve("./src/assets/content_fake_folder");
      }
      this.convertState = "none";
      this.validPath(this.folderPath);
      return this.folderPath;
    },
    selectOutputPath: function() {
      this.outputPath = electron.remote.dialog.showOpenDialogSync({
        properties: ["openDirectory"]
      })[0];
    },

    validPath: function(path) {
      const isExists = fs.existsSync(path);
      if (!isExists) {
        this.state = false;
      } else {
        let stat = fs.lstatSync(path);
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
    getFileType: function(filePath) {
      var startIndex = filePath.lastIndexOf(".");
      if (startIndex != -1)
        return filePath
          .substring(startIndex + 1, filePath.length)
          .toLowerCase();
      else return "";
    },
    preConvert: function(files) {
      if (files.length < 1) {
        this.state = false;
        return false;
      }

      let filteredImages = [];

      for (let i = 0; i < files.length; i++) {
        if (
          this.getFileType(files[i]) == "jpg" ||
          this.getFileType(files[i]) == "png"
        ) {
          filteredImages.push(files[i]);
        }
      }

      return filteredImages;
    },

    convert: async function() {
      let images = this.getFiles();
      if (!this.preConvert(images)) return false;
      images = this.preConvert(images);
      let vm = this;
      this.convertState = "running";
      await this.delay(600);

      const doc = new PDFDocument();

      const filename = path.basename(this.folderPath) + ".pdf";
      let out;
      if (this.outputPath == null) {
        out = this.folderPath + ".pdf";
      } else {
        out = path.join(this.outputPath, filename);
      }

      const imageConfig = {
        fit: [doc.page.width, doc.page.height],
        align: "center",
        valign: "center"
      };
      var p = new Promise(function(resolve) {
        doc.pipe(fs.createWriteStream(out)).on("finish", function() {
          vm.convertState = "success";
          resolve(true);
        });
        doc.image(images[0], 0, 0, imageConfig);
        for (let i = 1; i < images.length; i++) {
          doc.addPage().image(images[i], 0, 0, imageConfig);
        }
        doc.end();
      });

      return p;
    }
  }
};
</script>
 
<style>
/* disable text selection */
:not(input):not(textarea),
:not(input):not(textarea)::after,
:not(input):not(textarea)::before {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}
input,
button,
textarea,
:focus {
  outline: none;
}

.flex-item {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.dark-blur {
  background-color: rgba(0, 0, 0, 0.65);
  border-radius: 5px;
  box-shadow: 5px 5px 20px black;
  font-size: 1em;
  color: rgba(255, 255, 255, 0.7);
  /* animation: mymove 1s infinite;  */
}
.white-blur {
  background-color: rgba(255, 255, 255, 0.35);
  border-radius: 5px;
  /* box-shadow: 5px 5px 20px black; */
  color: rgba(255, 255, 255, 0.7);
}

.appContainer {
  margin: 0;
  height: 100vh;
  width: 100vw;
  transition: 1s;
}

.convert-background {
  background-color: #3498db;
}

.running-background {
  background-color: #d8db34;
}

.success-background {
  background-color: #34db50;
}

.error-background {
  background-color: #db3434;
}

.chooseContainer {
  height: 50vh;
  width: 80vw;
}

.outputChooseContainer {
  height: 10vh;
  width: 80vw;
}

.buttonContainer {
  width: 80vw;
  height: 10vh;
  transition: 1s;
}

.buttonContainer:before {
  background: #2c3e50;
}

#instruction {
  word-break: break-word;
  margin: 20px;
}

.disable {
  background-color: rgba(0, 0, 0, 0.45);
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.45);
  color: rgba(255, 255, 255, 0.1);
}

.disable-click {
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>