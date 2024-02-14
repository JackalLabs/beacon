<template>
  <div class="background-blocker" v-if="shouldDraftName || shouldPubName" @click.self="cancel">
    <div id="name-modal" class="modal" v-if="shouldDraftName">
      <h2>Save Draft</h2>
      <div id="draft-name"><label>
        Draft Name:
        <input type="text" required v-model="saveDraftFileName"/>
      </label></div>
      <div id="draft-buttons">
        <button id="btn-save" @click="saveDraft">Save</button>
        <button id="btn-cancel" @click="cancel">Cancel</button>
      </div>
    </div>
    <div id="name-modal" class="modal" v-if="shouldPubName">
      <h2>Publish Document</h2>
      <div id="draft-name"><label>
        Published Name:
        <input type="text" required v-model="saveDraftFileName"/>
      </label></div>
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
  <h2>Drafts</h2>
  <div class="action-buttons">
    <button class="add-button" @click="openSaveDraft">+</button>
    <button class="public-button" @click="openPubDraft">P</button>
  </div>
  <ul class="files">
    <li v-for="item in files">
      <div class="file-card" @click="loadFile(item)">
        <h3>{{ item }}</h3>
      </div>
    </li>
  </ul>
</div>
</template>

<script setup lang="ts">
  import { bStore } from '@/store/main.ts'

  import { ref, onMounted, Ref } from 'vue'
  import { FolderHandler } from '@jackallabs/jackal.js'
  const shouldDraftName = ref(false)
  const shouldPubName = ref(false)

  const loading = ref(false)
  const saveDraftFileName = ref("")

  const props = defineProps(['content', 'setter'])

  const files:Ref<string[]> = ref([])

  function cancel() {
    shouldDraftName.value = false;
    shouldPubName.value = false;
  }

  function openSaveDraft() {
    shouldDraftName.value = true;
  }
  function openPubDraft() {
    shouldPubName.value = true;
  }

  function refreshDrafts() {
    bStore.getDraftsFolder().then((folder:FolderHandler) => {
      const children = folder.getChildFiles()
      files.value = Object.keys(children)
    }).catch((e) => {
      alert(e)
    })
  }

  onMounted(() => {
    refreshDrafts()
  })

  async function saveDraft() {
    loading.value = true
    await bStore.saveDraft(saveDraftFileName.value, props.content).catch(alert)
    cancel()
    refreshDrafts()
    loading.value = false
  }

  async function publishFile() {
    loading.value = true
    await bStore.publishFinal(saveDraftFileName.value, props.content).catch(alert)
    cancel()
    refreshDrafts()
    loading.value = false
  }

  async function loadFile(filename:string) {
    loading.value = true
    const s = await bStore.loadDraft(filename).catch(alert)
    props.setter(s)
    loading.value = false
  }



</script>

<style lang="scss">


  ul {
    list-style: none;
    padding: 12px 0px 0px 0px;
    margin: 0px;
  }

  li {
    margin: 0px auto 10px auto;
    max-width: 84%;
  }

  h2, h3 {
    margin: 0px;
  }

  .file-card {
    border-radius: 4px 4px 0px 4px;
    align-items: flex-start;
    flex-direction: column;
    display: flex;
    padding: 4px 10px 4px 10px;
    cursor: pointer;
    border-left: lightcoral solid 4px;
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
  }

  .draft-docs {
    height: 100%;
    max-height: 500px;
    min-height: 65vh;
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
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 100;
  }

  .modal {
    background-color: #eeeeee;
    width: 40vw;
    max-width: 432px;
    height: 20vh;
    position: absolute;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;

    border-radius: 8px;
    border-style: solid;
    border-color: #888888;
    border-width: 6px;
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

</style>
