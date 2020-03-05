<template>
  <div class="home">
    <div>首页</div>
    <br />
    <br />
    <div @click="goChating">进入聊天室</div>
    <video autoplay id="sourcevid" style="width:300px;height:500px"></video>

    <!-- <canvas id="output" style="display:none"></canvas> -->
  </div>
</template>
<script>
export default {
  date: {
    a: 'aaa'
  },
  created () {
    console.log('create')
  },
  mounted () {

  },
  methods: {
    goChating () {
      this.$router.push('/chating')
    }
  }

}
</script>

<style>
</style>
