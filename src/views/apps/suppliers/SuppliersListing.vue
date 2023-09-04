<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-0">
        <Datatable
          :data="suppliersData"
          :header="tableHeader"
          :totalPages="paginationData.last_page"
          :enable-items-per-page-dropdown="true"
          :checkbox-enabled="true"
          :current-page="currentPage"
          checkbox-label="id"
          @on-items-per-page-change="getItemsInTable"
          @page-change="pageChange"
        >
          <template v-slot:component1="slotProps">
            <slot :action="slotProps.action">
              <el-button
                type="danger"
                icon="Delete"
                circle
                @click="handleDelete(slotProps.action)"
              />
              <el-button
                type="warning"
                icon="Edit"
                circle
                @click="handleEdit(slotProps.action)"
              />
            </slot>
          </template>
        </Datatable>
      </div>
    </div>
  </div>
  <UpdateSupplier
    :isVisible="visible"
    :selectedIndex="selectedIndex"
    :data="suppliersData"
    :loading="loading"
    @visible-change="handleVisibleChange"
    @did-update="refetchData"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ApiService from "@/core/services/ApiService";
import TablePagination from "@/components/kt-datatable/table-partials/table-content/table-footer/TablePagination.vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import UpdateSupplier from "./SupplierEditModal.vue";
import { ElMessage, ElMessageBox } from "element-plus";

export default defineComponent({
  name: "suppliers-listing",
  components: {
    TablePagination,
    Datatable,
    UpdateSupplier,
  },
  data() {
    return {
      visible: false,
      suppliersData: [],
      itemsInTable: 10,
      currentPage: 1,
      params: {},
      paginationData: {},
      total: 0,
      itemsCount: 0,
      selectedIndex: 0,
      loading: false,
      tableHeader: [
        {
          columnName: "COMPANY NAME",
          columnLabel: "name",
          sortEnabled: true,
          columnWidth: 175,
        },
        {
          columnName: "REMAINING BALANCE",
          columnLabel: "remaining_balance",
          sortEnabled: true,
          columnWidth: 230,
        },
        {
          columnName: "ADDRESS",
          columnLabel: "address",
          sortEnabled: true,
          columnWidth: 175,
        },
        {
          columnName: "VAT Number",
          columnLabel: "vat_number",
          sortEnabled: true,
          columnWidth: 175,
        },
        {
          columnName: "COMPANY REGISTRATION NUMBER",
          columnLabel: "company_registration_number",
          sortEnabled: true,
          columnWidth: 100,
        },
        {
          columnName: "RELATED PERSON",
          columnLabel: "related_person",
          sortEnabled: false,
          columnWidth: 135,
        },
        {
          columnName: "WEB SITE",
          columnLabel: "web_site",
          sortEnabled: false,
          columnWidth: 135,
        },
        {
          columnName: "BALANCE",
          columnLabel: "balance",
          sortEnabled: false,
          columnWidth: 135,
        },
        {
          columnName: "INFO",
          columnLabel: "info",
          sortEnabled: false,
          columnWidth: 135,
        },
        {
          columnName: "EDIT",
          columnLabel: "edit",
          sortEnabled: false,
          columnWidth: 135,
          custom: "component1",
        },
      ],
    };
  },
  methods: {
    fetchData() {
      this.loading = true;
      ApiService.postTest("suppliers/all", this.params).then((res) => {
        this.loading = false;
        this.suppliersData = res.data.data.suppliers;
        this.paginationData = res.data.data.pagination;
      });
    },
    handleVisibleChange(value) {
      this.visible = value;
    },
    confirmSubmission(data) {
      ElMessageBox.alert(`${data.name} is deleted`, "supplier delete", {
        confirmButtonText: "OK",
        callback: (action: Action) => {
          ElMessage({
            type: "info",
            message: `action: ${action}`,
          });
          window.location.reload();
        },
      });
    },
    handleEdit(item) {
      // this.visible = true;
      // this.selectedIndex = item;
    },
    handleDelete(item) {
      ApiService.delete(`suppliers/${item.id}`).then((res) => {
        this.confirmSubmission(item);
      });
    },
    refetchData(update) {
      if (update) this.fetchData();
    },
    pageChange(page: number) {
      this.currentPage = page;
    },
    getItemsInTable(item) {
      this.itemsInTable = item;
    },
  },
  mounted() {
    this.params.current_page = this.currentPage;
    this.params.per_page = this.itemsInTable;
    this.fetchData();
  },
  watch: {
    itemsInTable() {
      this.params.per_page = this.itemsInTable;
      this.currentPage = 1;
      this.fetchData();
    },
    currentPage() {
      this.params.current_page = this.currentPage;
      this.fetchData();
    },
    paginationData: {
      handler: function () {
        this.total = this.paginationData.last_page;
        this.itemsCount = this.paginationData.last_page * this.itemsInTable;
      },
      deep: true,
    },
  },
});
</script>
