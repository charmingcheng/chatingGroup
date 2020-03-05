<template>
  <div class="home">
    <div>首页</div>
    <br />
    <br />
    <div @click="goChating">进入聊天室</div>
    <video autoplay id="sourcevid" style="width:300px;height:500px"></video>

    <video autoplay height="480" id="video" width="640"></video>
    <button class="sexyButton" id="snap">Snap Photo</button>
    <canvas height="480" id="canvas" width="640"></canvas>

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
    // Grab elements, create settings, etc.
    var canvas = document.getElementById('canvas')
    var context = canvas.getContext('2d')
    var video = document.getElementById('video')
    var videoObj = { video: true }
    var errBack = function (error) {
      console.log(error, 'dsfsd')
      console.log('Video capture error: ', error.code)
    }

    // Put video listeners into place
    if (navigator.getUserMedia) {
      // Standard
      navigator.getUserMedia(
        videoObj,
        function (stream) {
          video.src = stream
          video.play()
        },
        errBack
      )
    } else if (navigator.webkitGetUserMedia) {
      // WebKit-prefixed
      navigator.webkitGetUserMedia(
        videoObj,
        function (stream) {
          video.src = window.webkitURL.createObjectURL(stream)
          video.play()
        },
        errBack
      )
    } else if (navigator.mozGetUserMedia) {
      // WebKit-prefixed
      navigator.mozGetUserMedia(
        videoObj,
        function (stream) {
          video.src = window.URL.createObjectURL(stream)
          video.play()
        },
        errBack
      )
    }

    // Trigger photo take
    document.getElementById('snap').addEventListener('click', function () {
      context.drawImage(video, 0, 0, 640, 480)
    })
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
