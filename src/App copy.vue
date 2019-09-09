<template>
  <div id="app">
    <Layout>
      <Header>
        <div class="file_bar">
          <a href="javascript:void(0)" class="set_btn">
            <Icon type="md-settings" />设置
          </a>
        </div>
      </Header>
      <Layout>
        <Sider hide-trigger width="220">
          <!--tab-->
          
          <!--=S NVR content-->
          <div class="nvr_content">
            <Menu active-name="1-2" :open-names="['1']" width="220px" theme="dark">
              <Submenu name="1">
                <template slot="title">
                  <div class="title_box">
                    192.168.0.1
                    <div class="del_nvr">
                      <Icon type="ios-trash-outline" size="20" color="#fff" />
                    </div>
                    <div class="edit_nvr" @click="openNVRInfo">
                      <Icon type="md-create" size="20" color="#fff" />
                    </div>
                  </div>
                </template>
                <CheckboxGroup v-model="checkAllGroup">
                <MenuItem name="1-1"><Checkbox label="摄像头01"></Checkbox></MenuItem>
                <MenuItem name="1-2"><Checkbox label="摄像头02"></Checkbox></MenuItem>
                <MenuItem name="1-3"><Checkbox label="摄像头03"></Checkbox></MenuItem>
                 </CheckboxGroup>
              </Submenu>
            </Menu>
          </div>
          <!--=E NVR content-->
          <!--tab-->
          <!---->
        </Sider>
        <Content>
          <!--=S 颜色和透明度选择-->
          <div class="toolbar">
            <div class="set_box">
              <Row>
                <Col span="8">
                  <div class="setting_wrap">
                    <span class="field_name">颜色：</span>
                    <ColorPicker v-model="color" size="small" placement="bottom-start" alpha />
                  </div>
                </Col>
                <Col span="8">
                  <div class="setting_wrap">
                    <span class="field_name">描边：</span>
                    <Select v-model="strokeVal" size="small" style="width:76px;">
                      <Option
                        v-for="item in strokeWidthList"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
                  </div>
                </Col>
                <Col span="8">
                  <div class="setting_wrap" style="padding-left:70px;">
                    <span class="field_name">透明度：</span>
                    <Select v-model="alphaVal" size="small" style="width:76px;">
                      <Option
                        v-for="item in alphaList"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div style="min-height:800px;"></div>
          <!--=E 颜色和透明度选择-->
        </Content>
        <div class="right_bar"></div>
      </Layout>
    </Layout>
    <!-- <router-view /> -->
    <!--编辑NVR弹框-->
    <edit-NVR :nvrFlag="nvrFlag"></edit-NVR>
  </div>
</template>

<script>
import editNVR from "@/components/editNVR";
export default {
  name: "App",
  components: {
    editNVR
  },
  data() {
    return {
      color: "#ff0000",
      strokeVal: 1,
      alphaVal: 1,
      strokeWidthList: [
        { value: 1, label: "1像素" },
        { value: 2, label: "2像素" },
        { value: 3, label: "3像素" },
        { value: 5, label: "5像素" },
        { value: 10, label: "10像素" }
      ],
      alphaList: [
        { value: 1, label: "100%" },
        { value: 0.9, label: "90%" },
        { value: 0.8, label: "80%" },
        { value: 0.5, label: "50%" },
        { value: 0, label: "0%" }
      ],
      nvrFlag: false
    };
  },
  methods: {
    openNVRInfo(event) {
      this.nvrFlag = true;
      e.preventDefault();
    }
  }
};
</script>

<style scope>
.ivu-layout-header {
  background: #283847;
  padding: 0 20px;
  height: 35px;
  line-height: 35px;
  border-bottom: 1px #071826 solid;
}
.file_bar {
}
.set_btn {
  color: #fff;
  font-size: 18px;
  position: relative;
  display: inline-block;
  padding-left: 23px;
}
.set_btn i {
  position: absolute;
  left: 0;
  top: 7px;
}
.tab_title {
}
.tab_title li {
  float: left;
  width: 50%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
.tab_title li:hover,
.tab_title li.current {
  background: #071826;
}
.right_bar {
  width: 390px;
  background: #283847;
}

.toolbar {
  padding: 0 25px;
  background: #283847;
  height: 50px;
  line-height: 50px;
}
.set_box {
  width: 500px;
}
.setting_wrap {
  position: relative;
  padding-left: 50px;
}
.setting_wrap .field_name {
  position: absolute;
  left: 0;
  top: 0;
  color: #fff;
}

/*菜单*/
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
  background: #071826;
}
.ivu-menu-light.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):after {
  right: auto;
  left: 0;
}
.title_box {
  position: relative;
}
.del_nvr {
  position: absolute;
  right: 57px;
  top: -2px;
}
.edit_nvr {
  position: absolute;
  right: 27px;
  top: -2px;
}
.ivu-menu-vertical .ivu-menu-submenu-title-icon {
  right: 12px;
}
.ivu-layout-sider{
  position: fixed;
  bottom:0;
  top:35px;
}
.ivu-layout-content{
  margin-left: 220px;
}
</style>
