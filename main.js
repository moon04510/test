document.addEventListener('DOMContentLoaded', function(){
    let canvas = document.getElementById('mycanvas');
    let startbtn = document.getElementById('startbtn');
    startbtn.disabled = true;
    //let karibtn = document.getElementById('karibtn');
    let stopbtn = document.getElementById('stopbtn');
    let state1 = document.getElementById('state1');
    let state2 = document.getElementById('state2');
    let select = document.getElementById('select');
    let ctx = canvas.getContext('2d');
    let disparea = 50;  //点数等の表示部分
    canvas.width = 100 + disparea;
    canvas.height = 200;
    let width = Number.parseInt(canvas.width) -disparea;
    let height = Number.parseInt(canvas.height);
    let blocks =[]; 
    let rotate = 0;
    let upPressed = false;
    let downPressed = false;
    let rightPressed = false;
    let leftPressed = false;
    let timer;
    let speed = [300,250,200];
    let mymap=[];
    let bx;
    let by = 0;
    let score = 0;
    let linecount = 0;
    let blockcount = 100;
    let blockimg = new Image();
    blockimg.src = 'block.jpg';
    let r = 0//Math.floor(Math.random() * 7);
    let ra = [];
 
    let showimg = new Image();
    let images = ['rod.jpg','square.jpg','Z.jpg','rZ.jpg','rL.jpg','L.jpg','convex.jpg',''];
    showimg.src = images[7];
    //showimg.src = 
    blocks = [
        [[1],[1],[1],[1]],  //x 0 y 4 z 1
        [[1,1],[1,1]],      //x 1 y 2 z 2
        [[1,0],[1,1],[0,1]],//x 2 y 3 z 2
        [[0,1],[1,1],[1,0]],//x 3 y 3 z 2
        [[1,1],[1,0],[1,0]],//x 4 y 3 z 2
        [[1,1],[0,1],[0,1]],//x 5 y 3 z 2
        [[1,0],[1,1],[1,0]] //x 6 y 3 z 2
        ];

    
    for(let y = 0;y<height/10;y++){
        mymap[y] = [];
            for(let x = 0;x<width/10;x++){
                mymap[y][x] = 0;
            }
    }
    
    showctx(7);
    let dx = Math.trunc(mymap[0].length/2);
    bx = dx;
 
    function main(){
        //nextblock();
        ctx.clearRect(0, 0, width, height);
            
            isBlock();       //ブロック判定
            drawBlock();     //ブロック描画
            showctx();       //得点等の表示
        
           
     
            
            if(rightPressed && bx + blocks[r][0].length < mymap[0].length){
                bx+=1;
            }
            else if(leftPressed && bx  > 0) {
                bx-=1;
            } 
            else if(upPressed) {
                rotate++;       //何回押されたか
                rotateblock();  //ブロック回転
            }
            /*
            else if(downPressed) {
                console.log(by)
            
            } 
            */
            
            by++;
            updatemap();        //キャンバスの一番下のライン時
            checkline();        //横のラインが揃ってる時消去
            collisiondetection();   //当たり判定
        
            //次のブロックが表示しきれないときゲームオーバー
            if(mymap[2][dx] == 1 || mymap[1][dx] == 1 ){
                endgame();
            } 

            
    }
    
    function showctx(){
        //showimg.src = images[ra];
        ctx.beginPath();
        ctx.rect(100,0,50,height);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.rect(110,40,30,60);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText('Next',110,30);
        ctx.fillText('残り',110,120);
        ctx.fillText(blockcount,110,140);
        ctx.fillText('ﾌﾞﾛｯｸ',110,160);
        if(linecount > 1){      //同時に2列以上消すとボーナス
            score = score + linecount*200
        } else if(linecount == 1){
            score += 100; 
        }
        ctx.fillText(score + '点',110,190)
        ctx.drawImage(showimg,120,50);
    }

    function nextblock(){
        
    }
  
    function endgame(){
        if(blockcount > 0){
            state1.textContent = 'ゲームオーバー';
        } else {
            state1.textContent = 'ゲームクリア';
        }

        clearInterval(timer);
        //karibtn.disabled = true;
        startbtn.disabled = true;
        stopbtn.disabled = true;
        select.disabled = true;
        state2.textContent = 'もう一度やりますか？';
            
        let br1 = document.createElement('br');
        let br2 = document.createElement('br');
        let anchor1 = document.createElement('a');
        let anchor2 = document.createElement('a');
        let text1 = document.createTextNode('はい');
        let text2 = document.createTextNode('いいえ');
            
        anchor1.href = '';
        anchor2.href = '';
        anchor1.appendChild(text1);
        anchor2.appendChild(text2);
        state2.appendChild(br1);
        state2.appendChild(anchor1);
        state2.appendChild(br2);
        state2.appendChild(anchor2);
    }
    
    
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    startbtn.addEventListener('click',start,false);
    stopbtn.addEventListener('click',stop,false);
    //karibtn.addEventListener('click', kari,false);
    select.addEventListener('change',selectform,false);

    function rotateblock(){
        let b = blocks[r];
        let newblocks =[];
        for(let x = 0;x<b[0].length;x++){
            newblocks[x] =[];
            for(let y = 0;y<b.length;y++){
                newblocks[x][b.length-1-y] = b[y][x];
            }
        }
        blocks[r] = newblocks;
        while(bx + blocks[r][0].length > mymap[0].length){
            bx--;
        }
            
        
    }

    function selectform(){
        startbtn.disabled = false;
        let s = Number.parseInt(select.value);
        if(s == 9){
            startbtn.disabled = true;
        }
        return s;
    }

    function start(){
        s = selectform();
        timer = setInterval(main,speed[s]);
    }

    function kari(){
        main();
    }
    function stop(){
       
        clearInterval(timer);
    }
  

    function keyDownHandler(e) {
        if(e.keyCode === 39) {
            rightPressed = true;
        } 
        else if(e.keyCode === 37){
            leftPressed = true;
        }
        else if(e.keyCode === 38) {
            upPressed = true;
        } 
        else if(e.keyCode === 40) {
            downPressed = true;
        }
    }

    function keyUpHandler(e) {
        if(e.keyCode === 39) {
            rightPressed = false;
        } 
        else if(e.keyCode === 37){
            leftPressed = false;
        }
        else if(e.keyCode === 38) {
            upPressed = false;
        }
        else if(e.keyCode === 40) {
            downPressed = false;
        }
    }
    
    function drawBlock(){
        let b = blocks[r];
        for(let y = 0;y<b.length;y++){
            for(x = 0;x<b[0].length;x++){
               if(b[y][x] == 1){
                ctx.drawImage( blockimg, (x+bx)*10, (y+by)*10);
               }
            }
        }
    }

    function collisiondetection(){
        let b = blocks[r];
        for(let y = 0;y < b.length;y++){
            for (let x = 0 ;x < b[0].length; x++){
            
                if((mymap[y + by ][x + bx ] == 1) && (b[y][x] == 1) ){
                    if(b[y][x] == 1 && by == 0){
                        endgame();
                    }
                    for(let j = 0;j<b.length;j++){
                        for(let i = 0;i<b[0].length;i++){
                            if(b[j][i] == 1){
                                mymap[j+by-1][i+bx] = 1;
                            }
                        }
                    }
                   update();
                } 
            }
        }
    }

    //次のブロック
    function update(){
        by = 0;
        bx = dx;
        blockcount--;
        showctx();
        while(rotate>0){    //回転したブロックを初期位置に
            rotate--;
            rotateblock();
        }
        r = Math.floor(Math.random() * 7);
        if(blockcount <= 0){    //残りブロックが0以下ならゲームクリア
            endgame();
        }
    }

    function updatemap(){
        let b = blocks[r];
        if(by + blocks[r].length > mymap.length){
            for(let y = 0;y<b.length;y++){
                for(let x = 0;x<b[0].length;x++){
                    if(b[y][x] == 1){          
                        mymap[y+by-1][x+bx] = 1;
                    }
                }
            }
            update();
        }
    }

    function checkline(){
        for(let i = 0;i<mymap.length;i++){
            if(mymap[i].every(function (value){
                return value == 1;
            })){
                let newline = [];
                for(let i = 0;i<width/10;i++){
                    newline[i] = 0;
                }
                linecount++;
                showctx();
                mymap.splice(i,1);
                mymap.unshift(newline);
            }  
        }
        linecount=0;
    }

    function isBlock(){
        for(let i = 0;i < mymap.length;i++){
            for (let j = 0 ;j < mymap[0].length; j++){
                if(mymap[i][j] == 1){
                    ctx.drawImage(blockimg,j*10,i*10);
                }
            }
        }
    }
},false);

