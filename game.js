// Downhill skating game

// what is this first line, with the leading semicolon?
;(function() {
    var Game = function(){
        var screen = document.getElementById("screen").getContext("2d");

        screen.imageSmoothingEnabled = false;
        screen.webkitImageSmoothingEnabled = false;
        screen.mozImageSmoothingEnabled = false;
        
        this.keyboarder = Keyboarder();

        this.size = {x: screen.canvas.width, y: screen.canvas. height};
        this.center = { x : this.size.x / 2, y: this.size.y / 2}; 

        // image stuff from http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/ 
        this.playerImage = new Image();
        this.playerImage.src = "images/skatersprite1.png";
        this.evilTree = new Image();
        this.evilTree.src = "images/eviltree.png";

        this.road = buildRoad(this, this.size.y, 0, 250);
        this.player = new Player(this);
        this.bodies = [this.road, this.player ];
        
        this.gravity = 0.9;
        var self = this;

        var tick = function() {
            self.update();
            self.draw(screen);
            requestAnimationFrame(tick);
        };

        tick();
    };

    Game.prototype = {
        update: function() {
            for (var i = 0; i < this.bodies.length; i++) {
                if (this.bodies[i].update !== undefined) {
                    this.bodies[i].update();
                }
            }

            reportCollisions(this.bodies);
        },

        draw: function(screen) {
            
            screen.clearRect(0, 0, this.size.x, this.size.y);
            
            for (var i = 0; i < this.bodies.length; i++) {
                if (this.bodies[i].draw !== undefined) {
                    this.bodies[i].draw(screen);
                }
            }
        },

        addBody: function(body) {
            
            this.bodies.push(body);

        },

        removeBody: function(body) {
            var bodyIndex = this.bodies.indexOf(body);
            if(bodyIndex !== -1) {
                this.bodies.splice(bodyIndex, 1);
            }
        }
    };


    var Player = function(game) {
        this.game = game;
        this.size = { x: 20, y: 20 };
        this.center = {x: game.center.x, y: 100};
        this.keyboarder = new Keyboarder();
        this.image = game.playerImage;
        this.sprite = sprite ( screen, this, { w: 40, h: 40 }, 8 );
    };

    Player.prototype = {
        update: function() {

        },

        draw: function(screen) {
        
            console.log(this.sprite);            
            this.sprite.update;
            this.sprite.render;
        
        },

        collision: function(otherBody) {

            throw "implement me";

            if (otherBody.slope != undefined) {
                if (this.tilt != otherBody.slope) {
                     console.log("changing");
                }
                this.tilt = otherBody.slope;
            }

        }
    };

    var RoadSegment = function (game, slope, center) {
        this.game = game;
        this.slope = slope;
        this.size = { x: 300, y: slope }
        this.center = center
    };

    RoadSegment.prototype = {
        draw: function(screen) {
            drawRect(screen, this, "blue");
            //drawText(screen, { x: 50, y: this.center.y }, this.slope );
            //drawText(screen, {x: 25, y: 50 }, this.yspeed );
        },

        collision: function(otherBody) {

            if (this.slope != otherBody.tilt) {
                this.yaccel = this.game.gravity * Math.sin( 1 - this.slope / 100);
                console.log(this.yaccel); 
                otherBody.tilt = this.slope;
            }
        }
    };

    var Decoration = function(game) {

        this.game = game;
        this.size = { x: 64, y: 64 } ;
        this.center = { x: game.center.x, y: game.center.y };
        this.image = game.eviltree;
        this.sprite = sprite ( screen, eviltree );
    };

    var Road = function (game) {
        this.game = game;
        this.size = { x: 250, y: game.size.y } 
        this.center = {x: game.center.x, y: game.center.y};
        this.yaccel = 0;
        this.yspeed = 5;
        this.xspeed = 5;
        this.friction = -0.05;
        this.direction = 0;
        this.segments = [];
    };

    Road.prototype = {
        update: function() {
            
            var lowesty = 0;

            if (this.yspeed < 10) {
                this.yspeed = this.yspeed + (this.yspeed * this.yaccel);
            }
            else if (this.acceleration > 10) { 
                this.acceleration = 10;
            }
            
            for (var i = 0; i < this.segments.length; i ++) {
                
                this.segments[i].center.y -= this.yspeed;

                if (this.segments[i].center.y > lowesty) {
                    lowesty = this.segments[i].center.y;
                }

                if (isDown(37)) {
                    this.segments[i].center.x += this.xspeed;
                }
                else if (isDown(39)) {
                    this.segments[i].center.x -= this.xspeed;
                }
            }
            
            function isOnScreen(obj) {
                return (obj.center.y > -50);
            }

            var  new_segments = this.segments.filter(isOnScreen);
            
            if (lowesty < 550) {
                
                new_segments = new_segments.concat(buildRoad(this.game, 200, lowesty, this.segments[0].center.x).segments);

            }

            this.segments = new_segments;
            
        },

        draw: function(screen) {
            for (var i = 0; i < this.segments.length; i++) {
                this.segments[i].draw(screen);
            }
        },

        collision: function(otherBody) {
            
            /*
            if (this.slope != otherBody.tilt) {
                this.yaccel = this.game.gravity * Math.sin( 1 - this.slope / 100);
                console.log(this.yaccel); 
                otherBody.tilt = this.slope;
            }*/

        }

    };

    var buildRoad = function(game, road_size, ystart, x) {

        var road = new Road(game);
        var y = ystart;
        var yend = y + road_size;

        var curSlope = 100;

        var x = x;

        while (y < yend) {

            var nextSlope = Math.floor(Math.random() * 100);
            //console.log(nextSlope);

            var diffSlope = nextSlope - curSlope;

            while (diffSlope > 10 || diffSlope < -10) {
                if (nextSlope > curSlope) {
                     curSlope = Math.floor(curSlope + diffSlope / 2);
                }
                else {
                    curSlope = Math.floor(curSlope + diffSlope / 2);
                }
                
                y = y + Math.floor(curSlope / 2);
                road.segments.push(new RoadSegment(game, curSlope, {x: x, y: y}));
                y = y + Math.floor(curSlope / 2);
                y = y + 1;

                diffSlope = nextSlope - curSlope;
            }
        }

        return road;
    };


    var Keyboarder = function() {
        var keyState = {};

        window.addEventListener("keydown", function(e) {
            keyState[e.keyCode] = true;
        });

        window.addEventListener("keyup", function(e) {
            keyState[e.keyCode] = false;
        });

        this.isDown = function (keyCode) {
            return keyState[keyCode] === true;
        };

        this.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, SPACE: 32 };
    };
    
    var isColliding = function (b1, b2) {
        
        if ( b1.center.x - b1.size.x / 2 < b2.center.x + b2.size.x / 2 &&
             b2.center.x + b2.size.x / 2 < b1.center.x + b1.size.x / 2 &&
             b1.center.y - b1.size.y / 2 < b2.center.y + b2.size.y / 2 &&
             b2.center.y + b2.size.y / 2 < b1.center.y + b1.size.y / 2) {
                
                return true;
        }
    };

    var reportCollisions = function(bodies) {
        var bodyPairs = [];

        for (var i = 0; i < bodies.length; i++) {
            for (var j = i + 1; j < bodies.length; j++) {
                if (isColliding(bodies[i], bodies[j])) {
                    bodyPairs.push([bodies[i], bodies[j]]);
                }
            }
        }

        for (var i = 0; i < bodyPairs.length; i++) {
            if (bodyPairs[i][0].collision !== undefined) {
                bodyPairs[i][0].collision(bodyPairs[i][1]);
            }
        }
    };

    window.addEventListener('load', function() {
        new Game();
    });

    var drawRect = function (screen, body, color) {
        screen.fillStyle = color;
        screen.fillRect ( body.center.x - body.size.x / 2,
                        body.center.y - body.size.y / 2,
                        body.size.x,
                        body.size.y);
    };

    var drawOutline = function (screen, body, color) {
        screen.strokeStyle = color;
        screen.rect ( body.center.x - body.size.x / 2,
                      body.center.y - body.size.y / 2,
                      body.size.x,
                      body.size.y);
        screen.stroke();
    };

    var drawText = function (screen, place, text) {
        screen.font = "10px sans";
        screen.fillStyle = "black";
        screen.fillText(text, place.x, place.y);
    };

    var sprite = function (screen, body, size, frames) {
                    
        var that = {},
            frameIndex = 0,
            tickCount = 0,
            ticksPerFrame = ticksPerFrame || 0;
            numFrames = frames || 1;
            // so if frames is "undefined" then frames is "1"?


        that.context = screen;
        that.x = body.center.x;
        that.y = body.center.y;
        that.size = body.size
        that.image = body.image;
        that.image_size = size || body.size;

        return that;

        that.update = function() {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {

                tickCount = 0;

                if (frameIndex < numFrames - 1) {
                frameIndex += 1;
                }
            }

        };

        that.render = function() {
            that.context.drawImage (
                    that.image,
                    that.width * frameIndex, 0, // the x and y origin
                    that.image_size.w, that.image_size.h,
                    0, 0, // dest x and y origin
                    that.size.x, that.size.y );
        };
    };

})();

