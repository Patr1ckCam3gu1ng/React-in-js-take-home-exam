import axios from "axios";
import jwtDecode from "jwt-decode";
import api from "../apis";

export default {
  setupInterceptors: () => {
    axios.interceptors.request.use(function (response) {
      //Disable temporarily
      return response;

      if (response.url.indexOf("api/Authenticate") > -1) {
        return response;
      }

      const jwtToken = localStorage.getItem("jwtToken");

      function redirectThenClear() {
        window.location.href = "/login";
        localStorage.clear();
        return null;
      }

      if (jwtToken === null) {
        return redirectThenClear();
      } else {
        const decoded = jwtDecode(jwtToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          return redirectThenClear();
        } else {
          const jwtToken = localStorage.getItem("jwtToken");
          api
            .login()
            .renew(jwtToken)
            .then((response) => {
              if (typeof response === "undefined") return;

              localStorage.setItem("jwtToken", response.token);
            });
        }
      }

      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>", response);
      return response;
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      // console.log("wwwwwwwwwwwwwww", response);
      return response;
    });
  },
};
