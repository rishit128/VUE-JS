<template>
  <div>
    <b-input
      v-model="filter"
      class="ml-1"
      placeholder="Filter table.."
      style="width: 20%"
    ></b-input>
    <hr />
    <b-table
      hover="hover"
      head-variant="dark"
      :items="userdata"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      :filter="filter"
    >
      <template #cell(Isapproved)="data">
        {{ data.item.Isapproved ? "Approved" : "Not Approved" }}
      </template>
      <template #cell(actions)="data">
        <b-button variant="outline-primary" @click="Edituser(data.item)">
          Edit
        </b-button>
      </template>
      <template #cell(delete)="data">
        <b-button variant="outline-primary" @click="deleteuser(data)">
          Delete
        </b-button>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
    ></b-pagination>
    <b-modal title="Edit User Details" v-model="modalShow">
      <b-form>
        <b-form-group
          id="input-group-1"
          label="Enter Your Email address"
          label-for="input-3"
        >
          <b-form-input
            class="input"
            id="input-3"
            v-model="form.email"
            disabled
            type="email"
            placeholder="Enter Your email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-select
          v-model="form.usertype"
          :options="options"
        ></b-form-select>
        <b-form-select
          class="mt-3"
          v-model="form.isapproved"
          :options="permission"
        ></b-form-select>
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
            @click="submitedituser"
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
import { mapActions } from "vuex";
export default {
  props: ["userdata"],
  data() {
    return {
      form: {
        email: "",
        usertype: "",
        isapproved: "",
        creator: this.$store.state.loginuser.email,
      },
      filter: "",
      modalShow: false,
      perPage: 5,
      currentPage: 1,
      fields: [
        { key: "name", sortable: true },
    
        { key: "phone", sortable: false },
        { key: "Usertype", sortable: false },
        { key: "Isapproved", sortable: false },
        { key: "actions", label: "Update", sortable: false },
        { key: "Delete", label: "Delete", sortable: false },
        { key: "Createdby", label: "Created By", sortable: false },
        { key: "Updatedby", label: "Updated By", sortable: false },
      ],
      options: [
        { value: "user", text: "User" },
        { value: "Admin", text: "Admin" },
      ],
      permission: [
        { value: true, text: "Approved" },
        { value: false, text: "Not Approved" },
      ],
    };
  },
  methods: {
    ...mapActions(["edituserdata", "deleteuserdata"]),
    Edituser(data) {
      this.modalShow = true;
      this.form.usertype = data.Usertype;
      this.form.email = data.email;
      this.form.isapproved = data.Isapproved;
    },
    deleteuser(data) {
      console.log(data);
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to delete this user?", {
          title: "Delete Message",
          size: "sm",

          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.deleteuserdata(data.item);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitedituser(event) {
      event.preventDefault();
      this.modalShow = false;
      this.edituserdata(this.form);
    },
  },
  computed: {
    rows() {
      return this.userdata.length;
    },
  },
};
</script>