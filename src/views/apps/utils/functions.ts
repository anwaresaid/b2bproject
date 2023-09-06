export const dateFormatter = (date, time) => {
  const isTime = time === "time" ? true : false;
  const day =
    ("" + (date.value.getDate() + 1)).length > 1
      ? date.value.getDate()
      : "0" + date.value.getDate();
  const month =
    ("" + date.value.getMonth()).length > 1
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
  console.log("hours", seconds);
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
