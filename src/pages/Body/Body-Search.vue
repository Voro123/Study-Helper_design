<template>
  <caption>
    <div class="bg">
      <div class="select-container">
        <img src="../../assets/images/表情包.png">
        <div class="input-bg">
          <input type="text" v-focus v-model="selContent"
            placeholder="请输入想要搜索词条的名字或详细信息.."
            @keydown="textareaKeydown($event,'selContent')"
            @keyup="textareaKeyup" @keyup.enter="selectWords()">
          <button @click="selectWords()">搜索词条</button>
        </div>
      </div>
      <div class="result-container" v-if="words">
        共搜寻到{{words.length}}条记录:
        <table>
          <tr>
            <th>词条名</th>
            <th>词条解释</th>
          </tr>
          <tr v-for="obj in words" :key="obj.id"
            @click="emitData('setCheckingword',obj)"
            :class="{'active':checkingword===obj}">
            <td>{{obj.name}}</td>
            <td>{{obj.introduce===''?'该词条没有详细介绍内容..':obj.introduce}}</td>
          </tr>
        </table>
      </div>
    </div>
  </caption>
</template>
<script>
import printPrettrier from '@/commFunction/printPrettrier.js'
export default {
  name: 'BodySearch',
  props: ['words', 'checkingword'],
  data () {
    return {
      selContent: '' // 获取用户输入的文本
    }
  },
  mounted () {
    printPrettrier.ecvironment = this
  },
  methods: {
    emitData (methodName, ...para) {
      // 该方法用于触发home组件上方法
      this.$emit(methodName, ...para)
    },
    textareaKeyup (event) {
      printPrettrier.keyup(event)
    },
    textareaKeydown (event, bindval) {
      printPrettrier.keydown(event, bindval)
    },
    selectWords () {
      // 发起查询词条请求
      if (this.selContent.trim() === '') {
        alert('文本框不能为空')
        return
      }
      if (this.selContent.indexOf('_') !== -1) {
        alert('搜索内容中禁止使用"_"符号')
        return
      }
      if (this.selContent.indexOf('%') !== -1) {
        alert('搜索内容中禁止使用"%"符号')
        return
      }
      if (this.selContent.indexOf('/') !== -1) {
        alert('搜索内容中禁止使用"/"符号')
        return
      }
      location.hash = '#search/' + this.selContent
      this.emitData('getFiles')
    }
  }
}
</script>
<style lang="stylus" scoped>
.bg {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 80px;

  .select-container {
    width: 600px;
    padding-top: 60px;

    img {
      user-select: none;
    }

    .input-bg {
      position: relative;

      input[type=text] {
        width: 100%;
        height: 40px;
        padding-left: 15px;
        padding-right: 120px;
        font-size: 18px;
        border: 1px solid black;
        border-radius: 4px;
        box-sizing: border-box;
        outline-color: green;
      }

      button {
        position: absolute;
        top: 0;
        right: 0;
        height: 40px;
        padding: 0 20px;
        font-size: 18px;
        background-color: lightgreen;
        border: 1px solid black;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        outline: none;
        user-select: none;
        cursor: pointer;

        &:active {
          padding-top: 5px;
        }
      }
    }
  }

  .result-container {
    margin-left: 50px;
    width: 600px;
    height: 480px;
    padding: 15px;
    font-size: 18px;
    text-align: left;
    box-sizing: border-box;
    background-color: #efebcb;
    border: 1px solid black;
    border-radius: 16px;
    overflow: auto;

    table {
      margin-top: 10px;
      width: 100%;
      font-size: 20px;
      border-collapse: collapse;
      table-layout: fixed; // 指定表格内部撑开其表格时,若指定了表格宽度,表格宽度不会改变

      tr {
        th {
          text-align: center;
        }

        &:not(:first-of-type) {
          cursor: pointer;

          &:hover {
            background-color: #00ffc0;
          }

          &.active {
            background-color: #00f0b0;
          }
        }

        th, td {
          border: 1px solid black;
        }

        th:nth-of-type(1) {
          width: 35%;
        }

        td {
          padding: 0 10px;
          font-size: 18px;
          text-align: left;
          text-overflow: ellipsis;
          word-break: break-all;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
