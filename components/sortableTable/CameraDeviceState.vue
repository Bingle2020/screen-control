<template>
    <div class="eventTrend-module">
        <CameraDeviceState v-bind="$attrs" :id="Math.random().toString(36).substr(2,10)" />
    </div>
</template>

<script>
    import CameraDeviceState from '@/components/plugSortable/CameraDeviceState.vue'
    export default {
        components:{
            CameraDeviceState
        }
    }
</script>

<style lang="css">
.eventTrend-module div{
    width: 100% !important;
    height: 100% !important;
}
</style>