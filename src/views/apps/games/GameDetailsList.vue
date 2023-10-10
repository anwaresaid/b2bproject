<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center position-relative">
              <span class="svg-icon svg-icon-1 position-absolute ms-6">
                <inline-svg src="/media/icons/duotune/general/gen021.svg" />
              </span>
              <input
                type="text"
                v-model="searchKeys"
                class="form-control form-control-solid w-250px ps-15"
                placeholder="search by KEY code"
              />
            </div>
            <div>
              <el-select
                v-model="keySearchStatus"
                class="select-type"
                placeholder="Select key status"
                clearable
              >
                <el-option
                  v-for="item in keyStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div>
              <el-button @click="createKey" type="primary" icon="plus" round
                >add keys</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <Datatable
      :data="keysData"
      :header="tableHeaders"
      :totalPages="paginationData.last_page ? paginationData.last_page : 0"
      :enable-items-per-page-dropdown="true"
      :checkbox-enabled="true"
      checkbox-label="id"
      :pagination="true"
      :loading="loading"
      :sortable="false"
      :currentPage="currentPage"
      :itemsPerPage="itemsInTable"
      @on-items-per-page-change="getItemsInTable"
      @page-change="pageChange"
    >
      <template v-slot:component1="slotProps">
        <slot :action="slotProps.action">
          <el-tag
            class="ml-2"
            v-if="slotProps.action?.status === 'Satılmış'"
            type="danger"
            >Sold</el-tag
          >
          <el-tag class="ml-2" v-else type="danger">{{
            slotProps.action?.status
          }}</el-tag>
        </slot>
      </template>
    </Datatable>
  </div>
  <CreateKey
    :isVisible="keyCreateVisible"
    :isUpdate="isUpdate"
    @create-key="closeCreateKey"
    :gameDropdown="gameObject"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import CreateKey from "../keys/CreateKey.vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { orderType, orderStatus, keyStatus } from "../utils/constants";
import { useRouter } from "vue-router";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import { dateFormatter } from "../utils/functions";
import store from "../../../store";
import { errorHandling } from "@/views/apps/utils/functions";

const gameData = ref([]);
const fromDate = ref();
const toDate = ref();
const router = useRouter();
const searchKeys = ref("");
const dropdownParams = ref({});
const keysData = ref([]);
const keySearchStatus = ref(null);

const params = ref({});
const tableStatus = ref(null);
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = ref({});
const loading = ref(false);
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
const isUpdate = ref(false);
const keyCreateVisible = ref(false);
const gameObject = ref({});

const tableHeaders = ref([
  {
    columnName: "KEY CODE",
    columnLabel: "keycode",
    sortEnabled: false,
  },
  {
    columnName: "SUPPLIER NAME",
    columnLabel: "supplier_name",
    sortEnabled: false,
  },
  {
    columnName: "STATUS",
    custom: "component1",
    sortEnabled: false,
  },
  {
    columnName: "COST",
    columnLabel: "cost",
    sortEnabled: false,
  },
  {
    columnName: "Sale",
    columnLabel: "sale",
    sortEnabled: false,
  },
  {
    columnName: "CUSTOMER",
    columnLabel: "customer",
    sortEnabled: false,
  },
  {
    columnName: "CREATED AT",
    columnLabel: "created_at",
    sortEnabled: false,
  },
  {
    columnName: "SOLD ON",
    columnLabel: "sell_date",
    sortEnabled: false,
  },
  {
    columnName: "SOLD PRICE",
    columnLabel: "sell_price",
    sortEnabled: false,
  },
]);

const fetchGames = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
  }
  ApiService.postTest("games/detail", params.value)
    .then((res) => {
      loading.value = false;
      gameData.value = res.data.data?.game;
      keysData.value = res.data.data?.game.keys;
      paginationData.value = res.data.data?.pagination;
      store.dispatch("setGameDetails", res.data.data?.game.name);
      store.dispatch("setPageItems", res.data.data.pagination?.all_data);
    })
    .catch((e) => {
      errorHandling(e.response.data.messages);
    });
};
const getItemsInTable = (item) => {
  itemsInTable.value = item;
  params.value.per_page = item;
  fetchGames();
};
const pageChange = (page: number) => {
  params.value.current_page = page;
  fetchGames();
};

const closeCreateKey = (value) => {
  keyCreateVisible.value = false;
};

const navigateOrderDetails = (item) => {
  const order_id = item.order_code;
  store.dispatch("setOrderCode", order_id);
  router.push({
    name: "order-details",
    params: {
      id: order_id,
    },
  });
};
watch(keySearchStatus, (newValue) => {
  dropdownParams.value = {
    keyStatus: keySearchStatus.value,
    uuid: router.currentRoute.value.params.id,
  };
  if (keySearchStatus.value === "") {
    delete dropdownParams.value["status"];
  }
  params.value = dropdownParams.value;
  fetchGames("filer");
});
const createKey = () => {
  isUpdate.value = false;
  gameObject.value = { id: gameData.value.id, name: gameData.value.name };
  keyCreateVisible.value = true;
};

const handleChangeDates = () => {
  if (toDate.value === null || fromDate.value === null) {
    return;
  }
  const date = {
    start: dateFormatter(fromDate, "time"),
    finish: dateFormatter(toDate, "time"),
  };
  params.value.start = date.start;
  params.value.finish = date.finish;
  fetchGames();
};

const copyText = (obj) => {
  navigator.clipboard.writeText(obj.order_code);
};

watch(tableStatus, (newValue) => {
  params.value = {};
  params.value.order_status = tableStatus.value;

  fetchGames("filter");
});
watch(dropdownParams, (newValue) => {
  params.value = {};
  params.value = dropdownParams.value;

  fetchGames("filer");
});

watch(searchKeys, (newValue) => {
  if (searchKeys.value.length !== 0) {
    params.value = {
      keyCode: searchKeys.value,
      uuid: router.currentRoute.value.params.id,
    };
    fetchGames("filer");
  } else {
    fetchGames("filer");
  }
});

watch(fromDate, (newValue) => {});
watch(toDate, (newValue) => {});

onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  params.value.uuid = router.currentRoute.value.params.id;
  fetchGames();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style>
.select-table-type {
  width: 130px !important;
}
.el-form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
