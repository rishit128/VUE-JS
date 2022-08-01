<template>
  <div>
    <div class="button">
      <div class="component"><add-modal-user></add-modal-user></div>
      <div class="text-center">
        <span>Welcome Admin</span>
      </div>
    </div>
    <div v-if="userdata.length > 0">
      <master-table :userdata="userdata"></master-table>
    </div>
    <div v-else style="background: #ececec; padding: 30px">
      <a-card title="No user Data" :bordered="false" style="width: 300px">
        <p>No User Data</p>
        <p>Please Create User</p>
      </a-card>
    </div>
  </div>
</template>
<script>
import MasterTable from "../layout/MasterTable.vue";
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import AddModalUser from "../layout/AddUserModal.vue";
export default {
  components: {
    MasterTable,
    AddModalUser,
  },
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch("storeuserdata");
    });
    const userdata = computed(() => {
      console.log(store.getters.getuserdata);
      return store.getters.getuserdata;
    });

    return {
      store,
      userdata,
    };
  },
};
</script>
<style scoped>
.text-center {
  font-size: 30px;

  margin-left: 450px;
}
.button {
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
}
.component {
  margin-left: 20px;
  justify-content: flex-start;
}
</style>