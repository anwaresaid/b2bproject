<template>
  <div class="top-left card ms-10">
    <div class="card-header border-0 pt-6 mb-5 w-100 d-flex align-items-center">
      <div class="left-card d-flex flex-column align-items-center">
        <div
          class="title-container d-flex align-items-center justify-content-center"
        >
          <h4>{{}} Api Callbacks</h4>
        </div>
        <el-button type="danger" plain class="m-10 w-100" @click="submit"
          >Submit</el-button
        >
      </div>
    </div>
  </div>
  <div class="top-right card ms-10">
    <div class="card-header border-0 pt-6 mb-5 w-100">
      <!--begin::Heading-->
      <div :class="'game-orders-card w-100'">
        <!--begin::Card body-->
        <div class="card-body p-0">
          <!--begin::Heading-->
          <div
            class="card-px pt-3 align-items-center justify-content-center text-white w-100"
          >
            <el-form
              :model="form"
              label-position="top"
              :rules="rules"
              ref="ruleFormRef"
              status-icon
              :size="formSize"
            >
              <el-form-item
                v-for="label in labels"
                :label="label.label"
                :prop="label.key"
                label-width="250px"
                required
              >
                <input
                  type="text"
                  class="form-control form-control-solid mb-3 mb-lg-0"
                  placeholder="Eneba fixed percent commission"
                  id="eneba_percent_commission"
                  v-model="refsInput[label.key]"
                />
              </el-form-item>
              <!-- <el-form-item
                label="Give Callback"
                prop="name"
                label-width="250px"
                required
              >
                <input
                  type="text"
                  class="form-control form-control-solid mb-3 w-100 mb-lg-0"
                  placeholder="Eneba fixed commission"
                  id="eneba_percent_commission"
                  :value="constComission"
                  @input="constComissionFunc"
                />
              </el-form-item>
              <el-form-item
                label="Cancel Callback"
                prop="name"
                label-width="250px"
                required
              >
                <input
                  type="text"
                  class="form-control form-control-solid mb-3 w-100 mb-lg-0"
                  placeholder="Eneba fixed commission"
                  id="eneba_percent_commission"
                  :value="constComission"
                  @input="constComissionFunc"
                />
              </el-form-item>
              <el-form-item
                label="Delivered Callback"
                prop="name"
                label-width="250px"
                required
              >
                <input
                  type="text"
                  class="form-control form-control-solid mb-3 w-100 mb-lg-0"
                  placeholder="Eneba fixed commission"
                  id="eneba_percent_commission"
                  :value="constComission"
                  @input="constComissionFunc"
                />
              </el-form-item>
              <el-form-item
                label="Outofstock Callback"
                prop="name"
                label-width="250px"
                required
              >
                <input
                  type="text"
                  class="form-control form-control-solid mb-3 w-100 mb-lg-0"
                  placeholder="Eneba fixed commission"
                  id="eneba_percent_commission"
                  :value="constComission"
                  @input="constComissionFunc"
                />
              </el-form-item>
              <el-form-item
                label="Returned Callback"
                prop="name"
                label-width="250px"
                required
              >
                <input
                  type="text"
                  class="form-control form-control-solid mb-3 w-100 mb-lg-0"
                  placeholder="Eneba fixed commission"
                  id="eneba_percent_commission"
                  :value="constComission"
                  @input="constComissionFunc"
                />
              </el-form-item> -->
            </el-form>
          </div>
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>
  </div>
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

const props = defineProps(["data"]);
const urlName = ref("");
const filteredData = ref([]);
const labels = ref([]);
const refsInput = ref({});

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

const submit = () => {
  ApiService.post(
    `/marketplace/${urlName.value}/callbacks`,
    refsInput.value
  ).then((res) => {});
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

const capitalizeFirstLetter = (inputString) => {
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
};

// watch(props.currency, (newValue) => {
//   console.log("props", currency[props.currency]);
// });

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
onMounted(() => {
  // This code will run when the component is mounted
  urlName.value = props.data?.name?.toLowerCase();
  const keys = props.data.callback_urls
    ? Object.keys(props.data.callback_urls)
    : null;
  let temp = "";
  keys?.map((item) => {
    refsInput.value[item] = props.data.callback_urls[item];
    temp = item.substring(item.indexOf("_") + 1, item.length);
    const splitString = temp.split("_");
    const stringWithSpaces = splitString.join(" ");
    labels.value.push({
      label: capitalizeFirstLetter(stringWithSpaces),
      key: item,
    });
    filteredData.value[temp] = props.data.callback_urls[item];
    // props.data.callbacks[item]
  });
});
</script>
<style scoped>
.left-card {
  background-color: white;
  border-radius: 10px;
  width: 100% !important;
}
.multiplication {
  color: grey;
}
.result {
  font-weight: bold;
  color: purple;
}
.dark-game-orders-card {
  background-color: #161629;
  border-radius: 10px;
}
.top-left {
  width: 20%;
  align-self: flex-start;
}
.top-right {
  width: 50%;
  margin-right: 26px;
}
.title-container {
  background-color: #181c32;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 5px;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 50px;
}
</style>
