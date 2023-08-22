<template>
  <div class="d-flex align-items-center row g-5 g-xxl-8">
    <div class="col-xl-6 h-100">
      <KTChartWidget1
        widget-classes="mb-5 mb-xxl-8"
        :title="'title'"
      ></KTChartWidget1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import KTChartWidget1 from "@/components/widgets/charts/Widget1.vue";

defineComponent({
  components: {
    KTChartWidget1,
  },
});
</script>
<style>
.container {
  height: 10px !important;
}
</style>
