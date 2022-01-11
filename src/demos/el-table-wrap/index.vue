<template>
<div>
  <h3>动态列</h3>
  <el-button @click="onClick">给我变！</el-button>
  <FunctionalTable :data="tableData" :visibleKeys="visibleKeys" :style="{width: `100%`}">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="address" label="Address" />       
  </FunctionalTable>  
</div>
<div>
  <h3>统一emit事件 (应掘金网友（id=4301761076793239）要求实现个demo)</h3>
  <FunctionalTable :data="tableData" :style="{width: `100%`}" @column-click="onColumnClick">
    <el-table-column prop="date" label="Date" width="180">
      <template #default="scope">
        <div>{{ scope.row.date }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="address" label="Address" />       
  </FunctionalTable>  
</div>

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

const onColumnClick = (v) => {
console.log("🔨🔪@zsc:: ~ file: index.vue ~ line 60 ~ onColumnClick ~ v", v)
  
}
</script>