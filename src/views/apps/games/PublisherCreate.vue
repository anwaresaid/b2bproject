<template>
  <el-dialog v-model="setVisible" title="Publisher Create" width="30%">
    <el-form>
      <el-form-item label="Publisher Name">
        <el-input v-model="name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setVisible = false">Cancel</el-button>
        <el-button type="primary" @click="createPublisher"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ApiService from "@/core/services/ApiService";
import { errorHandling } from "@/views/apps/utils/functions";

export default defineComponent({
  name: "publisher-create",
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
    createPublisher() {
      ApiService.post(`publishers`, { name: this.name })
        .then((res) => {
          this.setVisible = false;
          this.$emit("create-publisher", true);
        })
        .catch((e) => {
          errorHandling(e?.response?.data?.messages);
        });
    },
  },
  watch: {
    isVisible() {
      this.setVisible = this.isVisible;
    },
    setVisible() {
      if (this.setVisible === false) {
        this.$emit("create-publisher", false);
      }
    },
  },
});
</script>
