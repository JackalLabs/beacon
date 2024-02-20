<template>
  <NavBar />
  <span id="jackal-logo"><img id="beacon-logo-footer" width="14" height="14" src="/icon.svg" />Made by Jackal Labs</span>
  <router-view />
</template>

<script setup lang="ts">
  import NavBar from '@/components/NavBar.vue'

  import { onMounted } from 'vue'
  import { bStore } from '@/store/main.ts'

  onMounted(() => {
    bStore.isWalletInit()
  })

</script>

<style lang="scss">
  @import '@/assets/css/style.css';
  @import '@/assets/css/ck.css';


  #jackal-logo {
    text-align: left;
    position: fixed;
    left: 12px;
    bottom: 4px;
  }

  #beacon-logo-footer {
    margin-right: 8px;
  }


</style>
