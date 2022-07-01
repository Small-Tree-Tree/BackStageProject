// 将4歌接口文件所有分别暴露出来的文件统一默认暴露
import * as tradeMark from "./produce/tradeMark.js"
import * as attr from "./produce/attr.js"
import * as sku from "./produce/sku.js"
import * as spu from "./produce/spu.js"

export default {
    tradeMark,
    attr,
    sku,
    spu
}