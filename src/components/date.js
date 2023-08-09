/* eslint-disable */

var d = new Date().getDate();
var m = new Date().getMonth();
var y = new Date().getFullYear();
var day = new Date().getDay();
var hr = new Date().getHours() - 12;
var min = new Date().getMinutes();
var str = '';
switch (day) {
  case 0:
    str += 'Sun';
    break;
  case 1:
    str += 'Mon';
    break;
  case 2:
    str += 'Tue';
    break;
  case 3:
    str += 'Wed';
    break;
  case 4:
    str += 'Thu';
    break;
  case 5:
    str += 'Fri';
    break;
  case 6:
    str += 'Sat';
    break;
  default:
    break;
}
if (m === 11) {
  m = 12;
} else if (m === 0) {
  m = 1;
} else if (m === 1) {
  m = 2;
} else if (m === 2) {
  m = 3;
} else if (m === 3) {
  m = 4;
} else if (m === 4) {
  m = 5;
} else if (m === 5) {
  m = 6;
} else if (m === 6) {
  m = 7;
} else if (m === 7) {
  m = 8;
} else if (m === 8) {
  m = 9;
} else if (m === 9) {
  m = 10;
} else if (m === 10) {
  m = 11;
}
// console.log(d + '/' + m + '/' + y + ' - ' + str + ' - ' + hr + ':' + min);

const Customdate = String(y + '/' + `${m <= 9 ? '0' + m : m}` + '/' + `${d <= 9 ? '0' + d : d}`);

module.exports = Customdate;
