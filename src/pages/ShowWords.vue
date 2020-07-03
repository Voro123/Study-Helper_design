<template>
  <!--该组件用于点击词条时,显示词条的详细信息-->
  <article class="showwords">
    <button class="close-btn" @click="close"></button>
    <div class="word-name">
      <h2 v-if="actioning===0" @dblclick="toUpdate">{{checkingword.name||''}}
      </h2>
      <input v-else v-model="name" placeholder="词条名" v-focus />
    </div>
    <div class="word-introduce">
      <textarea v-if="actioning===0" :value="checkingword.introduce||''"
        @dblclick="toUpdate" readonly placeholder="该词条暂时还没有介绍哦~"></textarea>
      <textarea v-if="actioning===1" v-model="introduce" class="inserting"
        @keydown="textareaKeydown" @keyup="textareaKeyup"
        placeholder="具体描述.."></textarea>
      <textarea v-else-if="actioning===2" v-model="introduce"
        @keydown="textareaKeydown" @keyup="textareaKeyup"
        placeholder="该词条暂时还没有介绍哦~"></textarea>
    </div>
    <span v-if="actioning===0"
      style="font-size:12px;display:block;padding-top:10px;color:#404040">*双击文本框以编辑*</span>
    <button v-else-if="actioning===1" class="confirm" @click="insert_h3">
      <span>添加</span>
    </button>
    <button v-else-if="actioning===2" class="confirm" @click="update_h3">
      <span>编辑</span>
    </button>
  </article>
</template>
<script>
import setCaretPosition from '@/commFunction/setCaretPosition.js'
export default {
  props: ['checkingword', 'h1', 'h2', 'actioning'],
  name: 'ShowWords',
  data () {
    return {
      name: '', // 添加词条用
      introduce: '',
      shiftClicking: false,
      ctrlClicking: false
    }
  },
  watch: {
    // 监听actioning值的改变初始化变量
    actioning (newval) {
      if (newval === 2) {
        this.name = this.checkingword.name
        this.introduce = this.checkingword.introduce
        return
      }
      this.name = ''
      this.introduce = ''
    }
  },
  methods: {
    emitData (methodName, ...para) {
      // 该方法用于触发home组件上方法
      this.$emit(methodName, ...para)
    },
    close () {
      // 关闭词条详细页
      this.emitData('setActioning', null)
    },

    textareaKeyup (event) {
      switch (event.keyCode) {
        // 松开shift时
        case 16: {
          this.shiftClicking = false
          break
        }
        // 松开ctrl时
        case 17: {
          this.ctrlClicking = false
          break
        }
      }
    },
    insert_h3 () {
      // 添加新词条
      if (this.name.trim().length === 0) {
        alert('词条名不能为空')
        return
      }
      if (this.name.length > 80) {
        alert('词条名不能超过80')
        return
      }
      this.emitData('axiosGetData', 'post', 'insert/h3', { name: this.name, introduce: this.introduce, parents: this.h2, graparents: this.h1 }, function (res) {
        if (!res.data) {
          alert('添加词条失败了,请检查是否已存在同名录下的同名词条')
          return
        }
        this.emitData('getFiles')
      }.bind(this))
    },
    toUpdate () {
      // 开始编辑词条
      this.emitData('setActioning', 2)
    },
    update_h3 () {
      // 编辑词条完成
      if (this.name.trim().length === 0) {
        alert('词条名不能为空')
        return
      }
      if (this.name.length > 80) {
        alert('词条名不能超过80')
        return
      }
      // 判断与原来的词条有没有变化,如果没有,直接返回
      if (this.introduce === this.checkingword.introduce && this.name === this.checkingword.name) {
        this.emitData('getFiles')
        return
      }
      this.emitData('axiosGetData', 'post', 'update/h3', { id: this.checkingword.id, new_name: this.name, new_introduce: this.introduce }, function (res) {
        if (!res.data) {
          alert('编辑词条失败了,请检查是否已存在同名录下的同名词条')
          return
        }
        this.emitData('getFiles')
      }.bind(this))
    },
    textareaKeydown (event) {
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
      var defaultEventReplace = function (repchar, offset) {
        // 删除用户所选文本
        var selectEnd = el.selectionEnd
        el.value = elValue.slice(0, selectStart) + elValue.slice(selectEnd)
        elValue = el.value

        el.value = elValue.slice(0, selectStart) + repchar + elValue.slice(selectStart)
        setCaretPosition(el, selectStart + offset + repchar.length)
        this.introduce = el.value
        if (scrollHeight !== el.scrollHeight) {
          el.scrollTop += 16
        }
        event.preventDefault()
      }.bind(this)

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
          if (this.shiftClicking) {
            defaultEventReplace('()', -1)
          }
          break
        }
        // 点击s 自动提交编辑或添加
        case 83: {
          if (this.ctrlClicking) {
            if (this.actioning === 1) {
              // 提交词条添加
              this.insert_h3()
            } else if (this.actioning === 2) {
              // 提交词条编辑
              this.update_h3()
            }
            event.preventDefault()
          }
          break
        }
        // 点击< 成对符号
        case 188: {
          if (this.shiftClicking) {
            defaultEventReplace('<>', -1)
          }
          break
        }
        // 点击[ 成对符号
        case 219: {
          if (!this.shiftClicking) {
            defaultEventReplace('[]', -1)
          } else {
            defaultEventReplace('{}', -1)
          }
          break
        }
        // 点击'或" 成对符号
        case 222: {
          if (!this.shiftClicking) {
            defaultEventReplace("''", -1)
          } else {
            defaultEventReplace('""', -1)
          }
          break
        }
        // 点击shift
        case 16: {
          this.shiftClicking = true
          break
        }
        // 点击ctrl
        case 17: {
          this.ctrlClicking = true
          break
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@media screen and (max-width: 700px) {
  .bodywords {
    display: none;
  }
}

.showwords {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 300px;
  min-width: 400px;
  max-width: 40vmax;
  min-height: 250px;
  max-height: 35vmax;
  box-sizing: border-box;
  padding: 20px;
  text-align: center;
  border: 2px solid #f5bea3;
  border-radius: 4px;
  transform: translate(-50%, -50%);
  background-color: wheat;

  .close-btn {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 40px;
    height: 22px;
    font-size: 20px;
    border: 1px solid #c0e0c0;
    border-top-width: 0px;
    border-right-width: 0px;
    border-bottom-left-radius: 50%;
    cursor: pointer;

    &:after {
      content: '×';
      position: absolute;
      display: block;
      top: 50%;
      left: 50%;
      line-height: 16px;
      transform: translate(-50%, -50%);
      transition: all 0.1s;
    }

    &:active:after {
      top: 60%;
    }

    &:focus {
      outline: 0;
    }
  }

  .word-name {
    text-align: center;
    line-height: 24px;

    h2 {
      margin: 0;
      font-size: 16.5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    input {
      height: 20px;
      text-align: center;
      border-width: 0;
      border-radius: 4px;
      outline-color: #00cccc;
      border: 1px solid #a0a0a0;
    }
  }

  .word-introduce {
    flex: 1;
    width: 100%;
    margin-top: 5px;
    text-align: center;

    textarea {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 7px;
      padding-bottom: 0;
      word-break: break-all;
      border: 1px solid #a0a0a0;
      border-width: 0;
      border-radius: 8px;
      outline-color: #0cc;
      outline-style: none;
      resize: none;

      &[readonly] {
        background: #ffffee;
      }

      &.inserting:focus {
        outline-style: auto;
      }
    }
  }

  .confirm {
    width: 100px;
    height: 30px;
    margin: 6px;
    font-size: 12px;
    border: 1px solid #a0a0a0;
    border-radius: 2px;
    outline-color: #a0a0a0;
    cursor: pointer;

    &:active span {
      position: relative;
      top: 2px;
    }
  }
}
</style>
