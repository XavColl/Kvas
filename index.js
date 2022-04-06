$(document).ready(function(){

    $('canvas').contextmenu(function() {
        return false;
    });

    const canvas = $('canvas')[0]
    const ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let listBalls = []
    let listMobs = []
    let lapsMob = 0
    let lapsBall = 0
    let score = 0
    let speedMob = 5
    let hpMob = 5

    class Mob {
        constructor(type, speed, hp, position){
            this.position = position
            this.velocity = {
                x: 0,
                y: 0
            }
            this.width = 10
            this.height = 10
            this.hp = hp
            this.speed = speed
            this.type = type
        }

        draw() {
            ctx.fillStyle = 'green'
            ctx.fillRect(this.position.x,this.position.y, this.width, this.height)
            
        }

        walk(player){
            let randArr = []
            let ref

            if(player.position.x < this.position.x ){
                randArr.push(0)
            }else if(player.position.x > this.position.x ){
                randArr.push(1)
            }else {
                randArr.push(2)
            }

            if(player.position.y < this.position.y ){
                randArr.push(0)
            }else if(player.position.y > this.position.y ){
                randArr.push(1)
            }else {
                randArr.push(2)
            }


            if(randArr[0] !== 2 && randArr[1] !== 2){
                let rand = Math.random()*100
                if(rand>50){
                    ref = 'x' + randArr[0]
                }else ref = 'y' + randArr[1]
            }else if(randArr[0] === 2){
                ref = 'y' + randArr[1]
            }else if(randArr[1] === 2) {
                ref = 'x' + randArr[0]
            }else ref = 'z'

            if(ref[0] === 'x'){
                if (ref[1] === '0'){
                    this.position.x -=this.speed
                }
                else {
                    this.position.x += this.speed
                }
            }else if(ref[0] === 'y'){
                if (ref[1] === '0'){
                    this.position.y -=this.speed
                }
                else {
                    this.position.y += this.speed
                }
            }
        }
    
        update() {
            this.draw()
            this.walk(player)
        }
    }

    class Ball {
        constructor(initialPos){
            this.position = {
                x:initialPos.x,
                y:initialPos.y
            }
            this.velocity = {
                x: 0,
                y: 0,
            }
            this.width = 6
            this.height = 6
            this.speed = 8
            this.range = 300
            this.damage = 5
        }
        draw() {
            ctx.fillStyle = 'red'
            ctx.fillRect(this.position.x,this.position.y, this.width, this.height)
            
        }

        walk(){
            let init = listBalls.find(ball => ball[0] === this)[1]
            let trgt = listBalls.find(ball => ball[0] === this)[2]
            let iX = parseInt(init.split('-')[0])
            let iY = parseInt(init.split('-')[1])
            let x = parseInt(trgt.split('-')[0])
            let y = parseInt(trgt.split('-')[1])
            let spdX
            let spdY
            spdX = (Math.abs(x-iX) / (Math.abs(Math.abs(x-iX) + Math.abs(y-iY)))) * this.speed  
            spdY = (Math.abs(y-iY) / (Math.abs(Math.abs(x-iX) + Math.abs(y-iY)))) * this.speed 
            if(x>iX){
                this.position.x += spdX
                
            }else if(x<iX){
                this.position.x -= spdX
            }

            if(y>iY){
                this.position.y += spdY
            }else if(y<iY){
                this.position.y -= spdY
            }
        }
    
        update() {
            this.draw()
            this.walk()
        }
    }
    
    

    

   
    class Player {
        constructor(){
            this.keys = {
                up : false,
                down : false,
                left : false,
                right : false
            }
            this.position = {
                x: 100,
                y: 100
            }
            this.velocity = {
                x: 0,
                y: 0,
            }
            this.target = {
                x:0,
                y:0
            }
            this.speed = 5;
            this.width = 20
            this.height = 20
            this.hp = 50
            this.mana = 100
            this.stuff = {
                a : 'fireball',
                e : '',
                c : '',
                x : ''
            }
            this.weapon = ''
        }
        draw() {
            ctx.fillStyle = 'black'
            ctx.fillRect(this.position.x,this.position.y, this.width, this.height)
            
        }

        update() {
            this.draw()
            this.position.y += this.velocity.y
            this.position.x += this.velocity.x
            
        }
    }

    const player = new Player()


    const createMob = () => {
        if(lapsMob>150){
            const spd = speedMob
            const hp = hpMob
            let x = Math.random() * canvas.width
            let y = Math.random() * canvas.height


            let positionMob = {x,y}

            const mob = new Mob('fire',spd,hp,positionMob)

            listMobs.push(mob)
            lapsMob = 0
            speedMob += 0.3
            hpMob ++
            player.speed += 0.5
        }
        
    }
    

    const rangeOut = (ball) => {
        const x = parseInt(ball[1].split('-')[0])
        const y = parseInt(ball[1].split('-')[1])
        if((x + ball[0].range) < ball[0].position.x || (x - ball[0].range) > ball[0].position.x || (y + ball[0].range) < ball[0].position.y || (y - ball[0].range) > ball[0].position.y){
            delete ball[0]
        }
    }

    const deleteBall = (ball) => {
        let i = 0;
        let arr = []
        while (i<listBalls.length){
            if(listBalls[i] !== ball){
                arr.push(listBalls[i])
            }
            else {
                delete listBalls[i]
            }
            i++;
        }
        listBalls = arr
    }

    const deleteMob = (mob) => {
        let i = 0;
        let arr = []
        while (i<listMobs.length){
            if(listMobs[i] !== mob){
                arr.push(listMobs[i])
            }
            else {
                delete listMobs[i]
            }
            i++;
        }
        listMobs = arr
    }

    const dealDamage = (ball, mob) => {
        mob.hp -= ball[0].damage
        deleteBall(ball)
        if(mob.hp <= 0){
            deleteMob(mob)
            score ++
            console.log(score)
        }
    }

    const checkCollisions = () => {
        listMobs.forEach(mobs => {
            listBalls.forEach(balls => {
                try{
                    if(mobs.position.x <= (balls[0].position.x + balls[0].width) && (mobs.position.x + mobs.width)  >= balls[0].position.x
                    && mobs.position.y <= (balls[0].position.y + balls[0].height) && (mobs.position.y + mobs.height)  >= balls[0].position.y){
                        //deleteBall(balls)
                        dealDamage(balls, mobs)
                        //deleteMob(mobs)
                    }
                }catch{}
            })
            if(mobs.position.x <= (player.position.x + player.width) && (mobs.position.x + mobs.width) >= player.position.x 
            && mobs.position.y <= (player.position.y + player.height) && (mobs.position.y + mobs.width) >= player.position.y ){
                alert ('LOST')
            }
        })
    }

    const sendBall = () => {
        if(lapsBall>10){
            const ball = new Ball(player.position)
            const x = player.position.x
            const y = player.position.y
            const xt = player.target.x
            const yt = player.target.y
            const trgt = xt + "-" + yt
            const str = x + "-" + y
            listBalls.push([ball,str,trgt])
            lapsBall = 0
        }
        

    }

    const getCursorPosition = (canvas, event) => {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        player.target.y = y
        player.target.x = x
      }

    function animate() {
        lapsMob ++
        lapsBall ++
        requestAnimationFrame(animate)
        ctx.clearRect(0,0,canvas.width, canvas.height)
        player.update()

        if(player.keys.up){
            player.velocity.y = -player.speed
        }else if(player.keys.down){
            player.velocity.y = player.speed
        }else {
            player.velocity.y = 0
        }

        if(player.keys.left){
            player.velocity.x = -player.speed
        }else if(player.keys.right){
            player.velocity.x = player.speed
        }else {
            player.velocity.x = 0
        }


        listBalls.forEach(ball => {
            try{
                ball[0].update()
                rangeOut(ball)
            }catch{}
        });

        listMobs.forEach(mob => {
            try{
                mob.update()
                rangeOut(mob)
            }catch{}
        });

        checkCollisions();
        createMob();
    }


    animate()
    createMob()

    addEventListener('keydown', (event) => {
        if(event.keyCode === 90){
            //up
            //player.velocity.y = -player.speed
            player.keys.up = true
        }
        else if(event.keyCode === 83){
            //down
            player.keys.down = true
        }
        else if(event.keyCode === 81){
            //left
            player.keys.left = true
        }
        else if(event.keyCode === 68){
            //right
            player.keys.right = true
        }
        else if(event.keyCode === 32){
            sendBall()
        }
    })

    addEventListener('keyup', (event) => {
        if(event.keyCode === 90){
            //up
            //player.velocity.y = 0
            player.keys.up = false
        }
        else if(event.keyCode === 83){
            //down
            player.keys.down = false
        }
        else if(event.keyCode === 81){
            //left
            player.keys.left = false
        }
        else if(event.keyCode === 68){
            //right
            player.keys.right = false
        }
        else if(event.keyCode === 32){
        }
    })

    addEventListener("mousemove", (e) => { getCursorPosition(canvas, e) })

})