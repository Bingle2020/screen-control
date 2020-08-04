<template>
    <div class="eventTrend-module">
        <DoorTotalOpenRecord v-bind="$attrs" :getElementById="Math.random().toString(36).substr(2,10)" />
    </div>
</template>

<script>
    import DoorTotalOpenRecord from '@/components/plugSortable/DoorTotalOpenRecord.vue'
    export default {
        components:{
            DoorTotalOpenRecord
        }
    }
</script>