<template>
  <div class="eventTrend-module">
    <DoorDeviceState v-bind="$attrs" :id="Math.random().toString(36).substr(2,10)" />
  </div>
</template>

<script>
import DoorDeviceState from '@/components/plugSortable/DoorDeviceState.vue'
export default {
  components: {
    DoorDeviceState
  }
}
</script>

<style>
</style>