// Backgrounds

function bg1() {
    /*          *     .        *  .    *    *   . 
    .  *  move your mouse to over the stars   .
    *  .  .   change these values:   .  *
    .      * .        .          * .       */
    const STAR_COLOR = '#fff';
    const STAR_SIZE = 3;
    const STAR_MIN_SCALE = 0.2;
    const OVERFLOW_THRESHOLD = 50;
    const STAR_COUNT = ( window.innerWidth + window.innerHeight ) / 8;

    const canvas = document.querySelector( 'canvas' ),
            context = canvas.getContext( '2d' );

    let scale = 1, // device pixel ratio
        width,
        height;

    let stars = [];

    let pointerX,
        pointerY;

    let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

    let touchInput = false;

    generate();
    resize();
    step();

    window.onresize = resize;
    canvas.onmousemove = onMouseMove;
    canvas.ontouchmove = onTouchMove;
    canvas.ontouchend = onMouseLeave;
    document.onmouseleave = onMouseLeave;

    function generate() {

        for( let i = 0; i < STAR_COUNT; i++ ) {
        stars.push({
            x: 0,
            y: 0,
            z: STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE )
        });
        }

    }

    function placeStar( star ) {

        star.x = Math.random() * width;
        star.y = Math.random() * height;

    }

    function recycleStar( star ) {

        let direction = 'z';

        let vx = Math.abs( velocity.x ),
            vy = Math.abs( velocity.y );

        if( vx > 1 || vy > 1 ) {
        let axis;

        if( vx > vy ) {
            axis = Math.random() < vx / ( vx + vy ) ? 'h' : 'v';
        }
        else {
            axis = Math.random() < vy / ( vx + vy ) ? 'v' : 'h';
        }

        if( axis === 'h' ) {
            direction = velocity.x > 0 ? 'l' : 'r';
        }
        else {
            direction = velocity.y > 0 ? 't' : 'b';
        }
        }
        
        star.z = STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE );

        if( direction === 'z' ) {
        star.z = 0.1;
        star.x = Math.random() * width;
        star.y = Math.random() * height;
        }
        else if( direction === 'l' ) {
        star.x = -OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
        }
        else if( direction === 'r' ) {
        star.x = width + OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
        }
        else if( direction === 't' ) {
        star.x = width * Math.random();
        star.y = -OVERFLOW_THRESHOLD;
        }
        else if( direction === 'b' ) {
        star.x = width * Math.random();
        star.y = height + OVERFLOW_THRESHOLD;
        }

    }

    function resize() {

        scale = window.devicePixelRatio || 1;

        width = window.innerWidth * scale;
        height = window.innerHeight * scale;

        canvas.width = width;
        canvas.height = height;

        stars.forEach( placeStar );

    }

    function step() {

        context.clearRect( 0, 0, width, height );

        update();
        render();

        requestAnimationFrame( step );

    }

    function update() {

        velocity.tx *= 0.96;
        velocity.ty *= 0.96;

        velocity.x += ( velocity.tx - velocity.x ) * 0.8;
        velocity.y += ( velocity.ty - velocity.y ) * 0.8;

        stars.forEach( ( star ) => {

        star.x += velocity.x * star.z;
        star.y += velocity.y * star.z;

        star.x += ( star.x - width/2 ) * velocity.z * star.z;
        star.y += ( star.y - height/2 ) * velocity.z * star.z;
        star.z += velocity.z;
        
        // recycle when out of bounds
        if( star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD ) {
            recycleStar( star );
        }

        } );

    }

    function render() {

        stars.forEach( ( star ) => {

        context.beginPath();
        context.lineCap = 'round';
        context.lineWidth = STAR_SIZE * star.z * scale;
        context.globalAlpha = 0.5 + 0.5*Math.random();
        context.strokeStyle = STAR_COLOR;

        context.beginPath();
        context.moveTo( star.x, star.y );

        var tailX = velocity.x * 2,
            tailY = velocity.y * 2;

        // stroke() wont work on an invisible line
        if( Math.abs( tailX ) < 0.1 ) tailX = 0.5;
        if( Math.abs( tailY ) < 0.1 ) tailY = 0.5;

        context.lineTo( star.x + tailX, star.y + tailY );

        context.stroke();

        } );

    }

    function movePointer( x, y ) {

        if( typeof pointerX === 'number' && typeof pointerY === 'number' ) {

        let ox = (x - pointerX) / 10,
            oy = (y - pointerY) / 10;

        velocity.tx = velocity.tx + ( ox / 8*scale ) * ( touchInput ? 1 : -1 );
        velocity.ty = velocity.ty + ( oy / 8*scale ) * ( touchInput ? 1 : -1 );

        }

        pointerX = x;
        pointerY = y;

    }

    function onMouseMove( event ) {

        touchInput = false;

        movePointer( event.clientX, event.clientY );

    }

    function onTouchMove( event ) {

        touchInput = true;

        movePointer( event.touches[0].clientX, event.touches[0].clientY, true );

        event.preventDefault();

    }

    function onMouseLeave() {

        pointerX = null;
        pointerY = null;

    }
}

function bg2() {
    'use strict';

    var tetrominos = [{
        // box
        colors : ['rgb(220,159,39)', 'rgb(246,197,100)', 'rgb(242,181,42)'],
        data : [[0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]]
        },
        {
        // stick
        colors : ['rgb(62,170,212)', 'rgb(120,205,244)', 'rgb(54,192,240)'],
        data : [[0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0]]
        },
        {
        // z
        colors : ['rgb(88,178,71)', 'rgb(150,204,110)', 'rgb(115,191,68)'],
        data : [[0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 0]]
        },
        {
        // T
        colors : ['rgb(158,35,126)', 'rgb(193,111,173)', 'rgb(179,63,151)'],
        data : [[0, 0, 0, 0],
            [0, 1, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]]
        },
        {
        // s
        colors : ['rgb(214,30,60)', 'rgb(241,108,107)', 'rgb(236,42,75)'],
        data : [[0, 0, 0, 0],
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0]]
        },
        {
        // backwards L
        colors : ['rgb(59,84,165)', 'rgb(118,137,196)', 'rgb(79,111,182)'],
        data : [[0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]]
        },
        {
        // L
        colors : ['rgb(236,94,36)', 'rgb(234,154,84)', 'rgb(228,126,37)'],
        data : [[0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]]
        }];

    var Tetris = function(x,y,width,height){
        this.posX = x || 0;
        this.posY = y || 0;

        this.width  = width || window.innerWidth;
        this.height = height || window.innerHeight;

        this.canvas = document.createElement('canvas');
        this.fgCanvas = document.createElement('canvas');

        this.canvas.width = this.fgCanvas.width = this.width;
        this.canvas.height = this.fgCanvas.height = this.height;

        this.bgCtx = this.canvas.getContext('2d');
        this.fgCtx = this.fgCanvas.getContext('2d');

        this.canvas.style.left = this.posX + 'px';
        this.canvas.style.top = this.posY + 'px';

        this.fgCanvas.style.left = this.posX + 'px';
        this.fgCanvas.style.top = this.posY + 'px';

        document.body.appendChild(this.canvas);
        document.body.appendChild(this.fgCanvas);
        this.init();
    };

    Tetris.prototype.init = function(){
        this.curPiece = {
            data : null,
            colors : [0,0,0],
            x : 0,
            y : 0,
        };

        this.lastMove = Date.now();
        this.curSpeed = 50+Math.random()*50;
        this.unitSize = 20;
        this.linesCleared = 0;
        this.level = 0;
        this.loseBlock = 0;

        // init the board
        this.board = [];
        this.boardWidth =  Math.floor(this.width / this.unitSize);
        this.boardHeight = Math.floor(this.height / this.unitSize);

        var board       = this.board,
            boardWidth  = this.boardWidth,
            boardHeight = this.boardHeight,
            halfHeight  = boardHeight/2,
            curPiece    = this.curPiece,
            x = 0, y = 0;

        // init board
        for (x = 0; x <= boardWidth; x++) {
            board[x] = [];
            for (y = 0; y <= boardHeight; y++) {

                board[x][y] = {
                    data: 0,
                    colors: ['rgb(0,0,0)', 'rgb(0,0,0)', 'rgb(0,0,0)']
                };

                if(Math.random() > 0.15 && y > halfHeight){
                    board[x][y] = {
                        data: 1,
                        colors: tetrominos[Math.floor(Math.random() * tetrominos.length)].colors
                    };
                }
            }
        }

        // collapse the board a bit
        for (x = 0; x <= boardWidth; x++) {
            for (y = boardHeight-1; y > -1; y--) {

                if(board[x][y].data === 0 && y > 0){
                    for(var yy = y; yy > 0; yy--){
                        if(board[x][yy-1].data){

                            board[x][yy].data = 1;
                            board[x][yy].colors = board[x][yy-1].colors;

                            board[x][yy-1].data = 0;
                            board[x][yy-1].colors = ['rgb(0,0,0)', 'rgb(0,0,0)', 'rgb(0,0,0)'];
                        }
                    } 
                }
            }
        }

        var self = this;

        window.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 37:
                    if (self.checkMovement(curPiece, -1, 0)) {
                        curPiece.x--;
                    }
                    break;
                case 39:
                    if (self.checkMovement(curPiece, 1, 0)) {
                        curPiece.x++;
                    }
                    break;
                case 40:
                    if (self.checkMovement(curPiece, 0, 1)) {
                        curPiece.y++;
                    }
                    break;
                case 32:
                case 38:
                    curPiece.data = self.rotateTetrimono(curPiece);
                    break;
                }
        });

        // render the board
        this.checkLines();
        this.renderBoard();

        // assign the first tetri
        this.newTetromino();
        this.update();
    };


    Tetris.prototype.update = function() {
        var curPiece = this.curPiece;

    if (!this.checkMovement(curPiece, 0, 1)) {
        if (curPiece.y < -1) {
            // you lose
            this.loseScreen();
            return true;
        } else {
            this.fillBoard(curPiece);
            this.newTetromino();
        }
    } else {
        if (Date.now() > this.lastMove) {
            this.lastMove = Date.now() + this.curSpeed;
            if (this.checkMovement(curPiece, 0, 1)) {
                curPiece.y++;
            } else {
                this.fillBoard(curPiece);
                this.newTetromino();
            }
        }
    }

    this.render();

    var self = this;
    requestAnimationFrame(function(){self.update();});
    };

    // render only the board.
    Tetris.prototype.renderBoard = function(){
        var canvas      = this.canvas,
            ctx         = this.bgCtx,
            unitSize    = this.unitSize,
            board       = this.board,
            boardWidth  = this.boardWidth,
            boardHeight = this.boardHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var x = 0; x <= boardWidth; x++) {
            for (var y = 0; y <= boardHeight; y++) {
                if (board[x][y].data !== 0) {
                    var bX = (x * unitSize),
                        bY = (y * unitSize);

                    ctx.fillStyle = board[x][y].colors[0];
                    ctx.fillRect(bX, bY, unitSize, unitSize);

                    ctx.fillStyle = board[x][y].colors[1];
                    ctx.fillRect(bX+2, bY+2, unitSize-4, unitSize-4);

                    ctx.fillStyle = board[x][y].colors[2];
                    ctx.fillRect(bX+4, bY+4, unitSize-8, unitSize-8);
                }
            }
    }
    };

    // Render the current active piece
    Tetris.prototype.render = function() {
        var canvas      = this.fgCanvas,
            ctx         = this.fgCtx,
            unitSize    = this.unitSize,
            curPiece    = this.curPiece;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            if (curPiece.data[x][y] === 1) {
                var xPos = ((curPiece.x + x) * unitSize),
                    yPos = ((curPiece.y + y) * unitSize);

                if (yPos > - 1) {
                        ctx.fillStyle = curPiece.colors[0];
                        ctx.fillRect(xPos, yPos, unitSize, unitSize);

                        ctx.fillStyle = curPiece.colors[1];
                        ctx.fillRect(xPos+2, yPos+2, unitSize-4, unitSize-4);

                        ctx.fillStyle = curPiece.colors[2];
                        ctx.fillRect(xPos+4, yPos+4, unitSize-8, unitSize-8);
                }
            }
        }
        }
    };

    // Make sure we can mov where we want.
    Tetris.prototype.checkMovement = function(curPiece, newX, newY) {
        var piece       = curPiece.data,
            posX        = curPiece.x,
            posY        = curPiece.y,
            board       = this.board,
            boardWidth  = this.boardWidth,
            boardHeight = this.boardHeight;

    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            if (piece[x][y] === 1) {

                if (!board[posX + x + newX]) {
                    board[posX + x + newX] = [];
                }

                if (!board[posX + x + newX][y + posY + newY]) {
                    board[posX + x + newX][y + posY + newY] = {
                        data: 0
                    };
                }

                if (posX + x + newX >= boardWidth || posX + x + newX < 0 || board[posX + x + newX][y + posY + newY].data == 1) {
                    return false;
                }

                if (posY + y + newY > boardHeight) {
                    return false;
                }

            }
        }
    }
    return true;
    };

    // checks for completed lines and clears them
    Tetris.prototype.checkLines = function() {
        var board           = this.board,
            boardWidth      = this.boardWidth,
            boardHeight     = this.boardHeight,
            linesCleared    = this.linesCleared,
            level           = this.level,
            y               = boardHeight+1;

    while (y--) {
        var x = boardWidth,
            lines = 0;

        while (x--) {
            if (board[x][y].data === 1) {
                lines++;
            }
        }

        if (lines === boardWidth) {
            linesCleared++;
            level = Math.round(linesCleared / 20) * 20;

            var lineY = y;
            while (lineY) {
                for (x = 0; x <= boardWidth; x++) {
                    if (lineY - 1 > 0) {
                        board[x][lineY].data = board[x][lineY - 1].data;
                        board[x][lineY].colors = board[x][lineY - 1].colors;
                    }
                }
                lineY--;
            }
            y++;
        }
    }
    };

    // Lose animation
    Tetris.prototype.loseScreen = function() {
        var ctx         = this.bgCtx,
            unitSize    = this.unitSize,
            boardWidth  = this.boardWidth,
            boardHeight = this.boardHeight,
            y           = boardHeight - this.loseBlock;

        for(var x = 0; x < boardWidth; x++){
            var bX = (x * unitSize),
                bY = (y * unitSize);

            ctx.fillStyle = 'rgb(80,80,80)';
            ctx.fillRect(bX, bY, unitSize, unitSize);

            ctx.fillStyle = 'rgb(150,150,150)';
            ctx.fillRect(bX+2, bY+2, unitSize-4, unitSize-4);

            ctx.fillStyle = 'rgb(100,100,100)';
            ctx.fillRect(bX+4, bY+4, unitSize-8, unitSize-8);
        }

        if(this.loseBlock <= (boardHeight+1)){
            this.loseBlock++;

            var self = this;
            requestAnimationFrame(function(){self.loseScreen();});
        }else{
            this.init();
        }
    };

    // adds the piece as part of the board
    Tetris.prototype.fillBoard = function(curPiece) {
        var piece = curPiece.data,
            posX  = curPiece.x,
            posY  = curPiece.y,
            board = this.board;

        for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            if (piece[x][y] === 1) {
                board[x + posX][y + posY].data = 1;
                board[x + posX][y + posY].colors = curPiece.colors;
            }
        }
        }

        this.checkLines();
        this.renderBoard();
    };

    // rotate a piece
    Tetris.prototype.rotateTetrimono = function(curPiece) {
    var rotated = [];

    for (var x = 0; x < 4; x++) {
        rotated[x] = [];
        for (var y = 0; y < 4; y++) {
            rotated[x][y] = curPiece.data[3 - y][x];
        }
    }

    if (!this.checkMovement({
        data: rotated,
        x: curPiece.x,
        y: curPiece.y
    }, 0, 0)) {
        rotated = curPiece.data;
    }

    return rotated;
    };

    // assign the player a new peice
    Tetris.prototype.newTetromino = function() {
        var pieceNum = Math.floor(Math.random() * tetrominos.length),
            curPiece = this.curPiece;

        curPiece.data    = tetrominos[pieceNum].data;
        curPiece.colors  = tetrominos[pieceNum].colors;
        curPiece.x       = Math.floor(Math.random()*(this.boardWidth-curPiece.data.length+1));
        curPiece.y       = -4;
    };

    var width = window.innerWidth,
        boardDiv = 20*Math.round(window.innerWidth/20),
        boards = 8,
        bWidth = boardDiv/boards,
        tetrisInstances = [];

    for(var w = 0; w < boards; w++){
    tetrisInstances.push(new Tetris(20 * Math.round((w*bWidth)/20), 0, bWidth));
    }
}

// Background 3

function bg3() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    function resize() {
        var box = c.getBoundingClientRect();
        c.width = box.width;
        c.height = box.height;
    }

    var light = {
        x: 160,
        y: 200
    }

    var colors = ["#f5c156", "#e6616b", "#5cd3ad"];

    function Box() {
        this.half_size = Math.floor((Math.random() * 50) + 1);
        this.x = Math.floor((Math.random() * c.width) + 1);
        this.y = Math.floor((Math.random() * c.height) + 1);
        this.r = Math.random() * Math.PI;
        this.shadow_length = 2000;
        this.color = colors[Math.floor((Math.random() * colors.length))];
    
        this.getDots = function() {

            var full = (Math.PI * 2) / 4;


            var p1 = {
                x: this.x + this.half_size * Math.sin(this.r),
                y: this.y + this.half_size * Math.cos(this.r)
            };
            var p2 = {
                x: this.x + this.half_size * Math.sin(this.r + full),
                y: this.y + this.half_size * Math.cos(this.r + full)
            };
            var p3 = {
                x: this.x + this.half_size * Math.sin(this.r + full * 2),
                y: this.y + this.half_size * Math.cos(this.r + full * 2)
            };
            var p4 = {
                x: this.x + this.half_size * Math.sin(this.r + full * 3),
                y: this.y + this.half_size * Math.cos(this.r + full * 3)
            };

            return {
                p1: p1,
                p2: p2,
                p3: p3,
                p4: p4
            };
        }
        this.rotate = function() {
            var speed = (60 - this.half_size) / 20;
            this.r += speed * 0.002;
            this.x += speed;
            this.y += speed;
        }
        this.draw = function() {
            var dots = this.getDots();
            ctx.beginPath();
            ctx.moveTo(dots.p1.x, dots.p1.y);
            ctx.lineTo(dots.p2.x, dots.p2.y);
            ctx.lineTo(dots.p3.x, dots.p3.y);
            ctx.lineTo(dots.p4.x, dots.p4.y);
            ctx.fillStyle = this.color;
            ctx.fill();


            if (this.y - this.half_size > c.height) {
                this.y -= c.height + 100;
            }
            if (this.x - this.half_size > c.width) {
                this.x -= c.width + 100;
            }
        }
        this.drawShadow = function() {
            var dots = this.getDots();
            var angles = [];
            var points = [];

            for (dot in dots) {
                var angle = Math.atan2(light.y - dots[dot].y, light.x - dots[dot].x);
                var endX = dots[dot].x + this.shadow_length * Math.sin(-angle - Math.PI / 2);
                var endY = dots[dot].y + this.shadow_length * Math.cos(-angle - Math.PI / 2);
                angles.push(angle);
                points.push({
                    endX: endX,
                    endY: endY,
                    startX: dots[dot].x,
                    startY: dots[dot].y
                });
            };

            for (var i = points.length - 1; i >= 0; i--) {
                var n = i == 3 ? 0 : i + 1;
                ctx.beginPath();
                ctx.moveTo(points[i].startX, points[i].startY);
                ctx.lineTo(points[n].startX, points[n].startY);
                ctx.lineTo(points[n].endX, points[n].endY);
                ctx.lineTo(points[i].endX, points[i].endY);
                ctx.fillStyle = "#2c343f";
                ctx.fill();
            };
        }
    }

    var boxes = [];

    function draw() {
        ctx.clearRect(0, 0, c.width, c.height);

        for (var i = 0; i < boxes.length; i++) {
            boxes[i].rotate();
            boxes[i].drawShadow();
        };
        for (var i = 0; i < boxes.length; i++) {
            collisionDetection(i)
            boxes[i].draw();
        };
        requestAnimationFrame(draw);
    }

    resize();
    draw();

    while (boxes.length < 14) {
        boxes.push(new Box());
    }

    window.onresize = resize;
    c.onmousemove = function(e) {
        light.x = e.offsetX == undefined ? e.layerX : e.offsetX;
        light.y = e.offsetY == undefined ? e.layerY : e.offsetY;
    }


    function collisionDetection(b){
        for (var i = boxes.length - 1; i >= 0; i--) {
            if(i != b){	
                var dx = (boxes[b].x + boxes[b].half_size) - (boxes[i].x + boxes[i].half_size);
                var dy = (boxes[b].y + boxes[b].half_size) - (boxes[i].y + boxes[i].half_size);
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d < boxes[b].half_size + boxes[i].half_size) {
                    boxes[b].half_size = boxes[b].half_size > 1 ? boxes[b].half_size-=1 : 1;
                    boxes[i].half_size = boxes[i].half_size > 1 ? boxes[i].half_size-=1 : 1;
                }
            }
        }
    }
}

// Background 4

function bg4() {
    (function () {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        window.requestAnimationFrame = requestAnimationFrame;
    })();

    // Terrain stuff.
    var background = document.getElementById("canvas"),
        bgCtx = background.getContext("2d"),
        width = window.innerWidth,
        height = document.body.offsetHeight;

    (height < 400) ? height = 400 : height;

    background.width = width;
    background.height = height;

    function Terrain(options) {
        options = options || {};
        this.terrain = document.createElement("canvas");
        this.terCtx = this.terrain.getContext("2d");
        this.scrollDelay = options.scrollDelay || 90;
        this.lastScroll = new Date().getTime();

        this.terrain.width = width;
        this.terrain.height = height;
        this.fillStyle = options.fillStyle || "#191D4C";
        this.mHeight = options.mHeight || height;

        // generate
        this.points = [];

        var displacement = options.displacement || 140,
            power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

        // set the start height and end height for the terrain
        this.points[0] = this.mHeight;//(this.mHeight - (Math.random() * this.mHeight / 2)) - displacement;
        this.points[power] = this.points[0];

        // create the rest of the points
        for (var i = 1; i < power; i *= 2) {
            for (var j = (power / i) / 2; j < power; j += power / i) {
                this.points[j] = ((this.points[j - (power / i) / 2] + this.points[j + (power / i) / 2]) / 2) + Math.floor(Math.random() * -displacement + displacement);
            }
            displacement *= 0.6;
        }

        document.body.appendChild(this.terrain);
    }

    Terrain.prototype.update = function () {
        // draw the terrain
        this.terCtx.clearRect(0, 0, width, height);
        this.terCtx.fillStyle = this.fillStyle;
        
        if (new Date().getTime() > this.lastScroll + this.scrollDelay) {
            this.lastScroll = new Date().getTime();
            this.points.push(this.points.shift());
        }

        this.terCtx.beginPath();
        for (var i = 0; i <= width; i++) {
            if (i === 0) {
                this.terCtx.moveTo(0, this.points[0]);
            } else if (this.points[i] !== undefined) {
                this.terCtx.lineTo(i, this.points[i]);
            }
        }

        this.terCtx.lineTo(width, this.terrain.height);
        this.terCtx.lineTo(0, this.terrain.height);
        this.terCtx.lineTo(0, this.points[0]);
        this.terCtx.fill();
    }


    // Second canvas used for the stars
    bgCtx.fillStyle = '#05004c';
    bgCtx.fillRect(0, 0, width, height);

    // stars
    function Star(options) {
        this.size = Math.random() * 2;
        this.speed = Math.random() * .05;
        this.x = options.x;
        this.y = options.y;
    }

    Star.prototype.reset = function () {
        this.size = Math.random() * 2;
        this.speed = Math.random() * .05;
        this.x = width;
        this.y = Math.random() * height;
    }

    Star.prototype.update = function () {
        this.x -= this.speed;
        if (this.x < 0) {
            this.reset();
        } else {
            bgCtx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    function ShootingStar() {
        this.reset();
    }

    ShootingStar.prototype.reset = function () {
        this.x = Math.random() * width;
        this.y = 0;
        this.len = (Math.random() * 80) + 10;
        this.speed = (Math.random() * 10) + 6;
        this.size = (Math.random() * 1) + 0.1;
        // this is used so the shooting stars arent constant
        this.waitTime = new Date().getTime() + (Math.random() * 3000) + 500;
        this.active = false;
    }

    ShootingStar.prototype.update = function () {
        if (this.active) {
            this.x -= this.speed;
            this.y += this.speed;
            if (this.x < 0 || this.y >= height) {
                this.reset();
            } else {
                bgCtx.lineWidth = this.size;
                bgCtx.beginPath();
                bgCtx.moveTo(this.x, this.y);
                bgCtx.lineTo(this.x + this.len, this.y - this.len);
                bgCtx.stroke();
            }
        } else {
            if (this.waitTime < new Date().getTime()) {
                this.active = true;
            }
        }
    }

    var entities = [];

    // init the stars
    for (var i = 0; i < height; i++) {
        entities.push(new Star({
            x: Math.random() * width,
            y: Math.random() * height
        }));
    }

    // Add 2 shooting stars that just cycle.
    entities.push(new ShootingStar());
    entities.push(new ShootingStar());
    entities.push(new Terrain({mHeight : (height/2)-120}));
    entities.push(new Terrain({displacement : 120, scrollDelay : 50, fillStyle : "rgb(17,20,40)", mHeight : (height/2)-60}));
    entities.push(new Terrain({displacement : 100, scrollDelay : 20, fillStyle : "rgb(10,10,5)", mHeight : height/2}));

    //animate background
    function animate() {
        bgCtx.fillStyle = '#110E19';
        bgCtx.fillRect(0, 0, width, height);
        bgCtx.fillStyle = '#ffffff';
        bgCtx.strokeStyle = '#ffffff';

        var entLen = entities.length;

        while (entLen--) {
            entities[entLen].update();
        }
        requestAnimationFrame(animate);
    }
    animate();
}

function setBackground() {
    backgroundFunctions = [
        bg1,
        bg2,
        bg3,
        bg4
    ];

    backgroundString = get("background");
    if (backgroundString > 0 & backgroundString <= 4) {
        background = backgroundString - 1;
    } else {
        background = Math.floor(Math.random() * 4);
    }

    document.getElementById("body").classList.add("bg-" + (background + 1));
    backgroundFunctions[background]();
}

function setName() {
    socialName = get("name");
    if (socialName != undefined) {
        document.title = socialName + " - Linker"
    }
}

function setAvatar() {
    avatarUrl = get("avatar");
    if (avatarUrl != undefined) {
        document.getElementById("avatar-img").src = avatarUrl;
        changeFavicon(avatarUrl);
    }
}

function changeFavicon(src) {
    document.getElementById("favicon").setAttribute("href", src);
}

function setUrls() {
    services = [
        {
            "name": "facebook",
            "url": "https://facebook.com/"
        },
        {
            "name": "twitter",
            "url": "https://twitter.com/"
        },
        {
            "name": "instagram",
            "url": "https://instagram.com/"
        },
        {
            "name": "pinterest",
            "url": "https://pinterest.com/"
        },
        {
            "name": "tiktok",
            "url": "https://tiktok.com/@"
        },
        {
            "name": "reddit",
            "url": "https://reddit.com/u/"
        },
        {
            "name": "steam",
            "url": "https://steamcommunity.com/id/"
        },
        {
            "name": "twitch",
            "url": "https://twitch.tv/"
        },
        {
            "name": "youtube",
            "url": "https://youtube.com/"
        },
        {
            "name": "xbox",
            "url": "https://xboxgamertag.com/search/"
        },
        {
            "name": "psn",
            "url": "https://psnprofiles.com/"
        },
        {
            "name": "github",
            "url": "https://github.com/"
        },
    ]

    services.forEach(service => {
        username = get(service["name"])

        if (username != undefined) {
            document.getElementById(service["name"] + "-link").href = service["url"] + username;
        } else {
            document.getElementById(service["name"] + "-img").classList.add("unused-img");
        }
    });
}

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}

setBackground();
setName();
setAvatar();
setUrls();