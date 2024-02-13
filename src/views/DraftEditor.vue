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
<!--          <Editor :value="content" :plugins="plugins" @change="handleChange" />-->
          <cke id="editor" :editor="InlineEditor" v-model="editorData" :config="editorConfig" />
        </section>
        <aside>
<!--          // folders-->
<!--          <button type="button" @click="logContents">logContents</button>-->
          <DraftDocuments />
        </aside>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  // import { computed, ref } from 'vue'
  // import type { Ref } from 'vue'

  import InlineEditor from '@ckeditor/ckeditor5-build-inline'
  import CKEditor from '@ckeditor/ckeditor5-vue'

  const cke = CKEditor.component
  const editorData = '<p>Content of the editor.</p>'
  const editorConfig = {
    // The configuration of the editor.
  }
  // <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>

  import DraftDocuments from '@/components/DraftDocuments.vue'
  // import { bStore } from '@/store/main.ts'

  // const content: Ref<string> = ref('')

  // const rdy = computed(() => bStore.isFileIoInit())

  // const handleChange = (v: string) => {
  //   content.value = v
  // }

  // const logContents = () => {
  //   console.log(content.value)
  // }

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
