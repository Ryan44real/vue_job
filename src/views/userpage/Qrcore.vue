<template>
    <div class="scan">
      <div class="video-container">
        <div class="scan-box"></div>
        <video class="video" id="video-1"></video>
      </div>
      <!-- <div class="camera-container" v-if="videoInputDevices.length">
        <label>摄像头：</label>
        <select v-model="currentVideoInputDevice">
          <option
            v-for="(videoInputDevice, index) in videoInputDevices"
            :key="index"
            :value="videoInputDevice"
          >
            {{ videoInputDevice.label=='Video device 2'?'后置摄像头':'前置摄像头' }}
          </option>
        </select>
      </div> -->
      <!-- <div class="scan-animation">
        <div class="scan-line"></div>
        <div class="scan-box"></div>
      </div> -->
    </div>
  </template>
   
  <script>
  import {
    BrowserMultiFormatReader,
    ChecksumException,
    FormatException,
  } from "@zxing/library";
  export default {
    name: "Scan",
    data() {
      return {
        codeReader: new BrowserMultiFormatReader(),
        videoInputDevices: [],
        currentVideoInputDevice: {},
        decodeResult: undefined,
      };
    },
    methods: {
      async openScan() {
        const _this = this;
        _this.codeReader
          .getVideoInputDevices() //老版本listVideoInputDevices()
          .then((videoInputDevices) => {
            if (videoInputDevices && videoInputDevices.length) {
              if (videoInputDevices.length > 1) {
                videoInputDevices.reverse();
              } //防止先唤出前摄像头
              _this.videoInputDevices = videoInputDevices;
              _this.currentVideoInputDevice = videoInputDevices[0];
            }
          })
          .catch(() => {});
      },
   
      decodeFromInputVideo() {
        const _this = this;
        _this.codeReader.reset();
        // 多次
        _this.codeReader.decodeFromVideoDevice(
          _this.currentVideoInputDevice.deviceId,
          "video-1",
          (result, err) => {
            if (result) {
              _this.decodeResult = result;
            }
            if (err) {
              if (err instanceof ChecksumException) {
                alert(1);
                console.log(
                  "A code was found, but it's read value was not valid."
                );
              }
              if (err instanceof FormatException) {
                alert(2);
                console.log("A code was found, but it was in a invalid format.");
              }
            }
          }
        );
      },
   
      successDecode() {
        const _this = this;
        alert(_this.decodeResult.text);
      },
    },
    watch: {
      currentVideoInputDevice: function () {
        this.decodeFromInputVideo();
      },
      decodeResult: function () {
        this.successDecode();
      },
    },
    mounted: function () {
      this.openScan();
    },
    unmounted: function () {
      this.codeReader.reset(); //关闭摄像头
    },
  };
  </script>
  <style scoped lang="scss">
  .scan {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: hidden;
    background-color: #000;
    color: #fff;
  }
   
  // .video-container {
  //   margin-bottom: 20px;
  // }
   
  .video {
    width: 100vw;
    height: 90vh;
    overflow: hidden;
    // border: 2px solid #ff9900;
    border-radius: 10px;
    // box-shadow: 0 0 10px rgba(255, 153, 0, 0.5);
  }
   
  .camera-container {
    display: flex;
    align-items: center;
  }
   
  label {
    margin-right: 10px;
  }
   
  select {
    padding: 8px;
    border: 2px solid #ff9900;
    border-radius: 5px;
    background-color: transparent;
    color: #ff9900;
  }
   
  .scan-animation {
    position: relative;
    width: 200px;
    height: 200px;
    margin-top: 20px;
    // border: 2px solid #ff9900;
  }
   
  .scan-box {
    position: absolute;
    top: 0;
    left: 16%;
    width: 70%;
    height: 2px;
    box-sizing: border-box;
    background: linear-gradient(
      to left,
      #0074d9 0%,
      #0074d9 20%,
      transparent 40%,
      transparent 60%,
      #0074d9 80%,
      #0074d9 100%
    );
    animation: scanBoxAnimation 2s infinite;
  }
   
  @keyframes scanBoxAnimation {
    0% {
      transform: translateY(15vh);
    }
    50% {
      transform: translateY(70vh);
    }
    100% {
      transform: translateY(15vh);
    }
  }
  </style>