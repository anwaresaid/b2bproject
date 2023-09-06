<template>
  <div class="card">
    <div class="card-header border-0 pt-6 mb-5">
      <div class="d-flex align-items-center position-relative">
        <span class="svg-icon svg-icon-1 position-absolute ms-6">
          <inline-svg src="/media/icons/duotune/general/gen021.svg" />
        </span>
        <input
          type="text"
          v-model="searchGames"
          class="form-control form-control-solid w-250px ps-15"
          placeholder="search by game name"
        />
      </div>
    </div>

    <Datatable
      :data="matchData"
      :header="tableHeaders"
      :totalPages="paginationData.value?.last_page"
      :enable-items-per-page-dropdown="true"
      :checkbox-enabled="true"
      checkbox-label="id"
      sortable
      :loading="loading"
      @on-items-per-page-change="getItemsInTable"
      @page-change="pageChange"
    >
      <template v-slot:api_component="slotProps">
        <slot :action="slotProps.action">
          <div class="d-flex flex-row">
            {{ slotProps.action.marketplace }} Api
          </div>
        </slot>
      </template>
      <template v-slot:game_component="slotProps">
        <slot :action="slotProps.action">
          <div v-if="slotProps.action.status === 0">
            <span class="text-success">{{ slotProps.action.game }}</span>
          </div>
          <div v-else-if="slotProps.action.status === 1">
            <span class="text-danger">{{ slotProps.action.game }}</span>
          </div>
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
import store from "../../../store";

const matchData = ref([]);
const router = useRouter();
const customerUrl = "customers/all";
const searchGames = ref("");
const customerKey = "search";
const dropdownParams = ref({});
const customerType = "customers";
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(10);
const currentPage = ref(1);
const paginationData = reactive({});
const tableType = ref();
const sumStock = ref();
const loading = ref(false);

const tableHeaders = ref([
  {
    columnName: "API",
    sortEnabled: true,
    columnWidth: 175,
    custom: "api_component",
  },
  {
    columnName: "OYUN ADI",
    columnLabel: "game",
    sortEnabled: true,
    columnWidth: 300,
    custom: "game_component",
  },
  {
    columnName: "AUCTION",
    columnLabel: "offer_id",
    sortEnabled: true,
  },
  {
    columnName: "API ID",
    columnLabel: "product_id_in_api",
    sortEnabled: true,
    columnWidth: 300,
  },
  {
    columnName: "ORTALAMA STOCK DEGERI",
    columnLabel: "average_stock",
    sortEnabled: false,
    columnWidth: 99,
  },
  {
    columnName: "RETAIL",
    columnLabel: "retail",
    sortEnabled: false,
    columnWidth: 100,
  },
]);

const fetchStock = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
    params.value.page_type = tableType.value;
  }
  ApiService.postTest("marketplace/matches", params.value).then((res) => {
    loading.value = false;
    matchData.value = res.data.data.matches;
    paginationData.value = res.data.data.pagination;
    sumStock.value = res.data.data.sum_stock;
    store.dispatch("setPageItems", res.data.data.pagination.total_items);
  });
};

const getItemsInTable = (item) => {
  params.value.per_page = item;
  fetchStock();
};
const pageChange = (page: number) => {
  params.value.current_page = page;
  fetchStock();
};

watch(searchGames, (newValue) => {
  params.value = {};
  params.value = { search_game: searchGames.value };
  fetchStock("filer");
});

onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  params.value.page_type = tableType.value;
  fetchStock();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style>
.el-form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.logos-stock {
  width: 20px;
  border-radius: 10px;
}
.all-stock {
  background-color: #e2c6ec;
  color: #592ef8;
  border-radius: 10px;
  border: 1px solid #bd2ef8;
}
</style>
