<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <!--begin::Search-->
      <div>
        <!-- <label class="form-label fw-semobold d-flex justify-content-center"
          >Games</label
        >
        <div class="d-flex align-items-center position-relative my-1">
          <span class="svg-icon svg-icon-1 position-absolute ms-6">
            <inline-svg src="/media/icons/duotune/general/gen021.svg" />
          </span>
          <input
            type="text"
            v-model="searchFilter"
            class="form-control form-control-solid w-250px ps-15"
            placeholder="Search Games"
          />
        </div> -->
      </div>
      <!--filters-->
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
        <!-- <select
          class="form-select form-select-solid select2-hidden-accessible"
          v-model="marketPlaceSearch"
        >
          <option
            v-for="item in marketPlaceData"
            :label="item.name"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select> -->
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
        <!-- <label class="form-label fw-semobold d-flex justify-content-center"
          >Market Place Status</label
        >
        <select
          class="form-select form-select-solid select2-hidden-accessible"
          v-model="marketPlaceStatus"
        >
          <option
            v-for="item in status"
            :label="item"
            :key="status.indexOf(item)"
            :value="status.indexOf(item)"
          >
            {{ item }}
          </option>
        </select> -->
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
        <!-- <select
          class="form-select form-select-solid select2-hidden-accessible"
          v-model="publisherSearch"
        >
          <option
            v-for="item in publisherData"
            :label="item.name"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option> -->
        <!-- </select> -->
      </div>
      <div class="filterSelect">
        <!-- <label class="form-label fw-semobold d-flex justify-content-center"
          >Publishers Status</label
        >
        <select
          class="form-select form-select-solid select2-hidden-accessible"
          v-model="gameStatus"
        >
          <option
            v-for="item in status"
            :label="item"
            :key="status.indexOf(item)"
            :value="status.indexOf(item)"
          >
            {{ item }}
          </option>
        </select> -->
        <!--end::Search-->
        <model-select
          :options="statusMarketPlace"
          v-model="marketPlaceStatus"
          placeholder="Select Market placee status"
        >
        </model-select>
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
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :currentPage="currentPage"
      >
        <template v-slot:name="{ row: game }">
          {{ game.name }}
        </template>
        <template v-slot:categorytype="{ row: game }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            {{ game.category_type }}
          </a>
        </template>
        <template v-slot:languagename="{ row: game }">
          {{ game.language.name }}
        </template>
        <template v-slot:status="{ row: game }">
          {{ game.status }}
        </template>
        <template v-slot:categoryname="{ row: game }">
          {{ game.category.name }}
        </template>
        <template v-slot:publishername="{ row: game }">
          {{ game.publisher.name }}
        </template>
        <template v-slot:regionname="{ row: game }">
          {{ game.region.name }}
        </template>
      </Datatable>
    </div>
  </div>

  <ExportCustomerModal></ExportCustomerModal>
  <AddCustomerModal></AddCustomerModal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, handleError } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ExportCustomerModal from "@/components/modals/forms/ExportCustomerModal.vue";
import AddCustomerModal from "@/components/modals/forms/AddCustomerModal.vue";
import ApiService from "@/core/services/ApiService";
import { MultiListSelect, ModelSelect } from "vue-search-select";

export default defineComponent({
  name: "customers-listing",
  components: {
    Datatable,
    ExportCustomerModal,
    AddCustomerModal,
    MultiListSelect,
    ModelSelect,
  },

  data() {
    return {
      marketPlaceData: [],
      publisherData: [],
      searchFilter: [],
      gamesData: [],
      marketPlaceSearch: [],
      publisherSearch: [],
      marketPlaceStatus: "",
      currentPage: 1,
      statusGames: [
        { text: "Passive", value: 2 },
        { text: "Active", value: 1 },
      ],
      statusMarketPlace: [
        { text: "Passive", value: 1 },
        { text: "Active", value: 2 },
      ],
      gameStatus: "",
      filters: {},
      categoriesSearch: [],
      categoriesData: [],
    };
  },

  methods: {
    onSelect(items, lastSelectedItem, check) {
      // console.log("selected ", items);
      // console.log("last selected item ", lastSelectedItem);

      // if (
      //   this.marketPlaceSearch.some(
      //     (element) => element.id === lastSelectedItem.id
      //   )
      // ) {
      //   console.log("true");
      //   this.marketPlaceSearch.splice(
      //     this.marketPlaceSearch.findIndex(
      //       (item) => item.id === lastSelectedItem.id
      //     ),
      //     1
      //   );
      // } else {
      //   this.marketPlaceSearch.push(lastSelectedItem);
      // }
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
      ApiService.postTest("games/all").then((res) => {
        this.gamesData = res.data.data.games;
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
        columnLabel: "categorytype",
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
        columnLabel: "languagename",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Category",
        columnLabel: "categoryname",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Publisher",
        columnLabel: "publishername",
        sortEnabled: true,
        columnWidth: 225,
      },
      {
        columnName: "Region",
        columnLabel: "regionname",
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
.card-header {
  display: flex;
  justify-content: space-between;
}
</style>
