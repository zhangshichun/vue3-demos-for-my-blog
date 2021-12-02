<template>
<div>
  <template v-if="canvasHeight && canvasWidth">
    <canvas ref="originCanvasRef" class="pixi-main" :width="canvasWidth" :height="canvasHeight"></canvas>
    <canvas ref="avgCanvasRef" class="pixi-main" :width="canvasWidth" :height="canvasHeight"></canvas>
    <canvas ref="bossCanvasRef" class="pixi-main" :width="canvasWidth" :height="canvasHeight"></canvas>
    <canvas ref="lessAvgColorCanvasRef" class="pixi-main" :width="canvasWidth" :height="canvasHeight"></canvas>
    <canvas ref="lessColorCanvasRef" class="pixi-main" :width="canvasWidth" :height="canvasHeight"></canvas>
    <canvas ref="lessImportantColorCanvasRef" class="pixi-main" :width="canvasWidth" :height="canvasHeight"></canvas>

  </template>
</div>


</template>
<style lang="scss" scoped>
.pixi-main {
  width: 256px;
  height: 256px;
  border: 2px solid black;
}
</style>
<script setup>
import { onMounted, ref, defineProps, nextTick } from "vue";
import PickerUniform from './helper/PickerUniform'
const canvasWidth = ref(null)
const canvasHeight = ref(null)
const props = defineProps({
  path: String,
  colorCount: Number,
  unitPx: {
    type: Number,
    default: 4
  }
})
const originCanvasRef = ref(null)
const avgCanvasRef = ref(null)
const bossCanvasRef = ref(null)
const lessColorCanvasRef = ref(null)
const lessImportantColorCanvasRef = ref(null)
const lessAvgColorCanvasRef = ref(null)
let originCtx
let targetCtx
let bossCtx
let lessColorCtx
let lessImportantColorCtx
let lessAvgColorCtx
const initCtx = (el) => {
  const ctx = el.getContext('2d')
  ctx.imageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  return ctx;
}

const initCtxs = () => {
  return new Promise((resolve) => {
    if (!(originCanvasRef.value&&avgCanvasRef.value&&bossCanvasRef.value&&lessColorCanvasRef.value&&lessImportantColorCanvasRef.value)) {
      setTimeout(() => {
        resolve(initCtxs())
      }, 100)
      return;
    }
    originCtx = initCtx(originCanvasRef.value);
    targetCtx = initCtx(avgCanvasRef.value);
    bossCtx = initCtx(bossCanvasRef.value);
    lessColorCtx = initCtx(lessColorCanvasRef.value)
    lessImportantColorCtx = initCtx(lessImportantColorCanvasRef.value)  
    lessAvgColorCtx = initCtx(lessAvgColorCanvasRef.value)
    resolve()  
  })


}
const genImage = () => {
  return new Promise((resolve) => {
    let img = new window.Image();
    img.src = props.path;
    canvasWidth.value = img.width
    console.log("🔨🔪@zsc:: ~ file: test.vue ~ line 75 ~ returnnewPromise ~ img.width", img.width)
    canvasHeight.value = img.height  
    console.log("🔨🔪@zsc:: ~ file: test.vue ~ line 76 ~ returnnewPromise ~ img.height ", img.height )
    img.onload = () => {
      setTimeout(() => {
        resolve(img)
      }, 200)
    }  
  })
}
const getPixel = () => {
  return originCtx.getImageData(0, 0, canvasWidth.value, canvasHeight.value);
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

const getBossColor = (arr) => {
  const genId = (t) => {
    return [t.r,t.g,t.b].join()
  }
  const map = {}
  let maxColor = null
  let maxCount = 0
  arr.forEach((t) => {
    const id = genId(t)
    if (map[id] == null) {
      map[id] = 0
    }
    map[id] += 1
    if (map[id] > maxCount) {
      maxColor = t;
      maxCount = map[id]
    }
  })
  return {
    r: maxColor.r,
    g: maxColor.g,
    b: maxColor.b,
    a: 255
  }
}

let mainColors

const getLessColor = (color) => {
  let index = 0;
  let min = 9999999;
  mainColors.forEach((m, i) => {
    const _r = m.r - color.r
    const _g = m.g - color.g
    const _b = m.b - color.b;
    const DValue = _r*_r + _g * _g + _b *_b
    if (DValue < min) {
      index = i;
      min = DValue
    }
  })
  const mainColor = mainColors[index]
  return {
    ...mainColor,
    a: 255
  }
}
const getBossAndLessColor = (arr) => {
  const bossColor = getBossColor(arr)
  return getLessColor(bossColor)
}

// 不仅获取最多的颜色，而且权重是从中心向四周衰减的
const getImportantBossColor = (arr) => {
  const genId = (t) => {
    return [t.r,t.g,t.b].join()
  }
  const map = {}
  let maxColor = null
  let maxCount = 0
  arr.forEach((t, index) => {
    const col = index % props.unitPx
    const row = Math.floor(index/props.unitPx)
    const center = props.unitPx/2
    let baseNumber  = 1 + (center - col)*(center - col) + (center - row)*(center - row)
    const score = Math.ceil(props.unitPx / baseNumber) 
    const id = genId(t)
    if (map[id] == null) {
      map[id] = 0
    }
    map[id] += score
    if (map[id] > maxCount) {
      maxColor = t;
      maxCount = map[id]
    }
  })
  return {
    r: maxColor.r,
    g: maxColor.g,
    b: maxColor.b,
    a: 255
  }
}

const getBossAndImportantLessColor = (arr) => {
  const bossColor = getImportantBossColor(arr)
  return getLessColor(bossColor)
}

const getAvgLessColor = (arr) => {
  const avg = getAVG(arr)
  return getLessColor(avg)
}

// 把 ${canvasWidth} * ${canvasHeight} 的图，分成若干个单元格，每个单元格最多为 {prop.unitPx}*{prop.unitPx}
// 因此可以分成多少块？
// countOfX = Math.ceil(canvasWidth/props.unitPx)
// countOfY = Math.ceil(canvasHeight/props.unitPx)

const handlePixelData = (imageData, handler) => {
    const countOfX = Math.ceil(canvasWidth.value/props.unitPx)
    const countOfY = Math.ceil(canvasHeight.value/props.unitPx)
    let originData = imageData.data;
    let pixelArr = Array(countOfX * countOfY);
    for (var i = 0; i < originData.length; i += props.unitPx) {
      const color = {
        r: originData[i],
        g: originData[i+1],
        b: originData[i+2],
        a: originData[i+3]
      }
      
      const x = Math.floor((i % (canvasWidth.value * 4))/(4 * props.unitPx));// 貌似不整的时候不能这么算
      const y = Math.floor( i / ( 4 * canvasWidth.value * props.unitPx))
      const index = x + countOfX * y
      const arr = pixelArr[index] ?? []
      arr.push(color)
      pixelArr[index] = arr;
    }
    const handledArr = pixelArr.map(handler)
    const data = new Uint8ClampedArray(256*256*4);
    handledArr.forEach((t, i)=> {
      const row = Math.floor(i / countOfX)
      const col = i % countOfX;
      const beginColIndex = col * props.unitPx * 4
      const beginRowIndex = row * props.unitPx;
      [...Array(props.unitPx)].forEach((_, x) => {
        [...Array(props.unitPx)].forEach((__, y) => {
          const index = (beginRowIndex + y) * countOfX * props.unitPx * 4 + beginColIndex + x * 4
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
  const img = await genImage()
  await nextTick()
  await initCtxs()
  originCtx.drawImage(img, 0, 0)  
  const pixel = getPixel()
  const avgData = handlePixelData(pixel, getAVG)
  const imageAvgData = new ImageData(avgData, 256)
  targetCtx.putImageData(imageAvgData, 0, 0);
  const bossData = handlePixelData(pixel, getBossColor)
  const imageBossData = new ImageData(bossData, 256)
  bossCtx.putImageData(imageBossData, 0, 0);
  // 更少的色彩
  const UQ = new PickerUniform();
  const maxColor = props.colorCount ?? 8;
  const swatch = UQ.getSwatch(pixel, maxColor);
  mainColors = [swatch.mc, ...swatch.palette];
  const lessColorData = handlePixelData(pixel, getBossAndLessColor)
  const imageLessColorData = new ImageData(lessColorData, 256)
  lessColorCtx.putImageData(imageLessColorData, 0, 0);  

  const lessImportantColorData = handlePixelData(pixel, getBossAndImportantLessColor)
  const imageLessImportantColorData = new ImageData(lessImportantColorData, 256)
  lessImportantColorCtx.putImageData(imageLessImportantColorData, 0, 0); 
  
  const lessAvgColorData = handlePixelData(pixel, getAvgLessColor)
  const imageLessAvgColorData = new ImageData(lessAvgColorData, 256)
  lessAvgColorCtx.putImageData(imageLessAvgColorData, 0, 0); 


})
</script>