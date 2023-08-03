<template>
  <el-dialog v-model="setVisible" title="Language Create" width="30%">
    <el-form :model="name">
      <el-form-item label="Language Name">
        <el-input v-model="name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setVisible = false">Cancel</el-button>
        <el-button type="primary" @click="createCategory"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ApiService from "@/core/services/ApiService";

export default defineComponent({
  name: "category-create",
  props: {
    isVisible: { type: Boolean, required: true },
  },
  components: {},
  data() {
    return {
      setVisible: false,
      name: "",
    };
  },
  methods: {
    createCategory() {
      ApiService.post(`languages`, { name: this.name }).then((res) => {
        this.setVisible = false;
        this.$emit("create-language", true);
      });
    },
  },
  watch: {
    isVisible() {
      this.setVisible = this.isVisible;
    },
    setVisible() {
      if (this.setVisible === false) {
        this.$emit("create-language", false);
      }
    },
  },
});
</script>
