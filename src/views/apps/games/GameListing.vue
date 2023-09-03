<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <!--begin::Search-->
      <!--filters-->
      <div class="filters">
        <div class="filterSelect">
          <DropdownRemote
            :url="marketPlaceUrl"
            @selected-game="setPublisherId"
            :multiple="true"
            :type="marketPlaceType"
            placeholder="please select marketplace"
            :keyg="categoriesKey"
            wd="220px"
          />
        </div>
        <div class="filterSelect">
          <DropdownRemote
            :url="categoriesUrl"
            @selected-game="setCategoryId"
            :multiple="true"
            :type="categoriesType"
            :keyg="categoriesKey"
            placeholder="please select a category"
            wd="200px"
          />
        </div>
        <div class="filterSelect">
          <el-select
            v-model="gameStatus"
            class="select-type"
            placeholder="Select game status"
          >
            <el-option
              v-for="item in statusGames"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="filterSelect">
          <DropdownRemote
            :url="publishersUrl"
            @selected-game="setPublisherId"
            :multiple="true"
            placeholder="please select publisher"
            :type="publishersType"
            :keyg="categoriesKey"
            wd="200px"
          />
        </div>
        <div class="filterSelect">
          <el-select
            v-model="marketPlaceStatus"
            class="select-type"
            placeholder="Select marketplace status"
          >
            <el-option
              v-for="item in statusMarketPlace"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="add-buttons">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Add game"
          placement="top-start"
        >
          <el-button
            type="danger"
            icon="Football"
            @click="handleCreateGame"
            circle
          />
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Add region"
          placement="top-start"
        >
          <el-button
            type="primary"
            icon="MapLocation"
            @click="regionCreateVisible = true"
            circle
          />
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Add category"
          placement="top-start"
        >
          <el-button
            type="success"
            icon="Grape"
            @click="categoryCreateVisible = true"
            circle
          />
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Add publisher"
          placement="top-start"
        >
          <el-button
            type="warning"
            icon="House"
            @click="publisherCreateVisible = true"
            circle
          />
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Add language"
          placement="top-start"
        >
          <el-button
            type="info"
            icon="Eleme"
            @click="languageCreateVisible = true"
            circle
          />
        </el-tooltip>
      </div>
      <!--begin::Card title-->
      <!--end::Card toolbar-->
    </div>
    <div class="card-body pt-0">
      <Datatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="gamesData"
        :header="tableHeader"
        :totalPages="paginationData.last_page"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :currentPage="currentPage"
        @on-items-per-page-change="getItemsInTable"
        @page-change="pageChange"
      >
        <template v-slot:component1="slotProps">
          <slot :action="slotProps.action">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Delete game"
              placement="top-start"
            >
              <el-button
                type="danger"
                icon="Delete"
                circle
                @click="handleDelete(slotProps.action)"
              />
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Edit game"
              placement="top-start"
            >
              <el-button
                type="warning"
                icon="Edit"
                circle
                @click="handleUpdate(slotProps.action)"
              />
            </el-tooltip>
          </slot>
        </template>
      </Datatable>
    </div>
  </div>
  <CategoryCreate
    :isVisible="categoryCreateVisible"
    @create-category="closeCreateCategory"
  ></CategoryCreate>
  <PublisherCreate
    :isVisible="publisherCreateVisible"
    @create-publisher="closeCreatePublisher"
  >
  </PublisherCreate>
  <RegionCreate
    :isVisible="regionCreateVisible"
    @create-region="closeCreateRegion"
  ></RegionCreate>
  <LanguageCreate
    :isVisible="languageCreateVisible"
    @create-language="closeCreateLanguage"
  ></LanguageCreate>
  <GameCreate
    :isVisible="gameCreateVisible"
    @create-game="closeCreateGame"
    :update="update"
    :isUpdate="isUpdate"
  ></GameCreate>
  <ExportCustomerModal></ExportCustomerModal>
  <AddCustomerModal></AddCustomerModal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, handleError } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ExportCustomerModal from "@/components/modals/forms/ExportCustomerModal.vue";
import AddCustomerModal from "@/components/modals/forms/AddCustomerModal.vue";
import DropdownRemote from "../../../components/dropdown/DropdownRemote.vue";
import ApiService from "@/core/services/ApiService";
import CategoryCreate from "./CategoryCreate.vue";
import RegionCreate from "./RegionCreate.vue";
import LanguageCreate from "./LanguageCreate.vue";
import PublisherCreate from "./PublisherCreate.vue";
import GameCreate from "./GameCreate.vue";
import { MultiListSelect, ModelSelect } from "vue-search-select";
import { ElMessage, ElMessageBox } from "element-plus";

export default defineComponent({
  name: "customers-listing",
  components: {
    Datatable,
    ExportCustomerModal,
    AddCustomerModal,
    CategoryCreate,
    RegionCreate,
    LanguageCreate,
    PublisherCreate,
    GameCreate,
    MultiListSelect,
    ModelSelect,
    DropdownRemote,
  },

  data() {
    return {
      categoriesUrl: "categories/all",
      categoriesType: "categories",
      categoriesKey: "search",
      publishersUrl: "publishers/all",
      publishersType: "publishers",
      marketPlaceUrl: "marketplace/all",
      marketPlaceType: "marketplace",
      categoryCreateVisible: false,
      publisherCreateVisible: false,
      gameCreateVisible: false,
      regionCreateVisible: false,
      languageCreateVisible: false,
      isUpdate: false,
      marketPlaceData: [],
      categories: [],
      publisherData: [],
      searchFilter: [],
      gamesData: [],
      marketPlaceSearch: [],
      publisherSearch: [],
      marketPlaceStatus: "",
      currentPage: 1,
      itemsInTable: 10,
      statusGames: [
        { label: "Passive", value: 2 },
        { label: "Active", value: 1 },
      ],
      statusMarketPlace: [
        { label: "Passive", value: 1 },
        { label: "Active", value: 2 },
      ],
      gameStatus: "",
      params: {},
      paginationData: {},
      filters: {},
      categoriesSearch: [],
      categoriesData: [],
      update: null,
    };
  },

  methods: {
    closeCreateCategory(value) {
      this.categoryCreateVisible = false;
      if (value) {
        this.fetchData();
      }
    },
    setCategoryId(category) {
      this.filters.categories = category;
    },
    setPublisherId(publishers) {
      this.filters.publishers = publishers;
    },
    closeCreatePublisher(value) {
      this.publisherCreateVisible = false;
      if (value) {
        this.fetchData();
      }
    },
    closeCreateRegion(value) {
      this.regionCreateVisible = false;
      if (value) {
        this.fetchData();
      }
    },
    closeCreateLanguage(value) {
      this.languageCreateVisible = false;
      if (value) {
        this.fetchData();
      }
    },
    getItemsInTable(item) {
      this.itemsInTable = item;
    },
    pageChange(page) {
      this.currentPage = page;
    },
    closeCreateGame(value) {
      this.gameCreateVisible = false;
      if (value) {
        this.fetchData();
      }
    },
    handleCreateGame() {
      this.gameCreateVisible = true;
      this.isUpdate = false;
    },
    onSelect(items, lastSelectedItem, check) {
      this.marketPlaceSearch = items;
    },
    onSelectPublisher(publisher) {
      this.publisherSearch = publisher;
    },
    onPublisherChange(text) {
      if (text !== "") {
        ApiService.getTest("publishers", text, 2).then((res) => {
          this.publisherData = res.data.data.publishers;
        });
      } else {
        this.publisherData = [];
      }
    },
    onCategoriesChange(text) {
      if (text !== "") {
        ApiService.getTest("categories").then((res) => {
          this.categoriesData = res.data.data.categories;
        });
      } else {
        this.categoriesData = [];
      }
    },
    confirmSubmission(data) {
      ElMessageBox.alert(`${data.name} is deleted`, "game delete", {
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
    onChange(text) {
      if (text !== "") {
        ApiService.getTest("marketplace", text, 2).then((res) => {
          this.marketPlaceData = res.data.data.marketplaces;
        });
      } else {
        this.marketPlaceData = [];
      }
    },
    handleDelete(data) {
      console.log("data", data);
      ApiService.delete(`games/${data.id}`).then((res) => {
        console.log("then");
        this.confirmSubmission(data);
      });
    },
    handleUpdate(data) {
      this.update = data;
      this.isUpdate = true;
      this.gameCreateVisible = true;
    },
    fetchData() {
      ApiService.postTest("games/list", this.params, 3).then((res) => {
        this.gamesData = res.data.data.games;
        this.paginationData = res.data.data.pagination;
      });
    },
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Game Name",
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Category Type",
        columnLabel: "category_type.name",
        sortEnabled: true,
        columnWidth: 230,
      },
      {
        columnName: "Status",
        columnLabel: "status.name",
        sortEnabled: true,
        columnWidth: 230,
      },
      {
        columnName: "Language",
        columnLabel: "language.name",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Category",
        columnLabel: "category.name",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Publisher",
        columnLabel: "publisher.name",
        sortEnabled: true,
        columnWidth: 225,
      },
      {
        columnName: "Region",
        columnLabel: "region.name",
        sortEnabled: false,
        columnWidth: 135,
      },
      {
        columnName: "Edit",
        sortEnabled: false,
        columnWidth: 135,
        custom: "component1",
      },
    ]);

    return {
      tableHeader,
    };
  },
  mounted() {
    this.fetchData();
  },

  watch: {
    itemsInTable() {
      this.params.per_page = this.itemsInTable;
      this.currentPage = 1;
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
    searchFilter() {},
    marketPlaceStatus() {
      this.filters.market_place_status = this.marketPlaceStatus;
    },
    gameStatus() {
      this.filters.game_status = this.gameStatus;
    },
    publisherSearch() {
      let temp = [0];
      temp.push(this.publisherSearch.map((item) => item.id));
      this.filters.publishers = temp;
      this.filters.publishers.splice(0, 1);
    },
    marketPlaceSearch() {
      let temp = [0];
      temp.push(this.marketPlaceSearch.map((item) => item.id));
      this.filters.marketPlaces = temp;
      this.filters.marketPlaces.splice(0, 1);
    },
    filters: {
      handler: function () {
        ApiService.postTest("games/list", this.filters).then((res) => {
          this.gamesData = res.data.data.games;
        });
      },
      deep: true,
    },
  },
});
</script>
<style>
.card-title {
  display: flex;
  justify-content: space-between;
}
.filterSelect {
  min-width: 200px;
}
.filters {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
</style>
