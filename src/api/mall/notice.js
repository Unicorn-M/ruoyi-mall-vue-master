import request from '@/utils/request'

// 查询公告信息列表
export function listUmsNotice(query, pageReq) {
  return request({
    url: '/ruoyi-mall/umsNotice/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询公告信息详细
export function getUmsNotice(id) {
  return request({
    url: '/ruoyi-mall/umsNotice/' + id,
    method: 'get'
  })
}

// 新增公告信息
export function addUmsNotice(data) {
  return request({
    url: '/ruoyi-mall/umsNotice',
    method: 'post',
    data: data
  })
}

// 修改公告信息
export function updateUmsNotice(data) {
  return request({
    url: '/ruoyi-mall/umsNotice',
    method: 'put',
    data: data
  })
}

// 删除公告信息
export function delUmsNotice(id) {
  return request({
    url: '/ruoyi-mall/umsNotice/' + id,
    method: 'delete'
  })
}

// 导出公告信息
export function exportUmsNotice(query) {
  return request({
    url: '/ruoyi-mall/umsNotice/export',
    method: 'get',
    params: query
  })
}
