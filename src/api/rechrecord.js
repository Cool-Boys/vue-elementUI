import request from '@/utils/request'

export function findByPage(data) {
  return request({
    url: '/TrechRecord/findByPage',
    method: 'post',
    data
  })
}

export function findByWhere(query) {
  return request({
    url: '/TrechRecord/findByWhere',
    method: 'get',
    params: query
  })
}
export function insert(data) {
  return request({
    url: '/TrechRecord/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/TrechRecord/update',
    method: 'post',
    data
  })
}
export function deleteData(query) {
  return request({
    url: '/TrechRecord/delete',
    method: 'get',
    params: query
  })
}
