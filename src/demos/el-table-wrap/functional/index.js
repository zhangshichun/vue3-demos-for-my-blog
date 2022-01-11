// import { h } from "vue"
import { get } from 'lodash'
// import { ElButton } from 'element-plus'

// 1.动态实现法
const genClickableVNode = (vNode, onClick) => {
  vNode.children = {
    default: ({ row }) => {
      return <el-button type='text' onClick={() => onClick({ prop: vNode?.props.prop, row }) }>
        { get(row, vNode?.props.prop) }
      </el-button>    }
  }
  /**
   * ShapeFlags.SLOTS_CHILDREN = 32
   * 下面这是 vue3.x 里关于 vNode 类型的判断语法
   */
  if ((vNode.shapeFlag & 32) == 0) { // 当前如果不是插槽类vNode
    vNode.shapeFlag = vNode.shapeFlag | 32 // 让它成为插槽类vNode
  }
  return vNode
}

// 2.生成新的VNode,继承老vNode的各种属性，且插入需要的插槽和事件
// const genClickableVNode = (vNode, onClick) => {
//   const slots = {
//     default: ({ row }) => {
//       return <el-button type='text' onClick={() => onClick({ prop: vNode?.props.prop, row }) }>
//         { get(row, vNode?.props.prop) }
//       </el-button>
//     }
//   }
//   return <el-table-column {...vNode.attrs} {...vNode.props}>
//     { slots }
//   </el-table-column>
// }


const FunctionalTable = (props, context) => {
  const vNodes = context.slots.default()
  const filteredVNodes = props.visibleKeys == null ? vNodes : vNodes.filter(node => props.visibleKeys.includes(node?.props?.prop))
  const onColumnClick = (...args) => {
    context.emit('column-click', ...args)
  }
  const clickableVNodes = filteredVNodes.map(node => {
    return genClickableVNode(node, onColumnClick)
  })

  return <el-table {...context.attrs}>
    { clickableVNodes }
  </el-table>
}

FunctionalTable.props = {
  visibleKeys: {
    type: Array,
    default: () => null
  } 
}

FunctionalTable.emit = ['column-click']

export default FunctionalTable;