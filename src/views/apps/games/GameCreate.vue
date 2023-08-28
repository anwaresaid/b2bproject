<template>
  <el-dialog v-model="setVisible" title="Game Create" width="50%">
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
        <multi-list-select
          :list="categoriesData"
          :selectedItems="form.category"
          optionValue="id"
          optionText="name"
          placeholder="Select Category"
          @select="onSelectCategory"
          @searchchange="onCategoryChange"
        >
        </multi-list-select>
      </el-form-item>
      <el-form-item
        label="Publisher Name"
        label-width="250px"
        prop="publisher"
        required
      >
        <multi-list-select
          :list="publisherData"
          :selectedItems="form.publisher"
          optionValue="id"
          optionText="name"
          placeholder="Select Publisher"
          @select="onSelectPublisher"
          @searchchange="onPublisherChange"
        >
        </multi-list-select>
      </el-form-item>
      <el-form-item
        label="Game Status"
        label-width="250px"
        prop="stats"
        required
      >
        <model-select
          :options="statusData"
          v-model="form.stats"
          placeholder="select status"
        >
        </model-select>
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
        <multi-list-select
          :list="regionData"
          :selectedItems="form.region"
          optionValue="id"
          optionText="name"
          placeholder="Select Region"
          @select="onSelectRegion"
          @searchchange="onRegionChange"
        >
        </multi-list-select>
      </el-form-item>
      <el-form-item
        label="Language"
        label-width="250px"
        prop="language"
        required
      >
        <multi-list-select
          :list="languageData"
          :selectedItems="form.language"
          optionValue="id"
          optionText="name"
          placeholder="Select Language"
          @select="onSelectLanguage"
          @searchchange="onLanguageChange"
        >
        </multi-list-select>
      </el-form-item>
      <el-form-item
        label="Category Type"
        label-width="250px"
        prop="categoryType"
        required
      >
        <model-select
          :options="categoryType1"
          v-model="form.categoryType"
          placeholder="select category type"
        >
        </model-select>
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
        <el-button type="primary" @click="createGame(ruleFormRef)">
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
import PusherService from "@/core/services/PusherService";
import {
  ModelListSelect,
  MultiListSelect,
  ModelSelect,
} from "vue-search-select";
import { gameStatus, categoryType } from "../utils/constants";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";

import type { Action } from "element-plus";

interface RuleForm {
  name: string;
  category: [];
  publisher: [];
  language: [];
  region: [];
  stats: [];
  description: string;
  categoryType: object;
}

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const visible = defineProps(["isVisible"]);
const setVisible = ref("");
setVisible.value = visible.isVisible;
const channel = PusherService.subscribe("my-channel");
const message = ref("");

const form = reactive<RuleForm>({
  publisher: [],
  category: [],
  language: [],
  region: [],
  stats: [],
  name: "",
  description: "",
  categoryType: {},
});

channel.bind("my-event", (data) => {
  message.value = data;
});

const statusData = ref(gameStatus);
const publisherData = ref([]);
const regionData = ref([]);
const languageData = ref([]);
const categoriesData = ref([]);
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
};

const createGame = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const submissionData = {
        name: form.name,
        category_id: form.category[0].id,
        publisher_id: form.publisher[0].id,
        status: form.stats.value,
        min_sales: form.min_sales,
        region_id: form.region[0].id,
        language_id: form.language[0].id,
        category_type: form.categoryType.value,
        description: form.description,
      };
      ApiService.post("games", submissionData).then((res) => {
        formEl.resetFields();
        confirmSubmission();
      });
    } else {
    }
  });
};

const onCategoryChange = (text) => {
  if (text !== "") {
    ApiService.getTest("categories", text, 2).then((res) => {
      categoriesData.value = res.data.data.categories;
    });
  } else {
    categoriesData.value = [];
  }
};

const onSelectCategory = (items, lastItem) => {
  form.category = [lastItem];
};

const onPublisherChange = (text) => {
  if (text !== "") {
    ApiService.getTest("publishers", text, 2).then((res) => {
      publisherData.value = res.data.data.publishers;
    });
  } else {
    publisherData.value = [];
  }
};

const onSelectPublisher = (items, lastItem) => {
  form.publisher = [lastItem];
};

const onRegionChange = (text) => {
  if (text !== "") {
    ApiService.postTest("regions/all", { search: text }).then((res) => {
      regionData.value = res.data.data.regions;
    });
  } else {
    regionData.value = [];
  }
};

const onSelectRegion = (items, lastItem) => {
  form.region = [lastItem];
};

const onLanguageChange = (text) => {
  if (text !== "") {
    ApiService.getTest("languages", text, 2).then((res) => {
      languageData.value = res.data.data.languages;
    });
  } else {
    languageData.value = [];
  }
};

const onSelectLanguage = (items, lastItem) => {
  form.language = [lastItem];
};

watch(visible, (newValue) => {
  setVisible.value = newValue.isVisible;
  if (!newValue) {
    // Emit event or perform other actions when dialog visibility changes
  }
});
watch(setVisible, (newValue) => {
  if (!newValue) {
    emit("create-game", false);
  }
});
watch(message, (newValue) => {
  if (!newValue) {
    // emit("create-game", false);
  }
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
