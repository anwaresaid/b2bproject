<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <!--begin::Search-->
      <!--filters-->
      <div class="filters">
        <div class="filterSelect">
          <multi-list-select
            :list="marketPlaceData"
            :selectedItems="marketPlaceSearch"
            optionValue="id"
            optionText="name"
            placeholder="Select Market Place"
            @select="onSelect"
            @searchchange="onChange"
          >
          </multi-list-select>
        </div>
        <div class="filterSelect">
          <multi-list-select
            :list="categoriesData"
            :selectedItems="categoriesSearch"
            optionValue="id"
            optionText="name"
            placeholder="Select Categories"
            @select="onSelectCategories"
            @searchchange="onCategoriesChange"
          >
          </multi-list-select>
        </div>
        <div class="filterSelect">
          <model-select
            :options="statusGames"
            v-model="gameStatus"
            placeholder="Select game status"
          >
          </model-select>
        </div>
        <div class="filterSelect">
          <multi-list-select
            :list="publisherData"
            :selectedItems="publisherSearch"
            optionValue="id"
            optionText="name"
            placeholder="Select Publisher"
            @select="onSelectPublisher"
            @searchchange="onPublisherChange"
          >
          </multi-list-select>
        </div>
        <div class="filterSelect">
          <model-select
            :options="statusMarketPlace"
            v-model="marketPlaceStatus"
            placeholder="Select Market placee status"
          >
          </model-select>
        </div>
      </div>
      <div class="add-buttons">
        <el-button
          type="danger"
          icon="Football"
          @click="gameCreateVisible = true"
          circle
        />
        <el-button
          type="primary"
          icon="MapLocation"
          @click="regionCreateVisible = true"
          circle
        />
        <el-button
          type="success"
          icon="Grape"
          @click="categoryCreateVisible = true"
          circle
        />
        <el-button
          type="warning"
          icon="House"
          @click="publisherCreateVisible = true"
          circle
        />
        <el-button
          type="info"
          icon="Eleme"
          @click="languageCreateVisible = true"
          circle
        />
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
  ></GameCreate>
  <ExportCustomerModal></ExportCustomerModal>
  <AddCustomerModal></AddCustomerModal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, handleError } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ExportCustomerModal from "@/components/modals/forms/ExportCustomerModal.vue";
import AddCustomerModal from "@/components/modals/forms/AddCustomerModal.vue";
import ApiService from "@/core/services/ApiService";
import CategoryCreate from "./CategoryCreate.vue";
import RegionCreate from "./RegionCreate.vue";
import LanguageCreate from "./LanguageCreate.vue";
import PublisherCreate from "./PublisherCreate.vue";
import GameCreate from "./GameCreate.vue";
import { MultiListSelect, ModelSelect } from "vue-search-select";

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
  },

  data() {
    return {
      categoryCreateVisible: false,
      publisherCreateVisible: false,
      gameCreateVisible: false,
      regionCreateVisible: false,
      languageCreateVisible: false,
      marketPlaceData: [],
      publisherData: [],
      searchFilter: [],
      gamesData: [],
      marketPlaceSearch: [],
      publisherSearch: [],
      marketPlaceStatus: "",
      currentPage: 1,
      itemsInTable: 10,
      statusGames: [
        { text: "Passive", value: 2 },
        { text: "Active", value: 1 },
      ],
      statusMarketPlace: [
        { text: "Passive", value: 1 },
        { text: "Active", value: 2 },
      ],
      gameStatus: "",
      params: {},
      paginationData: {},
      filters: {},
      categoriesSearch: [],
      categoriesData: [],
    };
  },

  methods: {
    closeCreateCategory(value) {
      this.categoryCreateVisible = false;
      if (value) {
        this.fetchData();
      }
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
    onSelect(items, lastSelectedItem, check) {
      this.marketPlaceSearch = items;
    },
    onSelectPublisher(publisher) {
      this.publisherSearch = publisher;
    },
    onSelectCategories(publisher) {
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
    onChange(text) {
      if (text !== "") {
        ApiService.getTest("marketplace", text, 2).then((res) => {
          this.marketPlaceData = res.data.data.marketplaces;
        });
      } else {
        this.marketPlaceData = [];
      }
    },
    fetchData() {
      ApiService.postTest("games/all", this.params, 3).then((res) => {
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
        columnLabel: "category_type",
        sortEnabled: true,
        columnWidth: 230,
      },
      {
        columnName: "Status",
        columnLabel: "status",
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
    ]);

    // const sort = (sort: Sort) => {
    //   const reverse: boolean = sort.order === "asc";
    //   if (sort.label) {
    //     arraySort(tableData.value, sort.label, { reverse });
    //   }
    // };
    // const onItemSelect = (selectedItems: Array<number>) => {
    //   selectedIds.value = selectedItems;
    // };

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
    categoriesSearch() {
      this.filters.categories = this.categoriesSearch;
    },
    filters: {
      handler: function () {
        ApiService.postTest("games/all", this.filters, "body").then((res) => {
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
