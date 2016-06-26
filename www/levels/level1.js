
// TODO: modularize 
function degToRad(deg) {
    return deg * Math.PI / 180;
}

(function(window) {
    
    var width, height;
    var ctx;
    var car,carThrust;
    var carX = 200;
    var carY = 200;
    var dX = 0, dY = 0;
    var GRAVITY = 0;
    var FRICTION = 1.5;
    var THRUSTVAL = 12.0;
    var rotation = 0;
    
    var aiCar;
    var aiCars = [];
    var aiCarCount = 8;
    
    
    var worldWidth;
    var worldHeight;
    
    var srcTilesWide = 8,srcTilesHigh = 4;

    var keys = [0,0,0,0];
    // 39 : right
    // 37 : left
    // 38 : up
    // 
    

    
    window.level1 = {
        init:function(canvas) {

            console.log("level1 init");
            
            trackSheet = new Image();
            trackSheet.onload = function() {
                window.Track.setTexture(trackSheet);
            };

            var carWP = [];
            for(var v=0; v < wayPoints.length; v++ )
            {
                var xOff = wayPoints[v] % tilesWide;
                var yOff = Math.floor(wayPoints[v] / tilesWide);
                var pt = new Vector2(xOff * tileWidth + 64, yOff * tileHeight + 64);

                carWP.push(pt);

            }

            
            for(var n = 0; n < aiCarCount; n++)
            {
                aiCar = new RaceCar(true);
                aiCar.init(true);
                aiCar.loadContent("images/car.png");
                aiCar.waypoints = carWP;
                var wpIndex = carWP.length - (aiCarCount - n);
                var wp = carWP[wpIndex];
                aiCar.waypointIndex = wpIndex;
                aiCar.location.x = wp.x;
                aiCar.location.y = wp.y;
                aiCars.push(aiCar);
            }


            //aiCar.waypoints = carWP;
            
            trackSheet.src = srcImagePath;
            
            
            ctx = canvas.getContext('2d'); 

            width = parseInt(canvas.width);
            height = parseInt(canvas.height);
            car = new Image();
            car.addEventListener("load",function(){
                console.log("car loaded");
                // TODO: init has to async fire an event to let the world know when it has loaded everything
            });
            car.src = "images/car.png";
            
            // carThrust = new Image();
            // carThrust.src = "images/carThrust.png";
            
            var level = this; // todo, input state should be part of the lib
            document.addEventListener("keydown",function(e) {
                //console.log("key is down :: " + e.keyCode);
                if(e.keyCode == 32){
                    // level.fireBullet();
                }
                keys[e.keyCode - 37] = 1;
            });
            
            document.addEventListener("keyup",function(e) {
                //console.log("key is down :: " + e.keyCode);
                keys[e.keyCode - 37] = 0;
            });
            
        },
        update:function(elapsed,canvas) {
            
            //console.log("level1 update " + keys); 
            // check input
            if(keys[0]) {
                rotation -= 2;
            }
            else if(keys[2]) {
                rotation += 2;
            }
            var thrust = 0;
            if(keys[1]) {
                thrust = THRUSTVAL * elapsed / 1000;
            }
            if(keys[3]) {
                thrust = -(THRUSTVAL * elapsed / 1000) / 2;
            }
            
            
            
            dX += thrust * Math.cos((90 - rotation) * Math.PI / 180);
            dY += thrust * Math.sin((90 - rotation) * Math.PI / 180);
            
            dX -= dX * FRICTION * elapsed / 1000;
            dY -= dY * FRICTION * elapsed / 1000;
            
            // add gravity
            // yVel -= elapsed / 1000 * GRAVITY;
            
            carX = carX + dX;
            carY = carY - dY;

            Track.update(carX,carY);
            var transPos = Track.worldToScreen(carX,carY);
            
            if( transPos.y >= height - 12 || transPos.y < 12 ) {
                transPos.y += dY * 1.1;
                dY *= -0.8;
            }
                      
            if( transPos.x >= width - 12 || transPos.x < 12) {
                transPos.x -= dX * 1.1;
                dX *= -0.8;
            }
            
            transPos.x = Math.round(transPos.x);
            transPos.y = Math.round(transPos.y);

            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(0, 0, width, height);
            
            Track.draw(ctx);
            
            ctx.save();
            ctx.translate(transPos.x,transPos.y);
            ctx.rotate(degToRad(rotation));
            ctx.drawImage(car , -12,-12);

            ctx.restore();
            
            var msElapsed = elapsed/1000;
            var aCar;
            for(var s = 0; s < aiCarCount; s++)
            {
                aCar = aiCars[s];
                aCar.update(msElapsed);
                if(Track.isInView(aCar.location))
                {
                    aCar.draw(ctx);
                }
            }
            
            
            
            ctx.strokeStyle = "rgb(0,255,0)";
            
            // // // roundedRect(ctx,12,12,150,150,15);
            // for(var n=0; n < bullets.length; n++){
            //     var bullet = bullets[n];
            // 
            //     bullet.x = bullet.x + bullet.xV * elapsed / 1000;
            //     bullet.y = bullet.y - bullet.yV * elapsed / 1000;
            //     
            //     roundedRect(ctx,bullet.x,bullet.y,4,4,2);
            // }
            
        }
    }

})(window);