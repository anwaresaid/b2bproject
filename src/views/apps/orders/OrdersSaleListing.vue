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
                  :default-time="defaultTime"
                />
                <el-date-picker
                  v-model="toDate"
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
          </div>
          <div class="d-flex justify-content-between align-items-start">
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
        :pagination="true"
        checkbox-label="id"
        :loading="loading"
        sortable
        :itemsPerPage="itemsInTable"
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
              <router-link
                :to="`/order-details/${slotProps.action.order_code}`"
              >
                <el-button type="primary" icon="View" link />
              </router-link>
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
            </div>
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
        <template v-slot:component3="slotProps">
          <slot :action="slotProps.action">
            <router-link :to="`/game-detail/${slotProps.action?.game?.uuid}`">
              <span
                :class="`game-name-link badge py-3 px-4 fs-7 badge-light-warning`"
              >
                >{{ slotProps.action?.game?.name }}</span
              >
            </router-link>
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
import { gamesOrderBy, orderStatus } from "../utils/constants";
import { useRouter } from "vue-router";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import { dateFormatter } from "../utils/functions";
import store from "../../../store";
import { errorHandling } from "@/views/apps/utils/functions";

const ordersData = ref([]);
const fromDate = ref();
const toDate = ref();
const router = useRouter();
const searchOrders = ref("");
const dropdownParams = ref({});
const gameKey = "search_game";
const gameUrl = "games/list";
const gameType = "games";
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = ref({});
const errors = ref(null);
const loading = ref(false);
const orderByCreateDate = ref("desc");
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
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
    columnName: "GAME",
    custom: "component3",
    sortEnabled: false,
  },
  {
    columnName: "COST",
    columnLabel: "cost_price",
    sortEnabled: false,
  },
  {
    columnName: "SALE PRICE",
    columnLabel: "sale_price",
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
const updateStatus = (type) => {
  ApiService.post("orders/updateStatus", statusUpdate.value)
    .then((res) => {
      fetchOrders();
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
const fetchOrders = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
  }
  ApiService.postTest("orders/apiSells", params.value)
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
const setGameId = (value) => {
  params.value.gameId = value;
  if (value === undefined) {
    delete params.value["gameId"];
  }
  fetchOrders();
};
const getItemsInTable = (item) => {
  itemsInTable.value = item;
  params.value.per_page = item;
  fetchOrders();
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
const handleStatus = (status) => {
  statusUpdate.value = { order_code: status.id, status: status.status };
};
const emptyOrderbyFilters = (key) => {
  if (key !== "create") orderByCreateDate.value = null;
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

const copyText = (obj) => {
  navigator.clipboard.writeText(obj.order_code);
};

watch(statusUpdate, (newValue) => {
  updateStatus();
});
watch(tableStatus, (newValue) => {
  params.value.order_status = tableStatus.value;
  if (tableStatus.value === "") {
    delete params.value["order_status"];
  }
  fetchOrders("filter");
});
watch(orderByCreateDate, (newValue) => {
  params.value.order_by_created = orderByCreateDate.value;
  if (tableStatus.value === "") {
    delete params.value["order_by_created"];
  }
  fetchOrders("filter");
});
// watch(dropdownParams, (newValue) => {
//   params.value = {};
//   params.value = dropdownParams.value;

//   fetchOrders("filer");
// });

watch(orderByCreateDate, (newValue) => {
  if (orderByCreateDate.value !== null) {
    emptyOrderbyFilters("create");
    params.value.order_by_created = orderByCreateDate.value;
    fetchOrders("filer");
  }
});

watch(searchOrders, (newValue) => {
  if (searchOrders.value.length !== 0) {
    params.value = {};
    params.value = { search: searchOrders.value };
    fetchOrders("filer");
  } else {
    delete params.value.search;
    fetchOrders();
  }
});

watch(fromDate, (newValue) => {});
watch(toDate, (newValue) => {});
watch(errors, (newValue) => {});

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
</style>
