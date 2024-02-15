<template>
  <div class="template-container">
    <div class="main-container" id="settings-container">
      <h1>Dashboard</h1>
      <main>
        <section v-if="myRns">
          <h2>Display RNS</h2>
          <select>
            <option v-for="item in Object.keys(myRns)" :key="item">{{ item }}</option>
          </select>
        </section>
        <section>
          <h2>Publish Format</h2>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { bStore } from '@/store/main.ts'

const myRns = bStore.getOwnedRns()

</script>

<style lang="scss">

  #settings-container {
    padding-top: 40px;
  }
</style>
