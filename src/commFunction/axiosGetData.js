import axios from 'axios'
import axiosError from './axiosError'

function axiosGetData (method, url, params, callback) {
  url = 'api/' + url
  this.loading = true

  // get对应接收参数的键名是query,post对应接受参数的键名是data
  var paraKey = null
  switch (method) {
    case 'get': {
      paraKey = 'params'
      break
    }
    case 'post': {
      paraKey = 'data'
      break
    }
  }

  axios({
    method,
    url,
    [paraKey]: params,
    timeout: 10000 // 默认设置超时时间为10秒
  })
    .then(function (res) {
      callback(res)
    })
    .catch(function (err) {
      axiosError(err)
    })
    .finally(function () {
      this.loading = false
    }.bind(this))
}
export default axiosGetData
