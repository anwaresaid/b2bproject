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
        {{ form.category.name }}
        <DropdownRemote
          :url="categoriesUrl"
          :default="isUpdate ? form.category?.name : null"
          @selected-game="setCategoryId"
          returnType="object"
          :type="categoriesType"
          :keyg="categoriesKey"
          wd="100%"
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
          :default="isUpdate ? form.publisher?.name : null"
          :type="publishersType"
          :keyg="categoriesKey"
          wd="100%"
        />
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
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Min Sale"
        label-width="250px"
        prop="min_sales"
        required
      >
        <el-input v-model="form.min_sales" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Region" label-width="250px" prop="region" required>
        <DropdownRemote
          :url="regionUrl"
          @selected-game="setRegionId"
          :default="isUpdate ? form.region?.name : null"
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
          :default="isUpdate ? form.language?.name : null"
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
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="description"
        label-width="250px"
        prop="description"
        required
      >
        <el-input v-model="form.description" autocomplete="off" />
      </el-form-item>
    </el-form>
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
}
const test = ref("Bethesda");
const formSize = ref("default");
const categoriesUrl = "categories/all";
const categoriesType = "categories";
const categoriesKey = "search";
const publishersUrl = "publishers/all";
const publishersType = "publishers";
const regionUrl = "regions/all";
const regionType = "regions";
const languageUrl = "languages/all";
const languageType = "languages";
const ruleFormRef = ref<FormInstance>();
const props = defineProps(["isVisible", "update", "isUpdate"]);
const setVisible = ref("");
const isUpdate = ref(false);
setVisible.value = props.isVisible;
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
      trigger: "change",
    },
  ],
  category: [
    {
      required: true,
      message: "Please select category",
      trigger: "change",
    },
  ],
  region: [
    {
      required: true,
      message: "Please select region",
      trigger: "change",
    },
  ],
  status: [
    {
      required: true,
      message: "Please select status",
      trigger: "change",
    },
  ],
  categoryType: [
    {
      required: true,
      message: "Please select category type",
      trigger: "change",
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
  if (isUpdate) {
    ElMessageBox.alert(`${form.name} is updated`, "game update", {
      confirmButtonText: "OK",
      callback: (action: Action) => {
        ElMessage({
          type: "info",
          message: `action: ${action}`,
        });
        emit("create-game", true);
      },
    });
  } else {
    ElMessageBox.alert("new game created", "game creation", {
      confirmButtonText: "OK",
      callback: (action: Action) => {
        ElMessage({
          type: "info",
          message: `action: ${action}`,
        });
        emit("create-game", true);
      },
    });
  }
};

const createUpdateGame = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("formdata", form);
      const submissionData = {
        name: form.name,
        category_id: form.category.id,
        publisher_id: form.publisher.id,
        status: form.stats.id,
        min_sales: form.min_sales,
        region_id: form.region.id,
        language_id: form.language.id,
        category_type: form.categoryType.id,
        description: form.description,
      };
      if (isUpdate) {
        console.log("props id ", props.update.id);
        ApiService.put(`games/${props.update.id}`, submissionData).then(
          (res) => {
            formEl.resetFields();
            confirmSubmission();
          }
        );
      } else {
        ApiService.post("games", submissionData).then((res) => {
          formEl.resetFields();
          confirmSubmission();
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
  console.log("categories", categories);
  form.category = { id: categories.id, name: categories.name };
};
const setLanguageId = (languages) => {
  form.language = languages;
};
const setRegionId = (regions) => {
  form.region = regions;
};
function setEmpty() {
  // console.log(
  //   "form inside empty----------------------------------------------------------------",
  //   input
  // );
  // if (typeof input === "object") {
  //   let keys = Object.keys(input);

  //   for (let key of keys) {
  //     if (typeof input[key] != "object") {
  //       input[key] = null;
  //     } else {
  //       setEmpty(input[key]);
  //     }
  //   }
  //   return input;
  // }
  let keys = Object.keys(form);
  for (let key of keys) {
    form[key] = null;
  }
  console.log("form after empty", form);
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
  console.log("is update", isUpdate);
  console.log("formbefore empty", form);
  isUpdate.value = props.isUpdate;
  if (setVisible.value === true && props.isUpdate) {
    form.publisher = props.update.publisher;
    form.category = props.update.category;
    form.language = props.update.language;
    form.region = props.update.region;
    form.stats = props.update.status;
    form.name = props.update.name;
    form.categoryType = props.update.category_type;
    form.min_sales = props.update.sale_price;
    form.description = props.update.description;
  } else if (setVisible.value === false && props.update) {
    setEmpty(form);
    console.log("form is empty", form);
  }
  console.log("from---", form);
  console.log("from---", props.update);
  if (!newValue) {
    emit("create-game", false);
  }
});
watch(test, (newValue) => {
  console.log("test", test);
});
watch(message, (newValue) => {
  if (!newValue) {
    // emit("create-game", false);
  }
});

onMounted(() => {
  console.log("mounted");
});
onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
