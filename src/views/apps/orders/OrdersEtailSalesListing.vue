<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div>
          <div class="d-flex justify-content-between align-items-center mb-10">
            <div class="d-flex align-items-center position-relative">
              <span class="svg-icon svg-icon-1 position-absolute ms-6">
                <inline-svg src="/media/icons/duotune/general/gen021.svg" />
              </span>
              <input
                type="text"
                v-model="searchOrders"
                class="form-control form-control-solid w-250px ps-15"
                placeholder="search by order code"
              />
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex flex-row align-items-center">
                <el-date-picker
                  v-model="fromDate"
                  type="datetime"
                  placeholder="From"
                  :max="toDate"
                  :default-time="defaultTime"
                />
                <el-date-picker
                  v-model="toDate"
                  :min="fromDate"
                  type="datetime"
                  placeholder="To"
                  :default-time="defaultTime"
                />
                <el-button type="primary" @click="handleChangeDates"
                  >Apply</el-button
                >
                <el-button type="primary" @click="handleExport"
                  >Export</el-button
                >
              </div>
              <div v-if="errors != null" class="text-danger">{{ errors }}</div>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-start">
            <el-form-item label="Order By Sell Date">
              <el-select
                v-model="orderBySellDate"
                class="select-table-type"
                placeholder="Order By Sell Date"
              >
                <el-option
                  v-for="item in gamesOrderBy"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Order By Stock">
              <el-select
                v-model="orderByStock"
                class="select-table-type"
                placeholder="Order By Stock"
              >
                <el-option
                  v-for="item in gamesOrderBy"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Order By Creat Date">
              <el-select
                v-model="orderByCreateDate"
                class="select-table-type"
                placeholder="Select"
              >
                <el-option
                  v-for="item in gamesOrderBy"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <Datatable
        :data="ordersData"
        :header="tableHeaders"
        :totalPages="paginationData.last_page ? paginationData.last_page : 0"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :pagination="true"
        :loading="loading"
        sortable
        :itemsPerPage="itemsInTable"
        @on-items-per-page-change="getItemsInTable"
        @page-change="pageChange"
      >
        <template v-slot:component1="slotProps">
          <slot :action="slotProps.action">
            <router-link :to="`/order-details/${slotProps.action.order_code}`">
              <el-button type="primary" icon="View" link />
            </router-link>
          </slot>
          <slot :action="slotProps.action">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Copy"
              placement="top-start"
            >
              <el-button
                type="success"
                icon="CopyDocument"
                link
                @click="copyText(slotProps.action)"
              />
            </el-tooltip>
          </slot>
        </template>
        <template v-slot:gamenamecomp="slotProps">
          <slot :action="slotProps.action">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="slotProps.action?.game?.name"
              placement="top-start"
            >
              <span
                :class="` game-name-link badge py-3 px-4 fs-7 badge-light-warning`"
                @click="navigateToGameDetailsPage(slotProps.action?.game?.uuid)"
                >{{ slotProps.action.game?.name }}</span
              >
            </el-tooltip>
          </slot>
        </template>
        <template v-slot:component2="slotProps">
          <slot :action="slotProps.action">
            <span
              v-if="slotProps.action.status.id === 'Rezerve'"
              :class="`badge py-3 px-4 fs-7 badge-light-warning`"
              >{{ slotProps.action?.status?.name }}</span
            >
            <span
              v-else-if="
                slotProps.action?.status ===
                ('Kabul Edilmedi' || 'İptal Edildi')
              "
              :class="`badge py-3 px-4 fs-7 badge-light-danger`"
              >{{ slotProps.action?.status }}</span
            >
            <span
              v-else-if="slotProps.action.status === 'Oluşturuldu'"
              :class="`badge py-3 px-4 fs-7 badge-light-primary`"
              >{{ slotProps.action?.status }}</span
            >
            <span
              v-else-if="slotProps.action.status === 'Teslim Edildi'"
              :class="`badge py-3 px-4 fs-7 badge-light-info`"
              >{{ slotProps.action?.status }}</span
            >
            <span v-else :class="`badge py-3 px-4 fs-7 badge-light-success`">{{
              slotProps.action?.status
            }}</span>
          </slot>
        </template>
      </Datatable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { gamesOrderBy, orderStatus, orderType } from "../utils/constants";
import { useRouter } from "vue-router";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { dateFormatter } from "../utils/functions";
import store from "../../../store";
import { errorHandling } from "@/views/apps/utils/functions";

const ordersData = ref([]);
const router = useRouter();
const searchOrders = ref("");
const dropdownParams = ref({});
const customerKey = "search";
const customerUrl = "customers/all";
const customerType = "customers";
const gameUrl = "games/list";
const gameKey = "search_game";
const gameType = "games";
const params = ref({});
const orderByCreateDate = ref("desc");
const itemsInTable = ref(50);
const currentPage = ref(1);
const fromDate = ref();
const orderByStock = ref(null);
const orderBySellDate = ref(null);
const toDate = ref();
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
const errors = ref(null);
const paginationData = ref({});
const loading = ref(false);
const statusUpdate = ref({});

const tableHeaders = ref([
  {
    columnName: "ORDER NUMBER",
    columnLabel: "order_code",
    sortEnabled: false,
  },
  {
    columnName: "GAME NAME",
    custom: "gamenamecomp",
    sortEnabled: false,
  },
  {
    columnName: "CUSTOMER",
    columnLabel: "customer",
    sortEnabled: false,
  },
  {
    columnName: "TOTAL AMOUNT",
    columnLabel: "total_amount",
    sortEnabled: false,
  },
  {
    columnName: "RESERVED PIECE",
    columnLabel: "reserved_count",
    sortEnabled: false,
  },
  {
    columnName: "SOLD PIECE",
    columnLabel: "sold_count",
    sortEnabled: false,
  },
  {
    columnName: "CREATED BY",
    columnLabel: "created_by",
    sortEnabled: false,
  },
  {
    columnName: "TYPE",
    columnLabel: "type",
    sortEnabled: false,
  },
  {
    columnName: "STATUS",
    custom: "component2",
    sortEnabled: false,
  },
  {
    columnName: "CREATED AT",
    columnLabel: "created_at",
    sortEnabled: false,
  },
  {
    columnName: "PROCESS",
    custom: "component1",
    sortEnabled: false,
  },
]);

const fetchOrders = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
  }
  ApiService.postTest("orders/etailSales", params.value)
    .then((res) => {
      loading.value = false;
      ordersData.value = res.data.data?.orders;
      paginationData.value = res.data.data?.pagination;
      store.dispatch("setPageItems", res.data.data.pagination?.total_items);
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
const updateStatus = (type) => {
  ApiService.post("orders/updateStatus", statusUpdate.value)
    .then((res) => {
      fetchOrders();
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
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
const getItemsInTable = (item) => {
  itemsInTable.value = item;
  params.value.per_page = item;
  fetchOrders();
};
const confirmSubmission = () => {
  ElMessageBox.alert("Order exported", "Order Export", {
    confirmButtonText: "OK",
    callback: (action: Action) => {},
  });
};
const exportData = (data) => {
  ApiService.postTest("orders/export", data)
    .then((res) => {
      confirmSubmission();
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
const handleExport = () => {
  errors.value = null;
  if (
    toDate.value === null ||
    fromDate.value === null ||
    toDate.value === "" ||
    fromDate.value === "" ||
    toDate.value === undefined ||
    fromDate.value === undefined
  ) {
    errors.value = "you have set both dates";
    return;
  }
  if (fromDate.value > toDate.value) {
    errors.value = "from date has to be before the to date";
    return;
  }
  const date = {
    start: dateFormatter(fromDate, "time"),
    finish: dateFormatter(toDate, "time"),
  };
  exportData({
    start: date.start,
    end: date.finish,
    status: -1,
  });
};
const pageChange = (page: number) => {
  params.value.current_page = page;
  fetchOrders();
};
const emptyOrderbyFilters = (key) => {
  if (key !== "create") {
    orderByCreateDate.value = null;
    delete params.value.order_by_created;
  }
  if (key !== "sell") {
    orderBySellDate.value = null;
    delete params.value.order_by_sell_date;
  }
  if (key !== "stock") {
    orderByStock.value = null;
    delete params.value.order_by_stock;
  }
};

const handleChangeDates = () => {
  errors.value = null;
  if (
    toDate.value === null ||
    fromDate.value === null ||
    toDate.value === "" ||
    fromDate.value === "" ||
    toDate.value === undefined ||
    fromDate.value === undefined
  ) {
    errors.value = "you have set both dates";
    return;
  }
  if (fromDate.value > toDate.value) {
    errors.value = "from date has to be before the to date";
    return;
  }
  const date = {
    start: dateFormatter(fromDate, "time"),
    finish: dateFormatter(toDate, "time"),
  };
  params.value.start = date.start;
  params.value.finish = date.finish;
  fetchOrders();
};

const navigateOrderDetails = (item) => {
  const order_id = item.order_code;
  store.dispatch("setOrderCode", order_id);
  router.push({
    name: "order-details",
    params: {
      id: order_id,
    },
  });
};

const copyText = (obj) => {
  navigator.clipboard.writeText(obj.order_code);
};

watch(orderByStock, (newValue) => {
  if (orderByStock.value !== null) {
    emptyOrderbyFilters("stock");
    params.value.order_by_stock = orderByStock.value;
    fetchOrders("filer");
  }
});
watch(orderByCreateDate, (newValue) => {
  if (orderByCreateDate.value !== null) {
    emptyOrderbyFilters("create");
    params.value.order_by_created = orderByCreateDate.value;
    fetchOrders("filer");
  }
});
watch(orderBySellDate, (newValue) => {
  if (orderBySellDate.value !== null) {
    emptyOrderbyFilters("sell");
    params.value.order_by_sell_date = orderBySellDate.value;
    fetchOrders("filer");
  }
});

watch(searchOrders, (newValue) => {
  if (searchOrders.value !== 0) {
    params.value = { search: searchOrders.value };
    fetchOrders("filer");
  } else {
    fetchOrders("filer");
  }
});
watch(statusUpdate, (newValue) => {
  updateStatus();
});
onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  params.value.order_by_created = orderByCreateDate.value;

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
.el-form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.badge {
  white-space: wrap;
}
.el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding: 0 12px;
}
</style>
