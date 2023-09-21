<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex justify-content-between mb-5">
          <div class="d-flex align-items-center w-100 position-relative">
            <el-select
              v-model="selectYear"
              class="select-year w-50 broder-0"
              placeholder="Select"
            >
              <el-option
                v-for="item in years"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body pt-0">
      <Datatable
        :data="total[selectYear]"
        :header="tableHeaders"
        :totalPages="paginationData.last_page"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :pagination="true"
        :loading="loading"
        sortable
        @on-items-per-page-change="getItemsInTable"
        @page-change="pageChange"
      >
      </Datatable>
    </div>
  </div>
  <CreateUser :isVisible="userCreateVisible" @create-key="closeCreateUser" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import store from "../../../store";

const searchUsers = ref("");
const dropdownParams = ref({});
const params = ref({});
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = reactive({});
const userCreateVisible = ref(false);
const loading = ref(true);
const years = ref([]);
const total = ref({});
const selectYear = ref("");
const tableHeaders = ref([
  {
    columnName: "AYLAR",
    columnLabel: "month_name",
    sortEnabled: true,
  },
  {
    columnName: "CIRO",
    columnLabel: "total_giro",
    sortEnabled: true,
  },
  {
    columnName: "MALIYET",
    columnLabel: "total_cost",
    sortEnabled: true,
  },
  {
    columnName: "KÂR",
    columnLabel: "total_margin",
    sortEnabled: true,
  },
  {
    columnName: "EK GIDER",
    columnLabel: "add_cost",
    sortEnabled: true,
  },
  {
    columnName: "NET KAZANÇ",
    columnLabel: "net_margin",
    sortEnabled: true,
  },
]);

const fetchUsers = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
  }
  ApiService.postTest("accounting/kebir", params.value).then((res) => {
    loading.value = false;
    console.log("res", res);
    res.data.data.months.map((item) => {
      if (!years.value.includes(item.year_id)) {
        years.value.push(item.year_id);
      }
    });
    years.value.map((year) => {
      total.value[year] = [];
      res.data.data.months.map((item) => {
        if (item.year_id === year) total.value[year].push(item);
      });
    });
    selectYear.value = years.value[0];

    console.log("total", total.value);
    // paginationData.value = res.data.data.pagination;
    // store.dispatch("setPageItems", res.data.data.pagination.total_items);
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
    fetchUsers();
  }
};

const createUser = () => {
  userCreateVisible.value = true;
};
watch(searchUsers, (newValue) => {
  params.value = {};
  params.value = { search: searchUsers.value };
  fetchUsers("filer");
});
watch(years, (newValue) => {
  selectYear.value = years.value[0];
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
<style scoped>
.select-type {
  width: 100px !important;
}
.el-form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.select-year {
  border: 0px;
  outline: 0px;
}
</style>
