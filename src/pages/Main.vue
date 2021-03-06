<template>
  <div class="main">
    <loading v-if="loading"></loading>

    <main-header class="main-header" @loading="getLoading" @getFiles="getFiles"
      @setActioning="setActioning" @axiosGetData="axiosGetData"
      @getFileFolders="getFileFolders" @spreadChange="spreadChange"
      :arrFileFolders="arrFileFolders" :spread="spread">
    </main-header>

    <body-detail v-if="bodyModule==='detail'" class="main-body"
      @loading="getLoading" @getFiles="getFiles" @setActioning="setActioning"
      @axiosGetData="axiosGetData" @setCheckingword="setCheckingword"
      :words="words" :checkingword="checkingword" :h3_page.sync="h3_page"
      :h1="h1"></body-detail>
    <body-home v-else-if="bodyModule==='home'" class="main-body"
      @getFiles="getFiles"></body-home>
    <body-search v-else-if="bodyModule==='search'" class="main-body"
      :words="words" :checkingword="checkingword" @axiosGetData="axiosGetData"
      @setCheckingword="setCheckingword"></body-search>
    <body-history v-else-if="bodyModule==='history'" class="main-body"
      :words="words" :hashPara="hashPara" :checkingword="checkingword"
      @getFiles="getFiles" @setCheckingword="setCheckingword">
    </body-history>
    <body-memory-train v-else-if="bodyModule==='memory-train'" class="main-body"
      :words="words" @getFiles="getFiles" @axiosGetData="axiosGetData">
    </body-memory-train>

    <transition name="fade">
      <show-words v-if="actioning!==null" @getFiles="getFiles"
        @setActioning="setActioning" @axiosGetData="axiosGetData"
        @setCheckingword="setCheckingword" :checkingword="checkingword" :h1="h1"
        :h2="h2" :actioning="actioning">
      </show-words>
    </transition>
  </div>
</template>

<script>
import MainHeader from '@/pages/Header.vue'
import BodyHome from '@/pages/Body/Body-Home.vue'
import BodyDetail from '@/pages/Body/Body-Detail.vue'
import BodySearch from '@/pages/Body/Body-Search.vue'
import BodyHistory from '@/pages/Body/Body-History.vue'
import BodyMemoryTrain from '@/pages/Body/Body-MemoryTrain.vue'
import ShowWords from '@/pages/ShowWords'
import Loading from '@/components/Loading.vue'
import axiosGetData from '@/commFunction/axiosGetData'
export default {
  name: 'Main',
  components: {
    MainHeader,
    BodyHome,
    BodyDetail,
    BodySearch,
    BodyHistory,
    BodyMemoryTrain,
    ShowWords,
    Loading
  },
  data () {
    return {
      loading: false, // 为true时显示加载组件
      words: null, // 保存当前遍历二级目录下的词条数组
      checkingword: null, // 保存当前查看词条
      actioning: null, // 保存当前对词条行为,0对应check,1对应insert,2对应update
      h1: null, // 保存当前遍历一级目录
      h2: null, // 保存当前遍历二级目录
      h3_page: 0, // 保存当前遍历词条目录,从0开始计数
      arrFileFolders: null, // 保存数据库1级目录和2级目录组成的对象
      spread: false, // 控制h1栏的展开与否
      bodyModule: null, // 控制Body使用哪个组件
      hashPara: '' // 锚点以/分隔的第二个字符串
    }
  },
  mounted () {
    // 解析锚点后的内容,确认加载哪个目录的词条
    this.getFileFolders()
    this.getFiles()
    window.addEventListener('hashchange', function () {
      /* 捕捉到当前锚点发生改变时重新载入词条,无法获取点击router-link发生的锚点改变,此
      处目的是检测用户点击返回上一个页面时能检测到锚点的变更 */
      this.getFiles()
    }.bind(this), false)
    window.test = this
  },
  watch: {
    h3_page () {
      this.setActioning(null)
    }
  },
  methods: {
    axiosGetData,
    getLoading (data) {
      this.loading = data
    },
    getFileFolders (callback) {
      callback = callback || function () { }
      this.axiosGetData('get', 'getFileFolders', {}, function (res) {
        this.arrFileFolders = res.data
        callback()
      }.bind(this))
    },
    getFiles (callback) {
      callback = callback || function () { }
      this.actioning = null
      this.checkingword = null

      var arr = decodeURI(location.hash).split('/')
      this.hashPara = arr[1]
      // 判断锚点
      switch (arr[0]) {
        case '': {
          // 没有锚点 -> 前往首页
          this.words = null
          this.bodyModule = 'home'
          this.h1 = null
          this.h2 = null
          break
        }
        case '#detail': {
          // detail -> 跳转到详细词条页
          if (this.h1 !== arr[1] || this.h2 !== arr[2]) {
            // 若检测到切换了目录
            this.h3_page = 0
          }
          this.h1 = arr[1]
          this.h2 = arr[2]
          this.axiosGetData('get', 'getFiles', { h1: arr[1] || '', h2: arr[2] || '' }, function (res) {
            this.words = res.data
            this.bodyModule = 'detail'
            // 设置进入词条后若为[展开]状态,改为[收回]状态
            if (this.spread) this.spreadChange()
            callback()
          }.bind(this))
          break
        }
        case '#search': {
          // search -> 跳转到词条查询页
          this.bodyModule = 'search'
          if (arr.length === 2 && arr[1] !== '') {
            this.axiosGetData('post', 'selectWords', { content: arr[1] }, function (res) {
              this.words = res.data
            }.bind(this))
          }
          break
        }
        case '#history': {
          // history -> 跳转到词条添加记录
          this.bodyModule = 'history'
          if (arr.length === 2 && arr[1] !== '') {
            this.axiosGetData('post', 'getHistory', { date: arr[1] }, function (res) {
              this.words = res.data
            }.bind(this))
          }
          break
        }
        case '#memoryTrain': {
          // memoryTrain -> 跳转到词条记忆页面
          this.bodyModule = 'memory-train'
          this.axiosGetData('post', 'h3_getAppearWords', {}, function (res) {
            this.words = res.data
          }.bind(this))
          break
        }
      }
    },
    setCheckingword (checkingword) {
      if (this.setActioning(0)) {
        this.checkingword = checkingword
      }
    },
    setActioning (actioning) {
      // 用户试图改变当前行为时,若成功改变,返回true,否则返回false
      if (this.actioning === 1) {
        if (!confirm('确定取消添加当前词条吗？')) {
          return false
        }
      } else if (this.actioning === 2) {
        if (!confirm('确定取消编辑当前词条吗？')) {
          return false
        }
      }
      if (actioning === 1 || actioning === null) this.checkingword = null
      this.actioning = actioning
      return true
    },
    spreadChange () {
      this.spread = !this.spread
    }
  }
}
</script>

<style lang="stylus" scoped>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  /* 设置最小宽度以防止网页放大时错位 */
  width: 100%;
  height: 100%;
  max-height: 800px;
  min-width: 1116px;
  max-width: 1600px;
  background: #fff;
  text-align: left;
  border-radius: 8px;

  .fade-enter-active {
    transition: opacity 0.3s;
  }

  .fade-enter {
    opacity: 0;
  }

  .main-header {
    position: relative;
    display: flex;
    z-index: 1;
    width: 100%;
    min-height: 9.2%;
    box-sizing: border-box;
    padding: 18px 0;
    padding-left: 20px;
    background: #fff;
    border-bottom: 1px solid #c0c0c0;
    user-select: none;
  }

  .main-body {
    position: absolute;
    display: flex;
    top: 66px;
    justify-content: center;
    width: 100%;
    height: 90.8%;
    min-height: 600px;
    max-height: 800px;
    box-sizing: border-box;
    background-image: linear-gradient(#baff8e, #edff8e);
  }
}
</style>
