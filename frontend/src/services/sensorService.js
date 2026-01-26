import API from "./api";

export const getSensors = () => {
  return API.get("sensors/");
};
