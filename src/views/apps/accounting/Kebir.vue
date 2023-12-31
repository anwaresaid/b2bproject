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
        :data="total[selectYear] ? total[selectYear] : []"
        :header="tableHeaders"
        :totalPages="paginationData.last_page ? paginationData.last_page : 0"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :pagination="true"
        show-summary
        :summary-method="getSummaries"
        :loading="loading"
        :itemsPerPage="params.per_page"
        sortable
        @on-items-per-page-change="getItemsInTable"
        @page-change="pageChange"
      >
        <template v-slot:component2="slotProps">
          <slot :action="slotProps.action">
            {{ slotProps.action.total_giro }}€
          </slot>
        </template>
        <template v-slot:component3="slotProps">
          <slot :action="slotProps.action">
            {{ slotProps.action.total_cost }} €
          </slot>
        </template>
        <template v-slot:component4="slotProps">
          <slot :action="slotProps.action">
            {{ slotProps.action.total_margin }}€
          </slot>
        </template>
        <template v-slot:component5="slotProps">
          <slot :action="slotProps.action">
            {{ slotProps.action.add_cost }}€
          </slot>
        </template>
        <template v-slot:component6="slotProps">
          <slot :action="slotProps.action">
            {{ slotProps.action.net_margin }}€
          </slot>
        </template>
      </Datatable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import store from "../../../store";
import type { TableColumnCtx } from "element-plus";

const searchUsers = ref("");
const dropdownParams = ref({});
const params = ref({});
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = ref({});
const userCreateVisible = ref(false);
const loading = ref(true);
const years = ref([]);
const total = ref({});
const selectYear = ref("");
const allSums = ref({});
const tableHeaders = ref([
  {
    columnName: "AYLAR",
    columnLabel: "month_name",
    sortEnabled: false,
  },
  {
    columnName: "CIRO",
    custom: "component2",
    sortEnabled: false,
  },
  {
    columnName: "MALIYET",
    custom: "component3",
    sortEnabled: false,
  },
  {
    columnName: "KÂR",
    custom: "component4",
    sortEnabled: false,
  },
  {
    columnName: "EK GIDER",
    custom: "component5",
    sortEnabled: false,
  },
  {
    columnName: "NET KAZANÇ",
    custom: "component6",
    sortEnabled: false,
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
    allSums.value = res.data.data.total;
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
  });
};

interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
  const sums: string[] = [];

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "Total";
      return;
    }
    if (index === 1) {
      sums[index] = Number(allSums?.value["giro"]).toFixed(2);
    }
    if (index === 2) {
      sums[index] = allSums?.value["cost"];
    }
    if (index === 3) {
      sums[index] = allSums?.value["margin"];
    }
    if (index === 4) {
      sums[index] = allSums?.value["add_cost"];
    }
    if (index === 5) {
      sums[index] = allSums?.value["net_margin"];
    }
  });

  return sums;
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
