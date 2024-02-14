<template>
  <div class="template-container">
    <div class="main-container">
      <main>
        <section>
          <div>
            <span v-if="!worx.length" class="loader"></span>
            <div v-else>
              <h1>{{ address }}'s Worx</h1>
              <ul class="work-list">
                <li class="work-item" v-for="item in worx">
                  <router-link :to="`/` + address + `/` + item">
                    <div class="work-body">
                      <h2>{{ item }}</h2>
                    </div>
                  </router-link>
                </li>
              </ul>
            </div>
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
  import { onMounted, Ref, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { bStore } from '@/store/main.ts'

  const peoples = ref<HTMLElement | null>(null)
  const route = useRoute()

  const worx:Ref<string[]> = ref([])

  const address = route.params.user

  async function requestData(owner: string): Promise<any> {
    const url = `https://jackal.link/p/${owner}/beacon/worx`
    return fetch(url)
      .then(resp => resp.json())
      .catch(err => {
        throw err
      })
  }

  async function updateWorx(owner: string) {
    console.log(owner)
    const data = await requestData(owner).catch(alert)
    console.log(data)
    for (const k in data) {
      worx.value.unshift(k)
    }
  }

  onMounted(async () => {
    console.log(route.params)
    if (route.params.user?.length) {
      await updateWorx(route.params.user as string)
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


  .work-list {
    list-style: none;
    padding-left: 0px;
    margin: 0px;
    display: flex;
    flex-direction: column;
    max-width: 30vw;
    margin: 0px auto;
  }

  .work-item {
    width: 100%;
  }

  .work-body {
    min-height: 200px;
    color: black;

    margin-top: 20px;

    border-left: lightcoral solid 8px;
    border-bottom: black solid 4px;
    border-top: black solid 1px;
    border-right: black solid 1px;

  }

  .work-body:hover {
    background-color: #f0f0f0;
    border-bottom: black solid 8px;
  }



</style>
