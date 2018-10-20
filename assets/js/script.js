// canvasの設定
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

new Vue({
  el: "#app",
  data: {
    anime: false,
    animeDisplay: 'none',
    params: true,
    paramsDisplay: '',
    canvas: canvas,
    ctx: ctx,
    x: 10, // x軸
    y: 30, // y軸
    g: 9.8, // 重力加速度
    vx: 20, // 水平速度
    vy: 0.0, // 速度
    t: 0.15, // 時間
    k: 0.6,
    mode: false,
    name: '',
    startTime: '',
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
    onMouseDown() {
      // マウスダウン関数
      console.log(this.mode);
      this.startTime = moment().format("YYYY年MM月DD日 HH:mm:ss.SSS");

      this.draw(this.horizontalMove);
    },
    onMouseUp() {
      // マウスアップ関数
      this.fallTime = moment().format("YYYY年MM月DD日 HH:mm:ss.SSS");
      this.draw(this.verticalMove);
    },
    horizontalMove() {
      // 水平に動かす関数

      // 描画クリア
      if(!this.mode){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      };
      // taget描画
      this.target();
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.ctx.fill();
      this.ctx.closePath();
      this.x += this.vx * this.t;
      this.requestAnimationFrameId = requestAnimationFrame(this.horizontalMove);
    },
    verticalMove() {
      // 垂直方向に動かす関数

      // 描画クリア
      if(!this.mode){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      };
      // taget描画
      this.target();
      // 描画Start
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.ctx.fill();
      this.ctx.closePath();

      this.vy += this.g * this.t;
      this.y += this.vy * this.t;

      if (this.y > this.canvas.height - 5) {
        cancelAnimationFrame(this.requestAnimationFrameId);
        // 検証結果を追加
        this.pushHistory([
          this.startTime,
          this.fallTime,
          this.x - this.canvas.width / 2
        ]);
        return;
      }
      this.requestAnimationFrameId = requestAnimationFrame(this.verticalMove);
    },
    draw(moveFunc) {
      // 描画実行関数
      this.target();
      if (this.y > this.canvas.height - 5) {
        cancelAnimationFrame(this.requestAnimationFrameId);
      } else {
        moveFunc();
      }
    },
    clear() {
      // 描画クリア&初期値クリア関数
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.x = 10;
      this.y = 30; //距離
      this.g = 9.8; //重力加速度
      this.vy = 0.0; //速度
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
    target() {
      // ターゲット描画関数
      this.ctx.fillStyle = "rgb(204, 0, 0, 0.4)";
      this.ctx.fillRect(this.canvas.width / 2, 0, 1, this.canvas.height);
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
      let content = "";
      for(let i in this.histories){
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
      this.params =  true;
      this.animeDisplay = 'none';
      this.paramsDisplay = '';
      console.log(this.paramsDisplay )
    },
    animeMenu() {
      this.anime = true;
      this.params = false;
      this.animeDisplay = '';
      this.paramsDisplay = 'none';
      console.log(this.paramsDisplay )
    }
  }
});
