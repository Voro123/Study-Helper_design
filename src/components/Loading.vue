<template>
  <div class="loading">
    <div class="container">
      <div class="img">
        <!--长条容器,用来旋转定位-->
        <div v-for="i in 12" :key="'loading-'+i"
          :style="{transform: 'rotate('+i*30+'deg)'}">
          <div>
            <!--内部的显示样式-->
          </div>
        </div>
      </div>
      <div class="font">
        <span>L</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span><span>g</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Loading'
}
</script>
<style lang="stylus" scoped>
.loading {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #80808030;

  .container {
    & .img {
      position: absolute;
      display: flex;
      top: calc(50% - 7.5vmin);
      left: calc(50% - 7.5vmin);
      justify-content: center;
      width: 15vmin;
      height: 15vmin;
      background: transparentify;
      border-radius: 50%;
      animation: div_rotate 7s;
      animation-iteration-count: infinite;
      transform: translate(-50%, -50%);

      &>div {
        position: absolute;
        display: inline-block;
        width: 15%;
        height: 50%;
        transform-origin: bottom center;

        &>div {
          height: 30%;
          background: #a0a0a0;
        }
      }
    }

    & .font {
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 18px;
      transform: translate(-50%, -50%);

      & span {
        position: relative;
        animation: span_jump 2s;
        animation-iteration-count: infinite;

        &:nth-of-type(1) {
          animation-delay: 0.1s;
        }

        &:nth-of-type(2) {
          animation-delay: 0.2s;
        }

        &:nth-of-type(3) {
          animation-delay: 0.3s;
        }

        &:nth-of-type(4) {
          animation-delay: 0.4s;
        }

        &:nth-of-type(5) {
          animation-delay: 0.5s;
        }

        &:nth-of-type(6) {
          animation-delay: 0.6s;
        }

        &:nth-of-type(7) {
          animation-delay: 0.7s;
        }
      }
    }
  }
}

@keyframes div_rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes span_jump {
  0% {
    top: 0px;
  }

  5% {
    top: -1px;
  }

  10% {
    top: 0px;
  }
}
</style>
