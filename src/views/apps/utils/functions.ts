import { ElMessage, ElMessageBox } from "element-plus";

export const dateFormatter = (date, time) => {
  const isTime = time === "time" ? true : false;
  const day =
    ("" + (date.value.getDate() + 1)).length > 1
      ? date.value.getDate()
      : "0" + date.value.getDate();
  const month =
    ("" + date.value.getMonth()).length > 1 || date.value.getMonth() === 9
      ? 1 + date.value.getMonth()
      : "0" + (date.value.getMonth() + 1);
  const year = date.value.getFullYear();
  const hours =
    ("" + date.value.getHours()).length > 1
      ? date.value.getHours()
      : "0" + date.value.getHours();
  const minutes =
    ("" + date.value.getMinutes()).length > 1
      ? date.value.getMinutes()
      : "0" + date.value.getMinutes();
  const seconds =
    ("" + date.value.getSeconds()).length > 1
      ? date.value.getSeconds()
      : "0" + date.value.getSeconds();
  const fullDate =
    day +
    "." +
    month +
    "." +
    year +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return fullDate;
};

export const removeEmptyValues = (obj) => {
  let object = obj;
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var value = object[key];
      if (value === null || value === undefined || value === "") {
        delete object[key];
      } else if (typeof value === "object") {
        if (Object.keys(value).length === 0) {
          delete object[key];
        }
      }
    }
  }
  return object;
};

export const errorHandling = (error) => {
  let temp;
  if (typeof error === "object") {
    temp = error[Object.keys(error)[0]];
  } else {
    temp = error;
  }

  ElMessageBox.alert(`${temp}`, "Request Error", {
    confirmButtonText: "OK",
  });
};

export const beautifyNumber = (num) => {
  const temp = num + "";
  let final = temp.replace(/[^0-9.]/g, "");

  // Split the value into integer and decimal parts
  const parts = final.split(".");
  let containsDecimal = false;
  if (final.includes(".")) {
    containsDecimal = true;
  }
  let integerPart = parts[0] || "";
  let decimalPart = parts[1] || "";

  // Add commas to the integer part every three digits
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Reassemble the formatted value
  final =
    integerPart +
    (decimalPart ? "." + decimalPart : containsDecimal ? "." : "");
  return final;
};
export const switchBeautifulNumber = (num) => {
  const number = (num + "").replace(",", "");
  return parseFloat(number);
};
