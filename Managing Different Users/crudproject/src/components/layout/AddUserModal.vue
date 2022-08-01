<template>
  <div>
    <a-button type="primary" @click="adduser">Add User</a-button>
    <a-modal
      v-model:visible="visible"
      title="Add User Details"
      :footer="null"
      @cancel="reset"
    >
      <a-form
        :model="form"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 13 }"
        autocomplete="on"
        @finishFailed="onFinishFailed"
        @finish="onFinish"
        @afterClose="reset"
      >
        <h1 style="margin-left: 150px">Sign Up Here</h1>
        <a-form-item
          label="Name"
          name="name"
          :rules="[{ required: true, message: 'Please Enter Your Name' }]"
        >
          <a-input v-model:value="form.name" />
        </a-form-item>

        <a-form-item
          label="Email"
          name="email"
          :rules="[
            {
              required: true,
              type: 'email',
              message: 'Please Enter Your Email',
            },
          ]"
        >
          <a-input v-model:value="form.email" />
        </a-form-item>

        <a-form-item
          label="Phone"
          name="phone"
          :rules="[
            { required: true, message: 'Please Enter Your Phone Number' },
          ]"
        >
          <a-input v-model:value="form.phone" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please Enter Your Password' }]"
        >
          <a-input-password v-model:value="form.password" />
        </a-form-item>
        <a-alert v-if="error" :message="error" type="error" show-icon />
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template> 
<script>
import { ref } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { useStore } from "vuex";

export default {
  setup() {
    const visible = ref(false);
    const store = useStore();
    const adduser = function () {
      visible.value = true;
    };
    const form = ref({
      name: "",
      email: "",
      phone: null,
      password: "",
      creator:store.state.loginuser.email,
    });
    const errormsg = ref("");
    const onFinish = () => {
      console.log(form.value);
      axios
        .post("http://localhost:5000/user/signup", form.value)
        .then((response) => {
          store.dispatch("adduseraction", response.data.result);
          reset();
          visible.value = false;
          message.success("User Added Successfully");
        })
        .catch((error) => {
          errormsg.value = error.response.data.message;
        });
    };
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    const reset = () => {
      form.value.email = "";
      form.value.name = "";
      form.value.password = "";
      form.value.phone = "";
    };
    return {
      visible,
      adduser,
      onFinish,
      onFinishFailed,
      form,
      reset,
      error: errormsg,
    };
  },
};
</script>