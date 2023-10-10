<template>
  <div class="card">
    <div class="card-header border-0 pt-6 mb-5">
      <div class="d-flex flex-row flex-end w-100">
        <el-form-item label="Order By Stock">
          <el-select
            v-model="OrderByStock"
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
      <div
        class="d-flex flex-row justify-content-between align-items-center w-100 position-relative"
      >
        <DropdownRemote
          :url="gameUrl"
          @selected-game="setGameId"
          :type="gameType"
          :placeholder="'please enter a game name'"
          :multiple="true"
          :keyg="gameKey"
          wd="25%"
        />
        <DropdownRemote
          :url="marketPlaceUrl"
          @selected-game="setMarketPlaceId"
          :type="marketPlaceType"
          :placeholder="'please enter a marketPlace name'"
          :multiple="true"
          :keyg="marketKey"
          wd="25%"
        />
        <el-select
          v-model="marketPlaceStatus"
          placeholder="Select match status"
          :style="selectStyle"
          clearable
        >
          <el-option
            v-for="item in matchStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="d-flex flex-row">
          <el-button
            @click="setStatusToPassive"
            class="border-secondary border-2"
            size="large"
            type="primary"
            :disabled="multiSelectMatchesIds.length > 0 ? false : true"
            >Seçilenleri Pasife Al</el-button
          >
          <el-button
            @click="setStatusToActive"
            class="ms-0 border-secondary border-2"
            size="large"
            type="primary"
            :disabled="multiSelectMatchesIds.length > 0 ? false : true"
            >Seçilenleri Aktife Al
          </el-button>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <Datatable
        :data="matchData"
        :header="tableHeaders"
        :totalPages="paginationData.last_page ? paginationData.last_page : 0"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :size="`small`"
        :pagination="true"
        :handleSelectionChange="handleMultiSelect"
        :multiSelect="true"
        sortable
        :loading="loading"
        :itemsPerPage="itemsInTable"
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
        <template v-slot:status_comp="slotProps">
          <slot :action="slotProps.action">
            <span
              :class="`badge py-3 px-4 fs-7 badge-light-${
                slotProps.action.status === 1 ? 'success' : 'danger'
              }`"
            >
              {{ slotProps.action.status ? "ACTIVE" : "PASSIVE" }}
            </span>
          </slot>
        </template>
        <template v-slot:game_component="slotProps">
          <slot :action="slotProps.action">
            <div v-if="slotProps.action.status === 0">
              <span
                @click="navigateGameDetails(slotProps.action.game.uuid)"
                class="game-name-link text-danger"
                >{{ slotProps.action.game.name }}</span
              >
            </div>
            <div v-else-if="slotProps.action.status === 1">
              <span
                @click="navigateGameDetails(slotProps.action.game.uuid)"
                class="game-name-link text-success"
                >{{ slotProps.action?.game?.name }}</span
              >
            </div>
          </slot>
        </template>
        <template v-slot:component1="slotProps">
          <slot :action="slotProps.action">
            <!--       <el-tooltip
              class="box-item"
              effect="dark"
              content="Delete game"
              placement="top-start"
            >
              <el-button
                type="danger"
                icon="Delete"
                circle
                @click="confirmSubmission(slotProps.action)"
              />
            </el-tooltip>-->
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Edit game"
              placement="top-start"
            >
              <el-button
                type="warning"
                icon="Edit"
                circle
                @click="handleUpdate(slotProps.action)"
              />
            </el-tooltip>
          </slot>
        </template>
        <template v-slot:component4="slotProps">
          <slot :action="slotProps.action">
            <div class="d-flex flex-row">
              <img
                v-if="slotProps.action.game?.match_images.length > 0"
                v-for="image in slotProps.action.game?.match_images"
                :src="image.image"
                class="logos-stock"
              />
              <img
                v-if="slotProps.action?.game?.passive_images?.length > 0"
                v-for="image in slotProps.action.game?.passive_images"
                :src="image.image"
                class="logos-stock opacity-50"
              />
            </div>
          </slot>
        </template>
      </Datatable>
    </div>
  </div>
  <el-dialog v-model="setEnebaVisible" title="Update Eneba match" width="80%">
    <EnebaMarketplace :update="enebaProps.update" :data="enebaProps.data"
  /></el-dialog>
  <el-dialog v-model="setGamivoVisible" title="Update Gamivo match" width="80%">
    <GamivoMarketplace :update="gamivoProps.update" :data="gamivoProps.data"
  /></el-dialog>
  <el-dialog
    v-model="setKinguinVisible"
    title="Update Kinguin match"
    width="80%"
  >
    <KinguinMarketplace :update="kinguinProps.update" :data="kinguinProps.data"
  /></el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { matchStatus, gamesOrderBy } from "../utils/constants";
import { useRouter } from "vue-router";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import store from "../../../store";
import { ElMessage, ElMessageBox } from "element-plus";
import EnebaMarketplace from "./marketplace-match/EnebaMarketPlace.vue";
import GamivoMarketplace from "./marketplace-match/GamivoMarketPlace.vue";
import KinguinMarketplace from "./marketplace-match/KinguinMarketPlace.vue";
import { errorHandling } from "@/views/apps/utils/functions";

const matchData = ref([]);
const router = useRouter();
const gameUrl = "games/list";
const gameKey = "search_game";
const gameType = "games";
const marketPlaceUrl = "marketplace/all";
const marketPlaceType = "marketplaces";
const marketKey = "search";
const marketPlaceStatus = ref();
const params = ref({});
const tableStatus = ref(null);
const OrderByStock = ref(null);
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = reactive({});
const tableType = ref();
const sumStock = ref();
const setEnebaVisible = ref(false);
const setGamivoVisible = ref(false);
const setKinguinVisible = ref(false);
const kinguinProps = reactive({});
const enebaProps = reactive({});
const gamivoProps = reactive({});
const loading = ref(false);
const multiSelectMatchesIds = ref([]);
const selectStyle = "width: 25%";
const tableHeaders = ref([
  {
    columnName: "API",
    sortEnabled: false,
    custom: "api_component",
  },
  {
    columnName: "OYUN ADI",
    sortEnabled: false,
    custom: "game_component",
  },
  {
    columnName: "AUCTION",
    columnLabel: "offer_id",
    sortEnabled: false,
  },
  {
    columnName: "MARKETPALCE",
    custom: "component4",
    sortEnabled: false,
  },
  {
    columnName: "API ID",
    columnLabel: "product_id_in_api",
    sortEnabled: false,
  },
  {
    columnName: "ORTALAMA STOCK DEGERI",
    columnLabel: "average_stock",
    sortEnabled: false,
  },
  {
    columnName: "STATUS",
    custom: "status_comp",
    sortEnabled: false,
  },
  {
    columnName: "STOCK",
    columnLabel: "stock",
    sortEnabled: false,
  },
  {
    columnName: "RESERVE COUNT",
    columnLabel: "reserve_count",
    sortEnabled: false,
  },
  {
    columnName: "SOLD COUNT",
    columnLabel: "sold_count",
    sortEnabled: false,
  },
  {
    columnName: "RETAIL",
    columnLabel: "retail",
    sortEnabled: false,
  },
  {
    columnName: "PROCESS",
    custom: "component1",
  },
]);

const fetchMatches = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
    params.value.page_type = tableType.value;
  }
  ApiService.postTest("marketplace/matches", params.value)
    .then((res) => {
      loading.value = false;
      matchData.value = res.data.data.matches;
      paginationData.value = res.data.data.pagination;
      sumStock.value = res.data.data.sum_stock;
      store.dispatch("setPageItems", res.data.data.pagination.total_items);
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};

const getItemsInTable = (item) => {
  itemsInTable.value = item;
  params.value.per_page = item;
  fetchMatches();
};
const handleMultiSelect = (matches) => {
  multiSelectMatchesIds.value = matches.map((match) => match.id);
};
const pageChange = (page: number) => {
  params.value.current_page = page;
  fetchMatches();
};
const setStatusToPassive = () => {
  ApiService.post("marketplace/changeStatus", {
    matches: multiSelectMatchesIds.value,
    status: 0,
  })
    .then((res) => {
      fetchMatches();
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
const setStatusToActive = () => {
  ApiService.post("marketplace/changeStatus", {
    matches: multiSelectMatchesIds.value,
    status: 1,
  })
    .then((res) => {
      fetchMatches();
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
const setGameId = (value) => {
  params.value.games = value.map((item) => item.id);
  if (
    params.value.games.length === 0 ||
    params.value.games.length === undefined
  ) {
    delete params.value["games"];
  }
  fetchMatches();
};
const setMarketPlaceId = (value) => {
  params.value.marketplaces = value.map((market) => market.id);
  if (
    params.value.marketplaces.length === 0 ||
    params.value.marketplaces.length === undefined
  ) {
    delete params.value["marketplaces"];
  }
  fetchMatches();
};
const handleUpdate = (data) => {
  switch (data.marketplace) {
    case "ENEBA":
      {
        setEnebaVisible.value = true;
        enebaProps.update = true;
        enebaProps.data = data;
      }
      break;
    case "KINGUIN":
      {
        setKinguinVisible.value = true;
        kinguinProps.update = true;
        kinguinProps.data = data;
      }
      break;
    case "GAMIVO":
      {
        setGamivoVisible.value = true;
        gamivoProps.update = true;
        gamivoProps.data = data;
      }
      break;
  }
};

const confirmSubmission = (data) => {
  ElMessageBox.confirm(
    `this action will permanently delete the ${data.name}. Continue?`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(() => {
      ApiService.delete(`games/${data.id}`).then((res) => {
        store.dispatch("setPageItems", res.data.data.pagination.total_items);
      });
      ElMessage({
        type: "success",
        message: "Delete completed",
      });
      window.location.reload();
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};

const navigateGameDetails = (id) => {
  router.push({
    name: "apps-game-detail-listing",
    params: {
      id: id,
    },
  });
};

watch(marketPlaceStatus, (newValue) => {
  params.value.status = marketPlaceStatus.value;
  if (params.value.status === "") {
    delete params.value["status"];
  }
  fetchMatches();
});
watch(OrderByStock, (newValue) => {
  params.value.order_by_stock = OrderByStock.value;
  if (params.value.order_by_stock === "") {
    delete params.value["order_by_stock"];
  }
  fetchMatches();
});
onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  params.value.page_type = tableType.value;
  fetchMatches();
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
