import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/userinfo',
    method: 'get',
    params: { token }
  })
}

export function checkUser(query) {
  return request({
    url: '/tusers/checkUser',
    method: 'get',
    params: query
  })
}
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function findByPage(data) {
  return request({
    url: '/tusers/findByPage',
    method: 'post',
    data
  })
}

export function findByWhere(query) {
  return request({
    url: '/tusers/findByWhere',
    method: 'get',
    params: query
  })
}
export function insert(data) {
  return request({
    url: '/tusers/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/tusers/update',
    method: 'post',
    data
  })
}
export function deleteData(query) {
  return request({
    url: '/tusers/delete',
    method: 'get',
    params: query
  })
}

