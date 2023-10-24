<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex flex-column">
          <div class="d-flex flex-row align-items-center">
            <el-date-picker
              v-model="fromDate"
              type="datetime"
              placeholder="From"
              :default-time="defaultTime"
            />
            <el-date-picker
              v-model="toDate"
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
      </div>
    </div>

    <div class="card-body pt-0">
      {{ typeof usersData }}
      <Datatable
        :data="usersData"
        :header="tableHeaders"
        :totalPages="paginationData.last_page ? paginationData.last_page : 0"
        :enable-items-per-page-dropdown="true"
        checkbox-label="id"
        :size="`small`"
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
  <CreateUser :isVisible="userCreateVisible" @create-key="closeCreateUser" />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import store from "../../../store";
import { errorHandling } from "@/views/apps/utils/functions";

const usersData = ref([]);
const searchUsers = ref("");
const fromDate = ref();
const toDate = ref();
const dropdownParams = ref({});
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
const params = ref({});
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = ref({});
const userCreateVisible = ref(false);
const loading = ref(true);

const tableHeaders = ref([
  {
    columnName: "Islem Tarihi",
    columnLabel: "IslemTarihi",
    sortEnabled: false,
  },
  {
    columnName: "Valor",
    columnLabel: "Valor",
    sortEnabled: false,
  },
  {
    columnName: "Aciklama",
    columnLabel: "Aciklama",
    sortEnabled: false,
  },
  {
    columnName: "Tutar",
    columnLabel: "Tutar",
    sortEnabled: false,
  },
  {
    columnName: "Borc Alacak",
    columnLabel: "BorcAlacak",
    sortEnabled: false,
  },
  {
    columnName: "Islem Tipi",
    columnLabel: "IslemTipi",
    sortEnabled: false,
  },
  {
    columnName: "Time Stamp",
    columnLabel: "TimeStamp",
    sortEnabled: false,
  },
  {
    columnName: "MUSTERI VERGI NUMARASI",
    columnLabel: "musteriVergiNumarasi",
    sortEnabled: false,
  },
  {
    columnName: "BAKIYE",
    columnLabel: "Bakiye",
    sortEnabled: false,
  },
  {
    columnName: "ISLEM ZAMANI",
    columnLabel: "IslemZamani",
    sortEnabled: false,
  },
  {
    columnName: "Islem Aciklama",
    columnLabel: "IslemAciklama",
    sortEnabled: false,
  },
]);

const fetchTransaction = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage;
    params.value.per_page = itemsInTable;
  }
  ApiService.postTest("ziraat/extre", params.value)
    .then((res) => {
      loading.value = false;
      usersData.value = res.data.data.list;
      paginationData.value = res.data.data.pagination;
      store.dispatch("setPageItems", res.data.data.pagination.total_items);
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
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
  params.value.start = date.start;
  params.value.finish = date.finish;
  fetchTransaction();
};

const getItemsInTable = (item) => {
  itemsInTable.value = item;
  params.value.per_page = item;
  fetchTransaction();
};
const pageChange = (page: number) => {
  params.value.current_page = page;
  fetchTransaction();
};

const closeCreateUser = (value) => {
  userCreateVisible.value = false;
  if (value) {
    fetchTransaction();
  }
};

watch(searchUsers, (newValue) => {
  params.value = {};
  if (searchUsers.value.length !== 0) {
    params.value = { search: searchUsers.value };
    fetchTransaction("filer");
  } else {
    fetchTransaction();
  }
});

onMounted(() => {
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  fetchTransaction();
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
