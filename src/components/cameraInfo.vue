<template>
  <div>
    <Modal
      v-model="openFlag"
      title="摄像头信息"
      :mask-closable="false"
      width="570px"
      footer-hide
      header-hide
      :closable="false"
    >
      <div class="form_box">
        <Form ref="formValidate" :label-width="100">
           <!-- :model="formValidate" :rules="ruleValidate" -->
              <FormItem label="摄像头名称" prop="name">
                <Input v-model="formValidate.name" placeholder="请输入摄像头名称"></Input>
              </FormItem>
              <FormItem label="rtsp地址" prop="mail">
                <Input v-model="formValidate.mail" placeholder="请输入rtsp地址"></Input>
              </FormItem>
              <FormItem label="通道数" prop="mail">
                <Input v-model="formValidate.mail" placeholder="请输入通道数"></Input>
              </FormItem>
        </Form>
        <div style="text-align:center">
          <a href="javascript:void(0)" class="capture_btn">点击截屏</a>
        </div>
        
      </div>
      <div class="bar_box clearfix">
        <a href="javascript:void(0)" @click="delData">删除摄像头</a>
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
      formValidate: {
        name: "",
        mail: "",
        city: "",
        gender: "",
        interest: [],
        date: "",
        time: "",
        desc: ""
      },
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
  props: ["openFlag","funtionFlag"],
  methods: {
    closeDialog() {
      this.$emit("closePopup");
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    saveData() {
      //保存数据
      this.closeDialog();
    },
    delData(){
      //删除数据
      alert("删除");
      this.closeDialog();
    },
    confirmDel() {
      //确认要删除
      // this.$Modal.confirm({
      //   render: h => {
      //     return h("p", {
      //       props: {
      //         html: "确认删除？"
      //       },
      //       on: {
              
      //       }
      //     });
      //   }
      // });
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
.capture_btn {
  min-width: 72px;
  display: inline-block;
  height: 35px;
  line-height: 35px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  font-size: 16px;
  background: #071826;
  padding: 0 20px;
  margin: 0 20px;
}
.capture_btn:hover {
  background: #4d6e87;
  color: #fff;
}
</style>
