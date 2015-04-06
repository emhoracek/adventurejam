// Downhill skating game

// what is this first line, with the leading semicolon?
;(function() {
    var Game = function(){
        var screen = document.getElementById("screen").getContext("2d");

        this.size = {x: screen.canvas.width, y: screen.canvas. height};
        this.center = { x : this.size.x / 2, y: this.size.y / 2}; 

        this.bodies = buildRoad(this).concat(new Player(this));
        
        this.gravity = 0.7;
        this.slope = 0.1;
        var self = this;

        console.log("hello");
        // is this preferable to "function tick()"?
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
            screen.fillStyle = "red";
            screen.fillRect(10, 10, 10, 10);
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
        this.size = { x: 10, y: 10 };
        this.center = {x: game.center.x, y: 50};
        this.xspeed = 1;
        this.yspeed = 1;
        this.mass = 10;
        this.yaccel = 0;
        this.direction = 0;
        this.keyboarder = new Keyboarder();
    };

    Player.prototype = {
        update: function() {
            //console.log("".concat(this.yaccel).concat(" accel, ").concat(this.yspeed));
            if (this.direction) {
                if (this.center.x < this.game.size.x - 10) {
                    this.center.x += this.xspeed;
                }
            }
            else {
                if (this.center.y < this.game.size.y - 10) {
                    this.center.y += this.yspeed;
                }
            }
        },

        draw: function(screen) {
            drawRect(screen, this, "black");
        },

        collision: function(otherBody) {

            var theta = otherBody.slope / 100;

            this.yaccel = this.game.gravity * Math.sin(otherBody.slope);
            console.log(this.yaccel);
            this.yspeed = this.yspeed + (this.yspeed * this.yaccel);

        }
    };

    var Road = function (game, slope, center) {
        this.game = game;
        this.slope = slope;
        this.size = { x: 300, y: slope }
        this.center = center;
    };

    Road.prototype = {
        update: function() {
            // implement me!
        },

        draw: function(screen) {
            drawRect(screen, this, "blue");
        },

        collision: function(otherBody) {
            throw "implement me"
        }

    };

    var buildRoad = function(game) {

        var road = [];
        //        var roadSize = game.size.y / 10;
        var roadSize = 5
        
        for (var i = 0; i < roadSize; i++) {
            var x = 250;
            var y = i * 100;
            var slope = Math.random() * 100;
            road.push(new Road(game, slope, {x: x, y: y}));
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
   
          /*         console.log(b1.constructor); 
          if (Player.prototype.isPrototypeOf(b1)) {
              b1.collision(b2);
          }
          else if (Player.prototype.isPrototypeOf(b2)) {
              b2.collision(b1);
          }/*
          else {
              console.log("WHYYYYYYY");
          }*/
    
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
                        body.size.y)
    };
})();

