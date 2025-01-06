import request from '@/utils/request'

// 查询订单列表
export function listUmsOrder(query, pageReq) {
  return request({
    url: '/mall/umsOrder/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询订单详细
export function getUmsOrder(id) {
  return request({
    url: '/mall/umsOrder/' + id,
    method: 'get'
  })
}

// 新增订单
export function addUmsOrder(data) {
  return request({
    url: '/mall/umsOrder',
    method: 'post',
    data: data
  })
}

// 修改订单
export function updateUmsOrder(data) {
  return request({
    url: '/mall/umsOrder',
    method: 'put',
    data: data
  })
}

// 删除订单
export function delUmsOrder(id) {
  return request({
    url: '/mall/umsOrder/' + id,
    method: 'delete'
  })
}

// 导出订单
export function exportUmsOrder(query) {
  return request({
    url: '/mall/umsOrder/export',
    method: 'get',
    params: query
  })
}
