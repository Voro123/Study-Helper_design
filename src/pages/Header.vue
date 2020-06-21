<template>
  <header class="home-header">
    <router-link to="#" tag="span" @click.native="emitData('getFiles')">
      Study-Helper
    </router-link>
    <ul v-cloak>
      <li v-for=" (val,key) in arrFileFolders" :key="'header-'+val.id"
        :class="{display_block:inserting === val.id}" class="h1_li">
        <span>{{ key }}</span>
        <div>
          <ul>
            <li v-for="val2 in val.childs" :key="'header2-'+val.id+'-'+val2">
              <router-link :to="'#/'+key+'/'+val2" tag="div"
                @click.native="emitData('getFiles')">
                <span>{{ val2 }}</span>
                <span class="h2_delete"
                  @click.stop="h2_delete(key,val2)">×</span>
              </router-link>
            </li>
            <li class="addnew">
              <div>
                <span v-if="inserting !== val.id"
                  @click="h2_inserting(val.id)">添加子目录</span>
                <input v-else v-model="tbtext" type="text" v-focus
                  @keyup.enter="h2_inserted($event,key)"
                  @keyup.esc="h2_canselInsert"
                  @blur="h2_inserted($event,key)" />
              </div>
            </li>
            <li class="h1_delete">
              <div>
                <span @click="h1_delete(key)">删除该目录</span>
              </div>
            </li>
          </ul>
        </div>
      </li>
      <li class="h1_li">
        <span class="addnew" @click="h1_inserting">Add-NewFolder</span>
      </li>
    </ul>
    <div :class="{'more':true,'shouqi':spread}"
      @click="emitData('spreadChange')" style="display:none">
      {{spread?'收起':'展开'}}</div>
  </header>
</template>
<script>
export default {
  name: 'HomeHeader',
  props: ['arrFileFolders', 'spread'],
  data () {
    return {
      inserting: null,
      tbtext: null,
      confirming: false
    }
  },
  mounted () {
    window.onresize = this.resizeLi
  },
  watch: {
    // 在页面渲染完毕时调用resizeLi()方法
    arrFileFolders () {
      this.resizeLi()
    },
    spread () {
      this.resizeLi()
    }
  },
  methods: {
    emitData (methodName, ...para) {
      // 该方法用于触发home组件上方法
      this.$emit(methodName, ...para)
    },
    resizeLi () {
      this.$nextTick(function () {
        var arr = document.getElementsByClassName('h1_li')
        var firstTime = false
        for (let i = arr.length - 1; i > -1; i--) {
          if (arr[i].offsetTop > 30) {
            if (!this.spread) {
              arr[i].classList.add('hidden')
              arr[i].classList.remove('spread-margin')
            } else {
              if (arr[i].offsetTop === 44 || arr[i].offsetTop === 45) {
                arr[i].classList.remove('spread-margin')
                if (firstTime === false) {
                  // 匹配到最后一个不被隐藏的li元素的行为
                  let ul = arr[i].parentElement
                  let more = document.getElementsByClassName('more')[0]
                  const offsetRange = 10 // offsetRange控制more类元素与最后一个li元素的距离
                  more.style = ''
                  more.style.right = ul.offsetLeft + ul.clientWidth -
                    (arr[i].offsetLeft + arr[i].clientWidth) - offsetRange + 'px'
                  more.style.top = ''
                  firstTime = true
                }
              } else {
                arr[i].classList.remove('hidden')
                arr[i].classList.add('spread-margin')
              }
            }
          } else {
            arr[i].classList.remove('spread-margin')
            arr[i].classList.remove('hidden')
            if (firstTime === false) {
              // 匹配到最后一个不被隐藏的li元素的行为
              let ul = arr[i].parentElement
              let more = document.getElementsByClassName('more')[0]
              const offsetRange = 10 // offsetRange控制more类元素与最后一个li元素的距离
              more.style = ''
              more.style.right = ul.offsetLeft + ul.clientWidth - (arr[i].offsetLeft + arr[i].clientWidth) - offsetRange + 'px'
              more.style.top = ''
              firstTime = true
            }
          }
        }
      })
    },
    h1_inserting () {
      this.emitData('setActioning', null)
      var name = prompt('请输入要添加的一级目录')
      if (name === null) return
      name = name.trim()
      if (name === '') {
        alert('目录名不能为空')
        return
      }
      if (name.length > 20) {
        alert('一级目录的名称长度不能超过20')
        return
      }
      if (name.match(/\//g)) {
        alert('目录名不能包含"/"符号')
        return
      }
      // 添加词条
      this.emitData('axiosGetData', 'insert/h1', { name }, function (res) {
        if (!res.data) {
          alert('添加数据失败了,请检查当前一级目录是否已存在')
          return
        }
        this.emitData('getFileFolders')
        this.resizeLi()
      }.bind(this))
    },
    h1_delete (name) {
      if (!confirm(`确定要删除目录【${name}】吗?(该操作无法撤回！)`)) return
      this.emitData('axiosGetData', 'delete/h1', { name }, function (res) {
        if (!res.data) {
          alert('因未知的原因,删除目录失败了')
          return
        }
        this.emitData('getFileFolders')
        location.hash = ''
        this.emitData('getFiles')
        this.resizeLi()
      }.bind(this))
    },
    h2_inserting (id) {
      this.emitData('setActioning', null)
      this.inserting = id
    },
    h2_inserted (el, parents) {
      if (this.confirming === true) return
      this.confirming = true
      if (confirm('是否确定添加目录?') === true) {
        this.tbtext = this.tbtext && this.tbtext.trim()
        let success = true
        if (this.tbtext === null || this.tbtext === '') {
          alert('目录名不能为空')
          success = false
        }
        if (this.tbtext.length > 20) {
          alert('二级目录的名称长度不能超过20')
          success = false
        }
        if (this.tbtext.match(/\//g)) {
          alert('目录名不能包含"/"符号')
          success = false
        }
        if (!success) {
          this.confirming = false
          el.target.focus()
          return
        }

        // 添加二级目录
        this.emitData('axiosGetData', 'insert/h2', { name: this.tbtext, parents }, function (res) {
          this.inserting = null

          if (!res.data) {
            alert('添加数据失败了,请检查当前目录下是否有同名二级目录')
            this.confirming = false
            return
          }

          this.emitData('getFileFolders', function () {
            this.confirming = false
          }.bind(this))

          location.hash = '#/' + parents + '/' + this.tbtext
          this.emitData('getFiles')
          this.tbtext = null
        }.bind(this))
      } else {
        this.inserting = null
        this.tbtext = null
        /* 此处是为了不在对话框出现时点击enter等按键触发事件,
        导致事件执行多次 */
        setTimeout(() => {
          this.confirming = false
        }, 0)
      }
    },
    h2_canselInsert (el) {
      if (this.confirming === true) return
      this.confirming = true
      if (confirm('确定放弃当前添加操作吗?') === true) {
        this.inserting = null
        this.tbtext = null
      }
      el.target.focus()
      setTimeout(() => {
        this.confirming = false
      }, 0)
    },
    h2_delete (parents, name) {
      if (confirm(`确定要删除二级目录【${name}】吗`)) {
        this.emitData('axiosGetData', 'delete/h2', { parents, name }, function (res) {
          if (!res.data) {
            alert('删除数据失败了,请检查数据是否真实存在')
            return
          }
          this.emitData('getFileFolders')
          location.hash = ''
          this.emitData('getFiles')
          // 未处理删除的为当前浏览目录的情况
        }.bind(this))
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.hidden {
  height: 0;
  overflow: hidden;
}

.spread-margin {
  margin-top: 15px;
}

.more {
  position: absolute;
  right: 0;
  padding-top: 6px;
  color: green;
  font-weight: bold;
  cursor: pointer;

  &:after {
    content: '';
    position: absolute;
    display: flex-block;
    bottom: -2px;
    border: 5px solid transparent;
    border-top-color: green;
  }

  &.shouqi:after {
    bottom: 3px;
    border-top-color: transparent;
    border-bottom-color: green;
  }
}

.home-header {
  &>span {
    display: inline-block;
    top: 23px;
    left: 30px;
    padding-left: 20px;
    padding-right: 10px;
    font-size: 30px;
    line-height: 30px;
    color: #80e080;
    white-space: nowrap;
    cursor: pointer;
  }

  &>ul {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    width: 0;
    padding-top: 10px;
    padding-left: 10px;
    margin: 0;
    margin-right: 32px;

    &>li {
      position: relative;
      padding: 0 16px;
      list-style: none;
      cursor: pointer;

      &>span {
        position: relative;
        display: inline-block;
        height: 16px;
        word-break: keep-all;
        white-space: nowrap;
        line-height: 16px;

        &:not(.addnew):after {
          content: '';
          position: absolute;
          bottom: 2px;
          border: 3px solid #fff;
          border-top: 5px solid #000;
          margin-left: 5px;
        }

        &.addnew {
          position: relative;
          top: -5px;
          padding: 5px 10px;
          background: #ffcc00;
          border: 1px solid #000000;
          border-radius: 4px;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      &:hover, &.display_block {
        div {
          display: block;
        }
      }

      div {
        position: absolute;
        display: none;
        float: right;
        width: 100%;
        padding-top: 6px;

        ul {
          position: absolute;
          z-index: 999;
          right: 15px;
          padding: 0;
          white-space: nowrap;
          background: #fff;
          border: 1px solid #d0d0d0;
          border-radius: 3px;

          li {
            text-align: left;
            list-style: none;

            &>div {
              position: relative;
              width: 100%;
              height: 100%;
              max-width: 200px;
              box-sizing: border-box;
              padding: 5px 10px;
              padding-right: 30px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;

              &:hover {
                background: #ddd;

                .h2_delete {
                  display: inline-block;
                }
              }

              .h2_delete {
                position: absolute;
                display: none;
                right: 8px;
                top: 2px;
                font-size: 25px;
                color: #808080;
              }
            }

            &.addnew {
              color: #08f;
            }

            &.h1_delete {
              color: #f00;
            }

            &.addnew, &.h1_delete {
              margin: 0 auto;
              text-align: center;
              font-weight: bold;

              div {
                padding-left: 20px;
              }

              input {
                width: 100px;
              }
            }

            &:not(:first-of-type).addnew div {
              border-top: 1px solid #c0c0c0;
            }
          }
        }
      }
    }
  }
}
</style>
