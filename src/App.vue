<template>
  <NavBar />
   <span id="jackal-logo">Made by Jackal Labs</span>
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


#jackal-logo {
  text-align: left;
  position: fixed;
  left: 12px;
  bottom: 4px;
}


</style>
