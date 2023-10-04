<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card body-->
    <div class="card-body p-0">
      <div class="d-flex justify-content-center mt-4">
        <el-button type="danger" @click="deleteGame" class="w-75 px-2" plain
          >Delete</el-button
        >
      </div>

      <!--begin::Heading-->
      <div class="card-px d-flex justify-content-center">
        <!--begin::Title-->
        <!--end::Title-->
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleFormRef"
          class="d-flex flex-column align-items-start"
          status-icon
          :size="formSize"
          label-position="top"
        >
          <el-form-item label="Game" prop="game_id" required>
            <DropdownRemote
              :url="gameUrl"
              @selected-game="setGameId"
              :type="gameType"
              :keyg="gameKey"
              returnType="object"
            />
          </el-form-item>
          <div class="w-100 d-flex justify-content-end">
            <h6 class="me-1">stock:</h6>
            <div>
              {{ stock }}
            </div>
          </div>
          <el-form-item label="Piece" prop="quantity" required>
            <el-input v-model.number="form.quantity" autocomplete="off" />
          </el-form-item>
          <el-form-item
            label="Sales Price"
            label-width="250px"
            prop="sales_price"
            required
          >
            <el-input
              :model-value="form.sales_price"
              @input="handleInput"
              type="text"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<!-- <script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "modal-card",
  props: {
    form: Object,
    description: String,
    buttonText: String,
    image: String,
    modalId: String,
  },
  components: {},
});
</script> -->
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
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import DropdownRemote from "@/components/dropdown/DropdownRemote.vue";
import type { Action } from "element-plus";
import { beautifyNumber } from "@/views/apps/utils/functions";

const props = defineProps(["index"]);

interface RuleForm {
  game_id: number;
  quantity: number;
  sales_price: number;
}

const gameUrl = "games/list";
const gameKey = "search_game";

const gameType = "games";
const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const message = ref("");
const stock = ref("");
const gameName = ref("");

const form = reactive<RuleForm>({
  game_id: null,
  quantity: null,
  sales_price: null,
});

const emit = defineEmits();

const checkNumber = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("Please add input"));
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error("Please input digits"));
    } else {
      callback();
    }
  }, 0);
};

const rules = reactive<FormRules<RuleForm>>({
  game_id: [
    {
      required: true,
      message: "Please select game",
      trigger: "blur",
    },
  ],
  quantity: [
    {
      required: true,
      trigger: "blur",
      validator: checkNumber,
    },
  ],

  sales_price: [
    {
      required: true,
      trigger: "blur",
    },
  ],
});
const handleInput = (num) => {
  form.sales_price = beautifyNumber(num);
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
    },
  });
};

const setGameId = (value) => {
  form.game_id = value.id;
  stock.value = value.stock;
  gameName.value = value.name;
};
const deleteGame = () => {
  emit("delete-game", props.index);
};

watch(form, (newValue) => {
  emit("game-data", form, props.index, gameName);
});
watch(message, (newValue) => {
  if (!newValue) {
    // emit("create-game", false);
  }
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
