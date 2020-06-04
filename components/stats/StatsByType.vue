<template>
  <div>
    <div id="statsByType" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      maps: [],
      option: {
        title: {
          text: '各类型文件的总大小',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: []
        },
        series: [
          {
            name: '文件类型',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$axios.get('/api/admin/file/stats/type')
        .then((res) => {
          if (res.data.status === 'OK') {
            this.maps = res.data.map.maps
            this.parseData()
          } else {
            this.$message.error('获取数据失败')
          }
        })
    },
    parseData () {
      this.maps.forEach((obj) => {
        this.option.legend.data.push(obj.type)
        this.option.series[0].data.push({ value: obj.totalSize, name: obj.type })
      })
      this.$echarts.init(document.getElementById('statsByType')).setOption(this.option)
    }
  }
}
</script>

<style lang="scss" scoped>
#statsByType{
  width: 600px;
  height: 400px;
}
</style>
