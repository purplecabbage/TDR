

(function(exports){
    
    var Rect = function(x,y,w,h) {
       this.x = x;
       this.y = y; 
       this.width = w;
       this.height = h;
    };
    
    Rect.prototype = {
        x:0,
        y:0, 
        width:0,
        height:0,
        left:function(){
            return this.x;
        },
        top:function(){
            return this.y;
        },
        right:function(){
            return this.x + this.width;
        },
        bottom:function(){
            return this.y + this.height;
        },
        intersects:function(otherRect){
            // any of these means we are intersecting
            if( this.x > otherRect.x + otherRect.width ||
                this.x + this.width < otherRect.x     ||
                this.y > otherRect.y + otherRect.height||
                this.y + this.height < otherRect.y ) {
                    return false;
                }
            return true;                
        }
    };
    
    exports.Rect = Rect;

})(window);