<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div>
          <div class="d-flex justify-content-between align-items-center">
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
            <div>
              <h4>{{ gameData.name }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Datatable
      :data="keysData"
      :header="tableHeaders"
      :totalPages="paginationData.value?.last_page"
      :enable-items-per-page-dropdown="true"
      :checkbox-enabled="true"
      checkbox-label="id"
      :loading="loading"
      sortable
      @on-items-per-page-change="getItemsInTable"
      @page-change="pageChange"
    >
      <template v-slot:component1="slotProps">
        <slot :action="slotProps.action">
          <el-tag
            class="ml-2"
            v-if="slotProps.action.status === 'Satılmış'"
            type="success"
            >Sold</el-tag
          >
          <el-tag class="ml-2" v-else type="danger">{{
            slotProps.action.status
          }}</el-tag>
        </slot>
      </template>
    </Datatable>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { orderType, orderStatus } from "../utils/constants";
import { useRouter } from "vue-router";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import { dateFormatter } from "../utils/functions";
import store from "../../../store";

const gameData = ref([]);
const fromDate = ref();
const toDate = ref();
const router = useRouter();
const searchOrders = ref("");
const dropdownParams = ref({});
const keysData = ref([]);

const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(10);
const currentPage = ref(1);
const paginationData = reactive({});
const loading = ref(false);
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);

const tableHeaders = ref([
  {
    columnName: "KEY CODE",
    columnLabel: "keycode",
    sortEnabled: true,
  },
  {
    columnName: "SUPPLIER NAME",
    columnLabel: "supplier_name",
    sortEnabled: false,
  },
  {
    columnName: "STATUS",
    custom: "component1",
    sortEnabled: false,
    columnWidth: 80,
  },
  {
    columnName: "COST",
    columnLabel: "cost",
    sortEnabled: true,
    columnWidth: 100,
  },
  {
    columnName: "Sale",
    columnLabel: "sale",
    sortEnabled: true,
    columnWidth: 100,
  },
  {
    columnName: "CUSTOMER",
    columnLabel: "customer",
    sortEnabled: true,
  },
  {
    columnName: "CREATED AT",
    columnLabel: "created_at",
    sortEnabled: true,
    columnWidth: 100,
  },
  {
    columnName: "SOLD ON",
    columnLabel: "sell_date",
    sortEnabled: false,
    columnWidth: 135,
  },
  {
    columnName: "SOLD PRICE",
    columnLabel: "sell_price",
    sortEnabled: false,
    columnWidth: 80,
  },
  {
    columnName: "CREATED AT",
    columnLabel: "created_at",
    sortEnabled: false,
  },
]);

const fetchOrders = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
  }
  ApiService.postTest("games/detail", params.value).then((res) => {
    loading.value = false;
    gameData.value = res.data.data.game;
    keysData.value = res.data.data.game.keys;
    paginationData.value = res.data.data.pagination;
    store.dispatch("setPageItems", res.data.data.pagination.all_data);
  });
};
const getItemsInTable = (item) => {
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

const handleChangeDates = () => {
  if (toDate.value === null || fromDate.value === null) {
    return;
  }
  const date = {
    start: dateFormatter(fromDate, "time"),
    finish: dateFormatter(toDate, "time"),
  };
  console.log("date", date);
  params.value.start = date.start;
  params.value.finish = date.finish;
  fetchOrders();
};

const copyText = (obj) => {
  navigator.clipboard.writeText(obj.order_code);
};

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

watch(fromDate, (newValue) => {});
watch(toDate, (newValue) => {});

onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  console.log("params", router.currentRoute.value.params.id);
  params.value.gameId = router.currentRoute.value.params.id;
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