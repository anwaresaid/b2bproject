<template>
  <div class="container-user-settings">
    <div class="d-flex flex-column justify-content-between">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleFormRef"
        label-position="top"
        status-icon
        size="large"
        class="form-control d-flex flex-row justify-content-between align-items-center"
      >
        <el-form-item
          label="CURRENT PASSWORD"
          prop="current_password"
          class="form-items-flex"
          required
        >
          <el-input
            v-model="form.current_password"
            class="input-settings"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="NEW PASSWORD"
          prop="password"
          class="form-items-flex"
          required
        >
          <el-input
            v-model="form.password"
            type="password"
            class="input-settings"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="CONFIRM NEW PASSWORD"
          prop="password_confirmation"
          class="form-items-flex"
          required
        >
          <el-input
            v-model="form.password_confirmation"
            type="password"
            class="input-settings"
            autocomplete="off"
          />
        </el-form-item>
        <div class="d-flex justify-content-start">
          <el-button type="primary" @click="confirm(ruleFormRef)">
            Confirm
          </el-button>
        </div>
      </el-form>
      <div
        v-if="errors.length > 0 && typeof errors !== 'string'"
        v-for="error in errors"
        class="text-danger"
      >
        {{ errors }}
      </div>
      <div v-else-if="typeof errors === 'string'">
        {{ errors }}
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
// import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
// import type { Action, UploadInstance } from "element-plus";
// import DropdownRemote from "../../../../components/dropdown/DropdownRemote.vue";
// import { currency } from "../../utils/constants.ts";
// import Email from "./EditEmail.vue";

const errors = ref([]);

const ruleFormRef = ref<FormInstance>();
interface RuleForm {
  password: String;
  current_password: String;
  password_confirmation: String;
}
const token = localStorage.getItem("token");
const email = localStorage.getItem("email");
const form = reactive<RuleForm>({
  current_password: "",
  password: "",
  password_confirmation: "",
});

const rules = reactive<FormRules<typeof form>>({
  password_confirmation: [
    {
      required: true,
      message: "Please enter name",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "Please enter surname",
      trigger: "blur",
    },
  ],
  current_password: [
    {
      required: true,
      message: "Please confirm password",
      trigger: "blur",
    },
  ],
});

const confirm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      const data = { ...form, token: token, email: email };
      ApiService.postTest("users/reset-password", data)
        .then((res) => {
          ElMessageBox.alert(
            "you have updated password successfully!",
            "update password",
            {
              confirmButtonText: "OK",
              callback: (action: Action) => {
                location.reload();
              },
            }
          );
        })
        .catch((e) => {
          console.log("e", e.response.data);
          if (typeof e.response.data.messages !== "string")
            errors.value = Object.values(e.response.data.messages);
          errors.value = e.response.data.messages;
        });
    } else {
      return false;
    }
  });
};
// watch(showFields, (newValue) => {
//   form.name = firstName.value;
//   form.surname = lastName.value;
//   form.email = email.value;
// });
onMounted(() => {});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped>
.title {
  font-weight: 900;
}
.container-user-settings {
  padding-top: 10px;
  padding-bottom: 10px;
}
.input-settings {
  width: 60%;
}
.value {
  font-weight: 900;
  color: grey;
}
.end {
  order: 1;
  width: 100px;
}
.child-update {
  padding-top: 10px;
  padding-bottom: 50px;
  flex: 0%;
}
.form-control {
  flex-wrap: nowrap; /* Set it to the default value */
}
</style>
