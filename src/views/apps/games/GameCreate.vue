<template>
  <el-dialog
    v-model="setVisible"
    :title="isUpdate ? 'Game Update' : 'Game Create'"
    width="50%"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleFormRef"
      status-icon
      :size="formSize"
    >
      <el-form-item label="Name" prop="name" label-width="250px" required>
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="Category Name"
        prop="category"
        label-width="250px"
        required
      >
        <DropdownRemote
          :url="categoriesUrl"
          :default="form.category?.name"
          @selected-game="setCategoryId"
          :val="form.category"
          :clear="clear"
          returnType="object"
          :type="categoriesType"
          :keyg="categoriesKey"
          wd="100%"
        />
      </el-form-item>
      <el-form-item
        v-if="props.isUpdate"
        label="Sales Price"
        prop="sale_price"
        label-width="250px"
        required
      >
        <el-input
          :model-value="beautifyNumber(form.sale_price)"
          @input="handleInput"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item
        label="Publisher Name"
        label-width="250px"
        prop="publisher"
        required
      >
        <DropdownRemote
          :url="publishersUrl"
          @selected-game="setPublisherId"
          :val="form.publisher"
          returnType="object"
          :default="form.publisher?.name"
          :type="publishersType"
          :keyg="categoriesKey"
          wd="100%"
        />
      </el-form-item>
      <el-form-item v-if="isUpdate" label="" label-width="250px">
        <div class="d-flex flex-row justify-content-between w-100">
          <div>
            <el-checkbox
              v-model="checkedMarketplace"
              v-if="showMarketPlace && isUpdate"
              label="bu fiyat apilerde aktif olsun mu"
              size="large"
            />
          </div>
          <div class="stock-container">
            {{ "Stock: " + props.update.stock }}
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-if="checkedMarketplace"
        label="Marketplace"
        label-width="250px"
        prop="marketplace"
      >
        <div class="form-items-flex" v-if="checkedMarketplace">
          <el-checkbox
            v-if="showEneba"
            class="font-weight-bold text-success ms-5"
            v-model="checkedEneba"
            label="Eneba"
          />
          <el-checkbox
            v-if="showGamivo"
            class="font-weight-bold text-success ms-5"
            v-model="checkedGamivo"
            label="Gamivo"
          />
          <el-checkbox
            v-if="showKinguin"
            class="font-weight-bold text-success ms-5"
            v-model="checkedKinguin"
            label="Kinguin"
          />
        </div>
      </el-form-item>
      <el-form-item
        label="Game Status"
        label-width="250px"
        prop="stats"
        required
      >
        <el-select
          v-model="form.stats"
          placeholder="Select status"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="item in statusData"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Min Sale"
        label-width="250px"
        prop="min_sales"
        required
      >
        <el-input
          :model-value="form.min_sales"
          @input="handleInputMin"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="Region" label-width="250px" prop="region" required>
        <DropdownRemote
          :url="regionUrl"
          @selected-game="setRegionId"
          :val="form.region"
          returnType="object"
          :default="form.region?.name"
          :type="regionType"
          :keyg="categoriesKey"
          wd="100%"
        />
      </el-form-item>
      <el-form-item
        label="Language"
        label-width="250px"
        prop="language"
        required
      >
        <DropdownRemote
          :url="languageUrl"
          @selected-game="setLanguageId"
          returnType="object"
          :val="form.language"
          :default="form.language?.name"
          :type="languageType"
          placeholder="please select Language"
          :keyg="categoriesKey"
          wd="100%"
        />
      </el-form-item>
      <el-form-item
        label="Category Type"
        label-width="250px"
        prop="categoryType"
        required
      >
        <el-select
          v-model="form.categoryType"
          placeholder="Select status"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="item in categoryType1"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Description"
        label-width="250px"
        prop="description"
        required
      >
        <el-input v-model="form.description" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="'Make passive offers active"
        label-width="250px"
        prop="marketplace"
      >
        <div class="form-items-flex">
          <el-checkbox
            class="font-weight-bold ms-5"
            v-model="passivingOffers.eneba"
            label="Eneba"
          />
          <el-checkbox
            class="font-weight-bold ms-5"
            v-model="passivingOffers.gamivo"
            label="Gamivo"
          />
          <el-checkbox
            class="font-weight-bold ms-5"
            v-model="passivingOffers.kinguin"
            label="Kinguin"
          />
        </div>
      </el-form-item>
    </el-form>
    <span class="text-danger">{{ errors.length > 0 ? errors[0][0] : "" }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setVisible = false">Cancel</el-button>
        <el-button type="primary" @click="createUpdateGame(ruleFormRef)">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  watch,
  toRefs,
  onBeforeUnmount,
  defineEmits,
} from "vue";
import ApiService from "@/core/services/ApiService";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import { gameStatus, categoryType } from "../utils/constants";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  errorHandling,
  beautifyNumber,
  switchBeautifulNumber,
} from "@/views/apps/utils/functions";
import type { Action } from "element-plus";

interface RuleForm {
  name: string;
  category: number;
  publisher: number;
  language: number;
  region: number;
  stats: number;
  description: string;
  categoryType: number;
  min_sales: number;
  sale_price: number;
  auto_marketplaces: Array;
}
const test = ref("Bethesda");
const checkedKinguin = ref(false);
const clear = ref(false);
const checkedGamivo = ref(false);
const checkedEneba = ref(false);
const showEneba = ref(false);
const showGamivo = ref(false);
const showKinguin = ref(false);
const formSize = ref("default");
const categoriesUrl = "categories/all";
const categoriesType = "categories";
const categoriesKey = "search";
const publishersUrl = "publishers/all";
const publishersType = "publishers";
const regionUrl = "regions/all";
const regionType = "regions";
const passivingOffers = reactive({});
const languageUrl = "languages/all";
const languageType = "languages";
const checkedMarketplace = ref(false);
const ruleFormRef = ref<FormInstance>();
const props = defineProps(["isVisible", "update", "isUpdate"]);
const setVisible = ref("");
const showMarketPlace = ref(false);
const isUpdate = ref(false);
setVisible.value = props.isVisible;
const errors = ref([]);
const message = ref("");

const form = reactive<RuleForm>({
  publisher: 1,
  category: null,
  language: null,
  region: null,
  stats: null,
  name: "",
  description: "",
  categoryType: null,
  min_sales: null,
  sale_price: null,
  auto_marketplaces: [],
});

const statusData = ref(gameStatus);
const categoryType1 = ref(categoryType);
const emit = defineEmits();

const rules = reactive<FormRules<RuleForm>>({
  name: [
    {
      required: true,
      message: "Please input game name",
      trigger: "blur",
    },
  ],
  publisher: [
    {
      required: true,
      message: "Please select a publisher",
      trigger: "blur",
    },
  ],
  category: [
    {
      required: true,
      message: "Please select category",
      trigger: "blur",
    },
  ],
  region: [
    {
      required: true,
      message: "Please select region",
      trigger: "blur",
    },
  ],
  status: [
    {
      required: true,
      message: "Please select status",
      trigger: "blur",
    },
  ],
  categoryType: [
    {
      required: true,
      message: "Please select category type",
      trigger: "blur",
    },
  ],
  language: [
    {
      required: true,
      message: "Please select language",
      trigger: "blur",
    },
  ],
  info: [
    {
      required: true,
      message: "Please input game info",
      trigger: "blur",
    },
  ],
  minPrice: [
    {
      type: "number",
      required: true,
      message: "Please input game min price",
      trigger: "blur",
    },
  ],
});
const confirmSubmission = () => {
  if (isUpdate.value) {
    ElMessageBox.alert(`${form.name} is updated`, "game update", {
      confirmButtonText: "OK",
      callback: (action: Action) => {
        // location.reload();
        emit("create-game", true);
      },
    });
  } else {
    ElMessageBox.alert("new game created", "game creation", {
      confirmButtonText: "OK",
      callback: (action: Action) => {
        // location.reload();
        emit("create-game", true);
      },
    });
  }
};

const handleInput = (num) => {
  form.sale_price = beautifyNumber(num); // Allow only numbers
};
const handleInputMin = (num) => {
  form.min_sales = beautifyNumber(num); // Allow only numbers
};
const createUpdateGame = async (formEl: FormInstance | undefined) => {
  let tempMarketplaces = [];
  if (checkedEneba.value) tempMarketplaces.push(2);
  if (checkedGamivo.value) tempMarketplaces.push(3);
  if (checkedKinguin.value) tempMarketplaces.push(1);

  if (passivingOffers.kinguin) {
    if (!form.auto_marketplaces.includes(1)) form.auto_marketplaces.push(1);
  } else {
    const index = form.auto_marketplaces.indexOf(1);
    if (index > -1) {
      form.auto_marketplaces.splice(index, 1);
    }
  }
  if (passivingOffers.eneba) {
    if (!form.auto_marketplaces.includes(2)) form.auto_marketplaces.push(2);
  } else {
    const index = form.auto_marketplaces.indexOf(1);
    if (index > -1) {
      form.auto_marketplaces.splice(index, 1);
    }
  }
  if (passivingOffers.gamivo) {
    if (!form.auto_marketplaces.includes(3)) form.auto_marketplaces.push(3);
  } else {
    const index = form.auto_marketplaces.indexOf(1);
    if (index > -1) {
      form.auto_marketplaces.splice(index, 1);
    }
  }

  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const submissionData = {
        name: form.name,
        category_id: form.category?.id,
        publisher_id: form.publisher?.id,
        status: form.stats.id ?? form?.stats,
        min_sales: form?.min_sales,
        region_id: form?.region?.id,
        language_id: form?.language?.id,
        category_type: form?.categoryType?.id ?? form?.categoryType,
        description: form?.description,
        marketplaces: tempMarketplaces,
        sale_price: form.sale_price,
        auto_marketplaces: form.auto_marketplaces,
      };
      if (isUpdate.value) {
        ApiService.put(`games/${props.update?.id}`, submissionData)
          .then((res) => {
            formEl.resetFields();
            confirmSubmission();
          })
          .catch((e) => {
            errors.value = Object.values(e.response.data.messages);
          });
      } else {
        ApiService.post("games", submissionData)
          .then((res) => {
            formEl.resetFields();
            confirmSubmission();
          })
          .then((res) => {})
          .catch((e) => {
            errors.value = Object.values(e.response.data.messages);
          });
      }
    } else {
    }
  });
};

const setPublisherId = (publishers) => {
  form.publisher = publishers;
};
const setCategoryId = (categories) => {
  form.category = categories;
};
const setLanguageId = (languages) => {
  form.language = languages;
};
const setRegionId = (regions) => {
  form.region = regions;
};
function setEmpty() {
  if (typeof form === "object") {
    let keys = Object.keys(form);

    for (let key of keys) {
      if (typeof form[key] != "object") {
        form[key] = null;
      }
    }
    return form;
  }
  let keys = Object.keys(form);
  for (let key of keys) {
    form[key] = null;
  }
}

// const onSelectCategory = (items, lastItem) => {
//   form.category = [lastItem];
// };

// const onPublisherChange = (text) => {
//   if (text !== "") {
//     ApiService.getTest("publishers", text, 2).then((res) => {
//       publisherData.value = res.data.data.publishers;
//     });
//   } else {
//     publisherData.value = [];
//   }
// };

// const onSelectPublisher = (items, lastItem) => {
//   form.publisher = [lastItem];
// };
watch(props, (newValue) => {
  setVisible.value = newValue.isVisible;
  if (!newValue) {
    // Emit event or perform other actions when dialog visibility changes
  }
});

watch(setVisible, (newValue) => {
  clear.value = !clear.value;
  //clearing the form items
  showEneba.value = false;
  showGamivo.value = false;
  showKinguin.value = false;
  showMarketPlace.value = false;
  checkedMarketplace.value = false;
  errors.value = [];
  isUpdate.value = props.isUpdate;
  form.publisher = null;
  form.category = null;
  form.language = null;
  form.region = null;
  form.stats = 1;
  form.name = null;
  form.categoryType = null;
  form.min_sales = null;
  form.description = null;
  form.sale_price = null;

  if (setVisible.value === true && props.isUpdate) {
    if (
      props.update.match_images.some((item) => item.id === 2) ||
      props.update.match_images.some((item) => item.id === 3) ||
      props.update.match_images.some((item) => item.id === 1)
    ) {
      showMarketPlace.value = true;
      showEneba.value = props.update.match_images.some((item) => item.id === 2)
        ? true
        : false;
      showGamivo.value = props.update.match_images.some((item) => item.id === 3)
        ? true
        : false;
      showKinguin.value = props.update.match_images.some(
        (item) => item.id === 1
      )
        ? true
        : false;
    }

    form.publisher = props.update.publisher;
    form.category = props.update.category;
    form.language = props.update.language;
    form.region = props.update.region;
    form.stats = props.update.status.id * 1;
    form.name = props.update.name;
    form.categoryType = props.update.category_type.id * 1;
    form.min_sales = switchBeautifulNumber(props.update.sale_price);
    form.description = props.update.description;
    form.sale_price = props.update.sale_price;
    // checkedEneba.value = props.
  } else if (setVisible.value === false) {
    setEmpty(form);
  }
  if (!newValue) {
    emit("create-game", false);
  }
});
watch(test, (newValue) => {});
watch(message, (newValue) => {
  if (!newValue) {
    // emit("create-game", false);
  }
});

onMounted(() => {});
onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped>
.stock-container {
  margin-top: 5px;
}
</style>
