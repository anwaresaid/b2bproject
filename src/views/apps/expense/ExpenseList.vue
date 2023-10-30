<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex justify-content-between mb-5">
          <!-- <DropdownRemote
            :url="jarUrl"
            @selected-game="setJarId"
            placeholder="select moneybox"
            :type="jarType"
            :keyg="jarKey"
            lable="Select Moneybox"
            wd="100%"
          /> -->
          <DropdownRemote
            :url="userUrl"
            @selected-game="setUserId"
            placeholder="select user"
            :type="userType"
            :keyg="jarKey"
            lable="Select User"
            wd="100%"
          />
          <!-- <el-select v-model="currency" placeholder="Select Currency">
            <el-option
              v-for="item in currency"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
          <!-- <el-select
            v-model="transactionType"
            placeholder="Select Transaction type"
          >
            <el-option
              v-for="item in jarTransactionType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
          <el-tooltip
            class="box-item"
            effect="dark"
            content="Add Expense"
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
        <div class="d-flex flex-row justify-content-between align-items-center">
          <div class="d-flex flex-row align-items-center">
            <el-date-picker
              v-model="fromDate"
              :disabled-date="disabledFromDate"
              type="datetime"
              placeholder="From"
              :default-time="defaultTime"
            />
            <el-date-picker
              v-model="toDate"
              :disabled-date="disabledToDate"
              type="datetime"
              placeholder="To"
              :default-time="defaultTime"
            />
            <el-button type="primary" @click="handleChangeDates"
              >Apply</el-button
            >
          </div>
          <div class="d-flex flex-row">
            <el-input
              :model-value="beautifyNumber(minPrice)"
              @input="handleMin"
              placeholder="Min Price"
              autocomplete="off"
            />
            <el-input
              :model-value="beautifyNumber(maxPrice)"
              @input="handleMax"
              placeholder="Max Price"
              autocomplete="off"
            />
            <el-button type="primary" @click="handlePriceFilter"
              >Apply</el-button
            >
          </div>
        </div>
        <div v-if="errors != null" class="text-danger">{{ errors }}</div>
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
  <CreateExpense :isVisible="userCreateVisible" @create-key="closeCreateUser" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { currency, jarTransactionType } from "@/views/apps/utils/constants";

import store from "../../../store";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import CreateExpense from "@/views/apps/expense/ExpenseCreate.vue";
import { errorHandling } from "@/views/apps/utils/functions";
import {
  beautifyNumber,
  dateFormatter2,
  switchBeautifulNumber,
} from "../utils/functions";

const usersData = ref([]);
const searchUsers = ref("");
const dropdownParams = ref({});
const params = ref({});
const errors = ref(null);
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = ref({});
const transactionType = ref();
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
// const currency = ref();
// const jarid = ref();
const fromDate = ref();
const toDate = ref();
const userId = ref();
const minPrice = ref();
const maxPrice = ref();
const userCreateVisible = ref(false);
const loading = ref(true);
const jarKey = "search";
// const jarUrl = "jars/all";
// const jarType = "jars";
const userUrl = "users/all";
const userType = "users";

const tableHeaders = ref([
  {
    columnName: "CREATOR",
    columnLabel: "creator.name",
    sortEnabled: false,
  },
  {
    columnName: "CREATE DATE",
    columnLabel: "created",
    sortEnabled: false,
  },
  {
    columnName: "AMOUNT",
    columnLabel: "amount",
    sortEnabled: false,
  },
  {
    columnName: "CONVER EURO",
    columnLabel: "convert_eur",
    sortEnabled: false,
  },
  {
    columnName: "DESCRIPTION",
    columnLabel: "description",
    sortEnabled: false,
  },
]);

const fetchExpenses = (type) => {
  loading.value = true;
  if (type === undefined) {
    params.value.current_page = currentPage.value;
    params.value.per_page = itemsInTable.value;
  }
  ApiService.post("expenses/all", params.value)
    .then((res) => {
      loading.value = false;
      usersData.value = res.data.data.expenses;
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
    start: dateFormatter2(fromDate, "time"),
    finish: dateFormatter2(toDate, "time"),
  };
  dropdownParams.value.start = date.start;
  dropdownParams.value.finish = date.finish;
  params.value.start = date.start;
  params.value.finish = date.finish;
  fetchExpenses();
};

const setUserId = (value) => {
  params.value.who = value;
  fetchExpenses("filer");
};

const handlePriceFilter = () => {
  params.value = {};
  errors.value = null;
  if (minPrice.value > maxPrice.value) {
    errors.value = "Min price should be less than max price2";
    return;
  }
  dropdownParams.value.amount_less = minPrice.value;
  dropdownParams.value.amount_max = maxPrice.value;
  params.value.amount_less = switchBeautifulNumber(minPrice.value).toFixed(2);
  params.value.amount_max = switchBeautifulNumber(maxPrice.value).toFixed(2);
  fetchExpenses();
};
const disabledFromDate = (time: Date) => {
  return time.getTime() > toDate.value;
};
const handleMin = (num) => {
  console.log("num", typeof num);
  minPrice.value = beautifyNumber(num); // Allow only numbers
};
const handleMax = (num) => {
  maxPrice.value = beautifyNumber(num); // Allow only numbers
};
const disabledToDate = (time: Date) => {
  return time.getTime() < fromDate.value;
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
    fetchExpenses();
  }
};

const setCustomerId = (value) => {
  dropdownParams.value.customer_id = value;
  params.value = dropdownParams.value;
  if (value === undefined) {
    delete dropdownParams.value["customer_id"];
  }
  fetchOrders("filer");
};

const createUser = () => {
  userCreateVisible.value = true;
};

// watch(jarid, (newValue) => {
//   params.value = {};
//   params.value = jarid.value;
//   fetchExpenses("some");
// });
watch(userId, (newValue) => {
  params.value = {};
  params.value.who = userId.value;
  console.log("params", params);
  fetchExpenses("some");
});
// watch(currency, (newValue) => {
//   params.value = {};
//   params.value.amount_currency = currency.value;
//   fetchExpenses("some");
// });
// watch(transactionType, (newValue) => {
//   params.value = {};
//   params.value. = transactionType.value;
//   console.log("params", params.value);
//   fetchExpenses("some");
// });

onMounted(() => {
  params.value.current_page = currentPage.value;
  params.value.per_page = itemsInTable.value;
  fetchExpenses("some");
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
