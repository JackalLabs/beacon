<template>
  <div class="template-container">
    <div class="main-container">
      <h1>Dashboard</h1>
      <main>
        <section>
          <div ref="shell" />
        </section>
        <aside>
<!--          // people here -->
          <div ref="peoples" />
        </aside>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const shell = ref<HTMLElement | null>(null)
  const peoples = ref<HTMLElement | null>(null)
  const route = useRoute()

  function requestData(owner: string, fileName: string): Promise<string> {
    const url = `https://jackal.link/p/${owner}/newsboy/published/${fileName}`
    return fetch(url)
      .then(resp => resp.text())
      .catch(err => {
      throw err
    })
  }

  onMounted(async () => {
    if (shell.value && route.params.user?.length && route.params.stub?.length) {
      shell.value.innerHTML = await requestData(route.params.user[0], route.params.stub[0])
    }
  })

</script>

<style lang="scss">
  main {
    display: grid;
    grid-template-columns: auto 300px;
    grid-template-rows: 1fr;
    padding: 0rem 4rem;
  }
</style>
