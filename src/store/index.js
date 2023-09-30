// store/index.js

import Vuex from "vuex";
import ApiService from "@/core/services/ApiService";

const store = new Vuex.Store({
  state() {
    return {
      permissions: {},
      isTokenValid: false,
      rolePermissions: [],
      orderCode: null,
      pageItems: null,
      followKey: null,
      gameDetails:null,
    };
  },

  mutations: {
    setPermissions(state, payload) {
      state.permissions = payload;
    },
    setToken(state, payload) {
      state.isTokenValid = payload;
    },
    setOrderCode(state, payload) {
      state.orderCode = payload;
    },
    setRolesPermissions(state, payload) {
      state.rolePermission = payload.rolePermissions;
    },
    setPageItems(state, payload) {
      state.pageItems = payload;
    },
    setFollowKey(state, payload) {
      state.followKey = payload;
    },
    setGameDetails(state, payload) {
      console.log('called', payload)
      state.gameDetails = payload;
    }
  },

  actions: {
    setPermissions(context, value) {
      context.commit("setPermissions", value);
    },
    setOrderCode(context, value) {
      context.commit("setOrderCode", value);
    },
    setRolePermissions(context, value) {
      context.commit("setRolesPermissions", value);
    },
    setPageItems(context, value) {
      context.commit("setPageItems", value);
    },
    setGameDetails(context, value) {
      context.commit("setGameDetails", value);
    },
    setFollowKey(context, value) {
      context.commit("setFollowKey", value);
    },
    setToken(context) {
      return ApiService.get("users/show")
        .then((res) => {
          context.commit("setToken", true);
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
    readNotifications() {
      ApiService.post("notifications/readAll");
    }
  },
  getters: {
    // Your computed properties based on state go here
  },
});

export default store;
