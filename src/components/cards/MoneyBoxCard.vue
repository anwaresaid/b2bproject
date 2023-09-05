<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <div class="card-title d-flex flex-column">
        <!--begin::Info-->
        <div class="d-flex align-items-center">
          <!--begin::Amount-->
          <span class="fs-2hx fw-bold text-dark me-2 lh-1 ls-n2">{{
            name
          }}</span>
          <!--end::Amount-->
        </div>
      </div>
      <!--end::Title-->
    </div>
    <!--end::Header-->

    <!--begin::Card body-->
    <div class="card-body pt-2 pb-4 d-flex flex-wrap align-items-center">
      <!--begin::Chart-->
      <div class="d-flex flex-center me-5 pt-2">
        <div
          :id="classId"
          :style="{
            minWidth: `${chartSize}px`,
            minHeight: `${chartSize}px`,
          }"
          :data-kt-size="chartSize"
          :data-kt-line="11"
        ></div>
      </div>
      <!--end::Chart-->

      <!--begin::Labels-->
      <div class="d-flex flex-column content-justify-center flex-row-fluid">
        <!--begin::Label-->
        <div class="d-flex fw-semibold align-items-center">
          <!--begin::Bullet-->
          <div class="bullet w-8px h-3px rounded-2 bg-success me-3"></div>
          <!--end::Bullet-->

          <!--begin::Label-->
          <div class="text-gray-500 flex-grow-1 me-4">Toplam</div>
          <!--end::Label-->

          <!--begin::Stats-->
          <div class="fw-bolder text-gray-700 text-xxl-end">
            {{ balance }} €
          </div>
          <!--end::Stats-->
        </div>
        <!--end::Label-->

        <!--begin::Label-->
        <div class="d-flex fw-semibold align-items-center my-3">
          <!--begin::Bullet-->
          <div class="bullet w-8px h-3px rounded-2 bg-primary me-3"></div>
          <!--end::Bullet-->

          <!--begin::Label-->
          <div class="text-gray-500 flex-grow-1 me-4">Harcanan</div>
          <!--end::Label-->

          <!--begin::Stats-->
          <div class="fw-bolder text-gray-700 text-xxl-end">{{ spent }} €</div>
          <!--end::Stats-->
        </div>
        <!--end::Label-->

        <!--begin::Label-->
        <div class="d-flex fw-semibold align-items-center">
          <!--begin::Bullet-->
          <div
            class="bullet w-8px h-3px rounded-2 me-3"
            style="background-color: #e4e6ef"
          ></div>
          <!--end::Bullet-->

          <!--begin::Label-->
          <div class="text-gray-500 flex-grow-1 me-4">İçerde Kalan</div>
          <!--end::Label-->

          <!--begin::Stats-->
          <div class="fw-bolder text-gray-700 text-xxl-end">
            {{ remainingBalance }} €
          </div>
          <!--end::Stats-->
        </div>
        <!--end::Label-->
      </div>
      <!--end::Labels-->
    </div>
    <!--end::Card body-->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { getCSSVariableValue } from "@/assets/ts/_utils";

export default defineComponent({
  name: "default-dashboard-widget-2",
  components: {},
  props: {
    className: { type: String, required: false },
    chartSize: { type: Number, required: true },
    classId: { type: String, required: true },
    remainingBalance: { type: Number, required: true },
    spent: { type: Number, required: true },
    balance: { type: Number, required: true },
    name: { type: String, required: true },
  },
  setup(props, { expose }) {
    let startAngle = 0;
    const total = props.balance > 0 ? props.balance : 1;
    const initChart = () => {
      expose();
      var el = document.getElementById(props.classId);

      if (!el) {
        return;
      }

      var options = {
        size: el.getAttribute("data-kt-size")
          ? parseInt(el.getAttribute("data-kt-size") as string)
          : 70,
        lineWidth: el.getAttribute("data-kt-line")
          ? parseInt(el.getAttribute("data-kt-line") as string)
          : 11,
        rotate: el.getAttribute("data-kt-rotate")
          ? parseInt(el.getAttribute("data-kt-rotate") as string)
          : 145,
        //percent:  el.getAttribute('data-kt-percent') ,
      };

      var canvas = document.createElement("canvas");
      var span = document.createElement("span");

      var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      canvas.width = canvas.height = options.size;

      el.appendChild(span);
      el.appendChild(canvas);

      ctx.translate(options.size / 2, options.size / 2); // change center
      ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

      //imd = ctx.getImageData(0, 0, 240, 240);
      var radius = (options.size - options.lineWidth) / 2;

      var drawCircle = function (
        color: string,
        lineWidth: number,
        percent: number
      ) {
        // percent = Math.min(Math.max(0, percent || 1), 1);
        const endAngle = startAngle + Math.PI * 2 * percent;
        ctx.beginPath();
        ctx.arc(0, 0, radius, startAngle, endAngle, false);
        ctx.strokeStyle = color;
        ctx.lineCap = "round"; // butt, round or square
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        startAngle = endAngle;
      };

      // Init
      drawCircle(
        getCSSVariableValue("--kt-primary"),
        options.lineWidth,
        props.spent / total
      );
      drawCircle(
        getCSSVariableValue("--kt-success"),
        options.lineWidth,
        props.remainingBalance / total
      );
      drawCircle(
        "#E4E6EF",
        options.lineWidth,
        (total - (props.remainingBalance + props.spent)) / total
      );
    };

    //   drawCircle("#E4E6EF", options.lineWidth, 100 / 100);
    //   drawCircle(
    //     getCSSVariableValue("--kt-primary"),
    //     options.lineWidth,
    //     30 / 100
    //   );
    //   drawCircle(
    //     getCSSVariableValue("--kt-success"),
    //     options.lineWidth,
    //     50 / 100
    //   );
    // };

    onMounted(() => {
      initChart();
    });
  },
});
</script>
