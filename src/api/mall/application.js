import request from '@/utils/request'

// 查询贫困身份申请列表
export function listUmsApplication(query, pageReq) {
  return request({
    url: '/ruoyi-mall/umsApplication/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询贫困身份申请详细
export function getUmsApplication(id) {
  return request({
    url: '/ruoyi-mall/umsApplication/' + id,
    method: 'get'
  })
}

// 新增贫困身份申请
export function addUmsApplication(data) {
  return request({
    url: '/ruoyi-mall/umsApplication',
    method: 'post',
    data: data
  })
}

// 修改贫困身份申请
export function updateUmsApplication(data) {
  return request({
    url: '/ruoyi-mall/umsApplication',
    method: 'put',
    data: data
  })
}

// 删除贫困身份申请
export function delUmsApplication(id) {
  return request({
    url: '/ruoyi-mall/umsApplication/' + id,
    method: 'delete'
  })
}

// 导出贫困身份申请
export function exportUmsApplication(query) {
  return request({
    url: '/ruoyi-mall/umsApplication/export',
    method: 'get',
    params: query
  })
}
