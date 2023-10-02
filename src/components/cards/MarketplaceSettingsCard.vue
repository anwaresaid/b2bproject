<template>
  <!--begin::Card-->
  <div :class="'game-orders-card'">
    <!--begin::Card body-->
    <div class="card-body p-0">
      <!--begin::Heading-->
      <div
        :class="`${
          props.theme === 'dark' ? 'dark-' : 'light-'
        }card card-px pt-3 align-items-center justify-content-center text-white w-100`"
      >
        <div
          class="title-container d-flex align-items-center justify-content-center"
        >
          <h4>{{ props.data?.name }}</h4>
        </div>
        <el-form
          :model="form"
          label-position="top"
          :rules="rules"
          ref="ruleFormRef"
          status-icon
          :size="formSize"
        >
          <el-form-item
            label="Tedarikçi Seçiniz "
            prop="supplier_id"
            label-width="250px"
            required
          >
            <DropdownRemote
              :url="categoriesUrl"
              :default="
                props.data?.supplier?.name ? props.data.supplier.name : null
              "
              @selected-game="setSupplier"
              returnType="object"
              :type="categoriesType"
              :keyg="categoriesKey"
              wd="100%"
            />
          </el-form-item>
          <el-form-item
            label="Müşteri Seçiniz"
            label-width="250px"
            prop="customer_id"
            required
          >
            <DropdownRemote
              :url="publishersUrl"
              @selected-game="setCustomer"
              returnType="object"
              :default="
                props.data?.customer?.name ? props.data.customer.name : null
              "
              :type="publishersType"
              :keyg="categoriesKey"
              wd="100%"
            />
          </el-form-item>
          <el-form-item
            label="Komisyon [Yüzde %]"
            prop="name"
            label-width="250px"
            required
          >
            <input
              type="text"
              class="form-control form-control-solid mb-3 mb-lg-0"
              placeholder="Eneba fixed percent commission"
              id="eneba_percent_commission"
              v-model="form.commission_const"
            />
          </el-form-item>
          <el-form-item
            label="Komisyon [Sabit]"
            prop="name"
            label-width="250px"
            required
          >
            <input
              type="text"
              class="form-control form-control-solid mb-3 mb-lg-0"
              placeholder="Eneba fixed commission"
              id="eneba_percent_commission"
              v-model="form.commission_percent"
            />
          </el-form-item>
        </el-form>
        <el-button type="danger" plain class="mb-5 w-100" @click="submit"
          >Submission</el-button
        >
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
  reactive,
  onMounted,
  onBeforeUnmount,
  defineEmits,
  ref,
  watch,
} from "vue";
import ApiService from "@/core/services/ApiService";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import DropdownRemote from "@/components/dropdown/DropdownRemote.vue";
import { errorHandling } from "@/views/apps/utils/functions";

const props = defineProps(["data", "theme"]);
const categoriesUrl = "suppliers/all";
const categoriesType = "suppliers";
const categoriesKey = "search";
const publishersUrl = "customers/all";
const publishersType = "customers";
const errors = ref(null);

interface RuleForm {
  customer_id: number;
  supplier_id: number;
  commission_const: number;
  commission_percent: number;
}

const form = reactive<RuleForm>({
  customer_id: props.data.customer_id,
  supplier_id: props.data.supplier_id,
  commission_const: props.data.commission_const,
  commission_percent: props.data.commission_percent,
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
const setSupplier = (data) => {
  form.supplier_id = data.id;
};
const setCustomer = (data) => {
  form.customer_id = data.id;
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

const submit = () => {
  //   loading.value = true;
  const data = {
    // marketplace_id: props.data.id,
    customer_id: form.customer_id,
    supplier_id: form.supplier_id,
    commission_percent: form.commission_percent,
    commission_const: form.commission_const,
  };
  ApiService.post("marketplace/updateGeneral", data)
    .then((res) => {})
    .catch((e) => {
      errorHandling(e.response.data.messages);
    });
};

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
onMounted(() => {
  // This code will run when the component is mounted
});
</script>
<style scoped>
.game-orders-card {
  background-color: white;
  border-radius: 10px;
}
.multiplication {
  color: grey;
}
.result {
  font-weight: bold;
  color: purple;
}
.dark-card {
  background-color: #1e1e2d;
}
.title-container {
  background-color: #181c32;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 5px;
  margin-top: 15px;
  margin-bottom: 50px;
}
</style>
