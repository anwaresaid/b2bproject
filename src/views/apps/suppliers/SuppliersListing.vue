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
          placeholder="Search Suppliers"
        />
      </div>
      <div>
        <el-button @click="createSupplier" type="primary" icon="plus" round
          >add supplier</el-button
        >
      </div>
    </div>
    <div class="card-body pt-0">
      {{ paginationData.last_page }}
      <Datatable
        :data="suppliersData"
        :sortable="false"
        :header="tableHeader"
        :totalPages="paginationData.last_page ? paginationData.last_page : 0"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        :pagination="true"
        :loading="loading"
        :current-page="currentPage"
        checkbox-label="id"
        :itemsPerPage="itemsInTable"
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
    :update="isUpdate"
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
import { errorHandling } from "@/views/apps/utils/functions";

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
      itemsInTable: 50,
      currentPage: 1,
      params: {},
      paginationData: {},
      total: 0,
      itemsCount: 0,
      selectedIndex: 0,
      isUpdate: false,
      loading: false,
      search: "",
      tableHeader: [
        {
          columnName: "COMPANY NAME",
          columnLabel: "name",
          sortEnabled: false,
        },
        {
          columnName: "REMAINING BALANCE",
          columnLabel: "remaining_balance",
          sortEnabled: false,
        },
        {
          columnName: "ADDRESS",
          columnLabel: "address",
          sortEnabled: false,
        },
        {
          columnName: "VAT Number",
          columnLabel: "vat_number",
          sortEnabled: false,
        },
        {
          columnName: "COMPANY REGISTRATION NUMBER",
          columnLabel: "company_registration_number",
          sortEnabled: false,
        },
        {
          columnName: "RELATED PERSON",
          columnLabel: "related_person",
          sortEnabled: false,
        },
        {
          columnName: "WEB SITE",
          columnLabel: "web_site",
          sortEnabled: false,
        },
        {
          columnName: "BALANCE",
          columnLabel: "balance",
          sortEnabled: false,
        },
        {
          columnName: "INFO",
          columnLabel: "info",
          sortEnabled: false,
        },
        {
          columnName: "PROCESS",
          columnLabel: "edit",
          sortEnabled: false,
          custom: "component1",
        },
      ],
    };
  },
  methods: {
    fetchData() {
      this.loading = true;
      ApiService.post("suppliers/all", this.params)
        .then((res) => {
          this.loading = false;
          this.suppliersData = res.data.data.suppliers;
          this.paginationData = res.data.data.pagination;
          store.dispatch("setPageItems", res.data.data.pagination.total_items);
        })
        .catch((e) => {
          errorHandling(e?.response?.data?.messages);
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
          ApiService.delete(`suppliers/${data.id}`).then((res) => {
            this.fetchData();
          });
          ElMessage({
            type: "success",
            message: "Delete completed",
          });
        })
        .catch((e) => {
          errorHandling(e?.response?.data?.messages);
        });
    },
    createSupplier() {
      this.visible = true;
      this.isUpdate = false;
    },
    handleEdit(item) {
      this.visible = true;
      this.isUpdate = true;
      this.selectedIndex = item;
    },
    handleDelete(item) {
      this.confirmSubmission(item);
    },
    refetchData(update) {
      if (update) this.fetchData();
    },
    handleSearch() {
      if (this.search.length !== 0) {
        this.params.search = this.search;
        this.fetchData();
      } else {
        delete this.params.search;
        this.fetchData();
      }
    },
    pageChange(page: number) {
      this.currentPage = page;
    },
    getItemsInTable(item) {
      this.itemsInTable = item;
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
