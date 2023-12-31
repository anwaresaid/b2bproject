<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex justify-content-between mb-5">
          <div class="d-flex align-items-center position-relative">
            <span class="svg-icon svg-icon-1 position-absolute ms-6">
              <inline-svg src="/media/icons/duotune/general/gen021.svg" />
            </span>
            <input
              type="text"
              v-model="searchUsers"
              class="form-control form-control-solid w-250px ps-15"
              placeholder="search by moneybox name"
            />
          </div>
          <div>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Add Moneybox"
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
  <CreateJar :isVisible="userCreateVisible" @create-key="closeCreateUser" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import store from "../../../store";
import CreateJar from "@/views/apps/jar/CreateJar.vue";
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

const tableHeaders = ref([
  {
    columnName: "NAME",
    columnLabel: "name",
    sortEnabled: false,
  },
  {
    columnName: "BALANCE",
    columnLabel: "balance",
    sortEnabled: false,
  },
  {
    columnName: "OWNER",
    columnLabel: "owner.name",
    sortEnabled: false,
  },
]);

const fetchUsers = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
  }
  ApiService.postTest("jars/all", params.value)
    .then((res) => {
      loading.value = false;
      usersData.value = res.data.data.jars;
      paginationData.value = res.data.data.pagination;
      store.dispatch("setPageItems", res.data.data.pagination.total_items);
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};

const getItemsInTable = (item) => {
  itemsInTable.value = item;
  params.value.per_page = item;
};
const pageChange = (page: number) => {
  params.value.current_page = page;
};

const closeCreateUser = (value) => {
  userCreateVisible.value = false;
  if (value) {
    fetchUsers();
  }
};

const createUser = () => {
  userCreateVisible.value = true;
};
watch(searchUsers, (newValue) => {
  params.value = {};
  if (searchUsers.value.length !== 0) {
    params.value = { search: searchUsers.value };
    fetchUsers("filer");
  } else {
    fetchUsers();
  }
});

onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  fetchUsers();
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
