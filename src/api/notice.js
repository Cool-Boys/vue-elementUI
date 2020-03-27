import request from '@/utils/request'

export function findByPage(data) {
  return request({
    url: '/Tnotice/findByPage',
    method: 'post',
    data
  })
}

export function findByWhere(query) {
  return request({
    url: '/Tnotice/findByWhere',
    method: 'get',
    params: query
  })
}
export function insert(data) {
  return request({
    url: '/Tnotice/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/Tnotice/update',
    method: 'post',
    data
  })
}
export function deleteData(query) {
  return request({
    url: '/Tnotice/delete',
    method: 'get',
    params: query
  })
}
export function getNotice(query) {
  return request({
    url: '/Tnotice/getNotice',
    method: 'get',
    params: query
  })
}
