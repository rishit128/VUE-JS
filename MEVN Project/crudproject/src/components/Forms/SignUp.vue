<template>
  <div>
    <div v-if="submitted">
      <b-card
        header="Form Submitted Sucessfully"
        header-tag="header"
        title="Success"
      >
        <b-card-text
          >We Will Provide You Approval For Your Login.😃</b-card-text
        >
        <b-card-text
          >Please Login After 2 Hours. Thank You For Your
          Patience.</b-card-text
        >
        <b-button @click="navigation" variant="primary"
          >Go To Home page</b-button
        >
      </b-card>
    </div>
    <b-form
      v-else
      class="p-3 col-md-4 col-sm-6 offset-md-4 card mt-4"
      @submit="onSubmit"
      @reset="onReset"
    >
      <h2 class="text-center">Register Here</h2>
      <b-form-group
        id="input-group-2"
        label="Enter Your Name"
        label-for="input-1"
      >
        <b-form-input
          class="input"
          :class="{ error: $v.form.name.$error }"
          id="input-1"
          v-model="form.name"
          placeholder="Enter name"
          required
          @blur="$v.form.name.$touch()"
        ></b-form-input>
        <span
          v-if="!$v.form.name.required && $v.form.name.$dirty"
          class="text-danger"
          >Name is required!</span
        >
        <span
          v-if="!$v.form.name.alpha && $v.form.name.$dirty"
          class="text-danger"
          >Numbers Not Allowed in Name</span
        >
      </b-form-group>
      <b-form-group
        id="input-group-2"
        label="Enter Your Phone number"
        label-for="input-2"
      >
        <b-form-input
          class="input"
          :class="{ error: $v.form.phone.$error }"
          id="input-2"
          v-model="form.phone"
          placeholder="Enter Phone Number"
          required
          @blur="$v.form.phone.$touch()"
        ></b-form-input>
        <span
          v-if="!$v.form.phone.required && $v.form.phone.$dirty"
          class="text-danger"
          >Phone Number is required!</span
        >
        <span
          v-if="!$v.form.phone.numeric && $v.form.phone.$dirty"
          class="text-danger"
          >Only Numbers</span
        >
        <span
          v-else-if="
            (!$v.form.phone.minLength || !$v.form.phone.maxLength) &&
            $v.form.phone.$dirty
          "
          class="text-danger"
          >Phone number must be 10 digit</span
        >
      </b-form-group>
      <b-form-group
        id="input-group-1"
        label="Enter Your Email address"
        label-for="input-3"
      >
        <b-form-input
          class="input"
          id="input-3"
          :class="{ error: $v.form.email.$error }"
          v-model="form.email"
          type="email"
          placeholder="Enter Your email"
          required
          @blur="$v.form.email.$touch()"
        ></b-form-input>
        <span
          v-if="
            $v.form.email.$error && $v.form.email.$dirty && form.email == ''
          "
          class="text-danger"
          >Please enter Email</span
        >
        <span
          v-else-if="
            $v.form.email.$error &&
            $v.form.email.$dirty &&
            $v.form.email.email == false
          "
          class="text-danger"
          >Please enter Valid Email</span
        >
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Enter Your Password"
        label-for="input-4"
      >
        <b-form-input
          class="input"
          :class="{ error: $v.form.password.$error }"
          id="input-4"
          type="password"
          v-model="form.password"
          placeholder="Enter Your password"
          required
          @blur="$v.form.password.$touch()"
        ></b-form-input>
        <span
          v-if="!$v.form.password.required && $v.form.password.$dirty"
          class="text-danger"
          >Password is required!</span
        >
        <span
          v-else-if="
            (!$v.form.password.minLength || !$v.form.password.maxLength) &&
            $v.form.password.$dirty
          "
          class="text-danger"
          >Password must be between
          {{ $v.form.password.$params.minLength.min }} and
          {{ $v.form.password.$params.maxLength.max }} characters!</span
        >
        <span
          v-else-if="
            !$v.form.password.strongPassword && $v.form.password.$dirty
          "
          class="text-danger"
          >Passward must have a to z and 0 to 9 and special char</span
        >
      </b-form-group>

      <b-button
        class="btn mb-3"
        type="submit"
        variant="primary"
        :disabled="isFormInvalid"
        >Submit</b-button
      >
      <span class="text-danger" v-if="errormsg">{{ errormsg }}</span>
      <error-component v-if="errormsg" :error="errormsg">
        <template #default>
          <p>Unfortunately, There is Something Wrong</p>
          <!-- <p>
            Please check all inputs and make sure you enter at least a few
            characters into each input field.
          </p> -->
        </template>
        <template #actions>
          <base-button @click="confirmError">Okay</base-button>
        </template></error-component
      >
    </b-form>
  </div>
</template>

<script>
import {
  required,
  minLength,
  maxLength,
  alpha,
  email,
  numeric,
} from "vuelidate/lib/validators";
import axios from "axios";
export default {
  data() {
    return {
      form: {
        email: "",
        name: "",
        password: "",
        phone: null,
      },
      errormsg: "",
      submitted: false,
    };
  },
  validations: {
    form: {
      name: {
        required,
        alpha,
      },
      email: {
        required,
        email,
      },
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
    },
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$v.$touch();
      // if (this.$v.$invalid) {
      //   console.log("object");
      //   return;
      // }

      // alert("SUCCESS!! :-)\n\n" + JSON.stringify(this.form));
      axios
        .post("http://localhost:5000/user/signup", this.form)
        .then((response) => {
          this.submitted = true;
          console.log(response);
        })
        .catch((error) => {
          this.errormsg = error.response.data.message;
        });
    },
    navigation() {
      this.$router.push({ name: "homepage" });
    },
    confirmError() {
      this.errormsg = "";
    },
    onReset() {
      
    
      this.form.email = "";
      this.form.name = "";
      this.form.phone = "";
      this.form.password = "";
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