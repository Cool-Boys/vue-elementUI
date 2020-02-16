import request from '@/utils/request'

export function selectPlatform(query) {
  return request({
    url: '/common/selectPlatform',
    method: 'get',
    params: query
  })
}
export function selectDlGroup(query) {
  return request({
    url: '/common/selectDlGroup',
    method: 'get',
    params: query
  })
}

export function selectRole(query) {
  return request({
    url: '/common/selectRole',
    method: 'get',
    params: query
  })
}

export function selectUsers(query) {
  return request({
    url: '/common/selectUsers',
    method: 'get',
    params: query
  })
}
