<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div
        class="container-header pt-0 d-flex align-items-start mh-100 justify-content-between"
      >
        <div class="d-flex align-items-center position-relative">
          <span class="svg-icon svg-icon-1 position-absolute ms-6">
            <inline-svg src="/media/icons/duotune/general/gen021.svg" />
          </span>
          <input
            type="text"
            v-model="searchGames"
            class="form-control form-control-solid w-250px ps-15"
            placeholder="search games"
          />
        </div>
        <div class="all-stock p-5">
          <h3>{{ sumStock }}</h3>
          <span>Total value of all stocks</span>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <Datatable
        :data="stockData"
        :header="tableHeaders"
        :totalPages="paginationData.value?.last_page"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :pagination="true"
        sortable
        :loading="loading"
        @on-items-per-page-change="getItemsInTable"
        @page-change="pageChange"
      >
        <template v-slot:api_component="slotProps">
          <slot :action="slotProps.action">
            <div
              v-if="slotProps.action.match_images.length > 0"
              class="d-flex flex-row"
            >
              <img
                v-for="image in slotProps.action.match_images"
                :src="image.image"
                class="logos-stock"
              />
            </div>
          </slot>
        </template>
        <template v-slot:status_component="slotProps">
          <slot :action="slotProps.action">
            <span
              v-if="slotProps.action.status.toLowerCase() === 'active'"
              :class="`badge py-3 px-4 fs-7 badge-light-success`"
              >{{ slotProps.action.status }}</span
            >
            <span v-else :class="`badge py-3 px-4 fs-7 badge-light-danger`">{{
              slotProps.action.status
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
import { orderType, orderStatus } from "../utils/constants";
import { useRouter } from "vue-router";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import store from "../../../store";

const stockData = ref([]);
const router = useRouter();
const customerUrl = "customers/all";
const searchGames = ref("");
const customerKey = "search";
const dropdownParams = ref({});
const customerType = "customers";
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(50);
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
    columnName: "GAME NAME",
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 230,
  },
  {
    columnName: "PUBLISHER",
    columnLabel: "publisher",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "AVERAGE VALUE",
    columnLabel: "avg_value",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "STOCK VALUE",
    columnLabel: "stock_value",
    sortEnabled: false,
    columnWidth: 135,
  },
  {
    columnName: "STOCK",
    columnLabel: "stock_count",
    sortEnabled: false,
    columnWidth: 135,
  },
  {
    columnName: "RESERVE",
    columnLabel: "reserve_count",
    sortEnabled: false,
    columnWidth: 90,
  },
  {
    columnName: "STOCK + RESERVE",
    sortEnabled: false,
    columnWidth: 90,
    columnLabel: "reserve_plus_stock",
  },
  {
    columnName: "STATUS",
    sortEnabled: false,
    columnWidth: 135,
    custom: "status_component",
  },
]);

const fetchStock = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
    params.value.page_type = tableType.value;
  }
  ApiService.postTest("games/stock", params.value).then((res) => {
    loading.value = false;
    stockData.value = res.data.data.games;
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
.container-header {
  flex: 0 0 100%;
  height: 100%;
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
