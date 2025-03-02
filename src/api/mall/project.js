import request from '@/utils/request'

// 查询扶贫项目申请增删改查列表
export function listUmsProject(query, pageReq) {
  return request({
    url: '/ruoyi-mall/umsProject/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询扶贫项目申请增删改查详细
export function getUmsProject(id) {
  return request({
    url: '/ruoyi-mall/umsProject/' + id,
    method: 'get'
  })
}

// 分页查询资讯信息
export function getUmsInformationByPage(query) {
  return request({
    url: '/ruoyi-mall/umsProject/list',
    method: 'get',
    params: query
  })
}

// 新增扶贫项目申请增删改查
export function addUmsProject(data) {
  return request({
    url: '/ruoyi-mall/umsProject',
    method: 'post',
    data: data
  })
}

// 修改扶贫项目申请增删改查
export function updateUmsProject(data) {
  return request({
    url: '/ruoyi-mall/umsProject',
    method: 'put',
    data: data
  })
}

// 删除扶贫项目申请增删改查
export function delUmsProject(id) {
  return request({
    url: '/ruoyi-mall/umsProject/' + id,
    method: 'delete'
  })
}

// 导出扶贫项目申请增删改查
export function exportUmsProject(query) {
  return request({
    url: '/ruoyi-mall/umsProject/export',
    method: 'get',
    params: query
  })
}
