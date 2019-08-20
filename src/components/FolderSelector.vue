<template>
  <div class="appContainer flex-item">
    <div id="choose" v-on:click="selectFolder()" class="chooseContainer dark-blur flex-item">
      <div id="instruction">{{textInstruction}}</div>
    </div>
    <div
      class="buttonContainer dark-blur flex-item"
      id="convertButton"
      v-on:click="convert()"
      :class="{'disable':(state!=true)}"
    >
      <transition name="fade" mode="out-in">
        <p v-if="convertState==='none'" key="none">Convert</p>
        <p v-if="convertState==='running'" key="running">Converting</p>
        <p v-if="convertState==='success'" key=succeed>Succeed</p>
      </transition>
    </div>
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
      folderPath: null,
      state: null,
      convertState: "none"
    };
  },
  computed: {
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
    selectFolder: function() {
      if (window.process.env.NODE_ENV != "test") {
        this.folderPath = electron.remote.dialog.showOpenDialogSync({
          properties: ["openDirectory"]
        })[0];
      } else {
        this.folderPath = path.resolve("./src/assets/content_fake_folder");
      }
      this.convertState='none';
      this.validPath(this.folderPath);
      return this.folderPath;
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

    convert: function() {
      this.convertState = "running";
      console.log(this.convertState)
      const images = this.getFiles();
      const doc = new PDFDocument();
      const outputPath = this.folderPath + ".pdf";
      const imageConfig = {
        fit: [doc.page.width, doc.page.height],
        align: "center",
        valign: "center"
      };
      var self = this;
      var p = new Promise(function(resolve) {
        doc.pipe(fs.createWriteStream(outputPath)).on("finish", function() {
          self.convertState = "success";
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
  background: linear-gradient(145deg, #2c3e50, #3498db);
  background-color: #cfdee7;
}

.chooseContainer {
  height: 60vh;
  width: 80vw;
}

.buttonContainer {
  width: 80vw;
  height: 10vh;
}

#instruction {
  word-break: break-word;
  margin: 20px;
}

.disable {
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.45);
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.45);
  color: rgba(255, 255, 255, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
/* @keyframes mymove {
  from {
      height: 60vh;
      width: 80vw;
      box-shadow: 5px 5px 20px black;
      font-size: 1em;
  }
  to {
      height: 61.5vh;
      width: 82vw;
      box-shadow: 5px 5px 40px black;
      font-size: 1.25em;
  }
} */
</style>