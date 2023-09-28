import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import store from "../store";

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  api_token: string;
}

const isTokenValid = {
  status: false,
};

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.api_token);
  }

  function setError(error: any) {
    errors.value = { error };
  }

  function isLoggedIn() {
    const token = localStorage.getItem("token");
    if (token !== "undefined" && token !== undefined) {
      return true;
    } else {
      return false;
    }
  }
  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
  }

  function login(credentials: User) {
    return ApiService.post("users/login", credentials)
      .then(({ data }) => {
        setAuth(data);
      })
      .catch(({ response }) => {
        console.log("response", response);
        setError(response?.data?.messages);
      });
  }

  function logout() {
    purgeAuth();
  }

  function validation() {
    return ApiService.get("users/show")
      .then((res) => {
        isTokenValid.status = true;
        // console.log("sotre data", store.state.permissions);
        store.dispatch("setPermissions", res.data.user.canSeeUserCreatePage);
      })
      .catch((e) => {
        isTokenValid.status = false;
      });
  }

  function register(credentials: User) {
    return ApiService.post("register", credentials)
      .then(({ data }) => {
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("users/forgot-password", email)
      .then(() => {
        setError(null);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }
  function resetPassword(data: object) {
    return ApiService.post("users/reset-password", data)
      .then(() => {
        setError(null);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function verifyAuth() {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.post("verify_token", { api_token: JwtService.getToken() })
        .then(({ data }) => {
          setAuth(data);
        })
        .catch(({ response }) => {
          setError(response.data.errors);
          purgeAuth();
        });
    } else {
      purgeAuth();
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    isTokenValid,
    validation,
    isLoggedIn,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
    resetPassword,
  };
});
