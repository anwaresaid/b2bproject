<template>
  <div class="card">
    <div class="card-header border-0">
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
          placeholder="Search Games"
        />
      </div>
      <div class="d-flex align-items-center w-50">
        <el-select
          v-model="OrderByStock"
          class="select-table-type"
          placeholder="Order By Updated"
        >
          <el-option
            v-for="item in gamesOrderBy"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="d-flex align-items-center position-relative my-1">
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
    </div>
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <!--begin::Search-->
      <!--filters-->
      <div class="d-flex justify-content-between w-100">
        <div class="filterSelect">
          <DropdownRemote
            :url="marketPlaceUrl"
            @selected-game="setMarketPlaceId"
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
            placeholder="Select game status"
            :style="style"
            clearable
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
            :clear="true"
            placeholder="please select publisher"
            :type="publishersType"
            :keyg="categoriesKey"
            wd="200px"
          />
        </div>
        <div class="filterSelect">
          <el-select
            v-model="marketPlaceStatus"
            clearable
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
      <!--begin::Card title-->
      <!--end::Card toolbar-->
    </div>
    <div class="card-body pt-0">
      <Datatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :loading="loading"
        :data="gamesData"
        :header="tableHeader"
        :totalPages="paginationData.last_page"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :pagination="true"
        :size="'small'"
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
                @click="confirmSubmission(slotProps.action)"
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
        <template v-slot:component2="slotProps">
          <slot :action="slotProps.action">
            <el-tag
              class="game-name-link ml-2"
              type="warning"
              @click="navigateGameDetails(slotProps.action?.uuid)"
              >{{ slotProps.action?.name }}</el-tag
            >
          </slot>
        </template>
        <template v-slot:component4="slotProps">
          <slot :action="slotProps.action">
            <div class="d-flex flex-row">
              <img
                v-if="slotProps.action?.match_images?.length > 0"
                v-for="image in slotProps.action?.match_images"
                :src="image.image"
                class="logos-stock"
              />
              <img
                v-if="slotProps.action?.passive_images?.length > 0"
                v-for="image in slotProps.action?.passive_images"
                :src="image.image"
                class="logos-stock opacity-50"
              />
            </div>
          </slot>
        </template>
        <template v-slot:component3="slotProps">
          <slot :action="slotProps.action">
            <span
              v-if="slotProps.action.status.id === '1'"
              :class="`badge py-3 px-4 fs-7 badge-light-success`"
              >{{ slotProps.action.status?.name }}</span
            >
            <span v-else :class="`badge py-3 px-4 fs-7 badge-light-danger`">{{
              slotProps.action.status?.name
            }}</span>
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
import store from "../../../store";
import { errorHandling } from "@/views/apps/utils/functions";

import { useRouter } from "vue-router";

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
      marketPlaceType: "marketplaces",
      categoryCreateVisible: false,
      search: "",
      publisherCreateVisible: false,
      router: useRouter(),
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
      itemsInTable: 50,
      style: { width: "200px" },
      loading: false,
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
      const items = category.map((cat) => cat.id);
      this.filters.categories = items;
      if (
        this.filters.categories.length === 0 ||
        this.filters.categories.length === undefined
      ) {
        delete this.filters["categories"];
      }
    },
    setMarketPlaceId(marketplace) {
      const items = marketplace.map((mp) => mp.id);
      this.filters.marketplaces = items;
      if (
        this.filters.marketplaces.length === 0 ||
        this.filters.marketplaces.length === undefined
      ) {
        delete this.filters["marketplaces"];
      }
    },
    setPublisherId(publishers) {
      const items = publishers.map((pub) => pub.id);
      this.filters.publishers = items;
      if (
        this.filters.publishers.length === 0 ||
        this.filters.publishers.length === undefined
      ) {
        delete this.filters["publishers"];
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
    handleSearch() {
      this.params.search_game = this.search;
      this.fetchData();
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
        ApiService.getTest("publishers", text, 2)
          .then((res) => {
            this.publisherData = res.data.data.publishers;
            store.dispatch(
              "setPageItems",
              res.data.data.pagination.total_items
            );
          })
          .catch((e) => {
            errorHandling(e.response.data.messages);
          });
      } else {
        this.publisherData = [];
      }
    },
    onCategoriesChange(text) {
      if (text !== "") {
        ApiService.getTest("categories")
          .then((res) => {
            this.categoriesData = res.data.data.categories;
            store.dispatch(
              "setPageItems",
              res.data.data.pagination.total_items
            );
          })
          .catch((e) => {
            errorHandling(e.response.data.messages);
          });
      } else {
        this.categoriesData = [];
      }
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
          ApiService.delete(`games/${data.id}`)
            .then((res) => {
              store.dispatch(
                "setPageItems",
                res.data.data.pagination.total_items
              );
            })
            .catch((e) => {
              errorHandling(e.response.data.messages);
            });
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
    navigateGameDetails(id) {
      this.router.push({
        name: "apps-game-detail-listing",
        params: {
          id: id,
        },
      });
    },
    onChange(text) {
      if (text !== "") {
        ApiService.getTest("marketplace", text, 2)
          .then((res) => {
            this.marketPlaceData = res.data.data.marketplaces;
            store.dispatch(
              "setPageItems",
              res.data.data.pagination.total_items
            );
          })
          .catch((e) => {
            errorHandling(e.response.data.messages);
          });
      } else {
        this.marketPlaceData = [];
      }
    },
    handleUpdate(data) {
      this.update = data;
      this.isUpdate = true;
      this.gameCreateVisible = true;
    },
    fetchData() {
      this.loading = true;
      ApiService.post("games/list", this.params)
        .then((res) => {
          this.loading = false;
          this.gamesData = res.data.data.games;
          this.paginationData = res.data.data.pagination;
          store.dispatch("setPageItems", res.data.data.pagination.total_items);
        })
        .catch((e) => {
          errorHandling(e.response.data.messages);
        });
    },
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Game Name",
        custom: "component2",
        sortEnabled: true,
      },
      {
        columnName: "STOCK",
        columnLabel: "stock",
        sortEnabled: true,
      },
      {
        columnName: "SALE PRICE",
        columnLabel: "sale_price",
        sortEnabled: true,
      },
      {
        columnName: "AVERAGE VALUE",
        columnLabel: "average_value",
        sortEnabled: true,
      },
      {
        columnName: "Category Type",
        columnLabel: "category_type.name",
        sortEnabled: true,
      },
      {
        columnName: "Status",
        custom: "component3",
        sortEnabled: true,
      },
      {
        columnName: "MARKETPLACE",
        custom: "component4",
        sortEnabled: true,
      },
      {
        columnName: "Language",
        columnLabel: "language.name",
        sortEnabled: true,
      },
      {
        columnName: "Category",
        columnLabel: "category.name",
        sortEnabled: true,
      },
      {
        columnName: "Publisher",
        columnLabel: "publisher.name",
        sortEnabled: true,
      },
      {
        columnName: "Region",
        columnLabel: "region.name",
        sortEnabled: false,
      },
      {
        columnName: "PROCESS",
        sortEnabled: false,
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
      if (this.marketPlaceStatus === "") {
        delete this.filters["market_place_status"];
      }
    },
    gameStatus() {
      this.filters.game_status = this.gameStatus;
      if (this.gameStatus === "") {
        delete this.filters["game_status"];
      }
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
        if (
          Object.keys(this.filters).some(
            (k) => this.filters[k].length > 0 || this.filters[k] !== ""
          )
        ) {
          ApiService.post("games/list", this.filters).then((res) => {
            this.gamesData = res.data.data.games;
            this.paginationData = res.data.data.pagination;
            store.dispatch(
              "setPageItems",
              res.data.data.pagination.total_items
            );
          });
        } else {
          this.fetchData();
        }
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
  flex-basis: 33.33333%;
}

.card-header {
  display: flex;
  justify-content: space-between;
}
.game-name-link:hover {
  cursor: pointer;
  filter: brightness(120%);
}
</style>
