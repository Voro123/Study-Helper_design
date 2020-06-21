import axios from 'axios'
import axiosError from './axiosError'

function axiosGetData (url, params, callback) {
  url = 'api/' + url
  this.loading = true

  axios.get(url, {
    params,
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
