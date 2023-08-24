<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex justify-content-between">
          <el-form-item>
            <el-input
              v-model="searchOrders"
              class="w-100 m-2"
              placeholder="search orders"
              prefix-icon="Search"
            />
          </el-form-item>
          <el-form-item label="Select Order Type">
            <el-select
              v-model="tableType"
              class="select-type"
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
              class="select-type"
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
              wd="100px"
            />
          </el-form-item>
          <div>
            <el-button type="primary" icon="plus" round
              ><router-link to="/apps/create-order" class="text-white px-3"
                >Add Order</router-link
              ></el-button
            >
          </div>
        </div>
        <Datatable
          :data="ordersData"
          :header="tableHeaders"
          :totalPages="paginationData.value?.last_page"
          :enable-items-per-page-dropdown="true"
          :checkbox-enabled="true"
          checkbox-label="id"
          sortable
          @on-items-per-page-change="getItemsInTable"
          @page-change="pageChange"
        >
          <template v-slot:component1="slotProps">
            <slot :action="slotProps.action">
              <el-button
                type="primary"
                icon="View"
                circle
                @click="navigateOrderDetails(slotProps.action)"
              />
            </slot>
          </template>
        </Datatable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { orderType, orderStatus } from "../utils/constants";
import { useRouter } from "vue-router";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import store from "../../../store";

const ordersData = ref([]);
const router = useRouter();
const customerUrl = "customers/all";
const searchOrders = ref("");
const customerKey = "search";
const dropdownParams = ref({});
const customerType = "customers";
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(10);
const currentPage = ref(1);
const paginationData = reactive({});
const tableType = ref();

const tableHeaders = ref([
  {
    columnName: "ORDER NUMBER",
    columnLabel: "order_code",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "TOTAL AMOUNT",
    columnLabel: "total_amount",
    sortEnabled: true,
    columnWidth: 230,
  },
  {
    columnName: "SOLD PIECE",
    columnLabel: "sold_count",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "RESERVED PIECE",
    columnLabel: "reserved_count",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "CUSTOMER",
    columnLabel: "customer",
    sortEnabled: false,
    columnWidth: 135,
  },
  {
    columnName: "CREATED BY",
    columnLabel: "created_by",
    sortEnabled: false,
    columnWidth: 135,
  },
  {
    columnName: "CREATED AT",
    columnLabel: "created_at",
    sortEnabled: false,
    columnWidth: 50,
  },
  {
    columnName: "DETIALS",
    sortEnabled: false,
    columnWidth: 135,
    custom: "component1",
  },
]);

const fetchOrders = (type) => {
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
    params.value.page_type = tableType.value;
  }
  console.log("params", params);
  ApiService.postTest("orders/all", params.value).then((res) => {
    ordersData.value = res.data.data.orders;
    paginationData.value = res.data.data.pagination;
  });
};
const setCustomerId = (value) => {
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

const navigateOrderDetails = (item) => {
  const order_id = item.order_code;
  store.dispatch("setOrderCode", order_id);
  router.push({
    name: "order-details",
    params: {
      order_id: order_id,
    },
  });
};

watch(tableType, (newValue) => {
  console.log("changed");
  params.value.order_type = tableType.value;
  console.log("called tabletype");

  fetchOrders();
});
watch(tableStatus, (newValue) => {
  console.log("changed");
  params.value = {};
  params.value.order_status = tableStatus.value;
  console.log("called status");

  fetchOrders("filter");
});
watch(dropdownParams, (newValue) => {
  console.log("changed");
  params.value = {};
  params.value = dropdownParams.value;
  console.log("called called dropwdown params");

  fetchOrders("filer");
});
watch(searchOrders, (newValue) => {
  console.log("changed");
  params.value = {};
  params.value = { search: searchOrders.value };
  console.log("called searchorders");
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
.select-type {
  width: 100px !important;
}
.el-form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>