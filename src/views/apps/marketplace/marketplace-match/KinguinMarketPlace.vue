<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleFormRef"
          status-icon
          :size="formSize"
          class="form-control"
        >
          <el-form-item
            label="amount"
            prop="amount"
            label-width="140px"
            class="form-items-flex"
            required
          >
            <el-input
              v-model="form.amount"
              type="number"
              class="w-50"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="Currency"
            label-width="140px"
            class="form-items-flex"
            prop="amount_currency"
            required
          >
            <el-select
              v-model="form.amount_currency"
              placeholder="Select"
              class="w-50"
            >
              <el-option
                v-for="item in currency"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="Choose game"
            label-width="140px"
            class="form-items-flex"
            prop="game_id"
            required
          >
            <DropdownRemote
              :url="gameUrl"
              @selected-game="setGameId"
              :type="gameType"
              :keyg="gameKey"
              wd="50%"
            />
          </el-form-item>
          <el-form-item
            label="Kinguin game"
            prop="product_api_id"
            required
            label-width="140px"
            class="form-items-flex"
          >
            <DropdownRemote
              :url="kinguinGameUrl"
              @selected-game="setKinguinGameId"
              :disabled="disabled"
              :type="kinguinGameType"
              :keyg="kinguinGameKey"
              wd="50%"
              :condition="4"
            />
          </el-form-item>

          <div class="d-flex justify-content-end w-100">
            <el-button type="primary" @click="match(ruleFormRef)">
              Match
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
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
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import type { Action, UploadInstance } from "element-plus";
import DropdownRemote from "../../../../components/dropdown/DropdownRemote.vue";
import { currency } from "../../utils/constants.ts";

interface RuleForm {
  amount: Number;
  amount_currency: {};
  product_api_id: {};
  game_id: {};
}

const kinguinGameKey = "search";
const kinguinGameUrl = "marketplace/kinguin/search";
const kinguinGameType = "games";
const gameKey = "search_game";
const gameUrl = "games/list";
const gameType = "games";
const formSize = ref("large");
const disabled = ref(true);
const ruleFormRef = ref<FormInstance>();

const form = reactive<RuleForm>({
  amount: null,
  amount_currency: { value: 0, label: "EUR" },
  product_api_id: null,
  game_id: null,
});

const rules = reactive<FormRules<typeof form>>({
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
  product_api_id: [
    {
      required: true,
      message: "Please select Kinguin game",
      trigger: "change",
    },
  ],
  game_id: [
    {
      required: true,
      message: "Please select game",
      trigger: "change",
    },
  ],
});

const setKinguinGameId = (value) => {
  form.product_api_id = value;
};
const setGameId = (value) => {
  form.game_id = value;
};
const match = (formEl) => {
  let data = { ...form, amount: form.amount * 1 };
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      ApiService.postTest("marketplace/kinguin/match", form).then((res) => {
        ElMessageBox.alert(
          "you have match games successfully!",
          "marketplace kinguin match",
          {
            confirmButtonText: "OK",
            callback: (action: Action) => {
              //   location.reload();
            },
          }
        );
      });
    } else {
      return false;
    }
  });
};

watch(form, (newValue) => {
  if (form.game_id !== null) {
    disabled.value = false;
  }
});

onMounted(() => {});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style>
.form-control {
  display: flex !important;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.select-currency {
  width: 100% !important;
}
.form-items-flex {
  display: flex;
  flex: 50%;
  justify-content: flex-start !important;
}
.el-form-item__label {
  justify-content: flex-start !important;
}
</style>
