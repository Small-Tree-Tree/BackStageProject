<template>
  <div class="wrapper">
    <!-- 标题 -->
    <div class="title">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <div class="time">
        <span @click="setToDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <div class="block">
          <el-date-picker
            size="small"
            v-model="date"
            type="daterange"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
    </div>

    <!-- 图表 -->
    <el-row>
      <el-col :span="18">
        <div ref="bar" style="height: 400px"></div>
      </el-col>
      <el-col :span="6">
        <span class="rank">门店{{ title }}排名</span>
        <ul class="brand">
          <li>
            <span><i>1</i>肯德基</span><span>5521255</span>
          </li>
          <li>
            <span><i>2</i>麦当劳</span><span>1156546</span>
          </li>
          <li>
            <span><i>3</i>汉堡王</span><span>454644</span>
          </li>
          <li>
            <span><i>4</i>古茗</span><span>235512</span>
          </li>
          <li>
            <span><i>5</i>一绪</span><span>112155</span>
          </li>
          <li>
            <span><i>6</i>牛虻</span><span>112155</span>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
import dayjs from "dayjs"
export default {
  name: "sale",
  data() {
    return {
      activeName: "sale",
      date: "",
      // 将mycharts的实例放在data中用于在监视的时候能够获取到
      mycharts: null,
    };
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  mounted() {
    // 初始化echarts,但是需要注意只能够执行，如果选择发生改变需要怎么办呢？
    // 解决办法：watch去监听变量
    this.mycharts = echarts.init(this.$refs.bar);
    this.mycharts.setOption({
      title: {
        text: this.title,
        left: "center",
        textStyle: {
          color: "#4B4B4B",
           fontSize:20
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        width: "90%",
        height: "80%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "销售量",
          type: "bar",
          barWidth: "60%",
          data: [100, 152, 200, 334, 390, 330, 220, 245, 323, 123, 425, 658],
        },
      ],
    });
  },
  methods: {
    handleClick(tab, event) {},
    // 设置今天日期
    setToDay(){
        // 因为element-ui已经实现了双向绑定，所以去修改date
        let start = dayjs().format('YYYY-MM-DD') 
        let end = dayjs().format('YYYY-MM-DD') 
        this.date = [start,end]
    },
    // 设置周
    setWeek(){
        let start = dayjs().day(1).format('YYYY-MM-DD')
        let end = dayjs().day (7).format('YYYY-MM-DD')
        this.date = [start,end]
    },
    // 设置年
    setYear(){
        let start = dayjs().startOf('year').format('YYYY-MM-DD')
        let end = dayjs().endOf('year').format('YYYY-MM-DD')
        this.date = [start,end]
    },
    // 设置月
    setMonth(){
        let start = dayjs().startOf('month').format('YYYY-MM-DD')
        let end = dayjs().endOf('month').format('YYYY-MM-DD')
        this.date = [start,end]
    }
  },
  watch: {
    activeName(newData) {
      // 当用户进行切换的时候，重新修改图标的配置
      // 需要注意的是图表配置的数据是可以再次修改
      if (newData == "visit") {
        this.mycharts.setOption({
          title:{
            text:'访问量'
          },
          series: [
            {
              name: "访问量",
              type: "bar",
              barWidth: "60%",
              data: [
                452, 125, 566, 245, 452, 727, 185, 562, 462, 352, 485, 245,
              ],
            },
          ],
        });
      } else {
        this.mycharts.setOption({
          title:{
            text:'销售量'
          },
          series: [
            {
              name: "销售量",
              type: "bar",
              barWidth: "60%",
              data: [
                100, 152, 200, 334, 390, 330, 220, 245, 323, 123, 425, 658,
              ],
            },
          ],
        });
      }
    },
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
.time {
  display: flex;
  line-height: 40px;
}
.time span {
  margin: 0 8px;
  cursor: pointer;
}

>>> .el-tabs__item {
  font-size: 20px;
}
.title {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 30px;
}

.title::before{
    content:'';
    width:100%;
    height: 1px;
    background-color: #DCDFE6;
    position: absolute;
    bottom: 15px;
}

>>> .el-tabs {
  border-bottom: transparent;
}

.brand {
  list-style: none;
  margin-top: 44px;
}
.brand li {
  font-size: 18px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  position: relative;
}

.brand li > span i {
  width: 20px;
  height: 20px;
  display: inline-block;
  border-radius: 50%;
  color: aliceblue;
  background-color: black;
  font-style: normal;
  text-align: center;
  margin-right: 15px;
}

.rank {
  font-size: 20px;
  font-weight: 1000;
}

>>>.el-tabs__nav-wrap::after{
    background-color:transparent;
}
</style>
