// store/index.js

import Vuex from "vuex";
import ApiService from "@/core/services/ApiService";

const store = new Vuex.Store({
  state() {
    return {
      permissions: {},
      isTokenValid: false,
      rolePermissions: [],
    };
  },

  mutations: {
    setPermissions(state, payload) {
      console.log("premission payload", payload);
      state.permissions = payload;
    },
    setToken(state, payload) {
      state.isTokenValid = payload;
    },
    setRolesPermissions(state, payload) {
      console.log("rolepermissions", payload.rolePermissions);
      state.rolePermission = payload.rolePermissions;
    },
  },

  actions: {
    setPermissions(context, value) {
      console.log("called !", value);
      context.commit("setPermissions", value);
    },
    setRolePermissions(context, value) {
      console.log("called !", value);
      context.commit("setRolesPermissions", value);
    },
    setToken(context) {
      return ApiService.get("users/show")
        .then((res) => {
          context.commit("setToken", true);
          console.log("sotre data", res);
          context.dispatch("setPermissions", {
            canSeeUserCreatePage: res.data.data.user.canSeeUserCreatePage,
          });
          context.dispatch("setRolePermissions", {
            rolePermissions: res.data.data.user.roles.permissions,
          });
        })
        .catch((e) => {
          context.commit("setToken", false);
        });
    },
  },
  getters: {
    // Your computed properties based on state go here
  },
});

export default store;
