<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex flex-row justify-content-between">
          <div class="d-flex flex-wrap w-75 align-items-center">
            <div class="d-flex align-items-center mb-15 w-100">
              <span class="svg-icon svg-icon-1 position-absolute ms-6">
                <inline-svg src="/media/icons/duotune/general/gen021.svg" />
              </span>
              <input
                type="text"
                v-model="search"
                class="form-control form-control-solid w-75 ps-15"
                placeholder="Search Key or Supplier or Game or Status"
              />
            </div>
            <div class="d-flex justify-content-between w-100 mb-5">
              <div class="d-flex flex-row">
                <h2 class="customer-name">
                  {{ allData?.order?.customer }} ({{
                    paginationData.totalKeyCount
                  }})
                </h2>
                <span :class="`badge py-3 px-4 fs-7 badge-light-info`">{{
                  allData?.order?.status
                }}</span>
              </div>
              <el-button
                class="button-zip"
                @click="downloadZip"
                v-if="allData?.order"
              >
                Download zip</el-button
              >
            </div>
            <Datatable
              :data="allData.order?.keys ? allData.order?.keys : []"
              :header="tableHeader"
              :sortable="false"
              :totalPages="
                paginationData.last_page ? paginationData.last_page : 0
              "
              :pagination="true"
              :enable-items-per-page-dropdown="true"
              :checkbox-enabled="true"
              checkbox-label="id"
              :itemsPerPage="itemsInTable"
              @on-items-per-page-change="getItemsInTable"
              @page-change="pageChange"
              class="w-100"
            >
              <template v-slot:component1="slotProps" #default="scope">
                <slot :action="slotProps.action">
                  <div v-for="key in keysTypeStatus">
                    <el-tag
                      v-if="
                        key.turkish?.toLowerCase() ===
                        slotProps.action.status.toLowerCase()
                      "
                      class="ml-2"
                      :type="key.status"
                      >{{ slotProps.action.status }}</el-tag
                    >
                  </div>
                </slot>
              </template>
              <template v-slot:component2="slotProps" #default="scope">
                <slot :action="slotProps.action">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="Follow Key"
                    placement="top-start"
                  >
                    <router-link
                      :to="`/keys/follow/${slotProps.action.keycode}`"
                    >
                      <el-button type="info" icon="Back" link />
                    </router-link>
                  </el-tooltip>
                </slot>
              </template>
            </Datatable>
            <div class="w-100">
              <h3 class="total-header mt-10">ORDER DETAIL</h3>
              <div class="d-flex w-25 mt-10 mb-10 justify-content-between">
                <h6>Order By</h6>
                <div class="ms-10">{{ allData.order?.created_by }}</div>
              </div>
              <h6>Currency</h6>
              <div
                v-for="currency in currencyKeys.filter((key) => key !== 'date')"
                class="d-flex flex-row w-100 justify-content-between"
              >
                <span class="currency-label mt-5">{{ currency }}:</span>
                <div
                  v-for="curr in currencyKeys.filter((key) => {
                    return key !== currency && key !== 'date';
                  })"
                  class="f-flex flex-row mt-5"
                >
                  <div v-if="curr !== 'date'">
                    <span class="currency-label d-flex flex-row w-100">{{
                      curr
                    }}</span>
                    {{ allData?.currency_info[currency][curr]?.toFixed(2) }}
                    {{ allData?.symbol[curr] }}
                  </div>
                </div>
              </div>
              <div class="currency-label d-flex flex-row mt-10">
                <span class="current-label me-5">Currency Date: </span
                >{{ allData?.currency_info?.date }}
              </div>
            </div>
          </div>
          <div class="vertical-line"></div>
          <div class="d-flex flex-column ms-5 align-items-center w-25">
            <h3 class="total-header">TOTAL AMOUNT</h3>
            <h2>
              {{ allData.order?.total_amount }}
              {{ allData.order?.amount_currency }}
            </h2>
            <hr />
            <div>
              <div
                v-for="item in allData.order?.items"
                class="d-flex flex-column align-items-center"
              >
                <span class="game-title">{{ item.game }}</span>
                <span class="mt-5"
                  >{{ item.quantity }} * {{ item.unit_price
                  }}{{ item.currency }} = {{ item.calculation
                  }}{{ item.currency }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, onBeforeMount } from "vue";
import ApiService from "@/core/services/ApiService";
import { useRouter, useRoute } from "vue-router";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { keysTypeStatus } from "../utils/constants";
import store from "../../../store";
import { errorHandling } from "@/views/apps/utils/functions";

const params = ref({});
const itemsInTable = ref(50);
const currentPage = ref(1);
const paginationData = ref({});
const allData = ref({});
const search = ref("");
const router = useRouter();
const currencyKeys = ref([]);
const tableHeader = ref([
  {
    columnName: "SUPPLIER",
    columnLabel: "supplier",
    sortEnabled: false,
  },
  {
    columnName: "GAME",
    columnLabel: "game",
    sortEnabled: false,
  },
  {
    columnName: "KEY",
    columnLabel: "keycode",
    sortEnabled: false,
  },
  {
    columnName: "KEY STATUS",
    columnLabel: "status",
    sortEnabled: false,
    custom: "component1",
  },
  {
    columnName: "FOLLOW",
    sortEnabled: false,
    custom: "component2",
  },
]);

const fetchData = () => {
  ApiService.postTest("orders/detail", params.value)
    .then((res) => {
      allData.value = res.data.data;
      currencyKeys.value = Object.keys(res.data.data.currency_info);
      paginationData.value = res.data.data.pagination;
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};

const navigateFollowPage = (item) => {
  const keycode = item.keycode;
  router.push({
    name: "keys-follow",
    params: {
      id: keycode,
    },
  });
};

const downloadZip = () => {
  const data = {
    current_page: params.value.current_page,
    order_code: params.value.order_code,
  };
  ApiService.postZip("orders/detailZip", data, { responseType: "blob" })
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${
          allData.value?.order?.customer +
          "_" +
          allData.value?.order?.created_at
        }.zip`
      ); // Set the desired file name
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
watch(search, (newValue) => {
  if (search.value.length !== 0) {
    params.value = {
      search: search,
      order_code: router.currentRoute.value.params.id,
    };
    fetchData();
  } else {
    delete params.value.search;
    fetchData();
  }
  if (!newValue) {
    // emit("create-game", false);
  }
});

const getItemsInTable = (item) => {
  itemsInTable.value = item;
  params.value.per_page = item;
  fetchData();
};
const pageChange = (page: number) => {
  params.value.current_page = page;
  fetchData();
};

onMounted(() => {
  params.value.order_code = router.currentRoute.value.params.id;
  params.value.current_page = currentPage;
  params.value.per_page = itemsInTable;
  fetchData();
});

onBeforeMount(() => {});
</script>
<style>
.total-header {
  color: gray;
}
hr {
  color: lightgrey;
  width: 100%;
}
.game-title {
  font-weight: bold;
  color: grey;
}
.vertical-line {
  border-left: 0.5px solid lightgrey;
  height: auto;
  margin-left: 5px;
}
.customer-name {
  font-weight: bold;
  color: orange;
}
.button-zip {
  background-color: #7239ea;
  color: white;
}
.currency-label {
  font-weight: bold;
}
</style>
