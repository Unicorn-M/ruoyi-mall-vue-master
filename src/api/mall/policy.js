import request from '@/utils/request'

// 查询扶贫信息增删改查列表
export function listUmsPolicy(query, pageReq) {
  return request({
    url: '/ruoyi-mall/umsPolicy/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询扶贫信息增删改查详细
export function getUmsPolicy(id) {
  return request({
    url: '/ruoyi-mall/umsPolicy/' + id,
    method: 'get'
  })
}

// 新增扶贫信息增删改查
export function addUmsPolicy(data) {
  return request({
    url: '/ruoyi-mall/umsPolicy',
    method: 'post',
    data: data
  })
}

// 修改扶贫信息增删改查
export function updateUmsPolicy(data) {
  return request({
    url: '/ruoyi-mall/umsPolicy',
    method: 'put',
    data: data
  })
}

// 删除扶贫信息增删改查
export function delUmsPolicy(id) {
  return request({
    url: '/ruoyi-mall/umsPolicy/' + id,
    method: 'delete'
  })
}

// 导出扶贫信息增删改查
export function exportUmsPolicy(query) {
  return request({
    url: '/ruoyi-mall/umsPolicy/export',
    method: 'get',
    params: query
  })
}
