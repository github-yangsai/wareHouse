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
        <Form ref="formValidate" :model="data" :rules="ruleValidate" :label-width="120">
          <Row>
            <Col span="12">
              <FormItem label="NVR名称" prop="name">
                <Input v-model="data.name" placeholder="请输入NVR名称" />
              </FormItem>
              <FormItem label="IP地址" prop="ip">
                <Input v-model="data.ip" placeholder="请输入IP地址" />
              </FormItem>
              <FormItem label="端口" prop="port">
                <Input v-model="data.port" placeholder="请输入端口" />
              </FormItem>
              <FormItem label="通道数" prop="channels">
                <Input v-model="data.channels" placeholder="请输入通道数" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="用户名" prop="username">
                <Input v-model="data.username" placeholder="请输入用户名" />
              </FormItem>
              <FormItem label="密码" prop="password">
                <Input v-model="data.password" placeholder="请输入密码" />
              </FormItem>
              <FormItem label="备注" prop="remark">
                <Input v-model="data.remark" type="textarea" placeholder="请输入备注" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="bar_box clearfix">
        <!-- <a href="javascript:void(0)" @click="delData">删除NVR</a> -->
        <div class="btn_box">
          <input type="button" value="取消" class="solid_btn" @click="closeDialog" />
          <input type="button" value="确定" class="full_btn" @click="saveData('formValidate')" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "cameraInfo",
  data() {
    const validatePort = (rule, value, callback) => {
      if (!/^\d+$/.test(value)) {
        callback(new Error("端口号只能是数字"));
      }
    };
    return {
      ruleValidate: {
        name: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur"
          }
        ],
        ip: [
          {
            required: true,
            message: "ip地址不能为空",
            trigger: "blur"
          }
          // { type: "email", message: "Incorrect email format", trigger: "blur" }
        ],
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "change" }
        ],
        // port: [
        //   {
        //     required: true,
        //     message: "端口不能为空",
        //     trigger: "blur",
        //     // validate: validatePort
        //   }
        // ],
        // channels: [
        //   {
        //     required: true,
        //     message: "通道数不能为空",
        //     trigger: "blur"
        //   }
        // ]
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
    // handleReset(name) {
    //   this.$refs[name].resetFields();
    // },
    saveData(name) {
      //修改数据
      this.$refs[name].validate(valid => {
        debugger
        if (valid) {
          //验证通过
          if (this.data.id) {
            this.$api.wareHouse.reviewNvr(this.data.id, this.data).then(res => {
              this.$Message.success("修改成功");
              this.$emit("queryAllData");
              this.closeDialog();
            });
          } else {
            this.$api.wareHouse.addNvr(this.data).then(res => {
              this.$emit("queryAllData");
              this.$Message.success("新增成功");
              this.closeDialog();
            });
          }
        } else {
          //验证不通过
          this.$Message.info("请完善信息");
        }
      });
    }
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
