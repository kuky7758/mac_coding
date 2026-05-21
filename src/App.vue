<template>
  <div class="container">
    <div class="header">
      <h1>轻语</h1>
      <p>写下一句话，记录当下</p>
    </div>
    <PostForm />
    <PostList />
  </div>
</template>

<script setup>
import PostForm from './components/PostForm.vue'
import PostList from './components/PostList.vue'
</script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #2e7d32;
  letter-spacing: 2px;
}

.header p {
  font-size: 14px;
  color: #66bb6a;
  margin-top: 4px;
}
</style>
