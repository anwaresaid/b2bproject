<template>
  <el-dialog v-model="setVisible" title="Category Create" width="30%">
    <el-form>
      <el-form-item label="Category Name">
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
      ApiService.post(`categories`, { name: this.name })
        .then((res) => {
          this.setVisible = false;
          this.$emit("create-category", true);
        })
        .catch((e) => {
          errorHandling(e.response.data.messages);
        });
    },
  },
  watch: {
    isVisible() {
      this.setVisible = this.isVisible;
    },
    setVisible() {
      if (this.setVisible === false) {
        this.$emit("create-category", false);
      }
    },
  },
});
</script>
