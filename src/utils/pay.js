import axios from 'axios'

export function getPay(param) {
  axios.get('http://api2.xiuxiu888.com/creat_order', param).then(function(res) {
    this.goodsList = res.data
  }).catch(function(error) {
    console.log(error)
  })
}
