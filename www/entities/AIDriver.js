
/// <summary>
/// Returns the angle expressed in radians between -Pi and Pi.
/// </summary>
var TwoPi = Math.PI * 2;

var clamp = function(value,max,min) {
  return Math.min( Math.max( value, min), max);  
};

var clampRadians = function(radians) {
    while (radians < -Math.PI) {
        radians += TwoPi;
    }
    while (radians > Math.PI) {
        radians -= TwoPi;
    }
    return radians;
};

var clampDegrees = function(degrees) {
    while (degrees < -180) {
        degrees += 360;
    }
    while (degrees > 180) {
        degrees -= 360;
    }
    return degrees;
};



(function(exports){
    
    var AIDriver = function(car) {
       this.raceCar = car;
       this.moveSpeed = 0;
    }
    
    exports.AIDriver = AIDriver;
    
    AIDriver.prototype = {
        /// <summary>
        /// Update adjusts the car’s movement speed as necessary to ensure that 
        /// the current waypoint is inside its’ turning radius and steers the car 
        /// towards the waypoint based on its’ maximum angular velocity.
        /// </summary>
        update:function(elapsed) {

            // This code causes the car to change its speed gradually while it 
            // moves toward the waypoint previousMoveSpeed tracks how fast the 
            // car was going, desiredMoveSpeed finds how fast the car wants to 
            // go and Math.Clamp keeps the tank from accelerating or decelerating 
            // too fast.
            var previousMoveSpeed = this.raceCar.moveSpeed;
            var desiredMoveSpeed = this.findMaxMoveSpeed(this.raceCar.nextWaypoint());
            
            this.raceCar.moveSpeed = clamp(desiredMoveSpeed,
                                  previousMoveSpeed + this.raceCar.maxMoveSpeedDelta * elapsed,
                                  previousMoveSpeed - this.raceCar.maxMoveSpeedDelta * elapsed);
                                  

            //console.log("this.raceCar.moveSpeed = " + this.raceCar.moveSpeed);
                                  
            // This code causes the car to turn towards the waypoint.  First we 
            // take the vector that represents the tanks’ current heading, 
            // Tank.Direction, and convert it into an angle in radians. Then we 
            // use TurnToFace to make the tank turn towards it’s waypoint based 
            // on it’s turning speed, Tank,MaxAngualrVelocity. After we have the 
            // new direction in radian we convert it back into a vector.
            var facingDirection = Math.atan2( this.raceCar.vDirection.y, this.raceCar.vDirection.y);

            facingDirection = this.turnToFace(this.raceCar.location, 
                                         this.raceCar.nextWaypoint(),
                                         facingDirection, 
                                         this.raceCar.maxAngularVelocity * elapsed);
                                       
                                         
            //console.log("facingDirection = " + facingDirection);                                         

            this.raceCar.steeringInput = facingDirection;
// Math.cos((90 - rotation) * Math.PI / 180);
            this.raceCar.vDirection = new Vector2(Math.cos(facingDirection) ,Math.sin(facingDirection));
            
            //console.log("this.raceCar.vDirection = " + this.raceCar.vDirection.toString());

        },
        
        /// <summary>
        /// Estimate the Car's best possible movement speed to it's destination
        /// </summary>
        /// <param name="newDestination">The Car's target location</param>
        /// <returns>Maximum estimated movement speed for the Car 
        /// up to RaceCar.MaxMoveSpeed</returns>
        findMaxMoveSpeed:function(waypoint) {
            var finalSpeed = this.raceCar.maxMoveSpeed;
            // Given a velocity v (RaceCar.MaxMoveSpeed) and an angular velocity 
            // w(RaceCar.MaxAngularVelocity), the smallest turning radius 
            // r(turningRadius) of the car is the velocity divided by the turning
            // speed: r = v/w 
            
            var turningRadius = this.raceCar.maxMoveSpeed / this.raceCar.maxAngularVelocity;

            // This code figures out if the car can move to its waypoint from its 
            // current location based on its turning circle(turningRadius) when its 
            // moving as fast as possible(RaceCar.MaxMoveSpeed). For any given turning 
            // circle there is an area to either side of the car that it cannot 
            // move into that can be represented by 2 circles of radius turningRadius 
            // on either side of the car. If the waypoint is inside one of these 
            // 2 circles the car will have to slow down before it can move to it

            // This creates a vector that’s orthogonal to the car in the direction 
            // it's facing. This means that the vector is at a right angle to the 
            // direction the car is pointing in.
            var orth = new Vector2(this.raceCar.vDirection.y, -this.raceCar.vDirection.x);

            // In this code we can combine the car’s location, the orthogonal 
            // vector and the car’s turning radius to find the 2 points that 
            // describe the centers of the circles the car cannot move into. 
            // Then we use Vector2.Distance to find the distances from each circle 
            // center to the waypoint. Afterwards Math.Min return the distance from 
            // the waypoint to whichever circle was closest.
            
            orth = orth.scaleBy(turningRadius);
            var vctLeft = this.raceCar.location.plus(orth);
            var vctRight = this.raceCar.location.minus(orth);
            
            var leftDist = Vector2.DistanceToCoords(waypoint, vctLeft);
            var rightDist = Vector2.DistanceToCoords(waypoint, vctRight);
            
            //console.log("leftDist = " + leftDist);            
            //console.log("rightDist = " + rightDist);
            
            var closestDistance = Math.min(leftDist,rightDist);

             //console.log("closestDistance = " + closestDistance);                               

            // If closestDistance is less than turningRadius, then the waypoint is 
            // inside one of the 2 circles the Car cannot turn into when moving at 
            // RaceCar.MaxMoveSpeed, instead we need to estimate a speed that the car 
            // can move at.
            if (closestDistance < turningRadius)
            {
                console.log("Less than turning radius");
                // This finds the radius of a circle where the Car's location and 
                // the waypoint are 2 points on opposite sides of the circle.
                var radius = Vector2.DistanceToCoords(this.raceCar.location, waypoint) / 2;
                // Now we use the radius from above to and RaceCar.MaxAngularVelocity 
                // to find out how fast we can move towards the waypoint by taking 
                // r = v/w and turning it into v = r*w
                finalSpeed = this.raceCar.maxAngularVelocity * radius;
            }


            return finalSpeed;
        },
        
        /// <summary>
        /// Calculates the angle that an object should face, given its position, its
        /// target's position, its current angle, and its maximum turning speed.
        /// </summary>
        turnToFace:function(position, faceThis, currentAngle, turnSpeed) {
            // consider this diagram:
            //         C 
            //        /|
            //      /  |
            //    /    | y
            //  / o    |
            // S--------
            //     x
            // 
            // where S is the position of the spot light, C is the position of the cat,
            // and "o" is the angle that the spot light should be facing in order to 
            // point at the cat. we need to know what o is. using trig, we know that
            //      tan(theta)       = opposite / adjacent
            //      tan(o)           = y / x
            // if we take the arctan of both sides of this equation...
            //      arctan( tan(o) ) = arctan( y / x )
            //      o                = arctan( y / x )
            // so, we can use x and y to find o, our "desiredAngle."
            // x and y are just the differences in position between the two objects.
            var x = faceThis.x - position.x;
            var y = faceThis.y - position.y;

            // we'll use the Atan2 function. Atan will calculates the arc tangent of 
            // y / x for us, and has the added benefit that it will use the signs of x
            // and y to determine what cartesian quadrant to put the result in.
            // http://msdn2.microsoft.com/en-us/library/system.math.atan2.aspx
            var desiredAngle = Math.atan2(y, x);
            
 

            // so now we know where we WANT to be facing, and where we ARE facing...
            // if we weren't constrained by turnSpeed, this would be easy: we'd just 
            // return desiredAngle.
            // instead, we have to calculate how much we WANT to turn, and then make
            // sure that's not more than turnSpeed.

            // first, figure out how much we want to turn, using clampRadians to get our
            // result from -Pi to Pi ( -180 degrees to 180 degrees )

            var difference = clampRadians(desiredAngle - currentAngle);
            
            
            //console.log("desiredAngle=" + desiredAngle + " currentAngle=" + currentAngle + " difference=" + difference + " turnSpeed=" + turnSpeed);
            

            // clamp that between -turnSpeed and turnSpeed.
            difference = clamp(difference, turnSpeed, -turnSpeed);
            
            
            
           //console.log("difference = " + difference);

            //return desiredAngle;
            
            // so, the closest we can get to our target is currentAngle + difference.
            // return that, using clampRadians again.
            return clampRadians(currentAngle + difference);
        }

    };
})(window);










