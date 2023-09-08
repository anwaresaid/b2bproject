<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--<div class="card-body pt-0">
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
          </div>
        </div>
      </div>-->
    </div>
    <div class="card-body pt-0">
      <Datatable
        :data="summaryData"
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
        <template v-slot:component2="slotProps">
          <slot :action="slotProps.action">
            <span :class="`badge py-3 px-4 fs-7 badge-light-danger`">{{
              slotProps.action.oldStock
            }}</span>
          </slot>
        </template>
        <template v-slot:component3="slotProps">
          <slot :action="slotProps.action">
            <span
              :class="`game-name-link badge py-3 px-4 fs-7 badge-light-warning`"
              @click="navigateToGameDetailsPage(slotProps.action.game.uuid)"
              >{{ slotProps.action.game.name }}</span
            >
          </slot>
        </template>
        <template v-slot:component1="slotProps">
          <slot :action="slotProps.action">
            <span :class="`badge py-3 px-4 fs-7 badge-light-success`">{{
              slotProps.action.newStock
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
import { orderType, orderStatus } from "./apps/utils/constants";
import { useRouter } from "vue-router";
import DropdownRemote from "../components/dropdown/DropdownRemote.vue";
import store from "../store";

const summaryData = ref([]);
const router = useRouter();
const searchOrders = ref("");
const dropdownParams = ref({});
const customerKey = "search";
const customerUrl = "customers/all";
const customerType = "customers";
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(10);
const currentPage = ref(1);
const paginationData = reactive({});
const tableType = ref({ value: 2, label: "customer" });
const loading = ref(false);

const tableHeaders = ref([
  {
    columnName: "GAME",
    custom: "component3",
    sortEnabled: true,
  },
  {
    columnName: "PUBLISHER",
    columnLabel: "publisher",
    sortEnabled: false,
  },
  {
    columnName: "SUPPLIER",
    columnLabel: "supplier",
    sortEnabled: true,
  },
  {
    columnName: "OLD STOCK",
    custom: "component1",
    sortEnabled: true,
    columnWidth: 170,
  },
  {
    columnName: "NEW STOCK",
    custom: "component2",
    sortEnabled: true,
    columnWidth: 150,
  },
  {
    columnName: "DATE",
    columnLabel: "date",
    sortEnabled: false,
  },
]);

const fetchOrders = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
    params.value.page_type = tableType.value;
  }
  ApiService.get("keys/mainPage/summary").then((res) => {
    loading.value = false;
    summaryData.value = res.data.data.lats_ten_game;
  });
};
const setCustomerId = (value) => {
  console.log("value", value);
  dropdownParams.value = {};
  dropdownParams.value.customer_id = value;
};
const getItemsInTable = (item) => {
  params.value.per_page = item;
  fetchOrders();
};
const pageChange = (page: number) => {
  params.value.current_page = page;
  fetchOrders();
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
}
.el-form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
