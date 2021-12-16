<template>
  <div>
    Demos:
    <el-tabs type="card" v-model="activeTab" lazy>
      <el-tab-pane label="多级联动" name="LinkagePage">
        <LinkagePage />
      </el-tab-pane>
      <el-tab-pane label="withLoading" name="WithLoadingPage">
        <WithLoading />
      </el-tab-pane>
      <el-tab-pane label="像素化" name="PixiPage">
        <Pixi></Pixi>
      </el-tab-pane>
      <el-tab-pane label="Table" name="Table">
        <Table></Table>
      </el-tab-pane>
    </el-tabs>
    
  </div>

</template>

<script setup>
import { ref } from 'vue';
const activeTab = ref('Table')
import LinkagePage from './demos/linkage'
import WithLoading from './demos/with-loading'
import Pixi from './demos/pixi-tool'
import Table from './demos/el-table-wrap'
</script>
