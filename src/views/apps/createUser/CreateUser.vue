<template>
  <div class="card">
    <div class="card-header d-flex justify-content-start border-0 pt-6">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleFormRef"
        status-icon
        :size="formSize"
      >
        <div class="d-flex flex-row">
          <el-form-item label="Name" prop="name" label-width="250px" required>
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item
            label="Surname"
            label-width="250px"
            prop="surname"
            required
          >
            <el-input v-model="form.surname" autocomplete="off" />
          </el-form-item>
        </div>
        <div class="d-flex flex-row">
          <el-form-item label="email" prop="email" label-width="250px" required>
            <el-input v-model="form.email" type="email" autocomplete="off" />
          </el-form-item>
          <el-form-item
            label="Role"
            label-width="250px"
            prop="role_id"
            required
          >
            <el-select
              v-model="form.role_id"
              placeholder="Select"
              style="width: 215px"
            >
              <el-option
                v-for="item in rolesData"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="d-flex flex-row">
          <el-form-item
            label="Password"
            label-width="250px"
            prop="password"
            required
          >
            <el-input
              v-model="form.password"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="Confirm Password"
            label-width="250px"
            prop="password_confirmation"
            required
          >
            <el-input
              v-model="form.password_confirmation"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
        </div>
        <el-form-item label="Avatar URL" label-width="250px" prop="avatar_url">
          <input type="file" class="form-control" v-on:change="onImageChange" />
        </el-form-item>
        <div class="d-flex justify-content-end">
          <el-button type="primary" @click="confirmSubmission(ruleFormRef)">
            Create
          </el-button>
        </div>
      </el-form>
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

interface RuleForm {
  name: string;
  surname: string;
  password: string;
  password_confirmation: string;
  email: string;
  role_id: {};
  avatar_url: string;
}

const formSize = ref("large");
const ruleFormRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();

const form = reactive<RuleForm>({
  name: "",
  surname: "",
  password: "",
  password_confirmation: "",
  email: "",
  role_id: {},
  avatar_url: {},
});

const rolesData = ref([]);

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== form.password) {
    callback(new Error("Your password does not match"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules<typeof form>>({
  name: [
    {
      required: true,
      message: "Please enter first name",
      trigger: "blur",
    },
  ],
  surname: [
    {
      required: true,
      message: "Please enter surname",
      trigger: "change",
    },
  ],
  email: [
    {
      required: true,
      message: "Please select category",
      trigger: "change",
    },
  ],
  role_id: [
    {
      required: true,
      message: "Please select Role",
      trigger: "change",
    },
  ],
  password: [
    {
      required: true,
      message: "Please enter a password",
      trigger: "change",
    },
  ],
  password_confirmation: [{ validator: validatePass, trigger: "blur" }],
});

const fetchRoles = (text) => {
  ApiService.getTest("roles").then((res) => {
    rolesData.value = res.data.data.roles.map((role) => {
      return { text: role.name, value: role.id };
    });
  });
};
const onImageChange = (e) => {
  form.avatar_url = e.target.files[0];
};
function removeEmptyValues(object) {
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var value = object[key];
      if (value === null || value === undefined || value === "") {
        delete object[key];
      } else if (typeof value === "object") {
        if (Object.keys(value).length === 0) {
          delete object[key];
        }
      }
    }
  }
}

const confirmSubmission = (formEl) => {
  removeEmptyValues(form);
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      ApiService.postTest("users/create", form).then((res) => {
        ElMessageBox.alert("New user created successfully !", "user creation", {
          confirmButtonText: "OK",
          callback: (action: Action) => {
            ElMessage({
              type: "info",
              message: `action: ${action}`,
            });
          },
        });
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

watch(uploadRef, (newValue) => {
  if (!newValue) {
    form.avatar_url = newValue;
  }
});
onMounted(() => {
  fetchRoles();
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style>
.roles-select {
  width: 215px !important;
}
</style>
