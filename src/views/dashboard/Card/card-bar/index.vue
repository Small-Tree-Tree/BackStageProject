<template>
  <div class="bar" ref="bar"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "card-bar",
  mounted() {
    let mycharts = echarts.init(this.$refs.bar);
    mycharts.setOption({
      xAxis: {
        type: "category",
        //开启指示选择器
        axisPointer: {
          show: true,
        },
        show:false
      },
      yAxis: {
        type: "value",
        show: false,
      },
      grid: {
        left: "10",
        right: "10",
        top:'55'
      },
      itemStyle: {
        color: "#7089D5",
      },
      tooltip: {
        // 阴影指示器
        axisPointer: {
          type: "shadow",
        },
      },
      series: {
        type: "bar",
        name: "支付笔数",
        data: [30, 56, 25, 35, 13, 54, 62, 56, 23, 42, 45, 19, 45],
      },
    });
  },
};
</script>

<style scoped>
.bar {
  width: 100%;
  height: 100%;
}
</style>