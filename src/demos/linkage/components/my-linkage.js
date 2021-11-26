import { ElSelect, ElOption } from 'element-plus'
import { ref, createVNode, computed } from 'vue'
import cityTree from './city-tree.json'

// 将一个子节点创建为ElOption的VNode
const createOptionVNode = ({id, name}) => {
  return createVNode(ElOption, { value: id, label: name })
}
// 将一个子节点数组，创建为一群ElOption的VNode的数组
const createOptionVNodes = (arr) => {
  return arr.map(createOptionVNode)
}

export const useLinkage = () => {
  // 省
  const currentProvince = ref(null)
  let onProvinceOriginChange
  const onProvinceChange = (v) => {
    if (onProvinceOriginChange) {
      onProvinceOriginChange(v)
    }
    currentProvince.value = v
    onCityChange(null)
    onAreaChange(null)
  }
  
  const ProvinceSelect = (props, context) => {
    const provinceOptions = createOptionVNodes(cityTree)
    onProvinceOriginChange = context.attrs['onUpdate:modelValue']
    currentProvince.value = context.attrs.modelValue
    return createVNode(ElSelect, { ...context.attrs, 'onUpdate:modelValue': onProvinceChange }, provinceOptions)
  }

  // 市
  const currentCity = ref(null)
  let onCityOriginChange
  const onCityChange = (v) => {
    if (onCityOriginChange) {
      onCityOriginChange(v)
    }
    currentCity.value = v
    onAreaChange(null)
  }
  const cities = computed(() => {
    return cityTree.find(t => t.id == currentProvince.value)?.children ?? [];
  })
  const CitySelect = (props, context) => {
    const cityOptions = createOptionVNodes(cities.value)
    onCityOriginChange = context.attrs['onUpdate:modelValue']
    return createVNode(ElSelect, { ...context.attrs, 'onUpdate:modelValue': onCityChange }, cityOptions)
  }

  // 区
  let onAreaOriginChange
  const onAreaChange = (v) => {
    if (onAreaOriginChange) {
      onAreaOriginChange(v)
    }
  }
  const areas = computed(() => {
    if ( currentProvince.value == null && currentCity.value == null ) {
      return []
    }
    return cities.value.find(t => t.id == currentCity.value)?.children ?? []
  })

  const AreaSelect = (props, context) => {
    const areaOptions = createOptionVNodes(areas.value)
    onAreaOriginChange = context.attrs['onUpdate:modelValue']
    return createVNode(ElSelect, { ...context.attrs, 'onUpdate:modelValue': onAreaChange }, areaOptions)
  }

  return {
    ProvinceSelect,
    CitySelect,
    AreaSelect
  }
}