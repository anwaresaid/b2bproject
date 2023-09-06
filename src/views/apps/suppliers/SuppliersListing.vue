<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="d-flex align-items-center position-relative my-1">
        <span class="svg-icon svg-icon-1 position-absolute ms-6">
          <inline-svg src="/media/icons/duotune/general/gen021.svg" />
        </span>
        <input
          type="text"
          v-model="search"
          @input="handleSearch()"
          class="form-control form-control-solid w-250px ps-15"
          placeholder="Search Customers"
        />
      </div>
    </div>
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
import store from "../../../store";

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
      search: "",
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
          columnWidth: 110,
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
          columnWidth: 99,
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
          columnWidth: 100,
        },
        {
          columnName: "INFO",
          columnLabel: "info",
          sortEnabled: false,
          columnWidth: 135,
        },
        {
          columnName: "PROCESS",
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
      ApiService.post("suppliers/all", this.params).then((res) => {
        this.loading = false;
        this.suppliersData = res.data.data.suppliers;
        this.paginationData = res.data.data.pagination;
        store.dispatch("setPageItems", res.data.data.pagination.total_items);
      });
    },
    handleVisibleChange(value) {
      this.visible = value;
    },
    confirmSubmission(data) {
      ElMessageBox.confirm(
        `this action will permanently delete the ${data.name}. Continue?`,
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          ApiService.delete(`suppliers/${data.id}`).then((res) => {});
          ElMessage({
            type: "success",
            message: "Delete completed",
          });
          window.location.reload();
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "Delete canceled",
          });
        });
    },
    handleEdit(item) {
      // this.visible = true;
      // this.selectedIndex = item;
    },
    handleDelete(item) {
      this.confirmSubmission(item);
    },
    refetchData(update) {
      if (update) this.fetchData();
    },
    handleSearch() {
      this.params.search = this.search;
      this.fetchData();
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
