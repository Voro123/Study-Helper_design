<template>
  <caption>
    <!-- 词条显示页 -->
    <div class="jiantou-div prevpage" @click="to_prevpage"
      :class="{active:canprev}">
      <span class="iconfont iconjiantou"></span>
    </div>
    <div class="container">
      <div v-for="i in 6" :key="'home-container-'+i">
        <!-- 限定每列最多20个词条 -->
        <div v-if="i===1 && words">
          <span @click="emitData('setActioning',1)">添加新词条</span>
        </div>
        <div v-for="data in getarr(i)" :id="'word-'+data.id" draggable="true"
          :class="{checkingword:checkingword===data}" :key="'home-n-'+data.id"
          @click="emitData('setCheckingword',data)">
          <span>{{data.name}}</span>
          <div class="delete" @click.stop="h3_delete(data)">×</div>
        </div>
      </div>
    </div>
    <div class="jiantou-div nextpage" @click="to_nextpage"
      :class="{active:cannext}">
      <span class="iconfont iconjiantou"></span>
    </div>
  </caption>
</template>

<script>
import dropEventAdd from '@/singleFunction/Body/dropEventAdd'

const ColumnWords = 20 // 该值决定每一列的词条数量
const pageWordCount = ColumnWords * 6 - 1 // 每一页的词条总数
export default {
  name: 'BodyDetail',
  props: ['words', 'checkingword', 'h3_page', 'h1'],
  data () {
    return {
      canprev: false,
      cannext: false
    }
  },
  watch: {
    words () {
      this.$nextTick(function () {
        this.pageChange()
        dropEventAdd.call(this)
      })
    },
    h3_page () {
      this.pageChange()
    }
  },
  methods: {
    emitData (methodName, ...para) {
      // 该方法用于触发home组件上方法
      this.$emit(methodName, ...para)
    },
    getarr (i) {
      // 该方法获取每一栏的元素数组,n用来计算是不是第一列,以添加新词条
      var n = 1
      if (i === 1) n = 0
      /* 1.判断this.words是否为空,是则直接返回Null
         2.判断this.words的长度是否大于当前页数(从0开始计数)*每页的词条数量,加
         当前列数(从1开始计数)*每一列能容纳的词条总数(20)-n(这个用来算是不是第一
         列,是第一列的话减少一个词条,不用管)。若判断结果为false,返回null
         3.若判断结果为true,截取这个列的词条区间 */
      const pw = this.h3_page * pageWordCount // 之前的页数词条总数
      return this.words &&
        this.words.length > pw + (i - 1) * ColumnWords - n
        ? this.words.slice(pw + (i - 1) * ColumnWords - n, pw + i * ColumnWords - 1)
        : null
    },
    h3_delete (data) {
      if (confirm(`确定要删除词条【${data.name}】吗`)) {
        this.emitData('axiosGetData', 'get', 'delete/h3', { id: data.id }, function (res) {
          if (!res.data) {
            console.log('词条删除失败了')
          }
          this.emitData('getFiles', function () {
            // 若删除的是当前页最后一个词条,返回上一页
            if (this.h3_page > 0 && this.words.length > this.h3_page * pageWordCount) {
              this.$emit('update:h3_page', this.h3_page - 1)
            }
          }.bind(this))
        }.bind(this))
      }
    },
    to_prevpage () {
      if (this.canprev) {
        this.$emit('update:h3_page', this.h3_page - 1)
      }
    },
    to_nextpage () {
      if (this.cannext) {
        this.$emit('update:h3_page', this.h3_page + 1)
      }
    },
    pageChange () {
      // 监听换页,应用箭头的样式
      if (this.h3_page !== 0) {
        this.canprev = true
      } else {
        this.canprev = false
      }
      if (this.words && this.words.length > pageWordCount * (this.h3_page + 1)) {
        this.cannext = true
      } else {
        this.cannext = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.container {
  display: flex;
  width: 100%;
  padding: 10px 0px;
  user-select: none;
  background-color: white;

  &>div {
    width: 16.666%;
    box-sizing: border-box;
    padding: 5px 0;
    margin: 5px;
    text-align: center;
    border: 1px solid black;
    border-radius: 8px;
    overflow: hidden;

    &>div {
      position: relative;
      width: 100%;
      height: calc((100% / 20));
      box-sizing: border-box;
      padding: 0 10px;
      text-align: left;
      cursor: pointer;

      &:hover {
        background: #eee;

        .delete {
          display: inline-block;
        }
      }

      &.checkingword {
        background: #ddd;
      }

      &>span {
        position: relative;
        display: inline-block;
        top: 50%;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        transform: translateY(-50%);
        overflow: hidden;
      }

      .delete {
        position: absolute;
        display: none;
        right: 8px;
        top: 2px;
        font-size: 25px;
        color: #808080;

        &:hover {
          color: #000;
        }
      }
    }

    &:first-of-type>div:first-of-type {
      display: inline-block;
      width: 90%;
      color: #008888;
      background: #00f2cc;
      border: 1px solid #a0a0a0;
      border-radius: 8px;
      text-align: center;

      &:hover {
        color: #000000;
      }
    }
  }
}

.jiantou-div {
  padding: 0 5px;
  transition: background-color 0.5s;
  background-color: white;
  cursor: pointer;

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
      background: #e0ffe0;
    }

    .iconfont {
      color: #00dd00;
    }
  }

  &.nextpage {
    span {
      transform: rotate(180deg);
    }
  }
}

.dragover-top::before {
  content: '';
  position: absolute;
  display: inline-block;
  left: -2px;
  top: -2px;
  width: calc(100% + 2px);
  height: 2px;
  background: #a0a0a0;
}

.dragover-bottom::after {
  content: '';
  position: absolute;
  display: inline-block;
  left: -2px;
  bottom: -2px;
  width: calc(100% + 2px);
  height: 2px;
  background: #a0a0a0;
}
</style>
