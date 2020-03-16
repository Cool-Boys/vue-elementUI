import request from '@/utils/request'

export function findByWhere(query) {
  return request({
    url: '/TdkOrderDetail/findByWhere',
    method: 'get',
    params: query
  })
}
export function update(data) {
  return request({
    url: '/TdkOrderDetail/update',
    method: 'post',
    data
  })
}
export function UpdateDetail(data) {
  return request({
    url: '/TdkOrderDetail/UpdateDetail',
    method: 'post',
    data
  })
}

export function getDetailById(data) {
  return request({
    url: '/TdkOrderDetail/getDetailById',
    method: 'post',
    data
  })
}

