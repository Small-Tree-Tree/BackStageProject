<template>
  <div>
    <!-- el-form中的:model是将收集到的全部数据交给指定对象 -->
    <el-form :inline="true" class="demo-form-inline" :model="categoryID" :disabled="!show">
      <el-form-item label="一级分类" label-width="100px">
        <!-- el-select里的v-model是将el-option中:value给到指定的属性-->
        <el-select placeholder="请选择" v-model="categoryID.category1Id"  @change="handleCategory2(categoryID.category1Id)">
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in categoryList1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类" label-width="100px">
        <!-- el-select里的v-model是将el-option中:value给到指定的属性-->
        <el-select placeholder="请选择" v-model="categoryID.category2Id" @change="handleCategory3(categoryID.category2Id)">
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in categoryList2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类" label-width="100px">
        <!-- el-select里的v-model是将el-option中:value给到指定的属性-->
        <el-select placeholder="请选择" v-model="categoryID.category3Id" @change="showAttrList(categoryID.category3Id)">
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in categoryList3"
            :key="c3.id"    
          ></el-option>
        </el-select>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: "categorySelect",
  data() {
    return {
      categoryList1: [],
      categoryList2: [],
      categoryList3: [],
      categoryID: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  props:['show'],
  mounted() {
    // 当页面加载就发请求获取一级分类数据
    this.handleCategory1();
  },
  methods: {
    //一级分类请求
    async handleCategory1() {
      let res = await this.$API.attr.reqCategory1();
      if (res.code == 200) {
        this.categoryList1 = res.data;
        return "ok";
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    // 二级分类请求,当一级分类发生改变
    async handleCategory2(c1Id) {
      // 当一级分类发生改变的时候需要清除二级和三级的数据
      this.categoryList2 = ''
      this.categoryList3 = ''
      this.categoryID.category2Id = ''
      this.categoryID.category3Id = ''
      //触发自定义事件,将category1Id传入
      this.$emit('categoryId',c1Id,1)
      let res = await this.$API.attr.reqCategory2(c1Id);
      if (res.code == 200) {
        this.categoryList2 = res.data;
        return "ok";
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    // 三级分类请求,当二级分类发生改变
    async handleCategory3(c2Id) {
      // 当二级分类发生改变的时候需要清除三级的数据
      this.categoryList3 = ''
      this.categoryID.category3Id = ''
      //触发自定义事件,将category2Id传入
      this.$emit('categoryId',c2Id,2)
      let res = await this.$API.attr.reqCategory3(c2Id);
      if (res.code == 200) {
        this.categoryList3 = res.data;
        return "ok";
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    // 当三级分类发生改变的时候,将categoryId3传入
    showAttrList(c3Id){
        this.$emit('categoryId',c3Id,3)
    }
  },
};
</script>

<style>
.el-form-item__label {
  text-align: center;
}
</style>