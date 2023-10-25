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
        </div>
        <div class="d-flex justify-content-between">
          <el-select v-model="salesPeriod" class="m-2" placeholder="Select">
            <el-option
              v-for="item in salesEnum"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <Datatable
        :data="keysData"
        :header="tableHeaders"
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
        :row-color="tableRowClassName"
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
        <!-- <template v-slot:component2="slotProps">
          <slot :action="slotProps.action">
            <router-link :to="`/game-detail/${slotProps.action?.uuid}`">
              <span
                :class="`game-name-link badge py-3 px-4 fs-7 badge-light-warning`"
                >{{ slotProps.action.game?.name }}</span
              >
            </router-link>
          </slot>
        </template> -->
        <!-- <template v-slot:component3="slotProps">
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
        </template> -->
      </Datatable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { keysTypeStatus, gamesOrderBy, salesEnum } from "../utils/constants";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import PusherService from "@/core/services/PusherService";
import store from "../../../store";
import { useRouter } from "vue-router";
import { errorHandling, dateFormatter } from "@/views/apps/utils/functions";
import GameCreate from "../games/GameCreate.vue";

const keysData = ref([]);
const dropdownParams = ref({});
const router = useRouter();
const gameCreateVisible = ref(false);
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(50);
const currentPage = ref(1);
const salesPeriod = ref(4);
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
const message = ref("");

const tableHeaders = ref([
  {
    columnName: "CREATOR",
    columnLabel: "creator",
    sortEnabled: false,
  },
  {
    columnName: "AMOUNT (€)",
    columnLabel: "amount_eur",
    sortEnabled: false,
  },
  {
    columnName: "KEY",
    columnLabel: "keycode",
    sortEnabled: false,
  },
  {
    columnName: "CREATE DATE",
    columnLabel: "created_at",
    sortEnabled: false,
  },
  {
    columnName: "SELL DATE",
    columnLabel: "sell_date",
    sortEnabled: false,
  },
  {
    columnName: "DIFFERENCE (€)",
    columnLabel: "diff_as_eur",
    sortEnabled: false,
  },
  {
    columnName: "COST (€)",
    columnLabel: "cost_eur",
    sortEnabled: false,
  },
  {
    columnName: "PROCESS",
    custom: "component1",
    sortEnabled: false,
  },
]);

const tableRowClassName = ({ row }: { row }) => {
  if (row.warning === "danger") {
    return "danger-row";
  }
  return "";
};

const fetchKeys = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
  }
  ApiService.postTest("keys/frequency", params.value)
    .then((res) => {
      loading.value = false;
      keysData.value = res.data.data?.sales;
      paginationData.value = res.data.data?.pagination;
      store.dispatch("setPageItems", res.data.data.pagination?.total_items);
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
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
watch(salesPeriod, (newValue) => {
  dropdownParams.value.sales_period = salesPeriod.value;
  if (salesPeriod.value === "") {
    delete dropdownParams.value["sales_period"];
  }
  params.value = dropdownParams.value;
  fetchKeys("filer");
});

onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  params.value.sales_period = salesPeriod.value;
  fetchKeys();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped></style>
