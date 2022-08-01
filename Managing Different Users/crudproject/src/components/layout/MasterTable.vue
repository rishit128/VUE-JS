<template>
  <div>
    <a-button
      type="danger"
      v-if="hasSelected"
      @click="multidelete(selectedRowKeys)"
    >
      Delete Selected items
    </a-button>
    <span style="margin-left: 8px">
      <template v-if="hasSelected">
        {{ `Selected ${selectedRowKeys.length} items` }}
      </template>
    </span>

    <a-table
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :pagination="{ pageSize: 5 }"
      :dataSource="dataSource"
      :columns="columns"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span style="color: #1890ff">Name</span>
        </template>
      </template>
      <template
        #customFilterDropdown="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
      >
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="
              (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            "
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            <!-- <template #icon><SearchOutlined /></template> -->
            Search
          </a-button>
          <a-button
            size="small"
            style="width: 90px"
            @click="handleReset(clearFilters)"
          >
            Reset
          </a-button>
        </div>
      </template>
      <!-- <template #customFilterIcon="{ filtered }">
        <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template> -->
      <template #bodyCell="{ column, record, text }">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
            >
              {{ fragment }}
            </mark>
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-if="column.key === 'Isapproved'">
          {{ record.Isapproved ? "Approved" : "Not Approved" }}
        </template>
        <template v-if="column.key === 'edit'">
          <a-button type="primary" @click="edituser(record)">Edit</a-button>
        </template>
        <template v-if="column.key === 'delete'">
          <a-popconfirm
            title="Are you sure delete this User?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirm(record)"
            @cancel="cancel"
          >
            <a-button type="danger">Delete</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
    <a-modal v-model:visible="visible" title="Edit User Details" :footer="null">
      <a-form :model="form" name="basic" autocomplete="on">
        <a-form-item label="Email" name="email">
          <a-input disabled v-model:value="form.email" />
        </a-form-item>
        <a-form-item name="role" label="Role">
          <a-select
            v-model:value="form.usertype"
            placeholder="Please select a Role"
          >
            <a-select-option value="user">User</a-select-option>

            <a-select-option value="Admin">Admin</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="permisssion" label="permission">
          <a-select v-model:value="form.isapproved">
            <a-select-option :value="true">Approved</a-select-option>

            <a-select-option :value="false">Not Approved</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" @click="submitedituser" html-type="submit"
            >Submit</a-button
          >
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>



<script>
import { computed, ref, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
export default {
  props: ["userdata"],
  setup(props) {
    const store = useStore();
    const dataSource = computed(function () {
      return props.userdata;
    });

    const visible = ref(false);
    const edituser = function (user) {
      console.log(user);
      visible.value = true;
      form.value.email = user.email;
      form.value.usertype = user.Usertype;
      form.value.isapproved = user.Isapproved;
    };
    const submitedituser = function () {
      visible.value = false;
      store
        .dispatch("edituserdata", form.value)
        .then(message.success("User Edited Successfully"));
    };
    const confirm = (record) => {
      store.dispatch("deleteuserdata", record);
      message.success("User Deleted  Successfully");
    };

    const cancel = (e) => {
      console.log(e);
      message.error("Click on No");
    };
    const form = ref({
      email: "",
      usertype: "",
      isapproved: false,
      creator: store.state.loginuser.email,
    });
    const state = reactive({
      selectedRowKeys: [],
      searchText: "",
      searchedColumn: "",
    });
    const searchInput = ref();
    const onSelectChange = (selectedRowKeys, selectedRows) => {
      console.log("selectedRowKeys changed: ", selectedRows);
      state.selectedRowKeys = selectedRowKeys;
    };
    const hasSelected = computed(() => state.selectedRowKeys.length > 0);
    const multidelete = function (userdata) {
      store.dispatch("multiuserdelete", userdata).then(() => {
        message.success("All Selected Users Deleted");
        state.selectedRowKeys = [];
      });
    };
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      state.searchText = selectedKeys[0];
      state.searchedColumn = dataIndex;
    };

    const handleReset = (clearFilters) => {
      clearFilters({
        confirm: true,
      });
      state.searchText = "";
    };
    return {
      handleSearch,
      handleReset,
      multidelete,
      onSelectChange,
      hasSelected,
      ...toRefs(state),
      columns: [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          customFilterDropdown: true,
          onFilter: (value, record) =>
            record.name.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                searchInput.value.focus();
              }, 100);
            }
          },
        },
        {
          title: "Phone Number",
          dataIndex: "phone",
        },
        {
          title: "User Role",
          dataIndex: "Usertype",
        },
        {
          title: "Permission",
          dataIndex: "Isapproved",
          key: "Isapproved",
        },
        {
          title: "Createdby",
          dataIndex: "Createdby",
        },
        {
          title: "Updatedby",
          dataIndex: "Updatedby",
        },
        {
          dataIndex: "edit",

          title: "Edit",

          key: "edit",
        },
        {
          dataIndex: "delete",

          title: "Delete",

          key: "delete",
        },
      ],
      dataSource,
      edituser,
      visible,
      form,
      submitedituser,
      confirm,
      cancel,
      searchInput,
    };
  },
};
</script>