<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex justify-content-between mb-5">
          <DropdownRemote
            :url="jarUrl"
            @selected-game="setJarId"
            placeholder="select jar"
            :type="jarType"
            :keyg="jarKey"
            lable="Select Jar"
            wd="25%"
          />
          <div>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Add jar"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="plus"
                @click="createUser"
                circle
              ></el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body pt-0">
      <Datatable
        :data="usersData"
        :header="tableHeaders"
        :totalPages="paginationData.last_page ? paginationData.last_page : 0"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :itemsPerPage="itemsInTable"
        :pagination="true"
        :loading="loading"
        sortable
        @on-items-per-page-change="getItemsInTable"
        @page-change="pageChange"
      >
      </Datatable>
    </div>
  </div>
  <CreateJarTransaction
    :isVisible="userCreateVisible"
    @create-key="closeCreateUser"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import store from "../../../store";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import CreateJarTransaction from "@/views/apps/jar/CreateJarTransaction.vue";
import { errorHandling } from "@/views/apps/utils/functions";

const usersData = ref([]);
const searchUsers = ref("");
const dropdownParams = ref({});
const params = ref({});
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = ref({});
const userCreateVisible = ref(false);
const loading = ref(true);
const jarKey = "search";
const jarUrl = "jars/all";
const jarType = "jars";

const tableHeaders = ref([
  {
    columnName: "NAME",
    columnLabel: "jar.name",
    sortEnabled: false,
  },
  {
    columnName: "NEW BALANCE",
    columnLabel: "new_balance",
    sortEnabled: false,
  },
  {
    columnName: "OLD BALANCE",
    columnLabel: "old_balance",
    sortEnabled: false,
  },
  {
    columnName: "PROCESS AMOUNT",
    columnLabel: "process_amount",
    sortEnabled: false,
  },
  {
    columnName: "PROCESS CONVERT (€)",
    columnLabel: "process_convert_eur",
    sortEnabled: false,
  },
  {
    columnName: "PROCESS JAR CURRENCY   ",
    columnLabel: "process_convert_eur",
    sortEnabled: false,
  },
  {
    columnName: "PROCESS CURRENCY",
    columnLabel: "process_currency",
    sortEnabled: false,
  },
  {
    columnName: "PROCESS TYPE",
    columnLabel: "process_type",
    sortEnabled: false,
  },
  {
    columnName: "PROCESSED BY",
    columnLabel: "processed_by.name",
    sortEnabled: false,
  },
]);

const fetchData = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
  }
  ApiService.postTest("jar/transactions/all", params.value)
    .then((res) => {
      loading.value = false;
      usersData.value = res.data.data.jar_transactions;
      paginationData.value = res.data.data.pagination;
      store.dispatch("setPageItems", res.data.data.pagination.total_items);
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
const setJarId = (item) => {
  params.value.jar_id = item;
  fetchData();
};
const getItemsInTable = (item) => {
  itemsInTable.value = item;
  params.value.per_page = item;
  fetchData();
};
const pageChange = (page: number) => {
  params.value.current_page = page;
  fetchData();
};

const closeCreateUser = (value) => {
  userCreateVisible.value = false;
  if (value) {
    fetchData();
  }
};

const createUser = () => {
  userCreateVisible.value = true;
};
watch(searchUsers, (newValue) => {
  params.value = {};
  if (searchUsers.value.length !== 0) {
    params.value = { search: searchUsers.value };
    fetchData("filer");
  } else {
    fetchData();
  }
});

onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  fetchData();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped>
.select-type {
  width: 100px !important;
}
.el-form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
