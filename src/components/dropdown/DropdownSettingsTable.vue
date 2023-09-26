<template>
  <el-select
    v-model="selectedItem"
    class="m-2 w-100"
    placeholder="Select"
    size="large"
  >
    <el-option
      v-for="category in categoryType"
      :key="category.id"
      :label="category.label"
      :value="category.id"
    />
  </el-select>
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
import { categoryType } from "../../views/apps/utils/constants";

const selectedItem = ref();
const emit = defineEmits();
const props = defineProps([
  "data",
  "index",
  "currentItemIndex",
  "currentLength",
  "commission",
]);

watch(selectedItem, (newValue) => {
  const data = {
    selected: selectedItem.value,
    index: props.index,
    currentItemIndex: props.currentItemIndex,
    currentLength: props.currentLengtsh,
    commission: props.commission,
  };
  emit("selected-item", data);
});

onMounted(() => {
  if (props.data) {
    selectedItem.value = props.data;
  }
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style scoped>
.el-select .select-trigger .el-input .el-input__wrapper .el-input__suffix {
  display: none;
}
</style>
