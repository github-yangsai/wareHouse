<template>
  <div class="login_container">
      <div class="login_all">
    <div id="login" class="login_box">
      <h3>智慧仓库管理后台</h3>
      <div class="login_content">
        <div class="field_box">
          <Input v-model="loginData.username" placeholder="请输入用户名" clearable size="large">
          <Icon type="md-contact" slot="prefix" size="large" />
          </Input>
        </div>
        <div class="field_box">
          <Input
            v-model="loginData.password"
            type="password"
            placeholder="请输入密码"
            @on-keyup="enterLogin"
            clearable
            size="large"
          >
          <Icon type="md-lock" slot="prefix" size="large" />
          </Input>
        </div>
        <div class="login_bar">
          <Button type="primary" @click="login" long>
            <span v-if="!loading">登&nbsp;&nbsp;录</span>
            <span v-else>正在登录...</span>
          </Button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import utils from "../common/utils/utils.js";
export default {
  name: "login",
  components: {},
  data() {
    return {
      btnLoading: false,
      loginData: {
        username: "",
        password: ""
      },
      validCodeShow: false,
      validCodeUrl: ""
    };
  },
  mounted() {},
  methods: {
    enterLogin(e) {
      if (e.keyCode == 13) {
        this.login();
      }
    },
    login() {
      let _this = this;
      let params = this.loginData;
      if (!params.username || !params.password) {
        this.$Message.warning("用户名和密码不能为空");
        return false;
      }
      this.$store.commit("changeLoading", true);
      this.$api.wareHouse
        .login(params)
        .then(res => {
          _this.$store.commit("changeLoading", false);
          if (res.data.access) {
            let token = res.data.access;
            utils.cookies.setItem("token", token);
            localStorage.setItem("token", token);
            _this.$Message.success("登录成功");
            _this.$router.push({ name: "mainFrame" });
          }
        })
        .catch(function(error) {
          _this.$store.commit("changeLoading", false);
        });
    }
  },
  watch: {},
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  }
};
</script>

<style scoped>
.login_container{
    width:100%;
    height:100%;
    position:fixed;
    left:0;
    top:0;
    background:url(../../static/images/login_bg.png) no-repeat;
    background-size:100%;
}
.login_container::after{
    opacity:0.3;
    content:"";
    display:block;
    width:100%;
    height:100%;
    position:fixed;
    z-index: 2;
    background: #000;
    left:0;
    top:0;
}
.login_all{
  width: 60%;
  margin: 5% auto 0;
  background:url(../../static/images/login_box_bg.png) no-repeat;
  background-size:100%;
  position: relative;
  z-index: 5;
}
.login_box {
  width: 47%;
  padding:12% 0 16%;
}
.login_box h3{
    text-align: center;
    height:60px;
    line-height:60px;
    font-size:24px;
    color:#2E384D;
}
.login_content{
    padding:8% 20%;
}
.field_box{
    margin-bottom: 20px;
}

.login_bar .ivu-btn-primary{
    font-size:16px;
    background-color: #283847;
    border-color: #283847
}
.login_bar .ivu-btn-primary:hover{
    background-color: #4d6e87;
    border-color:#4d6e87
}
</style>
<style>
.field_box .ivu-input-large{
    height:40px;
    background: #fff;
}
.field_box .ivu-input-wrapper-large .ivu-input-prefix i,.field_box  .ivu-input-wrapper-large .ivu-input-suffix i{
    line-height: 40px;
}
</style>