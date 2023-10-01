<template>
  <el-select
    v-model="value"
    filterable
    remote
    :multiple="props.multiple"
    collapse-tags
    collapse-tags-tooltip
    reserve-keyword
    :placeholder="label"
    :remote-method="setParams"
    :loading="loading"
    remote-show-suffix
    clearable
    :disabled="props.disabled"
    @change="handleChange"
    :style="wd ? width : style"
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
import { errorHandling } from "../../views/apps/utils/functions";
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
  "data",
  "index",
  "currentItemIndex",
  "currentLength",
  "commission",
]);

const data = ref([]);
const style = reactive({ width: "auto" });
const width = reactive({ width: props.wd });
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
  const data = {
    selected: selected,
    index: props.index,
    currentItemIndex: props.currentItemIndex,
    currentLength: props.currentLength,
    commission: props.commission,
  };
  emit("selected-game", data);
};
const fetchGames = () => {
  loading.value = true;
  ApiService.postTest(`${props.url}`, { [props.keyg]: params.value }, "body")
    .then((res) => {
      loading.value = false;
      data.value = res.data.data[props.type];
    })
    .catch((e) => {
      errorHandling(e.response.data.messages);
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
