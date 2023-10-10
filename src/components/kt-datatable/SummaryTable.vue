<template>
  <!--begin::Tables widget 16-->
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">{{ title }}</span>

        <span v-if="subTitle" class="text-gray-400 mt-1 fw-semibold fs-6">{{
          subTitle
        }}</span>
      </h3>
      <!--end::Title-->

      <!--begin::Toolbar-->
      <!--end::Toolbar-->
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body overflow-scroll pt-6">
      <!--begin::Nav-->
      <ul class="nav nav-pills nav-pills-custom mb-3">
        <template v-for="(item, i) in items" :key="i">
          <!--begin::Item-->
          <li class="nav-item mb-3 me-3 me-lg-6">
            <!--begin::Link-->
            <a
              class="nav-link btn btn-outline btn-flex btn-color-muted btn-active-color-primary flex-column overflow-hidden w-80px h-85px pt-5 pb-2"
              :class="[i === 0 && 'active']"
              :id="`kt_stats_widget_16_tab_link_${i}`"
              data-bs-toggle="pill"
              :href="`#kt_stats_widget_16_tab_${i}`"
            >
              <!--begin::Icon-->
              <div class="nav-icon mb-3">
                <i :class="`bi bi-${item.icon}`" style="font-size: 25px"></i>
              </div>
              <!--end::Icon-->

              <!--begin::Title-->
              <span class="nav-text text-gray-800 fw-bold fs-6 lh-1">
                {{ item.title }}
              </span>
              <!--end::Title-->

              <!--begin::Bullet-->
              <span
                class="bullet-custom position-absolute bottom-0 w-100 h-4px bg-primary"
              ></span>
              <!--end::Bullet-->
            </a>
            <!--end::Link-->
          </li>
          <!--end::Item-->
        </template>
      </ul>
      <!--end::Nav-->

      <!--begin::Tab Content-->
      <div class="tab-content d-flex">
        <template v-if="navbar" v-for="(item, i) in items" :key="i">
          <!--begin::Tap pane-->
          <div
            class="tab-pane fade"
            :class="[i === 0 && 'active show']"
            :id="`kt_stats_widget_16_tab_${i}`"
          >
            <!--begin::Table container-->
            <div class="table-responsive">
              <!--begin::Table-->
              <table class="table table-row-dashed align-middle gs-0 gy-3 my-0">
                <!--begin::Table head-->
                <thead>
                  <tr class="fs-7 fw-bold text-gray-400 border-bottom-0">
                    <template v-for="(header, j) in headers" :key="j">
                      <th class="p-0 pb-3 min-w-150px text-start">
                        {{ header.columnName }}
                      </th>
                    </template>

                    <!--     <th class="p-0 pb-3 min-w-100px text-end pe-13">CONV.</th>
                    <th class="p-0 pb-3 w-125px text-end pe-7">PROGRESS</th>
                    <th class="p-0 pb-3 w-50px text-end">VIEW</th>
                -->
                  </tr>
                </thead>
                <!--end::Table head-->

                <!--begin::Table body-->
                <tbody>
                  <template v-for="(row, j) in item.table" :key="j">
                    <tr>
                      <td v-for="(item, index) in headers" :key="index">
                        <div class="inside-td d-flex align-items-center">
                          <slot :name="item?.custom" v-bind="row">
                            <div class="inside-td d-flex align-items-center">
                              <span class="text-gray-600 fw-bold fs-6">
                                {{ row[item.columnLabel] }}
                              </span>
                            </div>
                          </slot>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
                <!--end::Table body-->
              </table>
              <!--end::Table-->
            </div>
            <!--end::Table container-->
          </div>
        </template>
        <!--end::Tap pane-->
        <!--begin::Tab Content-->
        <template v-else>
          <!--begin::Tap pane-->
          <div class="tab-pane active show fade">
            <!--begin::Table container-->
            <div class="table-responsive">
              <!--begin::Table-->
              <table class="table table-row-dashed align-middle gs-0 gy-3 my-0">
                <!--begin::Table head-->
                <thead>
                  <tr class="fs-7 fw-bold text-gray-400 border-bottom-0">
                    <template v-for="(header, j) in headers" :key="j">
                      <th class="p-0 pb-3 min-w-150px text-start">
                        {{ header.columnName }}
                      </th>
                    </template>

                    <!--     <th class="p-0 pb-3 min-w-100px text-end pe-13">CONV.</th>
                    <th class="p-0 pb-3 w-125px text-end pe-7">PROGRESS</th>
                    <th class="p-0 pb-3 w-50px text-end">VIEW</th>
                -->
                  </tr>
                </thead>
                <!--end::Table head-->

                <!--begin::Table body-->
                <tbody>
                  <template v-for="(row, d) in data" :key="d">
                    <tr>
                      <td v-for="(item, index) in headers" :key="index">
                        <div class="d-flex align-items-center">
                          <slot :name="item?.custom" v-bind="row">
                            <div class="d-flex align-items-center">
                              <span class="text-gray-600 fw-bold fs-6">
                                {{ row[item.columnLabel] }}
                              </span>
                            </div>
                          </slot>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
                <!--end::Table body-->
              </table>
              <!--end::Table-->
            </div>
            <!--end::Table container-->
          </div>
          <!--end::Tap pane-->
        </template>
      </div>
      <!--end::Tab Content-->
    </div>
    <!--end: Card Body-->
  </div>
  <!--end::Tables widget 16-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dropdown2 from "@/components/dropdown/Dropdown2.vue";

export default defineComponent({
  name: "default-dashboard-widget-7",
  components: {
    Dropdown2,
  },
  props: {
    className: { type: String, required: false },
    navbar: { type: Boolean, required: false },
    title: { type: String, required: false },
    subTitle: { type: String, required: false },
    headers: { type: Array, required: true },
    data: { type: Array, required: false },
    custom: { type: Array, required: false },
    items: { type: Array, required: false },
  },
  setup(items) {
    return {};
  },
  mounted() {},
});
</script>
<style scoped>
.inside-td {
  overflow: hidden;
}
td {
  overflow: hidden;
}
</style>
