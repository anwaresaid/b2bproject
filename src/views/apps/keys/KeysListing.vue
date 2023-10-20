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
              @blur="onBlur"
            />
          </div>
          <div class="d-flex flex-column">
            <div class="d-flex flex-row align-items-center">
              <el-date-picker
                v-model="fromDate"
                :disabled-date="disabledFromDate"
                type="datetime"
                placeholder="From"
                :default-time="defaultTime"
              />
              <el-date-picker
                v-model="toDate"
                :disabled-date="disabledToDate"
                type="datetime"
                placeholder="To"
                :default-time="defaultTime"
              />
              <el-button type="primary" @click="handleChangeDates"
                >Apply</el-button
              >
            </div>
            <div v-if="errors != null" class="text-danger">{{ errors }}</div>
          </div>
          <div>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Add Key"
              placement="top-start"
            >
              <el-button @click="createKey" type="primary" icon="plus" circle />
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Add Game"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="Football"
                @click="handleCreateGame"
                circle
              />
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Delete Keys"
              placement="top-start"
            >
              <el-button
                @click="deleteKey"
                type="danger"
                icon="Delete"
                circle
              />
            </el-tooltip>
          </div>
        </div>
        <div class="d-flex justify-content-between">
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
            :url="customerUrl"
            @selected-game="setCustomerId"
            :type="customerType"
            :keyg="supplierKey"
            placeholder="Select Customer"
            wd="25%"
          />
          <DropdownRemote
            :url="supplierUrl"
            @selected-game="setSupplierId"
            placeholder="select supplier"
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
        :multiSelect="true"
        :handleSelectionChange="handleMultiSelect"
        :sortable="false"
        :totalPages="paginationData.last_page ? paginationData.last_page : 0"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        :pagination="true"
        :current-page="params.value?.current_page"
        checkbox-label="id"
        :itemsPerPage="itemsInTable"
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
              <router-link :to="`/keys/follow/${slotProps.action.keycode}`">
                <el-button type="info" icon="Back" link />
              </router-link>
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Copy"
              placement="top-start"
            >
              <el-button
                type="success"
                icon="CopyDocument"
                link
                @click="copyText(slotProps.action)"
              />
            </el-tooltip>
          </slot>
        </template>
        <template v-slot:component2="slotProps">
          <slot :action="slotProps.action">
            <router-link :to="`/game-detail/${slotProps.action?.uuid}`">
              <span
                :class="`game-name-link badge py-3 px-4 fs-7 badge-light-warning`"
                >{{ slotProps.action.game?.name }}</span
              >
            </router-link>
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
  <GameCreate
    :isVisible="gameCreateVisible"
    @create-game="closeCreateGame"
  ></GameCreate>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { keysTypeStatus, gamesOrderBy } from "../utils/constants";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import CreateKey from "./CreateKey.vue";
import PusherService from "@/core/services/PusherService";
import store from "../../../store";
import { useRouter } from "vue-router";
import { errorHandling, dateFormatter } from "@/views/apps/utils/functions";
import GameCreate from "../games/GameCreate.vue";

const keysData = ref([]);
const fromDate = ref();
const toDate = ref();
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
const gameUrl = "games/list";
const gameKey = "search_game";
const orderByCreateDate = ref("desc");
const gameType = "games";
const dropdownParams = ref({});
const router = useRouter();
const supplierKey = "search";
const supplierUrl = "suppliers/all";
const supplierType = "suppliers";
const customerUrl = "customers/all";
const customerType = "customers";
const gameCreateVisible = ref(false);
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = ref({});
const updateData = ref(null);
const keyCreateVisible = ref(false);
const searchGames = ref("");
const isUpdate = ref(false);
const loading = ref(false);
const selectStyle = "width: 25%";
const errors = ref(null);
const multiSelectKeysIds = ref([]);
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
    sortEnabled: false,
  },
  {
    columnName: "GAME NAME",
    custom: "component2",
    sortEnabled: false,
  },
  {
    columnName: "KEY",
    columnLabel: "keycode",
    sortEnabled: false,
  },
  {
    columnName: "STATUS",
    custom: "component3",
    sortEnabled: false,
  },

  {
    columnName: "SELL DATE",
    columnLabel: "sell_date",
    sortEnabled: false,
  },
  {
    columnName: "CUSTOMER",
    columnLabel: "customer",
    sortEnabled: false,
  },
  {
    columnName: "COST",
    columnLabel: "cost_eur",
    sortEnabled: false,
  },
  {
    columnName: "SALES PRICE",
    columnLabel: "sale",
    sortEnabled: false,
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
  ApiService.postTest("keys/all", params.value)
    .then((res) => {
      loading.value = false;
      keysData.value = res.data.data?.keys;
      paginationData.value = res.data.data?.pagination;
      store.dispatch("setPageItems", res.data.data.pagination?.total_items);
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
const handleMultiSelect = (keys) => {
  multiSelectKeysIds.value = keys.map((match) => match.id);
};
const navigateGameDetails = (id) => {
  router.push({
    name: "apps-game-detail-listing",
    params: {
      id: id,
    },
  });
};
const disabledToDate = (time: Date) => {
  return time.getTime() < fromDate.value;
};
const disabledFromDate = (time: Date) => {
  return time.getTime() > toDate.value;
};
const handleChangeDates = () => {
  errors.value = null;
  if (
    toDate.value === null ||
    fromDate.value === null ||
    toDate.value === "" ||
    fromDate.value === "" ||
    toDate.value === undefined ||
    fromDate.value === undefined
  ) {
    errors.value = "you have set both dates";
    return;
  }
  if (fromDate.value > toDate.value) {
    errors.value = "from date has to be before the to date";
    return;
  }
  const date = {
    start: dateFormatter(fromDate, "time"),
    finish: dateFormatter(toDate, "time"),
  };
  dropdownParams.value.start = date.start;
  dropdownParams.value.end = date.finish;
  params.value.start = date.start;
  params.value.end = date.finish;
  fetchKeys("filer");
};
const closeCreateGame = (value) => {
  gameCreateVisible.value = false;
};
const handleCreateGame = () => {
  gameCreateVisible.value = true;
};
const deleteKey = () => {
  if (multiSelectKeysIds.value.length > 1) {
    ApiService.post(`keys/delete/multiple`, multiSelectKeysIds.value)
      .then((res) => {
        fetchKeys();
      })
      .catch((e) => {
        errorHandling(e?.response?.data?.messages);
      });
  } else {
    ApiService.delete(`keys/${multiSelectKeysIds.value[0]}`)
      .then((res) => {
        fetchKeys();
      })
      .catch((e) => {
        errorHandling(e?.response?.data?.messages);
      });
  }
};
const setGameId = (value) => {
  dropdownParams.value.game_id = value;
  params.value = dropdownParams.value;
  fetchKeys("filer");
};
const setCustomerId = (value) => {
  dropdownParams.value.customer_id = value;
  params.value = dropdownParams.value;
  fetchKeys("filer");
};
const setSupplierId = (value) => {
  dropdownParams.value.supplier_id = value;
  params.value = dropdownParams.value;
  fetchKeys("filer");
};
const getItemsInTable = (item) => {
  itemsInTable.value = item;
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

const onBlur = () => {
  params.value.current_page = 1;
  if (searchGames.value.length !== 0) {
    params.value.key_code = searchGames.value;
    fetchKeys();
  } else {
    delete params.value.key_code;
    fetchKeys();
  }
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
  store.dispatch("setFollowKey", key.keycode);
  router.push({
    name: "keys-follow",
    params: {
      id: key.keycode,
    },
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
watch(orderByCreateDate, (newValue) => {
  dropdownParams.value.order_by_created = orderByCreateDate.value;
  if (orderByCreateDate.value === "") {
    delete dropdownParams.value["order_by_created"];
  }
  params.value = dropdownParams.value;
  fetchKeys("filer");
});

onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  params.value.order_by_created = orderByCreateDate.value;
  fetchKeys();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped></style>
