<template>
  <div>
    <!-- 头部 -->
    <el-row :gutter="30">
      <!-- 总销售额度 -->
      <el-col :span="6">
        <el-card>
          <Card title="总销售额" num="￥123512">
            <template slot="charts">
              <span>周同比 22.7% </span><i class="triangle"></i
              ><span>日同比 11.8%</span><i class="triangle2"></i>
            </template>

            <template slot="footer">
              <p>日销售额 ￥12455</p>
            </template>
          </Card>
        </el-card>
      </el-col>

      <!-- 访问量 -->
      <el-col :span="6">
        <el-card>
          <Card title="访问量" num="88451">
            <template slot="charts">
              <cardLine></cardLine>
            </template>

            <template slot="footer">
              <p>日访问量 1235</p>
            </template>
          </Card>
        </el-card>
      </el-col>

      <!-- 支付笔数 -->
      <el-col :span="6">
        <el-card>
          <Card title="支付笔数" num="554544">
            <template slot="charts">
              <cardBar></cardBar>
            </template>
            <template slot="footer">
              <p>转化率 60%</p>
            </template>
          </Card>
        </el-card>
      </el-col>

      <!-- 运营活动效果 -->
      <el-col :span="6">
        <el-card>
          <Card title="运营活动效果" num="56%">
            <template slot="charts">
              <process></process>
            </template>
            <template slot="footer">
              <p class="activity">
                <span>周同比 22.7% </span><i class="triangle"></i
                ><span>日同比 11.8%</span><i class="triangle2"></i>
              </p>
            </template>
          </Card>
        </el-card>
      </el-col>
    </el-row>

    <!-- 内容部分 -->
    <el-card class="saleContain">
      <sale></sale>
    </el-card>

    <!-- 底部内容 -->
    <el-row :gutter="40" style="margin-top: 25px">
      <!-- 线上热门搜索 -->
      <el-col :span="12">
        <el-card>
          <div class="line">
            <span style="font-size: 20px">线上热门搜索</span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item>双皮奶</el-dropdown-item>
                <el-dropdown-item>蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 折线图 -->
          <div class="lineChart">
            <searLine
              titleName="搜索用户数"
              peopleNum="12256"
              percentage="20.5"
              :chartData="chartData1"
            ></searLine>
            <searLine
              titleName="人均搜索次数"
              peopleNum="14655"
              percentage="45.2"
              :chartData="chartData2"
            ></searLine>
          </div>
          <!-- 表格 -->
          <el-table border style="width: 100%">
            <el-table-column
              prop="prop"
              label="排名"
              width="60"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="prop"
              label="搜索关键字"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="prop"
              sortable
              label="用户数"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="prop"
              sortable
              label="周涨幅数"
              align="center"
            ></el-table-column>
          </el-table>
          <!-- 分页器 -->
          <el-pagination
            :current-page="1"
            :page-size="10"
            layout="prev, pager, next, jumper,->,total"
            :total="400"
            style="text-align: center; margin-top: 30px"
          >
          </el-pagination>
        </el-card>
      </el-col>

      <!-- 销售额度占比 -->
      <el-col :span="12">
        <el-card>
          <div class="saleTitle">
            <span style="font-size:20px;">销售额度占比</span>
            <el-radio-group v-model="typeValue" size="small">
              <el-radio-button label="全部渠道"></el-radio-button>
              <el-radio-button label="线上"></el-radio-button>
              <el-radio-button label="线下"></el-radio-button>
            </el-radio-group>
          </div>

          <!-- 饼图 -->
          <piechart></piechart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 导入Card组件
import Card from "./Card/index.vue";
// 导入折线图
import cardLine from "./Card/card-line/index.vue";
// 导入柱状图
import cardBar from "./Card/card-bar/index.vue";
// 导入进度
import process from "./Card/card-process/index.vue";
// 导入销售组件
import sale from "./sale/index.vue";
// 导入搜索区的折线图
import searLine from "./searLine";
// 导入饼图
import piechart from "./piechart"

export default {
  name: "Dashboard",
  components: { Card, cardLine, cardBar, process, sale, searLine,piechart },
  data() {
    return {
      chartData1: [32, 66, 21, 75, 25, 55, 45, 32, 70],
      chartData2: [22, 76, 21, 42, 35, 45, 65, 25, 40],
      typeValue: "全部渠道",
    }
  }
};
</script>

<style scoped>
.triangle,
.triangle2 {
  margin: 0 20px;
  border: 5px solid;
  border-color: transparent transparent red transparent;
}
.triangle2 {
  border-color: yellowgreen transparent transparent transparent;
}

.activity {
  display: flex;
  align-items: center;
}

.saleContain {
  margin-top: 26px;
}

.line {
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.lineChart {
  display: flex;
  justify-content: space-between;
}

.saleTitle{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 10px;

}
</style>

<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>