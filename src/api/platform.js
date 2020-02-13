import request from '@/utils/request'

export function findByPage(data) {
  return request({
    url: '/Tplatform/findByPage',
    method: 'post',
    data
  })
}

export function findByWhere(query) {
  return request({
    url: '/Tplatform/findByWhere',
    method: 'get',
    params: query
  })
}
export function insert(data) {
  return request({
    url: '/Tplatform/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/Tplatform/update',
    method: 'post',
    data
  })
}
export function deleteData(query) {
  return request({
    url: '/Tplatform/delete',
    method: 'get',
    params: query
  })
}
