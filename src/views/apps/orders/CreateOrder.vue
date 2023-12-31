<template>
  <div class="d-flex flex-row">
    <div class="d-flex flex-wrap justify-content-between w-100">
      <Card
        v-for="(game, index) in form.game"
        :key="game.id"
        title=" some title"
        buttonText="check buttton"
        description="some description"
        :index="index"
        class="me-3 mt-3"
        @delete-game="deleteGame"
        @game-data="setGame"
      />
    </div>
    <div class="d-flex flex-end ms-5 w-75 align-items-start">
      <div class="card card-top position-fixed">
        <div class="card-header border-0 pt-6">
          <div class="card-body pt-0">
            <div class="d-flex flex-column">
              <el-form
                :model="form"
                :rules="rules"
                ref="ruleFormRef"
                class="d-flex flex-column align-items-start"
                status-icon
                :size="formSize"
                label-position="top"
              >
                <el-form-item label="Customer" prop="customer" required>
                  <DropdownRemote
                    :url="customerUrl"
                    @selected-game="setCustomerId"
                    :type="customerType"
                    :keyg="customerKey"
                    returnType="object"
                  />
                </el-form-item>
                <div v-if="form.customer?.email">
                  <h6>Customer's main email address</h6>
                  <ul class="dashed">
                    <li v-if="form.customer?.email" class="mb-3">
                      {{ form.customer.email }}
                    </li>
                  </ul>
                </div>
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
              <div class="game-list" v-if="form.game.length > 0">
                <div v-for="(item, index) in form.game">
                  <div
                    class="game-order-card"
                    v-if="gamesData[index] && gamesData[index] !== ''"
                  >
                    <OrderGamesCard
                      :theme="store2.mode"
                      :item="item"
                      :name="gamesData[index]"
                      :currency="form.currency"
                      class="game-single-card"
                    />
                  </div>
                </div>
              </div>
              <div
                class="submit d-flex align-items-center justify-content-between"
              >
                <el-button type="primary" @click="createOrder(ruleFormRef)"
                  >Submit</el-button
                >
                <div>
                  Games: {{ form.game.length }}<br />
                  Pieces: {{ totalPieces() || 0 }} <br />
                  Total: {{ total || 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-5">
    <el-button type="primary" @click="addGame" link>Add</el-button>
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
import DropdownRemote from "@/components/dropdown/DropdownRemote.vue";
import type { Action } from "element-plus";
import Card from "@/components/cards/Card.vue";
import OrderGamesCard from "@/components/cards/OrderGamesCard.vue";
import { useThemeStore } from "@/stores/theme";
import { currency, gameStatus } from "../utils/constants";
import { ErrorMessage } from "vee-validate";
import { useRouter } from "vue-router";

interface RuleForm {
  customer: object;
  supplier_id: number;
  status: number;
  invoice_no: number;
  currency: number;
  cost: number;
  keys: string;
}

const customerUrl = "customers/all";
const customerKey = "search";
const customerType = "customers";
const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const gamesData = ref([]);
const errors = ref("errors");
const total = ref();
const store2 = useThemeStore();
const router = useRouter();

const form = reactive<RuleForm>({
  customer: null,
  game: [{}],
  currency: null,
});

const emit = defineEmits();

const rules = reactive<FormRules<RuleForm>>({
  customer: [
    {
      required: true,
      message: "Please select game",
      trigger: "blur",
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
const confirmSubmission = () => {
  ElMessageBox.alert("new order created", "Order Creation", {
    confirmButtonText: "OK",
    callback: (action: Action) => {
      router.push({ name: "orders-listing" });
    },
  });
};
const confirmError = (error) => {
  let temp;
  if (typeof error === "object") {
    temp = error[Object.keys(error)[0]];
  } else {
    temp = error;
  }

  ElMessageBox.alert(`${temp}`, "Crder Creation Error", {
    confirmButtonText: "OK",
  });
};

const setCustomerId = (value) => {
  form.customer = value;
};
const deleteGame = (value) => {
  form.game.splice(value, 1);
};
const addGame = () => {
  gamesData.value.push("");
  form.game.push({});
};
const setGame = (value, index, gameName) => {
  gamesData.value[index] = gameName;
  form.game[index] = value;
};

const createOrder = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const data = {
        games: form.game,
        currency: form.currency,
        customer_id: form.customer.id,
      };
      // const data = { ...form, customer_id: form.customer.id };
      ApiService.post("orders/create", data)
        .then((res) => {
          confirmSubmission();
        })
        .catch((e) => {
          confirmError(e.response.data.messages);
        });
    }
  });
};

const totalPieces = () => {
  return form.game.reduce((acc, current) => acc + current.quantity, 0);
};
const totalPrice = () => {
  total.value = form.game?.reduce(
    (acc, current) => acc + current.sales_price * current.quantity,
    0
  );
};

watch(form, (newValue) => {
  totalPrice();
});
onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style>
ul {
  margin: 0;
}
ul.dashed {
  list-style-type: none;
  padding: 0;
  margin-left: 5px;
}
ul.dashed > li {
  text-indent: -5px;
}
ul.dashed > li:before {
  font-weight: bold;
  content: "-  ";
  text-indent: -5px;
}
.game-order-card {
  width: 100%;
  margin-bottom: 10px;
}
.game-list {
  overflow-x: hidden;
  overflow-y: auto;
  height: 200px;
  margin-bottom: auto;
}
.game-single-card {
  height: 90px;
}
.submit {
  margin-top: auto;
}
.card-top {
  height: 60% !important;
}
</style>
