<template>
  <el-select
    v-model="value"
    filterable
    remote
    reserve-keyword
    placeholder="Please enter a keyword"
    :remote-method="setParams"
    :loading="loading"
    remote-show-suffix
    @change="handleChange"
    :style="wd ? style : null"
  >
    <el-option
      v-for="item in data"
      :key="item.id"
      :label="item.name"
      :value="item"
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
import ApiService from "@/core/services/ApiService";
const props = defineProps(["url", "type", "keyg", "wd", "returnType"]);

const data = ref([]);
const style = reactive({ width: props.wd });
const params = ref();
const emit = defineEmits();

const value = ref();
const loading = ref([false]);
const setParams = (query: string) => {
  params.value = query;
};
const handleChange = (value) => {
  value.value = value.id;
  if (props.returnType === "object") {
    emit("selected-game", value);
  } else {
    emit("selected-game", value.id);
  }
};
const fetchGames = () => {
  loading.value = true;
  console.log("url", props.keyg);
  ApiService.postTest(
    `${props.url}`,
    { [props.keyg]: params.value },
    "body"
  ).then((res) => {
    loading.value = false;
    data.value = res.data.data[props.type];
  });
};
watch(params, (newValue) => {
  fetchGames();
});
onMounted(() => {});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style>
.select-type {
  width: 215px !important;
}
</style>
