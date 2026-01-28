import axios from "axios";

const request = axios.create({
  baseURL: "https://www.akbarovich.uz/",
});


export { request };
