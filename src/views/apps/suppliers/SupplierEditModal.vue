<template>
  <el-dialog v-model="setVisible" title="Update Supplier" width="50%">
    <el-form :model="form">
      <el-form-item label="Company name" label-width="250px">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Address" label-width="250px">
        <el-input v-model="form.address" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Vat Number" label-width="250px">
        <el-input v-model="form.vat_number" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Company Registration Number" label-width="250px">
        <el-input
          v-model="form.company_registration_number"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="Related Person" label-width="250px">
        <el-input v-model="form.related_person" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Email" label-width="250px">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Web Site" label-width="250px">
        <el-input v-model="form.web_site" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Info" label-width="250px">
        <el-input v-model="form.info" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateSupplier"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ApiService from "@/core/services/ApiService";

export default defineComponent({
  name: "suppliers-update",
  props: {
    isVisible: { type: Boolean, required: true },
    selectedIndex: { type: Number, required: true },
    data: { type: Array, required: true },
  },
  components: {},
  data() {
    return {
      setVisible: false,
      name: "something",
      form: { name: "random" },
    };
  },
  methods: {
    updateSupplier() {
      ApiService.put(`suppliers/${this.selectedIndex}`, this.form).then(
        (res) => {
          this.setVisible = false;
          this.$emit("did-update", true);
        }
      );
    },
  },
  mounted() {
    // this.form = this.data;
  },
  watch: {
    isVisible() {
      this.setVisible = this.isVisible;
    },
    data() {},
    setVisible() {
      this.form = this.data.find((item) => item.id === this.selectedIndex);

      if (this.setVisible === false) {
        this.$emit("visible-change", false);
      }
    },
  },
});
</script>
