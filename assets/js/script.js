// canvasの設定
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var startX = 10;
var startY = 30;
var fieldX = 20; //(m)
var fieldY = 20; //(m)

new Vue({
    el: "#app",
    data: {
        width: window.innerWidth,
        height: window.innerHeight,
        canvasWidth: '600px',
        canvasHeight: '400px',
        anime: false,
        animeDisplay: "none",
        params: true,
        paramsDisplay: "",
        canvas: canvas,
        ctx: ctx,
        x: startX, // x軸
        y: startY, // y軸
        g: 9.08665, // 重力加速度(m/s^2)
        m: 5, // 質量(kg)
        vx: 2.0, // 水平速度(m/s)
        vy: 0.0, // 垂直速度
        t: 0.15, // 時間
        k: 0.24, // 空気抵抗係数(kg/m)
        ax: 0.0,
        ay: 9.08665,
        targetX: canvas.width / 2,
        targetY: canvas.height,
        mode: false,
        isLine: true,
        isBall: true,
        moveStartTime: moment(),
        name: "",
        startTime: "",
        startUnixTime: "",
        fallTime: "",
        fallUnixTime: "",
        fallBoxX: 0,
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
            moveStartTime = moment();
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
            this.fallBoxX = this.x;
            if (this.isBall) {
                this.draw(this.verticalMove);
            } else {
                cancelAnimationFrame(this.requestAnimationHFrameId);
                cancelAnimationFrame(this.requestAnimationVFrameId);
            }
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
            // ballの描画
            this.ball();
            // this.vx = this.vx + this.ax * this.t;
            var current_time = moment();
            var elapsed_time = (current_time.format('x') - this.startUnixTime) / 1000;
            this.x = this.vx * elapsed_time;
            // console.log(this.x + " = " + this.vx + " * " + elapsed_time);

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
            // ballの描画
            this.ball();

            var current_time = moment();
            var elapsed_time = (current_time.format('x') - this.startUnixTime) / 1000;
            this.y = (this.m/this.k) * Math.log ( Math.cosh( elapsed_time / Math.sqrt( this.m/(this.g * this.k) ) ) ); 
            // this.vy += (this.g - (this.k / this.m)) * this.t;
            // this.y += this.vy * this.t;


            if (this.y > this.canvas.height - 5) {
                cancelAnimationFrame(this.requestAnimationHFrameId);
                cancelAnimationFrame(this.requestAnimationVFrameId);
                // 検証結果を追加
                this.pushHistory([
                    this.startTime,
                    this.fallTime,
                    this.startUnixTime,
                    this.fallUnixTime,
                    this.x - this.targetX,
                    this.fallBoxX - this.targetX,
                    (this.fallBoxX - startX) / (this.fallUnixTime - this.startUnixTime)
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
        ball() {
            if (this.isBall) {
                this.ctx.beginPath();
                this.ctx.arc((this.x/fieldX) * this.width, (this.y/fieldY)* this.height, 5, 0, Math.PI * 2, false);
                this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                this.ctx.fill();
                this.ctx.closePath();
            }
        },
        target() {
            // ターゲット描画関数
            if (this.isLine) {
                this.ctx.beginPath();
                this.ctx.fillStyle = "rgb(204, 0, 0, 0.4)";
                this.ctx.fillRect(this.targetX, this.canvas.height - 10, 1, this.canvas.height);
                this.ctx.closePath();
            } else {
                this.ctx.beginPath();
                this.ctx.fillStyle = "rgb(204, 0, 0, 0.4)";
                this.ctx.fillRect(this.targetX, 0, 1, this.canvas.height);
                this.ctx.closePath();
            }

        },
        box() {
            // 箱
            this.ctx.beginPath();
            this.ctx.strokeRect((this.x/fieldX) * this.width, 20, 20, 20);
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
            let content = "ボールが動き出した時間,ボールを離した時間,ボールが動き出した時間(Unix),ボールを離した時間(Unix),ターゲットからの距離,ボールを離した時のターゲットからの箱の距離,px/ms\n";
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
})