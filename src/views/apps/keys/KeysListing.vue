<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex justify-content-between">
          <el-form-item label="Select Table">
            <el-select
              v-model="tableType"
              class="select-type"
              placeholder="Select"
            >
              <el-option
                v-for="item in keysType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Select Table Status">
            <el-select
              v-model="tableStatus"
              class="select-type"
              placeholder="Select"
            >
              <el-option
                v-for="item in keysTypeStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Select game">
            <DropdownRemote
              :url="gameUrl"
              @selected-game="setGameId"
              :type="gameType"
              :keyg="gameKey"
              wd="100px"
            />
          </el-form-item>
          <el-form-item label="Select supplier">
            <DropdownRemote
              :url="supplierUrl"
              @selected-game="setSupplierId"
              :type="supplierType"
              :keyg="supplierKey"
              wd="100px"
            />
          </el-form-item>
          <div>
            <el-button @click="createKey" type="primary" icon="plus" round
              >add keys</el-button
            >
          </div>
        </div>
        <Datatable
          :data="keysData"
          :header="tableHeaders"
          :totalPages="paginationData.value?.last_page"
          :enable-items-per-page-dropdown="true"
          :checkbox-enabled="true"
          :current-page="params.value?.current_page"
          checkbox-label="id"
          @on-items-per-page-change="getItemsInTable"
          @page-change="pageChange"
        >
        </Datatable>
      </div>
    </div>
  </div>
  <CreateKey :isVisible="keyCreateVisible" @create-key="closeCreateKey" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { keysType, keysTypeStatus } from "../utils/constants";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import CreateKey from "./CreateKey.vue";
import PusherService from "@/core/services/PusherService";

const keysData = ref([]);
const gameUrl = "games/list";
const gameKey = "search_game";
const dropdownParams = ref({});
const supplierKey = "search";
const supplierUrl = "suppliers/all";
const gameType = "games";
const supplierType = "suppliers";
const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(10);
const currentPage = ref(1);
const paginationData = reactive({});
const tableType = ref(5);
const keyCreateVisible = ref(false);
const pusherEvent =
  "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated";
const channel = PusherService.subscribe("notification");
const message = ref("");
channel.bind(
  "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
  (data) => {
    console.log(data);
  }
);

const tableHeaders = ref([
  {
    columnName: "SUPPLIER",
    columnLabel: "supplier_name",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "GAME NAME",
    columnLabel: "game_name",
    sortEnabled: true,
    columnWidth: 230,
  },
  {
    columnName: "KEY",
    columnLabel: "keycode",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "STATUS",
    columnLabel: "status",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "RESERVE ID",
    columnLabel: "reservation",
    sortEnabled: true,
    columnWidth: 100,
  },
  {
    columnName: "SELL DATE",
    columnLabel: "sell_date",
    sortEnabled: false,
    columnWidth: 135,
  },
  {
    columnName: "CUSTOMER",
    columnLabel: "customer",
    sortEnabled: false,
    columnWidth: 135,
  },
  {
    columnName: "COST",
    columnLabel: "cost_eur",
    sortEnabled: false,
    columnWidth: 135,
  },
  {
    columnName: "SALES PRICE",
    columnLabel: "sale",
    sortEnabled: false,
    columnWidth: 135,
  },
  {
    columnName: "CREATED BY",
    columnLabel: "creator",
    sortEnabled: false,
    columnWidth: 135,
  },
  {
    columnName: "CREATED AT",
    columnLabel: "created_at",
    sortEnabled: false,
    columnWidth: 50,
  },
]);

const fetchKeys = (type) => {
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
    params.value.page_type = tableType.value;
  }
  ApiService.postTest("keys/all", params.value).then((res) => {
    keysData.value = res.data.data.keys;
    console.log("keysdata", keysData);
    console.log("paginationdata", res.data.data.pagination);

    paginationData.value = res.data.data.pagination;
  });
};
const setGameId = (value) => {
  dropdownParams.value = {};
  dropdownParams.value.game_id = value;
};
const setSupplierId = (value) => {
  dropdownParams.value = {};
  dropdownParams.value.supplier_id = value;
};
const getItemsInTable = (item) => {
  params.value.per_page = item;
  fetchKeys();
};
const pageChange = (page: number) => {
  console.log("page changed");
  params.value.current_page = page;
  fetchKeys();
};

const createKey = () => {
  keyCreateVisible.value = true;
};
const closeCreateKey = (value) => {
  keyCreateVisible.value = false;
  if (value) fetchKeys();
};
watch(tableType, (newValue) => {
  console.log("changed");
  params.value = {};
  params.value.page_type = tableType.value;
  fetchKeys();
});
watch(tableStatus, (newValue) => {
  console.log("changed");
  params.value = {};
  params.value.status = tableStatus.value;
  fetchKeys("filter");
});
watch(dropdownParams, (newValue) => {
  console.log("changed");
  params.value = {};
  params.value = dropdownParams.value;
  fetchKeys("filer");
});
watch(message, (newValue) => {
  console.log("message", message);

  if (!newValue) {
  }
});
onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  params.value.page_type = tableType.value;
  fetchKeys();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style>
.select-type {
  width: 100px !important;
}
</style>
