<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <div class="d-flex flex-column">
          <div class="title py-5">Sign-in Method</div>
          <EditEmail class="py-5 mb-5 email" />
        </div>
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
// import ApiService from "@/core/services/ApiService";
// import type { FormInstance, FormRules } from "element-plus";
// import { ElMessage, ElMessageBox } from "element-plus";
// import type { Action, UploadInstance } from "element-plus";
// import DropdownRemote from "../../../../components/dropdown/DropdownRemote.vue";
// import { currency } from "../../utils/constants.ts";
// import Email from "./EditEmail.vue";
import EditEmail from "./EditEmail.vue";

//   watch(form, (newValue) => {
//     if (form.game_id !== null) {
//       disabled.value = false;
//     }
//   });

onMounted(() => {});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped>
.title {
  font-weight: 900;
  font-size: 20px;
}
.email {
  border-top: 1px solid #eff2f5;
}
</style>
