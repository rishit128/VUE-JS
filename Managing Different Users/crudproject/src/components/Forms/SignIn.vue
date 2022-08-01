<template>
  <a-row>
    <a-col class="backgroundimage" :span="12"></a-col>
    <a-col
      :span="8"
      :xs="{ order: 4 }"
      :sm="{ order: 3 }"
      :md="{ order: 1 }"
      :lg="{ order: 1 }"
      class="commonform"
      style="width: 200px"
    >
      <h1 style="margin-left: 150px; margin-top: 30px">Sign in Here</h1>
      <a-form
        :model="form"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 10 }"
        autocomplete="on"
        style="margin-top: 30px"
        @finish="onFinish"
      >
        <a-form-item label="Email" name="email">
          <a-input @blur="v$.email.$touch()" v-model:value="form.email" />
          <span v-if="v$.email.$error && v$.email.$dirty"
            >{{ v$.email.$errors[0].$message }}
          </span>
        </a-form-item>

        <a-form-item label="Password" name="password">
          <a-input-password
            v-model:value="form.password"
            @blur="v$.password.$touch()"
          />
          <span
            class="text-danger"
            v-if="v$.password.required.$invalid && v$.password.$dirty"
            >Password Is required
          </span>
          <span
            class="text-danger"
            v-else-if="
              (v$.password.minLength.$invalid ||
                v$.password.maxLength.$invalid) &&
              v$.password.$dirty
            "
            >Password Length Should Be Between 6 to 12</span
          >
          <span
            v-else-if="
              v$.password.strongPassword.$invalid && v$.password.$dirty
            "
            class="text-danger"
            >Passward must have a to z and 0 to 9 and special char</span
          >
          <!-- <span v-else>hi</span> -->
          <!-- <span v-else-if="v$.password.$erros[0].$validator=='strongPassword' && v$.password.$dirty">Password Must be Storng</span> -->
        </a-form-item>
        <a-alert
          v-if="err"
          :message="errormsg"
          type="error"
          closable
          :after-close="handleClose"
        />
        <a-alert
          v-if="pending"
          message="Please Login After Sometime"
          type="info"
        />
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>
<script>
import { defineComponent, ref, reactive, computed } from "vue";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const form = reactive({
      email: "",
      password: "",
    });
    const err = ref(false);

    const handleClose = () => {
      err.value = false;
    };
    const errormsg = ref("");
    const pending = ref(false);
    const store = useStore();
    const router = useRouter();
    const onFinish = () => {
      axios
        .post("http://localhost:5000/user/signin", form)
        .then((response) => {
          localStorage.setItem("profile", JSON.stringify(response.data));
          store.state.isloggedIn = true;
          const { result } = response.data;
          store.dispatch("loginuser", result);
          if (result.Usertype == "Master Admin") {
            router.push({ name: "masteradmin" });
          } else if (result.Usertype == "Admin") {
            router.push({ name: "admin" });
          } else if (result.Usertype == "user") {
            if (result.Isapproved) {
              router.push({ name: "user" });
            } else {
              store.state.isloggedIn = false;
              localStorage.clear();
              errormsg.value =
                "Please Login After Sometime Admin Will Aprove Your Account";
            }
          }
        })

        .catch((error) => {
          err.value = true;

          errormsg.value = error.response.data.message;
        });
    };

    const rules = computed(() => {
      return {
        email: { required, email },
        password: {
          required,
          maxLength: maxLength(12),
          minLength: minLength(6),
          strongPassword(password) {
            return (
              /[a-z]/.test(password) && // checks for a-z
              /[0-9]/.test(password) && // checks for 0-9
              /\W|_/.test(password) && // checks for special char
              password.length >= 6
            );
          },
        },
      };
    });

    const v$ = useVuelidate(rules, form);

    return {
      form,

      v$,
      onFinish,

      errormsg,
      pending,
      err,
      handleClose,
    };
  },
});
</script>
<style scoped>
.commonform {
  border: 4px solid black;
  margin-top: 50px;
  box-shadow: 5px 10px 5px #888888;
}
.text-danger {
  color: red;
}
.backgroundimage {
  background-image: url("../../assets/undraw_Helpful_sign_re_8ms5.png");
  background-size: contain;
  background-repeat: no-repeat;
  height: 60vh;
}
</style>