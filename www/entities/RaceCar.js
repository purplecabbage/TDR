
(function(exports){

    function RaceCar(){}

    RaceCar.prototype = {
        bounceFactor:-1.1,
        slipFactor:4.0,
        vX:0,
        vY:0,
        steeringInput:0,
        isAIDriver:false,
        aiDriver:null,
        waypointIndex:0,
        srcImage:null,
        collisionBounds:null,
        /// The list of points the car will move to in order from first to last
        waypoints:null,
        nextWaypoint:function() {
            
            return this.waypoints[this.waypointIndex];
        },
        /// <summary>
        /// The "close enough" limit, if the car is inside this many pixel 
        /// to it's destination it's considered at it's destination
        /// </summary>
        atDestinationLimit:32,
        /// <summary>
        /// This is how much the Car can turn in one second in radians, since Pi 
        /// radians makes half a circle the car can turn all the way around in one second
        /// </summary>        
        // degrees in a second
        maxAngularVelocity:90,
        /// This is the Car’s best possible movement speed
        maxMoveSpeed:222,
        /// This is most the car can speed up or slow down in one second
        maxMoveSpeedDelta:111,
        /// Length 1 vector that represents the car’s movement and facing direction
        vDirection:null, // Vector2
        /// The car's current movement speed
        moveSpeed:0,
        /// The car's location on the map
        location:null, // Vector2 ( consider making this Position )
        /// Linear distance to the car's current destination
        distanceToDestination:function(){
            return Vector2.DistanceToCoords(this.location,this.nextWaypoint());
        },
        /// True when the car is "close enough" to it's destination
        atDestination:function(){
            return this.distanceToDestination() < this.atDestinationLimit;
        },
        init:function(bIsAIDriver) {
            
            this.waypoints = [  {x:50,y:50},
                                {x:500,y:50},
                                {x:500,y:300},
                                {x:300,y:300},
                                {x:100,y:400},                                
                                {x:50,y:300}];
                        
            this.vDirection = new Vector2(1,0);
            this.location = new Vector2(600,400);
            
            this.isAIDriver = bIsAIDriver;
            
            if(this.isAIDriver) {
                this.aiDriver = new AIDriver(this);
            }
            
            this.collisionBounds = new Rect(0, 0, 24, 24);
            
        },
        /// Load image for car
        loadContent:function(imagePath) {
            this.srcImage = new Image();
            this.srcImage.addEventListener("load",function(){
                console.log("car loaded");
                // TODO: init has to async fire an event to let the world know when it has loaded everything
            });
            this.srcImage.src = imagePath;
        },
        draw:function(ctx){
            
            // ctx.save();

            // ctx.font = '16pt Courier';
            // ctx.fillStyle = "rgb(64,128,255)";
            // ctx.lineStyle = "rgb(64,128,255)";
            
            // for(var n = 0; n < this.waypoints.length; n++) {
            //     ctx.translate();
            //     var screenCoords = Track.worldToScreen(this.waypoints[n].x,this.waypoints[n].y);
            //     ctx.fillText(n,screenCoords.x,screenCoords.y);
            // }
            // ctx.restore();
            
            if (this.isAIDriver) {
                var facingDirection = Math.atan2(this.vDirection.y, this.vDirection.x);

                //console.log("facingDirection = " + facingDirection);
                var transPos = Track.worldToScreen(this.location.x,this.location.y);
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(transPos.x,transPos.y);
                var screenWaypoint = Track.worldToScreen(this.waypoints[this.waypointIndex].x,this.waypoints[this.waypointIndex].y);
                ctx.lineTo(screenWaypoint.x,screenWaypoint.y);   
                ctx.stroke();
                ctx.closePath();             
                ctx.translate(transPos.x,transPos.y);
                ctx.rotate(facingDirection + (Math.PI / 2 ));
                ctx.drawImage(this.srcImage , -12,-12);
                ctx.restore();
            }
            else {
                
            }
        },
        updateInput:function() {

        },
        isCollidingWith:function(otherCar) {
            return  false; //(this.bounds.intersects(otherCar.bounds));
        },
        updateAI:function(elapsed) {
            this.aiDriver.update(elapsed);
            
            //console.log("preclamp this.moveSpeed " + this.moveSpeed);
            this.moveSpeed = clamp(this.moveSpeed,this.maxMoveSpeed,-this.maxMoveSpeed);
            // console.log("this.moveSpeed " + this.moveSpeed);
            // 
            this.location.x = this.location.x + (this.vDirection.x * this.moveSpeed * elapsed);        
            this.location.y = this.location.y + (this.vDirection.y * this.moveSpeed * elapsed);      
            // 
            if (this.atDestination()) {
                this.waypointIndex++;
                this.waypointIndex %= this.waypoints.length;
            }
        },
        update:function(elapsed) {
            if (this.isAIDriver) {
                this.updateAI(elapsed);                
                return;
            }
        }
        


    };
    
    exports.RaceCar = RaceCar;


})(window);


