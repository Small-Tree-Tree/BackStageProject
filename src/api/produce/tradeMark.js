import request from '@/utils/request'
// 获取分页列表,page:当前页  limit:每页展示数
export const reqTradeMark = (page,limit)=> {
    return request({
        url:`/admin/product/baseTrademark/${page}/${limit}`,
        method:'get'
    })
}

// 添加和修改的品牌
export const reqAddTradeMark = (tradeMark)=>{
    // 如果有id表示修改品牌,否则就是新增品牌
    if(tradeMark.id){
        return request({
            url:'/admin/product/baseTrademark/update',
            method:'put',
            data:tradeMark
        })
    }else{
        return request({
            url:'/admin/product/baseTrademark/save',
            method:'post',
            data:tradeMark
        })
    }
}

// 删除品牌
export const reqDelTradeMark = (id)=>{
    return request({
        url:`/admin/product/baseTrademark/remove/${id}`,
        method:'delete'
    })
}