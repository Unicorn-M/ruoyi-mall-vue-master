import request from '@/utils/request'

// 查询农家乐增删改查列表
export function listUmsFarmhouse(query, pageReq) {
  return request({
    url: '/ruoyi-mall/umsFarmhouse/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询农家乐增删改查详细
export function getUmsFarmhouse(id) {
  return request({
    url: '/ruoyi-mall/umsFarmhouse/' + id,
    method: 'get'
  })
}

// 新增农家乐增删改查
export function addUmsFarmhouse(data) {
  return request({
    url: '/ruoyi-mall/umsFarmhouse',
    method: 'post',
    data: data
  })
}

// 修改农家乐增删改查
export function updateUmsFarmhouse(data) {
  return request({
    url: '/ruoyi-mall/umsFarmhouse',
    method: 'put',
    data: data
  })
}

// 删除农家乐增删改查
export function delUmsFarmhouse(id) {
  return request({
    url: '/ruoyi-mall/umsFarmhouse/' + id,
    method: 'delete'
  })
}

// 导出农家乐增删改查
export function exportUmsFarmhouse(query) {
  return request({
    url: '/ruoyi-mall/umsFarmhouse/export',
    method: 'get',
    params: query
  })
}
