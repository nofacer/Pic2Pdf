<template>
  <div>
    <h1 id="version">{{version()}}</h1>
  </div>
</template>

<script>
const electron = window.require("electron");
export default {
  methods: {
    version: function() {
      return electron.remote.app.getVersion();
    }
  }
};
</script>

<style>
 div{
  display: flex;
  justify-content:center;
  align-items:center;
  height: 100vh;
  width: 100vw;
 }
</style>