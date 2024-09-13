<template>
  <div id="scroll-box" class="scroll-box relative-position">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-show="showCanvas" id="container" ref="container"></div>
    </transition>
    <q-inner-loading :showing="!showCanvas" />
  </div>
</template>

<script setup>
import { ref, watchEffect, nextTick, onUnmounted } from 'vue'
import { Graph, registerNode, registerEdge } from '@antv/g6'

import checkCircleGreen from '@/assets/images/check-circle-green.svg'
import circleGrey from '@/assets/images/circle-grey.svg'
import { isEmptyObject } from '@/utils/location.js'
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    },
  },
  dataInfo: {
    type: Array,
    default: () => {
      return []
    },
  },
})

const graph = ref(null)
const container = ref(null)
const showCanvas = ref(false)
const minHeight = ref(300)

watchEffect(() => {
  showCanvas.value = false
  !isEmptyObject(props.data) && nextTick(() => initView())
})
// 初始化界面
function initView() {
  const dataFlow = props.data
  const box = document.getElementById('scroll-box')

  registerNode('custom-node', {
    drawShape(cfg, group) {
      const { labelCfg: labelStyle } = cfg
      const rect = group.addShape('image', {
        attrs: {
          x: 0,
          y: -10,
          width: 36,
          height: 36,
          size: [50, 50],
          img: cfg.active ? checkCircleGreen : circleGrey,
        },
        name: 'image-shape',
      })
      if (cfg.topText1) {
        group.addShape('text', {
          attrs: {
            x: 20,
            y: -44,
            text: cfg.topText1,
            textAlign: 'center',
            textBaseline: 'middle',
            lineHeight: 50,
            ...labelStyle.style,
          },
          name: 'text-shape',
        })
      }
      if (cfg.topText2) {
        group.addShape('text', {
          attrs: {
            x: 18,
            y: -24,
            text: cfg.topText2,
            textAlign: 'center',
            textBaseline: 'middle',
            lineHeight: 50,
            ...labelStyle.style,
          },
          name: 'text-shape',
        })
      }
      if (cfg.topText) {
        group.addShape('text', {
          attrs: {
            x: 18,
            y: -24,
            text: cfg.topText,
            textAlign: 'center',
            textBaseline: 'middle',
            lineHeight: 50,
            ...labelStyle.style,
          },
          name: 'text-shape',
        })
      }
      const words = cfg.bottomText.split(' ')
      const rows = []
      let rowText = ''
      words.forEach((w, index) => {
        if (rowText.length + w.length >= 20) {
          rows.push(rowText)
          rowText = ''
        }
        rowText += w + (index + 1 < words.length ? ' ' : '')
      })
      if (rowText) rows.push(rowText)
      rows.forEach((rowText, index) => {
        group.addShape('text', {
          attrs: {
            x: 18,
            y: 40 + 18 * index,
            text: rowText,
            textAlign: 'center',
            textBaseline: 'middle',
            lineHeight: 50,
            ...labelStyle.style,
          },
          name: 'text-shape',
        })
      })

      return rect
    },
  })
  // /**
  //  * 自定义带箭头的贝塞尔曲线 edge
  //  */
  registerEdge('custom-edge', {
    itemType: 'edge',
    draw: function draw(cfg, group) {
      var startPoint = cfg.startPoint
      var endPoint = cfg.endPoint
      var centerPoint = {
        x: (startPoint.x + endPoint.x) / 2,
        y: (startPoint.y + endPoint.y) / 2,
      }
      // 控制点坐标
      var controlPoint = {
        x: (startPoint.x + centerPoint.x) / 2,
        y: startPoint.y,
      }

      // 为了更好的展示效果, 对称贝塞尔曲线需要连到箭头根部
      var path = group.addShape('path', {
        attrs: {
          path: [
            ['M', startPoint.x, startPoint.y],
            [
              'Q',
              controlPoint.x + 8,
              controlPoint.y,
              centerPoint.x,
              centerPoint.y,
            ],
            ['T', endPoint.x - 8, endPoint.y],
            ['L', endPoint.x, endPoint.y],
          ],
          stroke: '#ccc',
          lineWidth: 1.6,
        },
      })
      if (cfg.code && props.dataInfo.length > 1) {
        // 在线的中间位置添加文本
        group.addShape('text', {
          attrs: {
            text: cfg.code,
            x: centerPoint.x,
            y: centerPoint.y,
            fill: '#000',
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center',
          },
          // 指定文本的名称
          name: 'text-shape',
        })
      }

      return path
    },
  })
  const graphCanvas = new Graph({
    container: container.value,
    width: box.offsetWidth,
    height: box.offsetHeight,
    fitView: true,
    layout: {
      type: 'dagre',
      rankdir: 'LR',
      ranksepFunc: function (d) {
        if (props.dataInfo.length > 1) {
          if (d.bottomText === 'ATA' || d.bottomText === 'ATD') {
            return 150
          }
          return 50
        }
        return 50
      },
    },
    modes: {
      default: ['drag-canvas', 'zoom-canvas'],
    },
    defaultNode: {
      type: 'custom-node',
      size: 14,
      labelCfg: {
        style: {
          fill: '#999',
          fontSize: 14,
        },
      },
      style: {
        fill: '#ffff',
        lineWidth: 2,
      },
    },
    defaultEdge: {
      type: 'custom-edge',
      style: {
        endArrow: false,
        lineWidth: 2,
        stroke: '#999',
      },
    },
    fitCenter: true,
  })
  graphCanvas.data(dataFlow)
  graphCanvas.render()

  //等待图形渲染完成之后计算图形实际宽高，再动态设置画布大小适应图形大小
  graphCanvas.on('afterlayout', () => {
    const boxWidth = box.offsetWidth
    //计算图形宽度
    const nodes = graphCanvas.getNodes()
    let nodeX = [] //存储X坐标
    nodes.forEach(node => {
      nodeX.push(node.get('model').x)
    })
    //图能完整渲染后，精确计算图的实际宽度
    const graphWidth = Math.max(...nodeX) - Math.min(...nodeX)

    //计算图形高度,小于最小高度则使用最小高度
    const maxHeight = 100
    graphCanvas.changeSize(
      Math.max(boxWidth, graphWidth),
      Math.max(maxHeight, minHeight.value),
    )
  })
  graph.value = graphCanvas
  showCanvas.value = true
}
onUnmounted(() => {
  graph.value.destroy()
})
</script>

<style lang="scss" scoped>
.scroll-box {
  width: 100%;
  min-height: 300px;
  overflow: auto;
}
</style>
