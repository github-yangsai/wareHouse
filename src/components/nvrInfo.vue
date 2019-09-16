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
              <FormItem label="备注" prop="comment">
                <Input v-model="data.comment" type="textarea" placeholder="请输入备注" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="bar_box clearfix">
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
  name: "nvrInfo",
  data() {
    const validatePort = (rule, value, callback) => {
      if(!value){
         callback(new Error("端口号不能为空"));
         return false;
      }
      if (!/^\d+$/.test(value)) {
        callback(new Error("端口号只能是数字"));
        return false;
      }
      let numberVal = parseInt(value);
      if (numberVal < 1 || numberVal > 65535) {
        callback(new Error("端口号范围1-65535"));
        return false;
      }
      callback();
    };
    const validateChannels = (rule, value, callback) => {
      if(!value){
         callback(new Error("通道数不能为空"));
         return false;
      }
      if (!/^\d+$/.test(value)) {
        callback(new Error("通道数只能是数字"));
        return false;
      }
      callback();
    };
    const validateIP = (rule, value, callback) => {
      if(!value){
         callback(new Error("ip地址不能为空"));
         return false;
      }
      let reg = /^((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))(\.((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))){3}$/;
      if (!reg.test(value)) {
        callback(new Error("ip地址格式错误"));
        return false;
      }
      callback();
    };
    return {
      resultData:{},
      ruleValidate: {
        name:[
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur"
          }
        ],
        ip:[
          {
            required: true,
            trigger: "blur",
            validator:validateIP
          }
          // { type: "email", message: "Incorrect email format", trigger: "blur" }
        ],
        username:[
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        password:[
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        port: [
          {
            required: true,
            trigger: "blur",
            validator: validatePort
          }
        ],
        channels: [
          {
            required: true,
            trigger: "blur",
            validator: validateChannels
          }
        ]
      }
    };
  },
  props: ["openFlag", "funtionFlag", "data"],
  watch: {
    openFlag(val) {
      if (val) {
        this.$refs.formValidate.resetFields(); //重置
       if(this.funtionFlag != 'add'){
         this.resultData = JSON.parse(JSON.stringify(this.data));
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
      //判断有没有修改数据
      let reviewFlag = false;
      for(let key in this.data){
        if(key != "camera"){
          if(this.data[key] != this.resultData[key]){
            reviewFlag = true;
            break;
          }
        }
      }
      if(reviewFlag){
        this.closeDialog();
        return false;
      }
      //修改数据
      this.$refs[name].validate(valid => {
        if (valid) {
          //验证通过
          let params = JSON.parse(JSON.stringify(this.data));
          params.port = parseInt(params.port);
          params.channels = parseInt(params.channels);
          if (this.data.id) {
            params.id = parseInt(params.id);
            this.$api.wareHouse.reviewNvr(this.data.id, params).then(res => {
              this.$Message.success("修改成功");
              this.$emit("queryAllData");
              this.closeDialog();
            });
          } else {
            this.$api.wareHouse.addNvr(params).then(res => {
              this.$emit("queryAllData");
              this.$Message.success("新增成功");
              this.closeDialog();
            });
          }
        } else {
          //验证不通过
          this.$Message.warning("请完善信息");
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
