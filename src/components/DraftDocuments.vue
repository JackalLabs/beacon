<template>
<div class="draft-docs">
  <h2>Drafts</h2>
  <h3 class="add-button">+</h3>
  <ul class="files">
    <li v-for="item in files">
      <div class="file-card">
        <h3>{{ item.name }}</h3>
        <span>{{ item.name }}</span>
      </div>
    </li>


  </ul>
</div>
</template>

<script setup lang="ts">

  const files = [
    {name: "test1"},
    {name: "test2"},
    {name: "test3"},
    {name: "test4"},
    {name: "test5"},
    {name: "test1"},
    {name: "test2"},
    {name: "test3"},
    {name: "test4"},
    {name: "test5"},
    {name: "test1"},
    {name: "test2"},
    {name: "test3"},
    {name: "test4"},
    {name: "test5"}
  ]

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

</style>
