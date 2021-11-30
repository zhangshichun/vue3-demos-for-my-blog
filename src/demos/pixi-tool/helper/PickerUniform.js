/**
 * Method: Uniform/One-pass Quantization
 * A Simple implementation by Echo Yang
 * ------
 * License
 * -------
 * Copyright Echo Yang
 * Released under the MIT license
 * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
 *
 * @license
 */
function _convertPixelsToRGB(pixels) {
  const width = pixels.width;
  const height = pixels.height;
  const rgbVals = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      rgbVals.push({
        r: pixels.data[index],
        g: pixels.data[index + 1],
        b: pixels.data[index + 2]
      });
    }
  }
  return rgbVals;
}

 const Node = function() {
   this.children = [];
   this.count = 0;
 };
 
 /**
  * r, g, b level decide how fine the color dividing
  * for example, r level and g level are 8, b level is 4
  * then the color space is dividing into 8 * 8 * 4 = 256 blocks
  */
 class PickerUniform {
   constructor(redLevel = 8, greenLevel = 8, blueLevel = 4) {
     this.redLevel = redLevel;
     this.greenLevel = greenLevel;
     this.blueLevel = blueLevel;
     this.bucket = {};
   }
 
   getSwatchOptimized(imgData, maxColor = 10) {
     let processInfo = {
       colors: 0,
       time: 0
     };
     const start = performance.now();
     const rgbArry = _convertPixelsToRGB(imgData);
     this.categorize(rgbArry);
     const swatch = this.quantizeWithMinHeap(maxColor);
     const end = performance.now();
     processInfo.time = end - start;
     return {
       mc: swatch[0],
       palette: swatch.slice(1),
       info: processInfo
     };
   }
 
   getSwatch(imgData, maxColor = 10) {
     let processInfo = {
       colors: 0,
       time: 0
     };
     const start = performance.now();
     const rgbArry = _convertPixelsToRGB(imgData);
     this.categorize(rgbArry);
     const swatch = this.quantizeWithoutMinHeap(maxColor);
     const end = performance.now();
     processInfo.time = end - start;
     return {
       mc: swatch[0],
       palette: swatch.slice(1),
       info: processInfo
     };
   }
 
   categorize(rgbArry) {
     for (let i = 0; i < rgbArry.length; i++) {
       const rd = 256 / this.redLevel;
       const gd = 256 / this.greenLevel;
       const bd = 256 / this.blueLevel;
       const rp = Math.floor(rgbArry[i].r / rd);
       const gp = Math.floor(rgbArry[i].g / gd);
       const bp = Math.floor(rgbArry[i].b / bd);
       const index = String(rp) + String(gp) + String(bp);
       if (!this.bucket[index]) this.bucket[index] = new Node();
       this.bucket[index].children.push(rgbArry[i]);
       this.bucket[index].count++;
     }
     return this.bucket;
   }
 
   quantizeWithoutMinHeap(maxColor = 10) {
     let bucketArray = [];
     for (var node in this.bucket) {
       bucketArray.push({ index: node, ...this.bucket[node] });
     }
     bucketArray.sort((b1, b2) => {
       return b2.count - b1.count;
     });
     if (bucketArray.length > maxColor)
       bucketArray = bucketArray.slice(0, maxColor);
     const colors = bucketArray.map(node => {
       const color = node.children.reduce(
         (pre, cur) => {
           pre.r += cur.r;
           pre.g += cur.g;
           pre.b += cur.b;
           return pre;
         },
         { r: 0, g: 0, b: 0 }
       );
       color.r = Math.round(color.r / node.count);
       color.g = Math.round(color.g / node.count);
       color.b = Math.round(color.b / node.count);
       return color;
     });
     return colors;
   }
 
   quantizeWithMinHeap(maxColor = 10) {
     let bucketArray = [];
     for (var node in this.bucket) {
       if (bucketArray.length < maxColor) {
         bucketArray.push({ index: node, ...this.bucket[node] });
         buildMinHeap(bucketArray);
       } else {
         if (this.bucket[node].count > bucketArray[0].count) {
           bucketArray[0] = this.bucket[node];
           heapify(bucketArray, 0, bucketArray.length);
         }
       }
     }
     bucketArray.sort((b1, b2) => {
       return b2.count - b1.count;
     });
     const colors = bucketArray.map(node => {
       const color = node.children.reduce(
         (pre, cur) => {
           pre.r += cur.r;
           pre.g += cur.g;
           pre.b += cur.b;
           return pre;
         },
         { r: 0, g: 0, b: 0 }
       );
       color.r = Math.round(color.r / node.count);
       color.g = Math.round(color.g / node.count);
       color.b = Math.round(color.b / node.count);
       return color;
     });
     return colors;
   }
 }
 
 function buildMinHeap(arr) {
   for (let i = Math.floor(arr.length / 2); i >= 0; i--) {
     heapify(arr, i, arr.length);
   }
   return arr;
 }
 
 function heapify(arr, index, heapSize) {
   const left = index * 2 + 1;
   const right = index * 2 + 2;
   let min = index;
   if (left < heapSize && arr[left]["count"] < arr[min]["count"]) {
     min = left;
   }
   if (right < heapSize && arr[right]["count"] < arr[min]["count"]) {
     min = right;
   }
   if (min !== index) {
     [arr[index], arr[min]] = [arr[min], arr[index]];
     heapify(arr, min, heapSize);
   }
 }
 export default PickerUniform;
 
 // const colors = [
 //   { r: 0, g: 1, b: 2, a: 0 },
 //   { r: 21, g: 11, b: 211, a: 0 },
 //   { r: 10, g: 221, b: 12, a: 0 },
 //   { r: 0, g: 111, b: 23, a: 0 },
 //   { r: 0, g: 12, b: 22, a: 0 },
 //   { r: 0, g: 1, b: 21, a: 0 },
 //   { r: 3, g: 1, b: 2, a: 0 },
 //   { r: 0, g: 5, b: 2, a: 0 },
 //   { r: 0, g: 11, b: 2, a: 0 },
 //   { r: 10, g: 1, b: 2, a: 0 },
 //   { r: 0, g: 1, b: 2, a: 0 },
 //   { r: 0, g: 11, b: 12, a: 0 },
 //   { r: 10, g: 12, b: 22, a: 0 },
 //   { r: 56, g: 77, b: 22, a: 0 },
 //   { r: 112, g: 112, b: 112, a: 0 },
 //   { r: 223, g: 12, b: 22, a: 0 },
 //   { r: 88, g: 12, b: 22, a: 0 },
 //   { r: 78, g: 12, b: 22, a: 0 },
 //   { r: 99, g: 12, b: 22, a: 0 }
 // ];
 
 // const test = new UniformQuan(8, 8, 4);
 // console.log(test.getSwatch(colors));
 