<template>
  <!--begin::Card-->
  <div class="game-orders-card">
    <!--begin::Card body-->
    <div class="card-body p-0">
      <!--begin::Heading-->
      <div class="card-px pt-3 align-items-center justify-content-center">
        <h6>{{ name?.value }}</h6>
        <hr />
        <div class="d-flex justify-content-between w-100">
          <div class="multiplication">
            {{ props.item?.quantity || 0 }} * {{ props.item?.sales_price || 0 }}
            {{ currency[props.currency]?.symbol || "$" }}
          </div>
          <div class="result">
            {{ props.item?.quantity * props.item?.sales_price || 0 }}
            {{ currency[props.currency]?.symbol || "$" }}
          </div>
        </div>
        <!--begin::Title-->
        <!--end::Title-->
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
import ApiService from "@/core/services/ApiService";
import PusherService from "@/core/services/PusherService";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import DropdownRemote from "@/components/dropdown/DropdownRemote.vue";
import { currency } from "../../views/apps/utils/constants";
import type { Action } from "element-plus";

const props = defineProps(["item", "name", "currency"]);

interface RuleForm {
  game_id: number;
  quantity: number;
  sales_price: number;
}

const stock = ref("");

const form = reactive<RuleForm>({
  game_id: null,
  quantity: 0,
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
      validator: checkNumber,
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
  form.game_id = value.id;
  stock.value = value.stock;
};
const deleteGame = () => {
  emit("delete-game", props.index);
};

watch(props, (newValue) => {
  console.log("------props", props);
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
onMounted(() => {
  // This code will run when the component is mounted
});
</script>
<style>
.game-orders-card {
  background-color: #f8f5ff !important;
  border-radius: 10px;
}
.multiplication {
  color: grey;
}
.result {
  font-weight: bold;
  color: purple;
}
</style>
