
<template>
    <div class="eventTrend-module">
        <plugLineEchart :getElementById="Math.random().toString(36).substr(2,10)" />
    </div>
</template>

<script>
    import plugLineEchart from '@/components/plugSortable/plugLineEchart.vue'
    export default {
        components:{
            plugLineEchart
        }
    }
</script>

<style>

</style>
