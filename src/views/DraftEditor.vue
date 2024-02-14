<template>
  <div id="editor-temp" class="template-container">
    <div class="connect-buttons">
      <button @click="connectWallet"  v-if=!walletInit>Connect Wallet</button>
      <router-link v-else :to="`/` + address">
        <button >My Profile</button>
      </router-link>
      <a href="https://app.osmosis.zone/?to=JKL&from=OSMO" target="_blank">
        <button>Get Jackal</button>
      </a>


    </div>
    <div class="main-container" >
      <h1>Beacon Editor</h1>
      <main id="editor-main" v-if="walletInit">
        <section>
          <CKE id="editor" :editor="CustomCKEditor" v-model="editorData" :config="{mediaEmbed: {previewsInData: true}}" />
        </section>
        <aside>
          <DraftDocuments :content="editorData" :setter="setEditorText"/>
        </aside>
      </main>
      <main v-else>
        <section>
          <div class="editor-placeholder"></div>
        </section>
        <aside>
          <div class="folder-placeholder"></div>
        </aside>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { bStore } from '@/store/main.ts'
  import CustomCKEditor from '@jackallabs/ck5-custom'
  import CKEditor from '@ckeditor/ckeditor5-vue'
  import DraftDocuments from '@/components/DraftDocuments.vue'
  import { ref } from 'vue'

  const CKE = CKEditor.component
  const editorData = ref('')
  const address = ref(bStore.getJackalAddress())

  const walletInit = ref(bStore.isWalletInit())
  const setEditorText = function(s:string) {
    editorData.value = s
  }

  async function connectWallet() {
    if (bStore.isWalletInit()) {
      walletInit.value = bStore.isWalletInit()
      address.value = bStore.getJackalAddress()
      return
    }

    await bStore.initWallet("keplr").catch(alert)
    walletInit.value = bStore.isWalletInit()
    address.value = bStore.getJackalAddress()
  }

</script>

<style lang="scss">
  #editor-main {
    display: grid;
    grid-template-columns: auto 200px;
    grid-template-rows: 1fr;
    padding: 0rem 4rem;
  }

  #editor-temp {
    display: flex;
    flex-direction: column;
    //height: 100%;
    flex-grow: 1;
    flex-basis: auto;
  }

  .main-container {
    height: 100%;
    min-width: 70vw;
    margin: 0px auto;
    flex-grow: 1;
    flex-basis: auto;

  }

  aside {
    width: 200px;
    min-height: 200px;
  }

  .bytemd {
    //margin: 0.5em;
    height: calc(100vh - 200px);
    width: calc(100vw - 200px - 4rem);
  }

  .ck-powered-by, .ck-powered-by-balloon {
    display: none !important;
  }
  .ck-editor__editable, .editor-placeholder {
    min-height: 65vh;
    max-height: 500px;
    overflow-y: scroll;
    box-sizing: border-box;
  }

  #editor {
    border-style: solid;
    border-color: gray;
  }

  .connect-buttons {
    display: flex;
    gap: 10px;
    flex-direction: row;
    justify-content: flex-end;
    margin: 10px 10px 0px 0px;
  }


  .editor-placeholder {
    border-radius: 8px;
    filter: blur(8px);
    background-color: #dddddd;
  }

  .folder-placeholder {
   border-radius: 8px;
    filter: blur(8px);
    width: 100%;
    height: 100%;
    background-color: #dddddd
  }

</style>
