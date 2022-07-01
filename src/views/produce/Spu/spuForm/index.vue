<template>
  <el-card>
    <el-form ref="form" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input
          style="width: 300px"
          placeholder="请输入SPU名称"
          v-model="spu.spuName"
        ></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            v-for="item in tradeMarkList"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          placeholder="产品描述"
          type="textarea"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <!-- 
          上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
          所以需要对获取的数据进行整理
         -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <!-- 因为select是收集option的value的值,可以利用这一点收集id和name -->
        <el-select v-model="saleIdAndsaleName" :placeholder="unSelectAttr.length == 0 ?`没有可选的属性了`:`还有${unSelectAttr.length}个属性未选择`">
          <el-option
            v-for="item in unSelectAttr"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}-${item.name}`"
          >
          </el-option>
        </el-select>
        <el-button :disabled="!saleIdAndsaleName" type="primary" icon="el-icon-plus" style="margin-left: 20px" @click="addSaleAttr">添加销售属性</el-button>

        <el-table
          style="width: 100%; margin-top: 30px"
          border
          :data="spu.spuSaleAttrList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>

          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="300"
            align="center"
          ></el-table-column>

          <el-table-column
            prop="prop"
            label="属性值列表"
            width="width"
            align="center"
          >
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(row, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                :ref="$index"
                size="small"
                @blur="handleInputConfirm(row, $index)"
              >
              </el-input>

              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row, $index)"
                >+ 添加</el-button
              >
            </template>

          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template slot-scope="{ row, $index }">
              <el-button
                @click="deletSaleAttr($index)"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" @click="saveSpuInfo">保存</el-button>
        <el-button @click="cancelBtn">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "spuForm",
  data() {
    return {
      // 因为这一块添加spu和修改spu一起的,所以现在在做修改的同时需要考虑到添加
      // 所以不能给spu赋值为空对象,去查看最后文档最后需要提交什么
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: "",
        // 品牌id
        tmId: '',
        // spu名称
        spuName: "",
        // spu图片的数据
        spuImageList: [],
        // spu的售卖属性
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   // spu售卖属性值
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      // 存放品牌列表
      tradeMarkList: [],
      // 存放平台的全部属性
      allSaleAttr: [],
      // 存放图片列表
      spuImageList: [],
      saleIdAndsaleName: "",
      // 照片墙中的对话框图片url
      dialogImageUrl: "",
      // 照片墙显示和隐藏
      dialogVisible: false,
    };
  },
  methods: {
    // 移除照片墙中的图片的时候触发
    handleRemove(file, fileList) {
      // file：是当前删除的图片信息
      // fileList:剩下的图片列表
      // 当触发移除的时候需要更新图片列表的信息
      this.spuImageList = fileList;
    },
    // 处理图片上传成功
    handleSuccess(response, file, fileList) {
      // file：是当前上传成功的图片信息
      // fileList:剩下的图片列表
      this.spuImageList = fileList;
    },
    // 照片墙预览的时候触发
    handlePictureCardPreview(file) {
      // file服务器返回的数据
      // 将服务器返回的url赋值给dialogImageUrl用于展示大图
      this.dialogImageUrl = file.url;
      // 让对话框显示（也就是展示大图）
      this.dialogVisible = true;
    },
    // 发请求获取数据(四个请求)
    async getSpudata(row) {
      // 获取spu基本的数据
      let spuInfo = await this.$API.spu.reqSpuBaseInfo(row.id);
      if (spuInfo.code == 200) {
        this.spu = spuInfo.data;
      }

      // 获取品牌的数据
      let tradeList = await this.$API.spu.reqTradeList();
      if (tradeList.code == 200) {
        this.tradeMarkList = tradeList.data;
      }

      // 获取平台的全部属性
      let SaleAttr = await this.$API.spu.reqSaleAttr();
      if (SaleAttr.code == 200) {
        this.allSaleAttr = SaleAttr.data;
      }

      // 发请求获取spu图片
      let spuImageList = await this.$API.spu.reqSpuImage(row.id);
      if (spuImageList.code == 200) {
        /*
          在这里需要对获取的数据进行修改,为了能够在照片墙上显示多张图片
          到时候上传保存数据的时候,记得去掉添加的属性 
          格式 :　[{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
         */
        let originSpuImageList = spuImageList.data;
        originSpuImageList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = originSpuImageList;
      }
    },
    //处理删除属性值
    handleClose(row, index) {
      // index:是属性值的索引
      // row是当前spu.spuSaleAttrList下的每个对象
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 点击添加按钮（添加售卖属性值）
    showInput(row, index) {
      // 当点击添加的时候展示input框
      // 在row也就是spu.spuSaleAttrList下的每个对象添加inputVisible和inputValue属性
      // 用于input和button切换和input值的收集
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 失去焦点展示button
    handleInputConfirm(row, index) {
      // 展示标签,需要整理成 有baseSaleAttrId,saleAttrValueName形式
      const { baseSaleAttrId, inputValue } = row;
      // 判断输入的属性值是否有重复
      let res = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName == inputValue;
      });
      // 需要判断inputvalue是否为空
      if (inputValue.trim() == "") {
        this.$message({
          message: "属性值不能为空",
          type: "warning",
        });
        row.inputVisible = true;
        // 自动获取焦点
        this.$nextTick(() => {
          this.$refs[index].focus();
        });     
      } else if (res) {
        // 判断inputvalue是否重复
        this.$message({
          message: "属性值不能重复",
          type: "warning",
        });
        row.inputVisible = true;
        // 自动获取焦点
        this.$nextTick(() => {
          this.$refs[index].focus();
        });
      } else {
        let newsaleAttrval = { baseSaleAttrId, saleAttrValueName: inputValue };
        row.spuSaleAttrValueList.push(newsaleAttrval);
        // 展示button
        row.inputVisible = false;
      }
    },
    // 删除一行属性
    deletSaleAttr(index){
     this.spu.spuSaleAttrList.splice(index,1)
    },
    // 添加销售属性
    addSaleAttr(){
      // 将收集到的数据进行拆分整理
      // 返回的是一个数组,对数组进行解构
      let [baseSaleAttrId,saleAttrName] = this.saleIdAndsaleName.split('-')
      let newarr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      // 将整理好的参数追加
      this.spu.spuSaleAttrList.push(newarr)
      //清除saleIdAndsaleName
      this.saleIdAndsaleName = ''
    },
    //保存上传到服务器上
    async saveSpuInfo(){
      // 检查后发现还需要整理需要imgUrl和imgName属性
      const {spuImageList,spu} = this
      spu.spuImageList = spuImageList.map(item=>{
        return{
          imgName:item.name,
          // 这里需要考虑到新增的图片,url是本地的地址,需要到response中去获取
          imgUrl:(item.response && item.response.data) || item.url
        }
      })
      // 发请求
      let res = await this.$API.spu.addOrUpdate(spu)
      if(res.code == 200){
        // 提示用户
        this.$message({
          type:"success",
          message:`${spu.id?'修改成功':'添加成功'}`
        })
        // 清空spu
        Object.assign(this._data,this.$options.data())
        // 如果成功需要返回scence = 1
        let flag =`${spu.id?'修改':'添加'}`
        this.$emit('shiftSpu',flag)      
      }
    },
    // 点击添加spu触发请求
    async reqaddSpu(category3Id){
      // 获取品牌的数据
      let tradeList = await this.$API.spu.reqTradeList();
      if (tradeList.code == 200) {
        this.tradeMarkList = tradeList.data;
      }

      // 获取平台的全部属性
      let SaleAttr = await this.$API.spu.reqSaleAttr();
      if (SaleAttr.code == 200) {
        this.allSaleAttr = SaleAttr.data;
      }

      this.spu.category3Id = category3Id
    },
    // 点击取消按钮
    cancelBtn(){
      this.$emit('shiftSpu')
      // 清空spu
      Object.assign(this._data,this.$options.data())
    }
  },
  computed:{
    // 计算出未选的属性
    unSelectAttr(){
      // filter和every结合使用
      /* 
        在全部属性中筛选出没有被选的属性名
        filter:返回的是一个新的数组,retun 为真表示是需要收集的数据
        配合every,every返回的值是boolean,所有item都满足条件才为真
       */
      let newarr = this.allSaleAttr.filter(item1=>{
        return this.spu.spuSaleAttrList.every(item2=>{
          return item1.name != item2.saleAttrName
        })
      })
      return newarr
    }
  }
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>