<template>
  <div class="AboutView">
    <!-- Camera Area -->
    <video ref="video" id="video" class="scan-video" autoplay></video>
    
    <div class="but_box">
      <div>
        <span>ISBN编号：</span>
        <input type="text" v-model="scanText">
      </div>
      <div>
        <button @click="openScan">扫码</button>
      </div>
      <div>
        <button @click="closeScan">关闭</button>
      </div>
      <div>
        <button @click="postScanData">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { BrowserMultiFormatReader } from '@zxing/library';

const codeReader = ref(null);
const emit = defineEmits(["getValue"]);
const scanText = ref('');

const openScan = () => {
  codeReader.value = new BrowserMultiFormatReader();
  codeReader.value.getVideoInputDevices().then(videoDevices => {
    let firstDeviceId = videoDevices[videoDevices.length - 1].deviceId;
    if (videoDevices.length > 1) {
      const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back'));
      firstDeviceId = backCamera ? backCamera.deviceId : firstDeviceId;
    }
    decodeFromInputVideoFunc(firstDeviceId);
  }).catch(err => {
    alert('Error accessing camera: ' + err);
    console.error(err);
  });
};

// Scan Function
const decodeFromInputVideoFunc = (deviceId) => {
  codeReader.value.reset();
  codeReader.value.decodeFromInputVideoDeviceContinuously(deviceId, 'video', (result, err) => {
    if (result) {
      alert(result.text);
      console.log('Scan result:', result);
      scanText.value = result.text;
      if (scanText.value) {
        codeReader.value.reset();
        codeReader.value.stopContinuousDecodeFromInputVideoDevice();
      }
    }
    if (err) {
      console.error(err);
    }
  });
};

// Close Camera Function
const closeScan = () => {
  if (codeReader.value) {
    codeReader.value.reset();
    codeReader.value.stopContinuousDecodeFromInputVideoDevice();
  }
};

// Submit Scan Result
const postScanData = () => {
  emit("getValue", scanText.value);
};

onMounted(() => {
  // Initialize the scan on mount if needed
  // openScan();
});
</script>

<style scoped lang='scss'>
.AboutView {
}

video {
  position: fixed;
  left: 30%;
  width: 40%;
  height: 70%;
}

.but_box {
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  
  div {
    display: flex;
    margin: 0.125rem 0;
    justify-content: space-around;
    
    span {
      width: 5.625rem;
      text-align: right;
    }
    
    input {
      text-align: center;
    }
    
    button {
      width: 8.4375rem;
      height: 2.75rem;
      font-size: 1.5625rem;
      font-weight: 600;
      color: lavenderblush;
      background-color: rgba(0, 183, 255, 0.8);
      border: none;
      border-radius: 0.5rem;
    }
  }
}
</style>
