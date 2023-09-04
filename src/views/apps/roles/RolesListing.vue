<template>
  <div class="card">
    <div class="card-body pt-0">
      <el-table
        :data="permissions"
        :header="headers"
        :enable-items-per-page-dropdown="true"
        checkbox-label="id"
      >
        <el-table-column
          v-for="(item, index) in headers"
          :label="item.columnName"
        >
          <template #header>
            {{ item.columnName }}
            <el-button
              type="primary"
              icon="Edit"
              circle
              @click="handleEditRole(index, item.columnLabel, setDialogVisible)"
            >
            </el-button>
          </template>
          <template #default="role">
            <div>
              {{ role.row[item.columnName]?.name }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="dialogVisible" title="Warning" width="30%" center>
        <el-table :data="allPermmissions" :row-key="(row) => row.id">
          <el-table-column :label="headers[selectedHeaderId].columnName">
            <template #default="singlePermission">
              {{ singlePermission.row.name }}
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="singlePermission">
              <el-checkbox
                v-model="checked[singlePermission.row.id]"
                size="large"
              />
            </template>
          </el-table-column>
        </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="hadlePermissionsChange">Cancel</el-button>
            <el-button type="primary" @click="onPermissionChange">
              Confirm
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>

  <ExportCustomerModal></ExportCustomerModal>
  <AddCustomerModal></AddCustomerModal>
</template>

<script lang="ts">
import { defineComponent, ref, onUpdated } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ExportCustomerModal from "@/components/modals/forms/ExportCustomerModal.vue";
import AddCustomerModal from "@/components/modals/forms/AddCustomerModal.vue";
import ApiService from "@/core/services/ApiService";
import { MultiListSelect, ModelSelect } from "vue-search-select";
import { ElTable } from "element-plus";

export default defineComponent({
  name: "customers-listing",
  components: {
    Datatable,
    ExportCustomerModal,
    AddCustomerModal,
    MultiListSelect,
    ModelSelect,
  },

  data() {
    return {
      rolesData: [],
      headers: [],
      permissions: [],
      allPermmissions: [],
      rolePermission: {},
      max: 0,
      maxPermissions: {},
      dialogVisible: false,
      selectedRoleId: "",
      selectedHeaderId: "",
      checkedPermissions: {},
      checked: {},
    };
  },

  methods: {
    fetchData() {
      ApiService.postTest("roles/all").then((res) => {
        this.rolesData = res.data.data.roles;
      });
      ApiService.postTest("permissions/all").then((res) => {
        this.allPermmissions = res.data.data.permissions;
      });
    },
    mapHeaders() {
      if (this.rolesData?.length > 1) {
        this.headers = ref(
          this.rolesData.map((item) => {
            this.maxPermissions[item.id] = item.permissions.length;

            if (item.permissions.length > this.max) {
              this.max = item.permissions.length;
            }
            this.rolePermission[item.name] = item.permissions;
            return {
              columnName: item.name,
              columnLabel: item.id,
            };
          })
        );
      }
    },
    formatBody() {
      this.permissions = [];
      let keys = Object.keys(this.rolePermission);
      let obj = {};
      for (let i = 0; i < this.max; i++) {
        obj = {};
        this.permissions.push(
          keys.reduce((permissions, key) => {
            let temp = { [key]: this.rolePermission[key][i] };
            obj = Object.assign(obj, temp);
            if (Object.keys(obj).length === keys.length) {
              return obj;
            }
          }, [])
        );
      }
    },

    handleEditRole(index, roleId) {
      this.checkedPermissions = ref(
        this.rolesData.find((item) => item.id === roleId).permissions
      );
      let ids = this.checkedPermissions.map((item) => item.id);
      this.allPermmissions.map((item) => {
        if (ids.includes(item.id)) {
          this.checked = { ...this.checked, [item.id]: true };
        } else {
          this.checked = { ...this.checked, [item.id]: false };
        }
      });
      this.selectedRoleId = roleId;
      this.selectedHeaderId = index;
      this.dialogVisible = true;
    },

    onPermissionChange() {
      const keys = Object.keys(this.checked);
      const filteredData = keys.filter((item) => this.checked[item]);
      const name = this.headers.filter((item) => {
        if (item.columnLabel === this.selectedRoleId) {
          return item[columnName];
        }
      });
      const data = {
        name: name[0].columnName,
        permissions: filteredData,
      };
      ApiService.put(`roles/${this.selectedRoleId}`, data).then((res) => {
        this.fetchData();
        this.dialogVisible = false;
      });
    },
  },

  mounted() {
    this.fetchData();
  },

  watch: {
    checked: {
      handler: function () {},
      deep: true,
    },
    rolesData() {
      this.mapHeaders();
    },
    headers() {
      this.formatBody();
    },
  },
});
</script>
<style>
.card-title {
  display: flex;
  justify-content: space-between;
}
.edit-button {
  margin-top: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
</style>
