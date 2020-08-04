<template>
    <div class="eventTrend-module">
        <EleDevice v-bind="$attrs" :getElementById="Math.random().toString(36).substr(2,10)" />
    </div>
</template>

<script>
    import EleDevice from '@/components/plugSortable/EleDevice.vue'
    export default {
        components:{
            EleDevice
        }
    }
</script>

<style>

</style>
