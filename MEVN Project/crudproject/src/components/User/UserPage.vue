<template>
  <div>
    <div class="mt-2 px-1">
      <h4 class="text-center">Welcome {{ getloginuser.name }}</h4>
    </div>
    <b-card header="User Details">
      <b-list-group>
        <b-list-group-item class="flex-column align-items-start">
          <div>
            <h5 class="mb-2">Name: {{ getloginuser.name }}</h5>
          </div>
        </b-list-group-item>

        <b-list-group-item class="flex-column align-items-start">
          <div>
            <h5 class="mb-2">Email:{{ getloginuser.email }}</h5>
          </div>
        </b-list-group-item>
        <b-list-group-item class="flex-column align-items-start">
          <div>
            <h5 class="mb-2">Phone:{{ getloginuser.phone }}</h5>
          </div>
        </b-list-group-item>

        <b-list-group-item class="flex-column align-items-start">
          <div>
            <h5 class="mb-2">Role:{{ getloginuser.Usertype }}</h5>
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <div class="mt-2 d-flex justify-content-center align-items-center">
      <b-button class="align-center" @click="edituser"
        >Edit your Details Here</b-button
      >
    </div>
    <b-modal title="Edit User Details" v-model="modalShow">
      <b-form>
        <b-form-group
          id="input-group-1"
          label="Enter Your Name "
          label-for="input-3"
        >
          <b-form-input
            class="input"
            id="input-3"
            v-model="form.name"
            placeholder="Enter Your email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-2"
          label="Enter Your Phone number"
          label-for="input-2"
        >
          <b-form-input
            class="input"
            id="input-2"
            v-model="form.phone"
            placeholder="Enter Phone Number"
            required
          ></b-form-input>
        </b-form-group>
      </b-form>
      <template #modal-footer>
        <div class="w-100">
          <b-button
            variant="primary"
            size="sm"
            class="float-right ml-2"
            @click="modalShow = false"
          >
            Cancel
          </b-button>
          <b-button
            @click="edituserfinal"
            variant="primary"
            size="sm"
            class="float-right"
          >
            Submit
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      modalShow: false,
      form: {
        id: this.$store.state.loginuser._id,
        name: this.$store.state.loginuser.name,
        phone: this.$store.state.loginuser.phone,
      },
    };
  },
  computed: {
    ...mapGetters(["getloginuser"]),
  },
  methods: {
    ...mapActions(["edituserone"]),
    edituser() {
      this.modalShow = true;
    },
    edituserfinal() {
      axios
        .post("http://localhost:5000/user/edituser", this.form)
        .then((res) => {
          this.edituserone(res.data);
          this.modalShow = false;
          this.errormessage("success", "User edited Successfully");
        })

        .catch((err) => {
          this.errormessage("danger", err.response.data.message);
        });
    },
  },
};
</script>