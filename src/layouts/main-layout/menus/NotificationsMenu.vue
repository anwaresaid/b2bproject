<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px"
    data-kt-menu="true"
  >
    <!--begin::Heading-->
    <div
      class="d-flex flex-column bgi-no-repeat rounded-top"
      style="background-image: url('/media/misc/menu-header-bg.jpg')"
    >
      <!--begin::Title-->
      <h3 class="text-white fw-semobold px-9 mt-10 mb-6">
        Notifications <span class="fs-8 opacity-75 ps-3">24 reports</span>
      </h3>
      <!--end::Title-->

      <!--begin::Tabs-->
      <ul
        class="nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-semobold px-9"
      >
        <li class="nav-item">
          <a
            class="nav-link text-white opacity-75 opacity-state-100 pb-4"
            data-bs-toggle="tab"
            href="#kt_topbar_notifications_1"
            >Alerts</a
          >
        </li>
      </ul>
      <!--end::Tabs-->
    </div>
    <!--end::Heading-->

    <!--begin::Tab content-->
    <div class="tab-content">
      <!--begin::Tab panel-->
      <div
        class="tab-pane fade show active"
        id="kt_topbar_notifications_1"
        role="tabpanel"
      >
        <!--begin::Items-->
        <div class="scroll-y mh-325px my-5 px-8">
          <div v-if="message.length === 0">
            <div class="d-flex align-items-center justify-content-center">
              <div class="text-primary" role="status">
                <span>No Notifications</span>
              </div>
            </div>
          </div>
          <div v-else>
            <template v-for="(item, index) in message" :key="index">
              <!--begin::Item-->
              <div class="d-flex flex-stack py-4">
                <!--begin::Section-->
                <div class="d-flex align-items-center rounded">
                  <!--begin::Symbol-->
                  <div class="symbol symbol-35px me-4">
                    <span :class="`bg-light-primary`" class="symbol-label">
                      <span
                        :class="`svg-icon-primary`"
                        class="svg-icon svg-icon-2"
                      >
                        <inline-svg :src="item.image" />
                      </span>
                    </span>
                  </div>
                  <!--end::Symbol-->

                  <!--begin::Title-->
                  <div class="mb-0 me-2">
                    <a
                      href="#"
                      class="fs-6 text-gray-800 text-hover-primary fw-bold"
                      >{{ item.title }}</a
                    >
                    <div class="text-gray-400 fs-7">
                      {{ item.message }}
                    </div>
                  </div>
                  <!--end::Title-->
                </div>
                <!--end::Section-->

                <!--begin::Label-->
                <span v-if="!item.isRead" class="badge badge-light fs-8"
                  >{{ item.date }} <span class="circleUnread"></span
                ></span>
                <span v-else class="badge badge-light fs-8">{{
                  item.date
                }}</span>
                <!--end::Label-->
              </div>
              <!--end::Item-->
            </template>
          </div>
        </div>
        <!--end::Items-->

        <!--begin::View more-->
        <div class="py-3 text-center border-top">
          <a class="btn btn-color-gray-600 btn-active-color-primary">
            <router-link to="/all-notifications">
              View All
              <span class="svg-icon svg-icon-5">
                <inline-svg src="/media/icons/duotune/arrows/arr064.svg" />
              </span>
            </router-link>
          </a>
        </div>
        <!--end::View more-->
      </div>
      <!--end::Tab panel-->
      <!--end::Tab panel-->

      <!--end::View more-->
      <!--end::Tab panel-->
    </div>
    <!--end::Tab content-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getIllustrationsPath } from "@/core/helpers/assets";
import PusherService from "@/core/services/PusherService";
import ApiService from "@/core/services/ApiService";

import {
  ref,
  reactive,
  onMounted,
  defineComponent,
  watch,
  toRefs,
  onBeforeUnmount,
  defineEmits,
} from "vue";

export default defineComponent({
  name: "notifications-menu",
  components: {},
  setup() {
    const pusherEvent =
      "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated";
    const fetchNotifications = () => {
      ApiService.postTest("notifications/myList", fetchAllNotfications).then(
        (res) => {
          message.value = res.data.data.notifications;
        }
      );
    };
    const channel = PusherService.subscribe("notification");
    const message = ref([]);
    const fetchAllNotfications = { all: 1 };
    channel.bind(pusherEvent, (data) => {
      fetchNotifications();
    });

    const data2 = [
      {
        code: "200 OK",
        state: "success",
        message: "New order",
        time: "Just now",
      },
      {
        code: "500 ERR",
        state: "danger",
        message: "New customer",
        time: "2 hrs",
      },
      {
        code: "200 OK",
        state: "success",
        message: "Payment process",
        time: "5 hrs",
      },
      {
        code: "300 WRN",
        state: "warning",
        message: "Search query",
        time: "2 days",
      },
      {
        code: "200 OK",
        state: "success",
        message: "API connection",
        time: "1 week",
      },
      {
        code: "200 OK",
        state: "success",
        message: "Database restore",
        time: "Mar 5",
      },
      {
        code: "300 WRN",
        state: "warning",
        message: "System update",
        time: "May 15",
      },
      {
        code: "300 WRN",
        state: "warning",
        message: "Server OS update",
        time: "Apr 3",
      },
      {
        code: "300 WRN",
        state: "warning",
        message: "API rollback",
        time: "Jun 30",
      },
      {
        code: "500 ERR",
        state: "danger",
        message: "Refund process",
        time: "Jul 10",
      },
      {
        code: "500 ERR",
        state: "danger",
        message: "Withdrawal process",
        time: "Sep 10",
      },
      {
        code: "500 ERR",
        state: "danger",
        message: "Mail tasks",
        time: "Dec 10",
      },
    ];
    onMounted(() => {
      fetchNotifications();
    });

    watch(message, (newValue) => {});
    return {
      message,
      data2,
      getIllustrationsPath,
    };
  },
});
</script>
<style>
.circleUnread {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background-color: lightblue;
  margin-left: 3px;
}
</style>
