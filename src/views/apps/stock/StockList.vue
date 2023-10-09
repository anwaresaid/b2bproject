<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div
        class="container-header pt-0 d-flex align-items-start mh-100 justify-content-between"
      >
        <div class="d-flex flex-column w-100">
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
            <div class="d-flex flex-row px-5 justify-content-between w-100">
              <el-checkbox
                v-model="stockAverageValue"
                label="Stock average value"
              />
              <el-button @click="createKey" type="primary" icon="plus"
                >add keys</el-button
              >
            </div>
          </div>

          <div
            class="filters pt-5 px-5 d-flex flex-row justify-content-between"
          >
            <el-form-item label="Order By Create Date">
              <el-select
                v-model="orderByCreateDate"
                class="select-table-type"
                placeholder="Order By Create Date"
              >
                <el-option
                  v-for="item in gamesOrderBy"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
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
          </div>
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
        :totalPages="paginationData.last_page ? paginationData.last_page : 0"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :pagination="true"
        sortable
        :itemsPerPage="itemsInTable"
        :loading="loading"
        @on-items-per-page-change="getItemsInTable"
        @page-change="pageChange"
      >
        <template v-slot:name="slotProps">
          <slot :action="slotProps.action">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="slotProps.action?.name"
              placement="top-start"
            >
              <span
                :class="`game-name-link badge py-3 px-4 fs-7 badge-light-warning`"
                @click="navigateToGameDetailsPage(slotProps.action?.uuid)"
              >
                {{ slotProps.action.name }}</span
              >
            </el-tooltip>
          </slot>
        </template>
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
  <CreateKey :isVisible="keyCreateVisible" @create-key="closeCreateKey" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { gamesOrderBy } from "../utils/constants";
import { useRouter } from "vue-router";
import CreateKey from "../keys/CreateKey.vue";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import store from "../../../store";
import { errorHandling } from "@/views/apps/utils/functions";

const stockData = ref([]);
const router = useRouter();
const customerUrl = "customers/all";
const searchGames = ref("");
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = reactive({});
const tableType = ref();
const sumStock = ref();
const orderByCreateDate = ref(null);
const orderBySellDate = ref(null);

const loading = ref(false);
const orderByStock = ref("desc");
const keyCreateVisible = ref(false);
const stockAverageValue = ref(false);

const tableHeaders = ref([
  {
    columnName: "API",
    sortEnabled: false,
    custom: "api_component",
  },
  {
    columnName: "GAME NAME",
    custom: "name",
    sortEnabled: false,
  },
  {
    columnName: "PUBLISHER",
    columnLabel: "publisher",
    sortEnabled: true,
  },
  {
    columnName: "AVERAGE VALUE",
    columnLabel: "avg_value",
    sortEnabled: false,
  },
  {
    columnName: "STOCK VALUE",
    columnLabel: "stock_value",
    sortEnabled: false,
  },
  {
    columnName: "STOCK",
    columnLabel: "stock_count",
    sortEnabled: false,
  },
  {
    columnName: "RESERVE",
    columnLabel: "reserve_count",
    sortEnabled: false,
  },
  {
    columnName: "STOCK + RESERVE",
    sortEnabled: false,
    columnLabel: "reserve_plus_stock",
  },
  {
    columnName: "STATUS",
    sortEnabled: false,
    custom: "status_component",
  },
]);

const fetchStock = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
    params.value.order_type = tableType.value;
  }
  ApiService.postTest("games/stock", params.value)
    .then((res) => {
      loading.value = false;
      stockData.value = res.data.data.games;
      paginationData.value = res.data.data.pagination;
      sumStock.value = res.data.data.sum_stock;
      store.dispatch("setPageItems", res.data.data.pagination.total_items);
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
const createKey = () => {
  keyCreateVisible.value = true;
};
const closeCreateKey = (value) => {
  keyCreateVisible.value = false;
  if (value) fetchKeyData();
};

const emptyOrderbyFilters = (key) => {
  if (key !== "create") orderByCreateDate.value = null;
  if (key !== "sell") orderBySellDate.value = null;
  if (key !== "stock") orderByStock.value = null;
};
const getItemsInTable = (item) => {
  itemsInTable.value = item;
  params.value.per_page = item;
  fetchStock();
};
const pageChange = (page: number) => {
  params.value.current_page = page;
  fetchStock();
};

const navigateToGameDetailsPage = (id) => {
  router.push({
    name: "apps-game-detail-listing",
    params: {
      id: id,
    },
  });
};

watch(searchGames, (newValue) => {
  params.value = {};
  if (searchGames.value.length !== 0) {
    params.value = { search_game: searchGames.value };
    fetchStock("filer");
  } else {
    fetchStock();
  }
});
watch(stockAverageValue, (newValue) => {
  params.value = {
    ...params.value,
    order_stock_value: stockAverageValue.value,
  };
  fetchStock("filer");
});
watch(orderByStock, (newValue) => {
  params.value = {};
  if (orderByStock.value !== null) {
    emptyOrderbyFilters("stock");
    params.value.order_by_stock = orderByStock.value;
    fetchStock("filer");
  }
});
watch(orderByCreateDate, (newValue) => {
  params.value = {};
  if (orderByCreateDate.value !== null) {
    emptyOrderbyFilters("create");
    params.value.order_by_created = orderByCreateDate.value;
    fetchStock("filer");
  }
});
watch(orderBySellDate, (newValue) => {
  params.value = {};
  if (orderBySellDate.value !== null) {
    emptyOrderbyFilters("sell");
    params.value.order_by_sell_date = orderBySellDate.value;
    fetchStock("filer");
  }
});

onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  params.value.order_type = tableType.value;
  params.value.order_by_stock = orderByStock.value;
  fetchStock();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped>
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
.filters {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>
