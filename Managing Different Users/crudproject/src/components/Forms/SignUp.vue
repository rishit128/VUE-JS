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
    >
      <div v-if="submitted">
        <a-card
          header="Form Submitted Sucessfully"
          header-tag="header"
          title="Success"
        >
          <h4>We Will Provide You Approval For Your Login.😃</h4>
          <h4>Please Login After 2 Hours. Thank You For Your Patience.</h4>
          <a-button type="primary" @click="navigation">Go To Home page</a-button>
        </a-card>
      </div>
      <a-form
        v-else
        :model="form"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 10 }"
        autocomplete="on"
        style="margin-top: 30px"
        @finish="onFinish"
      >
        <h1 style="margin-left: 150px; margin-top: 30px">Sign Up Here</h1>
        <a-form-item label="Name" name="name">
          <a-input v-model:value="form.name" @blur="v$.name.$touch()" />
          <span class="text-danger" v-if="v$.name.$error && v$.name.$dirty">{{
            v$.name.$errors[0].$message
          }}</span>
        </a-form-item>

        <a-form-item label="Email" name="email">
          <a-input v-model:value="form.email" @blur="v$.email.$touch()" />
          <span class="text-danger" v-if="v$.email.$error && v$.email.$dirty">{{
            v$.email.$errors[0].$message
          }}</span>
        </a-form-item>

        <a-form-item label="Phone" name="phone">
          <a-input v-model:value="form.phone" @blur="v$.phone.$touch()" />
          <span class="text-danger" v-if="v$.phone.$error && v$.phone.$dirty">{{
            v$.phone.$errors[0].$message
          }}</span>
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
        </a-form-item>
        <a-alert v-if="error" :message="error" type="error" show-icon />
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>
<script>
import { computed, defineComponent, ref, reactive } from "vue";
import {
  alpha,
  numeric,
  required,
  email,
  minLength,
  maxLength,
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import axios from "axios";
import {useRouter} from 'vue-router'
export default defineComponent({
  setup() {
    const form = reactive({
      name: "",
      email: "",
      phone: null,
      password: "",
    });
    const router = useRouter()
    const errormsg = ref("");
    const submitted = ref(false);
    const onFinish = (values) => {
      if (v$.value.$invalid) {
        errormsg.value = "Not A Valid Form";
        return;
      } else {
        axios
          .post("http://localhost:5000/user/signup", values)
          .then((response) => {
            submitted.value = true;
            console.log(response);
          })
          .catch((error) => {
            errormsg.value = error.response.data.message;
          });
      }
    };
    const navigation = function () {
      router.push({ name: "signin" });
    };
    const rules = computed(() => {
      return {
        name: { required, alpha },
        email: { required, email },
        password: {
          strongPassword(password) {
            return (
              /[a-z]/.test(password) && // checks for a-z
              /[0-9]/.test(password) && // checks for 0-9
              /\W|_/.test(password) && // checks for special char
              password.length >= 6
            );
          },
          required,
          maxLength: maxLength(12),
          minLength: minLength(6),
        },
        phone: {
          required,
          numeric,
          maxLength: maxLength(10),
          minLength: minLength(10),
        },
      };
    });

    const v$ = useVuelidate(rules, form);

    return {
      form,
      v$,
      navigation,
      onFinish,

      error: errormsg,
      submitted,
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
  background-image: url("../../assets/undraw_Access_account_re_8spm.png");
  background-size: contain;
  background-repeat: no-repeat;
  height: 70vh;
}
</style>