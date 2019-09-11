<template>
  <div>
    <div>
      <Spin size="large" fix v-if="loading"></Spin>
      <div class="capture_box">
        <!-- {{points}} -->
        <div class="img_box" id="image_container">
          <img :src="'http://192.168.16.228:9999/' + this.img_url" />
          <canvas
            width="100%"
            class="canvas"
            ref="canvas"
            id="canvas"
            @mousedown="mousedown"
            @mouseup="stopdrag"
            @contextmenu.prevent="rightClick"
          ></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "drawArea",
  components: {},
  props: ["data", "notSave", "lineWidth", "lineColor", "index"],
  data() {
    return {
      points: [
        // [
        //   [409, 519],
        //   [509, 515],
        //   [521, 581],
        //   [574, 582],
        //   [587, 620],
        //   [423, 629]
        // ],
        // [
        //   [249, 569],
        //   [325, 564],
        //   [329, 558],
        //   [402, 551],
        //   [411, 568],
        //   [417, 597],
        //   [417, 621],
        //   [432, 625],
        //   [436, 637],
        //   [456, 639],
        //   [466, 681],
        //   [350, 687],
        //   [248, 685],
        //   [238, 612],
        //   [248, 612]
        // ]
      ],

      //  [[97, 124], [112, 257], [376, 231], [353, 117]],
      //   [[588, 191], [771, 194], [744, 346], [538, 357]],
      //   [[964, 253], [968, 440], [1159, 426], [1172, 229]]
      activePoint: 0,
      $canvas: null,
      ctx: null,
      image: null,
      enabled: "*",
      // palette: ["#FF0000", "#FFFF00", "#0000FF", "#008000", "#C0C0C0"],
      // palette:[{color:"#FF0000",alpha:1,lineWidth:1},{color:"#FFFF00",alpha:1,lineWidth:4},{color:"#0000FF",alpha:1,lineWidth:8},{color:"#008000",alpha:1,lineWidth:1}],
      palette: ["rgba(255,0,0,1)"],
      active: 0,
      loading: false,
      lines: [1]
    };
  },
  created() {},
  mounted() {
    this.$canvas = document.getElementById("canvas");
    this.ctx = document.getElementById("canvas").getContext("2d");
    this.image = document.getElementById("image_container");
  },
  computed: {
    areaFlag() {
      return this.$store.state.areaFlag;
    },
    img_url() {
      return this.data.img_url ? this.data.img_url : "";
    },
    cameraZones() {
      return this.data.zones;
    }
  },
  methods: {
    updateWidth() {
      this.$emit("updateCameraInfo", {
        width: this.image.offsetWidth,
        height: this.image.offsetHeight
      });
    },
    init() {
      this.$canvas = document.getElementById("canvas");
      this.ctx = document.getElementById("canvas").getContext("2d");
      this.image = document.getElementById("image_container");

      if (this.areaFlag) {
        //新增与编辑区域
        let zones = this.data.zones;
        this.points = [];
        this.lines = [];
        this.palette = [];
        for (let i = 0; i < zones.length; i++) {
          if (zones[i].points) {
            this.points.push(zones[i].points);

            //颜色笔触、线宽
            this.palette.push(zones[i].line_color);
            // let color = this.colorRGB2Hex(zones[i].line_color);
            // this.palette.push(this.colorRGB2Hex(zones[i].line_color));
            this.lines.push(zones[i].line_width);
          }
        }
        this.image.firstChild.onload = this.resize;
        // this.resize();
      }
    },
    changeActive(index) {
      this.active = index;
    },
    clearAll() {
      //全部清除
      this.points = [];
    },
    undo() {
      this.points[this.active].splice(-1, 1);
    },
    add() {
      // 新增区域
      this.enabled = true;
      // this.points.push([]);
      this.active = this.points.length - 1;
    },
    removePolygon(index) {
      //删除指定区域（根据区域先后顺序索引）
      this.points.splice(index, 1);
      if (index <= this.activePoint) {
        --this.activePoint;
      }
      if (this.points.length == 0) {
        this.enabled = false;
      } else {
        this.active = 0;
      }
    },
    reset() {
      this.points = [];
      this.draw();
    },
    resize(a,flag) {
      if (this.image.offsetWidth) {
        this.$canvas.width = this.image.offsetWidth;
        this.$canvas.height = this.image.offsetHeight;
        this.loading = false;
        let imgWidth = this.image.offsetWidth;
        let imgHeight = this.image.offsetHeight;

        //如果后台返回的宽度和当前用户图片容器的宽度不一样，则按比例缩放点的坐标
        //  || this.data.height != imgHeight
        debugger
        if (this.data.width && (this.data.width != imgWidth) && !flag) {
          for (let i = 0; i < this.points.length; i++) {
            for (let j = 0; j < this.points[i].length; j++) {
              let pointX = this.points[i][j][0];
              let pointY = this.points[i][j][1];
              this.points[i][j][0] = Math.round(
                (pointX / this.data.width) * imgWidth
              );
              this.points[i][j][1] = Math.round(
                (pointY / this.data.height) * imgHeight
              );
            }
          }
          //线宽比例计算
          for (let i = 0; i < this.lines.length; i++) {
            this.lines[i] = Math.ceil(
              (this.lines[i] / this.data.width) * imgWidth
            );
          }
        }
      }
      if (this.points.length > 0) {
        this.draw();
      }
    },
    rightClick(e) {
      if (!e.offsetX) {
        // e.offsetX = e.pageX - $(e.target).offset().left;
        // e.offsetY = e.pageY - $(e.target).offset().top;
      }
      var x = e.offsetX,
        y = e.offsetY;
      var points = this.points[this.activePoint];
      for (var i = 0; i < points.length; ++i) {
        var dis = Math.sqrt(
          Math.pow(x - points[i][0], 2) + Math.pow(y - points[i][1], 2)
        );
        if (dis < 6) {
          points.splice(i, 1);
          this.draw();
          this.record();
          return false;
        }
      }
      return false;
    },
    move(e) {
      let points = this.points[this.active];
      let activePoint = this.activePoint;
      if (!e.offsetX) {
        // e.offsetX = e.pageX - $(e.target).offset().left;
        // e.offsetY = e.pageY - $(e.target).offset().top;
      }
      points[activePoint][0] = Math.round(e.offsetX);
      points[activePoint][1] = Math.round(e.offsetY);
      this.draw();
    },
    stopdrag() {
      this.$canvas.removeEventListener("mousemove", this.move);
      this.record();
      this.activePoint = 0;
    },
    getMousePos(canvas, evt) {
      //getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    },
    mousedown(e) {
      if (!this.enabled) {
        return false;
      }
      let points = this.points[this.active];
      var x,
        y,
        dis,
        minDis = 0,
        minDisIndex = -1,
        lineDis,
        insertAt = points.length;

      if (e.which === 3) {
        return false;
      }

      e.preventDefault();
      // if (!e.offsetX) {
      //   e.offsetX = e.pageX - $(e.target).offset().left;
      //   e.offsetY = e.pageY - $(e.target).offset().top;
      // }
      var mousePos = this.getMousePos(this.$canvas, e);
      x = mousePos.x;
      y = mousePos.y;
      for (var i = 0; i < points.length; ++i) {
        dis = Math.sqrt(
          Math.pow(x - points[i][0], 2) + Math.pow(y - points[i][1], 2)
        );
        if (minDisIndex == -1 || minDis > dis) {
          minDis = dis;
          minDisIndex = i;
        }
      }
      if (minDis < 6 && minDisIndex >= 0) {
        this.activePoint = minDisIndex;
        this.$canvas.addEventListener("mousemove", this.move);
        return false;
      }
      for (var i = 0; i < points.length; ++i) {
        if (i > 1) {
          lineDis = this.dotLineLength(
            x,
            y,
            points[i][0],
            points[i][1],
            points[i - 1][0],
            points[i - 1][1],
            true
          );
          if (lineDis < 6) {
            insertAt = i;
          }
        }
      }

      points.splice(insertAt, 0, [Math.round(x), Math.round(y)]);
      this.activePoint = insertAt;
      this.$canvas.addEventListener("mousemove", this.move);
      this.draw();
      this.record();
      return false;
    },
    dotLineLength(x, y, x0, y0, x1, y1, o) {
      function lineLength(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
      }
      if (
        o &&
        !((o = (function(x, y, x0, y0, x1, y1) {
          if (!(x1 - x0))
            return {
              x: x0,
              y: y
            };
          else if (!(y1 - y0))
            return {
              x: x,
              y: y0
            };
          var left,
            tg = -1 / ((y1 - y0) / (x1 - x0));
          return {
            x: (left =
              (x1 * (x * tg - y + y0) + x0 * (x * -tg + y - y1)) /
              (tg * (x1 - x0) + y0 - y1)),
            y: tg * left - tg * x + y
          };
        })(x, y, x0, y0, x1, y1)),
        o.x >= Math.min(x0, x1) &&
          o.x <= Math.max(x0, x1) &&
          o.y >= Math.min(y0, y1) &&
          o.y <= Math.max(y0, y1))
      ) {
        var l1 = lineLength(x, y, x0, y0),
          l2 = lineLength(x, y, x1, y1);
        return l1 > l2 ? l2 : l1;
      } else {
        var a = y0 - y1,
          b = x1 - x0,
          c = x0 * y1 - y0 * x1;
        return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
      }
    },
    draw() {
      let ctx = this.$canvas.getContext("2d");
      let points = this.points;
      ctx.canvas.width = ctx.canvas.width;
      if (points.length > 0) {
        this.drawSingle(points[this.active], this.active);
      }
      for (var p = 0; p < points.length; ++p) {
        var _points = points[p];
        if (_points.length == 0 || this.active == p) {
          continue;
        }
        this.drawSingle(_points, p);
      }
    },
    drawSingle(points, p) {
      if(!points.length){
        return false;
      }
      let ctx = this.$canvas.getContext("2d");
      //设置绘制的图像在源图像之上
      ctx.globalCompositeOperation = "destination-over";
      //设置填充的颜色
      //  let rgb = this.palette[p].split(",");
      // ctx.fillStyle ="rgba(" + parseInt(rgb[0].split(")")[0]) + "," + parseInt(rgb[1].split(")")[0]) + "," + parseInt(rgb[2].split(")")[0]) + ",0.3)";
      ctx.fillStyle = "rgb(255,255,255)";
      //设置绘制的笔触
      ctx.strokeStyle = this.palette[p];
      //  let rgb = this.palette[p].split(",");
      // ctx.strokeStyle = `rgba(${parseInt(rgb[0].split(")")[0])},${parseInt(rgb[1].split(")")[0])},${parseInt(rgb[2].split(")")[0])},${parseFloat(rgb[3].split(")")[0])}`;
      //设置线条的宽度
      ctx.lineWidth = this.lines[p];
      //开始绘制
      ctx.beginPath();
      // ctx.moveTo(points[0], points[1]);
      for (var i = 0; i < points.length; ++i) {
        if (this.active == p) {
          //绘制填充矩形
          ctx.fillRect(points[i][0] - 2, points[i][1] - 2, 4, 4);
          //绘制无填充的矩形
          ctx.strokeRect(points[i][0] - 2, points[i][1] - 2, 4, 4);
        }
        //添加一个新点，并且创建该点与画布最后指定的点之间的线条
        ctx.lineTo(points[i][0], points[i][1]);
      }
      //创建从当前点回到起始点的路径
      ctx.closePath();
      // if (!this.palette[p]) {
      //   this.palette[p] =
      //     "#" +
      //     (function lol(m, s, c) {
      //       return s[m.floor(m.random() * s.length)] + (c && lol(m, s, c - 1));
      //     })(Math, "0123456789ABCDEF", 4);
      // }
      if (!this.palette[p]) {
        this.palette[p] = "rgba(255,0,0,1)";
      }
      //得到需要填充的颜色
      // var fillColor = this.hexToRgb(this.palette[p]);
      // //设置需要填充的颜色
      let rgb = this.palette[p].split(",");
      rgb[3] = "0.3)";
      ctx.fillStyle = rgb.join();
      //填充当前路径
      ctx.fill();
      //绘制已存在的路径
      ctx.stroke();
    },
    colorRGB2Hex(color) {
      var rgb = color.split(",");
      var r = parseInt(rgb[0].split("(")[1]);
      var g = parseInt(rgb[1]);
      var b = parseInt(rgb[2].split(")")[0]);

      var hex =
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      return hex;
    },
    hexToRgb(hex) {
      // 得到颜色
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null;
    },
    record() {
      //记录坐标位置
      // this.$input.value = this.points.join(",");
      this.$forceUpdate();
    }
  },
  watch: {
    lineWidth(val) {
      // this.palette[this.active].lineWidth = val;
      this.lines[this.active] = val;
      this.draw();
    },
    areaFlag(val) {
      if (val) {
        this.init();
      }
    },
    active(newVal, oldVal) {
      if (newVal != oldVal) this.draw();
    },
    points: {
      handler(points) {
        // if (points.length) {
        //   if (points[this.active].length) {
            this.draw();
            //区域变化时数据更新
            let index = this.active;
            let [...arr] = this.points[index];
            if (this.data.zones.length) {
              this.data.zones[index].points = arr;
            }
        //   }
        // }
      },
      deep: true
    },
    lineColor: {
      handler(val) {
        this.palette[this.index] = val;
        // this.palette[this.index] = this.colorRGB2Hex(val);
        this.draw();
      },
      deep: true
    }
  }
};
</script>

<style scope>
.capture_box {
  height: calc(100vh - 35px - 50px);
  overflow-y: auto;
  background:#283847;
}
.capture_box img {
  width: 100%;
  vertical-align: bottom;
}
.img_box {
  position: relative;
}
.img_box img {
  width: 100%;
}

.img_box canvas {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  background-size: 100%;
}

/*查看画线*/
.show_box {
  position: relative;
  text-align: center;
  margin: 0 auto;
}

.show_box img {
  display: block;
  width: 100%;
}

.canvas_box {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}
</style>
