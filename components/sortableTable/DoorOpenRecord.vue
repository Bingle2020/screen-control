<template>
    <div class="eventTrend-module">
        <DoorOpenRecord v-bind="$attrs" :getElementById="Math.random().toString(36).substr(2,10)" />
    </div>
</template>

<script>
    import DoorOpenRecord from '@/components/plugSortable/DoorOpenRecord.vue'
    export default {
        components:{
            DoorOpenRecord
        }
    }
</script>

<style>

</style>

