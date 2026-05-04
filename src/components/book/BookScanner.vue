<script setup lang="ts">
// @ts-nocheck - @zxing/library types are outdated for stopContinuousDecodeFromInputVideoDevice
import { ref, onUnmounted } from 'vue'
import { BrowserMultiFormatReader } from '@zxing/library'

const emit = defineEmits<{
  (e: 'scanned', value: string): void
}>()

const visible = defineModel<boolean>('visible', { default: false })
const scanText = ref('')
const codeReader = ref<BrowserMultiFormatReader | null>(null)

function openScan() {
  codeReader.value = new BrowserMultiFormatReader()
  codeReader.value.getVideoInputDevices().then(devices => {
    let deviceId = devices[devices.length - 1].deviceId
    if (devices.length > 1) {
      const back = devices.find(d => d.label.toLowerCase().includes('back'))
      deviceId = back ? back.deviceId : deviceId
    }
    decodeFromInputVideoFunc(deviceId)
  }).catch(err => {
    console.error('Camera error:', err)
  })
}

function decodeFromInputVideoFunc(deviceId: string) {
  codeReader.value?.reset()
  codeReader.value?.decodeFromInputVideoDeviceContinuously(deviceId, 'scanner-video', (result, err) => {
    if (result) {
      scanText.value = result.getText()
      codeReader.value?.reset()
      codeReader.value?.stopContinuousDecodeFromInputVideoDevice()
    }
  })
}

function closeScan() {
  codeReader.value?.reset()
  codeReader.value?.stopContinuousDecodeFromInputVideoDevice()
  codeReader.value = null
}

function confirm() {
  emit('scanned', scanText.value)
  visible.value = false
}

onUnmounted(closeScan)
</script>

<template>
  <el-drawer v-model="visible" title="扫码识别" direction="rtl" size="500px">
    <div class="scanner-container">
      <video id="scanner-video" ref="scannerVideo" class="scanner-video" autoplay />
      <div v-if="!scanText" class="scanner-hint">
        <el-button type="primary" @click="openScan">打开摄像头</el-button>
      </div>
      <div v-else class="scanner-result">
        <p>识别结果: <strong>{{ scanText }}</strong></p>
        <div class="scanner-actions">
          <el-input v-model="scanText" placeholder="或手动输入ISBN" />
          <el-button type="primary" @click="confirm">确认</el-button>
          <el-button @click="closeScan; visible = false">取消</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scanner-video {
  width: 100%;
  max-height: 400px;
  border-radius: var(--radius-md);
}

.scanner-hint {
  margin-top: var(--space-6);
}

.scanner-result {
  text-align: center;
  margin-top: var(--space-4);
}

.scanner-result p {
  margin-bottom: var(--space-4);
  font-size: var(--text-lg);
}

.scanner-actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}
</style>
