import setCaretPosition from '@/commFunction/setCaretPosition.js'

let shiftClicking = false
let ctrlClicking = false

window.addEventListener('keyup', keyup)
window.addEventListener('keydown', keydown)
function keydown (event) {
  switch (event.keyCode) {
    case 16: {
      shiftClicking = true
      break
    }
    case 17: {
      ctrlClicking = true
      break
    }
  }
}
function keyup (event) {
  switch (event.keyCode) {
    case 16: {
      shiftClicking = false
      break
    }
    case 17: {
      ctrlClicking = false
      break
    }
  }
}

var obj = {
  environment: null,
  keydown (event, bindval) {
    event = event || window.event
    var el = event.target
    var elValue = el.value
    // 光标位置
    // selectStart即用户所选文本的开始位置,当用户未选择文本时,该值指示鼠标光标的位置
    var selectStart = el.selectionStart
    // 该值用来指示添加文本后,文本行数是否增加且超出可视区域,若是,滚动条往下滚动一行
    var scrollHeight = el.scrollHeight

    // 该方法用来提供统一替代的默认键盘事件
    /* 参数解释:
       repchar:输入的内容将替换为的字符串
       offset:光标偏移字符量,为0时,光标将在替换字符串末尾;为-1时,光标将在替换字符串
       末尾-1处 */
    var defaultEventReplace = (repchar, offset) => {
      event.preventDefault()
      // 删除用户所选文本
      var selectEnd = el.selectionEnd
      el.value = elValue.slice(0, selectStart) + elValue.slice(selectEnd)
      elValue = el.value

      el.value = elValue.slice(0, selectStart) + repchar + elValue.slice(selectStart)
      this.environment[bindval] = el.value
      setCaretPosition(el, selectStart + offset + repchar.length)
      if (scrollHeight !== el.scrollHeight) {
        el.scrollTop += 16
      }
    }
    switch (event.keyCode) {
      // 点击换行 段前缩进继承处理
      case 13: {
        var i = elValue.lastIndexOf('\n', selectStart - 1) + 1
        if (i === 1) { i = 0 }
        var n = 0
        while (elValue[i] === ' ') {
          n++
          i++
        }
        var str = ''
        while (n > 0) {
          str += ' '
          n--
        }
        // 点击换行时,根据上次换行后的缩进自动填充换行后的缩进
        defaultEventReplace('\n' + str, 0)
        break
      }
      // 点击( 成对符号
      case 57: {
        if (shiftClicking) {
          defaultEventReplace('()', -1)
        }
        break
      }
      // 点击) 如果后面一个字符是)且前面有(,只移动光标一位
      case 48: {
        if (shiftClicking) {
          if (elValue[selectStart] === ')') {
            if (elValue.lastIndexOf('(', selectStart - 1) >
              elValue.lastIndexOf(')', selectStart - 1)) {
              defaultEventReplace('', 1)
            }
          }
        }
        break
      }
      // 点击s 自动提交编辑或添加
      case 83: {
        if (ctrlClicking) {
          if (typeof this.actioning !== 'undefined') {
            if (this.actioning === 1) {
              // 提交词条添加
              this.insert_h3()
            } else if (this.actioning === 2) {
              // 提交词条编辑
              this.update_h3()
            }
            event.preventDefault()
          }
        }
        break
      }
      // 点击[ 成对符号
      // 点击{ 成对符号
      case 219: {
        if (!shiftClicking) {
          defaultEventReplace('[]', -1)
        } else {
          defaultEventReplace('{}', -1)
        }
        break
      }
      // 点击] 如果后面一个字符是]且前面有[,只移动光标一位
      // 点击} 如果后面一个字符是}且前面有{,只移动光标一位
      case 221: {
        if (!shiftClicking) {
          if (elValue[selectStart] === ']') {
            if (elValue.lastIndexOf('[', selectStart - 1) >
              elValue.lastIndexOf(']', selectStart - 1)) {
              defaultEventReplace('', 1)
            }
          }
        } else {
          if (elValue[selectStart] === '}') {
            if (elValue.lastIndexOf('{', selectStart - 1) >
              elValue.lastIndexOf('}', selectStart - 1)) {
              defaultEventReplace('', 1)
            }
          }
        }
        break
      }
      // 点击'或" 成对符号
      case 222: {
        if (!shiftClicking) {
          defaultEventReplace("''", -1)
        } else {
          defaultEventReplace('""', -1)
        }
        break
      }
    }
    // console.log(event.keyCode)
  }
}

export default obj
