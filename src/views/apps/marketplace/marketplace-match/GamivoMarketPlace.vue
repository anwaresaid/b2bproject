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
          <el-form-item label="price" prop="seller_price" required>
            <el-input
              v-model="form.seller_price"
              type="number"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="Status" prop="status" required>
            <el-select
              v-model="form.status"
              placeholder="Select"
              class="select-currency"
            >
              <el-option
                v-for="item in gamivoStatus"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Gamivo game search" prop="product" required>
            <DropdownRemote
              :url="gamivoGameUrl"
              @selected-game="setGamivoGameId"
              :type="gamivoGameType"
              :keyg="gamivoGameKey"
              wd="187.5px"
              :condition="4"
            />
          </el-form-item>
          <el-form-item label="Choose game" prop="game_id" required>
            <DropdownRemote
              :url="gameUrl"
              @selected-game="setGameId"
              :type="gameType"
              :keyg="gameKey"
              wd="187.5px"
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
import { currency, gamivoStatus } from "../../utils/constants.ts";

interface RuleForm {
  seller_price: Number;
  status: {};
  product: {};
  game_id: {};
}

const gamivoGameKey = "search";
const gamivoGameUrl = "marketplace/kinguin/search";
const gamivoGameType = "games";
const gameKey = "search_game";
const gameUrl = "games/list";
const gameType = "games";
const formSize = ref("large");
const ruleFormRef = ref<FormInstance>();

const form = reactive<RuleForm>({
  seller_price: null,
  status: null,
  product: null,
  game_id: null,
});

const rules = reactive<FormRules<typeof form>>({
  seller_price: [
    {
      required: true,
      message: "Please enter price",
      trigger: "blur",
    },
  ],
  status: [
    {
      required: true,
      message: "Please select currency",
      trigger: "change",
    },
  ],
  product: [
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

const onImageChange = (e) => {
  form.avatar_url = e.target.files[0];
};

const setGamivoGameId = (value) => {
  form.product = value;
};
const setGameId = (value) => {
  form.game_id = value;
};
const match = (formEl) => {
  let data = {
    ...form,
    seller_price: form.seller_price * 1,
    tier_one_seller_price: 0,
    tier_two_seller_price: 0,
  };
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      ApiService.postTest("marketplace/gamivo/match", form).then((res) => {
        ElMessageBox.alert(
          "you have match games successfully!",
          "marketplace gamivo match",
          {
            confirmButtonText: "OK",
            callback: (action: Action) => {
              location.reload();
            },
          }
        );
      });
    } else {
      return false;
    }
  });
};

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
  width: 187.5px !important;
}
</style>