
var balls = []

var g = -900/100;

var play = true;

var omx; var omy;
var mx; var my;
var mspd; var mang;

var cnvs = document.getElementById('cnvs')
var scale = window.devicePixelRatio;
cnvs.width = Math.floor(window.innerWidth*window.devicePixelRatio);
cnvs.height = Math.floor(window.innerHeight*window.devicePixelRatio);
var ctx = cnvs.getContext('2d');
ctx.scale(scale, scale);

var traceForwTime;
var traceForw = false;
var traceForBall;

class Ball{
    constructor(x, y, rad, ang, spd, m){
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.ang = -ang*Math.PI/180;
        console.log(this.ang);
        this.spd = spd/100;
        this.mass = m;

        this.elm = document.createElement("div");
        this.elm.className = "ball";
        this.elm.style.width = rad*2;
        this.elm.style.height = rad*2;
        this.elm.style.left = x+"px";
        this.elm.style.top = y+"px";
        this.elm.innerText = balls.length+1;
        document.body.appendChild(this.elm);

    }

    move(){
        var b = (Math.cos(this.ang)*this.spd)
        var h = Math.sin(this.ang)*this.spd+g*0.01;
        this.spd = Math.sqrt(b**2+h**2);
        this.ang = Math.atan(h/b);
        if (h<0 && b<0){
            this.ang = -(Math.PI-this.ang);
        }
        else if (h>0 && b<0){
            this.ang += Math.PI;
        }
        this.x += Math.cos(this.ang)*this.spd;
        this.y += Math.sin(this.ang)*this.spd;
    }
    update(){
        this.elm.style.width = this.rad*2;
        this.elm.style.height = this.rad*2;
        this.elm.style.left = this.x+"px";
        this.elm.style.top = this.y+"px";
        //console.log(this.x, this.y);
    }
    collide(){
        if (this.x+this.rad*2>=window.innerWidth){
            this.ang = Math.PI-this.ang
            this.x = window.innerWidth-this.rad*2;
        }
        if (this.x<=0){
            this.ang = Math.PI-this.ang
            this.x = 0;
        }
        if (this.y+this.rad*2>=window.innerHeight){
            this.ang *= -1;
            this.y = window.innerHeight-this.rad*2;
        }
        
        if (this.y<=0){
            this.ang *= -1;
            this.y = 0;
        }
    }
    traceForward(time){
        var dball = new Ball(this.x, this.y, this.rad, -this.ang*180/Math.PI, this.spd*100, this.m);
        dball.elm.remove();
        clearCanvas();
        ctx.beginPath();
        ctx.moveTo(dball.x+dball.rad, dball.y+dball.rad);
        for (var i = 0; i < time; i++){
            dball.move();
            dball.collide();
            ctx.lineTo(dball.x+dball.rad, dball.y+dball.rad)
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(dball.x+dball.rad, dball.y+dball.rad);
        }
    }
}
var t = true;
function summon(){
    var popup = document.createElement("div");
    popup.id = "popup";
    popup.innerHTML = `
    <h3>Summon a ball</h3>
    <input id="radt" placeholder="Radius(in px):" />
    <input id="anglet" placeholder="Angle(in deg):" />
    <input id="spdt" placeholder="Throw Speed(px/s):" >
    <input id="mass" placeholder="Mass:">
    <input id="xpop" placeholder="Position-x(px):">
    <input id="ypop" placeholder="Position-y(px):">
    <button onclick="spawn()">Summon</button>
    `
    document.body.appendChild(popup);
}

function spawn(){
    var initx = document.getElementById("xpop").value;
    var inity = document.getElementById("ypop").value;
    var ang = document.getElementById("anglet").value;
    var initspd = document.getElementById("spdt").value;
    var mass = document.getElementById("mass").value;
    var radius = document.getElementById("radt").value;
    //console.log(initx, inity);
    if (initx == "" || inity == ""){
        initx = 50;
        inity = 50;
    }
    if (radius == ""){
        radius = 25;
    }
    if (ang == ""){
        ang = 0;
    }
    if (mass == ""){
        mass = 1;
    }
    if (initspd == ""){
        initspd = 300;
        //console.log("ndjwnsalks")
    }
    //console.log("jbkjnkjhlijik");
    var ballss = new Ball(parseInt(initx), parseInt(inity), radius, ang, initspd, mass);
    balls.push(ballss);
    document.body.removeChild(document.getElementById("popup"));
}
setInterval(()=>{
    if (play){
        for (var i = 0; i < balls.length; i++){
            if (balls[i] != held[0]){
                balls[i].move();
                
            }
            balls[i].collide();
            //balls[i].rad+=0.1
            balls[i].update();
        }
        
        if (held[0] != null){
            held[0].x = mx-held[0].rad;
            held[0].y = my-held[0].rad;
        }
        mspd = Math.sqrt((mx-omx)**2+(my-omy)**2);
        if (my-omy != mx-omx){
            mang = Math.atan((my-omy)/(mx-omx));
            if (my-omy<0 && mx-omx<0){
                mang = -(Math.PI-mang);
            }
            else if (my-omy>0 && mx-omx<0){
                mang = Math.PI+mang;
            }
            console.log(mang*180/Math.PI);
        }
        omx = mx; omy = my;

        if (traceForw){
            balls[traceForBall].traceForward(traceForwTime);
        }
    }
}, 10)

var held = [];

document.addEventListener("mousemove", (e)=>{
    mx = e.clientX; my = e.clientY;

})

document.addEventListener("mousedown", (e)=>{
    for (var i = 0; i < balls.length; i++){
        var ball = balls[i];
        var apx = ball.x+ball.rad; var apy = ball.y+ball.rad;
        var dis = Math.sqrt((mx-apx)**2+(my-apy)**2);
        
        if (dis < ball.rad){
            //console.log("djbecjsjbdvndfb")
            ball.spd = 0;
            held[0] = ball;
            break;
        }
    }
})

document.addEventListener("mouseup", (e)=>{
    if (held[0]!=null){
        held[0].spd = mspd; held[0].ang = mang;
        //held[0].x = mx; held[0].y = my;
        held.pop();
    }
})

function traceForPop(){
    var popup = document.createElement("div");
    popup.id = "popup";
    popup.innerHTML = `
    <h3>Trace Forward</h3>
    <input id="tracet" placeholder="Trace forward to [time(s)]:" />
    <input id="traceball" placeholder="Ball number:" />
    <button onclick="traceForward()">Predict</button>
    `
    document.body.appendChild(popup);
}
function tracePop(){
    var popup = document.createElement("div");
    popup.id = "popup";
    popup.innerHTML = `
    <h3>Normal Trace</h3>
    <input id="tracet" placeholder="Trace forward to [time(s)]:" />
    <input id="traceball" placeholder="Ball number:" />
    <button onclick="trace()">Predict</button>
    `
    document.body.appendChild(popup);
}

function traceForward(){
    traceForwTime = parseFloat(document.getElementById("tracet").value)*100;
    traceForBall = parseInt(document.getElementById("traceball").value)-1;
    traceForw = true;
    document.body.removeChild(document.getElementById("popup"));
}
function trace(){
    traceTime = parseFloat(document.getElementById("tracet").value)*100;
    traceForBall = parseInt(document.getElementById("traceball").value)-1;
}
function clearCanvas(){
    ctx.clearRect(0, 0, cnvs.width, cnvs.height);
}
function stopTracing(){
    clearCanvas();
    traceForw = false;
    trace = false;
}

function playpause(){
    play = !play;
}
