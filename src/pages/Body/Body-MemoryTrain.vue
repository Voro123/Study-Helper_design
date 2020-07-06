<template>
  <caption>
    <div class="container">
      <div class="page-left">
        <template v-if="state===0">
          <p><span class="title">出题范围:</span><input type="text"
              class="topic-range" v-model="range" placeholder="使用搜索规则进行查询"
              @keydown="textareaKeydown($event,'range')"
              @keyup="textareaKeyup" />
          </p>
          <p><span class="title">出题方式:</span>
            <select class="topic-way" v-model="way">
              <option>给词条名，答词条内容</option>
              <option>给词条内容，答词条名</option>
              <option>综合</option>
            </select>
          </p>
          <p><span class="title">题目上限:</span>
            <input type="number" class="topic-count" v-model="count"
              placeholder="0" min="1" /></p>
          <button class="topic-start" @click="startAnswer">开始回忆</button>
          <p>
            <span class="title">过滤词条:</span><br>
            <ul class="topic-blacklist">
              <li v-if="!words||!words.length">无</li>
              <li v-for="obj in words" :key="obj.id">
                {{obj.name}}
                <span class="removeNoAppear"
                  @click="removeNoAppear(obj.id)">×</span>
              </li>
            </ul>
          </p>
        </template>
        <template v-if="state===1">
          <p><span class="title">词条名:</span>
            <input v-if="topics[topicNo].way===0" type="text"
              placeholder="在此处写下答案" v-model="tbAnswer"
              @keydown="textareaKeydown($event,'tbAnswer')"
              @keyup="textareaKeyup" />
            <span class="words-span" v-else>{{ topics[topicNo].name }}</span>
          </p>
          <p>
            <span class="title">词条解释:</span><br>
            <textarea v-if="topics[topicNo].way===1" placeholder="在此处写下答案"
              v-model="tbAnswer" @keydown="textareaKeydown($event,'tbAnswer')"
              @keyup="textareaKeyup"></textarea>
            <textarea v-else readonly
              v-model="topics[topicNo].introduce"></textarea>
          </p>
          <p class="footer">
            <button v-if="topics.length&&topicNo===topics.length-1"
              @click="submit">提交,开始对照答案</button>
            <span v-else>-{{topicNo+1}}/{{topics.length}}-</span>
          </p>
        </template>
        <template v-if="state===2">
          <p><span class="title">词条名:</span>
            <span class="words-span">{{ topics[topicNo].name }}</span>
          </p>
          <p>
            <span class="title">词条解释:</span><br>
            <textarea readonly v-model="topics[topicNo].introduce"></textarea>
          </p>
          <p class="footer">
            <span>-{{topicNo+1}}/{{topics.length}}-</span>
          </p>
        </template>
        <div v-if="state!==0" class="jiantou-div prevpage" @click="prevTopic"
          :class="{active:topicNo>0}">
          <span class="iconfont iconjiantou"></span>
        </div>
        <div v-if="state===1" class="jiantou-div nextpage" @click="nextTopic"
          :class="{active:topicNo<topics.length-1}">
          <span class="iconfont iconjiantou"></span>
        </div>
      </div>
      <div v-if="state===2" class="page-between">
        <button class="iconfont icondagou" :class="{active:tbRightWrong===true}"
          @click="tbRightWrong=true"></button>
        <button class="iconwrong" :class="{active:tbRightWrong===false}"
          @click="tbRightWrong=false"></button>
        <button class="iconpass" @click="passWord"></button>
      </div>
      <div v-if="state===2" class="page-right">
        <div class="jiantou-div nextpage" @click="nextTopic"
          :class="{active:topicNo<topics.length-1&&tbRightWrong!==null}">
          <span class="iconfont iconjiantou"></span>
        </div>
        <p><span class="title">词条名:</span>
          <input v-if="topics[topicNo].way===0" type="text" readonly
            v-model="tbAnswer" />
          <span v-else>{{ topics[topicNo].name }}</span>
        </p>
        <p>
          <span class="title">词条解释:</span><br>
          <textarea v-if="topics[topicNo].way===1" readonly
            v-model="topics[topicNo].answer"></textarea>
          <textarea v-else readonly
            v-model="topics[topicNo].introduce"></textarea>
        </p>
        <p class="footer">
          <span>-{{topicNo+1}}/{{topics.length}}-</span>
        </p>
      </div>
      <button
        v-if="topics.length&&topicNo===topics.length-1&&tbRightWrong!==null"
        class="checkover" @click="checkover">检查完毕~</button>
    </div>
  </caption>
</template>
<script>
import printPrettrier from '@/commFunction/printPrettrier.js'
export default {
  name: 'BodyMemoryTrain',
  props: ['words'],
  data () {
    return {
      state: 0, // 答题状态,0表示还没开始,1表示正在答题,2表示正在检查
      range: '$history(1)', // 出题范围
      way: '给词条名，答词条内容', // 出题方式
      count: 100, // 出题数量
      topics: [], // 题目数组
      topicNo: 0, // 题号
      tbAnswer: '', // 用户答案
      tbRightWrong: null // 本题对错
    }
  },
  mounted () {
    printPrettrier.environment = this
  },
  watch: {
    state (newval) {
      if (newval === 0) {
        this.$emit('getFiles')
      }
    }
  },
  methods: {
    removeNoAppear (id) {
      // 移除过滤词条
      if (confirm('确定要移除该过滤词条吗?该词条将有可能作为题目给出')) {
        this.$emit('axiosGetData', 'post', 'h3_changeAppear',
          { id: id, toval: 0 }, function (res) {
            if (!res) {
              alert('移除过滤词条失败,请检查网络连接')
              return
            }
            this.$emit('getFiles')
          }.bind(this))
      }
    },
    saveStates (newTopicNo) {
      if (this.state === 2 && this.tbRightWrong === null &&
        newTopicNo === this.topicNo + 1) {
        return
      }
      // 每次切换题数或上交试卷时保存当前题目状态
      this.topics[this.topicNo].answer = this.tbAnswer
      this.topics[this.topicNo].rightwrong = this.tbRightWrong
      this.topicNo = newTopicNo
      this.tbAnswer = this.topics[this.topicNo].answer || ''
      if (typeof this.topics[this.topicNo].rightwrong === 'boolean') {
        this.tbRightWrong = this.topics[this.topicNo].rightwrong
      } else this.tbRightWrong = null
    },
    prevTopic () {
      // 跳转上一题
      if (this.topicNo > 0) {
        this.saveStates(this.topicNo - 1)
      }
    },
    nextTopic () {
      // 跳转下一题
      if (this.topicNo < this.topics.length - 1) {
        this.saveStates(this.topicNo + 1)
      }
    },
    submit () {
      // 提交试卷
      this.state = 2
      this.saveStates(0)
    },
    passWord () {
      // 过滤题目
      if (confirm('你确定要过滤该词条吗?过滤的词条不会再出现在题目中')) {
        this.$emit('axiosGetData', 'post', 'h3_changeAppear',
          { id: this.topics[this.topicNo].id, toval: 1 }, function (res) {
            if (!res) {
              alert('过滤词条失败了,请检查网络连接')
              return
            }
            // 过滤后没有题目了的场合
            if (this.topics.length === 1) {
              this.tbRightWrong = null
              this.tbAnswer = ''
              this.state = 0
            } else {
              // 最后一题的场合
              let temp = this.topicNo
              if (this.topicNo === this.topics.length - 1) {
                this.topicNo--
              }
              this.topics.splice(temp, 1)

              this.tbAnswer = this.topics[this.topicNo].answer
              this.tbRightWrong = this.topics[this.topicNo].rightwrong
            }
          }.bind(this))
      }
    },
    checkover () {
      // 检查试卷完毕
      this.topics[this.topicNo].rightwrong = this.tbRightWrong
      let rightAnswerCount = 0
      for (let i in this.topics) {
        if (this.topics[i].rightwrong === true) {
          rightAnswerCount++
        }
      }
      alert(`你答对了${rightAnswerCount}/${this.topics.length}道题~`)
      this.tbRightWrong = null
      this.tbAnswer = ''
      this.state = 0
    },
    startAnswer () {
      // 防止出题数量没写的情况
      if (!this.count) {
        alert('出题数量格式有误(为0或未填写)')
        return
      }
      if (this.count <= 0) {
        alert('出题数量格式有误(不能<1)')
        return
      }
      if (this.count % 1 !== 0) {
        alert('出题数量格式有误(应为整数)')
      }
      this.$emit('axiosGetData', 'post', 'selectWords', { content: this.range }, function (res) {
        let temparr = res.data
        this.topics = []
        this.topicNo = 0

        // 过滤数组中词条详细为Null和被过滤的项
        for (let i = 0; i < temparr.length; i++) {
          if (temparr[i]['introduce'].trim() === '' || temparr[i]['noappear'] === 1) {
            temparr[i] = temparr[temparr.length - 1]
            temparr.length -= 1
            i--
          }
        }
        if (temparr.length < 1) {
          alert('没有匹配到任何可用词条,请检查出题范围')
          return
        }

        /* 重复随机从数组取出元素添加到this.topics中,直到达到题目数量上限或可用题目
        被用完 */

        for (let i = 0, temparrLen = temparr.length;
          i < temparrLen && i < this.count; i++) {
          // 获取一个随机数组元素下标
          let ra = Math.floor(Math.random() * temparr.length)

          // 为词条对象添加标志(出题方式):0表示答词条名,1表示答词条内容
          if (this.way === '综合') {
            temparr[ra].way = Math.floor(Math.random() * 2)
          } else if (this.way === '给词条内容，答词条名') {
            temparr[ra].way = 0
          } else if (this.way === '给词条名，答词条内容') {
            temparr[ra].way = 1
          }

          // 如果是答词条名,将词条内容的关键字屏蔽
          if (temparr[ra].way === 0) {
            let temp = new RegExp(temparr[ra].name, 'g')
            temparr[ra].introduce = temparr[ra].introduce.replace(temp, '■')
          }

          this.topics.push(temparr[ra])
          temparr[ra] = temparr[temparr.length - 1]
          temparr.length -= 1
        }
        this.state = 1
      }.bind(this))
    },
    textareaKeyup (event) {
      printPrettrier.keyup(event)
    },
    textareaKeydown (event, bindval) {
      printPrettrier.keydown(event, bindval)
    }
  }
}
</script>
<style lang="stylus" scoped>
.container {
  display: flex;
  position: absolute;
  left: 50%;
  height: 100%;
  text-align: left;
  transform: translateX(-50%);
  user-select: none;

  .page-left {
    position: relative;
    margin-top: 10vh;
    width: 400px;
    height: 500px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f8f8f8;
    border: 1px solid black;

    .topic-start {
      position: absolute;
      left: 0px;
      bottom: 0px;
      width: 100%;
      height: 60px;
      background: #ffddff;
      border: 0;
      outline: none;
      cursor: pointer;

      &:hover {
        background: #ffbbff;
      }
    }
  }

  .page-between {
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    button {
      margin: 8px 0;
      height: 40px;
      padding: 5px 10px;
      font-size: 20px;
      border: 2px solid #303030;
      border-radius: 50%;
      outline: none;
      cursor: pointer;

      &.active {
        color: green;
        background: #ffcfaf;
      }
    }

    .iconwrong {
      &:after {
        content: '×';
        position: relative;
        top: -3px;
        font-size: 30px;
      }

      &.active {
        color: red;
      }
    }

    .iconpass {
      &:after {
        content: 'P';
        font-weight: bold;
      }
    }
  }

  .page-right {
    position: relative;
    margin-top: 10vh;
    width: 400px;
    height: 500px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f8f8f8;
    border: 1px solid black;
    border-left: 0px;
  }

  .checkover {
    position: absolute;
    left: 50%;
    bottom: 40px;
    width: 200px;
    height: 40px;
    border: 1px solid #a0a0a0;
    background-color: #ffffcc;
    transform: translateX(-50%);
    outline: none;
    cursor: pointer;

    &:hover {
      background-color: #ffffaa;
    }

    &:active {
      padding-top: 5px;
    }
  }

  p {
    padding: 2px 50px;
    box-sizing: border-box;
    text-align: left;
    white-space: nowrap;

    .title {
      padding-right: 5px;
    }

    .topic-way {
      padding: 5px 5px;
      padding-top: 3px;
      outline: none;
    }

    .topic-count {
      text-align: center;
    }

    .topic-blacklist {
      margin-top: 10px;
      width: 100%;
      height: 200px;
      padding: 0px;
      text-align: center;
      box-sizing: border-box;
      border: 1px solid black;
      border-radius: 8px;
      list-style: none;
      overflow-x: hidden;
      overflow-y: auto;

      li {
        position: relative;
        padding: 3px 0;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        background-color: #f0f0f0;
        border-bottom: 1px solid #a0a0a0;
        overflow: hidden;
        cursor: pointer;

        &:hover {
          background-color: #e0e0e0;
        }

        .removeNoAppear {
          position: absolute;
          top: -1px;
          right: 10px;
          font-size: 20px;
          color: #808080;

          &:hover {
            color: #000;
          }
        }
      }
    }

    .words-span {
      display: inline-block;
      position: relative;
      top: 4px;
      width: 80%;
      white-space: nowrap;
      overflow: hidden;
    }

    input[type='text'] {
      position: relative;
      top: -2px;
      margin-left: 5px;
      text-align: center;
      background-color: transparent;
      border-width: 0px;
      border-bottom: 1px solid black;
      outline: none;
    }

    textarea {
      width: 100%;
      height: 340px;
      padding: 5px;
      resize: none;
      overflow: auto;
      outline: none;
    }

    &.footer {
      position: relative;
      top: -10px;
      margin: 0;
      font-size: 13px;
      text-align: center;
      user-select: none;

      button {
        position: relative;
        top: -7px;
        height: 30px;
        width: 270px;
        padding: 0 10px;
      }
    }
  }

  .jiantou-div {
    position: absolute;
    top: 0px;
    height: 100%;
    padding: 0 5px;
    transition: background-color 0.5s;
    cursor: pointer;

    &.prevpage {
      left: 0;
    }

    &.nextpage {
      right: 0;
    }

    // 该元素是为了使箭头居中
    &:after {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }

    &:hover {
      background: #f0f0f0;
    }

    .iconfont {
      display: inline-block;
      font-size: 25px;
      color: #d0d0d0;
    }

    &.active {
      &:hover {
        background: #ffffe0;
      }

      .iconfont {
        color: #dddd00;
      }
    }

    &.nextpage span {
      transform: rotate(180deg);
    }
  }
}
</style>
