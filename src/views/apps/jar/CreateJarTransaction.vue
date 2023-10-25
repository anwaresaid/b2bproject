<template>
  <el-dialog v-model="setVisible" title="Jar Create" width="50%">
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleFormRef"
      status-icon
      :size="formSize"
    >
      <el-form-item
        label="Description"
        prop="decription"
        label-width="250px"
        required
      >
        <el-input v-model="form.decription" autocomplete="off" />
      </el-form-item>
      <el-form-item label="amount" label-width="250px" prop="amount" required>
        <el-input
          :model-value="form.amount"
          @input="handleInput"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="Jar" prop="jar_id" label-width="250px" required>
        <DropdownRemote
          :url="jarUrl"
          @selected-game="setSupplierId"
          placeholder="select jar"
          :type="jarType"
          :keyg="jarKey"
          lable="Select Jar"
          wd="100%"
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
      <el-form-item
        label="transaction type"
        label-width="250px"
        prop="jar_transaction_type"
        required
      >
        <el-select v-model="form.jar_transaction_type" placeholder="Select">
          <el-option
            v-for="item in jarTransactionType"
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
import { currency, jarTransactionType } from "@/views/apps/utils/constants";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import { beautifyNumber } from "@/views/apps/utils/functions";

interface RuleForm {
  desciption: string;
  amount_currency: number;
  jar_id: number;
  amount: number;
  jar_transaction_type: number;
}

const formSize = ref("large");
const ruleFormRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();
const visible = defineProps(["isVisible"]);
const setVisible = ref("");
const emit = defineEmits();
const jarKey = "search";
const jarUrl = "jars/all";
const jarType = "jars";

setVisible.value = visible.isVisible;

const form = reactive<RuleForm>({
  decription: "",
  amount_currency: null,
  jar_id: null,
  amount: 0,
  jar_transaction_type: null,
});

const rules = reactive<FormRules<typeof form>>({
  decription: [
    {
      required: false,
      message: "Please enter decription",
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
  jar_id: [
    {
      required: true,
      message: "Please select owner",
      trigger: "change",
    },
  ],
  amount_currency: [
    {
      required: true,
      message: "Please select currency",
      trigger: "change",
    },
  ],
  jar_transaction_type: [
    {
      required: true,
      message: "Please select transaction type",
      trigger: "change",
    },
  ],
});

const setSupplierId = (value) => {
  form.jar_id = value;
};
const handleInput = (num) => {
  form.amount = beautifyNumber(num);
};
const confirmSubmission = (formEl) => {
  removeEmptyValues(form);
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      ApiService.postTest("jar/transactions", form)
        .then((res) => {
          ElMessageBox.alert(
            "Jar transaction created successfully !",
            "jar transaction creation",
            {
              confirmButtonText: "OK",
              callback: (action: Action) => {
                ElMessage({
                  type: "info",
                  message: `action: ${action}`,
                });
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
