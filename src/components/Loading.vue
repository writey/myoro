<template>
  <transition name="bounce">
    <div class="content-loading" v-show="show.loading">
      <img class="loading-img" src="../assets/images/oreo.png" alt="loading">
    </div>
  </transition>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Loading',
  computed: {
    show() {
      return this.$store.state.show;
    }
  },
  created() {
    this.loadImages();
  },
  methods: {
    loadImages() {  //  缓存图片
      const that = this;
      // set background color
      const bgColorArr = this.$store.state.bgColorArr;
      document.documentElement.style.setProperty(
        '--bg-color', 
        bgColorArr[Math.floor(Math.random() * bgColorArr.length)]
      );
      const cacheImages = {};
      const sources = this.$store.state.sources;
      const attCount = Object.getOwnPropertyNames(sources).length;
      let index = 0;
      for (const imgItem in sources) {
        cacheImages[imgItem] = new Image();
        cacheImages[imgItem].onload = function () {
          index++;
          if (index === attCount - 1) {
            that.setImageCache(cacheImages);
            window.setTimeout(() => {
              that.setShow({loading: false, output: false});
            }, 500);
          }
        };
        cacheImages[imgItem].src = sources[imgItem];
      }
    },...mapMutations(['setShow', 'setImageCache'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.content-loading {
    display: flex;
    width: 100%;
    text-align: center;
    align-items: center;
    height: 100vh;
    .loading-img {
        width: 30%;
        max-width: 200px;
        max-height: 200px;
        margin: 0 auto;
        animation: rotate 6s infinite linear;
    }
}

.bounce-enter-active {
    animation: bounce-in 0.5s;
}

.bounce-leave-active {
    animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
    }
}

</style>
