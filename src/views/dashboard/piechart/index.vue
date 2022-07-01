<template>
  <div ref="pie" style="width: 100%; height: 385px"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "piechart",
  mounted() {
    let mycharts = echarts.init(this.$refs.pie);
    mycharts.setOption({
      title: {
        text: "视频广告",
        subtext: "1048",
        textStyle: {
          fontSize: 24,
          fontWeight: "normal",
        },
        subtextStyle: {
          fontSize: 18,
          color: "#666",
        },
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "广告占比",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "视频广告" },
            { value: 735, name: "联盟广告" },
            { value: 580, name: "搜索广告" },
            { value: 484, name: "招聘广告" },
            { value: 300, name: "拍摄广告" },
          ],
        },
      ],
    });
    // 给mycharts绑定事件
    // 处理鼠标移入事件,当移入时修改title的值
    mycharts.on("mouseover", function (params) {
        let {name,value} = params.data
        mycharts.setOption({
            title:{
                text:name,
                subtext:value
            }
        })
    });
  },
};
</script>

<style>
</style>