<template>
  <el-dialog v-model="setVisible" title="Update Supplier" width="50%">
    <el-form :model="form">
      <el-form-item label="Company name" prop="name" label-width="250px">
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
      <el-form-item label="Balance" label-width="250px">
        <el-input v-model="form.balance" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Spent Balance" label-width="250px">
        <el-input v-model="form.spent_balance" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Remaining Balance" label-width="250px">
        <el-input v-model="form.remaining_balance" autocomplete="off" />
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
      <el-form-item label="Payment Method" label-width="250px">
        <el-input v-model="form.payment_method" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div class="d-flex flex-column">
      <span
        v-if="typeof errors === 'array'"
        v-for="error in errors"
        class="text-danger"
        >-{{ error[0] }}</span
      >
      <span v-else class="text-danger">--{{ errors }}</span>
    </div>
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
    update: { type: Boolean, default: false },
  },
  components: {},
  data() {
    return {
      setVisible: false,
      errors: null,
      name: "something",
      form: {
        name: "",
        address: "",
        vat_number: null,
        company_registration_number: null,
        related_person: null,
        spent_balance: null,
        remaining_balance: null,
        balance: null,
        email: "",
        web_site: "",
        info: "",
        payment_method: "",
      },
    };
  },
  methods: {
    updateSupplier() {
      if (this.update) {
        ApiService.put(`suppliers/${this.selectedIndex}`, this.form).then(
          (res) => {
            this.setVisible = false;
            this.$emit("did-update", true);
          }
        );
      } else {
        this.createSupplier();
      }
    },
    createSupplier() {
      ApiService.post(`suppliers`, this.form)
        .then((res) => {
          this.setVisible = false;
          this.$emit("did-update", true);
        })
        .catch((e) => {
          this.errors = e.response.data.messages;
        });
    },
  },
  mounted() {
    if (this.update) {
      this.form = this.data;
    } else {
      this.form = {};
    }
  },
  watch: {
    isVisible() {
      this.setVisible = this.isVisible;
    },
    setVisible() {
      this.form = {};

      if (this.update) this.form = this.selectedIndex;

      if (this.setVisible === false) {
        this.$emit("visible-change", false);
      }
    },
  },
});
</script>
