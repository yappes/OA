const date = {
  name: "timestampStringify",
  fn: function(value) {
    var date = new Date(value);
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D = 
      (date.getDate() < 10 
        ? "0" + date.getDate()
        : date.getDate()) + " ";
    var h = 
      (date.getHours() < 10 
        ? "0" + date.getHours()
        : date.getHours()) + ":";
    var m = 
      (date.getMinutes() < 10 
        ? "0" + date.getMinutes()
        : date.getMinutes());
    // var s = ":" + date.getSeconds();
    return Y + M + D + h + m;
  }
};
const booleanStringify = {
  name: "booleanStringify",
  fn: function(value) {
    return value ? "是" : "否";
  }
};
export default {
  date,
  booleanStringify
};
