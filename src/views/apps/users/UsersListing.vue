<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex justify-content-between">
          <el-form-item>
            <el-input
              v-model="searchUsers"
              class="w-100 m-2"
              placeholder="search users"
              prefix-icon="Search"
            />
          </el-form-item>
          <div>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Add user"
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
        <Datatable
          :data="usersData"
          :header="tableHeaders"
          :totalPages="paginationData.last_page"
          :enable-items-per-page-dropdown="true"
          :checkbox-enabled="true"
          checkbox-label="id"
          sortable
          @on-items-per-page-change="getItemsInTable"
          @page-change="pageChange"
        >
        </Datatable>
      </div>
    </div>
  </div>
  <CreateUser :isVisible="userCreateVisible" @create-key="closeCreateUser" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import CreateUser from "./CreateUser.vue";

const usersData = ref([]);
const searchUsers = ref("");
const dropdownParams = ref({});
const params = ref({});
const itemsInTable = ref(10);
const currentPage = ref(1);
const paginationData = reactive({});
const userCreateVisible = ref(false);

const tableHeaders = ref([
  {
    columnName: "NAME",
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "SURNAME",
    columnLabel: "surname",
    sortEnabled: true,
    columnWidth: 230,
  },
  {
    columnName: "E-MAIL",
    columnLabel: "email",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "NUMBER OF SUCCESSFUL ORDERS",
    columnLabel: "reserved_count",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "EURO VALUE OF ORDERS",
    columnLabel: "customer",
    sortEnabled: false,
    columnWidth: 135,
  },
  {
    columnName: "GBP VALUE OF ORDERS",
    columnLabel: "created_by",
    sortEnabled: false,
    columnWidth: 135,
  },
  {
    columnName: "USD VALUE OF ORDERS",
    columnLabel: "created_at",
    sortEnabled: false,
    columnWidth: 50,
  },
  {
    columnName: "TOTAL VALUE OF ORDERS",
    columnLabel: "created_at",
    sortEnabled: false,
    columnWidth: 50,
  },
]);

const fetchUsers = (type) => {
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
  }
  console.log("params", params);
  ApiService.postTest("users/all", params.value).then((res) => {
    console.log("users", res.data);
    usersData.value = res.data.data.users;
    paginationData.value = res.data.data.pagination;
  });
};

const getItemsInTable = (item) => {
  params.value.per_page = item;
};
const pageChange = (page: number) => {
  params.value.current_page = page;
};

const closeCreateUser = (value) => {
  userCreateVisible.value = false;
  if (value) {
    console.log("called close");
    fetchUsers();
  }
};

const createUser = () => {
  userCreateVisible.value = true;
};
watch(searchUsers, (newValue) => {
  console.log("changed");
  params.value = {};
  params.value = { search: searchUsers.value };
  console.log("called search users");
  fetchUsers("filer");
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
