<template>
  <div>
    <test :path="xiuxianImg" :colorCount="6" :unitPx="4"></test>
  </div>
  <div>
    <test :path="catImg" :colorCount="18" :unitPx="4"></test>
  </div>
    <div>
    <test :path="heartImg" :colorCount="4" :unitPx="8"></test>
  </div>
</template>
<script setup>
import Test from './test.vue'
import xiuxianImg from './imgs/xiuxian.png'
import catImg from './imgs/cat.png'
import heartImg from './imgs/heart.jpg'
</script>