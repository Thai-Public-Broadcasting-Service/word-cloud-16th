<template>
  <div id="loading-screen" class="d-flex justify-content-center align-items-center" :class="{ 'is-loaded': isLoaded }">
    <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingScreen",
};
</script>

<style scoped lang="scss">
/* LOADING SCREEN */

#loading-screen {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 99;

  &.is-loaded {
    opacity: 0;
    overflow: hidden;
    height: 0;
    width: 0;
  }
}

</style>