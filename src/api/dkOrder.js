import request from '@/utils/request'

export function findByPage(data) {
  return request({
    url: '/TdkOrder/findByPage',
    method: 'post',
    data
  })
}

export function findByWhere(query) {
  return request({
    url: '/TdkOrder/findByWhere',
    method: 'get',
    params: query
  })
}
export function insert(data) {
  return request({
    url: '/TdkOrder/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/TdkOrder/update',
    method: 'post',
    data
  })
}
export function deleteData(query) {
  return request({
    url: '/TdkOrder/delete',
    method: 'get',
    params: query
  })
}

export function getCourseInfo(data) {
  return request({
    url: '/TdkOrder/getCourseInfo',
    method: 'post',
    data
  })
}

export function getCourseInfoByUserId(data) {
  return request({
    url: '/TdkOrder/getCourseInfoByUserId',
    method: 'post',
    data
  })
}
export function saveOrder(data) {
  return request({
    url: '/TdkOrder/saveOrder',
    method: 'post',
    data
  })
}

export function zfOrder(query) {
  return request({
    url: 'http://api2.xiuxiu888.com/creat_order',
    method: 'get',
    params: query
  })
}

