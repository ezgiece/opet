
import moment from 'moment';


export function isNullOrEmptyOrUndefined(value) {
  if (value === null || value === undefined || value === '') {
    return true;
  }
  else {
    return false;
  }
}

export const getTodaysDateRange = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const startTime = '00:00';
  const endTime = '23:59';
  const todayDate = `${yyyy}-${mm}-${dd}`

  return [`${todayDate} ${startTime}`, `${todayDate} ${endTime}`];
}

export const getThisMonthsDateRange = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayDate = `${yyyy}-${mm}-${dd}`;
  const preMonthDate = moment().subtract(1, 'month').format('YYYY-MM-DD');

  return [`${preMonthDate} `, `${todayDate}`];
}

export const getThisYearsDateRange = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const startTime = '00:00';
  const endTime = '23:59';
  const todayDate = `${yyyy}-${mm}-${dd}`
  const preYearDate = moment().subtract(1, 'year').format('YYYY-MM-DD');

  return [`${preYearDate} ${startTime}`, `${todayDate} ${endTime}`];
}
export const getTodaysDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayDate = `${yyyy}-${mm}-${dd}`

  return todayDate;
}

export const getSixMonthsDateRange = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const startTime = '00:00';
  const endTime = '23:59';
  const todayDate = `${yyyy}-${mm}-${dd}`;
  const preMonthDate = moment().subtract(6, 'month').format('YYYY-MM-DD');

  return [`${preMonthDate} ${startTime}`, `${todayDate} ${endTime}`];
}

export function csvExport(arrData, name) {
  var universalBOM = '\uFEFF';
  let csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(universalBOM);
  csvContent += [
    Object.keys(arrData[0]).join(";"),
    ...arrData.map(item => Object.values(item).join(";"))
  ]
    .join("\n")
    .replace(/(^\[)|(\]$)/gm, "");

  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", name);
  link.click();
}

export const breakObject = ob => JSON.parse(JSON.stringify(ob));

export  function floorTwoDigits(percentage) {
  var per = Math.floor(percentage * 100) / 100;
  return per;
}