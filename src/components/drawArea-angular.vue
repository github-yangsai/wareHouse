<template>
  <div>
    <div class="capture_box">
      <div class="img_box">
        <div>
          <button @click="add()">Add new</button>
          <button @click="undo()">Undo</button>
          <button @click="clearAll()">Clear</button>
        </div>

        <img src="../../static/images/background.jpg" />

        <canvas width="100%" class="canvas" ref="canvas" id="canvas"
        @mousedown="canvasDown($event,scope)"
        ></canvas>
        <!-- @mousedown="canvasDown($event)"
          @mousemove="canvasMove($event)"
          @mouseup="canvasUp($event)"
        @mouseleave="canvasLeave($event)"-->
        <br />
        {{points}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "drawArea",
  components: {},
  data() {
    return {
      scope: {},
      points: []
    };
  },
  mounted() {
    // let $scope = this.$scope;
    // $scope.points = [[]];
    // $scope.imageSrc = "../../static/images/background.jpg";
    // $scope.enabled = true;
    // $scope.colorArray = ['#FF0000', '#FFFF00', '#0000FF', '#008000', '#C0C0C0'];
    // $scope.activePolygon = 0;

    this.scope = {
      imageUrl: "../../static/images/background.jpg",
      enabled: true,
      palette: "=",
      points: [[]],
      active: 0
    };

    // this.init(this.scope);
  },
  methods: {
    canvasDown(e,scope) {
      if (!scope.enabled) {
        return false;
      }
      var points = scope.points[scope.active];
      var x,
        y,
        dis,
        minDis = 0,
        minDisIndex = -1,
        lineDis,
        insertAt = points.length;
        let canvasDom = document.getElementById("canvas");

      if (e.which === 3) {
        return false;
      }

      e.preventDefault();
      if (!e.offsetX) {
        e.offsetX = e.pageX - $(e.target).offset().left;
        e.offsetY = e.pageY - $(e.target).offset().top;
      }
      var mousePos = this.getMousePos(canvasDom, e);
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
        activePoint = minDisIndex;
        $("canvas").on("mousemove", scope.move);
        return false;
      }
console.log(points)
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
console.log(points)
      points.splice(insertAt, 0, [Math.round(x), Math.round(y)]);
      activePoint = insertAt;
       $("canvas").on("mousemove", scope.move);

      // scope.draw();
      // scope.record();

      return false;
    },
    dotLineLength(x, y, x0, y0, x1, y1, o) {
      //求两点之间连线的距离
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
    hexToRgb(hex) {
      //得到填充的颜色
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null;
    },
    getMousePos(canvas, evt) {
      //getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    },
    link(scope, element, attrs, ctrl) {
      var activePoint,
        settings = {};
      var $canvas, ctx, image;

      settings.imageUrl = scope.imageUrl;

      if (!scope.points) {
        scope.points = [[]];
      }

      if (!scope.active) {
        scope.active = 0;
      }
      //选择<canvas>标签
      $canvas = $("<canvas>");
      //返回一个用于在画布上绘图的环境
      ctx = $canvas[0].getContext("2d");
      //新建一张图片
      image = new Image();
      //设置canvas的高度和长度，并且执行绘图
      scope.resize = function() {
        $canvas.attr("height", image.height).attr("width", image.width);
        $canvas
          .attr("height", $canvas[0].offsetHeight)
          .attr("width", $canvas[0].offsetWidth);
        scope.draw();
      };
      //当图像加载的时候执行resize()方法
      $(image).load(scope.resize);
      //设置图片的路径
      image.src = settings.imageUrl;
      //如果图片加载了，执行resize()
      if (image.loaded) scope.resize();
      //设置canvas的css属性
      $canvas.css({ background: "url(" + image.src + ")" });
      $canvas.css({ backgroundSize: "contain" });
      //在html中插入canvas
      $(element).append($canvas);
      //鼠标点击移动的时候
      scope.move = function(e) {
        if (!e.offsetX) {
          e.offsetX = e.pageX - $(e.target).offset().left;
          e.offsetY = e.pageY - $(e.target).offset().top;
        }
        var points = scope.points[scope.active];
        points[activePoint][0] = Math.round(e.offsetX);
        points[activePoint][1] = Math.round(e.offsetY);
        scope.record();
        scope.draw();
      };
      //鼠标停止拖拉后
      scope.stopdrag = function() {
        element.off("mousemove");
        scope.record();
        activePoint = null;
      };
      //鼠标右击的时候
      scope.rightclick = function(e) {
        e.preventDefault();
        if (!e.offsetX) {
          e.offsetX = e.pageX - $(e.target).offset().left;
          e.offsetY = e.pageY - $(e.target).offset().top;
        }
        var x = e.offsetX,
          y = e.offsetY;
        var points = scope.points[scope.active];
        for (var i = 0; i < points.length; ++i) {
          var dis = Math.sqrt(
            Math.pow(x - points[i][0], 2) + Math.pow(y - points[i][1], 2)
          );
          if (dis < 6) {
            points.splice(i, 1);
            scope.draw();
            scope.record();
            return false;
          }
        }
        return false;
      };
      //鼠标点下的时候
      scope.mousedown = function(e) {
        if (!scope.enabled) {
          return false;
        }
        var points = scope.points[scope.active];
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
        if (!e.offsetX) {
          e.offsetX = e.pageX - $(e.target).offset().left;
          e.offsetY = e.pageY - $(e.target).offset().top;
        }
        var mousePos = this.getMousePos($canvas[0], e);
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
          activePoint = minDisIndex;
          $("#canvas").on("mousemove", scope.move);
          return false;
        }

        for (var i = 0; i < points.length; ++i) {
          if (i > 1) {
            lineDis = ctrl.dotLineLength(
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
        activePoint = insertAt;
        element.on("mousemove", scope.move);

        scope.draw();
        scope.record();

        return false;
      };

      //画全部图
      scope.draw = function() {
        ctx.canvas.width = ctx.canvas.width;
        if (scope.points.length > 0) {
          scope.drawSingle(scope.points[scope.active], scope.active);
        }
        for (var p = 0; p < scope.points.length; ++p) {
          var points = scope.points[p];
          if (points.length == 0 || scope.active == p) {
            continue;
          }
          scope.drawSingle(points, p);
        }
      };

      //画一个图
      scope.drawSingle = function(points, p) {
        //设置绘制的图像在源图像之上
        ctx.globalCompositeOperation = "destination-over";
        //设置填充的颜色
        ctx.fillStyle = "rgb(255,255,255)";
        //设置绘制的笔触
        ctx.strokeStyle = scope.palette[p];
        //设置线条的宽度
        ctx.lineWidth = 1;
        //开始绘制
        ctx.beginPath();
        // ctx.moveTo(points[0], points[1]);
        for (var i = 0; i < points.length; ++i) {
          if (scope.active == p) {
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
        if (!scope.palette[p]) {
          scope.palette[p] =
            "#" +
            (function lol(m, s, c) {
              return (
                s[m.floor(m.random() * s.length)] + (c && lol(m, s, c - 1))
              );
            })(Math, "0123456789ABCDEF", 4);
        }
        //得到需要填充的颜色
        var fillColor = ctrl.hexToRgb(scope.palette[p]);
        //设置需要填充的颜色
        ctx.fillStyle =
          "rgba(" +
          fillColor.r +
          "," +
          fillColor.g +
          "," +
          fillColor.b +
          ",0.3)";
        //填充当前路径
        ctx.fill();
        //绘制已存在的路径
        ctx.stroke();
      };

      //检查数据更新
      scope.record = function() {
        scope.$apply();
      };
      //$watch监听value，若发生变化，则会触发函数，第三个参数为选择是否监听对象的全部属性
      //监听存放绘制点的数组是否发生改变，若发生改变则立即执行绘制函数，重新绘制
      scope.$watch(
        "points",
        function(newVal, oldVal) {
          scope.draw();
        },
        true
      );

      scope.$watch("active", function(newVal, oldVal) {
        if (newVal != oldVal) scope.draw();
      });
      //添加监听事件
      $canvas.on("mousedown", scope.mousedown);
      $canvas.on("contextmenu", scope.rightclick);
      $canvas.on("mouseup", scope.stopdrag);
    },
    add() {
      //添加
      let $scope = this.$scope;
      $scope.enabled = true;
      $scope.points.push([]);
      $scope.activePolygon = $scope.points.length - 1;
    },
    undo() {},
    clearAll() {}
  },
  watch: {
    // "scope.points": {
    //   handler(newName, oldName) {
    //      this.scope.draw();
    //   },
    //   deep: true,
    //   immediate: true
    // }
  }
};
</script>

<style scope>
.capture_box {
  height: calc(100vh - 35px - 50px);
  overflow-y: auto;
  background: #283847;
}
.capture_box img {
  width: 100%;
  vertical-align: bottom;
}
.canvas {
  height: 672px;
}
.img_box {
  position: relative;
}
.img_box canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
</style>
