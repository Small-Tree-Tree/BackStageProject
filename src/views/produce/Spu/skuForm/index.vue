<template>
  <el-card>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        <span>{{spu.spuName}}</span>
      </el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" v-model="skuInfo.price"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input placeholder="规格描述" type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form label-width="80px" :inline="true">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id" style="margin-bottom:20px">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option :label="attrValue.valueName" :value="`${attr.id}-${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form label-width="80px" :inline="true">
          <el-form-item :label="sale.saleAttrName" v-for="sale in saleAttrList" :key="sale.id">
            <el-select v-model="sale.saleIdAndValueId" placeholder="请选择">
              <el-option :label="saleValue.saleAttrValueName" :value="`${sale.id}-${saleValue.id}`" v-for="saleValue in sale.spuSaleAttrValueList" :key="saleValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList"  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="width" align="center"></el-table-column>
          <el-table-column label="图片" width="width" align="center">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column
            prop="imgName"
            label="名称"
            width="width"
            align="center"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width" align="center">
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault == 0" @click="defalutSet(row)">设为默认</el-button>
              <el-button type="success" plain v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveSkuInfo">保存</el-button>
        <el-button @click="cancelBtn">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "skuForm",
  data() {
    return {
      spuImageList: [],
      saleAttrList: [],
      attrInfoList: [],
      // 将来发请求
      skuInfo: {
        // 父组件给的
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // v-model收集的数据
        price: '',
        weight: "",
        skuName: "",
        skuDefaultImg: "",
        skuDesc: "",
        // 收集平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        // 收集图片的信息
        skuImageList: [
          // {
          //   imgName: "",
          //   imgUrl: "",
          //   isDefault: "",
          //   spuImgId: 0,
          // },
        ],
        // 收集sku销售属性值
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // },
        ],
      },
      //spu信息
      spu:{},
      // 保存选中的图片信息
      imageList:[]
    };
  },
  methods: {
    // 发送3个请求,由父组件触发
    async getData(category1Id, category2Id, row) {
      this.skuInfo.category3Id = row.category3Id
      this.skuInfo.spuId = row.id
      this.skuInfo.tmId = row.tmId
      this.spu = row

      // 获取spu图片数据
      let spuImageRes = await this.$API.sku.reqSpuImageList(row.id);
      if (spuImageRes.code == 200) {
        let imageList = spuImageRes.data;
        imageList.forEach(item=>{
          item.isDefault = 0
        })
        this.spuImageList = imageList
      }

      // 获取销售属性的数据
      let saleAttrRes = await this.$API.sku.reqSaleAttrList(row.id);
      if (saleAttrRes.code == 200) {
        this.saleAttrList = saleAttrRes.data;
      }

      // 获取平台属性的数据
      let AttrInfoRes = await this.$API.sku.reqAttrInfoList(
        category1Id,
        category2Id,
        row.category3Id
      );
      if (AttrInfoRes.code == 200) {
        this.attrInfoList = AttrInfoRes.data;
      }
    },
    // 点击复选框获取点击的信息
    handleSelectionChange(selection){
      // selection获取选中的商品信息,是一个数组
      this.imageList = selection
    },
    // 设置默认
    defalutSet(current){
      this.spuImageList.forEach(item=>{
        item.isDefault = 0
      })
      current.isDefault = 1
      // 保存默认图片的信息
      this.skuInfo.skuDefaultImg = current.imgUrl
    },
    // 点击取消按钮
    cancelBtn(){
      // 跳转回scence == 1
      this.$emit('shiftSku')
      // 清空spuInfo数据
      Object.assign(this._data,this.$options.data())
    },
    // 保存
    async saveSkuInfo(){
      // 整理平台属性
      let {attrInfoList,skuInfo,saleAttrList,imageList} = this
        skuInfo.skuAttrValueList = attrInfoList.reduce((pre,item)=>{
        // 设置初始值pre为[]
        // 判断item下面是否有attrIdAndValueId,如果有表示用户选择了
        if(item.attrIdAndValueId){
          let [attrId,valueId] = item.attrIdAndValueId.split('-')
          pre.push({attrId,valueId})
          //使用reduce需要将当前的结果作为返回值进行返回,作为下一次的pre
        }
        return pre
      },[])

      // 处理销售属性
      skuInfo.skuSaleAttrValueList = saleAttrList.reduce((pre,item)=>{
        if(item.saleIdAndValueId){
          let [saleAttrId,saleAttrValueId] = item.saleIdAndValueId.split('-')
          pre.push({saleAttrId,saleAttrValueId})
        }
        return pre
      },[])

      //处理图片
      skuInfo.skuImageList = imageList.map(item=>{
        return {
            imgName: item.imgName,
            imgUrl: item.imgUrl,
            isDefault: item.isDefault,
            spuImgId: item.id,
        }
      })

      // 发请求
      let res = await this.$API.sku.reqSavSku(skuInfo)
      if(res.code == 200){
        this.$message({
          type:"success",
          message:'添加SKU成功'
        })
        this.$emit('shiftSku')
        Object.assign(this._data,this.$options.data())
      }
    }
  },
};
</script>

<style>
</style>