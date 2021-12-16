<template>
  <el-button @click="onClick">给我变！</el-button>
  <FunctionalTable :data="tableData" :visibleKeys="visibleKeys" :style="{width: `100%`}">
    <el-table-column prop="date" label="Date" width="180" />,
    <el-table-column prop="name" label="Name" />,
    <el-table-column prop="address" label="Address" />       
  </FunctionalTable>
</template>
<script setup>
import FunctionalTable from './functional';
import { ref } from 'vue'

const visibleKeys = ref(['date', 'name'])

const onClick = () => {
  visibleKeys.value = ['date', 'name', 'address']
}


const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>