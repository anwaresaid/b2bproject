<template>
  <el-dialog v-model="setVisible" title="Expense Create" width="50%">
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleFormRef"
      status-icon
      :size="formSize"
    >
      <el-form-item
        label="Description"
        prop="description"
        label-width="250px"
        required
      >
        <el-input v-model="form.description" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Amount" label-width="250px" prop="amount" required>
        <el-input
          :model-value="form.amount"
          @input="handleInput"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="Currency"
        label-width="250px"
        prop="amount_currency"
        required
      >
        <el-select v-model="form.amount_currency" placeholder="Select">
          <el-option
            v-for="item in currency"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmSubmission(ruleFormRef)">
          Create
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
  onBeforeUnmount,
  defineEmits,
} from "vue";
import ApiService from "@/core/services/ApiService";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import type { Action, UploadInstance } from "element-plus";
import { errorHandling } from "@/views/apps/utils/functions";
import { currency } from "@/views/apps/utils/constants";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import {
  beautifyNumber,
  switchBeautifulNumber,
} from "@/views/apps/utils/functions";

interface RuleForm {
  description: string;
  amount_currency: number;
  amount: number;
}

const formSize = ref("large");
const ruleFormRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();
const visible = defineProps(["isVisible"]);
const setVisible = ref("");
const emit = defineEmits();

setVisible.value = visible.isVisible;

const form = reactive<RuleForm>({
  description: "",
  amount_currency: null,
  amount: 0,
});

const rules = reactive<FormRules<typeof form>>({
  description: [
    {
      required: false,
      message: "Please enter description",
      trigger: "blur",
    },
  ],
  amount: [
    {
      required: true,
      message: "Please enter amount",
      trigger: "blur",
    },
  ],
  amount_currency: [
    {
      required: true,
      message: "Please select currency",
      trigger: "change",
    },
  ],
});

const handleInput = (num) => {
  form.amount = beautifyNumber(num);
};
const emptyForm = (form) => {
  Object.keys(form).map((key) => (form[key] = null));
};
const confirmSubmission = (formEl) => {
  removeEmptyValues(form);
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      const data = {
        ...form,
        amount: switchBeautifulNumber(form.amount).toFixed(2),
      };
      ApiService.postTest("expenses", data)
        .then((res) => {
          ElMessageBox.alert(
            "Expenses created successfully !",
            "Expense creation",
            {
              confirmButtonText: "OK",
              callback: (action: Action) => {
                ElMessage({
                  type: "info",
                  message: `action: ${action}`,
                });
                emit("create-key", true);
                emptyForm(form);
              },
            }
          );
        })
        .catch((e) => {
          errorHandling(e?.response?.data?.messages);
        });
    } else {
      return false;
    }
  });
};
function removeEmptyValues(object) {
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var value = object[key];
      if (value === null || value === undefined || value === "") {
        delete object[key];
      } else if (typeof value === "object") {
        if (Object.keys(value).length === 0) {
          delete object[key];
        }
      }
    }
  }
}
watch(uploadRef, (newValue) => {
  if (!newValue) {
    form.avatar_url = newValue;
  }
});
watch(visible, (newValue) => {
  setVisible.value = newValue.isVisible;
  if (!newValue) {
    // Emit event or perform other actions when dialog visibility changes
  }
});
watch(setVisible, (newValue) => {
  if (!newValue) {
    emit("create-key", false);
  }
});
onMounted(() => {});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style></style>
