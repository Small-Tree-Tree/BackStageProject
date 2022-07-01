
1.现在先做修改spu,在进行切换修改页面的需要动态展示数据
那么需要发请求获取数据

问题一:点击父组件中的修改spu按钮让子组件发送四个请求
怎么做?

思路一:在子组件的mounted中请求,显然是不行,它只能触发一次.
为什么只会触发一次?
结论:切换子组件显示隐藏使用的是v-show,所以当父组件一挂载,子组件也会挂载完毕,只是不显示罢了

思路二:给子组件打ref,通过ref不仅可以获取子组件节点,还可以获取到子组件的数据和方法,
那么给修改按钮绑定点击事件并且获取子组件方法进行调用,就可以解决每次点击都能让子组件发请求


知识点: 
reduce使用的例子
每一次运行都会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。
第一次执行回调函数时，不存在“上一次的计算结果”。如果需要回调函数从数组索引为 0 的元素开始执行，则需要传递初始值。
否则，数组索引为 0 的元素将被作为初始值 initialValue，迭代器将从第二个元素开始执行（索引为 1 而不是 0）。

计算: 1+2+3+4
const array1 = [1, 2, 3, 4];
const sumWithInitial = array1.reduce((previousValue, currentValue) =>{
    return  previousValue + currentValue
},0);


知识点:
// es6新增语法可以合并对象
Object.assign(a,b)
注意: b会覆盖a
项目中的例子
this._data,可以操作data中的响应式数据
this.$options.data() 可以去操作配置对象的data函数的执行,返回的是响应式数据为空
// 清空响应式数据
Object.assign(this._data,this.$options.data())


知识点:
<!-- $attrs传入的数据没有被props接收都会到$attrs, 绑定在该组件上的事件-->
<!-- $listeners 绑定在该组件上的事件-->
<a :title="title">
    <el-button  v-bind="$attrs" v-on="$listeners" style="margin:auto 10px"></el-button>
</a>

知识点:
图片自适应
方法一 :object-fit 属性
img {
    width: 400px;
    height: 400px;
    object-fit: contain;
}

方法二：
background　我们把图片作为背景，然后用background-size属性进行调节
.img-container{
    width:688px;
    height:304px;
    background: black url(./test.png) no-repeat center center;
    background-size: contain;
}

知识点:
插槽:
子组件的数据来源于父组件,并且子组件的结构和样式由父组件决定

子组件
<slot name="footer"></slot>

父组件
<template slot="footer">
    
</template>
