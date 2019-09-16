<template>
  <div>
    <view-config :data="configCSV" :openFlag="viewConfigFlag" @closePopup="closeConfig"></view-config>
    <!-- =S 倒计时动画-->
    <div class="countdown_tips" v-if="countDownFlag">
      <i-circle
        :percent="countdownPercent"
        stroke-color="#2db7f5"
        :size="200"
        :stroke-width="8"
        :trail-width="8"
      >
        <!-- <Icon v-if="percent == 100" type="ios-checkmark" size="60" style="color:#5cb85c"></Icon> -->
        <span style="font-size:40px" class="text">{{ seconds }}s</span>
      </i-circle>
    </div>
    <!-- =E 倒计时动画-->
    <Spin size="large" fix v-if="loading"></Spin>
    <Layout class="con_wrap">
      <Header>
        <div class="file_bar">
          <Dropdown trigger="click" @on-click="setOption">
            <a href="javascript:void(0)" class="set_btn">
              <Icon type="md-settings" />设置
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="restartServer">重启服务器</DropdownItem>
              <DropdownItem name="viewTable">查看配置表</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div class="toolbar clearfix">
          <div class="r_btnbox" v-if="showCameraFlag">
            <Button type="default" ghost @click="cancelSave">取消</Button>
            <Button type="primary" @click="saveAllData" :disabled="notSave">保存</Button>
          </div>
          <div
            class="setting_wrap"
            style="float:right;padding-right:20px;"
            v-if="showCameraFlag && this.cameraInfo.img_url && cameraInfo.img_url!='http://'"
          >
            <span class="field_name">描边：</span>
            <InputNumber
              :max="10"
              :min="1"
              v-model="strokeVal"
              @on-change="changeLinewidth"
              :disabled="selectedArea==-1"
            ></InputNumber>
            <!-- <Input v-model="strokeVal" type="number"></Input> -->
            <!-- <Select v-model="line_width" size="small" style="width:76px;">
              <Option
                v-for="item in strokeWidthList"
                :value="item.line_width"
                :key="item.line_width"
              >{{ item.label }}</Option>
            </Select>-->
          </div>

          <div
            class="function_box"
            v-if="showCameraFlag"
            style="float:left;position:absolute;left:250px;top:0;"
          >
            <div class="clearfix">
              <div class="clearfix fill_box">
                <span class="field">编号：</span>
                <Input v-model="cameraInfo.no" placeholder="请输入编号" style="width:80px" />
              </div>
              <div class="clearfix fill_box">
                <span class="field">摄像头名称：</span>
                <Input v-model="cameraInfo.name" placeholder="请输入摄像头名称" />
              </div>
              <div class="clearfix fill_box">
                <span class="field">rtsp地址：</span>
                <Input v-model="cameraInfo.rtsp_url" placeholder="请输入rtsp地址" />
              </div>
              <div class="clearfix fill_box">
                <span class="field">输出通道号：</span>
                <Input v-model="cameraInfo.nvr_channel" type="number" style="width:50px;" />
              </div>
              <div class="clearfix fill_box">
                <span class="field">输出端口：</span>
                <Input v-model="cameraInfo.output_port" type="number" style="width:70px;" />
              </div>
              <div class="fill_box">
                <a href="javascript:void(0)" class="capture_btn" @click="clickCapture">点击截屏</a>
                <a
                  href="javascript:void(0)"
                  class="del_btn"
                  @click="confirmDelcamera()"
                  v-if="cameraInfo.id"
                >删除摄像头</a>
              </div>
            </div>
          </div>
        </div>
        <!--=E 颜色和透明度选择-->
      </Header>
      <Layout>
        <Sider hide-trigger width="220">
          <side-menu
            :nvrList="nvrList"
            :isChanged="isChanged"
            @updateCameraInfo="updateCameraInfo"
            @clickedCamera="clickedCamera"
            @queryAllData="queryAllData"
            @changeShowCameraFlag="changeShowCameraFlag"
            ref="sideMenu"
          ></side-menu>
        </Sider>
        <Content style="background:#283847">
          <draw-area
            :data="cameraInfo"
            :lineWidth="strokeVal"
            :lineColor="lineColor"
            :index="selectedArea"
            :unChangeAll="unChangeAll"
            @updateCameraInfo="updateCameraInfo"
            @updateChange="updateChange"
            :notSave="notSave"
            ref="drawAreaBox"
            v-if="showCameraFlag && cameraInfo.img_url"
          ></draw-area>
          <!-- v-if="cameraInfo.zones && cameraInfo.img_url && cameraInfo.img_url!='http://'" -->
        </Content>
        <div
          class="right_bar"
          v-if="showCameraFlag && this.cameraInfo.img_url && cameraInfo.img_url!='http://'"
        >
          <div class="operate_bar" v-if="areaList.length">
            <RadioGroup v-model="eyesAll" @on-change="setAllvisible">
              <Radio label="1">全部显示</Radio>
              <Radio label="0">全部隐藏</Radio>
            </RadioGroup>
          </div>
          <div class="area_container" :class="{'has_bar':areaList.length}">
            <ul>
              <li
                v-for="(item,index) in areaList"
                :class="{'current': selectedArea == index}"
                @click="editArea(index)"
                :key="index"
              >
                <div class="areaname_box edit" v-if="item.showAreaInput">
                  <Input
                    v-model="areaData.name"
                    placeholder="请输入区域名称"
                    @on-enter="confirmName(index)"
                    @on-blur="cancelName(index)"
                    :ref="'areaname'+index"
                    :element-id="'areaname'+index"
                    autofocus
                  />
                </div>
                <span class="area_title">{{item.name}}</span>
                <a
                  href="javascript:void(0)"
                  class="visible_btn"
                  @click="displayArea(index)"
                  v-if="item.visible"
                >
                  <Icon type="md-eye" />
                </a>
                <a
                  href="javascript:void(0)"
                  class="visible_btn"
                  @click="displayArea(index)"
                  v-if="!item.visible"
                >
                  <Icon type="md-eye-off" />
                </a>
                <div class="color_box">
                  <ColorPicker
                    v-model="item.line_color"
                    @on-change="updateColor"
                    size="small"
                    placement="bottom-start"
                    alpha
                    editable
                  />
                </div>
                <a href="javascript:void(0)" class="delarea_btn" @click="delArea(item,index)">
                  <Icon type="md-trash" />
                </a>
                <a href="javascript:void(0)" class="editarea_name" @click="editAreaName(index)">
                  <Icon type="md-create" />
                </a>
              </li>
            </ul>
          </div>
          <a href="javascript:void(0)" class="add_btn" @click="addArea">新增区域</a>
        </div>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import sideMenu from "@/components/sideMenu";
import drawArea from "@/components/drawArea";
import viewConfig from "@/components/viewConfig";
export default {
  name: "mainFrame",
  components: {
    sideMenu,
    drawArea,
    viewConfig
  },
  data() {
    return {
      configCSV:null,
      viewConfigFlag: false,
      unChangeAll: true,
      eyesAll: "1",
      allNvrData: {},
      nvrList: [],
      color: "#ff0000",
      strokeVal: 1,
      alphaVal: 1,
      notSave: true,
      line_width: 5,
      strokeWidthList: [
        { line_width: 1, label: "1像素" },
        { line_width: 2, label: "2像素" },
        { line_width: 3, label: "3像素" },
        { line_width: 5, label: "5像素" },
        { line_width: 10, label: "10像素" }
      ],
      showCameraFlag: false,
      cameraInfo: {},
      num: 1,
      selectedArea: -1,
      areaData: {},
      showLineFlag: false,
      resultData: {},
      screenWidth: 0,
      lineColor: null,
      changeFlag: false,
      settings: {},
      seconds: 30,
      countDownFlag: false,
      countdownPercent: 100,
      timer1: null
    };
  },
  watch: {
    countDownFlag(val) {
      let _this = this;
      if (val) {
        this.timer1 = setInterval(() => {
          if (_this.seconds < 0) {
            return false;
          }
          _this.seconds--;
        }, 1000);
      } else {
        this.seconds = 30;
      }
    },
    seconds(val) {
      if (val < 0) {
        clearInterval(this.timer1);
        this.countDownFlag = false;
        this.countdownPercent = 100;
      } else {
        this.countdownPercent -= 100 / 30;
      }
    },
    selectedArea(val) {
      if (this.areaList.length && val != -1) {
        this.strokeVal = this.areaList[val].line_width;
      }
    },
    cameraInfo: {
      handler(newVal, oldVal) {
        if (
          newVal.zones &&
          newVal.zones.length &&
          newVal.img_url &&
          newVal.img_url != "http://"
        ) {
          this.notSave = false;
        } else {
          this.notSave = true;
        }
      },
      deep: true
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    areaList() {
      return this.cameraInfo.zones ? this.cameraInfo.zones : [];
    },
    areaFlag() {
      return this.$store.state.areaFlag;
    },
    isChanged() {
      //比较摄像头信息有无变更
      let flag;
      if (
        JSON.stringify(this.cameraInfo) != "{}" &&
        JSON.stringify(this.resultData) != "{}"
      ) {
        flag = this.compareObj(this.cameraInfo, this.resultData);
      } else {
        flag = true;
      }
      if (flag && !this.changeFlag) {
        return false;
      } else {
        return true;
      }
    }
  },
  mounted() {
    this.queryAllData();
    let _this = this;
    window.onkeydown = e => {
      if (this.showCameraFlag && this.cameraInfo.img_url) {
        if (e.ctrlKey && e.keyCode == 90) {
          this.$refs.drawAreaBox.undo();
        }
      }
    };
  },
  methods: {
    changeShowCameraFlag(val) {
      this.showCameraFlag = val;
    },
    setAllvisible(val) {
      //设置区域全部显示和隐藏
      this.unChangeAll = false;
      let list = this.cameraInfo.zones;
      if (val == "1") {
        for (let i = 0; i < list.length; i++) {
          this.$set(list[i], "visible", true);
        }
      } else {
        for (let i = 0; i < list.length; i++) {
          this.$set(list[i], "visible", false);
        }
      }
      this.$forceUpdate();
      this.$refs.drawAreaBox.init();
    },
    updateChange(val) {
      this.changeFlag = val;
    },
    setDisplayhide() {
      //设置全部显示、隐藏的按钮状态
      let allDisplay = this.areaList.every(function(item, index, array) {
        return item.visible == true;
      });
      let allHide = this.areaList.every(function(item, index, array) {
        return item.visible == false;
      });
      if (allDisplay) {
        this.eyesAll = "1";
        return false;
      }
      if (allHide) {
        this.eyesAll = "0";
        return false;
      }
      this.eyesAll = "";
    },
    displayArea(index) {
      let flag = this.areaList[index].visible;
      this.$set(this.areaList[index], "visible", !flag);
      this.$forceUpdate();
      this.$refs.drawAreaBox.init();
      this.setDisplayhide();
    },
    changeLinewidth(val) {
      //改变描边时
      let areaIdx = this.selectedArea;
      if (areaIdx == 0 || areaIdx) {
        this.$set(this.cameraInfo.zones[areaIdx], "line_width", val);
      }
    },
    updateColor(val) {
      this.lineColor = val;
    },
    updateCameraInfo(obj, source) {
      //区域信息更新到摄像头信息
      if (obj) {
        for (let key in obj) {
          this.cameraInfo[key] = obj[key];
        }
      } else {
        this.cameraInfo = {};
      }
      if (source) {
        this.showCameraFlag = false;
        this.changeFlag = false;
      }
    },
    clickCapture() {
      //点击截屏
      if (!this.cameraInfo.rtsp_url) {
        this.$Message.warning("请先输入rtsp地址才能截屏", 5);
        return false;
      }
      this.$store.commit("changeLoading", true);
      let _this = this;
      let rtsp_url = this.cameraInfo.rtsp_url; //输入视频地址后才能截屏
      let data = new FormData();
      data.append("rtsp_url", rtsp_url);
      this.$api.wareHouse
        .capture(data)
        .then(res => {
          if (res.data) {
            let img_url = res.data.img_data_url;
            _this.$set(_this.cameraInfo, "img_url", img_url);
            this.$store.commit("changeAreaFlag", true);
            _this.$nextTick(() => {
              _this.$refs.drawAreaBox.resize();
            });
            this.$store.commit("changeLoading", false);
            // let _image = new Image();
            // _image.src = "http://192.168.16.228:8888/" + img_url;
            // _image.onload = function() {
            //   _this.cameraInfo.width = _image.width;
            //   _this.cameraInfo.height = _image.height;
            // };
          }
        })
        .catch(function(error) {
          _this.$Message.error(error);
          _this.$store.commit("changeLoading", false);
        });
    },
    queryAllData() {
      //查询所有NVR数据
      this.nvrList = [
        {
          id: 1,
          ip: "192.168.16.230",
          port: 554,
          username: "test",
          password: "test1234",
          channels: 16,
          name: "nvr01",
          cameras: [
            {
              id: 1,
              name: "前门摄像机",
              rtsp_url:
                "rtsp://play:play_123@192.168.16.230:554/cam/realmonitor?channel=2&subtype=0",
              width: 1280,
              height: 720,
              img_url: "http://",
              nvr: {
                id: 1
              },
              nvr_channel: 1,
              zones: [
                {
                  name: "库位名称",
                  line_red: 255,
                  line_green: 0,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [409, 519],
                    [509, 515],
                    [521, 581],
                    [574, 582],
                    [587, 620],
                    [423, 629]
                  ]
                },
                {
                  name: "库位名称2",
                  line_red: 255,
                  line_green: 165,
                  line_blue: 255,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [249, 569],
                    [325, 564],
                    [329, 558],
                    [402, 551],
                    [411, 568],
                    [417, 597],
                    [417, 621],
                    [432, 625],
                    [436, 637],
                    [456, 639],
                    [466, 681],
                    [350, 687],
                    [248, 685],
                    [238, 612],
                    [248, 612]
                  ]
                },
                {
                  name: "库位名称3",
                  line_red: 124,
                  line_green: 252,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [246, 686],
                    [335, 686],
                    [359, 691],
                    [469, 689],
                    [474, 717],
                    [250, 716]
                  ]
                }
              ],
              created: "2019-08-29 11:35:52"
            },
            {
              id: 200,
              name: "前门摄像机",
              rtsp_url:
                "rtsp://play:play_123@192.168.16.230:554/cam/realmonitor?channel=2&subtype=0",
              width: 1280,
              height: 720,
              img_url: "http://",
              nvr: {
                id: 1
              },
              nvr_channel: 2,
              zones: [
                {
                  name: "库位名称3",
                  line_red: 124,
                  line_green: 252,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [659, 319],
                    [759, 315],
                    [781, 381],
                    [824, 382],
                    [837, 420],
                    [683, 429]
                  ]
                }
              ],
              created: "2019-08-29 11:21:24"
            },
            {
              id: 356,
              name: "前门摄像机",
              rtsp_url:
                "rtsp://play:play_123@192.168.16.230:554/cam/realmonitor?channel=2&subtype=0",
              width: 1280,
              height: 720,
              img_url: "http://",
              nvr: {
                id: 1
              },
              nvr_channel: 3,
              zones: [
                {
                  name: "库位名称3",
                  line_red: 124,
                  line_green: 252,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [246, 686],
                    [335, 686],
                    [359, 691],
                    [469, 689],
                    [474, 717],
                    [250, 716]
                  ]
                }
              ],
              created: "2019-08-29 14:37:06"
            },
            {
              id: 4,
              name: "前门摄像机",
              rtsp_url:
                "rtsp://play:play_123@192.168.16.230:554/cam/realmonitor?channel=2&subtype=0",
              width: 1280,
              height: 720,
              img_url: "http://",
              nvr: {
                id: 1
              },
              nvr_channel: 4,
              zones: [
                {
                  name: "库位名称3",
                  line_red: 124,
                  line_green: 252,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [246, 686],
                    [335, 686],
                    [359, 691],
                    [469, 689],
                    [474, 717],
                    [250, 716]
                  ]
                }
              ],
              created: "2019-08-29 14:37:15"
            },
            {
              id: 523,
              name: "前门摄像机",
              rtsp_url:
                "rtsp://play:play_123@192.168.16.230:554/cam/realmonitor?channel=2&subtype=0",
              width: 1280,
              height: 720,
              img_url: "http://",
              nvr: {
                id: 1
              },
              nvr_channel: 5,
              zones: [
                {
                  name: "库位名称3",
                  line_red: 124,
                  line_green: 252,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [246, 686],
                    [335, 686],
                    [359, 691],
                    [469, 689],
                    [474, 717],
                    [250, 716]
                  ]
                }
              ],
              created: "2019-08-29 14:39:31"
            },
            {
              id: 6,
              name: "前门摄像机",
              rtsp_url:
                "rtsp://play:play_123@192.168.16.230:554/cam/realmonitor?channel=2&subtype=0",
              width: 1280,
              height: 720,
              img_url: "http://",
              nvr: {
                id: 1
              },
              nvr_channel: 6,
              zones: [
                {
                  name: "库位名称",
                  line_red: 255,
                  line_green: 0,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [409, 519],
                    [509, 515],
                    [521, 581],
                    [574, 582],
                    [587, 620],
                    [423, 629]
                  ]
                },
                {
                  name: "库位名称2",
                  line_red: 255,
                  line_green: 165,
                  line_blue: 255,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [249, 569],
                    [325, 564],
                    [329, 558],
                    [402, 551],
                    [411, 568],
                    [417, 597],
                    [417, 621],
                    [432, 625],
                    [436, 637],
                    [456, 639],
                    [466, 681],
                    [350, 687],
                    [248, 685],
                    [238, 612],
                    [248, 612]
                  ]
                },
                {
                  name: "库位名称3",
                  line_red: 124,
                  line_green: 252,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [246, 686],
                    [335, 686],
                    [359, 691],
                    [469, 689],
                    [474, 717],
                    [250, 716]
                  ]
                }
              ],
              created: "2019-09-02 16:45:31"
            },
            {
              id: 7,
              name: "前门摄像机",
              rtsp_url:
                "rtsp://play:play_123@192.168.16.230:554/cam/realmonitor?channel=2&subtype=0",
              width: 1280,
              height: 720,
              img_url: "http://",
              nvr: {
                id: 1
              },
              nvr_channel: 7,
              zones: [
                {
                  name: "库位名称",
                  line_red: 255,
                  line_green: 0,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [409, 519],
                    [509, 515],
                    [521, 581],
                    [574, 582],
                    [587, 620],
                    [423, 629]
                  ]
                },
                {
                  name: "库位名称2",
                  line_red: 255,
                  line_green: 165,
                  line_blue: 255,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [249, 569],
                    [325, 564],
                    [329, 558],
                    [402, 551],
                    [411, 568],
                    [417, 597],
                    [417, 621],
                    [432, 625],
                    [436, 637],
                    [456, 639],
                    [466, 681],
                    [350, 687],
                    [248, 685],
                    [238, 612],
                    [248, 612]
                  ]
                },
                {
                  name: "库位名称3",
                  line_red: 124,
                  line_green: 252,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [246, 686],
                    [335, 686],
                    [359, 691],
                    [469, 689],
                    [474, 717],
                    [250, 716]
                  ]
                }
              ],
              created: "2019-09-02 16:46:05"
            },
            {
              id: 8,
              name: "前门摄像机",
              rtsp_url:
                "rtsp://play:play_123@192.168.16.230:554/cam/realmonitor?channel=2&subtype=0",
              width: 1280,
              height: 720,
              img_url: "http://",
              nvr: {
                id: 1
              },
              nvr_channel: 8,
              zones: [
                {
                  name: "库位名称",
                  line_red: 255,
                  line_green: 0,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [409, 519],
                    [509, 515],
                    [521, 581],
                    [574, 582],
                    [587, 620],
                    [423, 629]
                  ]
                },
                {
                  name: "库位名称2",
                  line_red: 255,
                  line_green: 165,
                  line_blue: 255,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [249, 569],
                    [325, 564],
                    [329, 558],
                    [402, 551],
                    [411, 568],
                    [417, 597],
                    [417, 621],
                    [432, 625],
                    [436, 637],
                    [456, 639],
                    [466, 681],
                    [350, 687],
                    [248, 685],
                    [238, 612],
                    [248, 612]
                  ]
                },
                {
                  name: "库位名称3",
                  line_red: 124,
                  line_green: 252,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [246, 686],
                    [335, 686],
                    [359, 691],
                    [469, 689],
                    [474, 717],
                    [250, 716]
                  ]
                }
              ],
              created: "2019-09-02 16:46:18"
            }
          ]
        },
        {
          id: 2,
          ip: "192.168.16.230",
          port: 554,
          username: "test",
          password: "test1234",
          channels: 16,
          name: "nvr02",
          cameras: [
            {
              id: 10,
              name: "后门摄像机002",
              rtsp_url:
                "rtsp://play:play_123@192.168.16.230:554/cam/realmonitor?channel=2&subtype=0",
              width: 1280,
              height: 720,
              img_url: "http://",
              nvr: {
                id: 1
              },
              nvr_channel: 1,
              zones: [
                {
                  name: "库位名称",
                  line_red: 255,
                  line_green: 0,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [409, 519],
                    [509, 515],
                    [521, 581],
                    [574, 582],
                    [587, 620],
                    [423, 629]
                  ]
                },
                {
                  name: "库位名称2",
                  line_red: 255,
                  line_green: 165,
                  line_blue: 255,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [249, 569],
                    [325, 564],
                    [329, 558],
                    [402, 551],
                    [411, 568],
                    [417, 597],
                    [417, 621],
                    [432, 625],
                    [436, 637],
                    [456, 639],
                    [466, 681],
                    [350, 687],
                    [248, 685],
                    [238, 612],
                    [248, 612]
                  ]
                },
                {
                  name: "库位名称3",
                  line_red: 124,
                  line_green: 252,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [246, 686],
                    [335, 686],
                    [359, 691],
                    [469, 689],
                    [474, 717],
                    [250, 716]
                  ]
                }
              ],
              created: "2019-08-29 11:35:52"
            },
            {
              id: 52,
              name: "前门摄像机",
              rtsp_url:
                "rtsp://play:play_123@192.168.16.230:554/cam/realmonitor?channel=2&subtype=0",
              width: 1280,
              height: 720,
              img_url: "http://",
              nvr: {
                id: 1
              },
              nvr_channel: 1,
              zones: [
                {
                  name: "库位名称",
                  line_red: 255,
                  line_green: 0,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [409, 519],
                    [509, 515],
                    [521, 581],
                    [574, 582],
                    [587, 620],
                    [423, 629]
                  ]
                },
                {
                  name: "库位名称2",
                  line_red: 255,
                  line_green: 165,
                  line_blue: 255,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [249, 569],
                    [325, 564],
                    [329, 558],
                    [402, 551],
                    [411, 568],
                    [417, 597],
                    [417, 621],
                    [432, 625],
                    [436, 637],
                    [456, 639],
                    [466, 681],
                    [350, 687],
                    [248, 685],
                    [238, 612],
                    [248, 612]
                  ]
                },
                {
                  name: "库位名称3",
                  line_red: 124,
                  line_green: 252,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [246, 686],
                    [335, 686],
                    [359, 691],
                    [469, 689],
                    [474, 717],
                    [250, 716]
                  ]
                }
              ],
              created: "2019-08-29 11:35:52"
            }
          ]
        },
        {
          id: 3,
          ip: "192.168.16.223",
          port: 15,
          username: "test",
          password: "test",
          channels: 16,
          name: "nvr03",
          cameras: [
            {
              id: 14,
              name: "前门摄像机002",
              rtsp_url:
                "rtsp://play:play_123@192.168.16.230:554/cam/realmonitor?channel=2&subtype=0",
              width: 1280,
              height: 720,
              img_url: "http://",
              nvr: {
                id: 1
              },
              nvr_channel: 1,
              zones: [
                {
                  name: "库位名称",
                  line_red: 255,
                  line_green: 0,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [409, 519],
                    [509, 515],
                    [521, 581],
                    [574, 582],
                    [587, 620],
                    [423, 629]
                  ]
                },
                {
                  name: "库位名称2",
                  line_red: 255,
                  line_green: 165,
                  line_blue: 255,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [249, 569],
                    [325, 564],
                    [329, 558],
                    [402, 551],
                    [411, 568],
                    [417, 597],
                    [417, 621],
                    [432, 625],
                    [436, 637],
                    [456, 639],
                    [466, 681],
                    [350, 687],
                    [248, 685],
                    [238, 612],
                    [248, 612]
                  ]
                },
                {
                  name: "库位名称3",
                  line_red: 124,
                  line_green: 252,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [246, 686],
                    [335, 686],
                    [359, 691],
                    [469, 689],
                    [474, 717],
                    [250, 716]
                  ]
                }
              ],
              created: "2019-08-29 11:35:52"
            },
            {
              id: 288,
              name: "前门摄像机",
              rtsp_url:
                "rtsp://play:play_123@192.168.16.230:554/cam/realmonitor?channel=2&subtype=0",
              width: 1280,
              height: 720,
              img_url: "http://",
              nvr: {
                id: 1
              },
              nvr_channel: 1,
              zones: [
                {
                  name: "库位名称",
                  line_red: 255,
                  line_green: 0,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [409, 519],
                    [509, 515],
                    [521, 581],
                    [574, 582],
                    [587, 620],
                    [423, 629]
                  ]
                },
                {
                  name: "库位名称2",
                  line_red: 255,
                  line_green: 165,
                  line_blue: 255,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [249, 569],
                    [325, 564],
                    [329, 558],
                    [402, 551],
                    [411, 568],
                    [417, 597],
                    [417, 621],
                    [432, 625],
                    [436, 637],
                    [456, 639],
                    [466, 681],
                    [350, 687],
                    [248, 685],
                    [238, 612],
                    [248, 612]
                  ]
                },
                {
                  name: "库位名称3",
                  line_red: 124,
                  line_green: 252,
                  line_blue: 0,
                  line_alpha: 255,
                  line_width: 4,
                  points: [
                    [246, 686],
                    [335, 686],
                    [359, 691],
                    [469, 689],
                    [474, 717],
                    [250, 716]
                  ]
                }
              ],
              created: "2019-08-29 11:35:52"
            }
          ]
        },
        {
          id: 4,
          ip: "192.168.16.223",
          port: 15,
          username: "test",
          password: "test",
          channels: 16,
          name: "nvr04",
          cameras: []
        },
        {
          id: 5,
          ip: "192.168.16.223",
          port: 15,
          username: "test",
          password: "test",
          channels: 16,
          name: "nvr05",
          cameras: []
        }
      ];
      this.$api.wareHouse.queryNvr().then(res => {
        if (res && res.data.results) {
          this.nvrList = res.data.results;
        }
      });
    },
    clickedCamera(isEdit, data) {
      this.showCameraFlag = true;
      this.resultData = JSON.parse(JSON.stringify(data));
      if (isEdit) {
        if (data.id == this.cameraInfo.id) {
          this.$Message.info("已经是当前摄像头", 0.5);
          return false;
        }
        this.queryCamera(data.id);
      } else {
        this.changeFlag = true;
        //新增时查询默认端口和通道
        this.$store.commit("changeLoading", true);
        this.$api.wareHouse
          .cameraSuggest(data.nvr.id)
          .then(res => {
            if (res && res.data) {
              this.cameraInfo = data;
              this.cameraInfo.nvr_channel = res.data.suggest_nvr_channel;
              this.cameraInfo.output_port = res.data.suggest_output_port;
            }
            this.$store.commit("changeLoading", false);
          })
          .catch(e => {
            this.$store.commit("changeLoading", false);
            this.$Message.error(e);
          });
        //
      }
      //设置区域默认值
      this.selectedArea = -1;
    },
    deepCompare(x, y) {
      var i, l, leftChain, rightChain;

      function compare2Objects(x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (
          isNaN(x) &&
          isNaN(y) &&
          typeof x === "number" &&
          typeof y === "number"
        ) {
          return true;
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
          return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if (
          (typeof x === "function" && typeof y === "function") ||
          (x instanceof Date && y instanceof Date) ||
          (x instanceof RegExp && y instanceof RegExp) ||
          (x instanceof String && y instanceof String) ||
          (x instanceof Number && y instanceof Number)
        ) {
          return x.toString() === y.toString();
        }

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
          return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
          return false;
        }

        if (x.constructor !== y.constructor) {
          return false;
        }

        if (x.prototype !== y.prototype) {
          return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
          return false;
        }

        // Quick checking of one object being a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
          if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
          } else if (typeof y[p] !== typeof x[p]) {
            return false;
          }
        }

        for (p in x) {
          if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
          } else if (typeof y[p] !== typeof x[p]) {
            return false;
          }

          switch (typeof x[p]) {
            case "object":
            case "function":
              leftChain.push(x);
              rightChain.push(y);

              if (!compare2Objects(x[p], y[p])) {
                return false;
              }

              leftChain.pop();
              rightChain.pop();
              break;

            default:
              if (x[p] !== y[p]) {
                return false;
              }
              break;
          }
        }

        return true;
      }

      if (arguments.length < 1) {
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw "Need two or more arguments to compare";
      }

      for (i = 1, l = arguments.length; i < l; i++) {
        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(arguments[0], arguments[i])) {
          return false;
        }
      }

      return true;
    },
    compareObj(data, resultData) {
      let flag = true;
      for (let key in resultData) {
        if (key != "zones" && key != "nvr") {
          if (resultData[key] != data[key]) {
            flag = false;
            return flag;
          }
        }
      }
      //比较两个数组中点的数据
      let reZones = resultData.zones;
      let dataZones = data.zones;
      if (reZones.length != dataZones.length) {
        flag = false;
        return flag;
      }
      //比较两个对象中点的配置项
      // for (let i = 0; i < reZones.length; i++) {
      //   for (let key in reZones[i]) {
      //     if (key != "points") {
      //       if (reZones[i][key] != dataZones[i][key]) {
      //         flag = false;
      //         console.log("配置项", flag);
      //         return flag;
      //       }
      //     } else {
      //       flag = this.deepCompare(reZones[i][key], dataZones[i][key]);
      //       console.log("点", flag);
      //     }
      //   }
      // }
      return flag;
    },
    cancelSave() {
      this.$Modal.confirm({
        title: "提示",
        content: "数据未保存，确认取消吗？",
        onOk: () => {
          if (this.cameraInfo.id) {
            //取消修改
            this.queryCamera(this.cameraInfo.id, true);
          } else {
            //取消新增
            this.showCameraFlag = false;
            this.$refs.sideMenu.delCamera();
          }
          //  this.$Message.success("已取消");
        },
        onCancel: () => {}
      });
    },
    dealColor(rgbStr) {},
    queryCamera(id, flag) {
      //查询单个摄像头数据
      let _this = this;
      this.$store.commit("changeLoading", true);
      this.$api.wareHouse
        .queryCamera(id)
        .then(res => {
          if (res && res.data) {
            this.resultData = JSON.parse(JSON.stringify(res.data));
            this.cameraInfo = res.data;
            this.changeFlag = false;
            this.unChangeAll = true;
            this.eyesAll = "1";
            for (let i = 0; i < this.areaList.length; i++) {
              this.areaList[i].showAreaInput = false;
              this.areaList[i].visible = true;
            }
            if (this.areaList.length) {
              this.strokeVal = this.areaList[0].line_width;
            }
            this.$store.commit("changeAreaFlag", true);
            if (flag) {
              this.$nextTick(() => {
                _this.$refs.drawAreaBox.init(1);
                // _this.$refs.drawAreaBox.resize();
              });
            } else {
              if (id) {
                this.$nextTick(() => {
                  _this.$refs.drawAreaBox.init();
                });
              }
            }
          }
          this.$store.commit("changeLoading", false);
        })
        .catch(e => {
          this.$store.commit("changeLoading", false);
          this.$Message.error(e);
        });
    },
    saveAllData() {
      //新增或修改摄像头信息和区域
      this.$refs.drawAreaBox.updateWidth();
      let data = this.cameraInfo;
      if (!this.cameraInfo.no) {
        this.$Message.info("编号不能为空");
        return false;
      }
      if (!this.cameraInfo.name) {
        this.$Message.info("摄像头名称不能为空");
        return false;
      }
      if (!this.cameraInfo.rtsp_url) {
        this.$Message.info("视频地址不能为空");
        return false;
      }
      if (!this.cameraInfo.nvr_channel) {
        this.$Message.info("输出通道号不能为空");
        return false;
      }
      if (!this.cameraInfo.output_port) {
        this.$Message.info("输出端口不能为空");
        return false;
      }
      this.$store.commit("changeLoading", true);
      //组装颜色参数

      if (this.cameraInfo.zones) {
        let zones = this.cameraInfo.zones;
        for (let i = 0; i < zones.length; i++) {
          let rgb = zones[i].line_color.split(",");
          zones[i].line_red = parseInt(rgb[0].split("(")[1]);
          zones[i].line_green = parseInt(rgb[1]);
          zones[i].line_blue = parseInt(rgb[2].split(")")[0]);
          zones[i].line_alpha = parseInt(
            parseFloat(rgb[3].split(")")[0]) * 255
          );
        }
      }

      if (this.cameraInfo.id) {
        this.$api.wareHouse
          .reviewCamera(this.cameraInfo.id, data)
          .then(res => {
            if (res && res.data) {
              this.resultData = JSON.parse(JSON.stringify(res.data));
              this.cameraInfo = res.data;
              let zones = this.cameraInfo.zones;
              for (let i = 0; i < zones.length; i++) {
                zones[i].visible = true;
              }
            }
            this.$store.commit("changeLoading", false);
            this.$Message.success("保存成功");
            this.queryAllData();
            this.changeFlag = false;
          })
          .catch(e => {
            this.$store.commit("changeLoading", false);
            this.$Message.error(e);
          });
      } else {
        this.$api.wareHouse
          .addCamera(data)
          .then(res => {
            if (res && res.data) {
              this.resultData = JSON.parse(JSON.stringify(res.data));
              this.cameraInfo = res.data;
            }
            this.$store.commit("changeLoading", false);
            this.$Message.success("新增成功");
            let _this = this;
            this.queryAllData();
            this.changeFlag = false;
          })
          .catch(e => {
            this.$store.commit("changeLoading", false);
            this.$Message.error(e);
          });
      }
    },
    addArea() {
      //新增区域
      let num = this.num;
      let areaItem = {
        name: "区域" + num,
        points: [],
        line_color: "rgba(255,0,0,1)",
        line_width: 1,
        showAreaInput: true,
        visible: true
      };
      if (!this.cameraInfo.zones) {
        this.cameraInfo.zones = [];
      }
      this.cameraInfo.zones.push(areaItem);
      this.num++;
      this.selectedArea = this.areaList.length - 1;
      this.$refs.drawAreaBox.init();
      this.$refs.drawAreaBox.resize(0, 1);
      this.$refs.drawAreaBox.add();
    },
    editArea(i) {
      //画线展示
      this.selectedArea = i;
      this.$refs.drawAreaBox.changeActive(i);
    },
    editAreaName(index) {
      //修改区域名称回车确认
      if (!this.areaList[index].showAreaInput) {
        for (let i = 0; i < this.areaList.length; i++) {
          this.areaList[i].showAreaInput = false;
        }
        this.areaList[index].showAreaInput = true;
        this.areaData = JSON.parse(JSON.stringify(this.areaList[index]));
        this.$forceUpdate();
      }
    },
    confirmName(index) {
      //确认修改区域名称
      this.areaList[index].name = this.areaData.name;
      this.areaList[index].showAreaInput = false;
    },
    cancelName(index) {
      //修改名称失去焦点
      this.areaList[index].showAreaInput = false;
      this.$forceUpdate();
    },
    confirmDelcamera() {
      this.$Modal.confirm({
        title: "提示",
        content:
          "请确认是否删除摄像头【" +
          this.cameraInfo.name +
          "】,删除后不可恢复，确认要删除吗",
        onOk: () => {
          this.$api.wareHouse.delCamera(this.cameraInfo.id).then(res => {
            this.showCameraFlag = false;
            this.$Message.success("删除成功");
            this.cameraInfo = {};
            this.$refs.sideMenu.delCamera();
          });
        },
        onCancel: () => {}
      });
    },
    delArea(item, index) {
      let _this = this;
      this.$Modal.confirm({
        title: "提示",
        content:
          "请确认是否删除区域【" +
          item.name +
          "】,删除后不可恢复，确认要删除吗",
        onOk: () => {
          _this.cameraInfo.zones.splice(index, 1);
          if (_this.cameraInfo.zones.length <= 0) {
            this.selectedArea = -1;
          }
          _this.$refs.drawAreaBox.delOthers(index);
          _this.$refs.drawAreaBox.removePolygon(index);
          _this.$Message.success("删除成功");

          this.setDisplayhide();
        },
        onCancel: () => {}
      });
    },
    openViewConfig() {
      this.viewConfigFlag = true;
    },
    closeConfig() {
      this.viewConfigFlag = false;
      this.configCSV = null;
    },
    setOption(name) {
      // let _this = this;
      if (name == "restartServer") {
        this.$Modal.confirm({
          title: "提示",
          content: "确定重启服务器？",
          onOk: () => {
            this.$api.wareHouse.restartServer().then(res => {
              this.countDownFlag = true;
            });
          },
          onCancel: () => {}
        });
      } else if (name == "viewTable") {
        //查看配置表
        this.$api.wareHouse.nvrConfigJSON().then(res => {
          const content = res.data;
          this.configCSV = res.data;
          this.viewConfigFlag = true;
        });
      }
    }
  }
};
</script>

<style scope>
.ivu-layout-header {
  height: 85px;
  line-height: 1;
  padding: 0;
}
.con_wrap {
  height: 100vh;
}
.ivu-layout-content {
  margin-left: 220px;
}
.file_bar {
  background: #283847;
  padding: 0 20px;
  height: 35px;
  line-height: 35px;
  border-bottom: 1px #071826 solid;
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
  min-width: 390px;
  width: 390px;
  background: #283847;
  border-left: 1px #071826 solid;
}

.toolbar {
  padding: 0 25px 0 240px;
  background: #283847;
  height: 50px;
  line-height: 50px;
  position: relative;
}
.setting_wrap {
  position: relative;
  padding-left: 50px;
  float: left;
  margin-right: 20px;
}
.setting_wrap .field_name {
  position: absolute;
  left: 0;
  top: 0;
  color: #fff;
}
.set_box .del_btn {
  margin-left: 20px;
}
/*颜色选择器*/
.draw_btn {
  display: block;
  float: left;
  color: #fff;
  padding-left: 35px;
  height: 50px;
  line-height: 50px;
  background: url(../../static/images/draw_icon.png) no-repeat left center;
  margin-right: 40px;
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

/*填写摄像头信息*/
.setting_wrap .ivu-input {
  width: 60px;
}
.fill_box {
  float: left;
  margin-right: 10px;
}
.fill_box .field {
  float: left;
  display: block;
  /* width: 90px; */
  font-size: 14px;
  color: #fff;
  text-align: right;
}
.fill_box .ivu-input-wrapper {
  float: left;
  width: 140px;
  line-height: 50px;
}
.fill_box .ivu-input,
.setting_wrap .ivu-input,
.setting_wrap .ivu-input-number {
  background: #071826;
  border: 1px #5d7388 solid;
  color: #fff;
}
.setting_wrap .ivu-input-number-input {
  background: #071826;
  color: #fff;
}
.del_btn {
  font-size: 14px;
  color: #ff1717;
  display: inline-block;
}
.del_btn:hover {
  color: #fff;
}
.r_btnbox {
  float: right;
}
.r_btnbox .ivu-btn {
  margin-left: 5px;
  min-width: 72px;
  height: 30px;
  border-radius: 4px;
}
.ivu-btn-primary.disabled,
.ivu-btn-primary.disabled.active,
.ivu-btn-primary.disabled:active,
.ivu-btn-primary.disabled:focus,
.ivu-btn-primary.disabled:hover,
.ivu-btn-primary[disabled],
.ivu-btn-primary[disabled].active,
.ivu-btn-primary[disabled]:active,
.ivu-btn-primary[disabled]:focus,
.ivu-btn-primary[disabled]:hover,
fieldset[disabled] .ivu-btn-primary,
fieldset[disabled] .ivu-btn-primary.active,
fieldset[disabled] .ivu-btn-primary:active,
fieldset[disabled] .ivu-btn-primary:focus,
fieldset[disabled] .ivu-btn-primary:hover {
  color: #737373;
  background: #404040;
  border-color: #404040;
}
.ivu-btn-primary {
  background: #071826;
  border: 1px #071826 solid;
}
.ivu-btn-primary:hover {
  background: #5d7388;
  border: 1px #5d7388 solid;
}
.ivu-btn-ghost:hover {
  border: 1px #5d7388 solid;
  color: #5d7388;
}

/*右侧仓库*/
.area_container {
  height: calc(100vh - 35px - 42px - 50px);
  overflow-y: auto;
}
.area_container.has_bar {
  height: calc(100vh - 35px - 42px - 50px - 70px);
}
.area_container li {
  height: 72px;
  line-height: 72px;
  position: relative;
  background: #283847;
  color: #fff;
  padding: 0 30px;
  border-bottom: 1px #102535 solid;
  border-top: 1px #314457 solid;
  cursor: pointer;
}

.area_container li:hover,
.area_container li.current {
  background: #071826;
}
.area_container li::before {
  content: "";
  display: none;
  width: 5px;
  height: 35px;
  background: #fff;
  position: absolute;
  left: -1px;
  top: 50%;
  margin-top: -17px;
}
.area_container li:hover::before,
.area_container li.current::before {
  display: block;
}
.area_title {
  display: block;
  width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 1;
  position: absolute;
  left: 30px;
}
.visible_btn {
  display: block;
  width: 30px;
  height: 35px;
  line-height: 35px;
  color: #fff;
  position: absolute;
  top: 17px;
  right: 80px;
  font-size: 24px;
  text-align: center;
}
.color_box {
  display: block;
  position: absolute;
  right: 50px;
}
.color_box .ivu-input-icon-normal + .ivu-input {
  padding: 0;
}
.color_box .ivu-input-wrapper-small .ivu-input-icon {
  display: none;
}
.color_box .ivu-input-small {
  height: 15px;
  cursor: pointer;
}
.color_box .ivu-input {
  border: none;
  background-color: none;
}
.color_box .ivu-color-picker-small .ivu-color-picker-color {
  top: 0;
  width: 15px;
  height: 15px;
}

.editarea_name {
  position: absolute;
  display: block;
  color: #fff;
  right: 118px;
  top: 18px;
  height: 35px;
  line-height: 35px;
  width: 30px;
  font-size: 24px;
  text-align: center;
}
.areaname_box {
  position: absolute;
  left: 25px;
  width: 180px;
  z-index: 2;
}
.areaname_box.edit .ivu-input {
  background: #fff;
  color: #142e44;
  pointer-events: inherit;
  outline: none;
  font-size: 16px;
}
.delarea_btn {
  position: absolute;
  display: block;
  color: #fff;
  right: 10px;
  top: 18px;
  height: 35px;
  line-height: 35px;
  width: 30px;
  font-size: 24px;
  text-align: center;
}
.add_btn {
  display: block;
  height: 42px;
  line-height: 42px;
  text-align: center;
  color: #fff;
  background: #7490a7;
}
.add_btn:hover {
  color: #fff;
  background: #142e44;
}
.ivu-spin-fix {
  background-color: rgba(255, 255, 255, 0.1);
}
.countdown_tips {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 20;
}
.countdown_tips::before {
  display: block;
  content: "";
  position: fixed;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.7;
  left: 0;
  top: 0;
}
.countdown_tips .ivu-chart-circle {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  margin-top: -100px;
}
.countdown_tips .ivu-chart-circle .text {
  color: #2db7f5;
}
.operate_bar {
  height: 70px;
  line-height: 70px;
  color: #fff;
  border-bottom: 1px #102535 solid;
}
.operate_bar .ivu-radio-group {
  display: block;
}
.operate_bar .ivu-radio-wrapper {
  font-size: 16px;
  width: 50%;
  float: left;
  margin: 0;
  text-align: center;
  /* padding-left: 30px; */
}
.operate_bar .ivu-radio-checked .ivu-radio-inner {
  border-color: #83c470;
}
.ivu-radio-inner {
  width: 18px;
  height: 18px;
}
.operate_bar .ivu-radio-inner:after {
  width: 10px;
  height: 10px;
  left: 3px;
  top: 3px;
  background-color: #83c470;
}
.operate_bar .ivu-radio {
  padding-right: 7px;
}
.file_bar .ivu-select-dropdown {
  border-radius: 0;
  padding: 0;
  margin: 0;
}
.file_bar .ivu-dropdown-item {
  color: #333;
  font-size: 14px !important;
  padding: 10px 18px;
}
</style>
