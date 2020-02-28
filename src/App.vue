<template>
  <div id="app">
    <Loading></Loading>
    <Container></Container>
    <Footer></Footer>
  </div>
</template>

<script>
import Loading from './components/Loading'
import Footer from './components/Footer'
import Container from './components/Container'

export default {
  name: 'App',
  components: {
    Loading,
    Footer,
    Container
  }
}
</script>

<style lang="scss">
@import url("./assets/style/style.scss");
</style>
