/* 导出的方法用于设置拖拽事件,使用前须为组件设置:
   1.可拖拽的元素需要设置自身的id为前缀标识字符串+数据库对应id
   传入的参数有:
   1.objDatas:数据集合数组对象,如words = [{id:xxx,name:xxx},{id:xxx,name:xxx}..]
   2.selector:响应拖拽的目标选择器
   3.disstr:id前缀标识字符串
   4.dragoverTopClass:悬停在可放置的目标元素上半部分时的类,有默认值dragover-top
   5.dragoverBottomClass:悬停在可放置的目标元素下半部分时的类,有默认值dragover-bottom
*/
export default function (_arrDatas, selector, _disstr, _callback,
  _dragoverTopClass = 'dragover-top', _dragoverBottomClass = 'dragover-bottom') {
  const elWords = document.querySelectorAll(selector)

  // 遍历词条元素,并分别为它们添加拖拽绑定事件
  elWords.forEach(el => {
    // 元素属性设置
    el.arrDatas = _arrDatas
    el.disstr = _disstr
    el.callback = _callback
    el.dragoverTopClass = _dragoverTopClass
    el.dragoverBottomClass = _dragoverBottomClass

    // 添加绑定事件
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
  let target = event.currentTarget
  // 此处可优化,不需要每次循环都获取词条高度(因为它是固定值)
  if (target.id.slice(0, target.id.lastIndexOf('-') + 1) === this.disstr + '-') {
    if (event.offsetY < target.offsetHeight / 2) {
      // 鼠标在目标元素上半部分时
      if (!target.classList.contains(this.dragoverTopClass)) {
        target.classList.add(this.dragoverTopClass)
      }
      if (target.classList.contains(this.dragoverBottomClass)) {
        target.classList.remove(this.dragoverBottomClass)
      }
    } else {
      // 鼠标在目标元素下半部分时
      if (!target.classList.contains(this.dragoverBottomClass)) {
        target.classList.add(this.dragoverBottomClass)
      }
      if (target.classList.contains(this.dragoverTopClass)) {
        target.classList.remove(this.dragoverTopClass)
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
  if (target.id.slice(0, target.id.lastIndexOf('-') + 1) === this.disstr + '-') {
    target.classList.remove(this.dragoverTopClass)
    target.classList.remove(this.dragoverBottomClass)
  }

  event.stopPropagation()
  event.preventDefault()
}

// 某个元素在el元素范围内被放置时
function ondrop (event) {
  event = event || window.event
  var target = event.currentTarget
  if (target.id.slice(0, target.id.lastIndexOf('-') + 1) === this.disstr + '-') {
    var draggerID = event.dataTransfer.getData('text/plain')
    var elDrag = document.getElementById(draggerID)
    if (elDrag !== target) {
      // 获取放置元素词条的上一个词条,若无返回null
      let dropperID = null

      // 判断词条是要插入前面还是词条后面
      if (target.classList.contains(this.dragoverTopClass)) {
        for (let i in this.arrDatas) {
          if (this.arrDatas[i].id ===
            (Number)(target.id.slice(target.id.lastIndexOf('-') + 1))) {
            if (this.arrDatas[i - 1] && this.arrDatas[i - 1].id) {
              dropperID = this.arrDatas[i - 1].id
            }
            break
          }
        }
      } else {
        dropperID = target.id.slice(target.id.lastIndexOf('-') + 1)
      }
      /* 参数:被拖拽对象的id
      */
      this.callback(draggerID.slice(draggerID.lastIndexOf('-') + 1), dropperID)
    }
    target.classList.remove(this.dragoverTopClass)
    target.classList.remove(this.dragoverBottomClass)
  }
  event.preventDefault()
}
