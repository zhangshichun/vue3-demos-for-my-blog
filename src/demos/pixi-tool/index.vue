<template>
<!-- 请一定看下面的注释，重要重要重要！ -->
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
/** 
 * 你好，年轻的勇士。
 * 如果你正在尝试跑这段代码，我必须提醒你:
 * 1. 因为我太菜，所以目前我只测试了 256*256 像素的图片
 * 2. unitPx 目前只支持 2、4、8、16... 这种2的倍数，一旦不是倍数就会发生bug.....
 */
import Test from './test.vue'
import xiuxianImg from './imgs/xiuxian.png'
import catImg from './imgs/cat.png'
import heartImg from './imgs/heart.jpg'
</script>