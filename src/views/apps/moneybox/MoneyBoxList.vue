<template>
  <div class="d-flex w-100 flex-wrap justify-content-between">
    <div v-for="box in moneyboxeData" class="col-lg-6 col-xxl-6 p-10">
      <MoneyBoxCard
        :classId="generateId(box)"
        :remainingBalance="box.remaining_balance"
        :balance="box.balance"
        :spent="box.spent_balance"
        :name="box.name"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { orderType, orderStatus } from "../utils/constants";
import { useRouter } from "vue-router";
import MoneyBoxCard from "@/components/cards/MoneyBoxCard.vue";
import store from "../../../store";

const moneyboxeData = ref([]);
const router = useRouter();
const searchOrders = ref("");
const dropdownParams = ref({});
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(10);
const currentPage = ref(1);
const paginationData = reactive({});
const tableType = ref();

const fetchMoneyBox = (type) => {
  //   if (type === undefined) {
  //     params.value.current_page = currentPage;
  //     params.value.per_page = itemsInTable;
  //     params.value.page_type = tableType.value;
  //   }
  ApiService.postTest("moneyboxes/all", params.value).then((res) => {
    moneyboxeData.value = res.data.data.MoneyBoxes;
    store.dispatch("setPageItems", res.data.data.pagination.total_items);
  });
};
const generateId = (item) => {
  return "kt_card_" + item.id + "_" + item.name;
};

//   const getItemsInTable = (item) => {
//     params.value.per_page = item;
//     fetchMoneyBox();
//   };
//   const pageChange = (page: number) => {
//     params.value.current_page = page;
//     fetchMoneyBox();
//   };

//   watch(tableType, (newValue) => {
//     params.value.order_type = tableType.value;

//     fetchMoneyBox();
//   });
onMounted(() => {
  // params.value.current_page = currentPage;
  // params.value.per_page = itemsInTable;
  // params.value.page_type = tableType.value;
  fetchMoneyBox();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style>
.moneybox-card {
  width: 40%;
}
.moneybox-container {
  background-color: lightblue;
}
</style>
