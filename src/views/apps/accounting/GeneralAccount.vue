<template>
  <div class="mb-5">
    <div class="card d-flex flex-row">
      <span class="date-header d-flex align-items-center ps-2 border w-100"
        >from</span
      >
      <span class="date-header d-flex align-items-center ps-2 border w-100"
        >to</span
      >
    </div>
    <div class="d-flex flex-row">
      <el-date-picker
        v-model="dateFrom"
        type="date"
        placeholder="Pick a day"
        size="large"
      />
      <el-date-picker
        v-model="dateTo"
        type="date"
        placeholder="Pick a day"
        size="large"
      />
    </div>
    <div class="d-flex justify-content-end mt-2">
      <el-button type="primary" @click="handleChangeDates"
        >Apply Dates</el-button
      >
    </div>
  </div>
  <div class="row g-5 g-xl-8">
    <div class="card">
      <span class="card-title">{{ yearlySummaryTitle }}</span>
      <div class="col-xl-10" v-if="yearlySummary?.series" v-for="year in years">
        <ChartsWidget1
          widget-classes="card-xl-stretch mb-xl-8"
          :height="400"
          :options="options"
          :data="graphsData[year]?.yearly"
          :title="year"
        >
        </ChartsWidget1>
      </div>
    </div>
    <div class="row g-5 g-xl-8">
      <div class="card">
        <span class="card-title">{{ pcTitle }}</span>
        <div
          class="col-xl-10"
          v-if="yearlySummary?.series"
          v-for="year in years"
        >
          <ChartsWidget1
            widget-classes="card-xl-stretch mb-xl-8"
            :options="options"
            :height="400"
            :data="graphsData[year]?.pc"
            :title="year"
          ></ChartsWidget1>
        </div>
      </div>
    </div>
    <div class="row g-5 g-xl-8">
      <div class="card">
        <span class="card-title">{{ consoleTitle }}</span>
        <div
          class="col-xl-10"
          v-if="yearlySummary?.series"
          v-for="year in years"
        >
          <ChartsWidget1
            widget-classes="card-xl-stretch mb-xl-8"
            :options="options"
            :height="400"
            :data="graphsData[year]?.console"
            :title="year"
          ></ChartsWidget1>
        </div>
      </div>
    </div>
    <div class="row g-5 g-xl-8">
      <div class="card">
        <span class="card-title">{{ giftTitle }}</span>
        <div
          class="col-xl-10"
          v-if="yearlySummary?.series"
          v-for="year in years"
        >
          <ChartsWidget1
            widget-classes="card-xl-stretch mb-xl-8"
            :options="options"
            :height="400"
            :data="graphsData[year]?.gift"
            :title="year"
          ></ChartsWidget1>
        </div>
      </div>
    </div>
    <div class="d-flex flex-wrap justify-content-between w-100">
      <GeneralAccountingCard
        v-for="key in generalSummaryKeys"
        class="general-card"
        :data="generalSummary[key]"
        :title="cardTitles(key)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChartsWidget1 from "@/components/widgets/charts/Widget1.vue";
import ApiService from "@/core/services/ApiService";
import GeneralAccountingCard from "../../../components/cards/GeneralAcountingCard.vue";
import { dateFormatter } from "../utils/functions";
import { errorHandling } from "@/views/apps/utils/functions";

import {
  ref,
  reactive,
  onMounted,
  watch,
  onBeforeMount,
  defineComponent,
} from "vue";
import Summary from "@/components/subscriptions/add/Summary.vue";

defineComponent({
  components: {
    ChartsWidget1,
    GeneralAccountingCard,
  },
});
const yearlySummaryTitle = ref("Summary of Year");
const pc_id = "1";
const pcTitle = "PC";
const console_id = "2";
const consoleTitle = "Console";
const gift_id = "3";
const giftTitle = "Gift Card/Epin";

const currentYear = new Date().getFullYear();

const dateFrom = ref();
const dateTo = ref(null);
const generalSummary = ref({});
const generalSummaryKeys = ref([]);
const years = ref();
const options = reactive({
  labelColor: "rgb(161, 165, 183)",
  borderColor: "lightgrey",
  baseColor: "success",
  secondaryColor: "info",
});
const yearlySummary = ref({
  monthsData: [],
  totalExpense: [],
  totalRevenue: [],
  totalNet: [],
});

const pcData = ref({
  monthsData: [],
  totalExpense: [],
  totalRevenue: [],
  totalNet: [],
});
const consoleData = ref({
  monthsData: [],
  totalExpense: [],
  totalRevenue: [],
  totalNet: [],
});
const giftData = ref({
  monthsData: [],
  totalExpense: [],
  totalRevenue: [],
  totalNet: [],
});
const fullData = ref({});
const graphsData = ref({});
// const dateFormatter = (date) => {
//   const day =
//     ("" + (date.value.getDate() + 1)).length > 1
//       ? date.value.getDate()
//       : "0" + date.value.getDate();
//   const month =
//     ("" + date.value.getMonth()).length > 1
//       ? 1 + date.value.getMonth()
//       : "0" + (date.value.getMonth() + 1);
//   const year = date.value.getFullYear();
//   const fullDate = day + "." + month + "." + year;
//   return fullDate;
// };
const fetchData = () => {
  const date = dateTo.value
    ? { from: dateFormatter(dateFrom), to: dateFormatter(dateTo) }
    : { from: "01.01.2023" };
  graphsData.value = {};

  yearlySummary.value = {
    monthsData: [],
    totalExpense: [],
    totalRevenue: [],
    totalNet: [],
  };

  pcData.value = {
    monthsData: [],
    totalExpense: [],
    totalRevenue: [],
    totalNet: [],
  };
  consoleData.value = {
    monthsData: [],
    totalExpense: [],
    totalRevenue: [],
    totalNet: [],
  };
  giftData.value = {
    monthsData: [],
    totalExpense: [],
    totalRevenue: [],
    totalNet: [],
  };

  ApiService.postTest("accounting/general-account", date)
    .then((res) => {
      years.value = res.data.data.years;
      generalSummary.value = res.data.data.general_summaries;
      generalSummaryKeys.value = Object.keys(generalSummary.value);
      let dataTemp;
      if (years.value.length > 1) {
        years.value.map((year) => {
          fullData.value[year] = res.data.data.per_month_data.filter(
            (months) => months.year_id === year
          );
        });
        dataTemp = fullData.value;
        years.value.map((year) => {
          graphsData.value[year] = handleAssignVariables(dataTemp[year]);
        });
      } else {
        dataTemp = res.data.data.per_month_data;
        years.value.map((year) => {
          graphsData.value[year] = handleAssignVariables(dataTemp);
        });
      }
    })
    .catch((e) => {
      errorHandling(e.response.data.messages);
    });
};

const handleAssignVariables = (data) => {
  yearlySummary.value = {
    monthsData: [],
    totalExpense: [],
    totalRevenue: [],
    totalNet: [],
  };

  pcData.value = {
    monthsData: [],
    totalExpense: [],
    totalRevenue: [],
    totalNet: [],
  };
  consoleData.value = {
    monthsData: [],
    totalExpense: [],
    totalRevenue: [],
    totalNet: [],
  };
  giftData.value = {
    monthsData: [],
    totalExpense: [],
    totalRevenue: [],
    totalNet: [],
  };
  //assigning months
  data.map((item) => {
    yearlySummary.value.monthsData.push(item.month_name);
    pcData.value.monthsData.push(item.month_name);
    consoleData.value.monthsData.push(item.month_name);
    giftData.value.monthsData.push(item.month_name);
    //yearly summary data
    yearlySummary.value.totalExpense.push(item.total_cost);
    yearlySummary.value.totalRevenue.push(item.total_giro);
    yearlySummary.value.totalNet.push(item.total_margin);
    //get data for pcs
    let temp = item.category_info.find((c) => c.category_id * 1 === 1 * pc_id);
    pcData.value.totalExpense.push(temp?.cost.toFixed(2));
    pcData.value.totalRevenue.push(temp?.giro.toFixed(2));
    pcData.value.totalNet.push(temp?.profit.toFixed(2));
    // get console data
    temp = item.category_info.find((c) => 1 * c.category_id === 1 * console_id);
    consoleData.value.totalExpense.push(temp?.cost.toFixed(2));
    consoleData.value.totalRevenue.push(temp?.giro.toFixed(2));
    consoleData.value.totalNet.push(temp?.profit.toFixed(2));
    // get giftcard/epin data
    temp = item.category_info.find((c) => 1 * c.category_id === 1 * gift_id);
    giftData.value.totalExpense.push(temp?.cost.toFixed(2));
    giftData.value.totalRevenue.push(temp?.giro.toFixed(2));
    giftData.value.totalNet.push(temp?.profit.toFixed(2));
  });
  //setting yearly summary series
  yearlySummary.value.series = [
    { name: "Net Profit", data: yearlySummary.value.totalNet },
    { name: "Revenue", data: yearlySummary.value.totalRevenue },
    { name: "Expenses", data: yearlySummary.value.totalExpense },
  ];
  //setting yearly pc series
  pcData.value.series = [
    { name: "Net Profit", data: pcData.value.totalNet },
    { name: "Revenue", data: pcData.value.totalRevenue },
    { name: "Expenses", data: pcData.value.totalExpense },
  ];
  //setting yearly console series
  consoleData.value.series = [
    { name: "Net Profit", data: consoleData.value.totalNet },
    { name: "Revenue", data: consoleData.value.totalRevenue },
    { name: "Expenses", data: consoleData.value.totalExpense },
  ];
  //setting yearly giftcadr series
  giftData.value.series = [
    { name: "Net Profit", data: giftData.value.totalNet },
    { name: "Revenue", data: giftData.value.totalRevenue },
    { name: "Expenses", data: giftData.value.totalExpense },
  ];
  return {
    yearly: yearlySummary.value,
    pc: pcData.value,
    console: consoleData.value,
    gift: giftData.value,
  };
};
const handleChangeDates = () => {
  fetchData();
};

const cardTitles = (item) => {
  switch (item) {
    case "yesterday":
      return "Yesterday Sales";
    case "today":
      return "Today Sales";
    case "this_week":
      return "This Week Sales";
    case "this_month":
      return "This Month Sales";
    case "this_year":
      return "This Year Sales";
    case "two_week":
      return "Last Week + This Week Sales";
    case "last_month":
      return "Last Month sales";
    case "general_sales":
      return "General Sales";
  }
};

watch(dateFrom, (newValue) => {});
watch(dateTo, (newValue) => {});

onMounted(() => {
  dateFrom.value = new Date("2023, 01, 01");
  fetchData();
});
</script>
<style>
.container {
  height: 10px !important;
}
.date-header {
  height: 30px;
}
.card-title {
  margin-top: 5%;
  margin-left: 11%;
  font-weight: bold;
  font-size: 20px;
}
.general-card {
  width: 47%;
  margin-top: 2%;
}
</style>
