var vueBody = null
export default function () {
  const elWords = document.querySelectorAll('.container> div > div[id^=word-]')
  vueBody = this

  // 遍历词条元素,并分别为它们设置监听钩子函数
  elWords.forEach(el => {
    el.addEventListener('dragstart', ondragstart)
    el.addEventListener('dragend', ondragend)
    el.addEventListener('dragover', ondragover, true)
    el.addEventListener('dragleave', ondragleave, true)
    el.addEventListener('drop', ondrop)
  })
}

// el元素开始被拖动时
function ondragstart (event) {
  event.dataTransfer.setData('text/plain', event.currentTarget.id)
  event.dataTransfer.dropEffect = 'move'
}

// el元素拖动时被松开
function ondragend (event) {
  event.dataTransfer.clearData('text/plain')
  event.preventDefault()
}

// 某个元素进入el元素的范围时
function ondragover (event) {
  if (!event.currentTarget.classList.contains('dragover')) {
    event.currentTarget.classList.add('dragover')
  }

  event.stopPropagation()
  event.preventDefault()
}

// 某个元素离开el元素的范围时
function ondragleave (event) {
  if (event.currentTarget.classList.contains('dragover')) {
    event.currentTarget.classList.remove('dragover')
  }

  event.stopPropagation()
  event.preventDefault()
}

// 某个元素在el元素范围内被放置时
function ondrop (event) {
  var id = event.dataTransfer.getData('text/plain')
  var elDrag = document.getElementById(id)
  if (elDrag !== this) {
    // 获取放置元素词条的上一个词条,若无返回null
    let prevdropID = null
    for (let i in vueBody.words) {
      if (vueBody.words[i].id === (Number)(this.id.toString().slice(5))) {
        if (vueBody.words[i - 1] && vueBody.words[i - 1].id) {
          prevdropID = vueBody.words[i - 1].id
        }
        break
      }
    }

    vueBody.emitData('axiosGetData', 'resort/h3', { dragger_id: id.toString().slice(5), dropper_id: prevdropID }, function (res) {
      if (!res.data) {
        console.log('词条移动失败了,请联系后台人员修复bug')
      }
      this.emitData('getFiles')
    }.bind(vueBody))
  }

  event.currentTarget.classList.remove('dragover')
  event.preventDefault()
}
