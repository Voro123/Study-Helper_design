function axiosError (err) {
  console.log(err)
  var status = err.request && err.request.status
  switch (status) {
    case 0: {
      alert('请求超时了,请稍后重试')
      break
    }
    case 504: {
      alert('后台服务器没有响应,请稍后重试')
      break
    }
    default: {
      alert('发生了预料之外的错误,' + err)
      console.log(err)
      break
    }
  }
}
export default axiosError
