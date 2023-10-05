<template>
  <div
    v-for="(commission, cindex) in tableData"
    class="mb-10 d-flex flex-column justify-content-center"
  >
    <div>
      <div
        v-if="commission.commission_settings.length > 0"
        class="d-flex flex-row justify-content-center mb-10"
      >
        <MarketplaceSettingsCard
          :theme="store2.mode"
          :data="commission"
          class="left-card"
        />
        <div class="card right-card ms-10">
          <div class="card-header border-0 pt-6 mb-5">
            <div
              class="title-container d-flex align-items-center justify-content-center"
            >
              <h4>{{ commission?.name }} Komisyon</h4>
            </div>
            <table class="w-100">
              <tr>
                <th class="table-header">Kategori</th>
                <th class="table-header">Yüzdelik</th>
                <th class="table-header">Sabit</th>
                <th class="table-header">Başlangıç</th>
                <th class="table-header">Bitiş</th>
                <th class="table-header">Delete</th>
              </tr>
              <tr v-for="(item, index) in commission?.commission_settings">
                <td width="100px">
                  <DropdownRemote
                    :url="categoriesUrl"
                    @selected-game="changeSelectedItem"
                    :type="categoriesType"
                    :default="item?.category?.name"
                    :keyg="categoriesKey"
                    placeholder="please select a category"
                    :index="index"
                    :currentItemIndex="cindex"
                    :currentLength="commission?.commission_settings?.length"
                    :commission="item"
                    :data="item.category"
                    wd="100px"
                  />
                </td>
                <td class="table-cell">
                  <input
                    type="text"
                    class="form-control form-control-solid mb-3 mb-lg-0"
                    placeholder="Percent commission"
                    name="kt_docs_repeater_eneba[0][eneba_percent_commission]"
                    id="eneba_percent_commission"
                    :value="item?.percent_value"
                    @focus="focus($event)"
                    @blur="
                      blur(
                        item,
                        'percent_value',
                        $event,
                        index,
                        cindex,
                        commission
                      )
                    "
                  />
                </td>
                <td class="table-cell">
                  <input
                    type="text"
                    class="form-control form-control-solid mb-3 mb-lg-0"
                    placeholder="Percent commission"
                    name="kt_docs_repeater_eneba[0][eneba_percent_commission]"
                    id="eneba_percent_commission"
                    :value="item?.const_value"
                    @blur="
                      blur(
                        item,
                        'const_value',
                        $event,
                        index,
                        cindex,
                        commission
                      )
                    "
                  />
                </td>
                <td class="table-cell">
                  <input
                    type="text"
                    class="form-control form-control-solid mb-3 mb-lg-0"
                    placeholder="Percent commission"
                    name="kt_docs_repeater_eneba[0][eneba_percent_commission]"
                    id="eneba_percent_commission"
                    :value="item?.min"
                    @blur="blur(item, 'min', $event, index, cindex, commission)"
                  />
                </td>
                <td class="table-cell">
                  <input
                    type="text"
                    class="form-control form-control-solid mb-3 mb-lg-0"
                    placeholder="Percent commission"
                    name="kt_docs_repeater_eneba[0][eneba_percent_commission]"
                    id="eneba_percent_commission"
                    :value="item?.max"
                    @blur="blur(item, 'max', $event, index, cindex, commission)"
                  />
                </td>
                <td class="table-cell">
                  <el-button type="danger" class="w-100" plain
                    >Delete</el-button
                  >
                </td>
              </tr>
              <tr>
                <td class="table-cell text-center">
                  <el-button
                    class="w-100"
                    plain
                    type="primary"
                    @click="addSetting(cindex)"
                    >Add</el-button
                  >
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div
        class="d-flex justify-content-center w-100"
        v-if="
          commission.callback_urls &&
          typeof commission.callback_urls === 'object'
        "
      >
        <ReservationCallbackCard
          :theme="store2.mode"
          :data="commission"
          class="callback-card"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, toRefs, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import Dropdownh from "@/components/dropdown/DropdownSettingsTable.vue";
import { categoryType } from "../utils/constants";
import { useRouter } from "vue-router";
import MarketplaceSettingsCard from "@/components/cards/MarketplaceSettingsCard.vue";
import ReservationCallbackCard from "@/components/cards/ReservationCallbackCard.vue";
import DropdownRemote from "../../../components/dropdown/DropdownRemoteMarketplaceSettings.vue";
import { useThemeStore } from "@/stores/theme";
import { errorHandling } from "@/views/apps/utils/functions";

const store = useThemeStore();
const categoriesUrl = ref("categories/all");
const categoriesType = ref("categories");
const categoriesKey = ref("search");
const store2 = useThemeStore();
const marketKey = "search";
const focused = ref(false);
const tableData = ref([]);
const selectedItem = ref([]);
const updateData = ref({});
const prevData = ref("");
const disableBlurOnMount = ref(false);
const totalTables = ref(null);
const currentIndex = ref(0);
const prevIndex = ref(null);
const addData = ref({});
let temp = 0;
const tableHeaders = ref([
  {
    columnName: "Kategori",
    columnWidth: 175,
    custom: "component1",
  },
  {
    columnName: "Yüzdelik",
    columnWidth: 300,
    custom: "percent_value",
  },
  {
    columnName: "Sabit",
    columnLabel: "const_value",
  },
  {
    columnName: "Başlangıç",
    custom: "component4",
  },
  {
    columnName: "Bitiş",
    columnLabel: "max",
    columnWidth: 300,
  },
  {
    columnName: "Delete",
    custom: "percent_value",
    columnWidth: 99,
  },
]);

const marketPlaceIdByName = (name) => {
  if (name.toLowerCase() === "eneba") {
    return 2;
  } else if (name.toLowerCase() === "kinguin") {
    return 1;
  } else if (name.toLowerCase() === "gamivo") {
    return 3;
  }
};
const fetchMarketplaceSettingsData = () => {
  //   loading.value = true;
  ApiService.post("marketplace/settings")
    .then((res) => {
      tableData.value = res.data;
      totalTables.value = tableData.value.filter(
        (item) => item.commission_settings.length > 0
      ).length;
    })
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
const updateSettings = () => {
  ApiService.post("marketplace/settings/update", updateData.value)
    .then((res) => {})
    .catch((e) => {
      errorHandling(e?.response?.data?.messages);
    });
};
const addSettings = (param) => {
  if (
    param.value["category_id"] != undefined &&
    param.value["const_value"] != undefined &&
    param.value["max"] !== undefined &&
    param.value["min"] !== undefined &&
    param.value["percent_value"] !== undefined
  ) {
    ApiService.post("marketplace/settings/add", param.value)
      .then((res) => {})
      .catch((e) => {
        errorHandling(e?.response?.data?.messages);
      });
  }
};
const focus = (data) => {
  //   prevData.value = data.target.value;
};

const blur = (setting, dataType, data, index, cindex, commission) => {
  updateData.value = {};
  if (setting.id) {
    updateData.value = { ...setting, settings_id: setting.id };
    updateData.value[dataType] = data.target.value;
    delete updateData.value.id;
    delete updateData.value.updated_at;
    delete updateData.value.created_at;
    delete updateData.value.category;

    updateSettings();
  } else {
    addData.value["marketplace_id"] = commission.id;
    addData.value[dataType] = data.target.value;
    addSettings(addData);
  }
};
const addSetting = (totData) => {
  tableData.value[totData].commission_settings.push({});
};
const changeSelectedItem = (data) => {
  updateData.value = {};
  if (data.id) {
    updateData.value = {
      ...data.commission,
      settings_id: data.commission.id,
      category_id: data.selected?.id,
    };
    delete updateData.value.id;
    delete updateData.value.updated_at;
    delete updateData.value.created_at;
    delete updateData.value.category;
    updateSettings();
  } else {
    addData.value["category_id"] = data.selected?.id;
    addSettings(addData);
  }
};

// watch(marketPlaceStatus, (newValue) => {
//   params.value.status = marketPlaceStatus.value;
//   if (params.value.status === "") {
//     delete params.value["status"];
//   }
//   fetchMatches();
// });

onMounted(() => {
  fetchMarketplaceSettingsData();
  disableBlurOnMount.value = true;
  //   params.value.current_page = currentPage;
  //   params.value.per_page = itemsInTable;
  //   params.value.page_type = tableType.value;
  //   fetchMatches();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped>
.el-form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.table-header {
  text-align: center !important;
  align-content: center;
}
.logos-stock {
  width: 20px;
  border-radius: 10px;
}
.all-stock {
  background-color: #e2c6ec;
  color: #592ef8;
  border-radius: 10px;
  border: 1px solid #bd2ef8;
}
h4 {
  color: white;
}
.table-cell {
  width: 100px;
}
.title-container {
  background-color: #181c32;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 5px;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 50px;
}
td {
  padding-top: 50px;
  padding-left: 5px;
  padding-right: 5px;
}

.left-card {
  width: 20%;
  align-self: flex-start;
}
.right-card {
  width: 50%;
}
table {
  table-layout: fixed;
}
.callback-card {
  width: 70%;
}
</style>
