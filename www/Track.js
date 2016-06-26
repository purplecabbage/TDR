




(function(exports) {
    
    var texture;
    //var tiles = [];
    var wayPoints = [ 3, 2, 1, 0, 12, 13, 25, 24, 36, 37, 38, 39, 27, 26, 14, 15, 16, 28, 40, 52, 51, 63, 62, 
                     50, 49, 48, 60, 72, 73, 85, 86, 87, 88, 76, 64, 65, 53, 54, 66, 78, 77, 89, 90, 91, 79, 
                     67, 68, 56, 57, 69, 81, 80, 92, 93, 94, 95, 83, 82, 70, 71, 59, 58, 46, 45, 44, 32, 31, 
                     19, 20, 21, 33, 34, 35, 23, 11, 10, 9, 8, 7, 6, 18, 30, 42, 41, 29, 17, 5, 4 ];
    
    var tilesWide = 12;
    var tilesHigh = 8;
    var tileSize = 128; // TODO: consider rect tiles with different width and height
    
    var screenWidth = 768;
    var screenHeight = 480;
    
    var trackWidth = tilesWide * tileSize;
    var trackHeight = tilesHigh * tileSize;
    
    var worldPosition = {x:0,y:0};
    
    exports.Track = {
        loadContent:function(contentManager) {
            /*
            XDocument trackDoc = XDocument.Load("Content/track2.tmx");
            XElement layer = trackDoc.Element("map").Element("layer");
            Tiles = new int[tilesWide * tilesHigh];
            int index = 0;
            foreach (XElement element in layer.Element("data").Elements("tile"))
            {
    
                Tiles[index++] = int.Parse(element.Attribute("gid").Value);
            }

            // Create the track source texture
            texture = contentManager.Load<Texture2D>("reordered");
            */
        },
        setTexture:function(img) {
          texture = img;  
        },
        worldToScreen:function(x,y) {
            return {x:x - worldPosition.x,
                    y:y - worldPosition.y};
        },
        getTileIndex:function(x,y) {
            var tileX = Math.floor(worldPosition.x / tileSize);
            var tileY = Math.floor(worldPosition.y / tileSize);
            var tileIndex = tileY * tilesWide + tileX;
            return tileIndex;
        },
        getPositionFromTileIndex:function(index){
            var x = index % tilesWide * tileSize + tileSize / 2;
            var y = index / tilesWide * tileSize + tileSize / 2;
            
            return new {x:x,y:y};
        },
        getWaypoints:function() {
            return wayPoints;
        },
        getNextWaypointFromTileIndex:function(index) {
            // get tile waypoint index from current tileIndex
            // get next 
            
            var waypoint = getPositionFromTileIndex(0);
            
            for (var x = 0; x < waypoints.length-1; x++)
            {
                if (waypoints[x] == tileIndex)
                {
                    waypoint = getPositionFromTileIndex(x+1);
                }
            }
            return waypoint;
        },
        isInView:function(vec2){
            var screenPos = this.worldToScreen(vec2.x,vec2.y);
            if(screenPos.x < 0 || 
                screenPos.x > screenWidth ||
                screenPos.y < 0 ||
                screenPos.y > screenHeight ) {
                return false;
            }
            return true;

        },
        // adjust our viewport to keep the car in it
        update:function(x,y) { // Vector2 carWorldPosition)
            worldPosition.x = x - screenWidth / 2;
            worldPosition.y = y - screenHeight / 2;
            
            if (worldPosition.x > trackWidth - screenWidth)
            {
                worldPosition.x = trackWidth - screenWidth;
            }
            else if (worldPosition.x < 0)
            {
                worldPosition.x = 0;
            }
            
            if (worldPosition.y > trackHeight - screenHeight)
            {
                worldPosition.y = trackHeight - screenHeight;
            }
            else if (worldPosition.y < 0)
            {
                worldPosition.y = 0;
            }
        },
        draw:function(ctx){
            for (var n = 0; n < tiles.length; n++)
            {
                var x = n % tilesWide * tileSize - worldPosition.x;
                var y = Math.floor(n / tilesWide) * tileSize - worldPosition.y;
            
                var destRect = new Rect(x, y, tileSize, tileSize);
            
                if (destRect.right() < 0          ||
                    destRect.left() >  screenWidth ||
                    destRect.bottom() < 0          ||
                    destRect.top() > screenHeight)
                {
                    continue; // tile is not visible
                }
            
                var tileIndex = tiles[n] - 1; // fucking 1 based Tiled crap
                var srcRect = new Rect(0,0,tileSize,tileSize);
            
                srcRect.x = tileIndex % 8 * tileSize;
                srcRect.y = Math.floor(tileIndex / 8) * tileSize;
            
                //spriteBatch.Draw(this.texture, destRect, srcRect, Color.White);
                
                ctx.drawImage(texture, 
                    srcRect.x,
                    srcRect.y,
                    tileSize,
                    tileSize,
                    destRect.x,
                    destRect.y,
                    tileSize,
                    tileSize);
            }
        }   
    };
})(window);    





// public Vector2 CheckTrackPosition(Sprite sprite)
// {
//     sprite.IsColliding = false;
// 
//     Vector2 pos = sprite.Position; // World position
//     int tileX = (int)pos.X / tileSize;
//     int tileY = (int)pos.Y / tileSize;
// 
//     int tileIndex = tileY * tilesWide + tileX;
// 
//     int tileType = Tiles[tileIndex];
// 
//     int xTile = (int)pos.X % tileSize;
//     int yTile = (int)pos.Y % tileSize;
// 
//     //Debug.WriteLine("tileIndex is " + tileIndex.ToString() + " and tileType = " + Tiles[tileIndex].ToString());
// 
//     switch (tileType)
//     {
//         case 11: // Corner TopLeft
//             if ((xTile * yTile) < 32 || xTile < 4 || yTile < 4)
//             {
// 
//                 //sprite.Position = new Vector2(pos.X + 16f, pos.Y + 16f);
//                 //sprite.Direction += MathHelper.Pi;
//                 sprite.IsColliding = true;
// 
//             }
//             break;
//         case 2: // edges at top and bottom
//             if (yTile < 4 || yTile > tileSize - 4)
//             {
//                 //sprite.Direction += MathHelper.Pi;
//                 sprite.IsColliding = true;
//             }
//             break;
//         case 12:  // Top right rounded
//             if (yTile < 4 || xTile > tileSize - 4 || ((tileSize - xTile) * yTile) < 32)
//             {
//                 //sprite.Direction += MathHelper.Pi;
//                 sprite.IsColliding = true;
//             }
//             break;
//         case 19:  // bottom left round
//             if (tileSize - yTile < 4 || xTile < 4 || (tileSize - yTile) * xTile < 32)
//             {
//                 //sprite.Direction += MathHelper.Pi;
//                 sprite.IsColliding = true;
//             }
//             break;
//         case 1: // edges on left and right
//             if (xTile < 4 || xTile > tileSize - 4)
//             {
//                 //sprite.Direction += MathHelper.Pi;
//                 sprite.IsColliding = true;
//             }
//             break;
//         case 20:   // bottom right round
//             if (yTile > tileSize - 4 || xTile > tileSize - 4 || (tileSize - yTile) * (tileSize - xTile) < 32)
//             {
//                 //sprite.Direction += MathHelper.Pi;
//                 sprite.IsColliding = true;
//             }
//             break;
//         default:
//             
//             break;
//     }
// 
//     if (sprite.IsColliding)
//     {
//         int posX = (int)(pos.X / tileSize) * tileSize + 64;
//         int posY = (int)(pos.Y / tileSize) * tileSize + 64;
// 
//         return new Vector2(posX, posY);
// 
//         // Play the sound
// 
//         //soundEffect.Play();
// 
//     }
// 
//     return sprite.Position;
// }
