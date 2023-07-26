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
            @input="searchItems()"
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
          <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_customers_export_modal"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg src="/media/icons/duotune/arrows/arr078.svg" />
            </span>
            Export
          </button>
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
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="customersData"
        :header="tableHeader"
        :totalPages="paginationData.last_page"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        @on-items-per-page-change="getItemsInTable"
        @page-change="pageChange"
      >
        <template v-slot:name="{ row: customer }">
          {{ customer.name }}
        </template>
        <template v-slot:email="{ row: customer }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            {{ customer.email }}
          </a>
        </template>
        <template v-slot:company="{ row: customer }">
          {{ customer.company_registration_number }}
        </template>
        <template v-slot:paymentMethod="{ row: customer }">
          {{ customer.payment_method }}
        </template>
        <template v-slot:location="{ row: customer }">
          {{ customer.location }}
        </template>
        <template v-slot:vat_number="{ row: customer }">
          {{ customer.vat_number }}
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
      params: {},
      paginationData: {},
    };
  },
  methods: {
    fetchData() {
      ApiService.getTest("customers?search", this.params, 3).then((res) => {
        console.log("res", res);
        this.customersData = res.data.data.customers;
        this.paginationData = res.data.data.pagination;
      });
    },
    getItemsInTable(item) {
      console.log("item", item);
      this.itemsInTable = item;
    },
    pageChange(page) {
      console.log("current page", page);
      this.currentPage = page;
    },
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Customer Name",
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Email",
        columnLabel: "email",
        sortEnabled: true,
        columnWidth: 230,
      },
      {
        columnName: "Company",
        columnLabel: "company",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Payment Method",
        columnLabel: "paymentMethod",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Location",
        columnLabel: "location",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Vat Number",
        columnLabel: "vat_number",
        sortEnabled: true,
        columnWidth: 175,
      },
      // {
      //   columnName: "Actions",
      //   columnLabel: "actions",
      //   sortEnabled: false,
      //   columnWidth: 135,
      // },
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

    const search = ref<string>("");
    const searchItems = () => {
      tableData.value.splice(0, tableData.value.length, ...initCustomers.value);
      if (search.value !== "") {
        let results: Array<ICustomer> = [];
        for (let j = 0; j < tableData.value.length; j++) {
          if (searchingFunc(tableData.value[j], search.value)) {
            results.push(tableData.value[j]);
          }
        }
        tableData.value.splice(0, tableData.value.length, ...results);
      }
    };

    const searchingFunc = (obj: any, value: string): boolean => {
      for (let key in obj) {
        if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
          if (obj[key].indexOf(value) != -1) {
            return true;
          }
        }
      }
      return false;
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
      search,
      searchItems,
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
      console.log("items in table", this.itemsInTable);
      this.params.per_page = this.itemsInTable;
      this.currentPage = 1;
    },
    currentPage() {
      console.log("currentPage---", this.currentPage);
      this.params.current_page = this.currentPage;
    },
    params: {
      handler: function () {
        console.log("params changes");
        this.fetchData();
      },
      deep: true,
    },
  },
});
</script>
