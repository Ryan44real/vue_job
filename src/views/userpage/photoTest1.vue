<template>
  <div class="main">
    <!-- 画笔控件 用来拍照 -->
    <canvas style="display: none" ref="canvasDom"/>
    <!-- 播放器，用来播放拍摄的视频 -->
    <video v-if="!imgurl" class="camera_video" ref="videoDom"/>
    <!--  显示照片  -->
    <img v-else :src="imgurl"/>
    <br/>
    <button @click="takePhoto">{{ imgurl ? "重拍" : "拍照" }}</button>
  </div>
</template>


<script setup>
import {ref, onMounted} from "vue";
// canvas控件对象
const canvasDom = ref(null);
// video 控件对象
const videoDom = ref(null);
// 照片路径
const imgurl = ref('C:/Users/Rain/Desktop/BYSJ');


const openCamera = () => {
  // 检测浏览器是否支持mediaDevices
  if (navigator.mediaDevices) {
    navigator.mediaDevices
        // 开启视频，关闭音频
        .getUserMedia({audio: false, video: true})
        .then((stream) => {
          // 将视频流传入viedo控件
          videoDom.value.srcObject = stream;
          // 播放
          videoDom.value.play();
        })
        .catch((err) => {
          console.log(err);
        });
  } else {
    window.alert("该浏览器不支持开启摄像头，请更换最新版浏览器");
  }
};

// 拍照
const takePhoto = () => {
  // 如果已经拍照了就重新启动摄像头
  if (imgurl.value) {
    imgurl.value = null;
    openCamera()
    return;
  }

  // 设置画布大小与摄像大小一致
  canvasDom.value.width = videoDom.value.videoWidth;
  canvasDom.value.height = videoDom.value.videoHeight;
  // 执行画的操作
  canvasDom.value.getContext("2d").drawImage(videoDom.value, 0, 0);
  // 将结果转换为可展示的格式
  imgurl.value = canvasDom.value.toDataURL("image/webp");
  // 关闭摄像头
  stop();
}


// 关闭摄像头
const stop = () => {
  let stream = videoDom.value.srcObject;
  if (!stream) return;
  let tracks = stream.getTracks();
  tracks.forEach((x) => {
    x.stop();
  });

};

// 打开摄像头
onMounted(() => {
  openCamera();
});
</script>

<style scoped>
.main {
  width: 80px;
  height: 50px;
  margin: auto auto;
}

.camera_video {
  width: 30%;
  height: 30%;
  border: 2px black solid;
}
</style>

