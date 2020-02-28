<template>
  <div class="container" v-show="!show.loading">
    <div class="design" v-show="!show.output">
      <div class="icon tooltip">
        <span class="tooltiptext" v-html="$t('tooltip')"></span>
      </div>
      <div class="title">
        <div class="meta" v-t="'input.meta'"></div>
          <div v-show="oreoStr">
            <div class="input str" v-show="oreoStr">
              <span>{{ oreoStr }}</span>
            </div>
          </div>
          <div v-show="!oreoStr">
            <div class="input str placeholder">
              <span v-t="'input.placeholder'"></span>
              <img src="./../assets/images/random.png" @click="getRandom" class="icon">
            </div>
          </div>
        <div class="control">
          <div @click="strAdd('o')" class="btn small" v-t="'input.btn.o'"></div>
          <div @click="strAdd('r')" class="btn small" v-t="'input.btn.r'"></div>
          <div @click="strAdd('-')" class="btn small" v-t="'input.btn.and'"></div>
          <div @click="strAdd('-1')" class="btn small">-1</div>
        </div>
        <div @click="generateImage()" class="index-btn" v-t="'input.generate'"></div>
      </div>
    </div>
    <div class="output" v-show="show.output">
      <div class="title">
        <div class="meta" v-t="'output.meta'"></div>
        <div class="output str">{{ oreoStr }}</div>
      </div>
      <div class="output-image">
        <canvas width="240rem" height="500rem" ref="oreoCanvas" id="oreoCanvas"></canvas>
      </div>
      <div @click="showImage" v-if="isIOS()" class="btn" v-t="'output.show'"></div>
      <div @click="downloadImage" v-else class="btn" v-t="'output.save'"></div>
      <div @click="backToInput" class="btn" v-t="'output.back'"></div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      imgUrl: '', // 图片地址
      oreoArr: [] // 存放输入数组
    }
  },
  computed: {  // 通过点击事件改变数组， 计算数组返回字符串
    ...mapState(['show', 'images']),  // 对象展开运算符， 获取store中的数据
    oreoStr() {
      let str = '';
      this.oreoArr.forEach((item) => {
        switch (item) {
        case 'O':
        case 'OB':
          str += this.$i18n.tc('basic.o');
          break;
        case 'R':
          str += this.$i18n.tc('basic.r');
          break;
        case '-':
          str += this.$i18n.tc('basic.and');
          break;
        }
      });
      return str;
    }
  },
  methods: {
    ...mapMutations(['setShow']),  // 对象展开运算符， 获取store中的方法
    isIOS() { //  判断是否是IOS系统
      const u = window.navigator.userAgent;
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      return isiOS;
    },
    backToInput() { //  返回输入页面
      this.setShow({loading: false, output: false});
      this.imgUrl = '';
      this.oreoArr = [];
    },
    showImage() { // 查看图片
      window.open(this.imgUrl);
    },
    downloadImage() {  // 下载图片
      const a = document.createElement('a');
      a.href = this.imgUrl;
      a.download = 'oreo.png';
      a.dispatchEvent(new MouseEvent('click', {}));
    },
    getRandom() { // 获得随机数组
      for (let i = 0; i < Math.floor(Math.random() * 8) + 1; i++) {
        const random = Math.random() * 5;
        let str = '';
        if (random < 1) {
          str = '-';
        } else if (random < 3) {
          str = 'o';
        } else {
          str = 'r';
        }
        for (let j = 0; j < Math.floor(Math.random() * 4) + 1; j++) {
          // console.log(i, str, j);
          this.strAdd(str);
        }
      }
      if (this.oreoArr[this.oreoArr.length - 1] === '-') {
        this.oreoArr.pop();
      }
      if (this.oreoArr.length === 0) {
        this.getRandom();
      }
    },
    strAdd(str) {  // 点击绑定事件 添加数组对应项
      switch (str) {
      case 'o':
        if (this.oreoArr.length > 0) {
          this.oreoArr.push('OB');
        } else {
          this.oreoArr.push('O')
        }
        break;
      case 'r':
        this.oreoArr.push('R')
        break;
      case '-':
        if (this.oreoArr.length > 0 &&
              this.oreoArr[this.oreoArr.length - 1] != '-'
        ) {
          this.oreoArr.push('-');
        }
        break;
      case '-1':
        if (this.oreoArr.length > 0) {
          this.oreoArr.pop()
        }
        break;
      default:
        break;
      }
    },
    generateImage() { // 生成图片
      this.setShow({loading: true, output: false});
      const oreoArr = this.oreoArr;
      const drawArr = [];

      if (oreoArr[oreoArr.length - 1] === '-') {
        oreoArr.pop();
      }
      // Canvas height calculation
      let height = 0;
      for (let index = 0; index < oreoArr.length; index++) {
        
        const thisLayer = oreoArr[index];
        if (thisLayer !== '-') {
          const drawItem = {
            image: this.images[thisLayer],
            x: thisLayer === 'R' ? 10 : 0,
            y: height,
            width: thisLayer === 'R' ? 220 : 240,
            height: thisLayer === 'R' ? 155 : 160
          };
          drawArr.splice(0, 0, drawItem);
          height += 24;
        } else {
          height += 72;
        }
      }
      height += 160 - 24; // Add the last image's height.

      const canvas = this.$refs.oreoCanvas;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      drawArr.forEach(item => {
        ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
      });

      this.imgUrl = canvas.toDataURL('image/png');
      setTimeout(() => {
        this.setShow({loading: false, output: true});
      }, 500);
    },
    keyEvent (ev) {
      // console.log(ev.keyCode);
      if (!this.show.loading && !this.show.output) {
        // input Page
        switch (ev.keyCode) {
        case 79:
          this.strAdd('o');
          break;
        case 82:
          this.strAdd('r');
          break;
        case 8:
          this.strAdd('-1');
          break;
        case 32:
        case 189:
          this.strAdd('-');
          break;
        case 13:
          this.generateImage();
          break;
        default:
          break;
        }
      } else if (!this.show.loading && this.show.output) {
        // output Page
        if (ev.keyCode === 8) {
          this.backToInput();
        }
      }
    }
  },
  mounted() {
    window.addEventListener('keyup', this.keyEvent);
  }
}
</script>
<style lang="scss">
.container {
  width: 75%;
  max-width: 60rem;
  margin: 6rem auto;
  text-align: center;
  background-color: var(--white);
  border-radius: 2rem;
  box-shadow: 0rem 0.5rem 1rem var(--shadow-opacity);
  padding: 6rem 4rem;
  position: relative;
  .meta {
    line-height: 4rem;
    font-size: 2.8rem;
    color: var(--black);
    margin: 1rem 0;
  }

  .tooltip {
    display: block;
    position: absolute;
    background-image: url(./../assets/images/tip.png);
    top: 2.4rem; right: 2.4rem;
    width: 2.4rem; height: 2.4rem;
    background-repeat: no-repeat;
    background-size: 2.4rem 2.4rem;
    opacity: .2;
    transition: opacity .2s;
    &:hover {
      opacity: .6;
      .tooltiptext {
        visibility: visible;
      }
    }
    .tooltiptext {
      visibility: hidden;
      position: absolute;
      right: 0;
      top: 3.6rem;
      white-space: nowrap;
      text-align: left;
      background-color: var(--black-opacity);
      color: var(--white);
      width: 12rem;
      padding: 0.5rem 0.8rem;
      border-radius: 0.6rem;
    }
  }

  @media only screen and (max-width: 500rem) {
    .container .tooltip {
      display: none;
    }
  }

  .control {
    display: flex;
    justify-content: center;
  }

  .btn {
    display: inline-block;
    border: 0.2rem solid var(--black);
    font-size: 2rem;
    line-height: 2rem;
    padding: 1rem 1.6rem;
    margin: 1rem;
    border-radius: 3rem;
    transition: all 0.2s;

    &:hover {
      cursor: pointer;
      background-color: var(--black);
      color: var(--white);
    }

    &.small {
      font-size: 1.8rem;
    }
  }

  .index-btn {
    background-color: var(--black);
    color: var(--white);
    height: 4rem;
    line-height: 4rem;
    font-size: 2.4rem;
    margin: 2rem -4rem -6rem;
    padding: 2rem 4rem;
    border-radius: 0 0 2rem 2rem;
    transition: all 0.2s;

    &:hover {
      cursor: pointer;
      background-color: var(--black-hover);
      color: var(--white);
      font-size: 2.6rem;
    }
  }

  .title {
    .meta {
      color: var(--black);
      font-size: 2.8rem;
      height: 4rem;
      line-height: 4rem;
      margin: 1rem 0;
    }

    .str {
      color: var(--black);
      margin: 2rem 0;
    }
    .input {
      &.str {
        display: flex;
        align-items: center;
        font-size: 4.2rem;
        border: 1px solid var(--border);
        background: var(--gray-f6);
        padding: 1.4rem;
        min-height: 4.2rem;
        word-break: break-all;
        border-radius: 2rem;
      }

      span {
        flex: 1;
      }

      .icon {
        width: 2.6rem;
        height: 2.6rem;
        margin: 0 1rem;
        opacity: 0.4;
        transition: opacity 0.2s;
        &:hover {
          cursor: pointer;
          opacity: 1;
        }
      }
    }

    .placeholder {
      color: var(--gray);
    }

    .output.str {
      font-size: 4.8rem;
      word-break: break-all;
    }
  }

  .output-image {
    margin: 2rem 0;
    padding: 2rem 0;
    -webkit-touch-callout: text;
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }
}
</style>