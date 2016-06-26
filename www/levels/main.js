
(function(window) {
    
    var width, height, ctx;
    
    function roundedRect(ctx,x,y,width,height,radius){
      ctx.beginPath();
      ctx.moveTo(x,y+radius);
      ctx.lineTo(x,y+height-radius);
      ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
      ctx.lineTo(x+width-radius,y+height);
      ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
      ctx.lineTo(x+width,y+radius);
      ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
      ctx.lineTo(x+radius,y);
      ctx.quadraticCurveTo(x,y,x,y+radius);
      ctx.closePath();
      ctx.stroke();
    }
    
 
    window.level = {   
        
        init:function(canvas) {
           console.log("main level init"); 
           ctx = canvas.getContext('2d'); 
           width = parseInt(canvas.width);
           height = parseInt(canvas.height);       
           canvas.addEventListener("mousedown",this);   
        },
        handleEvent:function(evt) {
            
            var x = evt.offsetX;
            var y = evt.offsetY;
            
            if(x > 120 &&
                x < 500 && 
                y > 120 && 
                y < 240)
                {
                    canvas.removeEventListener("mousedown",this);   
                }
        },
        update:function(elapsed,canvas) {
            console.log("level updating");
            
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(0, 0, width, height);
            ctx.save();            
            
            ctx.restore();
            ctx.strokeStyle = "rgb(0,255,0)";
            ctx.fillStyle = "rgb(0,0,255)";
            roundedRect(ctx,120,120,380,120,12);
            ctx.font = '16pt Courier';
            ctx.fillStyle = "rgb(0,128,0)";
            ctx.fillText("Level 1",260,180);
        }
    }
    
    
})(window);