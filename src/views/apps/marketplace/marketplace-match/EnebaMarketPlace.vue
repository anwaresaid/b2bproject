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
            label="Choose game"
            prop="game_id"
            class="form-items-flex"
            label-width="140px"
            v-if="!props.update"
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
            label="Currency"
            class="form-items-flex"
            prop="amount_currency"
            label-width="140px"
            v-if="!props.update"
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
            label="Eneba game"
            prop="product_api_id"
            v-if="!props.update"
            required
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
            label="Status"
            label-width="140px"
            class="form-items-flex"
            prop="status"
            v-if="props.update"
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
            label="Price"
            prop="amount"
            class="form-items-flex"
            label-width="140px"
            required
          >
            <el-input
              v-model="form.amount"
              type="number"
              class="w-50"
              autocomplete="off"
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
import { errorHandling } from "@/views/apps/utils/functions";

interface RuleForm {
  amount: Number;
  amount_currency: {};
  product_api_id: {};
  game_id: {};
}

const enebaGameKey = "search";
const enebaGameUrl = "marketplace/eneba/search";
const enebaGameType = "games";
const gameKey = "search_game";
const gameUrl = "games/list";
const gameType = "games";
const formSize = ref("large");
const props = defineProps(["update", "data"]);
const update = ref(props.update);
const disabled = ref(true);
const ruleFormRef = ref<FormInstance>();

const form = reactive<RuleForm>({
  amount: props.data?.retail ? props.data?.retail : null,
  amount_currency: { value: 1, label: "EUR" },
  product_api_id: null,
  game_id: null,
  status: props.data?.status !== null ? props.data?.status : null,
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
      message: "Please select Eneba game",
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
  form.product_api_id = value;
};
const setGameId = (value) => {
  form.game_id = value;
};
const match = (formEl) => {
  let data = { ...form, amount: form.amount * 1 };
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid && !props.update) {
      ApiService.postTest("marketplace/eneba/match", form)
        .then((res) => {
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
        })
        .catch((e) => {
          errorHandling(e?.response?.data?.messages);
        });
    } else if (props.update) {
      let temp = {
        price: form.amount,
        status: form.status,
        offer_system_id: props.data.id,
      };
      ApiService.post("marketplace/updateOffer", temp)
        .then((res) => {
          ElMessageBox.alert(
            "you have updated offer successfully!",
            "marketplace Eneba update",
            {
              confirmButtonText: "OK",
              callback: (action: Action) => {
                location.reload();
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

watch(form, (newValue) => {
  if (form.game_id !== null) {
    disabled.value = false;
  }
});
watch(props, (newValue) => {
  form.amount = props.data.retail ? props.data.retail : null;
  form.status = props.data.status != undefined ? props.data.status : null;
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
