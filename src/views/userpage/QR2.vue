<template>
    <div class="scanner-container">
        <div v-show="!isLoading">
            <video poster="data:image/gif,AAAA" ref="scanner"></video>
            <div class="overlay-element"></div>
            <div class="laser"></div>
        </div>
    </div>
</template>
 
<script>
import { BrowserMultiFormatReader, Exception } from "@zxing/library";
 
export default {
    name: "stream-barcode-reader",
 
    data() {
        return {
            idealDevice: {},
            cameraDetails: {},
            videoDevices: [],
            isLoading: true,
            codeReader: new BrowserMultiFormatReader(),
            isMediaStreamAPISupported:
                navigator &&
                navigator.mediaDevices &&
                "enumerateDevices" in navigator.mediaDevices
        };
    },
 
    mounted() {
        if (!this.isMediaStreamAPISupported) {
            throw new Exception("Media Stream API is not supported");
            // return;
        }
 
        // // this.start();
        // this.$refs.scanner.oncanplay = event => {
            // this.isLoading = false;
        //     this.$emit("loaded");
 
        //     // this.$refs.scanner.srcObject.getVideoTracks()[0].applyConstraints({
        //     //     advanced: [{ focusMode: 'continuous' }]
        //     // });
        //     this.getData();
        // };
        this.getData();
 
    },
 
    beforeUnmount() {
        this.codeReader.reset();
    },
 
    methods: {
        async findIdealDevice(devices, deviceId = false) {
            let deviceOptions = []
            let cameras = []
            cameras = devices.filter((device) => device.kind === 'videoinput' && device.label.toLowerCase().indexOf('front') === -1)
            if (cameras.length === 0) {
                cameras = devices.filter((device) => device.kind === 'videoinput')
            }
            this.cameraDetails.requestedDeviceId = deviceId
            this.cameraDetails.cameras = devices.filter(device => device.kind === 'videoinput')
            this.cameraDetails.filteredCameras = cameras
            this.cameraDetails.constraints = []
 
 
 
            for (let index = 0; index < cameras.length; index++) {
                const constraints = { video: true }
                constraints.video = { facingMode: 'environment' }
                if (cameras[index].deviceId) {
                    constraints.video.deviceId = {
                        exact: cameras[index].deviceId,
                    }
                }
                this.cameraDetails.constraints.push(constraints)
                await navigator.mediaDevices.getUserMedia(constraints)
                    .then(stream => {
                        const track = stream.getVideoTracks()[0]
                        const trackCapabilities = {
                            deviceId: cameras[index].deviceId,
                            ...track.getCapabilities() == null ? {} : track.getCapabilities(),
                        }
                        deviceOptions.push(trackCapabilities)
                        stream.getTracks().forEach(track => { track.stop() })
                        return true
                    })
                    .catch(() => { return false })
            }
            this.cameraDetails.deviceOptions = deviceOptions
 
            if (deviceOptions.length > 0) {
                // If rear facing (environment) camera(s), use only those
                const environmentFacing = deviceOptions.filter(device => device.facingMode.includes('environment'))
                if (environmentFacing.length > 0) {
                    deviceOptions = environmentFacing
                }
 
                // Find ideal device (hopefully includes torch and continuous focus)
                let idealIndex = deviceOptions.length - 1
                for (let index = 0; index < deviceOptions.length; index++) {
                    if (deviceOptions[index].torch && deviceOptions[index].focusMode.includes('continuous')) {
                        idealIndex = index
                        break
                    } else if (deviceOptions[index].torch) {
                        idealIndex = index
                    }
                }
 
                this.idealDevice = deviceOptions[idealIndex]
                localStorage.setItem('vue-barcode-reader-ideal', JSON.stringify(deviceOptions[idealIndex]))
                return true
            } else {
                return false
            }
        },
 
 
        async getData() {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                this.findIdealDevice(devices).then(() => {
                    this.selectCamera()
                })
            })
 
 
 
 
        },
 
        selectCamera() {
            // Make sure the ideal device we found is available with the code reader (if not, do a search)
            this.codeReader.listVideoInputDevices().then((videoInputDevices) => {
                if (this.noFrontCameras) {
                    videoInputDevices = videoInputDevices.filter(device => device.label.toLowerCase().indexOf('front') === -1)
                }
                this.videoDevices = { devices: videoInputDevices }
                if (videoInputDevices.findIndex(device => device.deviceId === this.idealDevice.deviceId) === -1) {
                    this.idealDevice = {}
                    localStorage.removeItem('vue-barcode-reader-ideal')
                    navigator.mediaDevices.enumerateDevices().then(devices => {
                        this.findIdealDevice(devices).then(() => {
                            this.selectCamera()
                        })
                    })
                    return
                }
 
                // Now start the barcode reader
                this.start(this.idealDevice.deviceId)
                this.$refs.scanner.oncanplay = (event) => {
                    this.isLoading = false
                    this.videoDevices.selectedId = this.idealDevice.deviceId
                    this.videoDevices.selectedIndex = this.videoDevices.devices.findIndex(device => device.deviceId === this.idealDevice.deviceId)
                    this.cameraDetails.videoDevices = this.videoDevices.devices
                    this.cameraDetails.selectedIndex = this.videoDevices.selectedIndex
                    this.cameraDetails.selectedDeviceId = this.idealDevice.deviceId
                    this.cameraDetails.selectedDevice = this.idealDevice
 
                    this.applyCameraConstraints()
                }
            })
        },
 
 
 
        applyCameraConstraints() {
            const constraints = { video: true }
 
            this.$refs.scanner.srcObject.getVideoTracks()[0].applyConstraints({
                advanced: [{ focusMode: 'continuous' }]
            }).catch(() => { })
        },
 
        start(deviceId) {
      this.codeReader.timeBetweenDecodingAttempts = this.msBetweenDecoding
            this.codeReader.decodeFromVideoDevice(
                deviceId,
                this.$refs.scanner,
                (result, err) => {
                    if (result) {
                        console.log(result)
                        this.$emit("decode", result.text);
                    }
                }
            );
        }
    }
};
</script>
 
<style scoped>
video {
    max-width: 100%;
    max-height: 100%;
}
 
.scanner-container {
    position: relative;
}
 
.overlay-element {
    position: absolute;
    top: 0;
    width: 100%;
    height: 99%;
    background: rgba(30, 30, 30, 0.5);
 
    -webkit-clip-path: polygon(0% 0%,
            0% 100%,
            20% 100%,
            20% 20%,
            80% 20%,
            80% 80%,
            20% 80%,
            20% 100%,
            100% 100%,
            100% 0%);
    clip-path: polygon(0% 0%,
            0% 100%,
            20% 100%,
            20% 20%,
            80% 20%,
            80% 80%,
            20% 80%,
            20% 100%,
            100% 100%,
            100% 0%);
}
 
.laser {
    width: 60%;
    margin-left: 20%;
    background-color: tomato;
    height: 1px;
    position: absolute;
    top: 40%;
    z-index: 2;
    box-shadow: 0 0 4px red;
    -webkit-animation: scanning 2s infinite;
    animation: scanning 2s infinite;
}
 
@-webkit-keyframes scanning {
    50% {
        -webkit-transform: translateY(75px);
        transform: translateY(75px);
    }
}
 
@keyframes scanning {
    50% {
        -webkit-transform: translateY(75px);
        transform: translateY(75px);
    }
}
</style>