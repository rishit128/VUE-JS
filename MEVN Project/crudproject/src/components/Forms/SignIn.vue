<template>
  <div>
    <b-form
      class="p-3 col-md-4 col-sm-6 offset-md-4 card mt-4"
      @submit="onSubmit"
      @reset="onReset"
    >
      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-3"
      >
        <b-form-input
          class="input"
          :class="{ error: $v.form.email.$error }"
          id="input-3"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
          @blur="$v.form.email.$touch()"
        ></b-form-input>
      </b-form-group>
      <span
        v-if="!$v.form.email.required && $v.form.email.$dirty"
        class="text-danger"
        >Please enter Valid Email</span
      >
      <b-form-group
        id="input-group-2"
        label="Your Password:"
        label-for="input-4"
      >
        <b-form-input
          class="input"
          :class="{ error: $v.form.password.$error }"
          id="input-4"
          type="password"
          v-model="form.password"
          placeholder="Enter password"
          required
          @blur="$v.form.password.$touch()"
        ></b-form-input>
        <span
          v-if="!$v.form.password.required && $v.form.password.$dirty"
          class="text-danger"
          >Password is required!</span
        >
        <span
          v-if="
            (!$v.form.password.minLength || !$v.form.password.maxLength) &&
            $v.form.password.$dirty
          "
          class="text-danger"
          >Password must be between
          {{ $v.form.password.$params.minLength.min }} and
          {{ $v.form.password.$params.maxLength.max }} characters!</span
        >
      </b-form-group>

      <b-button
        :disabled="isFormInvalid"
        class="btn mb-3"
        type="submit"
        variant="primary"
        >Submit</b-button
      >
    </b-form>
    <!-- <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card> -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  required,
  minLength,
  maxLength,
  email,
} from "vuelidate/lib/validators";
import axios from "axios";

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      errormsg: "",
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
        maxLength: maxLength(12),
        minLength: minLength(6),
      },
    },
  },
  methods: {
    ...mapActions(["loginuser"]),
    onSubmit(event) {
      event.preventDefault();
      this.$v.$touch();
      axios
        .post("http://localhost:5000/user/signin", this.form)
        .then((response) => {
          localStorage.setItem("profile", JSON.stringify(response.data));
          this.$store.state.isloggedIn = true;
          const { result } = response.data;
          this.loginuser(result);
          if (result.Usertype == "Master Admin") {
            this.$router.push({ name: "masteradmin" });
          } else if (result.Usertype == "Admin") {
            this.$router.push({ name: "admin" });
          } else if (result.Usertype == "user") {
            if (result.Isapproved) {
              this.$router.push({ name: "user" });
            } else {
              this.$store.state.isloggedIn = false;
              this.errormessage("danger", "Please Login After Sometime");
            }
          }
        })
        .catch((error) => {
          this.$bvToast.toast(error.response.data.message, {
            title: "Error",
            autoHideDelay: 5000,
            variant: "danger",
          });
        });
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.name = "";
    },
  },
  computed: {
    isFormInvalid() {
      return this.$v.form.$invalid;
    },
  },
};
</script>

<style scoped>
.error {
  border-color: red;
  animation: shake 0.2s ease-in-out 0s 2;
  box-shadow: 0 0 0.5em red;
}
@keyframes shake {
  0% {
    margin-left: 0rem;
  }
  25% {
    margin-left: 0.5rem;
  }
  75% {
    margin-left: -0.5rem;
  }
  100% {
    margin-left: 0rem;
  }
}
</style>