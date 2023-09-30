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
            label-width="140px"
            class="form-items-flex"
            prop="game_id"
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
            label-width="140px"
            class="form-items-flex"
            prop="amount_currency"
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
            label="Kinguin game"
            prop="product_api_id"
            required
            label-width="140px"
            class="form-items-flex"
            v-if="!props.update"
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
          <el-form-item
            label="Price"
            prop="price"
            label-width="140px"
            class="form-items-flex"
            required
            type="number"
          >
            <el-input
              v-model="form.price"
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

interface RuleForm {
  price: Number;
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
const props = defineProps(["update", "data"]);
const update = ref(props.update);
const formSize = ref("large");
const disabled = ref(true);
const ruleFormRef = ref<FormInstance>();

const form = reactive<RuleForm>({
  price: props.data?.retail ? props.data?.retail : null,
  amount_currency: { value: 1, label: "EUR" },
  product_api_id: null,
  game_id: null,
  status: props.data?.status !== null ? props.data?.status : null,
});

const rules = reactive<FormRules<typeof form>>({
  price: [
    {
      required: true,
      message: "Please enter price",
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
  let data = {
    ...form,
    price: form.price * 1,
    amount_currency: form.amount_currency.label
      ? form.amount_currency.value
      : form.amount_currency,
  };
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid && !props.update) {
      ApiService.post("marketplace/kinguin/match", data).then((res) => {
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
    } else if (props.update) {
      let temp = {
        price: form.price,
        status: form.status,
        offer_system_id: props.data.id,
      };
      ApiService.post("marketplace/updateOffer", temp).then((res) => {
        ElMessageBox.alert(
          "you have updated offer successfully!",
          "marketplace kinguin update",
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
watch(
  () => update,
  (newValue) => {
    form.price = props.data.price ? props.data.price : null;
    form.status = props.data.status ? props.data.status : null;
  },
  { deep: true }
);
watch(
  () => props.data,
  (newVal, oldVal) => {}
);

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
}
.el-form-item__label {
  justify-content: flex-start !important;
}
</style>
