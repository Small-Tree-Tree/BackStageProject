import request from '@/utils/request'

// 获取图片的数据
export const reqSpuImageList = (spuId)=>{
    return request({
        url:`/admin/product/spuImageList/${spuId}`,
        method:'get'
    })
}

// 获取销售属性的数据
export const reqSaleAttrList = (spuId)=>{
    return request({
        url:`/admin/product/spuSaleAttrList/${spuId}`,
        method:'get'
    })
}

// 获取平台属性的数据
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>{
    return request({
        url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method:'get'
    })
}

// 保存sku
export const reqSavSku = (data)=>{
    return request({
        url:"/admin/product/saveSkuInfo",
        method:'post',
        data
    })
}

// 获取sku详情
export const reqDetail = (spuId)=>{
    return request({
        url:`/admin/product/findBySpuId/${spuId}`,
        method:'get'
    })
}

// 获取sku列表
export const reqSkuList = (page,limit)=>{
    return request({
        url:`/admin/product/list/${page}/${limit}`,
        method:'get'
    })
}

// 上架
export const reqPutSale = (skuId)=>{
    return request({
        url:`/admin/product/onSale/${skuId}`,
        method:'get'
    })
}

// 下架
export const reqUnderSale = (skuId)=>{
    return request({
        url:`/admin/product/cancelSale/${skuId}`,
        method:'get'
    })
}

// 获取sku详情
export const reqGetDetail = (skuId)=>{
    return request({
        url: `/admin/product/getSkuById/${skuId}`,
        method:'get'
    })
}