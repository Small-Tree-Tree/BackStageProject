<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 20px"
      @click="showDialog"
    >
      添加
    </el-button>

    <!-- 表单 -->
    <!-- :data传的数组,需要注意它是按列进行遍历 -->
    <el-table style="width: 100%" border :data="brandList">
      <el-table-column
        type="index"
        label="序号"
        width="100"
        stripe:true
        align="center"
      >
      </el-table-column>
      <!-- prop展示的是当前item下的属性 -->
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        stripe:true
        align="center"
      >
      </el-table-column>
      <!-- 这里就需要用到插槽的知识,子组件的数据是来源于父组件,并且自己没有办法修改样式和结构需要交给父组件 -->
      <!-- 	
        自定义列的内容，参数为 { row, column, $index } ,这是饿了么封装过的
        row: 可以拿到当前item(对象)
      -->
      <el-table-column
        prop="logoUrl"
        label="品牌LOGO"
        width="width"
        stripe:true
        align="center"
      >
        <template slot-scope="{ row, column, $index }">
          <img :src="row.logoUrl" style="height: 30px; width: 120px" />
        </template>
      </el-table-column>
      
      <el-table-column
        prop="prop"
        label="操作"
        width="width"
        stripe:true
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            style="margin-right: 40px"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹框 新增品牌和修改品牌 -->
    <el-dialog
      :title="tradeForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
      status-icon
    >
      <!-- :model这个属性表示将表单的数据收集到哪里 ,后面表单验证也需要它-->
      <!-- 只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。 -->
      <el-form :model="tradeForm" :rules="rules" ref="ruleFrom">
        <el-form-item
          label="品牌名称"
          :label-width="formLabelWidth"
          prop="tmName"
        >
          <!--  品牌名称 -->
          <el-input v-model="tradeForm.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="品牌图片"
          :label-width="formLabelWidth"
          prop="logoUrl"
        >
          <!-- 上传图片 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="tradeForm.logoUrl"
              :src="tradeForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 分页器 -->
    <el-pagination
      style="text-align: center; margin-top: 20px"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[5,10,15,20]"
      :pager-count="5"
      background
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      // 当前页
      page: 1,
      // 每页展示多少数据
      limit: 8,
      total: 99,
      brandList: [],
      // 收集表单数据
      tradeForm: {
        tmName: "",
        logoUrl: "",
      },
      // 对话框的显示与隐藏
      dialogFormVisible: false,
      formLabelWidth: "120px",
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请上传品牌Logo" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取分页数据
    async getPageList() {
      let { page, limit } = this;
      // 需要传两个参数
      let res = await this.$API.tradeMark.reqTradeMark(page, limit);
      if (res.code == 200) {
        this.brandList = res.data.records;
        this.total = res.data.total;
        this.limit = res.data.size;
        return "ok";
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    // 处理当前页发生改变
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.getPageList();
    },
    // 处理每页条数发生变化
    handleSizeChange(pagesize) {
      this.limit = pagesize;
      this.getPageList();
    },
    // 处理对话框的显示与隐藏
    showDialog() {
      this.dialogFormVisible = true;
      //清除上次的数据
      this.tradeForm.logoUrl = "";
      this.tradeForm.tmName = "";
    },
    // 处理添加品牌和修改事件
    addOrUpdateTradeMark() {
      // 表单验证,判断是否全部为成功
      this.$refs.ruleFrom.validate(async (success) => {
        if (success) {
          // 将收集到的数据发送给服务器
          let result = await this.$API.tradeMark.reqAddTradeMark(
            this.tradeForm
          );
          console.log(result);
          if (result.code == 200) {
            // 成功弹出提示告诉用户
            this.$message({
              message: this.tradeForm.id ? "修改品牌成功!" : "添加品牌成功!",
              type: "success",
            });
            // 重新更新列表
            this.getPageList();
            this.dialogFormVisible = false;
            return "ok";
          } else {
            this.$message.error(
              this.tradeForm.id ? "修改品牌失败!" : "添加品牌失败!"
            );
            this.dialogFormVisible = false;
            return Promise.reject(new Error(result.message));
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 处理修改品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      this.tradeForm = { ...row };
    },
    // 处理删除品牌事件
    deleteTradeMark(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 点击确定走的回调
          let res = await this.$API.tradeMark.reqDelTradeMark(row.id);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getPageList()
          }
        })
        .catch(() => {
          // 点击失败走的回调
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 处理上传成功
    handleAvatarSuccess(res, file) {
      // 图片上传成功会执行一次该函数
      // res 和 file都可以拿到服务器返回的数据,file数据更详细
      this.tradeForm.logoUrl = res.data;
    },
    // 处理在上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>