<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="form-items-flex">
          <el-checkbox v-model="checkedEneba" label="Eneba" />
          <el-checkbox v-model="checkedGamivo" label="Gamivo" />
          <el-checkbox v-model="checkedKinguin" label="Kinguin" />
        </div>
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleFormRef"
          status-icon
          :size="formSize"
          class="form-control"
        >
          <el-form-item
            label="price"
            prop="price"
            class="form-items-flex"
            label-width="140px"
            required
          >
            <el-input
              v-model="form.price"
              type="number"
              class="w-50"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="Status"
            class="form-items-flex"
            prop="status"
            label-width="140px"
            required
          >
            <el-select v-model="form.status" placeholder="Select" class="w-50">
              <el-option
                v-for="item in matchStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="Choose game"
            prop="game_id"
            class="form-items-flex"
            label-width="140px"
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
            label="Eneba game"
            prop="eneba_product"
            required
            v-if="checkedEneba"
            class="form-items-flex"
            label-width="140px"
          >
            <DropdownRemote
              :url="enebaGameUrl"
              @selected-game="setEnebaGameId"
              :type="enebaGameType"
              :keyg="enebaGameKey"
              :disabled="disabled"
              wd="50%"
              :condition="4"
            />
          </el-form-item>
          <el-form-item
            label="Kinguin game"
            prop="kinguin_product"
            required
            v-if="checkedKinguin"
            class="form-items-flex"
            label-width="140px"
          >
            <DropdownRemote
              :url="kinguinGameUrl"
              @selected-game="setKinguinGameId"
              :type="enebaGameType"
              :keyg="enebaGameKey"
              :disabled="disabled"
              wd="50%"
              :condition="4"
            />
          </el-form-item>
          <el-form-item
            label="Gamivo game"
            prop="gamivo_product"
            required
            v-if="checkedGamivo"
            class="form-items-flex"
            label-width="140px"
          >
            <DropdownRemote
              :url="gamivoGameUrl"
              @selected-game="setGamivoGameId"
              :type="enebaGameType"
              :keyg="enebaGameKey"
              :disabled="disabled"
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
import { currency, matchStatus } from "../../utils/constants.ts";
import { removeEmptyValues } from "../../utils/functions";

interface RuleForm {
  price: Number;
  status: {};
  eneba_product: {};
  kinguin_product: {};
  gamivo_product: {};
  game_id: {};
}

const enebaGameKey = "search";
const enebaGameUrl = "marketplace/eneba/search";
const enebaGameType = "games";
const kinguinGameUrl = "marketplace/kinguin/search";
const gamivoGameUrl = "marketplace/kinguin/search";
const checkedKinguin = ref(false);
const checkedGamivo = ref(false);
const checkedEneba = ref(false);
const gameKey = "search_game";
const gameUrl = "games/list";
const gameType = "games";
const formSize = ref("large");
const ruleFormRef = ref<FormInstance>();
const setVisible = ref("");
const enebaGameId = ref("");
const disabled = ref(true);

const form = reactive<RuleForm>({
  price: null,
  status: null,
  eneba_product: null,
  gamivo_product: null,
  kinguin_product: null,
  game_id: null,
});

const rules = reactive<FormRules<typeof form>>({
  price: [
    {
      required: true,
      message: "Please enter price",
      trigger: "blur",
    },
  ],
  status: [
    {
      required: true,
      message: "Please select status",
      trigger: "change",
    },
  ],
  eneba_product: [
    {
      required: checkedEneba.value,
      message: "Please select Eneba game",
      trigger: "change",
    },
  ],
  kinguin_product: [
    {
      required: checkedKinguin.value,
      message: "Please select Kinguin game",
      trigger: "change",
    },
  ],
  gamivo_product: [
    {
      required: checkedGamivo.value,
      message: "Please select Gamivo game",
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

const setEnebaGameId = (value) => {
  form.eneba_product = value;
};
const setKinguinGameId = (value) => {
  form.kinguin_product = value;
};
const setGamivoGameId = (value) => {
  form.gamivo_product = value;
};
const setGameId = (value) => {
  form.game_id = value;
};
const match = (formEl) => {
  let data = removeEmptyValues(form);
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      ApiService.post("marketplace/match/multiple", data).then((res) => {
        ElMessageBox.alert(
          "you have match games successfully!",
          "marketplace eneba match",
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

watch(form, (newValue) => {
  if (form.game_id !== null) {
    disabled.value = false;
  }
});
watch(checkedEneba, (newValue) => {
  if (!checkedEneba.value) {
    form.eneba_product = null;
  }
});
watch(checkedKinguin, (newValue) => {
  if (!checkedKinguin.value) {
    form.kinguin_product = null;
  }
});
watch(checkedGamivo, (newValue) => {
  if (!checkedGamivo.value) {
    form.gamivo_product = null;
  }
});

onMounted(() => {});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped>
.form-control {
  display: flex !important;
  flex-wrap: wrap;
}
.form-items-flex {
  display: flex;
  flex: 50%;
}
.el-form-item__label {
  justify-content: flex-start !important;
}
</style>
