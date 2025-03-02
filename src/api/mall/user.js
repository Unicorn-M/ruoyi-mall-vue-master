import request from '@/utils/request'

// 查询农家信息增删改查列表
export function listUmsUser(query, pageReq) {
  return request({
    url: '/ruoyi-mall/umsUser/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询农家信息增删改查详细
export function getUmsUser(id) {
  return request({
    url: '/ruoyi-mall/umsUser/' + id,
    method: 'get'
  })
}

// 分页查询资讯信息
export function getUmsInformationByPage(query) {
  return request({
    url: '/ruoyi-mall/umsUser/list',
    method: 'get',
    params: query
  })
}

// 新增农家信息增删改查
export function addUmsUser(data) {
  return request({
    url: '/ruoyi-mall/umsUser',
    method: 'post',
    data: data
  })
}

// 修改农家信息增删改查
export function updateUmsUser(data) {
  return request({
    url: '/ruoyi-mall/umsUser',
    method: 'put',
    data: data
  })
}

// 删除农家信息增删改查
export function delUmsUser(id) {
  return request({
    url: '/ruoyi-mall/umsUser/' + id,
    method: 'delete'
  })
}

// 导出农家信息增删改查
export function exportUmsUser(query) {
  return request({
    url: '/ruoyi-mall/umsUser/export',
    method: 'get',
    params: query
  })
}
