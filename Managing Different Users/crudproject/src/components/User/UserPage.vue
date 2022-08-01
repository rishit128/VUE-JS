<template>
  <div>
    <a-card
      hoverable
      title="User Details Card"
      style="width: 800px; margin: 20px"
      class="background"
    >
      <a-descriptions
        bordered
        style="margin: 20px;"
        title="User Info"
      >
        <a-descriptions-item label="UserName"
          ><a-avatar src="https://joeschmoe.io/api/v1/random"></a-avatar
          >{{store.getters.getloginuser.name}}</a-descriptions-item
        >
        <a-descriptions-item label="Email">{{
          store.getters.getloginuser.email
        }}</a-descriptions-item>
        <a-descriptions-item label="Phone">{{
          store.getters.getloginuser.phone
        }}</a-descriptions-item>
        <a-descriptions-item label="Role">{{
         store.getters.getloginuser.Usertype
        }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
  <div class="align-center">
    <a-button type="primary" @click="adduser">Edit your Details Here</a-button>
  </div>
  <a-modal v-model:visible="visible" title="Edit User Details" :footer="null">
    <a-form
      :model="form"
      name="basic"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 13 }"
      autocomplete="on"
      @finishFailed="onFinishFailed"
      @finish="onFinish"
    >
      <a-form-item
        label="Name"
        name="name"
        :rules="[{ required: true, message: 'Please Enter Your Name' }]"
      >
        <a-input v-model:value="form.name" />
      </a-form-item>

      <a-form-item
        label="Phone"
        name="phone"
        :rules="[{ required: true, message: 'Please Enter Your Phone Number' }]"
      >
        <a-input v-model:value="form.phone" />
      </a-form-item>

      <a-alert v-if="error" :message="error" type="error" show-icon />
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { useStore } from "vuex";
import { ref } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
export default {
  setup() {
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    const store = useStore();
    const visible = ref(false);
    const adduser = function () {
      visible.value = true;
    };
    const form = ref({
      name: store.state.loginuser.name,
      id: store.state.loginuser._id,
      phone: store.state.loginuser.phone,
    });

    const onFinish = () => {
      axios
        .post("http://localhost:5000/user/edituser", form.value)
        .then((res) => {
          store.dispatch("edituserone", res.data);
          visible.value = false;
          message.success("User Edited Successfully");
        })

        .catch((err) => {
          errormsg.value = err.response.data.message;
        });
    };
    const errormsg = ref("");
    return {
      store,
      adduser,
      visible,
      form,
      error: errormsg,
      onFinish,

      onFinishFailed,
    };
  },
};
</script>
<style scoped>
.align-center {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  margin-left: 20px;
}
.background {
  background: rgba(194,180,117,0.5);
-webkit-backdrop-filter: blur(10px);
backdrop-filter: blur(10px);
border: 1px solid rgba(194,180,117,0.25);
}
</style>