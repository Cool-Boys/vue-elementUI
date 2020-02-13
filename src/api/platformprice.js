import request from '@/utils/request'

export function findByPage(data) {
  return request({
    url: '/TplatformPrice/findByPage',
    method: 'post',
    data
  })
}

export function findByWhere(query) {
  return request({
    url: '/TplatformPrice/findByWhere',
    method: 'get',
    params: query
  })
}
export function insert(data) {
  return request({
    url: '/TplatformPrice/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/TplatformPrice/update',
    method: 'post',
    data
  })
}
export function deleteData(query) {
  return request({
    url: '/TplatformPrice/delete',
    method: 'get',
    params: query
  })
}
