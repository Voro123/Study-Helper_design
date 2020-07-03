<template>
  <caption>
    <div class="container">
      <nav>
        <ul>
          <router-link to="#history/今天" tag="li"
            :class="{'active':hashPara==='今天'}"
            @click.native="emitData('getFiles')">
            今天
          </router-link>
          <router-link to="#history/昨天" tag="li"
            :class="{'active':hashPara==='昨天'}"
            @click.native="emitData('getFiles')">
            昨天
          </router-link>
          <router-link to="#history/前天" tag="li"
            :class="{'active':hashPara==='前天'}"
            @click.native="emitData('getFiles')">
            前天
          </router-link>
        </ul>
      </nav>
      <caption>
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
          <tr v-if="words.length===0">
            <td colspan="2">{{hashPara}}似乎没有添加或修改过词条</td>
          </tr>
        </table>
      </caption>
    </div>
  </caption>
</template>
<script>
export default {
  name: 'BodyHistory',
  props: ['words', 'checkingword', 'hashPara'],
  methods: {
    emitData (methodName, ...para) {
      // 该方法用于触发home组件上方法
      this.$emit(methodName, ...para)
    }
  }
}
</script>
<style lang="stylus" scoped>
.container {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  width: 1000px;
  height: 550px;

  nav {
    width: 100%;

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      float: right;
      padding: 10px 20px;
      background-color: #ffffaa;
      cursor: pointer;

      &:first-of-type {
        border-top-right-radius: 4px;
      }

      &:last-of-type {
        border-top-left-radius: 4px;
      }

      &.active {
        position: relative;
        top: 3px;
        padding-bottom: 7px;
        background-color: orange;
      }
    }
  }

  caption {
    flex: 1;
    overflow: auto;

    table {
      width: 100%;
      font-size: 20px;
      border-collapse: collapse;
      background-color: #efebcb;
      table-layout: fixed;

      tr {
        height: 10px;
        cursor: pointer;

        &:not(:first-of-type) {
          &:hover {
            background-color: #50e0e0;
          }

          &.active {
            background-color: #00f0f0;
          }
        }

        th, td {
          border: 1px solid black;
        }

        th {
          padding: 5px 0;
          text-align: center;
        }

        th:first-of-type {
          width: 30%;
        }

        td:first-of-type {
          text-align: center;
        }

        td {
          padding: 2px 10px;
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
