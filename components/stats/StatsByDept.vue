<template>
  <div>
    <div id="statsByDept" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      maps: [],
      option: {
        color: ['#3398DB'],
        title: {
          text: '各部门用户上传文件的大小统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisLabel: {
              interval: 0,
              rotate: 60
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}(byte)'
            }
          }
        ],
        series: [
          {
            name: '各部门用户上传文件的大小',
            type: 'bar',
            barWidth: '60%',
            data: []
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
      this.$axios.get('/api/admin/file/stats/dept')
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
        this.option.xAxis[0].data.push(obj.title)
        this.option.series[0].data.push(obj.size)
      })
      this.$echarts.init(document.getElementById('statsByDept')).setOption(this.option)
    }
  }
}
</script>

<style lang="scss" scoped>
#statsByDept{
  width: 100%;
  height: 400px;
}
</style>
