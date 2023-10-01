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
            <el-form-item label="Order By">
              <el-select
                v-model="tableOrder"
                class="select-table-type"
                placeholder="Select"
              >
                <el-option
                  v-for="item in orderBy"
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
                :keyg="search_game"
                wd="150px"
              />
            </el-form-item>
            <el-form-item label="Select Game">
              <DropdownRemote
                :url="gameUrl"
                @selected-game="setCustomerId"
                :type="gameType"
                :keyg="search_game"
                wd="150px"
              />
            </el-form-item>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <Datatable
        :data="ordersData"
        :header="tableHeaders"
        :totalPages="paginationData.value?.last_page"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :pagination="true"
        :loading="loading"
        sortable
        @on-items-per-page-change="getItemsInTable"
        @page-change="pageChange"
      >
        <template v-slot:component1="slotProps">
          <slot :action="slotProps.action">
            <el-tooltip
              effect="dark"
              content="update status"
              placement="top-start"
              v-if="slotProps.action.can_update"
            >
              <el-dropdown trigger="click" @command="handleStatus">
                <el-button circle icon="Edit" type="warning"> </el-button>
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
          </slot>
          <slot :action="slotProps.action">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Order details"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="View"
                circle
                @click="navigateOrderDetails(slotProps.action)"
              />
            </el-tooltip>
          </slot>
          <slot :action="slotProps.action">
            <el-tooltip effect="dark" content="Copy" placement="top-start">
              <el-button
                type="success"
                icon="CopyDocument"
                class="ms-0"
                circle
                @click="copyText(slotProps.action)"
              />
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
import { orderBy } from "../utils/constants";
import { useRouter } from "vue-router";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import { dateFormatter } from "../utils/functions";
import store from "../../../store";
import { errorHandling } from "@/views/apps/utils/functions";

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
const tableOrder = ref(null);
const gameType = "games";
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = reactive({});
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
    sortEnabled: true,
  },
  {
    columnName: "CUSTOMER",
    columnLabel: "customer",
    sortEnabled: false,
  },
  {
    columnName: "TOTAL AMOUNT",
    columnLabel: "total_amount",
    sortEnabled: true,
  },
  {
    columnName: "RESERVED PIECE",
    columnLabel: "reserved_count",
    sortEnabled: true,
  },
  {
    columnName: "SOLD PIECE",
    columnLabel: "sold_count",
    sortEnabled: true,
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
  params.value.per_page = item;
  fetchOrders();
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
const handleStatus = (status) => {
  statusUpdate.value = { order_code: status.id, status: status.status };
};
const pageChange = (page: number) => {
  params.value.current_page = page;
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

watch(tableType, (newValue) => {
  params.value = {};
  dropdownParams.order_type = tableType.value;
  params.value = dropdownParams.value;
  fetchOrders();
});
watch(tableStatus, (newValue) => {
  params.value = {};
  dropdownParams.value.order_status = tableStatus.value;
  if (tableStatus.value === "") {
    delete dropdownParams.value["order_status"];
  }
  params.value = dropdownParams.value;
  fetchOrders("filter");
});
watch(tableOrder, (newValue) => {
  params.value = {};
  dropdownParams.value = {};
  dropdownParams.value.order_by_created = tableOrder.value;
  if (tableStatus.value === "") {
    delete dropdownParams.value["order_by_created"];
  }
  params.value = dropdownParams.value;
  fetchOrders("filter");
});

watch(searchOrders, (newValue) => {
  params.value = {};
  params.value = { search: searchOrders.value };
  fetchOrders("filer");
});
watch(statusUpdate, (newValue) => {
  updateStatus();
});

onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  params.value.order_type = tableType.value;
  dropdownParams.value.order_type = tableType.value.value;
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
