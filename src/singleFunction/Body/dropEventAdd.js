var vueBody = null
export default function () {
  const elWords = document.querySelectorAll('.container>div>div[id^=word-]')
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
  event = event || window.event
  event.dataTransfer.setData('text/plain', event.currentTarget.id)
  event.dataTransfer.dropEffect = 'move'
}

// el元素拖动时被松开
function ondragend (event) {
  event = event || window.event
  event.dataTransfer.clearData('text/plain')
  event.preventDefault()
}

// 某个元素进入el元素的范围时
function ondragover (event) {
  event = event || window.event
  var target = event.currentTarget
  // 此处可优化,不需要每次循环都获取词条高度(因为它是固定值)
  if (target.id.slice(0, 5) === 'word-') {
    if (event.offsetY < target.offsetHeight / 2) {
      // 鼠标在目标元素上半部分时
      if (!target.classList.contains('dragover-top')) {
        target.classList.add('dragover-top')
      }
      if (target.classList.contains('dragover-bottom')) {
        target.classList.remove('dragover-bottom')
      }
    } else {
      // 鼠标在目标元素下半部分时
      if (!target.classList.contains('dragover-bottom')) {
        target.classList.add('dragover-bottom')
      }
      if (target.classList.contains('dragover-top')) {
        target.classList.remove('dragover-top')
      }
    }
  }

  event.stopPropagation()
  event.preventDefault()
}

// 某个元素离开el元素的范围时
function ondragleave (event) {
  event = event || window.event
  var target = event.currentTarget
  if (target.id.slice(0, 5) === 'word-') {
    target.classList.remove('dragover-top')
    target.classList.remove('dragover-bottom')
  }

  event.stopPropagation()
  event.preventDefault()
}

// 某个元素在el元素范围内被放置时
function ondrop (event) {
  event = event || window.event
  var target = event.currentTarget
  if (target.id.slice(0, 5) === 'word-') {
    var id = event.dataTransfer.getData('text/plain')
    var elDrag = document.getElementById(id)
    if (elDrag !== target) {
      // 获取放置元素词条的上一个词条,若无返回null
      let dropperID = null

      // 判断词条是要插入前面还是词条后面
      if (target.classList.contains('dragover-top')) {
        for (let i in vueBody.words) {
          if (vueBody.words[i].id === (Number)(target.id.toString().slice(5))) {
            if (vueBody.words[i - 1] && vueBody.words[i - 1].id) {
              dropperID = vueBody.words[i - 1].id
            }
            break
          }
        }
      } else {
        dropperID = target.id.toString().slice(5)
      }

      vueBody.emitData('axiosGetData', 'get', 'resort/h3', { dragger_id: id.toString().slice(5), dropper_id: dropperID }, function (res) {
        if (!res.data) {
          alert('词条移动失败了,请联系后台人员修复bug')
        }
        vueBody.emitData('getFiles')
      })
    }

    target.classList.remove('dragover-top')
    target.classList.remove('dragover-bottom')
  }
  event.preventDefault()
}
