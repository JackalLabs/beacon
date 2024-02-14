<template>
  <div class="template-container">
    <div>
      <button>Connect Wallet</button>
      <button>Get Jackal</button>
    </div>
    <div class="main-container">
      <h1>Dashboard</h1>
      <main>
        <section>
          <CKE id="editor" :editor="CustomCKEditor" v-model="editorData" :config="{}" />
        </section>
        <aside>
<!--          // folders-->
          <DraftDocuments />
        </aside>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CustomCKEditor from '@jackallabs/ck5-custom'
  import CKEditor from '@ckeditor/ckeditor5-vue'
  import DraftDocuments from '@/components/DraftDocuments.vue'

  const CKE = CKEditor.component
  const editorData = '<p>Content of the editor.</p>'

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
    background-color: blue;
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
  }

  #editor {
    border-style: solid;
    border-color: gray;
  }

</style>
