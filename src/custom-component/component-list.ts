import titleImg from '@/assets/title.jpg'
import type { Component } from '@/types'

// 公共样式
export const commonStyle = {
  rotate: 0,
  opacity: 1,
  top: 0,
  left: 0,
}

export const commonAttr = {
  animations: [],
  events: {},
  groupStyle: {}, // 当一个组件成为 Group 的子组件时使用
  isLock: false, // 是否锁定组件
  collapseName: 'style', // 编辑组件时记录当前位移
  linkage: {
    duration: 0, // 过渡持续时间
    data: [
      // 组件联动
      {
        id: '', // 联动的组件 id
        label: '', // 联动的组件名称
        event: '', // 监听事件
        style: [{ key: '', value: '' }], // 监听的事件触发时，当前组件的改变
      },
    ],
  },
}


// ornament 组件列表
const dataVList = [
  // Borders
  {
    component: 'VOrnament',
    label: '边框1',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-1',
      config: {
        color: ['#4fd2dd', '#235fa7'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  {
    component: 'VOrnament',
    label: '边框2',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-2',
      config: {
        color: ['#8aaafb', '#1f33a2'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  {
    component: 'VOrnament',
    label: '边框3',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-3',
      config: {
        color: ['#2862b7', '#2862b7'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  {
    component: 'VOrnament',
    label: '边框4',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-4',
      config: {
        color: ['red', 'rgba(0,0,255,0.8)'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  {
    component: 'VOrnament',
    label: '边框5',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-5',
      config: {
        color: ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.20)'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  {
    component: 'VOrnament',
    label: '边框6',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-6',
      config: {
        color: ['rgba(255, 255, 255, 0.35)', 'gray'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  {
    component: 'VOrnament',
    label: '边框7',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-7',
      config: {
        color: ['rgba(128, 128, 128, 0.3)', 'rgba(128, 128, 128, 0.5)'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  {
    component: 'VOrnament',
    label: '边框8',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-8',
      config: {
        color: ['#235fa7', '#4fd2dd'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  {
    component: 'VOrnament',
    label: '边框9',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-9',
      config: {
        color: ['#11eefd', '#0078d2'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  {
    component: 'VOrnament',
    label: '边框10',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-10',
      config: {
        color: ['#1d48c4', '#d3e1f8'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  {
    component: 'VOrnament',
    label: '边框11',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-11',
      config: {
        color: ['#8aaafb', '#1f33a2'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  {
    component: 'VOrnament',
    label: '边框12',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-12',
      config: {
        color: ['#2e6099', '#7ce7fd'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  {
    component: 'VOrnament',
    label: '边框13',
    icon: 'el-icon-box',
    category: 'ornament',
    subcategory: 'border',
    propValue: {
      component: 'dv-border-box-13',
      config: {
        color: ['#6586ec', '#2cf7fe'],
        backgroundColor: 'transparent',
      },
      content: '',
    },
    style: {
      width: 300,
      height: 200,
    },
  },
  // Decorations
  {
    component: 'VOrnament',
    label: '装饰1',
    icon: 'el-icon-magic-stick',
    category: 'ornament',
    subcategory: 'decoration',
    propValue: {
      component: 'dv-decoration-1',
      config: {
        color: ['#8aaafb', '#1f33a2'],
      },
    },
    style: {
      width: 200,
      height: 50,
    },
  },
  // Others
  {
    component: 'VOrnament',
    label: 'Loading加载',
    icon: 'el-icon-loading',
    category: 'ornament',
    subcategory: 'other',
    propValue: {
      component: 'dv-loading',
      config: {},
      content: 'Loading...',
    },
    style: {
      width: 100,
      height: 100,
    },
  },
]

// 编辑器左侧组件列表
const list = [
  ...dataVList,
  {
    component: 'VText',
    label: '文字',
    propValue: '双击编辑文字',
    icon: 'wenben',
    category: 'base',
    subcategory: 'text',
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false, // 是否定时发送请求
      time: 1000, // 定时更新时间
      paramType: '', // string object array
      requestCount: 0, // 请求次数限制，0 为无限
      dataHandler: '', // 数据过滤处理脚本
    },
    style: {
      width: 200,
      height: 28,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: '',
    },
  },
  {
    component: 'VButton',
    label: '按钮',
    propValue: '按钮',
    icon: 'button',
    category: 'base',
    subcategory: 'basic',
    style: {
      width: 100,
      height: 34,
      borderWidth: 1,
      borderColor: '',
      borderRadius: '',
      fontSize: '',
      fontWeight: 400,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: '',
      backgroundColor: '',
    },
  },
  {
    component: 'Picture',
    label: '图片',
    icon: 'tupian',
    category: 'base',
    subcategory: 'media',
    propValue: {
      url: titleImg,
      flip: {
        horizontal: false,
        vertical: false,
      },
    },
    style: {
      width: 300,
      height: 200,
      borderRadius: '',
    },
  },
  {
    component: 'RectShape',
    label: '矩形',
    propValue: '&nbsp;',
    icon: 'juxing',
    category: 'shape',
    subcategory: 'basic',
    style: {
      width: 200,
      height: 200,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'center',
      color: '',
      borderColor: '#000',
      borderWidth: 1,
      backgroundColor: '',
      borderStyle: 'solid',
      borderRadius: '',
      verticalAlign: 'middle',
    },
  },
  {
    component: 'LineShape',
    label: '直线',
    propValue: '',
    icon: 'zhixian',
    category: 'shape',
    subcategory: 'basic',
    style: {
      width: 200,
      height: 2,
      backgroundColor: '#000',
    },
  },
  {
    component: 'CircleShape',
    label: '圆形',
    propValue: '&nbsp;',
    icon: '24gl-circle',
    category: 'shape',
    subcategory: 'basic',
    style: {
      width: 200,
      height: 200,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'center',
      color: '',
      borderColor: '#000',
      borderWidth: 1,
      backgroundColor: '',
      borderStyle: 'solid',
      borderRadius: '',
      verticalAlign: 'middle',
    },
  },
  {
    component: 'SVGStar',
    label: '星形',
    icon: 'kongwujiaoxing',
    propValue: '',
    category: 'shape',
    subcategory: 'svg',
    style: {
      width: 80,
      height: 80,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'center',
      color: '',
      borderColor: '#000',
      borderWidth: 1,
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
  },
  {
    component: 'SVGTriangle',
    label: '三角形',
    icon: 'xingzhuang-sanjiaoxing',
    propValue: '',
    category: 'shape',
    subcategory: 'svg',
    style: {
      width: 80,
      height: 80,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'center',
      color: '',
      borderColor: '#000',
      borderWidth: 1,
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
  },
  {
    component: 'VTable',
    label: '表格',
    icon: 'biaoge',
    category: 'functional',
    subcategory: 'table',
    propValue: {
      data: [
        ['表头1', '表头2', '表头3'],
        ['内容1', '内容2', '内容3'],
      ],
      columns: [], // { label: string, prop: string }[]
      stripe: true,
      thBold: true,
    },
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false,
      time: 1000,
      paramType: '', // string object array
      requestCount: 0, // 请求次数限制，0 为无限
      dataHandler: '', // 数据过滤处理脚本
    },
    style: {
      width: 600,
      height: 200,
      fontSize: 14,
      fontWeight: 500,
      textAlign: 'center',
      color: '',
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
  },
  {
    component: 'VChart',
    label: '柱状图',
    icon: 'el-icon-data-analysis',
    category: 'chart',
    subcategory: 'bar',
    propValue: {
      chart: 'VChart',
      data: [], // 原始动态数据
      mapper: { // 字段映射配置
        x: '', // 类目轴/X轴字段
        y: '', // 数值轴/Y轴字段
        s: '', // 系列分组字段 (可选)
      },
      option: {
        title: {
          text: '柱状图',
          show: true,
        },
        legend: {
          show: true,
        },
        tooltip: {
          show: true,
          trigger: 'item',
        },
        xAxis: {
          show: true,
          data: ['A', 'B', 'C', 'D', 'E'],
          name: '',
          nameTextStyle: {
            color: '#333',
            fontSize: 12,
          },
          axisLabel: {
            rotate: 0,
            color: '#333',
            fontSize: 12,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#333',
            },
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          show: true,
          name: '',
          nameTextStyle: {
            color: '#333',
            fontSize: 12,
          },
          axisLabel: {
            color: '#333',
            fontSize: 12,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ccc',
              type: 'solid',
            },
          },
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 20,
          top: 60,
          containLabel: true,
        },
        series: {
          type: 'bar',
          name: '销量',
          data: [23, 61, 35, 77, 35],
          label: {
            show: false,
            position: 'top',
            color: '#000',
            fontSize: 12,
          },
          itemStyle: {
            barBorderRadius: 0,
            color: '#5470c6',
          },
          barWidth: 20,
        },
      },
    },
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false,
      time: 1000,
      paramType: '',
      requestCount: 0,
      dataHandler: '',
    },
    style: {
      width: 800,
      height: 500,
      borderRadius: '',
    },
  },
  {
    component: 'VChart',
    label: '折线图',
    icon: 'el-icon-data-analysis',
    category: 'chart',
    subcategory: 'line',
    propValue: {
      chart: 'VChart',
      data: [],
      mapper: { x: '', y: '', s: '', seriesName: '' },
      option: {
        title: {
          text: '折线图',
          show: true,
        },
        legend: {
          show: true,
        },
        tooltip: {
          show: true,
          trigger: 'item',
        },
        xAxis: {
          show: true,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          name: '',
          nameTextStyle: {
            color: '#333',
            fontSize: 12,
          },
          axisLabel: {
            rotate: 0,
            color: '#333',
            fontSize: 12,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#333',
            },
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          show: true,
          name: '',
          nameTextStyle: {
            color: '#333',
            fontSize: 12,
          },
          axisLabel: {
            color: '#333',
            fontSize: 12,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ccc',
              type: 'solid',
            },
          },
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 20,
          top: 60,
          containLabel: true,
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
            label: {
              show: false,
              position: 'top',
              color: '#000',
              fontSize: 12,
            },
            itemStyle: {
              color: '#5470c6',
            },
            smooth: false,
          },
        ],
      },
    },
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false,
      time: 1000,
      paramType: '',
      requestCount: 0,
      dataHandler: '',
    },
    style: {
      width: 800,
      height: 500,
      borderRadius: '',
    },
  },
  {
    component: 'VChart',
    label: '饼图',
    icon: 'el-icon-data-analysis',
    category: 'chart',
    subcategory: 'pie',
    propValue: {
      chart: 'VChart',
      data: [],
      mapper: { x: '', y: '', s: '' },
      option: {
        title: {
          text: '饼图',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
    },
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false,
      time: 1000,
      paramType: '',
      requestCount: 0,
      dataHandler: '',
    },
    style: {
      width: 600,
      height: 500,
      borderRadius: '',
    },
  },
  {
    component: 'VMap',
    label: '地图',
    icon: 'el-icon-map-location',
    category: 'chart',
    subcategory: 'map',
    propValue: {
      option: {
        title: {
          text: '中国地图',
          left: 'center',
          show: true,
          textStyle: {
            color: '#fff',
          },
        },
        tooltip: {
          trigger: 'item',
          show: true,
        },
        legend: {
          show: true,
          textStyle: {
            color: '#fff',
          },
        },
        geo: {
          map: 'china',
          roam: true,
          label: {
            show: true,
            color: '#fff',
          },
          itemStyle: {
            areaColor: '#323c48',
            borderColor: '#111',
          },
          emphasis: {
            itemStyle: {
              areaColor: '#2a333d',
            },
            label: {
              show: true,
              color: '#fff',
            },
          },
        },
        series: [
          {
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [
              { name: '北京', value: [116.46, 39.92, 100] },
              { name: '上海', value: [121.48, 31.22, 80] },
              { name: '广州', value: [113.23, 23.16, 60] },
            ],
            symbolSize: 12,
            label: {
              formatter: '{b}',
              position: 'right',
              show: false,
            },
            itemStyle: {
              color: '#ddb926',
            },
          },
        ],
      },
    },
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false,
      time: 1000,
      paramType: '',
      requestCount: 0,
      dataHandler: '',
    },
    style: {
      width: 600,
      height: 500,
      borderRadius: '',
      backgroundColor: '#000',
    },
  },
]

for (let i = 0, len = list.length; i < len; i++) {
  const item = list[i]
  item.style = { ...commonStyle, ...item.style }
  list[i] = { ...commonAttr, ...item }
}

export default list as unknown as Component[]
