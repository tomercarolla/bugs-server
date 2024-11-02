import configDev from "./dev.js";
import configProd from "./prod.js";

export let config;

if (process.env.NODE_ENV === "production") {
  config = configProd;
} else {
  config = configDev;
}
