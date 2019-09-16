<template>
  <div>
    <!--tab-->
     <!--编辑NVR弹框-->
    <edit-NVR
      :openFlag="nvrFlag"
      :funtionFlag="nvrF"
      :data="itemNvr"
      @closePopup="closePopup"
      @queryAllData="queryAllData"
    ></edit-NVR>
    <Row>
      <Col span="6">
        <div class="nvr_tab">
          <ul>
            <li
              :class="{'current': selectedNvr === index}"
              v-for="(item,index) in nvrList"
              @click="tabNvr($event,index)"
              :key="item.id"
            >
              <span>
                {{ item.name }}
                <a
                  href="javascript:void(0)"
                  @click="delNvr($event,item)"
                  class="delnvr_btn"
                >
                  <Icon type="md-close" />
                </a>
              </span>
              <a href="javascript:void(0)" @click="openNvrInfo('edit',item)" class="edit_btn">编辑</a>
            </li>
          </ul>
        </div>
        <a href="javascript:void(0)" class="nvr_card" @click="openNvrInfo('add',{})">新增NVR</a>
      </Col>
      <Col span="18" v-if="selectedNvr === 0 || selectedNvr">
        <div class="camera_box">
         
          <ul style="position:absolute;display:block;width:100%;">
            <li
              v-for="(item,i) in cameraList"
              @click="editCamera($event,i)"
              :class="{'menu_li':true,'current':selectedCamera === i}"
              :key="item.id"
            >{{item.name}}
            <div class="move_to" v-if="item.id">
              <Icon type="ios-arrow-forward" />
               <div class="move_list">
                 <h4>移动到</h4>
                  <ul>
                    <li v-for="(item2,index2) in nvrList" :key="item2.id" @click="moveTonvr(i,item2)" v-if="item.nvr.id != item2.id">
                      {{item2.name}}
                    </li>
                  </ul>
              </div>
            </div>
            </li>
          </ul>
        </div>
        <a href="javascript:void(0)" class="add_btn" @click="addCamera">新增摄像头</a>
      </Col>
    </Row>
   
   
  </div>
</template>

<script>
import editNVR from "@/components/nvrInfo";
export default {
  name: "sideMenu",
  components: {
    editNVR
  },
  props: ["nvrList", "isChanged"],
  data() {
    return {
      allNvrData: {},
      cameraList: [],
      selectedCamera: "",
      selectedNvr: "",
      nvrFlag: false,
      itemNvr: {},
      cameraFlag: false,
      cameraF: "add",
      nvrF: "add",
      defaultCamera: {}
    };
  },
  mounted() {},
  watch: {
    // 监听是否有选择摄像头
    selectedCamera(val) {
      let itemData = {};
      let flag;
      if (val === 0 || val) {
        flag = true;
        if (this.nvrList[this.selectedNvr].cameras) {
          //新增摄像头成功后ID未刷新问题
          this.cameraList = this.nvrList[this.selectedNvr].cameras;
        }
        if (!this.cameraList[val].id) {
          //新增
          itemData = this.defaultCamera;
        } else {
          // 编辑摄像头
          itemData = this.cameraList[val];
        }
      }
      // this.$emit("clickedCamera", flag, itemData);
    }
  },
  methods: {
    moveTonvr(i,item){
      //移动到分组
      this.$Modal.confirm({
        title: "提示",
        content:
          "请确认是否将摄像头【" + this.cameraList[i].name + "】移动至NVR【" + item.name + "】中?",
        onOk: () => {
          //组装参数
          let params = JSON.parse(JSON.stringify(this.cameraList[i]));
          params.nvr.id = item.id;
          this.$api.wareHouse.reviewCamera(this.cameraList[i].id, params).then(res => {
            this.cameraList[i].nvr.id = item.id;
            this.cameraList.splice(i,1);
            this.$emit("changeShowCameraFlag",false);
            this.$Message.success("移动成功");
            this.queryAllData();
          });
        },
        onCancel: () => {}
      });
    },
    delCamera(id) {
      this.cameraList.splice(this.selectedCamera, 1);
    },
    queryAllData() {
      this.$emit("queryAllData");
    },
    delNvr(event, item) {
      //删除NVR
      event.stopPropagation();
      this.$Modal.confirm({
        title: "提示",
        content:
          "请确认是否删除NVR【" + item.name + "】删除后不可恢复，确认要删除吗",
        onOk: () => {
          this.$api.wareHouse.delNvr(item.id).then(res => {
            this.$Message.success("删除成功");
            this.queryAllData();
          });
        },
        onCancel: () => {}
      });
    },
    openNvrInfo(flag, data) {
      //打开NVR信息
      this.nvrFlag = true;
      this.navF = flag;
      let a = JSON.parse(JSON.stringify(data));
      
      for (let item in a) {
        console.log(typeof a[item])
        if (typeof a[item] === 'number') {
          a[item] += '';
        }
      }
      this.itemNvr = a;
    },
    closePopup() {
      this.nvrFlag = false;
    },
    closeCamera() {
      this.cameraFlag = false;
    },
    addCamera() {
      // //新增摄像头
      if (this.isChanged) {
        this.$Modal.confirm({
          title: "提示",
          content: "您有未保存的修改，确认离开吗？",
          onOk: () => {
            //确认离开
            let defaultCamera = {
              name: "",
              nvr: {
                id: this.nvrList[this.selectedNvr].id
              },
              zones: []
            };
            this.cameraList.push(defaultCamera);
            this.defaultCamera = defaultCamera;
            this.selectedCamera = this.cameraList.length
              ? this.cameraList.length - 1
              : 0;
            this.$emit("clickedCamera", false, defaultCamera);
          },
          onCancel: () => {
            //取消离开
          }
        });
      } else {
        let defaultCamera = {
          name: "",
          nvr: {
            id: this.nvrList[this.selectedNvr].id
          },
          zones: []
        };
        this.cameraList.push(defaultCamera);
        this.defaultCamera = defaultCamera;
        this.selectedCamera = this.cameraList.length
          ? this.cameraList.length - 1
          : 0;
        this.$emit("clickedCamera", false, defaultCamera);
      }
    },
    updateCameraList() {
      this.cameraList = this.nvrList[this.selectedNvr].cameras;
    },
    editCamera(event, i) {
      let target = event.target;
      if (event.target.className.indexOf("menu_li") != -1) {
        if (this.isChanged) {
          this.$Modal.confirm({
            title: "提示",
            content: "您有未保存的修改，确认离开吗？",
            onOk: () => {
              //确认离开
              if (!this.cameraList[this.selectedCamera].id) {
                this.delCamera();
              }
              this.selectedCamera = i;
              this.$emit("clickedCamera", true, this.cameraList[i]);
            },
            onCancel: () => {
              //取消离开
            }
          });
        } else {
          this.selectedCamera = i;
          this.$emit("clickedCamera", true, this.cameraList[i]);
        }
      }
    },
    tabNvr(event, i) {
      //NVR tab切换
      event.preventDefault();
      if (this.isChanged) {
        this.$Modal.confirm({
          title: "提示",
          content: "您当前有未保存的修改，确认离开吗？",
          onOk: () => {
            //确认离开
            this.$store.commit("changeAreaFlag", false);
            this.selectedCamera = "";
            this.selectedNvr = i;
            this.queryAllData();
            this.cameraList = this.nvrList[i].cameras;
            this.$emit("updateCameraInfo", 0, "tabNvr");
          },
          onCancel: () => {
            //取消离开
          }
        });
      } else {
        this.selectedCamera = "";
        this.selectedNvr = i;
        this.cameraList = this.nvrList[i].cameras;
        this.$emit("updateCameraInfo", 0, "tabNvr");
      }
    }
  }
};
</script>

<style scope>
/*菜单*/
.ivu-layout-sider {
  background: #283847;
  position: fixed;
  left: 0;
  top: 35px;
  bottom: 0;
  z-index: 10;
}
.nvr_tab {
  width: 50px;
}
.nvr_tab li {
  line-height: 20px;
  font-size: 14px;
  text-align: center;
  position: relative;
  margin-bottom: 5px;
  height: 70px;
  transition: 0.5s;
}
.nvr_tab li:hover span {
  width: 50px;
  position: absolute;
  z-index: 2;
  width: auto;
  min-width: 50px;
}

.nvr_tab li span,
.nvr_card {
  display: block;
  padding: 10px 5px;
  height: 50px;
  color: #fff;
  border-top-right-radius: 8px;
  background: #4d6e87;
  cursor: pointer;
}
.nvr_tab li span {
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: width 0.3s;
  width: 50px;
  padding: 15px 5px;
  overflow: hidden;
}
/* .nvr_tab li span:hover, */
.nvr_tab li.current span {
  background: #071826;
  color: #fff;
}
.nvr_tab li span:hover{
  width:auto;
}
.edit_btn {
  color: #4d6e87;
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 20px;
  line-height: 20px;
  width: 100%;
  border-bottom-right-radius: 8px;
  text-align: center;
}
.nvr_tab li:hover .delnvr_btn {
  display: block;
}
.delnvr_btn {
  display: none;
  position: absolute;
  right:2px;
  top: -3px;
  font-size: 14px;
  color: #fff;
}
.delnvr_btn:hover{
  color:#ff0000;
}
.nvr_card {
  background: #071826;
  color: #fff;
  font-size: 14px;
  width: 50px;
  text-align: center;
  height: 65px;
  border-bottom-right-radius: 8px;
}
.nvr_card:hover {
  color: #eee;
}
.camera_box {
  background: #4d6e87;
  height: calc(100vh - 35px - 42px);
  overflow-y: auto;
}
.camera_box li {
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px #142e44 solid;
  color: #fff;
  cursor: pointer;
  position: relative;
}
.camera_box li:hover,
.camera_box li.current {
  background: #071826;
}
.ivu-checkbox {
  margin-right: 10px;
}

.add_btn {
  display: block;
  height: 42px;
  line-height: 42px;
  text-align: center;
  color: #fff;
  background: #071826;
}
.add_btn:hover {
  color: #fff;
  background: #142e44;
}
.move_to{
  position: absolute;
  right:0;
  width:24px;
  top:-1px;
}
.move_to:hover .move_list{
  display:block;
}
.move_list{
  display:none;
  position: absolute;
  right:-140px;
  top:1px;
  width:140px;
  background: #4d6e87;
  border-left:1px #142e44 solid;
  border-right:1px #142e44 solid;
}
.move_list li{
  height:35px;
  line-height: 35px;
}
.move_list h4{
  padding-left:20px;
  font-weight: normal;
  background:#224463;
}
</style>
