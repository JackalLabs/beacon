<template>
  <div class="background-blocker" v-if="shouldDraftName || shouldPubName || error.length" @click.self="cancel">
    <div id="name-modal" class="modal" v-if="shouldDraftName">
      <h2>Save Draft</h2>
      <div id="draft-name"><label>
        Draft Name:
        <input type="text" required v-model="saveDraftFileName" />
      </label></div>
      <span class="cost">Cost to save: <span class="colorful">{{ cost.toFixed(3) }} JKL</span></span>
      <span class="error colorful" v-if="balance < cost">You don't have enough JKL to save</span>
      <div id="draft-buttons">
        <button id="btn-save" @click="saveDraft" :disabled="balance < cost">Save</button>
        <button id="btn-cancel" @click="cancel">Cancel</button>
      </div>
    </div>
    <div id="error-modal" class="modal" v-if="error.length">
      <h2>Upload Error</h2>
      <span class="cost">This file failed to save, please try again.</span>
      <div id="draft-buttons">
        <button id="btn-cancel" @click="cancel">Okay</button>
      </div>
    </div>
    <div id="publish-modal" class="modal" v-if="shouldPubName">
      <h2>Publish Document</h2>
      <div id="draft-name"><label>
        Published Name:
        <input type="text" required v-model="saveDraftFileName" />
      </label></div>
      <span class="cost">Cost to publish: <span class="colorful">{{ cost.toFixed(3) }}jkl</span></span>
      <div id="draft-buttons">
        <button id="btn-save" @click="publishFile">Save</button>
        <button id="btn-cancel" @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
  <div id="loading" v-if="loading">
    Loading...
  </div>

  <div class="draft-docs">
    <h2>My Drafts</h2>
    <div class="action-buttons">
      <button class="add-button" @click="openSaveDraft">Save</button>
      <button class="public-button" @click="openPubDraft">Pub.</button>
    </div>
    <ul class="files">
      <li class="draft-item" v-for="item in files">
        <div class="file-card" @click="loadFile(item)">
          <h3>{{ item }}</h3>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { bStore } from '@/store/main.ts'

  import { ref, onMounted, Ref, computed } from 'vue'

  const shouldDraftName = ref(false)
  const shouldPubName = ref(false)

  const loading = ref(false)
  const saveDraftFileName = ref('')

  const props = defineProps(['content', 'setter'])

  const files: Ref<string[]> = ref([])

  const cost = ref(0)

  const error = ref('')

  const balance = computed(() => {
    return bStore.getJackalBalance()
  })

  async function updatePrice () {

    const count = props.content.toString().length
    const m = await bStore.getPrice(count)
    cost.value = m / 1000000;

    await bStore.updateJackalBalance()
  }

  function cancel () {
    shouldDraftName.value = false
    shouldPubName.value = false
    error.value = ''
  }

  function openSaveDraft () {
    shouldDraftName.value = true
    updatePrice()
  }

  function openPubDraft () {
    shouldPubName.value = true
    updatePrice()
  }

  function refreshDrafts () {
    const folder = bStore.getDraftsFolder()
    files.value = Object.keys(folder.getChildFiles())
  }

  onMounted(() => {
    refreshDrafts()
  })

  function fail(err:string) {
    cancel()
    error.value = err
  }

  async function saveDraft () {
    if (saveDraftFileName.value.length == 0) {
      alert('must enter name')
      return
    }
    loading.value = true
    await bStore.saveDraft(saveDraftFileName.value, props.content).catch(fail)
    cancel()
    refreshDrafts()
    loading.value = false
  }

  async function publishFile () {
    if (saveDraftFileName.value.length == 0) {
      alert('must enter name')
      return
    }
    loading.value = true
    await bStore.publishFinal(saveDraftFileName.value, props.content).catch(fail)
    cancel()
    refreshDrafts()
    loading.value = false
  }

  async function loadFile (filename: string) {
    loading.value = true
    const s = await bStore.loadDraft(filename).catch(alert)
    props.setter(s)
    loading.value = false
  }


</script>

<style lang="scss">


  .draft-item {
    margin: 0px auto 10px auto;
    max-width: 84%;
  }

  h2, h3 {
    margin: 0px;
  }

  .file-card {
    //border-radius: 4px 4px 0px 4px;
    align-items: flex-start;
    flex-direction: column;
    display: flex;
    padding: 4px 10px 4px 10px;
    cursor: pointer;
    border-left: var(--beacon-color) solid 4px;
    border-bottom: black solid 1px;
    box-sizing: border-box;
  }

  button {
    background-color: lightblue;
  }

  .file-card:hover {
    background-color: #f0f0f0;
    border-bottom: black solid 3px;
  }

  .files {
    flex-grow: 1;
    flex-basis: auto;
    overflow-y: scroll;
    list-style: none;
    padding: 12px 0px 0px 0px;
    margin: 0px;
  }

  .draft-docs {
    height: 100%;
    max-height: 500px;
    min-height: 75vh;
    display: flex;
    flex-direction: column;
    padding-top: 8px;
    border-style: solid;
    border-width: 1px;
    border-color: #888888;
    box-sizing: border-box;
    border-left: none;
  }

  .action-buttons > * {
    cursor: pointer;
  }

  .action-buttons {
    width: 100%;
    padding: 4px 0px 4px 0px;
    border-bottom: #888888 solid;

    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;

  }

  .background-blocker {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 100;
  }


  .error {
    margin-top: 10px;
  }

  .modal {
    background-color: #fafafa;
    width: 40vw;
    max-width: 432px;
    height: 20vh;
    min-height: 260px;
    position: absolute;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;


    border-bottom: black solid 4px;
    border-left: var(--beacon-color) solid 16px;
    border-top: black solid 1px;
    border-right: black solid 1px;
    a:hover {
      text-decoration: underline;
    }

  }


  #draft-buttons {
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    column-gap: 10px;
  }

  #draft-name {
    margin-top: 10px;
  }

  #loading {
    position: absolute;
    right: 10px;
    bottom: 10px;
    font-size: 2rem;
  }

  .cost {
    margin-top: 10px;
  }

  .colorful {
    color: var(--beacon-color);
    font-weight: bold;
  }

  .colorful:hover {
    color: var(--beacon-color);
  }



</style>
