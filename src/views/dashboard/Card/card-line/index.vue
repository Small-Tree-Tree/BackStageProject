<template>
  <div class="line" ref="chartsLine"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "card-line",
  mounted() {
    // 在页面初次挂载就渲染
    let mycharts = echarts.init(this.$refs.chartsLine);
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
        name:'访问量',
        data: [12, 56, 21, 95, 15, 45,25, 62, 20],
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
                color: "#FF4D63", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#FFFFFF", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
         lineStyle:{
          color:'#FF465D'
         }
      },
    });
  },
};
</script>

<style scoped>
.line {
  width: 100%;
  height: 100%;
}
</style>

