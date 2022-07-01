import request from '@/utils/request'

// 获取一级分类
export const reqCategory1 = ()=>{
    return request({
        url:'/admin/product/getCategory1',
        method:'get'
    })
}

// 获取二级分类
export const reqCategory2 = (category1Id)=>{
    return request({
        url:`/admin/product/getCategory2/${category1Id}`,
        method:'get'
    })
}

// 获取三级分类
export const reqCategory3 = (category2Id)=>{
    return request({
        url:`/admin/product/getCategory3/${category2Id}`,
        method:'get'
    })
}

// 获取商品基本属性列表
export const reqAttrList = ({category1Id,category2Id,category3Id})=>{
    return request({
        url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method:'get'
    })
}

// 保存属性名和属性值
export const savAttrNameAndVal = (data)=>{
    return request({
        url:"/admin/product/saveAttrInfo",
        method:'post',
        data
    })
}