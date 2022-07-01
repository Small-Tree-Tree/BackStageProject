<template>
   <div class="wrapper">
    <!-- 标题 -->
     <div class="card-title">
        <p>{{title}}</p>
        <i class="iconfont icon-info1"></i>
    </div>

    <!-- 数据-->
    <div class="card-num"><span>{{num}}</span></div>

    <!-- 可视化数据 -->
    <div class="card-charts">
        <!-- 因为这里的结构不一致所以使用作用域插槽 ,这里使用具名插槽用于区分-->
        <slot name="charts"></slot>
    </div>

    <!-- 底部 -->
    <div class="card-footer">
        <slot name="footer"></slot>
    </div>
   </div>
</template>

<script>
import "@/styles/iconfont/iconfont.css"
export default {
    name:'Card',
    props:['title','num']
}
</script>

<style scoped>
    .card-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .card-num span{
        font-size: 30px;
    }
    .card-charts{
        display: flex;
        height: 60px;
        width: 100%;
        align-items: center;
        border-bottom: 1px solid #e4e4e4;
    }
    .card-footer{
        height: 14px;
        width: 100%;
    }
</style>