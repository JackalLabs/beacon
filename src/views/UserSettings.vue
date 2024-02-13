<template>
  <div class="template-container">
    <div class="main-container">
      <h1>Dashboard</h1>
      <main>
        <section>
          <h2>Display RNS</h2>
        </section>
        <section>
          <h2>Publish Format</h2>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">


</script>

<style lang="scss">
  main {
    display: flex;
    flex-flow: row;
  }
  aside {
    width: 200px;
  }

  .bytemd {
    //margin: 0.5em;
    height: calc(100vh - 200px);
    width: calc(100vw - 200px - 4rem);
  }
</style>
