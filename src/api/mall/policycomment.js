import request from '@/utils/request'

// 查询扶贫政策评论增删改查列表
export function listUmsPolicycomment(query, pageReq) {
  return request({
    url: '/ruoyi-mall/umsPolicycomment/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询扶贫政策评论增删改查详细
export function getUmsPolicycomment(id) {
  return request({
    url: '/ruoyi-mall/umsPolicycomment/' + id,
    method: 'get'
  })
}

// 分页查询资讯信息
export function getUmsInformationByPage(query) {
  return request({
    url: '/ruoyi-mall/umsPolicycomment/list',
    method: 'get',
    params: query
  })
}

// 新增扶贫政策评论增删改查
export function addUmsPolicycomment(data) {
  return request({
    url: '/ruoyi-mall/umsPolicycomment',
    method: 'post',
    data: data
  })
}

// 修改扶贫政策评论增删改查
export function updateUmsPolicycomment(data) {
  return request({
    url: '/ruoyi-mall/umsPolicycomment',
    method: 'put',
    data: data
  })
}

// 删除扶贫政策评论增删改查
export function delUmsPolicycomment(id) {
  return request({
    url: '/ruoyi-mall/umsPolicycomment/' + id,
    method: 'delete'
  })
}

// 导出扶贫政策评论增删改查
export function exportUmsPolicycomment(query) {
  return request({
    url: '/ruoyi-mall/umsPolicycomment/export',
    method: 'get',
    params: query
  })
}
