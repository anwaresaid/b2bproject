<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex justify-content-between">
          <div class="d-flex align-items-center mb-10 position-relative">
            <span class="svg-icon svg-icon-1 position-absolute ms-6">
              <inline-svg src="/media/icons/duotune/general/gen021.svg" />
            </span>
            <input
              type="text"
              v-model="searchGames"
              class="form-control form-control-solid w-250px ps-15"
              placeholder="search key code"
            />
          </div>
          <div>
            <el-button @click="createKey" type="primary" icon="plus" round
              >add keys</el-button
            >
          </div>
        </div>
        <div class="d-flex justify-content-between">
          <el-select
            v-model="tableStatus"
            class="select-type"
            placeholder="Select key status"
            clearable
            :style="selectStyle"
          >
            <el-option
              v-for="item in keysTypeStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <DropdownRemote
            :url="gameUrl"
            @selected-game="setGameId"
            :type="gameType"
            :keyg="gameKey"
            placeholder="Select game"
            wd="25%"
          />
          <DropdownRemote
            :url="supplierUrl"
            @selected-game="setSupplierId"
            :type="supplierType"
            :keyg="supplierKey"
            lable="Select supplier"
            wd="25%"
          />
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <Datatable
        :data="keysData"
        :header="tableHeaders"
        :totalPages="paginationData.value?.last_page"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        :pagination="true"
        :current-page="params.value?.current_page"
        checkbox-label="id"
        size="small"
        :loading="loading"
        @on-items-per-page-change="getItemsInTable"
        @page-change="pageChange"
      >
        <template v-slot:component1="slotProps">
          <slot :action="slotProps.action">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="follow"
              placement="top-start"
            >
              <el-button
                type="info"
                icon="Back"
                circle
                @click="followKey(slotProps.action)"
              />
            </el-tooltip>
            <el-button
              type="danger"
              icon="Delete"
              circle
              @click="handleDelete(slotProps.action)"
            />
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Copy"
              placement="top-start"
            >
              <el-button
                type="success"
                icon="CopyDocument"
                circle
                @click="copyText(slotProps.action)"
              />
            </el-tooltip>
          </slot>
        </template>
        <template v-slot:component2="slotProps">
          <slot :action="slotProps.action">
            <span
              class="game-name-link ml-2"
              @click="navigateGameDetails(slotProps.action.game.uuid)"
              >{{ slotProps.action.game?.name }}</span
            >
          </slot>
        </template>
        <template v-slot:component3="slotProps">
          <slot :action="slotProps.action">
            <span
              v-if="slotProps.action?.status?.id === 3"
              :class="`badge py-3 px-4 fs-7 badge-light-warning`"
              >{{ slotProps.action?.status?.name }}</span
            >
            <span
              v-else-if="slotProps.action?.status?.id === 2"
              :class="`badge py-3 px-4 fs-7 badge-light-danger`"
              >{{ slotProps.action?.status?.name }}</span
            >
            <span
              v-else-if="slotProps.action.status.id === 1"
              :class="`badge py-3 px-4 fs-7 badge-light-primary`"
              >{{ slotProps.action?.status?.name }}</span
            >
            <span
              v-else-if="slotProps.action.status.id === 5"
              :class="`badge py-3 px-4 fs-7 badge-light-info`"
              >{{ slotProps.action?.status?.name }}</span
            >
            <span v-else :class="`badge py-3 px-4 fs-7 badge-light-success`">{{
              slotProps.action?.status?.name
            }}</span>
          </slot>
        </template>
      </Datatable>
    </div>
  </div>
  <CreateKey
    :isVisible="keyCreateVisible"
    :data="updateData"
    :isUpdate="isUpdate"
    @create-key="closeCreateKey"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { keysTypeStatus } from "../utils/constants";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import CreateKey from "./CreateKey.vue";
import PusherService from "@/core/services/PusherService";
import store from "../../../store";
import { useRouter } from "vue-router";

const keysData = ref([]);
const gameUrl = "games/list";
const gameKey = "search_game";
const gameType = "games";
const dropdownParams = ref({});
const router = useRouter();
const supplierKey = "search";
const supplierUrl = "suppliers/all";
const supplierType = "suppliers";
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = reactive({});
const updateData = ref(null);
const keyCreateVisible = ref(false);
const searchGames = ref("");
const isUpdate = ref(false);
const loading = ref(false);
const selectStyle = "width: 25%";
const pusherEvent =
  "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated";
const channel = PusherService.subscribe("notification");
const message = ref("");
channel.bind(
  "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
  (data) => {}
);

const tableHeaders = ref([
  {
    columnName: "SUPPLIER",
    columnLabel: "supplier.name",
    sortEnabled: true,
  },
  {
    columnName: "GAME NAME",
    custom: "component2",
    sortEnabled: true,
  },
  {
    columnName: "KEY",
    columnLabel: "keycode",
    sortEnabled: true,
  },
  {
    columnName: "STATUS",
    custom: "component3",
    sortEnabled: true,
    columnWidth: 100,
  },
  {
    columnName: "RESERVE ID",
    columnLabel: "reservation",
    sortEnabled: true,
    columnWidth: 90,
  },
  {
    columnName: "SELL DATE",
    columnLabel: "sell_date",
    sortEnabled: false,
    columnWidth: 100,
  },
  {
    columnName: "CUSTOMER",
    columnLabel: "customer",
    sortEnabled: false,
    columnWidth: 90,
  },
  {
    columnName: "COST",
    columnLabel: "cost_eur",
    sortEnabled: false,
    columnWidth: 60,
  },
  {
    columnName: "SALES PRICE",
    columnLabel: "sale",
    sortEnabled: false,
    columnWidth: 80,
  },
  {
    columnName: "CREATED BY",
    columnLabel: "creator.name",
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

const fetchKeys = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
  }
  ApiService.postTest("keys/all", params.value).then((res) => {
    loading.value = false;
    keysData.value = res.data.data?.keys;
    paginationData.value = res.data.data?.pagination;
    store.dispatch("setPageItems", res.data.data.pagination?.total_items);
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
const setGameId = (value) => {
  console.log("value", value);
  dropdownParams.value.game_id = value;
  params.value = dropdownParams.value;
  fetchKeys("filer");
};
const setSupplierId = (value) => {
  dropdownParams.value.supplier_id = value;
  params.value = dropdownParams.value;
  fetchKeys("filer");
};
const getItemsInTable = (item) => {
  params.value.per_page = item;
  fetchKeys();
};
const pageChange = (page: number) => {
  params.value.current_page = page;
  fetchKeys();
};
const handleDelete = (item) => {};
const copyText = (obj) => {
  navigator.clipboard.writeText(obj.keycode);
};

const createKey = () => {
  isUpdate.value = false;
  keyCreateVisible.value = true;
};
const closeCreateKey = (value) => {
  keyCreateVisible.value = false;
  if (value) fetchKeys();
};
const followKey = (key) => {
  console.log("key", key);
  store.dispatch("setFollowKey", key.keycode);
  router.push({
    name: "keys-follow",
  });
};
watch(tableStatus, (newValue) => {
  dropdownParams.value.status = tableStatus.value;
  if (tableStatus.value === "") {
    delete dropdownParams.value["status"];
  }
  params.value = dropdownParams.value;
  fetchKeys("filer");
});
// watch(dropdownParams.value.game_id, (newValue) => {
//   params.value = {};
//   console.log("called", dropdownParams.value);
//   params.value = dropdownParams.value;
//   fetchKeys("filer");
// });
watch(keyCreateVisible, (newValue) => {
  if (!newValue) {
  }
});
watch(searchGames, (newValue) => {
  params.value.key_code = searchGames.value;
  fetchKeys();
  if (!newValue) {
  }
});
watch(message, (newValue) => {
  if (!newValue) {
  }
});

onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  fetchKeys();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped></style>
