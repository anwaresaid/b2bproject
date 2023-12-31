<template>
  <!--begin::Charts Widget 6-->
  <div :class="widgetClasses" class="card">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">{{ props.title }}</span>

        <span class="text-muted fw-semobold fs-7">{{ props.subTitle }}</span>
      </h3>

      <!--begin::Toolbar-->
      <!--   <div class="card-toolbar" data-kt-buttons="true">
        <a
          class="btn btn-sm btn-color-muted btn-active btn-active-primary active px-4 me-1"
          id="kt_charts_widget_6_sales_btn"
          >Sales</a
        >

        <a
          class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1"
          id="kt_charts_widget_6_expenses_btn"
          >Expenses</a
        >
      </div>
      end::Toolbar-->
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body">
      <!--begin::Chart-->
      <apexchart
        ref="chartRef"
        type="bar"
        :options="chart"
        :series="series"
      ></apexchart>
      <!--end::Chart-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Charts Widget 6-->
</template>

<script lang="ts" setup>
import { defineComponent, ref, computed, watch, onBeforeMount } from "vue";
import { useThemeStore } from "@/stores/theme";
import type { ApexOptions } from "apexcharts";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import type VueApexCharts from "vue3-apexcharts";

const props = defineProps({
  widgetClasses: String,
  title: String,
  subTitle: String,
  options: Object,
  categories: Array,
  data: Object,
});
const chartRef = ref<typeof VueApexCharts | null>(null);
let chart: ApexOptions = {};
const store = useThemeStore();

const series = [
  {
    name: "Net Profit",
    type: "bar",
    stacked: true,
    data: [40, 50, 65, 70, 50, 30],
  },
  {
    name: "Revenue",
    type: "bar",
    stacked: true,
    data: [20, 20, 25, 30, 30, 20],
  },
  {
    name: "Expenses",
    type: "area",
    data: [50, 80, 60, 90, 50, 70],
  },
];

const themeMode = computed(() => {
  return store.mode;
});

onBeforeMount(() => {
  Object.assign(chart, chartOptions());
});

const refreshChart = () => {
  if (!chartRef.value) {
    return;
  }

  Object.assign(chart, chartOptions());

  chartRef.value.refresh();
};

watch(themeMode, () => {
  refreshChart();
});

const chartOptions = (): ApexOptions => {
  // const labelColor = "rgb(161, 165, 183)";
  const labelColor = props.options.labelColor;
  const borderColor = props.options.borderColor;

  const baseColor = getCSSVariableValue(`--kt-${props.options.baseColor}`);
  const baseLightColor = getCSSVariableValue("--kt-primary-light");
  const secondaryColor = getCSSVariableValue(
    `--kt-${props.options.secondaryColor}`
  );

  return {
    chart: {
      fontFamily: "inherit",
      stacked: true,
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: "12%",
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: props.data?.monthsData,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      max: 120,
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val) {
          return "$" + val + " thousands";
        },
      },
    },
    colors: [baseColor, secondaryColor, baseLightColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  };
};
</script>
