<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div>
          <div class="d-flex justify-content-between mb-10">
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
            <el-form-item label="Order By Create Date">
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
            <div class="d-flex flex-column">
              <div class="d-flex flex-row align-items-center">
                <el-date-picker
                  v-model="fromDate"
                  :disabled-date="disabledFromDate"
                  type="datetime"
                  placeholder="From"
                  :default-time="defaultTime"
                />
                <el-date-picker
                  v-model="toDate"
                  :disabled-date="disabledToDate"
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
            <div>
              <el-button type="primary" icon="plus" round
                ><router-link to="/create-order" class="text-white px-3"
                  >Add Order</router-link
                ></el-button
              >
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-start">
            <el-form-item label="Select Order Type">
              <el-select
                v-model="tableType"
                class="select-table-type"
                placeholder="Select"
              >
                <el-option
                  v-for="item in orderType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Select Order status">
              <el-select
                v-model="tableStatus"
                class="select-table-type"
                placeholder="Select"
                clearable
              >
                <el-option
                  v-for="item in orderStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Select Customer">
              <DropdownRemote
                :url="customerUrl"
                @selected-game="setCustomerId"
                :type="customerType"
                :keyg="customerKey"
                wd="150px"
              />
            </el-form-item>
            <el-form-item label="Select Game">
              <DropdownRemote
                :url="gameUrl"
                @selected-game="setGameId"
                :type="gameType"
                :keyg="gameKey"
                wd="150px"
              />
            </el-form-item>
          </div>
          <div class="d-flex justify-content-between align-items-start"></div>
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
        :itemsPerPage="itemsInTable"
        sortable
        @on-items-per-page-change="getItemsInTable"
        @page-change="pageChange"
      >
        <template v-slot:component1="slotProps">
          <slot :action="slotProps.action">
            <div class="d-flex align-items-center">
              <el-tooltip
                effect="dark"
                content="update status"
                placement="top-start"
                v-if="slotProps.action.can_update"
              >
                <el-dropdown trigger="click" @command="handleStatus">
                  <el-button link icon="Edit" type="warning"> </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="order in twoStatus"
                        :command="{
                          id: slotProps.action.order_code,
                          status: order.value,
                        }"
                      >
                        {{ order.turkish }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="Order details"
                placement="top-start"
              >
                <router-link
                  :to="`/order-details/${slotProps.action.order_code}`"
                >
                  <el-button type="primary" icon="View" link />
                </router-link>
              </el-tooltip>
              <el-tooltip effect="dark" content="Copy" placement="top-start">
                <el-button
                  type="success"
                  icon="CopyDocument"
                  class="ms-0"
                  link
                  @click="copyText(slotProps.action)"
                />
              </el-tooltip>
            </div>
          </slot>
        </template>
        <template v-slot:component2="slotProps">
          <slot :action="slotProps.action">
            <span
              :class="`badge py-3 px-4 fs-7 badge-light-${slotProps.action.color}`"
              >{{ slotProps.action?.status }}</span
            >
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
import { dateFormatter } from "../utils/functions";
import store from "../../../store";
import { errorHandling } from "@/views/apps/utils/functions";
import { ElMessage, ElMessageBox } from "element-plus";

const ordersData = ref([]);
const router = useRouter();
const fromDate = ref();
const toDate = ref();
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
const errors = ref(null);
const searchOrders = ref("");
const dropdownParams = ref({});
const customerKey = "search";
const customerUrl = "customers/all";
const customerType = "customers";
const gameUrl = "games/list";
const gameKey = "search_game";
const orderByCreateDate = ref("desc");
const gameType = "games";
const params = ref({});
const tableStatus = ref(-1);
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = ref({});
const tableType = ref({ value: 2, label: "customer" });
const loading = ref(false);
const statusUpdate = ref({});
const twoStatus = [
  {
    value: 1,
    label: "approved",
    turkish: "Onaylandı",
  },
  {
    value: 2,
    label: "rejected",
    turkish: "Kabul Edilmedi",
  },
];

const tableHeaders = ref([
  {
    columnName: "ORDER NUMBER",
    columnLabel: "order_code",
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
    sortEnabled: false,
    custom: "component1",
  },
]);

const fetchOrders = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
    params.value.order_type = tableType.value;
  }
  if (typeof params.value.order_type === "object") {
    params.value.order_type = params.value.order_type.value;
  }
  ApiService.postTest("orders/all", params.value)
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
const disabledFromDate = (time: Date) => {
  return time.getTime() > toDate.value;
};
const disabledToDate = (time: Date) => {
  return time.getTime() < fromDate.value;
};

const setCustomerId = (value) => {
  dropdownParams.value.customer_id = value;
  params.value = dropdownParams.value;
  if (value === undefined) {
    delete dropdownParams.value["customer_id"];
  }
  fetchOrders("filer");
};
const setGameId = (value) => {
  dropdownParams.value.gameId = value;
  params.value = dropdownParams.value;
  if (value === undefined) {
    delete dropdownParams.value["gameId"];
  }
  fetchOrders("filer");
};
const getItemsInTable = (item) => {
  itemsInTable.value = item;
  params.value.per_page = item;
  fetchOrders();
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
const confirmSubmission = () => {
  ElMessageBox.alert("Order exported", "Order Export", {
    confirmButtonText: "OK",
    callback: (action: Action) => {},
  });
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
  dropdownParams.value.start = date.start;
  dropdownParams.value.finish = date.finish;
  params.value.start = date.start;
  params.value.finish = date.finish;
  fetchOrders();
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
  if (tableStatus.value === null) {
    tableStatus.value = -1;
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
  exportData({
    start: params.value.start,
    end: params.value.finish,
    status: params.value.order_status,
  });
};
const handleStatus = (status) => {
  statusUpdate.value = { order_code: status.id, status: status.status };
};
const pageChange = (page: number) => {
  params.value.current_page = page;
  fetchOrders();
};

const emptyOrderbyFilters = (key) => {
  if (key !== "create") orderByCreateDate.value = null;
};

const navigateOrderDetails = (item) => {
  const order_id = item.order_code;
  window.open(`/order-details/${order_id}`);
  // store.dispatch("setOrderCode", order_id);
  // router.push({
  //   name: "order-details",
  //   params: {
  //     id: order_id,
  //   },
  // });
};

const copyText = (obj) => {
  navigator.clipboard.writeText(obj.order_code);
};

watch(tableType, (newValue) => {
  dropdownParams.order_type = tableType.value;
  params.value = dropdownParams.value;
  fetchOrders();
});
watch(tableStatus, (newValue) => {
  dropdownParams.value.order_status = tableStatus.value;
  if (tableStatus.value === "") {
    delete dropdownParams.value["order_status"];
  }
  params.value = dropdownParams.value;
  fetchOrders("filter");
});

watch(orderByCreateDate, (newValue) => {
  if (orderByCreateDate.value !== null) {
    emptyOrderbyFilters("create");
    params.value.order_by_created = orderByCreateDate.value;
    fetchOrders("filer");
  }
});
watch(searchOrders, (newValue) => {
  params.value = {};
  if (searchOrders.value.length !== 0) {
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
  params.value.order_type = tableType.value;
  dropdownParams.value.order_type = tableType.value.value;
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
</style>
