<template>
  <el-dialog v-model="setVisible" title="Key Create" width="50%">
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleFormRef"
      status-icon
      :size="formSize"
    >
      <el-form-item label="Game" prop="game_id" label-width="250px" required>
        <DropdownRemote
          :url="gameUrl"
          @selected-game="setGameId"
          :type="gameType"
          :keyg="gameKey"
        />
      </el-form-item>
      <el-form-item
        label="Supplier"
        prop="supplier_id"
        label-width="250px"
        required
      >
        <DropdownRemote
          :url="supplierUrl"
          @selected-game="setSupplierId"
          :type="supplierType"
          :keyg="supplierKey"
        />
      </el-form-item>
      <el-form-item label="Status" label-width="250px" prop="status" required>
        <el-select v-model="form.status" class="m-2" placeholder="Select">
          <el-option
            v-for="item in keysTypeStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Invoice Number"
        label-width="250px"
        prop="invoice_no"
        required
      >
        <el-input v-model="form.invoice_no" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="Currency"
        label-width="250px"
        prop="currency"
        required
      >
        <el-select v-model="form.currency" class="m-2" placeholder="Select">
          <el-option
            v-for="item in currency"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="KDV" label-width="250px" prop="kdv">
        <el-checkbox v-model="form.kdv" label="is kdv?" />
      </el-form-item>
      <el-form-item
        label="KDV percentage"
        label-width="250px"
        prop="percent_of_kdv"
        required
        v-if="form.kdv === true"
      >
        <el-input
          v-model="form.percent_of_kdv"
          placeholder="Please enter percentage"
        >
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Cost" label-width="250px" prop="cost" required>
        <el-input v-model="form.cost" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Keys" label-width="250px" prop="keys" required>
        <el-input v-model="form.keys" type="textarea" />
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
import {
  ModelListSelect,
  MultiListSelect,
  ModelSelect,
} from "vue-search-select";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import { keysTypeStatus, currency } from "../utils/constants";
import type { Action } from "element-plus";

interface RuleForm {
  game_id: number;
  supplier_id: number;
  status: number;
  invoice_no: number;
  currency: number;
  cost: number;
  keys: string;
  percent_of_kdv: number;
  kdv: number;
}

const gameUrl = "games/list";
const gameKey = "search_game";
const supplierKey = "search";
const supplierUrl = "suppliers/all";
const gameType = "games";
const supplierType = "suppliers";
const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const props = defineProps(["isVisible", "isUpdate", "data"]);
const setVisible = ref("");
setVisible.value = props.isVisible;

const form = reactive<RuleForm>({
  game_id: null,
  supplier_id: null,
  status: null,
  percent_of_kdv: null,
  invoice_no: null,
  kdv: null,
  currency: null,
  cost: null,
  keys: "",
});

const emit = defineEmits();

const rules = reactive<FormRules<RuleForm>>({
  game_id: [
    {
      required: true,
      message: "Please select game",
      trigger: "blur",
    },
  ],
  supplier_id: [
    {
      required: true,
      message: "Please select a supplier",
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
  invoice_no: [
    {
      required: true,
      message: "Please enter invoice number",
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
  cost: [
    {
      required: true,
      message: "Please enter cost",
      trigger: "blur",
    },
  ],
  keys: [
    {
      type: "string",
      required: true,
      message: "Please enter keys",
      trigger: "blur",
    },
  ],
});
const confirmSubmission = () => {
  ElMessageBox.alert("new key created", "key creation", {
    confirmButtonText: "OK",
    callback: (action: Action) => {
      ElMessage({
        type: "info",
        message: `action: ${action}`,
      });
      emit("create-key", true);
    },
  });
};

const setGameId = (value) => {
  form.game_id = value;
};
const setSupplierId = (value) => {
  form.supplier_id = value;
};
const createGame = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      ApiService.post("keys", form).then((res) => {
        formEl.resetFields();
        confirmSubmission();
      });
    } else {
    }
  });
};

watch(props, (newValue) => {
  setVisible.value = props.isVisible;
  if (props.isUpdate) {
    form.game_id = props.data.game_id;
    form.supplier_id = props.data.supplier_id;
    form.status = props.data.status;
    form.percent_of_kdv = props.data.percent_of_kdv;
    form.invoice_no = props.data.invoice_no;
    form.kdv = props.data.kdv;
    form.currency = props.data.currency;
    form.cost = props.data.cost;
    form.keys = props.data.keys;
  }
  if (!newValue) {
    // Emit event or perform other actions when dialog visibility changes
  }
});
watch(setVisible, (newValue) => {
  if (!newValue) {
    emit("create-key", false);
  }
});
watch(form, (newValue) => {});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
