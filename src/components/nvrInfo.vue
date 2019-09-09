<template>
  <div>
    <Modal
      v-model="openFlag"
      title="NVR信息"
      :mask-closable="false"
      width="870px"
      footer-hide
      header-hide
      :closable="false"
    >
      <div class="form_box">
        <Form ref="formValidate" :model="data" :label-width="120">
          <Row>
            <Col span="12">
              <FormItem label="NVR名称" prop="name">
                <Input v-model="data.name" placeholder="请输入NVR名称"></Input>
              </FormItem>
              <FormItem label="IP地址" prop="ip">
                <Input v-model="data.ip" placeholder="请输入IP地址"></Input>
              </FormItem>
              <FormItem label="端口" prop="port">
                <Input v-model="data.port" placeholder="请输入端口"></Input>
              </FormItem>
              <FormItem label="通道数" prop="channels">
                <Input v-model="data.channels" placeholder="请输入通道数"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="用户名" prop="name">
                <Input v-model="data.username" placeholder="请输入用户名"></Input>
              </FormItem>
              <FormItem label="密码" prop="password">
                <Input v-model="data.password" placeholder="请输入密码"></Input>
              </FormItem>
              <FormItem label="备注" prop="remark">
                <Input v-model="data.remark" placeholder="请输入备注"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="bar_box clearfix">
        <!-- <a href="javascript:void(0)" @click="delData">删除NVR</a> -->
        <div class="btn_box">
          <input type="button" value="取消" class="solid_btn" @click="closeDialog" />
          <input type="button" value="确定" class="full_btn" @click="saveData" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "cameraInfo",
  data() {
    return {
      ruleValidate: {
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        mail: [
          {
            required: true,
            message: "Mailbox cannot be empty",
            trigger: "blur"
          },
          { type: "email", message: "Incorrect email format", trigger: "blur" }
        ],
        city: [
          {
            required: true,
            message: "Please select the city",
            trigger: "change"
          }
        ],
        gender: [
          { required: true, message: "Please select gender", trigger: "change" }
        ],
        interest: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "Choose at least one hobby",
            trigger: "change"
          },
          {
            type: "array",
            max: 2,
            message: "Choose two hobbies at best",
            trigger: "change"
          }
        ],
        date: [
          {
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
          }
        ],
        time: [
          {
            required: true,
            type: "string",
            message: "Please select time",
            trigger: "change"
          }
        ],
        desc: [
          {
            required: true,
            message: "Please enter a personal introduction",
            trigger: "blur"
          },
          {
            type: "string",
            min: 20,
            message: "Introduce no less than 20 words",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: ["openFlag", "funtionFlag", "data"],
  watch: {
    openFlag(val) {
      if (val) {
        if (this.funtionFlag == "add") {
        }
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closePopup");
    },
    handleSubmit(name) {
      // this.$refs[name].validate(valid => {
      //   if (valid) {
      //     this.$Message.success("Success!");
      //   } else {
      //     this.$Message.error("Fail!");
      //   }
      // });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    saveData() {
      //修改数据
      if (this.data.id) {
        this.$api.wareHouse.reviewNvr(this.data.id, this.data).then(res => {
          console.log(res);
          this.$Message.success("修改成功");
          this.$emit("queryAllData");
          this.closeDialog();
        });
      } else {
         this.$api.wareHouse.addNvr(this.data).then(res => {
          console.log(res);
          this.$Message.success("新增成功");
          this.$emit("queryAllData");
          this.closeDialog();
        });
      }
    },
  }
};
</script>

<style scoped>
.form_box {
  padding: 30px 50px;
  text-align: left;
}
.bar_box {
  text-align: left;
  line-height: 40px;
  padding: 0 50px 30px;
}
.bar_box a {
  font-size: 20px;
  color: #ff0e2f;
}
.bar_box a:hover {
  color: #de001e;
}
.btn_box {
  float: right;
}
.btn_box input {
  display: inline-block;
  border-radius: 6px;
  min-width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  text-align: center;
  border: 1px #071826 solid;
  font-size: 16px;
  margin-left: 15px;
  outline: none;
  cursor: pointer;
}
.solid_btn {
  border: 1px #071826 solid;
  background: none;
  color: #071826;
}
.full_btn {
  background: #071826;
  color: #fff;
}
.ivu-modal-footer {
  border: 0 !important;
}
</style>
