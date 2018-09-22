// canvasの設定
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

new Vue({
  el: "#app",
  data: {
    canvas: canvas,
    ctx: ctx,
    x: 10, // x軸
    y: 30, // y軸
    g: 9.8, // 重力加速度
    a: 20, // 加速度
    v: 0.0, // 速度
    t: 0.15, // 時間
    e: -0.7, // 反発係数
    fallTime: '',
    requestAnimationFrameId: null,
    histories: []
  },
  created: function() {
    console.log("onClick event register");
    // start地点の描画
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fill();
    this.ctx.closePath();
    this.target();
    this.canvas.addEventListener("mousedown", this.onMouseDown, false);
    this.canvas.addEventListener("mouseup", this.onMouseUp, false);
  },
  methods: {
    onMouseDown: function() {
      console.log("onMouseDown");
      console.log(moment().format("YYYY年MM月DD日 HH:mm:ss.SSS"));
      this.run(this.horizontalMove);
    },
    onMouseUp: function() {
      console.log("onMouseUp");
      console.log(moment().format("YYYY年MM月DD日 HH:mm:ss.SSS"));
      this.fallTime = moment().format("YYYY年MM月DD日 HH:mm:ss.SSS");
      this.run(this.verticalMove);
    },
    horizontalMove() {
      console.log("horizontalMove");
      // 描画クリア
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // taget描画
      this.target();
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.ctx.fill();
      this.ctx.closePath();
      this.x += this.a * this.t;
      this.requestAnimationFrameId = requestAnimationFrame(this.horizontalMove);
    },
    verticalMove: function() {
      // 描画クリア
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // taget描画
      this.target();
      // 描画Start
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.ctx.fill();
      this.ctx.closePath();

      this.v += this.g * this.t;
      this.y += this.v * this.t;

      if (this.y > this.canvas.height - 5) {
        cancelAnimationFrame(this.requestAnimationFrameId);
        this.pushHistory({fallTime: this.fallTime, x: this.x - (this.canvas.width / 2), a: this.a})
        return;
      }
      this.requestAnimationFrameId = requestAnimationFrame(this.verticalMove);
    },
    run: function(moveFunc) {
      this.target();
      if (this.y > this.canvas.height - 5) {
        cancelAnimationFrame(this.requestAnimationFrameId);
      } else {
        moveFunc();
      }
    },
    clear: function() {
      // 描画クリア
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.x = 10;
      this.y = 30; //距離
      this.g = 9.8; //重力加速度
      this.v = 0.0; //速度
      this.t = 0.15; //時間
      this.e = -0.7; //反発係数
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.ctx.fill();
      this.ctx.closePath();
      this.target();
      cancelAnimationFrame(this.requestAnimationFrameId);
    },
    target: function() {
      this.ctx.fillRect(this.canvas.width / 2, this.canvas.height - 1, 10, 1);
    },
    dataClear: function() {
      this.histories = [];
    },
    pushHistory: function(history) {
      this.histories.push(history)
    }
  }
});
