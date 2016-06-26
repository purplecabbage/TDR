

(function(exports){
    
    var Vector2 = function(x,y) {
        this.x = x;
        this.y = y;
    };
    
    Vector2.DistanceToCoords = function DistanceToCoords(v1,v2) {
        var dX = v1.x - v2.x;
        var dY = v1.y - v2.y;
        
        return Math.sqrt(dX * dX + dY * dY);
    };
    
    Vector2.prototype.distanceToVector2 = function distanceToVector2(vec2) {
        var dX = vec2.x - this.x;
        var dY = vec2.y - this.y;
        
        return Math.sqrt(dX * dX + dY * dY);
    };
    
    //returns a new vector which is this - that
    Vector2.prototype.minus = function difference(vec2) {
        var dX = vec2.x - this.x;
        var dY = vec2.y - this.y;
        return new Vector2(dX,dY);
    };
    
    // returns a new vector which is this + that
    Vector2.prototype.plus = function difference(vec2) {
        var dX = vec2.x + this.x;
        var dY = vec2.y + this.y;
        return new Vector2(dX,dY);
    };
    
    // adds that to this, returns this
    Vector2.prototype.add = function add(vec2) {
        this.x += vec2.x;
        this.y += vec2.y;
        return this;
    };
    
    // adds that to this, returns this
    Vector2.prototype.subtract = function subtract(vec2) {
        this.x -= vec2.x;
        this.y -= vec2.y;
        return this;
    };
    
    // scales this by input factor
    Vector2.prototype.scaleBy = function scaleBy(scaleFactor) {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        return this;
    };
    
    Vector2.prototype.toString = function() {
        return "{x=" + this.x +",y=" + this.y +"}";
        
    }
    

    

    
    exports.Vector2 = Vector2;

})(window);