<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
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
        <!--end::Search-->
      </div>
      <!--begin::Card title-->
      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-customer-table-toolbar="base"
        >
          <!--begin::Export-->
          <!-- <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_customers_export_modal"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg src="/media/icons/duotune/arrows/arr078.svg" />
            </span>
            Export
          </button> -->
          <!--end::Export-->
          <!--begin::Add customer-->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_customer"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg src="/media/icons/duotune/arrows/arr075.svg" />
            </span>
            Add Customer
          </button>
          <!--end::Add customer-->
        </div>
        <!--end::Toolbar-->
        <!--begin::Group actions-->
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewCustomers()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
        <!--begin::Group actions-->
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-customer-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-customer-table-select="delete_selected"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <div class="card-body pt-0">
      <Datatable
        :sortable="false"
        @on-items-select="onItemSelect"
        :data="customersData"
        :header="tableHeader"
        :loading="loading"
        :pagination="true"
        :totalPages="paginationData.last_page"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        :itemsPerPage="itemsInTable"
        checkbox-label="id"
        @on-items-per-page-change="getItemsInTable"
        @page-change="pageChange"
      >
        <template v-slot:component2="slotProps">
          <slot :action="slotProps.action">
            <el-checkbox
              class="font-weight-bold ms-5"
              :checked="slotProps.action.is_verify"
              @change="(e) => handleCheckbox(e, slotProps.action.id)"
            />
          </slot>
        </template>
      </Datatable>
    </div>
  </div>

  <ExportCustomerModal></ExportCustomerModal>
  <AddCustomerModal></AddCustomerModal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable//table-partials/models";
import ExportCustomerModal from "@/components/modals/forms/ExportCustomerModal.vue";
import AddCustomerModal from "@/components/modals/forms/AddCustomerModal.vue";
import customers from "@/core/data/customers";
import type { ICustomer } from "@/core/data/customers";
import arraySort from "array-sort";
import ApiService from "@/core/services/ApiService";
import store from "../../../store";
import { errorHandling } from "@/views/apps/utils/functions";

export default defineComponent({
  name: "customers-listing",
  components: {
    Datatable,
    ExportCustomerModal,
    AddCustomerModal,
  },
  data() {
    return {
      customersData: [],
      itemsInTable: 10,
      currentPage: 1,
      verified: {},
      params: {
        search: "",
        per_page: 0,
        current_page: 0,
      },
      loading: false,
      paginationData: {
        last_page: 0,
      },
      search: "",
    };
  },
  methods: {
    fetchData() {
      this.loading = true;
      ApiService.postTest("customers/all", this.params)
        .then((res) => {
          this.loading = false;
          this.customersData = res.data.data?.customers;
          this.paginationData = res.data.data?.pagination;
          store.dispatch("setPageItems", res.data.data.pagination?.total_items);
        })
        .catch((e) => {
          errorHandling(e.response.data.messages);
        });
    },
    getItemsInTable(item) {
      this.itemsInTable = item;
    },
    pageChange(page) {
      this.currentPage = page;
    },
    handleCheckbox(e, id) {
      ApiService.postTest("customers/verify", { customer_id: id, verify: e })
        .then((res) => {})
        .catch((e) => {
          errorHandling(e.response.data.messages);
        });
    },
    handleSearch() {
      if (this.search.length !== 0) {
        this.params.search = this.search;
      } else {
        this.fetchData();
      }
    },
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Customer Name",
        columnLabel: "name",
        sortEnabled: false,
      },
      {
        columnName: "Email",
        columnLabel: "email",
        sortEnabled: false,
      },
      {
        columnName: "Company",
        columnLabel: "company_registration_number",
        sortEnabled: false,
      },
      {
        columnName: "Payment Method",
        columnLabel: "payment_method",
        sortEnabled: false,
      },
      {
        columnName: "Location",
        columnLabel: "location",
        sortEnabled: false,
      },
      {
        columnName: "Vat Number",
        columnLabel: "vat_number",
        sortEnabled: false,
      },
      {
        columnName: "verified",
        custom: "component2",
        sortEnabled: false,
      },
    ]);
    const selectedIds = ref<Array<number>>([]);

    const tableData = ref<Array<ICustomer>>(customers);
    const initCustomers = ref<Array<ICustomer>>([]);

    onMounted(() => {
      initCustomers.value.splice(0, tableData.value.length, ...tableData.value);
    });

    const deleteFewCustomers = () => {
      selectedIds.value.forEach((item) => {
        deleteCustomer(item);
      });
      selectedIds.value.length = 0;
    };

    const deleteCustomer = (id: number) => {
      for (let i = 0; i < tableData.value.length; i++) {
        if (tableData.value[i].id === id) {
          tableData.value.splice(i, 1);
        }
      }
    };

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(tableData.value, sort.label, { reverse });
      }
    };
    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    return {
      tableData,
      tableHeader,
      deleteCustomer,
      selectedIds,
      deleteFewCustomers,
      sort,
      onItemSelect,
    };
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
    },
    // verified() {
    //   console.log("changed");
    // },
    verified: {
      handler: function () {
        console.log("changed");
      },
      deep: true,
    },
    currentPage() {
      this.params.current_page = this.currentPage;
    },
    params: {
      handler: function () {
        this.fetchData();
      },
      deep: true,
    },
  },
});
</script>
