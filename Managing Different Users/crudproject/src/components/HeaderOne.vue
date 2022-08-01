<template>
  <a-layout class="layout">
    <a-layout-header>
      <a-menu
        v-model="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <template v-if="checkLogin">
          <a-menu-item key="1">{{ store.state.loginuser.name }}</a-menu-item>
          <a-menu-item key="2" @click="logout"
            >Log out</a-menu-item
          >
        </template>
        <template v-else>
          <a-menu-item key="1"
            ><router-link :to="{ name: 'signup' }"
              >Register User</router-link
            ></a-menu-item
          >
          <a-menu-item key="2"
            ><router-link :to="{ name: 'signin' }"
              >Sign In</router-link
            ></a-menu-item
          >
        </template>
      </a-menu>
    </a-layout-header>
  </a-layout>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const checkLogin = computed(() => {
      return store.state.isloggedIn;
    });
    const logout = function () {
      localStorage.clear();
      store.state.isloggedIn = false;
     
      router.push({ name: "signin" });
    };
    return {
      selectedKeys: ref(["2"]),
      checkLogin,
      logout,
      store
    };
  },
});
</script>

