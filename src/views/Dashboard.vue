<template>
  <!--begin::Row-->
  <div
    class="d-flex row align-items-start justify-content-between g-5 g-xl-10 mb-5 mb-xl-10"
  >
    <!--begin::Col-->
    <div class="col-xl-6">
      <SummaryTable
        :items="items"
        :navbar="true"
        :title="'Daily / Weekly / Monthly Data'"
        :headers="tableHeadersWeekly"
        className="h-md-100"
      >
        <template #component3="row">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="row.game?.name"
            placement="top-start"
          >
            <span
              :class="`game-name-link badge py-3 px-4 fs-7 badge-light-warning`"
              @click="navigateToGameDetailsPage(row.game.uuid)"
              >{{ row.game?.name }}</span
            >
          </el-tooltip>
        </template>
        <template #component2="row">
          <span :class="`badge py-3 px-4 fs-7 badge-light-success`">{{
            row?.new_stock
          }}</span>
        </template>
        <template #component1="row">
          <span :class="`badge py-3 px-4 fs-7 badge-light-danger`">{{
            row.old_stock
          }}</span>
        </template>
        <template #component4="row">
          <span :class="'text-gray-600 fw-bold fs-6'">{{
            row.customer?.name
          }}</span>
        </template>
        <template #component5="row">
          <span :class="'text-gray-600 fw-bold fs-6'">{{
            row.supplier?.name
          }}</span>
        </template>
      </SummaryTable>
    </div>
    <!--end::Col-->
    <!--begin::Col-->
    <div class="col-xl-6">
      <SummaryTable
        :data="customersSummaryData"
        :navbar="false"
        :headers="customersTableHeaders"
        :title="'Customer Summary Data'"
        className="h-md-100"
      >
        <template #component2="row">
          <div v-for="(item, index) in row.order_items">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="item?.game?.name"
              placement="top-start"
            >
              <span
                :class="`game-name-link px-0  badge badge-light-warning`"
                @click="navigateToGameDetailsPage(item.game.uuid)"
                >{{ item.game?.name
                }}{{
                  ` * ${item.quantity} ${
                    row.order_items.length > 1 &&
                    index < row.order_items.length - 1
                      ? ","
                      : ""
                  }`
                }}
              </span>
            </el-tooltip>
          </div>
        </template>
        <template #component4="row">
          <span :class="'text-gray-600 fw-bold fs-6'">{{
            row.customer?.name
          }}</span>
        </template>
      </SummaryTable>
    </div>
    <!--end::Col-->
    <!--begin::Col-->
    <div class="col-xl-12">
      <SummaryTable
        :data="loadingSummaryData"
        :navbar="false"
        :headers="tableHeaders"
        :title="'Last game updates'"
        className="h-md-100"
      >
        <template #component3="row">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="row.game?.name"
            placement="top-start"
          >
            <span
              :class="`game-name-link badge py-3 px-4 fs-7 badge-light-warning`"
              @click="navigateToGameDetailsPage(row.game.uuid)"
              >{{ row.game?.name }}</span
            >
          </el-tooltip>
        </template>
        <template #component2="row">
          <span :class="`badge py-3 px-4 fs-7 badge-light-success`">{{
            row.new_stock
          }}</span>
        </template>
        <template #component1="row">
          <span :class="`badge py-3 px-4 fs-7 badge-light-danger`">{{
            row.old_stock
          }}</span>
        </template>
        <template #component6="row">
          <span :class="`badge py-3 px-4 fs-7 badge-light-success`">{{
            row.qty
          }}</span>
        </template>
        <template #component4="row">
          <span :class="'text-gray-600 fw-bold fs-6'">{{
            row.game?.publisher?.name
          }}</span>
        </template>
        <template #component5="row">
          <span :class="'text-gray-600 fw-bold fs-6'">{{
            row.supplier?.name
          }}</span>
        </template>
      </SummaryTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import SummaryTable from "@/components/kt-datatable/SummaryTable.vue";
import { orderType, orderStatus } from "./apps/utils/constants";
import { useRouter } from "vue-router";
import { errorHandling } from "@/views/apps/utils/functions";
import DropdownRemote from "../components/dropdown/DropdownRemote.vue";
import store from "../store";

const summaryData = ref([]);
const customersSummaryData = ref([]);
const gamesSummaryData = ref([]);
const loadingItems = ref(false);
const loadingCustomersSummaryData = ref(false);
const loadingSummaryData = ref(false);
const loadingGamesSummaryData = ref(false);
const router = useRouter();
const searchOrders = ref("");
const dropdownParams = ref({});
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(10);
const todayTable = ref([]);
const weekTable = ref([]);
const monthTable = ref([]);
const currentPage = ref(1);
const paginationData = reactive({});
const tableType = ref({ value: 2, label: "customer" });
const loading = ref(false);

const tableHeaders = ref([
  {
    columnName: "GAME",
    custom: "component3",
  },
  {
    columnName: "PUBLISHER",
    custom: "component4",
  },
  {
    columnName: "SUPPLIER",
    columnLabel: "supplier",
    custom: "component5",
  },
  {
    columnName: "NEW STOCK",
    custom: "component2",
    sortEnabled: true,
  },
  {
    columnName: "OLD STOCK",
    custom: "component1",
    sortEnabled: true,
  },
  {
    columnName: "QUANTITY",
    custom: "component6",
    sortEnabled: true,
  },
  {
    columnName: "DATE",
    columnLabel: "date",
    sortEnabled: false,
  },
]);

const customersTableHeaders = ref([
  {
    columnName: "GAME",
    custom: "component2",
  },
  {
    columnName: "CUSTOMER",
    custom: "component4",
  },

  {
    columnName: "ORDER CODE",
    columnLabel: "order_code",
    sortEnabled: true,
    columnWidth: 170,
  },
]);
const tableHeadersWeekly = ref([
  {
    columnName: "GAME",
    columnLabel: "game_name",
  },
  {
    columnName: "GAME ID",
    columnLabel: "game_id",
  },
  {
    columnName: "KEYS SOLD",
    columnLabel: "sale",
  },
  {
    columnName: "Stock",
    columnLabel: "stock",
  },
]);
const tableHeadersGames = ref([
  {
    columnName: "GAME",
    columnLabel: "game_name",
  },
  {
    columnName: "GAME ID",
    columnLabel: "game_id",
  },
  {
    columnName: "TOTAL KEYS SOLD",
    columnLabel: "total_keys_sold",
  },
]);

const items = reactive([
  {
    title: "Today",
    icon: "calendar-event",
    table: todayTable.value,
  },
  {
    title: "This week",
    icon: "calendar2-check",
    table: weekTable.value,
  },
  {
    title: "This month",
    icon: "calendar-check",
    table: monthTable.value,
  },
]);
const data = [
  {
    title: "Today",
    icon: "fonticon-drive",
    index: "1",
    table: [
      {
        columnName: "GAME",
        custom: "component3",
      },
      {
        agent: {
          avatar: "/media/avatars/300-2.jpg",
          name: "Jane Cooper",
          city: "Monaco",
        },
        price: "63.83",
        icon: false,
        statistics: 10,
        chartCcolor: "danger",
      },
      {
        agent: {
          avatar: "/media/avatars/300-9.jpg",
          name: "Jacob Jones",
          city: "Poland",
        },
        price: "92.56",
        icon: true,
        statistics: 9,
        chartCcolor: "success",
      },
      {
        agent: {
          avatar: "/media/avatars/300-7.jpg",
          name: "Cody Fishers",
          city: "Mexico",
        },
        price: "63.08",
        icon: false,
        statistics: 9.5,
        chartCcolor: "success",
      },
    ],
  },
];

const fetchOrders = (type) => {
  loadingItems.value = true;
  loadingCustomersSummaryData.value = true;
  loadingSummaryData.value = true;
  loadingGamesSummaryData.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
    params.value.page_type = tableType.value;
  }
  ApiService.get("keys/mainPage/summary")
    .then((res) => {
      loadingItems.value = false;
      items[0].table = res.data.data?.today;
      items[2].table = res.data.data?.month;
      items[1].table = res.data.data?.week;
    })
    .catch((e) => {
      errorHandling(e.response.data.messages);
    });
  ApiService.post("/orders/last-customer-orders", {})
    .then((res) => {
      loadingCustomersSummaryData.value = false;
      customersSummaryData.value = res.data.data?.last_five_customer_orders;
    })
    .catch((e) => {
      errorHandling(e.response.data.messages);
    });
  ApiService.post("/games/last-stock-updates", {})
    .then((res) => {
      loading.value = false;
      loadingSummaryData.value = res.data.data?.last_game_updates;
    })
    .catch((e) => {
      errorHandling(e.response.data.messages);
    });
};

const navigateToGameDetailsPage = (id) => {
  router.push({
    name: "apps-game-detail-listing",
    params: {
      id: id,
    },
  });
};

watch(tableType, (newValue) => {
  params.value.order_type = tableType.value;

  fetchOrders();
});
watch(tableStatus, (newValue) => {
  params.value = {};
  params.value.order_status = tableStatus.value;

  fetchOrders("filter");
});
watch(dropdownParams, (newValue) => {
  params.value = {};
  params.value = dropdownParams.value;

  fetchOrders("filer");
});
watch(searchOrders, (newValue) => {
  params.value = {};
  params.value = { search: searchOrders.value };
  fetchOrders("filer");
});

onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  params.value.page_type = tableType.value;
  fetchOrders();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style>
.select-table-type {
  width: 130px !important;
}
.game-name-link:hover {
  cursor: pointer;
  filter: brightness(120%);
  word-wrap: break-word;
}
.el-form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
