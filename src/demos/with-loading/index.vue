<template>
  <div>
    <el-button @click="queryBirds">获取人员</el-button>
    <el-button @click="queryCars">获取人员</el-button>
  </div>
</template>
<script setup>
import { getBirds, getCars } from './mock';
import { withLoading } from './hooks/loading';
import { ElMessage } from 'element-plus';
const queryBirds = async () => {
  const birds = await withLoading(getBirds)()
  ElMessage.success(birds.map(t => t.name).join())
}
const queryCars = async () => {
  try {
    await withLoading(getCars)()
  } catch(err) {
    ElMessage.error(err.message)
  }
}
</script>
