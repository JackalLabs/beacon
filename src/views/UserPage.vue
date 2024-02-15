<template>
  <div class="template-container">
    <div class="main-container">
      <main id="user-main">
<!--        <section>-->
          <div>
            <span v-if="!worx.length" class="loader"></span>
            <div v-else>
              <h1 id="work-title">{{ address.length > 20 ? address.toString().substring(0, 10) + "..." + address.toString().substring(10, 20) : convertToTitleCase(address.toString()) }}'s Beams</h1>
              <ul class="work-list">
                <li class="work-item" v-for="item in worx">
                  <router-link :to="`/` + address + `/` + item.name">
                    <div class="work-body">
                      <span>{{ item.date }}</span>
                      <h2>{{ item.name }}</h2>
                    </div>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, Ref, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { bStore } from '@/store/main.ts'

  // const peoples = ref<HTMLElement | null>(null)
  const route = useRoute()

  const worx:Ref<any[]> = ref([])

  const address = route.params.user

  function convertToTitleCase(str:string) {
    if (!str) {
      return ""
    }
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
  }

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
    for ( const k in data) {
      const d = data[k]

      const date = new Date(d)
      const options:any = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

      const s = date.toLocaleDateString('en-us', options)

      worx.value.unshift({name: k, date: s})
    }
    console.log(worx.value)

  }

  onMounted(async () => {
    console.log(route.params)
    if (route.params.user?.length) {
      await updateWorx(route.params.user as string)
    }
  })

</script>

<style lang="scss">
  #user-main {
    padding: 40px 4rem 0rem;
    height: 100%;
    display: flex;
    flex-direction: column;
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
    padding-bottom: 40px;
  }

  .work-item {
    width: 100%;
  }

  .work-body {
    //min-height: 200px;
    color: black;

    margin-top: 20px;

    border-left: lightcoral solid 8px;
    border-bottom: black solid 4px;
    border-top: black solid 1px;
    border-right: black solid 1px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    span {
      padding: 20px 10px 0px 20px;
    }

    h2 {
      margin-top: 0px;
      padding: 0px 0px 10px 20px;
    }
  }

  .work-body:hover {
    background-color: #f0f0f0;
    border-bottom: black solid 8px;
  }



</style>
