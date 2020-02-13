import request from '@/utils/request'

export function findByPage(data) {
  return request({
    url: '/TdlGroup/findByPage',
    method: 'post',
    data
  })
}

export function findByWhere(query) {
  return request({
    url: '/TdlGroup/findByWhere',
    method: 'get',
    params: query
  })
}
export function insert(data) {
  return request({
    url: '/TdlGroup/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/TdlGroup/update',
    method: 'post',
    data
  })
}
export function deleteData(query) {
  return request({
    url: '/TdlGroup/delete',
    method: 'get',
    params: query
  })
}
