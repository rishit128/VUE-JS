<template>
  <div>
    <b-navbar v-if="checkLogin" toggleable="sm" type="light" variant="info">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

      <!-- <b-link class="text-dark">Master Admin</b-link>&nbsp;&nbsp;&nbsp;&nbsp; -->
      <b-link class="text-dark">{{ $store.state.loginuser.name }}</b-link>

      <b-button @click="logout" variant="danger" class="ml-auto"
        >Log Out</b-button
      >
    </b-navbar>
    <b-navbar v-else toggleable="sm" type="light" variant="info">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

      <b-link
        class="text-dark"
        :to="{ name: 'registeruser' }"
        exact-active-class="active"
        exact
        >Register User</b-link
      >

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <b-link
            class="text-dark"
            :to="{ name: 'signin' }"
            exact-active-class="active"
            exact
            style="margin-left: 10px"
            >Sign In</b-link
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: "",
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$store.state.isloggedIn = false;
      this.$store.state.loginuser = null;
      this.$router.push({ name: "homepage" });
    },
  },

  computed: {
    checkLogin() {
      return this.$store.state.isloggedIn;
    },
  },
};
</script>
<style scoped>
.active {
  background-color: blueviolet;
  color: white;
}
</style>