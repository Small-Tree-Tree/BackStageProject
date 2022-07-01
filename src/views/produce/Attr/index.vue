<template>
  <div>
    <el-card style="margin: 30px auto">
      <!-- 因为这里categorySelect结构在其他的地方也会用到,所以封装成全局组件 -->
      <categorySelect @categoryId="AttrList" :show="isShow"></categorySelect>
    </el-card>

    <el-card>
      <div v-show="isShow">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          :disabled="!categoryID.category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="180"
            align="center"
          ></el-table-column>

          <el-table-column
            prop="attrName"
            label="属性名称"
            width="180"
            align="center"
          ></el-table-column>

          <el-table-column label="属性列表" align="center">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="val in row.attrValueList"
                style="margin-right: 15px"
                >{{ val.valueName }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" align="center">
            <template slot-scope="{ row }">
              <HintButton
                title="修改"
                type="warning"
                icon="el-icon-edit"
                @click="getOldDate(row)"
                ></HintButton
              >
              <HintButton type="danger" icon="el-icon-delete" title="删除"></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShow">
        <el-form ref="form" label-width="100px">
          <el-form-item label="属性名称">
            <el-input
              v-model="attrInfo.attrName"
              placeholder="请输入属性名"
              style="width: 180px"
              ref="inputAttrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShow = !isShow">取消</el-button>

        <el-table
          :data="attrInfo.attrValueList"
          style="width: 100%; margin: 20px auto"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>

          <el-table-column
            prop="valueName"
            label="属性值名称"
            align="center"
            width="width"
          >
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                @blur="blurValeName(row, $index)"
                @keyup.native.enter="blurValeName(row, $index)"
                v-if="row.flag"
                :ref="$index"
              ></el-input>
              <p v-else>{{ row.valueName }}</p>
            </template>
          </el-table-column>

          <el-table-column
            prop="prop"
            label="操作"
            align="center"
            width="width"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                @click="onFocus(row, $index)"
                style="margin-right:20px"
              ></el-button>

              <el-popconfirm  @onConfirm="removeVale($index)" :title="`确定要删除 ${row.valueName} ?`">
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button
          type="primary"
          :disabled="attrInfo.attrValueList.length < 1"
          @click="saveAttrInfo"
          >保存</el-button
        >
        <el-button @click="isShow = !isShow">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      categoryID: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      // 属性列表
      attrList: [],
      isShow: true,
      attrInfo: {
        // 属性名
        attrName: "",
        // 属性值
        attrValueList: [],
        categoryId: "",
        categoryLevel: "",
      },
    };
  },
  methods: {
    // 获取属性列表
    async AttrList(Id, type) {
      if (type == 1) {
        this.categoryID.category1Id = Id;
        // 清除上一次的id
        this.categoryID.category2Id = "";
        this.categoryID.category3Id = ""; 
      } else if (type == 2) {
        this.categoryID.category2Id = Id;
        this.categoryID.category3Id = "";
      } else {
        this.categoryID.category3Id = Id;
        // 当得到了category3Id就表示可以发送请求了
        let res = await this.$API.attr.reqAttrList(this.categoryID);
        if (res.code == 200) {
          this.attrList = res.data;
          return "ok";
        } else {
          return Promise.reject(new Error("fail"));
        }
      }
    },
    // 添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        // 因为attrId是服务器给的所以这给undefined
        attrId: this.attrInfo.id,
        valueName: "",
        // 用于切换input和p标签
        flag: true,
      });
    },
    // 添加属性
    addAttr() {
      // 显示添加属性的页面
      this.isShow = !this.isShow;
      // 清除上次存留的记录
      this.attrInfo = {
        // 属性名
        attrName: "",
        // 属性值
        attrValueList: [],
        categoryId: this.categoryID.category3Id,
        categoryLevel: 3,
      };
      //聚焦
      this.$nextTick(() => {
        this.$refs.inputAttrName.focus();
      });
    },
    // 失去焦点切换查看
    blurValeName(row, index) {
        row.flag = false;
        //判断输入的值是否为空
      if (row.valueName.trim() == "") {
        this.$message({
          message: "属性值不能为空",
          type: "warning",
        });
        row.flag = true;
        this.$nextTick(() => {
          this.$refs[index].focus();
        });
      }
      // 判断是否重复,some（）方法如果有重复则返回true
      let res = this.attrInfo.attrValueList.some((item) => {
        // row表示的是当前的值，那么就拿当前的值去和前面的值进行比较
        // row != item 相当于除去当前的对象和之前的对象进行比较
        if (row != item) {
          return row.valueName == item.valueName;
        }
      });
      if (res) {
        this.$message({
          message: "属性值不能重复",
          type: "warning",
        });
        row.flag = true;
        this.$nextTick(() => {
          this.$refs[index].focus();
        });
      }
    },
    // 修改属性值,切换为input，并且自动获取焦点
    onFocus(row, index) {
      row.flag = true;
      /**
       * 需要注意的是
       * $index是动态的所以不能使用点的方式进行读取
       * 当我们点击的时候input的才渲染出来需要时间，
       * 所以使用nextTick，等dom更新完执行一次
       */
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 修改已有的数据
    getOldDate(row) {
      // 切换
      this.isShow = !this.isShow;
      // 将数据交给修改数据页,进行遍历
      // 需要注意：再这里遇到和之前的一样的问题就是指向同一个地址，导致一个地方被修改另一个地方也被修改
      // 因为结构复杂，不能使用浅拷贝（{...row}），需要使用深拷贝
      this.attrInfo = cloneDeep(row);
      // 再这里又出现了问题，因为原有的数据是没有flag，所以这里需要进行加工
      // 需要使用$set(),不然不是响应式数据
      this.attrInfo.attrValueList.forEach((item) => {
        // 第一个参数：哪个对象 第二个参数：添加哪个属性 第三个参数：属性值
        this.$set(item, "flag", false);
      });
    },
    // 保存提交到数据库
    async saveAttrInfo() {
      // 需要整理参数,因为之前为了切换修改和查看模式,填加了flag属性,所以需要去掉
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // filter方法:返回 true 表示该元素通过测试，保留该元素，false 则不保留
          // filter会返回一个新的数组
          // 需要筛选出属性值不为0,并且去除flag属性
          if (item.valueName != "") {
            delete item.flag;
            return true;
          }
        }
      );
      let res = await this.$API.attr.savAttrNameAndVal(this.attrInfo);
      if (res.code == 200) {
        // 返回属性列表,并且更新列表
        this.isShow = true;
        this.AttrList(this.attrInfo.categoryId, 3);
        return "ok";
      } else {
        return Promise.reject(new Error(res.message));
      }
    },
    // 删除属性值
    removeVale(index) {
      this.attrInfo.attrValueList.splice(index,1)
    },
  },
};
</script>

<style>
.el-form-item__label {
  text-align: center;
}
</style>