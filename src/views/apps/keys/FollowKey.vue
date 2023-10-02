<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex flex-row justify-content-between">
          <div class="d-flex align-items-center mb-10 position-relative">
            <span class="svg-icon svg-icon-1 position-absolute ms-6">
              <inline-svg src="/media/icons/duotune/general/gen021.svg" />
            </span>
            <input
              type="text"
              v-model="searchKey"
              class="form-control form-control-solid w-250px ps-15"
              placeholder="search key code"
            />
          </div>
          <div>
            <el-button @click="createKey" type="primary" icon="plus" round
              >add keys</el-button
            >
          </div>
          <div>
            <h3>Key Code: {{ searchKey }}</h3>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div
        v-if="data?.histories?.length > 0"
        class="d-flex flex-row justify-content-center"
      >
        <div class="card-body pt-0">
          <Datatable
            :data="data?.histories"
            :header="tableHeaders"
            checkbox-label="id"
            size="small"
            :loading="loading"
          >
            <template v-slot:component1="slotProps">
              <slot :action="slotProps.action">
                <span
                  v-if="slotProps.action?.order !== null"
                  @click="
                    navigateOrderDetails(slotProps.action?.order?.order_code)
                  "
                  :class="`order-code-link badge py-3 px-4 fs-7 badge-light-warning`"
                  >{{ slotProps.action?.order?.order_code }}</span
                >
                <span v-else> - </span>
              </slot>
            </template>
            <template v-slot:component2="slotProps">
              <slot :action="slotProps.action">
                {{
                  slotProps.action?.order === null
                    ? "-"
                    : slotProps.action?.order?.order_type
                }}
              </slot>
            </template>
            <template v-slot:component3="slotProps">
              <slot :action="slotProps.action">
                {{
                  slotProps.action?.order === null
                    ? "-"
                    : slotProps.action?.order?.customer
                }}
              </slot>
            </template>
            <template v-slot:component4="slotProps">
              <slot :action="slotProps.action">
                {{
                  slotProps.action?.order === null
                    ? "-"
                    : slotProps.action?.order?.created_at
                }}
              </slot>
            </template>
            <template v-slot:component5="slotProps">
              <slot :action="slotProps.action">
                <span
                  v-if="slotProps.action?.status === 'Rezerve'"
                  :class="`badge py-3 px-4 fs-7 badge-light-warning`"
                  >{{ slotProps.action?.status }}</span
                >
                <span
                  v-else-if="slotProps.action.status === 'Pasif'"
                  :class="`badge py-3 px-4 fs-7 badge-light-danger`"
                  >{{ slotProps.action.status }}</span
                >
                <span
                  v-else-if="slotProps.action.status === 'Aktif'"
                  :class="`badge py-3 px-4 fs-7 badge-light-primary`"
                  >{{ slotProps.action.status }}</span
                >
                <span
                  v-else-if="slotProps.action?.status === 'İade'"
                  :class="`badge py-3 px-4 fs-7 badge-light-info`"
                  >{{ slotProps.action?.status }}</span
                >
                <span
                  v-else
                  :class="`badge py-3 px-4 fs-7 badge-light-success`"
                  >{{ slotProps.action?.status }}</span
                >
              </slot>
            </template>
          </Datatable>
        </div>
      </div>
    </div>
  </div>
  <CreateKey :isVisible="keyCreateVisible" @create-key="closeCreateKey" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import store from "../../../store";
import { useRouter } from "vue-router";
import { errorHandling } from "@/views/apps/utils/functions";

import CreateKey from "./CreateKey.vue";

const searchKey = ref("");
const data = ref([]);
const loading = ref(false);
const router = useRouter();
const keyCreateVisible = ref(false);

const tableHeaders = ref([
  {
    columnName: "STATUS",
    custom: "component5",
  },
  {
    columnName: "STATUS DATE",
    columnLabel: "status_date",
    sortEnabled: true,
  },
  {
    columnName: "Order Code",
    custom: "component1",
  },
  {
    columnName: "Customer",
    custom: "component3",
  },
  {
    columnName: "ORDER TYPE",
    custom: "component2",
  },
  {
    columnName: "CREATED AT",
    custom: "component4",
  },
]);

const fetchKeyData = () => {
  loading.value = true;
  ApiService.post("keys/follow", { key_code: searchKey.value })
    .then((res) => {
      loading.value = false;
      data.value = res.data.data?.history;
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
const createKey = () => {
  keyCreateVisible.value = true;
};
const closeCreateKey = (value) => {
  keyCreateVisible.value = false;
  if (value) fetchKeyData();
};
// watch(dropdownParams.value.game_id, (newValue) => {
//   params.value = {};
//   console.log("called", dropdownParams.value);
//   params.value = dropdownParams.value;
//   fetchKeys("filer");
// });
watch(searchKey, (newValue) => {
  if (searchKey.value.length === 0) {
    data.value = null;
  } else fetchKeyData();
});
const navigateOrderDetails = (code) => {
  const order_id = code;
  store.dispatch("setOrderCode", order_id);
  router.push({
    name: "order-details",
    params: {
      id: order_id,
    },
  });
};

onMounted(() => {
  if (store.state.followKey != null) {
    searchKey.value = store.state.followKey;
  }
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped>
h3 {
  background-color: rgb(127, 205, 236);
  padding: 10px;
  color: #333;
  border: 2px solid #007bff;
  border-radius: 10px;
}
.order-code-link:hover {
  cursor: pointer;
  filter: brightness(120%);
}
</style>
