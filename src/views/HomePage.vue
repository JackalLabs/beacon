<template>
  <div class="template-container">
    <div class="main-container">
      <div class="hero" v-if="!route.params.user?.length">
        <div class="hero-info">
          <h1 id="hero-header">Beacon</h1>
          <span id="hero-text">Beacon is a fully decentralized publishing platform for writers, creators and anyone with something to say.</span>
            <router-link id="cta-button" :to="'/editor'">
              <button>Start Publishing</button>
            </router-link>
        </div>
          <div id="hero-art"></div>
      </div>
      <main v-else>
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

  function requestData(owner: string, fileName: string): Promise<string> {
    const url = `https://jackal.link/p/${owner}/beacon/published/${fileName}.html`
    return fetch(url)
      .then(resp => resp.text())
      .catch(err => {
      throw err
    })
  }

  onMounted(async () => {
    console.log(route.params)
    if (shell.value && route.params.user?.length && route.params.slug?.length) {
      shell.value.innerHTML = await requestData(route.params.user as string, route.params.slug[0]) || ''
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

  #hero-art {
    width: 100%;
    height: 100%;
    background: lightcoral;
  }

  button {
    background-color: lightblue;
  }


  .hero {
    height: 80vh;
    //background-color: lightgray;
    padding-top: 10vh;

    width: 70vw;
    margin: 0px auto;

    display: flex;
    flex-direction: row;
  }

  .hero-info {
    display: flex;
    flex-direction: column;
    height: 100%;


    text-align: left;

    #cta-button {
      margin-top: 20px;
    }
    h1 {
      margin-top: 0px;
    }


  }
</style>
