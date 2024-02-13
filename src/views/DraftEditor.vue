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
          <cke :editor="ClassicEditor" v-model="editorData" :config="editorConfig" />
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

  import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
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
    display: flex;
    flex-flow: row;
  }
  aside {
    width: 200px;
  }

  .bytemd {
    //margin: 0.5em;
    height: calc(100vh - 200px);
    width: calc(100vw - 200px - 4rem);
  }
</style>
