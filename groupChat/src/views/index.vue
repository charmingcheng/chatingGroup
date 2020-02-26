<template>
  <div class="home">
    <div>首页</div><br><br>
    <div @click="goChating">进入聊天室</div>
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
    console.log('mounted')
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
