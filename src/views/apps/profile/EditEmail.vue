import type { dataType } from 'element-plus/es/components/table-v2/src/common';
import type { error } from 'console'; import type { ErrorTypes } from
'vue-router';
<template>
  <div class="container-user-settings">
    <div class="d-flex flex-column" v-if="showFields === false">
      <div
        class="d-flex flex-row flex-wrap justify-content-between aligh-items- h-100"
      >
        <div class="child-update d-flex flex-column">
          <span class="title">Name</span>
          <span class="value">{{ firstName }}</span>
        </div>
        <div class="child-update d-flex flex-column">
          <span class="title">Surname</span>
          <span class="value">{{ lastName }}</span>
        </div>
        <div class="child-update d-flex flex-column">
          <span class="title">Email Address</span>
          <span class="value">{{ email }}</span>
        </div>
      </div>
      <el-button class="end" type="info" plain @click="showFields = true"
        >Update user</el-button
      >
    </div>
    <div class="d-flex flex-column justify-content-between" v-if="showFields">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleFormRef"
        label-position="top"
        status-icon
        size="large"
        class="form-control d-flex flex-row justify-content-between"
      >
        <el-form-item label="NAME" prop="name" class="form-items-flex" required>
          <el-input
            v-model="form.name"
            class="input-settings"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="SURNAME"
          prop="surname"
          class="form-items-flex"
          required
        >
          <el-input
            v-model="form.surname"
            class="input-settings"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="PASSWORD"
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
          label="CONFIRM PASSWORD"
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
        <el-form-item
          label="EMAIL"
          prop="email"
          class="form-items-flex"
          required
        >
          <el-input
            v-model="form.email"
            type="email"
            class="input-settings"
            autocomplete="off"
          />
        </el-form-item>
        <div class="d-flex justify-content-end w-100">
          <el-button type="primary" @click="showFields = false">
            Cancel
          </el-button>
          <el-button type="primary" @click="confirm(ruleFormRef)">
            Confirm
          </el-button>
        </div>
      </el-form>
      <div v-if="errors.length > 0" v-for="error in errors">
        <span
          class="text-danger"
          v-if="error.length > 0"
          v-for="single in error"
          >{{ single }}</span
        >
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

const email = ref(localStorage.getItem("email"));
const lastName = ref(JSON.parse(localStorage.getItem("user")).name);
const firstName = ref(JSON.parse(localStorage.getItem("user")).surname);
const userId = ref(JSON.parse(localStorage.getItem("user")).id);
const showFields = ref(false);
const errors = ref([]);

const ruleFormRef = ref<FormInstance>();
interface RuleForm {
  email: String;
  password: String;
}

const form = reactive<RuleForm>({
  name: "",
  surname: "",
  email: "",
  password: "",
});

const rules = reactive<FormRules<typeof form>>({
  email: [
    {
      type: "email",
      required: true,
      message: "Please enter valid Email",
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message: "Please enter name",
      trigger: "blur",
    },
  ],
  surname: [
    {
      required: true,
      message: "Please enter surname",
      trigger: "blur",
    },
  ],
  password: [
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
      const data = { ...form, user_id: userId.value };
      ApiService.postTest("users/update", data)
        .then((res) => {
          ElMessageBox.alert(
            "you have updated user successfully!",
            "update user",
            {
              confirmButtonText: "OK",
              callback: (action: Action) => {
                console.log("res", res);
                localStorage.setItem(
                  "user",
                  JSON.stringify(res.data.data.user)
                );
                showFields.value = false;
                location.reload();
              },
            }
          );
        })
        .catch((e) => {
          console.log("e", e.response.data);
          errors.value = Object.values(e.response.data.messages);
        });
    } else {
      return false;
    }
  });
};
watch(showFields, (newValue) => {
  form.name = firstName.value;
  form.surname = lastName.value;
  form.email = email.value;
});
onMounted(() => {
  email.value = localStorage.getItem("email");
  lastName.value = JSON.parse(localStorage.getItem("user")).surname;
  firstName.value = JSON.parse(localStorage.getItem("user")).name;
  userId.value = JSON?.parse(localStorage.getItem("user")).id;
  console.log("data", lastName.value);
});

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
  width: 50%;
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
  flex: 50%;
}
</style>
