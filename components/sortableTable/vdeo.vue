<template>
    <div class="eventTrend-module">
        <vdeo :getElementById="Math.random().toString(36).substr(2,10)" />
    </div>
</template>

<script>
    import vdeo from '@/components/plugSortable/vdeo.vue'
    export default {
        components:{
            vdeo
        }
    }
</script>

<style>

</style>
