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
            label-width="140px"
            v-if="!update"
            class="form-items-flex"
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
            label="Status"
            prop="status"
            label-width="140px"
            class="form-items-flex"
            v-if="!update"
            required
          >
            <el-select v-model="form.status" placeholder="Select" class="w-50">
              <el-option
                v-for="item in gamivoStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
            label="Gamivo game"
            prop="product"
            label-width="140px"
            v-if="!update"
            class="form-items-flex"
            required
          >
            <DropdownRemote
              :url="gamivoGameUrl"
              @selected-game="setGamivoGameId"
              :type="gamivoGameType"
              :disabled="disabled"
              :keyg="gamivoGameKey"
              wd="50%"
              :condition="4"
            />
          </el-form-item>
          <el-form-item
            label="Price"
            prop="seller_price"
            label-width="140px"
            class="form-items-flex"
            type="number"
            required
          >
            <el-input
              v-model="form.seller_price"
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
import { currency, gamivoStatus, matchStatus } from "../../utils/constants.ts";
import { errorHandling } from "@/views/apps/utils/functions";

interface RuleForm {
  seller_price: Number;
  status: {};
  product: {};
  game_id: {};
}

const gamivoGameKey = "search";
const gamivoGameUrl = "marketplace/gamivo/search";
const gamivoGameType = "games";
const gameKey = "search_game";
const gameUrl = "games/list";
const gameType = "games";
const props = defineProps(["update", "data"]);
const update = ref(props.update);
const formSize = ref("large");
const disabled = ref(true);
const ruleFormRef = ref<FormInstance>();

const form = reactive<RuleForm>({
  seller_price: props.data?.retail ? props.data?.retail : null,
  product: null,
  game_id: null,
  status: props.data?.status ? props.data?.status : null,
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
    if (valid && !props.update) {
      ApiService.postTest("marketplace/gamivo/match", form)
        .then((res) => {
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
        })
        .catch((e) => {
          errorHandling(e?.response?.data?.messages);
        });
    } else if (props.update) {
      let temp = {
        price: form.seller_price,
        status: form.status,
        offer_system_id: props.data.id,
      };
      ApiService.post("marketplace/updateOffer", temp)
        .then((res) => {
          ElMessageBox.alert(
            "you have updated offer successfully!",
            "marketplace kinguin update",
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
  form.seller_price = props.data?.retail ? props.data?.retail : null;
  form.status = props.data?.status != undefined ? props.data?.status : null;
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
