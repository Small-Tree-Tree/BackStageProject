<template>
  <div class="wrapper">
    <!-- 标题 -->
    <div class="title">
      <span>{{titleName}}</span><i class="iconfont icon-info1"></i>
    </div>
    <!-- 数据展示 -->
    <div class="searnum">
      <span class="num">{{peopleNum}}</span>
      <span style="color: '#D2D2D2'">{{percentage}}</span>
      <i class="triangle"></i>
    </div>
    <!-- 图表 -->
    <div ref="searLine" class="sear"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "searLine",
  mounted() {
    let mycharts = echarts.init(this.$refs.searLine);
    mycharts.setOption({
      xAxis: {
        // 对于离散的数据,能够均分,更美观
        type: "category",
      },
      yAxis: {
        type: "value",
        show: false,
      },
      tooltip: {
        trigger: "none",
        axisPointer: {
          type: "cross",
        },
      },
      // 设置布局
      grid: {
        bottom: "0%",
        top: "0%",
        left: "0%",
        right: "0%",
      },
      series: {
        type: "line",
        name: "访问量",
        data: this.chartData,
        // 让折线平滑
        smooth: true,
        // 设置拐点样式
        itemStyle: {
          opacity: 0,
        },
        //设置区域填充的样式
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#6CBADF", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#FFFFFF", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        lineStyle: {
          color: "#6CBADF",
        },
      },
    });
  },
  props:['titleName','peopleNum','percentage','chartData']
};
</script>

<style scoped>
.wrapper{
    width:350px;
    height: 220px;
}
.sear {
    width: 100%;
    height: 100px;
}
.title {
  width: 100%;
  height: 40px;
  margin-top: 20px;
}
span,
.icon-info1 {
  color: #848080;
  margin-right: 10px;
}
.triangle {
  border: 5px solid;
  border-color: transparent transparent red transparent;
  position: absolute;
  top: 16px;
}
.num {
  color: #333;
  font-size: 25px;
  margin-right: 40px;
}
.searnum {
  line-height: 40px;
  position: relative;
}


</style>