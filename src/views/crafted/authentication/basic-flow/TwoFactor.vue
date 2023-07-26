<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Activity name">
      <el-input type="number" v-model="form.code" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";

export default defineComponent({
  name: "two-factor",
  props: ["email"],
  components: {},

  data() {
    return {
      router: useRouter(),
      form: {
        email: "",
        code: "",
      },
    };
  },

  methods: {
    onSubmit() {
      console.log("email", this.email);
      ApiService.postTest("users/two-factory", this.form).then((res) => {
        console.log("res2fa", res);
        // const error = Object.values(store.errors);

        // if (error.length === 0) {
        //   Swal.fire({
        //     text: "You have successfully logged in!",
        //     icon: "success",
        //     buttonsStyling: false,
        //     confirmButtonText: "Ok, got it!",
        //     heightAuto: false,
        //     customClass: {
        //       confirmButton: "btn fw-semobold btn-light-primary",
        //     },
        //   }).then(() => {
        //     // Go to page after successfully login
        //     router.push({
        //       name: "two-factor",
        //       params: { email: values.email },
        //     });
        //   });
        // } else {
        //   Swal.fire({
        //     text: error[0] as string,
        //     icon: "error",
        //     buttonsStyling: false,
        //     confirmButtonText: "Try again!",
        //     heightAuto: false,
        //     customClass: {
        //       confirmButton: "btn fw-semobold btn-light-danger",
        //     },
        //   }).then(() => {
        //     store.errors = {};
        //   });
        // }
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
