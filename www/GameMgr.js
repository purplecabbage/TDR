

(function(window,document) {
    
    var requestAnimationFrame = window.requestAnimationFrame || 
                                window.mozRequestAnimationFrame || 
                                window.webkitRequestAnimationFrame || 
                                window.msRequestAnimationFrame;

    window.gameMgr = {
        gameRunning: false,
        boundGameStep: null,
        frameCount:0,
        frameRate:0,
        tElapsed:0,
        init: function() {
            this.boundGameStep = this.gameStep.bind(this);
            this.currentLevel.init(canvas);

        },
        toggleGameplay: function() {
            this.gameRunning = !this.gameRunning;
            if (this.gameRunning) {
                this.lastTime = 0;
                requestAnimationFrame(this.boundGameStep, canvas);
            }
        },
        gameStep: function(timeStamp) {
            
            //timeStamp = timeStamp || + new Date();
            
            if (this.lastTime) {
                var elapsed = timeStamp - this.lastTime;
                this.tElapsed += elapsed;
                if(this.tElapsed > 1000)
                {
                    this.frameRate = Math.round((this.frameRate + this.frameCount) / 2);
                    this.frameCount = -1;
                    this.tElapsed = 0;
                    //console.log("this.frameRate = " + this.frameRate);
                }
                this.currentLevel.update(elapsed,canvas);
                this.frameCount++;
            }


            if (this.gameRunning) {
                requestAnimationFrame(this.boundGameStep, canvas);
            }
            
            var ctx = canvas.getContext('2d');
            ctx.font = '16pt Courier';
            ctx.fillStyle = "rgb(0,128,0)";
            ctx.fillText("FPS: " + this.frameRate ,10,20);

            this.lastTime = timeStamp;
        },
        loadLevel:function(levelPath){
            // TODO:
        }
    };

    togglePlay.addEventListener("click", function() {
        window.gameMgr.toggleGameplay();
    });

    document.addEventListener("DOMContentLoaded", function() {
        gameMgr.currentLevel = level1;
        gameMgr.init(canvas);
        
    });

})(window,document);
