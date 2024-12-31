import axios from "axios";
import CONFIG from "../constants/config";

class qbRequest {
  constructor(baseURL, timeout) {
    this.instance = axios.create({
      baseURL,
      timeout,
    });
    // 添加loading效果
    this.instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (err) => {
        return err;
      }
    );
    this.instance.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        return err;
      }
    );
  }
  request(config) {
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get(url, config) {
    return this.request({ ...config, method: "get", url: url });
  }
  post(url, body, config) {
    return this.request({ ...config, method: "post", url: url, data: body });
  }
}
const request = new qbRequest(CONFIG.SERVER_URL, 5000);
export default request;
