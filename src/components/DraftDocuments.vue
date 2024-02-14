<template>
  <div class="background-blocker" v-if="shouldName" @click.self="cancel">
    <div id="name-modal" class="modal">
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
  </div>

<div class="draft-docs">
  <h2>Drafts</h2>
  <h3 class="add-button" @click="openSaveDraft">+</h3>
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
  const shouldName = ref(false)
  const saveDraftFileName = ref("")

  const props = defineProps(['content'])

  const files:Ref<string[]> = ref([])

  function cancel() {
    shouldName.value = false;
  }

  function openSaveDraft() {
    shouldName.value = true;
  }


  onMounted(() => {
    bStore.getDraftsFolder().then((folder:FolderHandler) => {

      console.dir(folder)

      const children = folder.getChildFiles()
      files.value = Object.keys(children)
    }).catch((e) => {
      alert(e)
    })
  })

  async function saveDraft() {
    console.log("saving!")
    console.log(props.content)

    await bStore.saveDraft(saveDraftFileName.value, props.content).catch(alert)

    cancel()
  }

  function loadFile(filename:string) {
    console.log(filename)
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
    background-color: lightgray;
    border-radius: 8px;
    align-items: flex-start;
    flex-direction: column;
    display: flex;
    padding: 4px 10px 4px 10px;
    cursor: pointer;
  }
  .file-card:hover > * {
    text-decoration: underline;
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

  .add-button {
    text-align: center;
    width: 100%;
    padding: 4px 0px 4px 0px;
    cursor: pointer;

    border-bottom: #888888 solid;
  }

  .add-button:hover {
    text-decoration: underline;
  }

  .background-blocker {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.5);
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

  button {
    background-color: lightblue;
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

</style>
