<template>
  <div></div>
  <el-select
    v-model="value"
    filterable
    remote
    :multiple="props.multiple"
    :collapse-tags="props.multiple"
    :collapse-tags-tooltip="props.multiple"
    reserve-keyword
    :placeholder="label"
    :remote-method="setParams"
    :loading="loading"
    remote-show-suffix
    :disabled="props.disabled"
    @change="handleChange"
    :style="wd ? style : null"
    value-key="id"
  >
    <el-option
      v-if="props.multiple"
      v-for="item in data"
      :key="item.id"
      :label="item.name"
      :value="item"
    />
    <el-option
      v-else
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
const props = defineProps([
  "url",
  "type",
  "keyg",
  "wd",
  "returnType",
  "condition",
  "multiple",
  "placeholder",
  "default",
  "disabled",
]);

const data = ref([]);
const style = reactive({ width: props.wd });
const params = ref();
const emit = defineEmits();
const label = ref("Please enter a keyword");
const selectedObject = ref({});
const value = ref(null);
const loading = ref([false]);
const setParams = (query: string) => {
  params.value = query;
};
const handleChange = (selected) => {
  if (props.returnType === "object" || props.multiple) {
    emit("selected-game", selected);
  } else {
    emit("selected-game", selected.id);
  }
};
const fetchGames = () => {
  loading.value = true;
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
  if (props.condition) {
    if (params.value?.length >= props.condition) fetchGames();
  } else {
    fetchGames();
  }
});
watch(value, (newValue) => {});
onMounted(() => {
  if (props.placeholder) {
    label.value = props.placeholder;
  }
  if (props.default) {
    value.value = props.default;
  }
});

onBeforeUnmount(() => {
  // Cleanup or perform actions before component unmounts
});
</script>
<style>
.select-type {
  width: 215px !important;
}
</style>
