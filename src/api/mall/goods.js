import request from '@/utils/request'

// 查询商品信息列表
export function listGoods(query, pageReq) {
  return request({
    url: '/mall/umsGoods/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询商品信息详细
export function getGoods(id) {
  return request({
    url: '/mall/umsGoods/' + id,
    method: 'get'
  })
}

// 新增商品信息
export function addGoods(data) {
  return request({
    url: '/mall/umsGoods',
    method: 'post',
    data: data
  })
}

// 修改商品信息
export function updateGoods(data) {
  return request({
    url: '/mall/umsGoods',
    method: 'put',
    data: data
  })
}

// 删除商品信息
export function delGoods(id) {
  return request({
    url: '/mall/umsGoods/' + id,
    method: 'delete'
  })
}

// 导出商品信息
export function exportGoods(query) {
  return request({
    url: '/mall/umsGoods/export',
    method: 'get',
    params: query
  })
}
