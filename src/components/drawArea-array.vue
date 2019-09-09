<template>
  <div>
    <div class="capture_box" @resize="resizeBox">
      {{points}}
      <div class="img_box">
        <canvas
          width="100%"
          class="canvas"
          ref="canvas"
          id="canvas"
          @mousedown="mousedown"
          @mouseup="stopdrag"
        ></canvas>
      </div>
    </div>
    <textarea class="canvas-area" id="input"></textarea>
  </div>
</template>
<script>
export default {
  name: "drawArea",
  components: {},
  data() {
    return {
      points: [],
      activePoint: null,
      $canvas: null,
      $input: null,
      ctx: null,
      image: null,
      enabled:true
    };
  },
  mounted() {
    this.$canvas = document.getElementById("canvas");
    this.ctx = document.getElementById("canvas").getContext("2d");
    this.$input = document.getElementById("input");
    this.image = new Image();
    this.image.src = "../../static/images/background.jpg";
    this.image.onload = this.resize;
    this.$canvas.style.background = "url(" + this.image.src + ")";
  },
  watch:{
    points(){
      this.draw();
    },
    activePoint(newVal,oldVal){
      if (newVal != oldVal) this.draw();
    }
  },
  methods: {
    resizeBox(a) {
      //自适应
      console.log(a);
    },
    reset() {
      this.points = [];
      this.draw();
    },
    resize() {
      this.$canvas.width = this.image.width;
      this.$canvas.height = this.image.height;
      this.draw();
    },
    move(e) {
      let points = this.points;
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
      this.activePoint = null;
    },
    mousedown(e) {
      let points = this.points;
      var x,
        y,
        dis,
        lineDis,
        insertAt = points.length;
      if (e.which === 3) {
        return false;
      }
      e.preventDefault();
      if (!e.offsetX) {
        // e.offsetX = e.pageX - $(e.target).offset().left;
        // e.offsetY = e.pageY - $(e.target).offset().top;
      }
      x = e.offsetX;
      y = e.offsetY;
      for (var i = 0; i < points.length; i++) {
        dis = Math.sqrt(
          Math.pow(x - points[i][0], 2) + Math.pow(y - points[i][1], 2)
        );
        if (dis < 6) {
          this.activePoint = i;
          this.$canvas.addEventListener("mousemove", this.move);
          return false;
        }
      }
      for (var i = 0; i < points.length; i++) {
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
          if (!(x1 - x0)) return { x: x0, y: y };
          else if (!(y1 - y0)) return { x: x, y: y0 };
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
      this.record();
      if (points.length < 2) {
        return false;
      }
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (var i = 0; i < points.length; i++) {
        ctx.fillRect(points[i][0] - 2, points[i][1] - 2, 4, 4);
        ctx.strokeRect(points[i][0] - 2, points[i][1] - 2, 4, 4);
        if (points.length > 2 && i > 1) {
          ctx.lineTo(points[i][0], points[i][1]);
        }
      }

      ctx.closePath();
      ctx.fillStyle = "rgba(255,0,0,0.3)";
      ctx.fill();
      ctx.stroke();
    },
    record() {
      //记录坐标位置
      this.$input.value = this.points.join(",");
    }
  },
  watch: {}
};
</script>

<style scope>
.capture_box {
  height: calc(100vh - 35px - 50px);
  overflow-y: auto;
}
.capture_box img {
  width: 100%;
  vertical-align: bottom;
}
.img_box {
  position: relative;
}

.img_box canvas {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  background-size: 100%;
}
</style>
