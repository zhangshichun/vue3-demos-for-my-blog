// import { h } from 'vue'
const FunctionalTable = (props, context) => {
  const vNodes = context.slots.default()
  const filteredVNodes = props.visibleKeys == null ? vNodes : vNodes.filter(node => props.visibleKeys.includes(node?.props?.prop))
  return <el-table {...context.attrs}>
    { filteredVNodes }
  </el-table>
}

FunctionalTable.props = {
  visibleKeys: {
    type: Array,
    default: () => null
  } 
}

export default FunctionalTable;