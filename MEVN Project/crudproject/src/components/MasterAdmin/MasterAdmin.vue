<template>
  <div>
    <div class="mt-2 px-1">
      <user-form></user-form>
      <h4 class="text-center">Welcome Master Admin</h4>
    </div>

    <div class="mt-3">
      <master-table :userdata="userdata"></master-table>
    </div>
  </div>
</template>
<script>
import MasterTable from "../layOuts/MasterTable.vue";
import UserForm from "../layOuts/AdduserModal.vue";

export default {
  components: {
    MasterTable,
    UserForm,
  },
  data() {
    return {};
  },

  mounted() {
    this.$store.dispatch("storeuserdata");
  },
  computed: {
    userdata() {
      return this.$store.getters.getuserdata;
    },
  },
};
</script>
