import {DefaultRoute} from '../router/routes'
import toast from 'react-hot-toast'
import moment from "moment";
import "moment-timezone"

moment.tz.setDefault("Africa/Nairobi")

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}


export const  tokenIsExpired = (createdAt, expiresIn)=>{
  const now =  new Date()
  const creationDate = new Date(createdAt);
  const expireDateEpoch = creationDate.getTime() + expiresIn;
  const nowEpoch = now.getTime()
  const diff = expireDateEpoch - nowEpoch;
  return diff <= 5000;
}
/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole) {
    return DefaultRoute
  }else{
    return '/login'
  }
}

export const generateError = (error)=>{
  let errorMsg = "Failed"
  if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      let msg =  error.response.data.message ? error.response.data.message : error.response.data.error ? error.response.data.error: error.response.data.detail?error.response.data.detail: error.response.data;
      errorMsg= `Error code ${error.response.status}: Could not execute operation due to: ${msg}`
  }  else {
      // Something happened in setting up the request that triggered an Error
      errorMsg= `Error: Could not execute operation due to: ${error.message}`
  }
  toast.error(errorMsg,{duration:8000, position:"bottom-right"})
  return errorMsg;
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#102027', // for selected option bg-color
    neutral10: '#A62ce0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

export const addDaysToDate = (date, days)=>{
  const d =  new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export const midnight = (date) => {
  const momentDate =  moment(date).startOf("day");
  return momentDate.format('YYYY-MM-DD HH:mm:ss');
}

export const todayDates = ()=>{
  const now =  moment();
  const mid = moment(now).startOf("day")
  const end =  moment(now).endOf("day")
  return [mid.format('YYYY-MM-DD HH:mm:ss'), end.format('YYYY-MM-DD HH:mm:ss')]
}

export const periodDates = (type="day")=>{
  let currentDate = moment(); // Current date
  let startDate;
  let endDate;
  if(type === "day"){
    startDate = currentDate.clone().startOf('day');
    endDate = currentDate.clone().endOf('day');
  }
  else if(type === "week"){
    startDate = currentDate.clone().startOf('week');
    endDate = currentDate.clone().endOf('week');
  }else{ // this will return the first and end dates of current month
    startDate = currentDate.clone().startOf('month');
    endDate = currentDate.clone().endOf('month');
  }
  return [startDate.toDate(), endDate.toDate()]
}

export const convertDate = (date, end=false)=>{
  let d =  moment(date);
  if (end){
    d =  moment(d).endOf("day")
  }
  return d.format('YYYY-MM-DD HH:mm:ss')
}

export const renderReadableDate = (date) => {
  const m = moment(date)
  return m.format('ddd MMM DD YYYY');
}

export const renderDateTime = (date)=>{
  const m =  moment(date);
  return m.format('hh:mm:ss A');
}

export const imageToBase64 = (file, callback) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

export const  downloadBase64Image=(base64String, fileName) =>{
  // Extract the image type from the data URI
  const regex = /^data:image\/(\w+);base64,/;
  const match = base64String.match(regex);
  if (!match) {
    console.error('Invalid base64 string');
    return;
  }

  const imageType = match[1];
  const fileType = imageType === 'jpeg' ? 'jpg' : imageType;

  // Convert the base64 string to a Blob
  const byteCharacters = atob(base64String.slice(match[0].length));
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: `image/${fileType}` });

  // Create a temporary anchor element with download attribute
  const downloadLink = document.createElement('a');
  downloadLink.download = `${fileName}.${fileType}`;

  // Set the href of the anchor element to the Blob URL
  downloadLink.href = URL.createObjectURL(blob);

  // Programmatically trigger a click event to start the download
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Clean up
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadLink.href);
}


const getRandomHexColor =()=> {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const generateColors =(n) =>{
  const colorsArray = [];
  for (let i = 0; i < n; i++) {
    colorsArray.push(getRandomHexColor());
  }
  return colorsArray;
}


export const formatCreditCardNumber = (number) =>{
  if (typeof number !== 'string') {
    number = number.toString();
  }
  number = number.replace(/\D/g, '');
  const formatPattern = /(\d{4})(?=\d)/g;
  return number.replace(formatPattern, '$1 ');
}
export function sleep(microseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, microseconds / 1000);
  });
}


export function mergeArrays(arrayA, arrayB) {
  arrayB.forEach(itemB => {
    const existingItemIndex = arrayA.findIndex(itemA => itemA.id === itemB.id);
    if (existingItemIndex !== -1) {
      // If item with same ID exists in arrayA, update it
      arrayA[existingItemIndex] = itemB;
    } else {
      // If not, unshift it to arrayA
      arrayA.unshift(itemB);
    }
  });
  return arrayA;
}
