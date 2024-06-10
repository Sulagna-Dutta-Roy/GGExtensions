class Canvas {
    constructor() {
        this.canvas = document.querySelector('canvas')
        this.rows = []
        this.cordsProperties = {}
        this.cord = []
        this.blocks = ["line", "box", "L1", "L2", "T", 'Z1', "Z2"]
        this.nextblock = ''
        this.currentblock = ''
        this.blockcolor = ''
        this.BlockPos = []
        this.NextblockposY = []
        this.NextblockposXr = []
        this.NextblockposXl = []
        this.NextRotationPos = []
        this.rowname  = `row`
        this.score = 0
        this.uiColour = "gray"
    }
    drawCanvas = () => {
        this.canvas.width = 498
        this.canvas.height = 745
        let c = this.canvas.getContext('2d')
        c.fillStyle = this.uiColour
        c.fillRect(0,0,311,125)
        c.fillStyle = "black"
        c.font = "20px Tetris-Font"
        let rows = 0
        let collums = 0
        let x = 1
        let y = 1
        let numRows = 10
        let numCollums = 24
        let cords = []
        let rownum = 1
        this.rowname  = `${rownum}`
        while (collums != numCollums) {
            while (rows != numRows) {
                c.fillStyle = this.uiColour
                c.fillRect(0,0,311,125)
                c.fillStyle = 'black'
                c.fillRect(x, y, 30, 30)
                cords.push(`${x} ${y}`)
                
                this.cordsProperties[`${x} ${y}`] ={
                    Color: "black",
                    isFull: false,
                    row: this.rowname
                }
                this.cord.push(`${x} ${y}`)
                c.fillStyle = 'black'
                x = x + 31
                rows++
            }
            
            this.rows.push(cords)
            cords = []
            rownum++
            this.rowname = `${rownum}`
            y = y + 31
            x = 1
            rows = 0
            collums++
        }
        c = canvas.canvas.getContext('2d')
        c.fillStyle = this.uiColour
        c.fillRect(0,0,311,125) // ui--------------------------------------------------------------

        
    }
    Render = (block, x, y, orientation) => {
        var c = this.canvas.getContext('2d')
        var check = 0
        var tempY = y
        var tempX = x
        this.BlockPos.push(`${x} ${y}`)
        this.NextblockposY.push(`${x} ${y + 31}`)
        this.NextblockposXr.push(`${x +31} ${y+31}`)
        this.NextblockposXl.push(`${x -31} ${y+31}`)
        

        

        //render functions
        let AddY = (numofrun, remember) => {
            while (check != numofrun) {
                tempY = tempY + 31
                if (remember === true) {
                    y = tempY
                }
                check++
                
                this.BlockPos.push(`${x} ${tempY}`)
                this.NextblockposY.push(`${x} ${tempY + 31}`)
                this.NextblockposXr.push(`${x+31} ${tempY+31}`)
                this.NextblockposXl.push(`${x-31} ${tempY+31}`)
                c.fillRect(x, tempY, 30, 30)
                

            }
            tempY = y
            check = 0
        }
        let AddX = (numofrun, remember) => {
            while (check != numofrun) {
                tempX = tempX + 31
                if (remember === true) {
                    x = tempX
                }
               
                check++
                
                c.fillRect(tempX, y, 30, 30)
                this.BlockPos.push(`${tempX} ${y}`)
                this.NextblockposY.push(`${tempX} ${y + 31}`)
                this.NextblockposXr.push(`${tempX+31} ${y+31}`)
                this.NextblockposXl.push(`${tempX-31} ${y+31}`)
                
            }
            tempX = x
            check = 0
        }
        let MinusX = (numofrun, remember) => {
            while (check != numofrun) {
                tempX = tempX - 31
                if (remember === true) {
                    x = tempX
                }
                
                check++
                
                c.fillRect(tempX, y, 30, 30)
                this.BlockPos.push(`${tempX} ${y}`)
                this.NextblockposY.push(`${tempX} ${y + 31}`)
                this.NextblockposXr.push(`${tempX+31} ${y+31}`)
                this.NextblockposXl.push(`${tempX-31} ${y+31}`)
                
            }
            tempX = x
            check = 0
        }
        let MinusY = (numofrun, remember) => {
            while (check != numofrun) {
                tempY = tempY - 31
                if (remember === true) {
                    y = tempY
                }
                
                check++
                
                c.fillRect(x, tempY, 30, 30)
                this.BlockPos.push(`${x} ${tempY}`)
                this.NextblockposY.push(`${x} ${tempY + 31}`)
                this.NextblockposXr.push(`${x+31} ${tempY+31}`)
                this.NextblockposXl.push(`${x-31} ${tempY+31}`)
                
            }
            tempY = y
            check = 0
        }
        //block render instructions
        if (block === "line") {
            c.fillStyle = "lightblue"
            this.blockcolor = "lightblue"
            c.fillRect(x, y, 30, 30)

            if (orientation === "r2" || orientation === "r4") {
                AddY(1, false)
                MinusY(2, false)
            }
            else if (orientation === "r1" || orientation === "r3") {
                AddX(2, false)
                MinusX(1, false)
            }
        }
        else if (block === "box") {
            c.fillStyle = "green"
            this.blockcolor = "green"
            c.fillRect(x, y, 30, 30)
            MinusY(1, true)
            AddX(1, true)
            AddY(1, true)
        }
        else if (block === "L1") {
            c.fillStyle = "red"
            this.blockcolor = "red"
            c.fillRect(x, y, 30, 30)
            if (orientation === "r1") {
                AddX(1, false)
                MinusX(1, true)
                AddY(1, true)

            }
            else if (orientation === "r2") {
                AddY(1, false)
                MinusY(1, true)
                MinusX(1, true)
            }
            else if (orientation === "r3") {
                MinusX(1, false)
                AddX(1, true)
                MinusY(1, true)
            }
            else if (orientation === "r4") {
                MinusY(1, false)
                AddY(1, true)
                AddX(1, true)
            }
        }
        else if (block === "L2") {
            c.fillStyle = "Purple"
            this.blockcolor = "Purple"
            c.fillRect(x, y, 30, 30)
            if (orientation === "r1") {
                MinusX(1, false)
                AddX(1, true)
                AddY(1, true)
            }
            else if (orientation === "r2") {
                MinusY(1, false)
                AddY(1, true)
                MinusX(1, true)
            }
            else if (orientation === "r3") {
                AddX(1, false)
                MinusX(1, true)
                MinusY(1, true)

            }
            else if (orientation === "r4") {
                AddY(1, false)
                MinusY(1, true)
                AddX(1, true)
            }
        }
        else if (block === "Z1") {
            c.fillStyle = "Yellow"
            this.blockcolor = "Yellow"
            c.fillRect(x, y, 30, 30)
            if (orientation === "r1" || orientation === "r3") {
                AddX(1, false)
                AddY(1, true)
                MinusX(1, true)
            }
            else if (orientation === "r2" || orientation === "r4") {
                AddY(1, false)
                MinusX(1, true)
                MinusY(1, true)
            }
        }
        else if (block === "Z2") {
            c.fillStyle = "Lightgreen"
            this.blockcolor = "Lightgreen"
            c.fillRect(x, y, 30, 30)
            if (orientation === "r1" || orientation === "r3") {
                MinusX(1, false)
                AddY(1, true)
                AddX(1, true)
            }
            else if (orientation === "r2" || orientation === "r4") {
                MinusY(1, false)
                MinusX(1, true)
                AddY(1, true)
            }
        }
        else if (block === "T") {
            c.fillStyle = "Orange"
            this.blockcolor = "Orange"
            c.fillRect(x, y, 30, 30)
            if (orientation === "r1") {
                AddY(1, false)
                MinusX(1, false)
                AddX(1, false)
            }
            else if (orientation === "r2") {
                AddY(1, false)
                MinusX(1, false)
                MinusY(1, false)
            }
            else if (orientation === "r3") {
                MinusY(1, false)
                AddX(1, false)
                MinusX(1, false)
            }
            else if (orientation === "r4") {
                AddY(1, false)
                AddX(1, false)
                MinusY(1, false)
            }
        }
    }
    RefreshCanvas = () => {
        let c = this.canvas.getContext('2d')
        c.fillStyle = "gray"
        let rows = 0
        let collums = 0
        let x = 1
        let y = 1
        let numRows = 10
        let numCollums = 24
        let cords = []
        let rownum = 1
        while (collums != numCollums) {
            while (rows != numRows) {
                if (this.cord.includes(`${x} ${y}`)) {
                    c.fillRect(x, y, 30, 30)
                    c.fillStyle = 'black'
                    

                }
                x = x + 31
                rows++
            }
            cords = []
            rownum++
            y = y + 31
            x = 1
            rows = 0
            collums++
        }

        this.BlockPos = []
        this.NextblockposY = []
        this.NextblockposXl = []
        this.NextblockposXr = []
        this.NextRotationPos = []
        c.fillStyle = this.uiColour
        c.fillRect(0,0,311,125) // ui--------------------------------------------------------------
    }

    NextBlock = () => {
        let c = this.canvas.getContext('2d')
        console.log("---------------font change---------------------")
        c.font = "15px Tetris-Font"
        c.fillStyle = this.uiColour
        c.fillRect(311, 0, 187, 187) // ui--------------------------------------------------------------
        c.fillStyle = "white"
        c.fillText("Next block", 315, 30)
        let randomNum = Math.floor(Math.random() * this.blocks.length)
        this.nextblock = this.blocks[randomNum]
        let x = 403
        let y = 94
        this.Render(this.nextblock, x, y, 'r2')
        
    }
    CurrentBlock = () => {
        let c = this.canvas.getContext('2d')
        "---------------font change---------------------"
        c.font = "14px Tetris-Font"
        c.fillStyle = this.uiColour
        c.fillRect(311, 187, 187, 187) // ui--------------------------------------------------------------
        c.fillRect(311, 374, 187, 400) // ui--------------------------------------------------------------
        c.fillStyle = "white"
        
        c.fillText("Current block", 315, 210)
        let x = 403
        let y = 280
        this.Render(this.currentblock, x, y, 'r2')
        c.font = "15px Tetris-Font"
        
        
        

    }
}

var canvas = new Canvas();
let randomNum = Math.floor(Math.random() * canvas.blocks.length)

canvas.currentblock = canvas.blocks[randomNum]
class Game {
    constructor() {
        this.speed = 200
        this.movement = "null"
        this.x = 156
        this.y = 32
        this.canmove = true
        this.rotation = 'r1'
        this.numR = 1
        this.rembermovements = []
        this.checkList = []
        this.removedcords = []
        this.wait = 0
        this.restart = true
        
    }
    Move = async (direction) => {
        let len = canvas.BlockPos.length
        let i = 0
        let checkListR = []
        let checkListL = []
        
        if(this.canmove === false){
            this.rembermovements.push(direction)
            
        }
        
        while (i != len) {
            checkListR.push(canvas.cord.includes(canvas.NextblockposXr[i]))
            checkListL.push(canvas.cord.includes(canvas.NextblockposXl[i]))
            i++
        }
        //console.log(checkListR, checkListL)
         if (direction === "left" && checkListL.includes(false) != true && this.canmove === true && this.checkList.includes(false) != true) {
            canvas.RefreshCanvas()
            let c = canvas.canvas.getContext('2d')
            c.fillStyle = canvas.uiColour
            c.fillRect(0,0,310,125) // ui--------------------------------------------------------------
            canvas.Render(canvas.currentblock, this.x-31, this.y, this.rotation)
            c.fillStyle = canvas.uiColour
            c.fillRect(0,0,310,125) // ui--------------------------------------------------------------
           
            this.x = this.x - 31
            this.wait = 0
        }
        else if(direction === "right" && checkListR.includes(false) != true && this.canmove === true && this.checkList.includes(false) != true) {
            canvas.RefreshCanvas()
            let c = canvas.canvas.getContext('2d')
            c.fillStyle = canvas.uiColour
            c.fillRect(0,0,310,125) // ui--------------------------------------------------------------
            canvas.Render(canvas.currentblock, this.x + 31, this.y, this.rotation)
            c.fillStyle = canvas.uiColour
            c.fillRect(0,0,310,125) // ui--------------------------------------------------------------
           
            this.x = this.x + 31
            this.wait = 0
            
        }
        else if(direction === 'r'  && checkListR.includes(false) != true && checkListL.includes(false) != true && this.canmove === true && this.checkList.includes(false) != true){
            this.numR = this.numR+1
            if (this.numR > 4){
                this.numR = 1
            }
            this.rotation = `r${this.numR.toString()}`
            this.wait = 0
            
        }
        else if(direction === 'down'){
            
            this.speed = 50
            this.wait = 0

    
        }
        this.canmove = true
    }

    Update = async () => {
        let block = canvas.currentblock
        const delay = ms => new Promise(res => setTimeout(res, ms));
        let gameStarted = true
        let spawn = false
        canvas.Render(block, this.x, this.y, this.rotation)
        while (gameStarted === true) {
            let removedPosSpot = 0
            let removedLength = this.removedcords.length
            let remcord = []
            while(removedPosSpot != removedLength){
                remcord.push(`Cord: ${this.removedcords[removedPosSpot]} IsFull: ${canvas.cordsProperties[this.removedcords[removedPosSpot]].isFull}`)
                removedPosSpot++
            }
         
            
            block = canvas.currentblock
            this.canmove = true
            let remlen = this.rembermovements.length
            if (remlen >= 1 ){
                let n = this.rembermovements.length
                let m = 0
                while(m != n){
                    this.Move(this.rembermovements[0])
                    this.rembermovements.shift()
                    n = this.rembermovements.length
                }
            }
            await delay(this.speed)
            if(this.wait >= 1){
                this.speed = 200
            }
            this.wait++
        
            this.canmove = false

            canvas.RefreshCanvas()
            if (spawn = true) {
                canvas.Render(block, this.x, this.y, this.rotation)
                spawn = false
            }

            this.checkList = []
            let len = canvas.BlockPos.length
            let i = 0
            while (i != len) {
                this.checkList.push(canvas.cord.includes(canvas.NextblockposY[i]))
                i++
            }
            if (this.checkList.includes(false) != true) {
                canvas.RefreshCanvas()
                canvas.Render(block, this.x, this.y, this.rotation)
                this.y = this.y + 31
                this.x = this.x
                let c = canvas.canvas.getContext('2d')
                c.fillStyle = canvas.uiColour
                c.fillRect(0,0,310,125)// ui--------------------------------------------------------------
            }
            // making blocks stop
            if (this.checkList.includes(false) === true) {
                this.x = 156
                this.y = 63
                let iii = 0
                let xpos = 1
                let check = []
                while (iii != 10){
                    
                    check.push(canvas.cordsProperties[`${xpos} 125`].isFull)
                    xpos = xpos+31
                    
                    
                    iii++
                }
                if(check.includes(true)){
                    gameStarted = false
                    let c = canvas.canvas.getContext('2d')
                    c.fillStyle = canvas.uiColour
                    
                    c.fillRect(0,0,310,125) // ui--------------------------------------------------------------
                    restartGame()
                }


                spawn = true
                let z = canvas.BlockPos.length
                let v = 0
                while (v != z) {
                    let numberofcord = canvas.cord.indexOf(canvas.BlockPos[v])
                    let cordinate = canvas.BlockPos[v]
                    let rowofcord = canvas.cordsProperties[cordinate].row
                    canvas.cordsProperties[cordinate] = {
                        Color: canvas.blockcolor,
                        isFull: true,
                        row: rowofcord
                    }
                    //console.log(`---------${cordinate}: ${canvas.cordsProperties[cordinate].isFull} ----------`)
                    this.removedcords.push(cordinate)
                    canvas.cord.splice(numberofcord, 1)
                    v++
                }
                canvas.currentblock = canvas.nextblock
                canvas.NextBlock()
                canvas.CurrentBlock()
                i = 0
                let rowscleared = 0
                let spot = 0
                let rowArrayLength = canvas.rows.length

                // checks for full row
                while (spot != rowArrayLength){
                    let rowBeingChecked = canvas.rows[spot]
                    
                    //console.log(`row${spot+1}: ${rowBeingChecked}`)
                    let CurrentRowLength = rowBeingChecked.length
                    let checkingForFill = []
                    let rowSpot = 0
                    while(rowSpot != CurrentRowLength){
                        let pos = rowBeingChecked[rowSpot]
                        let posIsFull = canvas.cordsProperties[pos].isFull
                        //console.log(`pos${rowSpot+1}: ${pos} IsFull: ${posIsFull}`)
                        checkingForFill.push(posIsFull)
                        rowSpot++
                    }
                    // If the row is full 
                    if(checkingForFill.indexOf(false) === -1){
                        
                        rowscleared++
                        // removes the row
                        let CurrentRowLength = rowBeingChecked.length
                        let rowSpot = 0
                        while(rowSpot != CurrentRowLength){
                            let pos = rowBeingChecked[rowSpot]
                            //console.log(`(Position Being Added Back) pos${rowSpot+1}: ${pos}`)
                            canvas.cordsProperties[pos] ={
                                Color: canvas.blockcolor,
                                isFull: false,
                                row: canvas.cordsProperties[pos].row
                            }
                            canvas.cord.push(pos)
                            this.removedcords.splice(this.removedcords.indexOf(pos), 1)
                            rowSpot++
                        }
                        // check for blocks above
                        
                        let pos = rowBeingChecked[0]
                        pos = pos.split(' ')
                        let posY = Number(pos[1])
                        let posX = Number(pos[0])

                        //console.log(`Position :${rowBeingChecked[0]}    x: ${posX}  y(IMPORTANT THIS MATCHES): ${posY}}`)
                        // Check each cords and see if they are above the row that was cleared
                        let removeCordsLength = this.removedcords.length
                        let removeCordSpot = 0
                        let CordsNeedMoving = []
                        let CordsThatAreBelow = []
                        while(removeCordSpot != removeCordsLength){
                            let currentCordPos = this.removedcords[removeCordSpot]
                            let currentXandY = currentCordPos.split(' ')
                            let CurrentY = Number(currentXandY[1])
                            let currentPosIsFull = canvas.cordsProperties[currentCordPos].isFull
                            console.log(`Checking removed cord: ${currentCordPos} isFull: ${currentPosIsFull}`)
                            if(currentPosIsFull === true && CurrentY < posY){
                                console.log(`Position ${currentCordPos} is full adding to array :) `)
                                CordsNeedMoving.push(currentCordPos)

                            }
                            else if(currentPosIsFull === false){
                                console.log(`Position ${currentCordPos} is not full that's not right!!!! ************************************************`)
                            }
                            else if(CurrentY > posY){
                                //console.log(`${currentCordPos} is below the row that was cleared`)
                                CordsThatAreBelow.push(currentCordPos)
                            }
                            else if(CurrentY === posY){
                                console.log(`WARNING ${currentCordPos} is in the row that was cleared this should not happen!!!! *****************************************`)
                            }
                            removeCordSpot++
                            // if the position is full 
                        }
                    
                        let CordsNeedMovingLength = CordsNeedMoving.length
                        let CordsNeedMovingSpot = 0
                        while(CordsNeedMovingSpot != CordsNeedMovingLength){
                            let currentCordNeedMovingPos = CordsNeedMoving[CordsNeedMovingSpot]
                            let currentNeedMoveXandY = currentCordNeedMovingPos.split(' ')
                            let currentNeedMoveX = Number(currentNeedMoveXandY[0])
                            let currentNeedMoveY = Number(currentNeedMoveXandY[1])
                            let c = canvas.canvas.getContext("2d")
                            c.fillStyle ='purple'
                            c.fillRect(currentNeedMoveX, currentNeedMoveY, 30,30)
                                                        
                            canvas.cordsProperties[`${currentNeedMoveX} ${currentNeedMoveY}`] = {
                                Color: 'gray',
                                isFull: false,
                                row: canvas.cordsProperties[`${currentNeedMoveX} ${currentNeedMoveY}`].row
                            }
                            canvas.cord.push(`${currentNeedMoveX} ${currentNeedMoveY}`)
                            this.removedcords.splice(this.removedcords.indexOf(`${currentNeedMoveX} ${currentNeedMoveY}`),1)
                            CordsNeedMovingSpot++
                        }
                        CordsNeedMovingLength = CordsNeedMoving.length  
                        CordsNeedMovingSpot = 0
                        while(CordsNeedMovingSpot != CordsNeedMovingLength){
                            
                            let currentCord = CordsNeedMoving[CordsNeedMovingSpot]
                            let currentcordxandy = currentCord.split(' ')
                            let x = Number(currentcordxandy[0])
                            let y = Number(currentcordxandy[1])
                            let c = canvas.canvas.getContext("2d")
                            c.fillStyle = "blue"
                            c.fillRect(x,y+31,30,30)
                            y = y+31
                            canvas.cordsProperties[`${x} ${y}`] = {
                                Color: canvas.blockcolor,
                                isFull: true,
                                row: canvas.cordsProperties[`${x} ${y}`].row
                            }
                            canvas.cord.splice(canvas.cord.indexOf(`${x} ${y}`),1)
                            this.removedcords.push(`${x} ${y}`)
                            CordsNeedMovingSpot++
                        }

                    }
                    spot++
                    
                }
                if (rowscleared === 1){
                    canvas.score = canvas.score + 40
                }
                else if (rowscleared === 2){
                    canvas.score = canvas.score + 100
                }
                else if (rowscleared === 3){
                    canvas.score = canvas.score + 300
                }
                else if (rowscleared >= 4){
                    canvas.score = canvas.score + 1200
                }
                let c = canvas.canvas.getContext('2d')
                c.fillStyle = 'black'
                c.fillRect(320,475,100,50)
                c.fillStyle = 'white'
                c.font = "20px Tetris-Font"
                c.fillText(`${canvas.score}`, 325, 510)

            }
            // chrome.storage.local.set({PlayerScore: canvas.score}, function() {
            //     console.log(`Player score is ${canvas.score}`);
            // });
        }
        
        
    }
}

var game = new Game()

game.rotation = 'r1'


document.addEventListener("keydown", function (event) {
    if (event.keyCode === 37 ) {
        game.Move("left")
    }
    else if (event.keyCode === 39 ) {
        game.Move("right")
    }
    else if (event.keyCode === 82 ) {
        game.Move("r")
    }
    else if (event.keyCode === 40) {
        game.Move('down')
    }
    
})

LoadDelay = async () => {
    const time = ms => new Promise(res => setTimeout(res, ms))
    await time(500)
    // chrome.storage.local.get(['PlayerScore'], function(result) {
    //     console.log('Value currently is ' + result.PlayerScore);
    //     canvas.score = Number(`${result.PlayerScore}`)
    // });
    canvas.drawCanvas()
    let randomNum = Math.floor(Math.random() * canvas.blocks.length)
    canvas.currentblock = canvas.blocks[randomNum]
    canvas.NextBlock()
    canvas.CurrentBlock()
    
    let c = canvas.canvas.getContext('2d')
    c.fillStyle = 'black'
    c.fillRect(320,475,100,50)
    c.fillStyle = 'white'
    c.font = "20px Tetris-Font"
    c.fillText(`${canvas.score}`, 325, 510)
    game.Update()
}

restartGame = () =>{
    canvas = new Canvas()
    canvas.score = 0
    chrome.storage.local.set({PlayerScore: canvas.score}, function() {
        console.log(`Player score is ${canvas.score}`);
    });

    game = new Game()
    game.rotation = 'r1'
    LoadDelay();
}

LoadDelay();


let check = () =>{
    chrome.storage.local.get(['PlayerScore'], function(result) {
        console.log('Value currently is ' + result.PlayerScore);
    });
}

let clear = () =>{
chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }

});
}