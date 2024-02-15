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
      <main v-else id="home-main">
        <section id="article-section">
          <div class=" ck-content" id="article" ref="shell">
            <span class="loader"></span>
          </div>
        </section>
        <section id="article-section2">
          <object :data="test" />
        </section>
        <!--        <aside>-->
        <!--&lt;!&ndash;          // people here &ndash;&gt;-->
        <!--          <div ref="peoples" />-->
        <!--        </aside>-->
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const shell = ref<HTMLElement | null>(null)
  const router = useRouter()
  const route = useRoute()

  const profile = ref('')
  const test = ref('')

  function requestData (owner: string, fileName: string): Promise<string> {
    const url = `https://jackal.link/p/${owner}/beacon/published/${fileName}.html`
    return fetch(url)
      .then(resp => resp.text())
      .catch(err => {
        throw err
      })
  }

  function visitProfile () {
    router.push(`/${profile.value}`)
  }

  onMounted(async () => {
    console.log(route.params)
    if (shell.value && route.params.user?.length && route.params.slug?.length) {
      profile.value = route.params.user as string
      const data = await requestData(profile.value, route.params.slug[0]) || ''
      shell.value.innerHTML = data

      const userWrapper = document.createElement('div')
      const userSpan = document.createElement('span')
      userSpan.innerText = 'Written by: '
      userWrapper.appendChild(userSpan)
      userWrapper.id = 'user-wrapper'

      const userBtn = document.createElement('button')
      userBtn.classList.add('undo-button')
      userBtn.title = profile.value
      userBtn.innerHTML = profile.value
      userBtn.onclick = visitProfile

      userWrapper.appendChild(userBtn)
      shell.value.getElementsByTagName('h1')[0].after(userWrapper)

      const tmp = new File([data], route.params.slug[0])
      test.value = URL.createObjectURL(tmp)
    }
  })

</script>

<style lang="scss">
  #home-main {
    padding: 0rem 4rem;
    height: 100%;
  }

  .main-container {
    height: 100%;
    flex-grow: 1;
    margin-top: 0px;
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
    background: var(--beacon-color);
  }

  button {
    background-color: lightblue;
  }


  #article-section {
    width: 90%;
    margin: 0px auto;
    border-left: gray solid 1px;
    border-right: gray solid 1px;
    padding: 0px 60px;
    height: 100%;
    background-color: #fff;
    overflow-y: scroll;
  }

  @media screen and (min-width: 800px) {
    #article-section {
      width: 70%;
    }
  }


  #article {
    text-align: left;
    padding-top: 40px;
    padding-bottom: 20px;

    img {
      width: 100% !important;
      height: auto !important;
    }

    h1 {
      margin-top: 0px;
    }
  }

  #article-section2 {
    display: none;
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

  .undo-button {
    background: none !important;
    border: none;
    padding: 0 !important;
  }

  #user-wrapper {
    border-bottom: black solid 1px;
    padding-bottom: 20px;
  }
</style>
