import request from '@/utils/request'

// 查询用户信息表列表
export function listAdmin(query, pageReq) {
  return request({
    url: '/mall/umsAdmin/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询用户信息表详细
export function getAdmin(userId) {
  return request({
    url: '/mall/umsAdmin/' + userId,
    method: 'get'
  })
}

// 新增用户信息表
export function addAdmin(data) {
  return request({
    url: '/mall/umsAdmin',
    method: 'post',
    data: data
  })
}

// 修改用户信息表
export function updateAdmin(data) {
  return request({
    url: '/mall/umsAdmin',
    method: 'put',
    data: data
  })
}

// 删除用户信息表
export function delAdmin(userId) {
  return request({
    url: '/mall/umsAdmin/' + userId,
    method: 'delete'
  })
}

// 导出用户信息表
export function exportAdmin(query) {
  return request({
    url: '/mall/umsAdmin/export',
    method: 'get',
    params: query
  })
}
