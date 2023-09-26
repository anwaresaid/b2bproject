<template>
  <div class="card">
    <div class="card-header border-0 pt-6 mb-5">
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
        :totalPages="paginationData.value?.last_page"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :size="`small`"
        :pagination="true"
        :handleSelectionChange="handleMultiSelect"
        :multiSelect="true"
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
  <el-dialog v-model="setEnebaVisible" title="Update Eneba match" width="50%">
    <EnebaMarketplace
  /></el-dialog>
  <el-dialog v-model="setGamivoVisible" title="Update Gamivo match" width="50%">
    <GamivoMarketplace
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
import { matchStatus } from "../utils/constants";
import { useRouter } from "vue-router";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import store from "../../../store";
import { ElMessage, ElMessageBox } from "element-plus";
import EnebaMarketplace from "./marketplace-match/EnebaMarketPlace.vue";
import GamivoMarketplace from "./marketplace-match/GamivoMarketPlace.vue";
import KinguinMarketplace from "./marketplace-match/KinguinMarketPlace.vue";

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
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = reactive({});
const tableType = ref();
const sumStock = ref();
const setEnebaVisible = ref(false);
const setGamivoVisible = ref(false);
const setKinguinVisible = ref(false);
const kinguinProps = reactive({});
const loading = ref(false);
const multiSelectMatchesIds = ref([]);
const selectStyle = "width: 25%";
const tableHeaders = ref([
  {
    columnName: "API",
    sortEnabled: true,
    columnWidth: 175,
    custom: "api_component",
  },
  {
    columnName: "OYUN ADI",
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
    columnName: "MARKETPALCE",
    custom: "component4",
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
  fetchMatches();
};
const handleMultiSelect = (matches) => {
  console.log("user", matches);
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
  }).then((res) => {
    fetchMatches();
  });
};
const setStatusToActive = () => {
  ApiService.post("marketplace/changeStatus", {
    matches: multiSelectMatchesIds.value,
    status: 1,
  }).then((res) => {
    fetchMatches();
  });
};
const setGameId = (value) => {
  params.value.games = value.map((item) => item.id);
  console.log("value", params.value);
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
  console.log("update", data);

  switch (data.marketplace) {
    case "ENEBA":
      setEnebaVisible.value = true;
      break;
    case "KINGUIN":
      {
        setKinguinVisible.value = true;
        kinguinProps.update = true;
        kinguinProps.data = data;
      }
      break;
    case "GAMIVO":
      setGamivoVisible.value = true;
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
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
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
.game-name-link:hover {
  cursor: pointer;
  filter: brightness(120%);
}
</style>
