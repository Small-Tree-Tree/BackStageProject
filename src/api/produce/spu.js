import request from '@/utils/request'
// 获取spu基本信息
export const reqSpuInfo = (page,limit,Id)=>{
    /*
        在axios中,想要传param参数是直接加在url后面
        data字段是仅适用 'PUT', 'POST', 'DELETE 和 'PATCH' 请求方法
        params字段是用来传query参数的
     */
    return request({
        url:`/admin/product/${page}/${limit}`,
        method:'get',
        params:{category3Id:Id}
    })
}

// 获取品牌的数据
export const reqTradeList = ()=>{
    return request({
        url:'/admin/product/baseTrademark/getTrademarkList',
        method:'get'
    })
}

// 获取平台全部的销售属性
export const reqSaleAttr = ()=>{
    return request({
        url:'/admin/product/baseSaleAttrList'
    })
}

// 获取spu信息
export const reqSpuBaseInfo = (spuId)=>{
    return request({
        url:`/admin/product/getSpuById/${spuId}`,
        method:"get"
    })
}

//获取spu图片
export const reqSpuImage = (spuId) =>{
    return request({
        url:`/admin/product/spuImageList/${spuId}`,
        method:'get'
    })
}

// 对于修改和添加携带的参数大致是一样的,区别在于是否有id
export const addOrUpdate = (spuInfo)=>{
    if(spuInfo.id){
        return request({
            url:'/admin/product/updateSpuInfo',
            method:'post',
            data:spuInfo
        })
    }else{
        return request({
            url:'/admin/product/saveSpuInfo',
            method:'post',
            data:spuInfo
        })
    }
}

//删除spu
export const reqDeleteSpu = (spuId)=>{
    return request({
        url:`/admin/product/deleteSpu/${spuId}`,
        method:'delete'
    })
}