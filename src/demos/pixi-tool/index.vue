<template>
  <canvas ref="originCanvasRef" class="pixi-main" width="256" height="256"></canvas>
  <canvas ref="targetCanvasRef" class="pixi-main" width="256" height="256"></canvas>
</template>
<style lang="scss" scoped>
.pixi-main {
  width: 256px;
  height: 256px;
}
</style>
<script setup>
import { onMounted, ref } from "vue";
import XiuxianPng from './imgs/xiuxian.png'
const originCanvasRef = ref(null)
const targetCanvasRef = ref(null)
let originCtx
let targetCtx
const initCtx = () => {
  originCtx = originCanvasRef.value.getContext('2d');
  targetCtx = targetCanvasRef.value.getContext('2d')
  targetCtx.imageSmoothingEnabled = false;
  targetCtx.mozImageSmoothingEnabled = false;
  targetCtx.webkitImageSmoothingEnabled = false;
  targetCtx.msImageSmoothingEnabled = false;
}
const drawImage = () => {
  return new Promise((resolve) => {
    let img = new window.Image();
    img.src = XiuxianPng;
    img.onload = () => {
      originCtx.drawImage(img, 0, 0)
      resolve()
    }  
  })
}
const getPixel = () => {
  return originCtx.getImageData(0, 0, 256, 256);
}

const getAVG = (arr) => {
  let _r = 0, _g =0, _b =0;
  arr.forEach((t) => {
    _r += t.r;
    _g += t.g;
    _b += t.b;
  })
  return {
    r: Math.floor(_r/arr.length),
    g: Math.floor(_g/arr.length),
    b: Math.floor(_b/arr.length),
    a: 255
  }
}

// 把256*256 的图切成 64*64 块，也就是每 4*4像素到一起计算
const handlePixelData = (imageData) => {
    let originData = imageData.data;
    let data_64_64 = Array(64*64);
    for (var i = 0; i < originData.length; i += 4) {
      const color = {
        r: originData[i],
        g: originData[i+1],
        b: originData[i+2],
        a: originData[i+3]
      }
      const x = Math.floor(i/(4*4))%64;
      const y = Math.floor(i/(256*4*4))
      const index = x + 64*y
      const arr = data_64_64[index] ?? []
      arr.push(color)
      data_64_64[index] = arr;
    }
    const avg_64_64 = data_64_64.map(getAVG)
    const data = new Uint8ClampedArray(256*256*4);
    avg_64_64.forEach((t, i)=> {
      const row = Math.floor(i/64)
      const col = i%64;
      const beginColIndex = col * 4 * 4
      const beginRowIndex = row * 4;
      console.log(row, col);
      [...Array(4)].forEach((_, x) => {
        [...Array(4)].forEach((__, y) => {
          const index = (beginRowIndex + y) * 64 * 4 * 4 + beginColIndex + x*4
          data[index+0]= t.r;
          data[index+1]= t.g;
          data[index+2]= t.b;
          data[index+3]= t.a;          
        })
      })
    })
    return data; 
}
onMounted(async () => {
  initCtx()
  await drawImage()
  const pixel = getPixel()
  const handledData = handlePixelData(pixel)
  const imageData = new ImageData(handledData, 256)
  console.log("🔨🔪@zsc:: ~ file: index.vue ~ line 97 ~ onMounted ~ imageData", imageData)
  targetCtx.putImageData(imageData, 0, 0);
})
</script>