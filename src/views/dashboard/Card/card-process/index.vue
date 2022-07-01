<template>
  <div class="process" ref="cardprocess"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "card-process",
  mounted() {
    let mycharts = echarts.init(this.$refs.cardprocess);
    mycharts.setOption({
      xAxis: {
        type: "value",
        show: false,
        // 设置最大最小值
        max: 100,
        mihn: 0,
      },
      yAxis: {
        // 将均分给y轴就柱状图就变成了横项
        type: "category",
        show: false,
      },
      grid: {
        left: "0",
      },
      itemStyle: {
        color: "yellowgreen",
      },
      barWidth: 22,
      tooltip: {},
      label: {
        show: true,
        formatter: "|",
        position: "right",
      },
      series: {
        data: [56],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "#ECEDEE",
        },
      },
    });
  },
};
</script>

<style scoped>
.process {
  width: 100%;
  height: 100%;
}
</style>