<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card body-->
    <div class="card-body p-0">
      <h3 class="title-card">{{ props.title }}</h3>
      <!--begin::Heading-->
      <div
        class="card-px d-flex flex-column justify-content-center align-items-center w-100"
      >
        <table class="w-75">
          <tr class="headers bg-success text-center">
            <th class="rounded-start">Purchase Total</th>
            <th>Sales Total</th>
            <th class="rounded-end">Profit</th>
          </tr>
          <tr class="body text-center">
            <td class="ps-10">{{ (1 * data.cost).toFixed(2) }} €</td>
            <td>{{ (1 * data.giro).toFixed(2) }} €</td>
            <td>{{ (1 * data.profit).toFixed(2) }} €</td>
          </tr>
        </table>

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
import type { Action } from "element-plus";

const props = defineProps(["title", "data"]);

//   watch(, (newValue) => {
//   });
//   watch(, (newValue) => {
//     if (!newValue) {
//       // emit("create-game", false);
//     }
//   });

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style>
.headers {
  height: 50px !important;
  border-radius: 10px;
  color: white;
  font-size: 15px;
  font-weight: bold;
}
.body {
  font-weight: bold;
  height: 50px;
}
.title-card {
  margin: 3%;
}
td th tr {
  text-align: center;
}
</style>
