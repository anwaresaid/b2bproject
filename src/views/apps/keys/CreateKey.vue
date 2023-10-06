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
          :default="props.gameDropdown ? props.gameDropdown?.name : null"
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
        <el-input
          :model-value="form.cost"
          type="text"
          @input="assignCost"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label-width="250px" prop="cost" required>
        <el-input
          :value="
            form.kdv
              ? beautifyNumber(
                  switchBeautifulNumber(form.cost) *
                    (form.percent_of_kdv / 100) +
                    switchBeautifulNumber(form.cost)
                )
              : beautifyNumber(switchBeautifulNumber(form.cost))
          "
          disabled
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="Keys" label-width="250px" prop="keys" required>
        <div class="code-editor-container">
          <div class="code-editor">
            <div class="line-numbers">
              <div v-for="(line, index) in lines" :key="index">
                {{ index + 1 }}
              </div>
            </div>
            <textarea
              v-model="form.keys"
              @input="updateLines"
              class="code-textarea"
              rows="10"
            ></textarea>
          </div>
        </div>
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
import {
  errorHandling,
  beautifyNumber,
  switchBeautifulNumber,
} from "@/views/apps/utils/functions";

interface RuleForm {
  game_id: number;
  supplier_id: number;
  status: number;
  invoice_no: number;
  currency: number;
  cost: string;
  keys: string;
  percent_of_kdv: number;
  kdv: number;
}

const lines = ref([1]);

// Function to update the code when the user types in the textarea
const updateLines = () => {
  // Split the code into lines and update the lines array
  const lineCount = form.keys.split("\n").length;
  lines.value = Array.from({ length: lineCount }, (_, i) => i + 1);
};

const gameUrl = "games/list";
const gameKey = "search_game";
const supplierKey = "search";
const supplierUrl = "suppliers/all";
const gameType = "games";
const supplierType = "suppliers";
const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const props = defineProps(["isVisible", "isUpdate", "data", "gameDropdown"]);
const setVisible = ref("");
setVisible.value = props.isVisible;
// const lines = ref([""]);

const form = reactive<RuleForm>({
  game_id: null,
  supplier_id: null,
  status: 1,
  percent_of_kdv: null,
  invoice_no: new Date().toLocaleDateString(),
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
const emptyForm = (form) => {
  Object.keys(form).map((key) => (form[key] = null));
};
const confirmSubmission = () => {
  ElMessageBox.alert("new key created", "key creation", {
    confirmButtonText: "OK",
    callback: (action: Action) => {
      ElMessage({
        type: "info",
        message: `action: ${action}`,
      });
      emit("create-key", true);
      emptyForm(form);
    },
  });
};

const setGameId = (value) => {
  form.game_id = value;
};
const setSupplierId = (value) => {
  form.supplier_id = value;
};
const assignCost = (e) => {
  form.cost = beautifyNumber(e);
};
const createGame = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!form.kdv) {
        delete form["percent_of_kdv"];
      }
      ApiService.post("keys", form)
        .then((res) => {
          formEl.resetFields();
          confirmSubmission();
        })
        .catch((e) => {
          errorHandling(e?.response?.data?.messages);
        });
    }
  });
};

// const updateLines = () => {
//   lines.value = form.keys.split("\n");
// };

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
  if (props.gameDropdown) {
    form.game_id = props.gameDropdown;
    console.log("form", form);
  }
  lines.value = [1];
  form.keys = null;
  if (!newValue) {
    emit("create-key", false);
  }
});

// Update the lines array whenever the code changes
watch(form.keys, (newCode) => {
  const lineCount = newCode.split("\n").length;
  lines.value = Array.from({ length: lineCount }, (_, i) => i + 1);
});
watch(lines, (newValue) => {});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped>
.editor {
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  max-height: 300px; /* You can adjust this value as needed */
  border-top-right-radius: 10px;
  width: 100%;
}

.editor-text-area {
  background-color: #f5f8fa !important;
  border-color: #f5f8fa !important;
  color: #5e6278 !important;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.gutter {
  background: #11101f;
  color: grey;
  display: flex;
  flex-flow: column;
  padding: 0.75rem 1rem;
}
.editor textarea {
  background: #1a1930;
  flex: 1;
  border: 0;
  color: white;
  font-size: 1.1rem;
  line-height: 2.2;
  font-weight: 500;
  padding-top: 10px;
  overflow: hidden;
}
.line-number {
  color: #62a9b9;
  font-size: 1.1rem;
  line-height: 2.2;
  font-weight: 500;
  padding: 0px 0.5rem;
}
textarea:focus {
  outline: none;
}

.code-editor-container {
  max-height: 200px; /* Set a maximum height for the code editor */
  overflow-y: scroll; /* Make the entire code editor scrollable vertically */
  width: 100%;
}

.code-editor {
  display: flex;
  font-family: monospace;
}

.line-numbers {
  background: #11101f;
  flex: 0 0 30px;
  user-select: none;
  text-align: right;
  color: #62a9b9;
  font-size: 1.1rem;
  line-height: 25px;
  font-weight: 500;
  padding: 0px 1rem;
}
.line-numbers div:first-child {
  padding-top: 9.5px;
}

.code-container {
  flex: 1;
}

.code-textarea {
  border: none;
  outline: none;
  resize: none;
  padding: 10px;
  font-family: inherit;
  line-height: 25px;
  background-color: #f5f8fa !important;
  border-color: #f5f8fa !important;
  color: #5e6278 !important;
  width: 100%;
  white-space: nowrap;
  overflow: hidden; /* Hide the scrollbar */
  /*
  background-color: #f5f8fa !important;
  border-color: #f5f8fa !important;
  color: #5e6278 !important;
  transition: color 0.2s ease, background-color 0.2s ease; */
}
</style>
