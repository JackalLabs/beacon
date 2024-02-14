<template>
  <div class="template-container">
    <div class="connect-buttons">
      <button @click="connectWallet" :disabled="walletInit">{{ walletInit ? "Connected" : "Connect Wallet" }}</button>
      <button>Get Jackal</button>
    </div>
    <div class="main-container" v-if="walletInit">
      <h1>Dashboard</h1>
      <main>
        <section>
          <CKE id="editor" :editor="CustomCKEditor" v-model="editorData" :config="{}" />
        </section>
        <aside>
<!--          // folders-->
          <DraftDocuments :content="editorData"/>
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
  const editorData = ref('<p>Content of the editor.</p>')

  const walletInit = ref(false)

  async function connectWallet() {
    await bStore.initWallet("keplr").catch(alert)
    walletInit.value = bStore.isWalletInit()
  }

</script>

<style lang="scss">
  main {
    display: grid;
    grid-template-columns: auto 200px;
    grid-template-rows: 1fr;
    padding: 0rem 4rem;
  }

  .template-container {
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
  .ck-editor__editable {
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
    gap: 20px;
    flex-direction: row;
    justify-content: flex-end;
    margin: 10px 10px 0px 0px;
  }

</style>
