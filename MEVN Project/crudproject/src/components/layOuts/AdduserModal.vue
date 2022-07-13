<template>
  <div>
    <b-button class="float-left" @click="adduser">Add User</b-button>
    <b-modal title="Add User Details" hide-footer v-model="editmodal">
      <b-form @submit.prevent="onSubmit" @reset="onReset">
        <h2 class="text-center">Register Here</h2>
        <b-form-group
          id="input-group-2"
          label="Enter Your Name"
          label-for="input-1"
        >
          <b-form-input
            class="input"
            :class="{ error: $v.editform.name.$error }"
            id="input-1"
            v-model.trim="editform.name"
            placeholder="Enter name"
            required
            @blur="$v.editform.name.$touch()"
          ></b-form-input>
          <span
            v-if="!$v.editform.name.required && $v.editform.name.$dirty"
            class="text-danger"
            >Name is required!</span
          >
          <span
            v-if="!$v.editform.name.alpha && $v.editform.name.$dirty"
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
            :class="{ error: $v.editform.phone.$error }"
            id="input-2"
            v-model="editform.phone"
            placeholder="Enter Phone Number"
            required
            @blur="$v.editform.phone.$touch()"
          ></b-form-input>
          <span
            v-if="!$v.editform.phone.required && $v.editform.phone.$dirty"
            class="text-danger"
            >Phone Number is required!</span
          >
          <span
            v-if="!$v.editform.phone.numeric && $v.editform.phone.$dirty"
            class="text-danger"
            >Only Numbers</span
          >
          <span
            v-else-if="
              (!$v.editform.phone.minLength || !$v.editform.phone.maxLength) &&
              $v.editform.phone.$dirty
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
            :class="{ error: $v.editform.email.$error }"
            v-model="editform.email"
            type="email"
            placeholder="Enter Your email"
            required
            @blur="$v.editform.email.$touch()"
          ></b-form-input>
          <span
            v-if="
              $v.editform.email.$error &&
              $v.editform.email.$dirty &&
              editform.email == ''
            "
            class="text-danger"
            >Please enter Email</span
          >
          <span
            v-else-if="
              $v.editform.email.$error &&
              $v.editform.email.$dirty &&
              $v.editform.email.email == false
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
            :class="{ error: $v.editform.password.$error }"
            id="input-4"
            type="password"
            v-model="editform.password"
            placeholder="Enter Your password"
            required
            @blur="$v.editform.password.$touch()"
          ></b-form-input>
          <span
            v-if="!$v.editform.password.required && $v.editform.password.$dirty"
            class="text-danger"
            >Password is required!</span
          >
          <span
            v-else-if="
              (!$v.editform.password.minLength ||
                !$v.editform.password.maxLength) &&
              $v.editform.password.$dirty
            "
            class="text-danger"
            >Password must be between
            {{ $v.editform.password.$params.minLength.min }} and
            {{ $v.editform.password.$params.maxLength.max }} characters!</span
          >
          <span
            v-else-if="
              !$v.editform.password.strongPassword &&
              $v.editform.password.$dirty
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
        <b-button
          variant="primary"
          size="sm"
          class="float-right ml-2"
          @click="cancel"
        >
          Cancel
        </b-button>
     
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
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
      editform: {
        email: "",
        name: "",
        password: "",
        phone: null,
        creator: "",
      },
      editmodal: false,
      errormsg: "",
    };
  },
  methods: {
    ...mapActions(["adduseraction"]),
    adduser() {
      this.editmodal = true;
    },
    onSubmit() {
     
      this.$v.$touch();

      axios
        .post("http://localhost:5000/user/signup", this.editform)
        .then((response) => {
          this.errormessage("success", "User Added Successfully");
          this.adduseraction(response.data.result);


          this.editmodal = false;
          this.$v.editform.$reset();
        })
        .catch((error) => {
     
          this.errormessage("danger", error.response.data.message);
        });
    },
    onReset() {
    
      this.editform.email = "";
      this.editform.name = "";
      this.editform.password = "";
      this.editform.phone = "";
    },
    cancel() {
      
      this.editmodal = false;
      this.onReset();
     this.$v.editform.$reset();
      
    },
  },
  mounted() {
    this.editform.creator = this.$store.state.loginuser.email;
  },
  validations: {
    editform: {
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
  computed: {
    isFormInvalid() {
      // console.log(this.$v.editform);
      return this.$v.editform.$invalid;
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