// canvasの設定
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

new Vue({
  el: "#app",
  data: {
    width: window.innerWidth,
    height: window.innerHeight,
    canvasWidth: '1200px',
    canvasHeight: '600px',
    anime: false,
    animeDisplay: "none",
    params: true,
    paramsDisplay: "",
    canvas: canvas,
    ctx: ctx,
    x: 10, // x軸
    y: 30, // y軸
    g: 9.08665, // 重力加速度
    m: 1, // 質量
    vx: 20.0, // 水平速度
    vy: 0.0, // 垂直速度
    t: 0.15, // 時間
    k: 0.24, // 空気抵抗係数
    ax: 0.0,
    ay: 9.08665,
    mode: false,
    isLine: true,
    name: "",
    startTime: "",
    startUnixTime: "",
    fallTime: "",
    fallUnixTime: "",
    requestAnimationHFrameId: null,
    requestAnimationVFrameId: null,
    histories: [],
    isMouseUp: false
  },
  created: function() {
    this.canvasWidth = this.width + 'px';
    this.canvasHeight = (this.height - 60) + 'px';
    // start地点の描画
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fill();
    this.ctx.closePath();
    this.target();
    this.box();
    this.canvas.addEventListener("mousedown", this.onMouseDown, false);
    this.canvas.addEventListener("mouseup", this.onMouseUp, false);
  },
  methods: {
    onMouseDown() {
      // マウスダウン関数
      this.isMouseUp = false;
      const startTime = moment();
      this.startTime = startTime.format("HH:mm:ss.SSS");
      this.startUnixTime = startTime.format("x");
      this.draw(this.horizontalMove);
    },
    onMouseUp() {
      // マウスアップ関数
      this.isMouseUp = true;
      const fallTime = moment();
      this.fallTime = fallTime.format("HH:mm:ss.SSS");
      this.fallUnixTime = fallTime.format("x");
      this.draw(this.verticalMove);
    },
    horizontalMove() {
      // 水平に動かす関数

      // 描画クリア
      if (!this.mode) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      // box
      this.box();
      // taget描画
      this.target();
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.ctx.fill();
      this.ctx.closePath();
      // this.vx = this.vx + this.ax * this.t;
      this.x += this.vx * this.t;
      // this.ax = -1 * (this.k/this.m) * this.vx;
      this.requestAnimationHFrameId = requestAnimationFrame(this.horizontalMove);
    },
    verticalMove() {
      // 垂直方向に動かす関数

      // 描画クリア
      if (!this.mode) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      // box
      this.box();
      // taget描画
      this.target();
      // 描画Start
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.ctx.fill();
      this.ctx.closePath();
      

      this.vy += (this.g - (this.k/this.m))* this.t;
      this.y  += this.vy * this.t;
          

      if (this.y > this.canvas.height - 5) {
        cancelAnimationFrame(this.requestAnimationHFrameId);
        cancelAnimationFrame(this.requestAnimationVFrameId);
        // 検証結果を追加
        this.pushHistory([
          this.startTime,
          this.fallTime,
          this.startUnixTime,
          this.fallUnixTime,
          this.x - this.canvas.width / 2
        ]);
        return;
      }
      this.requestAnimationVFrameId = requestAnimationFrame(this.verticalMove);
    },
    draw(moveFunc) {
      // 描画実行関数
      this.target();
      if (this.y > this.canvas.height - 5) {
        cancelAnimationFrame(this.requestAnimationHFrameId);
        cancelAnimationFrame(this.requestAnimationVFrameId);
      } else {
        moveFunc();

      }
    },
    clear() {
      // 描画クリア&初期値クリア関数
      cancelAnimationFrame(this.requestAnimationHFrameId);
      cancelAnimationFrame(this.requestAnimationVFrameId);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.x = 10;
      this.y = 30;
      this.g = 9.8;
      this.vy = 0.0;
      this.ax = 0.0;
      this.ay = -9.8
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.ctx.fill();
      this.ctx.closePath();
      this.target();
      this.box();
      cancelAnimationFrame(this.requestAnimationFrameId);
    },
    target() {
      // ターゲット描画関数
      if(this.isLine){
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgb(204, 0, 0, 0.4)";
        this.ctx.fillRect(this.canvas.width / 2, this.canvas.height - 10, 1, this.canvas.height);
        this.ctx.closePath();
      } else {
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgb(204, 0, 0, 0.4)";
        this.ctx.fillRect(this.canvas.width / 2, 0, 1, this.canvas.height);
        this.ctx.closePath();
      }

    },
    box() {
      // 箱
      this.ctx.beginPath();
      this.ctx.strokeRect(this.x - 10, 20, 20, 20);
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.ctx.fill();
      this.ctx.closePath();
    },
    clearHistories() {
      // 結果クリア関数
      this.histories = [];
    },
    pushHistory(history) {
      // 結果の追加
      this.histories.push(history);
    },
    exportCsv() {
      // CSV出力関数
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      let content = this.formatCsv();
      const blob = new Blob([bom, content], { type: "text/csv" });
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, this.name + "_result.csv");
        window.navigator.msSaveOrOpenBlob(blob, this.name + "_result.csv");
      } else {
        document.getElementById("download").href = window.URL.createObjectURL(
          blob
        );
      }
    },
    formatCsv() {
      // CSVフォーマット関数
      let content = "ボールが動き出した時間,ボールを離した時間,ボールが動き出した時間(Unix),ボールを離した時間(Unix),ターゲットからの距離\n";
      for (let i in this.histories) {
        if (content === "") {
          content = this.histories[i].join(",") + "\n";
        } else {
          content = content + this.histories[i].join(",") + "\n";
        }
      }
      return content;
    },
    paramsMenu() {
      this.anime = false;
      this.params = true;
      this.animeDisplay = "none";
      this.paramsDisplay = "";
      console.log(this.paramsDisplay);
    },
    animeMenu() {
      this.anime = true;
      this.params = false;
      this.animeDisplay = "";
      this.paramsDisplay = "none";
      console.log(this.paramsDisplay);
    }
  }
});
