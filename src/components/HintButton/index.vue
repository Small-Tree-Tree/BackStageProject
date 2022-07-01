<template>
<!-- $attrs传入的数据没有被props接收都会到$attrs, 绑定在该组件上的事件-->
  <a :title="title">
    <el-button  v-bind="$attrs" v-on="$listeners" style="margin:auto 10px"></el-button>
  </a>
</template>

<script>
export default {
    name:'HintButton',
    props:['title'],
}
</script>

<style>

</style>