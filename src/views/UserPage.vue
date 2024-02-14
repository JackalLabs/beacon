<template>
  <div class="template-container">
    <div class="main-container">
      <main>
        <section>
          <div ref="shell" >
            <span class="loader"></span>
          </div>
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

  async function requestData(owner: string): Promise<string> {
    const url = `https://jackal.link/p/${owner}/beacon/worx`
    return fetch(url)
      .then(resp => resp.text())
      .catch(err => {
        throw err
      })
  }

  onMounted(async () => {
    console.log(route.params)
    if (shell.value && route.params.user?.length) {
      shell.value.innerHTML = await requestData(route.params.user as string) || ''
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
  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #000;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;

    position: absolute;
    top: 50vh;
    left: 50vw;
    transform: translate(-50% -50%);
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }





</style>
