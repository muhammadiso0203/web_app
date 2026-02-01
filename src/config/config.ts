import axios from "axios";

const request = axios.create({
  baseURL: "https://back.akbarovich.uz",
});


export { request };
