<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Code">
      <el-input type="number" v-model="form.code" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Login</el-button>
      <el-button type="info" @click="onResend">Resend</el-button>
      <el-button @click="onCancel">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import Swal from "sweetalert2";
import { errorHandling } from "@/views/apps/utils/functions";

export default defineComponent({
  name: "two-factor",
  //   props: ["mail"],
  components: {},

  data() {
    return {
      router: useRouter(),
      form: {
        code: "",
        email: localStorage.getItem("email"),
      },
    };
  },

  methods: {
    onCancel() {
      this.router.push({ name: "sign-in" });
    },
    onResend() {
      ApiService.postTest("users/two-factory-resend", {
        email: this.form.email,
      })
        .then((res) => {
          Swal.fire({
            text: "code was resent successfully!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semobold btn-light-primary",
            },
          });
        })
        .catch((e) => {
          errorHandling(e?.response?.data?.messages);
        });
    },
    onSubmit() {
      ApiService.postTest("users/two-factory", this.form)
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data?.data.user));

          Swal.fire({
            text: "You have successfully logged in!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semobold btn-light-primary",
            },
          }).then((res) => {
            // Go to page after successfully login
            this.router.push({
              name: "dashboard",
            });
          });
        })
        .catch(({ response }) => {
          Swal.fire({
            text: response.data?.message,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Try again!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semobold btn-light-danger",
            },
          });
        });
    },
  },

  // do not use same name with ref
  // const form = reactive({
  //     params: {
  //         email:'',
  //         code:0,
  //     }
  // })
});
</script>
