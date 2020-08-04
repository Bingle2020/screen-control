
<template>
    <div class="activeMedia-module">
        <plugHistogram :getElementById="Math.random().toString(36).substr(2,10)" />
    </div>
</template>

<script>
    import plugHistogram from '@/components/plugSortable/plugHistogram.vue'
    export default {
        components:{
            plugHistogram
        }
    }
</script>

<style>

</style>
