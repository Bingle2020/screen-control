
<template>
    <div class="eventTrend-module">
        <DoorAuthorizeType v-bind="$attrs" :getElementById="Math.random().toString(36).substr(2,10)" />
    </div>
</template>

<script>
    import DoorAuthorizeType from '@/components/plugSortable/DoorAuthorizeType.vue'
    export default {
        components:{
            DoorAuthorizeType
        }
    }
</script>

<style>

</style>
