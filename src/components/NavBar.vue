<template>
  <nav>
    <ul>
      <li v-for="(item, index) in navItems" :key="index">
        <router-link :to="item.path">
          <span class="text">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
    <div class="version">
      <span>alpha: v0.2.42</span>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { navItems } from '@/config/nav.ts'
</script>

<style lang="scss" scoped>
  nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    background-color: #333;
    color: white;
  }
  .version {
    width: 115px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  li {
    float: left;
  }


  li a {
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }

  /* Change the link color to #111 (black) on hover */
  li a:hover {
    background-color: #111;
  }
</style>
