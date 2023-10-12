<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex justify-content-between">
          <div>
            <!--      <el-button type="primary" icon="plus" round
              ><router-link to="/apps/create-order" class="text-white px-3"
                >Add Offer</router-link
              ></el-button
            >-->
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
        sortable
        :itemsPerPage="itemsInTable"
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
        <template v-slot:delete-process="slotProps">
          <slot :action="slotProps.action">
            <el-button type="danger" icon="View" circle> DELETE </el-button>
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
import { useRouter } from "vue-router";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import store from "../../../store";
import { errorHandling } from "@/views/apps/utils/functions";

const ordersData = ref([]);
const router = useRouter();
const searchOrders = ref("");
const dropdownParams = ref({});
const customerKey = "search";
const customerUrl = "customers/all";
const customerType = "customers";
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = reactive({});
const tableType = ref();

const tableHeaders = ref([
  {
    columnName: "SUPPLIER",
    columnLabel: "order_code",
    sortEnabled: false,
  },
  {
    columnName: "GAME",
    columnLabel: "total_amount",
    sortEnabled: false,
  },
  {
    columnName: "COST",
    columnLabel: "sold_count",
    sortEnabled: false,
  },
  {
    columnName: "AMOUNT",
    columnLabel: "reserved_count",
    sortEnabled: false,
  },
  {
    columnName: "INFO",
    columnLabel: "customer",
    sortEnabled: false,
  },
  {
    columnName: "CREATE DATE",
    columnLabel: "created_by",
    sortEnabled: false,
  },
  {
    columnName: "WHO ADDED",
    columnLabel: "created_at",
    sortEnabled: false,
  },
  {
    columnName: "PIECE",
    sortEnabled: false,
    custom: "component1",
  },
  {
    columnName: "SELLER TYPE",
    columnLabel: "created_at",
    sortEnabled: false,
  },
  {
    columnName: "OFFER TYPE",
    columnLabel: "created_at",
    sortEnabled: false,
  },
  {
    columnName: "PROCESS",
    custom: "delete-process",
    sortEnabled: false,
  },
]);

const fetchOrders = (type) => {
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
    params.value.page_type = tableType.value;
  }
  ApiService.postTest("offers/all", params.value)
    .then((res) => {
      ordersData.value = res.data.data.offers;
      paginationData.value = res.data.data.pagination;
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
const setCustomerId = (value) => {
  dropdownParams.value = {};
  dropdownParams.value.customer_id = value;
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
      order_id: order_id,
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
<style scoped>
.select-type {
  width: 100px !important;
}
.el-form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
