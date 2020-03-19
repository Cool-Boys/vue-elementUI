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

export function getPayData(data) {
  return request({
    url: '/common/getPayData',
    method: 'post',
    data
  })
}

export function getPayDataStatus(data) {
  return request({
    url: '/common/getPayDataStatus',
    method: 'post',
    data
  })
}

export function getPayAmountData(data) {
  return request({
    url: '/common/getPayAmountData',
    method: 'post',
    data
  })
}

export function getPayAmountDataStatus(data) {
  return request({
    url: '/common/getPayAmountDataStatus',
    method: 'post',
    data
  })
}
