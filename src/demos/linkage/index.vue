<template>
  <div>
    <div>省：</div>
    <ProvinceSelect v-model="formData.province" clearable/>
    <div>市：</div>
    <CitySelect v-model="formData.city"/>
    <div>区：</div>
    <AreaSelect v-model="formData.area"/>
  </div>
</template>
<script setup>
import { reactive } from '@vue/reactivity';
import { useLinkage } from './components/my-linkage';
const { ProvinceSelect, CitySelect, AreaSelect } = useLinkage()
const formData = reactive({
  province: null,
  city: null,
  area: null
})
</script>