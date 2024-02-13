<template>
  <div class="template-container">
    <div class="main-container">
      <h1>Dashboard</h1>
      <main>
        <section>
          <Editor :value="content" :plugins="plugins" @change="handleChange" />
        </section>
        <aside>
<!--          // folders-->
          <button type="button" @click="logContents">logContents</button>
          <DraftDocuments />
        </aside>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { Ref } from 'vue'

  import 'bytemd/dist/index.css'
  import { Editor } from '@bytemd/vue-next'
  import gfm from '@bytemd/plugin-gfm'

  import DraftDocuments from '@/components/DraftDocuments.vue'

  const plugins: any[] = [gfm()]
  const content: Ref<string> = ref('')

  const handleChange = (v: string) => {
    content.value = v
  }

  const logContents = () => {
    console.log(content.value)
  }

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
