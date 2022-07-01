<template>
  <el-card>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="skuList">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width" align="center"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width" align="center"></el-table-column>
      <el-table-column label="默认图片" width="200" align="center">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" style="width:80px;height:80px;">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80" align="center"></el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80" align="center"></el-table-column>
      <el-table-column prop="prop" label="操作" width="300" align="center">
        <template slot-scope="{row,$index}">
          <HintButton type="success" v-if="row.isSale==1" icon="el-icon-upload2" title="上架" size="mini" @click="putAwaySale(row)"></HintButton>
          <HintButton type="success" v-else icon="el-icon-download" title="下架" size="mini" @click="underSale(row)"></HintButton>
          <HintButton type="primary" icon="el-icon-edit" size="mini" title="编辑" @click="edit"></HintButton>
          <HintButton type="info" icon="el-icon-info" size="mini" title="详情" @click="detailInfo(row)"></HintButton>
          <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除"></HintButton>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
     <el-pagination
      :current-page="page"
      :page-sizes="[10,15,20]"
      :page-size="limit"
      background
      style="text-align:center;margin-top:20px;"
      layout=" prev, pager, next, jumper,sizes,->,total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :total="total">
    </el-pagination>

    <!-- 抽屉 -->
    <el-drawer title="SKU详情" :visible.sync="show" size="45%">
      <ul>
        <li>
          <h3>名称:</h3>
          <p>{{skuDetail.skuName}}</p>
        </li>
        <li>
          <h3>描述:</h3>
          <p>{{skuDetail.skuDesc}}</p>
        </li>
        <li>
          <h3>价格:</h3>
          <p>{{skuDetail.price}}</p>
        </li>
        <li>
          <h3>平台属性:</h3>
           <el-tag type="success" style="margin-right:20px;"
            v-for="val in skuDetail.skuAttrValueList">{{val.valueName}}</el-tag>
        </li>
      </ul>
      <div >
        <h3 style="margin:0 0 20px 20px">商品详情 :</h3>
          <div class="block" style="margin:0 0 20px 20px">
            <el-carousel height="500px" style="width:500px">
              <el-carousel-item v-for="item in skuDetail.skuImageList" :key="item.id">
                <img :src="item.imgUrl" style=" width: 500px; height: 500px; object-fit: contain;">
              </el-carousel-item>
            </el-carousel>
          </div>
      </div>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
    name:'Sku',
    data(){
      return{
        page:1,
        limit:5,
        total:99,
        skuList:[],
        skuDetail:{},
        show:false
      }
    },
    mounted(){
      this.getSkuList()
    },
    methods:{
      // 获取sku列表
      async getSkuList(){
        let res = await this.$API.sku.reqSkuList(this.page,this.limit)
        if(res.code == 200){
          this.total = res.data.total
          this.skuList = res.data.records
        }
      },
      // 当前页发生改变得时候重新发请求获取数据
      handleCurrentChange(currentPage){
        this.page = currentPage
        this.getSkuList()
      },
      // 当每页显示个数发生改变的时候
      handleSizeChange(limit){
        this.limit = limit
        this.getSkuList()
      },
      // 处理上架
      async putAwaySale(row){
        let res = await this.$API.sku.reqPutSale(row.id)
        if(res.code == 200){
          this.$message({
            type:'success',
            message:'上架成功'
          })
          row.isSale = 0
        }
      },
      // 处理下架
      async underSale(row){
        let res = await this.$API.sku.reqUnderSale(row.id)
        if(res.code == 200){
           this.$message({
            type:'success',
            message:'下架成功'
          })
          row.isSale = 1
        }
      },
      // 编辑
      edit(){
         this.$message('该功能正在开发中');
      },
      // 详情 
      async detailInfo(row){
        let res = await this.$API.sku.reqGetDetail(row.id)
        if(res.code == 200){
          this.skuDetail = res.data
          this.show = true
        }
      }
    }
}
</script>

<style scoped>
  *{
    padding: 0;
    margin: 0;
  }
  ul{
    margin-left: 20px;
  }
  ul li {
    list-style: none;
    display: flex;
    align-content: center;
    line-height: 40px;
    margin-bottom: 10px;
  }
  p{
    font-size: 16px;
  }
  h3{
    margin-right: 30px;
  }
</style>

<style>
   .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>