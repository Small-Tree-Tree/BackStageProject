<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <categorySelect
        @categoryId="AttrList"
        :show="scence == 1"
      ></categorySelect>
    </el-card>
    <!-- spu列表 -->
    <el-card v-show="scence == 1">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 20px"
        :disabled="!this.category3Id"
        @click="addSpu"
        >添加spu</el-button
      >

      <!-- 表格 -->
      <el-table :data="spuList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column
          prop="spuName"
          label="spu名称"
          width="width"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="spu描述"
          width="width"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width" align="center">
          <template slot-scope="{ row, $index }">
            <HintButton
              @click="addSku(category1Id, category2Id, row)"
              title="添加sku"
              type="success"
              icon="el-icon-plus"
            ></HintButton>
            <HintButton
              title="修改spu"
              type="warning"
              icon="el-icon-edit"
              @click="editSpu(row)"
            ></HintButton>
            <HintButton
              title="详情"
              type="info"
              @click="showDetailInfo(row)"
              icon="el-icon-info"
            ></HintButton>
            <el-popconfirm
              title="确定删除吗？"
              @onConfirm="deleteSpu(row)"
              icon-color="red"
            >
              <HintButton
                slot="reference"
                title="删除"
                type="danger"
                icon="el-icon-delete"
              ></HintButton>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 详情的弹窗 -->
      <el-dialog title="收货地址" :visible.sync="dialogTableVisible" :before-close="close">
        <el-table style="width: 100%" :data="skuDetail" border  v-loading="loading">
          <el-table-column prop="skuName" label="名称" width="width" align="center"></el-table-column>
          <el-table-column prop="price" label="价格" width="width" align="center"></el-table-column>
          <el-table-column prop="weight" label="重量" width="width" align="center"></el-table-column>
          <el-table-column label="默认图片" width="width" align="center">
            <template slot-scope="{row,$index}">
              <img :src="row.skuDefaultImg" style="width:100px;height:100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!-- 分页器 -->
      <el-pagination
        :current-page="page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="limit"
        layout=" prev, pager, next, jumper,sizes,->,total"
        :total="total"
        background
        style="text-align: center; margin-top: 20px"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-card>
    <!-- 
      需要来回切换3个界面,一个是spu列表展示,一个是添加和修改spu,最后一个是添加sku 
      这里打算拆分组件,以免写在一起太多
      -->
    <!-- 给子组件打标签用来调用子组件的函数发请求 -->
    <spuForm v-show="scence == 2" @shiftSpu="backSpu" ref="spuForm"></spuForm>
    <skuForm v-show="scence == 3" ref="skuForm" @shiftSku="back"></skuForm>
  </div>
</template>

<script>
import skuForm from "./skuForm";
import spuForm from "./spuForm";
export default {
  name: "Spu",
  components: { skuForm, spuForm },
  data() {
    return {
      // 当前页
      page: 1,
      limit: 5,
      total: 0,
      scence: 1,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],
      dialogTableVisible:false,
      skuDetail:[],
      loading:true
    };
  },
  methods: {
    // 获取spu的商品列表
    async AttrList(Id, type) {
      if (type == 1) {
        this.category1Id = Id;
        this.category2Id = "";
        this.category3Id = "";
      } else if (type == 2) {
        this.category2Id = Id;
        this.category3Id = "";
      } else {
        this.category3Id = Id;
        // 已经获取category3Id,则发送请求获取数据
        let res = await this.$API.spu.reqSpuInfo(
          this.page,
          this.limit,
          this.category3Id
        );
        if (res.code == 200) {
          this.spuList = res.data.records;
          this.page = res.data.current;
          this.limit = res.data.size;
          this.total = res.data.total;
          return "ok";
        } else {
          return Promise.reject(new Error(res.message));
        }
      }
    },
    // 分页器 当前页数发生改变触发
    handleCurrentChange(page) {
      this.page = page;
      // 再次发请求获取新的数据
      this.AttrList(this.category3Id, 3);
    },
    // 页面展示条数发生变化
    handleSizeChange(limit) {
      this.limit = limit;
      this.AttrList(this.category3Id, 3);
    },
    // 切换添加和修改的显示和隐藏
    addSpu() {
      this.scence = 2;
      // 需要通知子组件发请求,并且将所需要的参数传进去
      this.$refs.spuForm.reqaddSpu(this.category3Id);
    },
    // 点击修改按钮触发事件
    editSpu(row) {
      this.scence = 2;
      this.$refs.spuForm.getSpudata(row);
    },
    // 触发自定义事件
    backSpu(flag) {
      this.scence = 1;
      if (flag == "添加") {
        this.page = 1;
      }
      // 更新列表
      this.AttrList(this.category3Id, 3);
    },
    // 删除spu
    async deleteSpu(row) {
      let res = await this.$API.spu.reqDeleteSpu(row.id);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
      }
      // 更新列表
      this.AttrList(this.category3Id, 3);
    },
    // 点击添加sku
    addSku(category1Id, category2Id, row) {
      this.scence = 3;
      // 调用子组件的方法发请求
      this.$refs.skuForm.getData(category1Id, category2Id, row);
    },
    back() {
      this.scence = 1;
    },
    // 展示详情
    async showDetailInfo(row) {
      this.dialogTableVisible = true
      let res = await this.$API.sku.reqDetail(row.id);
      if (res.code == 200) {
        // 加载动画效果关闭
        this.loading = false
        this.skuDetail = res.data
      }
    },
    // 关闭对话框前处理细节问题
    close(done){
      // 开启loading
      this.loading = true
      // 清空内容解决回显问题
      this.skuDetail = []
      // 关闭对话框
      done()
    }
  },
};
</script>

<style>
</style>