<template>
  <caption>
    <div class="bg">
      <div class="tools">
        <router-link to="#search" tag="button"
          @click.native="emitData('getFiles')">
          搜索词条</router-link>
        <router-link to="#history/今天" tag="button"
          @click.native="emitData('getFiles')">
          词条添加记录</router-link>
        <router-link to="#memoryTrain" tag="button"
          @click.native="emitData('getFiles')">
          加深记忆</router-link>
      </div>
    </div>
  </caption>
</template>
<script>
export default {
  name: 'BodyHome',
  methods: {
    emitData (methodName, ...para) {
      // 该方法用于触发home组件上方法
      this.$emit(methodName, ...para)
    }
  }
}
</script>
<style lang="stylus" scoped>
.bg {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background: url('../../assets/images/index.jpg');
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: 50% 0px;

  .tools {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 50%;
    bottom: 50px;
    width: 200px;
    transform: translateX(-50%);

    button {
      margin-top: 10px;
      padding: 10px 0;
      font-size: 18px;
      border: 1px solid black;
      border-radius: 8px;
      background-color: lightyellow;
      box-shadow: 2px 2px 3px 1px #002200;
      outline: none;
      cursor: pointer;

      &:active {
        position: relative;
        left: 2px;
        top: 2px;
        box-shadow: 1px 1px;
      }
    }
  }
}
</style>
