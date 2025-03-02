import request from '@/utils/request'

// 查询资讯信息
export function listUmsInfomation(query, pageReq) {
  return request({
    url: '/ruoyi-mall/umsInfomation/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 分页查询资讯信息
export function getUmsInformationByPage(query) {
  return request({
    url: '/ruoyi-mall/umsInfomation/list',
    method: 'get',
    params: query
  })
}



// 查询资讯信息
export function getUmsInfomation(id) {
  return request({
    url: '/ruoyi-mall/umsInfomation/' + id,
    method: 'get'
  })
}

// 新增资讯信息
export function addUmsInfomation(data) {
  return request({
    url: '/ruoyi-mall/umsInfomation',
    method: 'post',
    data: data
  })
}

// 修改资讯信息
export function updateUmsInfomation(data) {
  return request({
    url: '/ruoyi-mall/umsInfomation',
    method: 'put',
    data: data
  })
}

// 删除资讯信息
export function delUmsInfomation(id) {
  return request({
    url: '/ruoyi-mall/umsInfomation/' + id,
    method: 'delete'
  })
}

// 导出资讯信息
export function exportUmsInfomation(query) {
  return request({
    url: '/ruoyi-mall/umsInfomation/export',
    method: 'get',
    params: query
  })
}
