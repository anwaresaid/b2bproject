<template>
  <el-dialog v-model="setVisible" title="Jar Create" width="50%">
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
      <el-form-item label="Balance" label-width="250px" prop="balance" required>
        <el-input
          :model-value="form.balance"
          @input="handleInput"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="Owner" prop="owner_id" label-width="250px" required>
        <DropdownRemote
          :url="supplierUrl"
          @selected-game="setSupplierId"
          placeholder="select supplier"
          :type="supplierType"
          :keyg="supplierKey"
          lable="Select supplier"
          wd="100%"
        />
      </el-form-item>
      <el-form-item
        label="Currency"
        label-width="250px"
        prop="currency"
        required
      >
        <el-select v-model="form.currency" placeholder="Select">
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
import { beautifyNumber } from "@/views/apps/utils/functions";

interface RuleForm {
  name: string;
  currency: number;
  owner_id: number;
  balance: number;
}

const formSize = ref("large");
const ruleFormRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();
const visible = defineProps(["isVisible"]);
const setVisible = ref("");
const emit = defineEmits();
const supplierKey = "search";
const supplierUrl = "suppliers/all";
const supplierType = "suppliers";

setVisible.value = visible.isVisible;

const form = reactive<RuleForm>({
  name: "",
  currency: null,
  owner_id: null,
  balance: 0,
});

const rules = reactive<FormRules<typeof form>>({
  name: [
    {
      required: true,
      message: "Please enter name",
      trigger: "blur",
    },
  ],
  balance: [
    {
      required: true,
      message: "Please enter balance",
      trigger: "blur",
    },
  ],
  owner_id: [
    {
      required: true,
      message: "Please select owner",
      trigger: "change",
    },
  ],
  currency: [
    {
      required: true,
      message: "Please select currency",
      trigger: "change",
    },
  ],
});

const setSupplierId = (value) => {
  form.owner_id = value;
};
const handleInput = (num) => {
  form.balance = beautifyNumber(num);
};
const confirmSubmission = (formEl) => {
  removeEmptyValues(form);
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      ApiService.postTest("jars", form)
        .then((res) => {
          ElMessageBox.alert("Jar created successfully !", "jar creation", {
            confirmButtonText: "OK",
            callback: (action: Action) => {
              ElMessage({
                type: "info",
                message: `action: ${action}`,
              });
            },
          });
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
