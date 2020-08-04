<template>
    <div class="eventTrend-module">
        <EleDeviceState v-bind="$attrs" :id="Math.random().toString(36).substr(2,10)" />
    </div>
</template>

<script>
    import EleDeviceState from '@/components/plugSortable/EleDeviceState.vue'
    export default {
        components:{
            EleDeviceState
        }
    }
</script>