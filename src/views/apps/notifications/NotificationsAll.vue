<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex justify-content-between">
          <el-form-item label="Select Status">
            <el-select
              v-model="status"
              class="select-type"
              placeholder="Select"
            >
              <el-option
                v-for="item in generalStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Select Process">
            <el-select v-model="type" class="select-type" placeholder="Select">
              <el-option
                v-for="item in processType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Select Game">
            <DropdownRemote
              :url="gameUrl"
              @selected-game="setGameId"
              :type="gameType"
              placeholder="please select game"
              :keyg="customerKey"
              wd="100px"
            />
          </el-form-item>
          <el-form-item label="Select Marketplace">
            <DropdownRemote
              :url="marketplaceUrl"
              @selected-game="setMarketplaceId"
              :type="marketplaceType"
              placeholder="please select marketplace"
              :keyg="customerKey"
              wd="100px"
            />
          </el-form-item>
        </div>
        <Datatable
          :data="ordersData"
          :header="tableHeaders"
          :totalPages="paginationData.value?.last_page"
          :enable-items-per-page-dropdown="true"
          :checkbox-enabled="true"
          checkbox-label="id"
          sortable
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
        </Datatable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { generalStatus, processType } from "../utils/constants";
import { useRouter } from "vue-router";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import store from "../../../store";

const ordersData = ref([]);
const router = useRouter();
const searchOrders = ref("");
const dropdownParams = ref({});
const customerKey = "search";
const gameUrl = "games/list";
const gameType = "games";
const marketplaceUrl = "marketplace/all";
const marketplaceType = "marketplace";
const params = ref({});
const type = ref(null);
const itemsInTable = ref(10);
const currentPage = ref(1);
const paginationData = reactive({});
const status = ref();

const tableHeaders = ref([
  {
    columnName: "TYPE",
    columnLabel: "type",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "MESSAGE",
    columnLabel: "message",
    sortEnabled: true,
    columnWidth: 230,
  },
]);

const fetchNotifications = (type) => {
  let data = { ...dropdownParams.value, ...params.value };
  ApiService.postTest("notifications/all", data).then((res) => {
    ordersData.value = res.data.data.notifications;
    paginationData.value = res.data.data.pagination;
  });
};
const setGameId = (value) => {
  dropdownParams.value = {};
  dropdownParams.value.game_id = value;
};
const setMarketplaceId = (value) => {
  dropdownParams.value = {};
  dropdownParams.value.marketplace = value;
};
const getItemsInTable = (item) => {
  params.value.per_page = item;
  fetchNotifications();
};
const pageChange = (page: number) => {
  params.value.current_page = page;
  fetchNotifications();
};

watch(status, (newValue) => {
  dropdownParams.value = {};
  dropdownParams.value.success = status.value;
});
watch(type, (newValue) => {
  dropdownParams.value = {};
  dropdownParams.value.type = type.value;
});
watch(dropdownParams, (newValue) => {
  params.value = {};
  params.value = dropdownParams.value;

  fetchNotifications("filer");
});
onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  fetchNotifications();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style>
.select-type {
  width: 100px !important;
}
.el-form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>