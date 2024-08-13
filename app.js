const gameBoard = document.querySelector("#gameboard")
const player = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8
let playerGo = 'white'
player.textContent = 'white'

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook,
]

function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div')
        square.innerHTML = startPiece
        square.setAttribute('square-id', i)
        square.classList.add('square')
        const row = Math.floor((63-i) / 8) + 1
        if (row % 2 === 0) {
            if (i % 2 === 0) {
                square.classList.add('gray')
            }
            else {
                square.classList.add('green')
            }
        }
        else {
            if (i % 2 === 0) {
                square.classList.add('green')
            }
            else {
                square.classList.add('gray')
            }
        }
        if (i <= 15) {
            square.firstChild.firstChild.classList.add('black')
        }
        gameBoard.append(square)
        if (i >= 48) {
            square.firstChild.firstChild.classList.add('white')
        }
        if (square.firstChild) {
            square.firstChild.setAttribute('draggable', true)
        }
    })
}

createBoard()


const allSquares = document.querySelectorAll(".square")


allSquares.forEach((square) => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
    square.addEventListener('dragend', dragEnd)
})

var gameOver = false
let startPositionId
let originalParentNode
let draggedElement
let kingId
let kingCoordinates
let targetSquare
let targetSquareParentNode
let correctGo
let taken
let opponentGo
let takenByOpponent
let valid
let kingLegalMoves
let canKingMoveThere
let changeInRow
let changeInColumn
let currentRow
let currentCol
let blockingSquare
let getPieceId
let attackingRow
let attackingColumn
let currentSquare
let currentSquareId
var whiteKingMoved = false
var blackKingMoved = false
var whiteRookOneMoved = false
var blackRookOneMoved = false
var whiteRookTwoMoved = false
var blackRookTwoMoved = false
var whiteCanCastle = true
var blackCanCastle = true
var promotion = false
let backRank = ["0","1","2","3","4","5","6","7"]
let promotionChoices
let allMoves = []
let lastMove
let getId
let inverseId
let pieceCurrent



function dragStart(e) {
    //console.log(allMoves)
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
    originalParentNode = draggedElement.parentNode
    opponentGo = playerGo === 'white'? 'black' : 'white'
}

function dragOver(e) {
    e.preventDefault()
}

function dragDrop(e) {
    e.stopPropagation()
    targetSquare = e.target
    targetSquareParentNode = e.target.parentNode
    taken = targetSquare.classList.contains("piece")
    correctGo = draggedElement.firstChild.classList.contains(playerGo)
    opponentGo = playerGo === 'white'? 'black' : 'white'
    takenByOpponent = targetSquare.firstChild?.classList.contains(opponentGo)
    valid = checkIfValid(e.target, startPositionId, draggedElement)

    if (correctGo && !gameOver) {
        if (takenByOpponent && valid && !promotion) {

            isCapture = true

            currentSquare = targetSquareParentNode
            currentSquareId = currentSquare.getAttribute('square-id')
            leftPiece = document.querySelector(`[square-id="${currentSquareId - 1}"]`)
            rightPiece = document.querySelector(`[square-id="${currentSquareId + 1}"]`)

            if (e.target.id == "king") {
                return
            }
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            if (draggedElement.id === "king") {
               if (playerGo === "white") {
                    whiteKingMoved = true
               }
               else if (playerGo === "black") {
                    blackKingMoved = true
               }
            }
            if (draggedElement.id === "rook" && startPositionId === "56") {
                if (playerGo === "white") {
                    whiteRookOneMoved = true
               }
               else if (playerGo === "black") {
                    blackRookOneMoved = true
               }
            }
            if (draggedElement.id === "rook" && startPositionId === "63") {
                if (playerGo === "white") {
                    whiteRookTwoMoved = true
               }
               else if (playerGo === "black") {
                    blackRookTwoMoved = true
               }
            }

            return
        }

        if (taken && !takenByOpponent && !promotion) {
            return
        }
        if (valid && !promotion) {

            //lastMove = allMoves[allMoves.length - 1]
            currentSquare = targetSquare
            currentSquareId = currentSquare.getAttribute('square-id')
            e.target.append(draggedElement)
            //leftPiece = document.querySelector(`[square-id="${currentSquareId - 1}"]`)
            //rightPiece = document.querySelector(`[square-id="${currentSquareId + 1}"]`)
            if (draggedElement.id === "king") {
                if (playerGo === "white") {
                    whiteKingMoved = true
               }
               else if (playerGo === "black") {
                    blackKingMoved = true
               }
            }
            if (draggedElement.id === "rook" && startPositionId === "56") {
                if (playerGo === "white") {
                    console.log("hello")
                    whiteRookOneMoved = true
               }
               else if (playerGo === "black") {
                    console.log("hello")
                    blackRookOneMoved = true
               }
            }
            if (draggedElement.id === "rook" && startPositionId === "63") {
                if (playerGo === "white") {
                    console.log("hello")
                    whiteRookTwoMoved = true
               }
               else if (playerGo === "black") {
                    console.log("hello")
                    blackRookTwoMoved = true
               }
            }

            return
        }

    }
}

function dragEnd(e) {



    correctGo = draggedElement.firstChild.classList.contains(playerGo)
    kingId = getIdOfKing()
    kingCoordinates = getCoordinatesOfKing(kingId)

    getId = Number(startPositionId)
    inverseId = (width * width) - 1 - getId
    pieceCurrent = document.querySelector(`[square-id="${getId}"]`).firstChild

    if (pieceCurrent) {
        pieceCurrent = pieceCurrent.id
    }

    if (correctGo && !promotion && !gameOver) {
        if (!isKingInCheck(kingCoordinates, opponentGo)) {
            if (startPositionId === "60"  && targetSquare.getAttribute('square-id') === '62' && draggedElement.id === "king" && !document.querySelector(`[square-id="${61}"]`).firstChild && document.querySelector(`[square-id="${63}"]`).firstChild && document.querySelector(`[square-id="${63}"]`).firstChild.id === "rook" && playerGo === "white" && whiteCanCastle && !whiteKingMoved && !whiteRookTwoMoved) {
                shortCastlesWhite()
                return
            }
            if (startPositionId === "59"  && targetSquare.getAttribute('square-id') === '57' && draggedElement.id === "king" && !document.querySelector(`[square-id="${58}"]`).firstChild && document.querySelector(`[square-id="${56}"]`).firstChild && document.querySelector(`[square-id="${56}"]`).firstChild.id === "rook" && playerGo === "black" && blackCanCastle && !blackKingMoved && !blackRookOneMoved) {
                shortCastlesBlack()
                return
            }
            if (startPositionId === "60"  && targetSquare.getAttribute('square-id') === "58" && draggedElement.id === "king" && !document.querySelector(`[square-id="${57}"]`).firstChild && !document.querySelector(`[square-id="${59}"]`).firstChild && document.querySelector(`[square-id="${56}"]`).firstChild && document.querySelector(`[square-id="${56}"]`).firstChild.id === "rook" && playerGo === "white" && whiteCanCastle && !whiteKingMoved && !whiteRookOneMoved) {
                longCastlesWhite()
                return
            }
            if (startPositionId === "59"  && targetSquare.getAttribute('square-id') === "61" && draggedElement.id === "king" && !document.querySelector(`[square-id="${60}"]`).firstChild && !document.querySelector(`[square-id="${62}"]`).firstChild && document.querySelector(`[square-id="${63}"]`).firstChild && document.querySelector(`[square-id="${63}"]`).firstChild.id === "rook" && playerGo === "black" && blackCanCastle && !blackKingMoved && !blackRookTwoMoved) {
                longCastlesBlack()
                return
            }

            if (checkPawnPosition(inverseId)) {
                console.log("hello")
                enPassant(originalParentNode, targetSquare)
                return
            }

            if (taken && !takenByOpponent || !valid) {
                infoDisplay.textContent = "Not a valid move!"
                setTimeout(() => infoDisplay.textContent = "", 1500)
                return
            }
            if (draggedElement.id == "pawn" && backRank.includes(currentSquareId)) {
                pawnPromotion()
                return
            }


            changePlayer()
            return
        }
        else {
            if (getOutOfCheck(draggedElement)) {
                changePlayer()
            }
        return
        }
    }
}


function changePlayer() {

    if (playerGo === "white") {
        reverseIds()
        playerGo = "black"
        player.textContent = "black"
    }
    else {
        revertIds()
        playerGo = "white"
        player.textContent = "white"
    }

    let opposingColor = playerGo === 'white'? 'black' : 'white'

    allMoves.push({
        initialSquareId: Number(startPositionId),
        finalSquareId: Number(currentSquareId),
        color: opposingColor,
        piece: draggedElement.id,
    })

    isCapture = false
    kingId = getIdOfKing()
    let currentCoordinates = getCoordinatesOfKing(kingId)
    canKingMoveThere = []
    kingSurroundingIds = [kingId+1, kingId-1, kingId+width, kingId-width, kingId+width+1, kingId+width-1, kingId-width+1, kingId-width-1]
    for (let id of kingSurroundingIds) {
        let surroundingSquare = document.querySelector(`[square-id="${id}"]`)
        let coordinates = getCoordinatesOfKing(id)
        let illegalSquare = isKingInCheck(coordinates, opposingColor)
        if (0 <= id && id < width * width) {
            if (surroundingSquare.firstChild && surroundingSquare.firstChild.firstChild.classList.contains(playerGo) || illegalSquare) {
                canKingMoveThere.push("no")
            }
            else {
                canKingMoveThere.push("yes")
            }
        }
    }
    let kingInCheck = isKingInCheck(currentCoordinates, opposingColor)
    let attackingPieceCoordinates = {}
    attackingPieceCoordinates.row = attackingRow
    attackingPieceCoordinates.column = attackingColumn
    let counterAttack = counterPiece(attackingPieceCoordinates, playerGo)
    let possibleBlock = canBlockCheck(currentCoordinates, attackingPieceCoordinates)

    console.log(allMoves)

    //game over by checkmate
    if (kingInCheck) {
        if (!counterAttack && !canKingMoveThere.includes('yes') && !possibleBlock) {
                gameOver = true;
                alert("Game over by checkmate, " + opposingColor + " wins.")
                let checkmate = document.querySelector('#checkmate')
                let display = document.createElement('h5')
                display.classList.add("checkmate-display")
                display.innerHTML = "Game over by checkmate, " + opposingColor + " wins."
                checkmate.append(display)
                return;
        }

        else if (counterAttack) {
            if (!canKingMoveThere.includes('yes') && getPieceId == 'king') {
                gameOver = true;
                alert("Game over by checkmate, " + opposingColor + " wins.")
                let checkmate = document.querySelector('#checkmate')
                let display = document.createElement('h5')
                display.classList.add("checkmate-display")
                display.innerHTML = "Game over by checkmate, " + opposingColor + " wins."
                checkmate.append(display)
                return;
            }
        }
    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => {
        square.setAttribute('square-id', ((width * width) - 1) - i)
    })
}

function revertIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => {
        square.setAttribute('square-id', i)
    })
}

function checkIfValid(target, start, piecePresent) {
    const targetId = Number(target.getAttribute('square-id'))|| Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(start)
    const piece = piecePresent.id

    switch(piece) {
        case "pawn":
            const starterRow = [48,49,50,51,52,53,54,55]
            const leftEdge = [16,24,32,40]
            if (starterRow.includes(startId) && startId - (width * 2) === targetId || startId - width === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild  || startId - width + 1 === targetId && document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild || startId - width - 1 === targetId && document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !leftEdge.includes(startId)) {
                return true
            }
            else {
                return false
            }
            break;
        case "knight":
            if (startId - (width * 2) + 1 === targetId || startId - (width * 2) - 1 === targetId || startId - width + 2 === targetId || startId - width - 2 === targetId || startId + (width * 2) + 1 === targetId || startId + (width * 2) - 1 === targetId || startId + width + 2 === targetId || startId +  width - 2 === targetId) {
                return true
            }
            else {
                return false
            }
            break;
        case "bishop":
            if (startId - width - 1 === targetId ||
                startId - width * 2 - 2 === targetId  && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild ||
                startId - width * 3 - 3 === targetId  && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild ||
                startId - width * 4 - 4 === targetId  && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild ||
                startId - width * 5 - 5 === targetId  && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild ||
                startId - width * 6 - 6 === targetId  && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild ||
                startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`).firstChild ||
                startId + width + 1 === targetId  ||
                startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                startId + width * 3 + 3 === targetId  && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild ||
                startId + width * 4 + 4 === targetId  && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild ||
                startId + width * 5 + 5 === targetId  && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild ||
                startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild ||
                startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild ||
                startId - width + 1 === targetId ||
                startId - width * 2 + 2 === targetId  && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild ||
                startId - width * 3 + 3 === targetId  && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild ||
                startId - width * 4 + 4 === targetId  && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild ||
                startId - width * 5 + 5 === targetId  && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild ||
                startId - width * 6 + 6 === targetId  && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild ||
                startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`).firstChild ||
                startId + width - 1 === targetId ||
                startId + width * 2 - 2 === targetId  && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                startId + width * 3 - 3 === targetId  && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild ||
                startId + width * 4 - 4 === targetId  && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild ||
                startId + width * 5 - 5 === targetId  && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild ||
                startId + width * 6 - 6 === targetId  && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild ||
                startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChild
            ) {
                return true
            }
            else {
                return false
            }
            break;
        case "rook":
            if (startId + width === targetId ||
                startId + width * 2 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                startId + width * 3 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild ||
                startId + width * 4 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild ||
                startId + width * 5 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild ||
                startId + width * 6 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild ||
                startId + width * 7 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild
                && !document.querySelector(`[square-id="${startId + width * 6}"]`).firstChild ||
                startId - width === targetId ||
                startId - width * 2 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild ||
                startId - width * 3 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild ||
                startId - width * 4 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild ||
                startId - width * 5 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild ||
                startId - width * 6 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild ||
                startId - width * 7 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild
                && !document.querySelector(`[square-id="${startId - width * 6}"]`).firstChild ||
                startId + 1 === targetId ||
                startId + 2 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild ||
                startId + 3 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild ||
                startId + 4 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||
                startId + 5 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild ||
                startId + 6 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild ||
                startId + 7 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild
                && !document.querySelector(`[square-id="${startId + 6}"]`).firstChild ||
                startId - 1 === targetId ||
                startId - 2 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild ||
                startId - 3 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild ||
                startId - 4 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||
                startId - 5 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild ||
                startId - 6 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild ||
                startId - 7 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild
                && !document.querySelector(`[square-id="${startId - 6}"]`).firstChild
            ) {
                return true
            }
            else {
                return false
            }
            break;
        case "queen":
            if (
                startId - width - 1 === targetId ||
                startId - width * 2 - 2 === targetId  && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild ||
                startId - width * 3 - 3 === targetId  && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild ||
                startId - width * 4 - 4 === targetId  && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild ||
                startId - width * 5 - 5 === targetId  && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild ||
                startId - width * 6 - 6 === targetId  && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild ||
                startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`).firstChild ||
                startId + width + 1 === targetId  ||
                startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                startId + width * 3 + 3 === targetId  && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild ||
                startId + width * 4 + 4 === targetId  && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild ||
                startId + width * 5 + 5 === targetId  && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild ||
                startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild ||
                startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild ||
                startId - width + 1 === targetId ||
                startId - width * 2 + 2 === targetId  && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild ||
                startId - width * 3 + 3 === targetId  && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild ||
                startId - width * 4 + 4 === targetId  && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild ||
                startId - width * 5 + 5 === targetId  && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild ||
                startId - width * 6 + 6 === targetId  && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild ||
                startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`).firstChild ||
                startId + width - 1 === targetId ||
                startId + width * 2 - 2 === targetId  && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                startId + width * 3 - 3 === targetId  && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild ||
                startId + width * 4 - 4 === targetId  && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild ||
                startId + width * 5 - 5 === targetId  && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild ||
                startId + width * 6 - 6 === targetId  && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild ||
                startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChild ||
                startId + width === targetId ||
                startId + width * 2 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                startId + width * 3 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild ||
                startId + width * 4 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild ||
                startId + width * 5 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild ||
                startId + width * 6 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild ||
                startId + width * 7 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild
                && !document.querySelector(`[square-id="${startId + width * 6}"]`).firstChild ||
                startId - width === targetId ||
                startId - width * 2 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild ||
                startId - width * 3 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild ||
                startId - width * 4 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild ||
                startId - width * 5 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild ||
                startId - width * 6 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild ||
                startId - width * 7 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild
                && !document.querySelector(`[square-id="${startId - width * 6}"]`).firstChild ||
                startId + 1 === targetId ||
                startId + 2 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild ||
                startId + 3 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild ||
                startId + 4 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||
                startId + 5 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild ||
                startId + 6 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild ||
                startId + 7 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild
                && !document.querySelector(`[square-id="${startId + 6}"]`).firstChild ||
                startId - 1 === targetId ||
                startId - 2 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild ||
                startId - 3 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild ||
                startId - 4 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||
                startId - 5 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild ||
                startId - 6 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild ||
                startId - 7 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild
                && !document.querySelector(`[square-id="${startId - 6}"]`).firstChild
            ) {
                return true
            }
            else {
                return false
            }
            break;
        case "king":
            if (
                startId + 1 === targetId ||
                startId - 1 === targetId ||
                startId + width === targetId ||
                startId - width === targetId ||
                startId + width + 1 === targetId ||
                startId - width + 1 === targetId ||
                startId + width - 1 === targetId ||
                startId - width - 1 === targetId
            ) {
                return true
            }
            else {
                return false
            }
            break
    }
}


function getIdOfKing() {
    for (let i = 0; i < width * width ; i++) {
        let containsPiece = document.querySelector(`[square-id="${i}"]`).firstChild
        if (containsPiece) {
            if (containsPiece.id === "king" && containsPiece.firstChild.classList.contains(playerGo)) {
                return i
            }
        }
    }
}

function getCoordinatesOfKing(Id) {
   kingCoordinates = {}
   kingCoordinates.row = Math.floor(Id / width)
   kingCoordinates.column = Id % width
   return kingCoordinates
}

function isKingInCheck(kingPosition, opponentColor) {
    //console.log(kingPosition)
    const kingRow = kingPosition.row;
    const kingCol = kingPosition.column;
    //console.log(kingRow)
    //console.log(kingCol)

    // Calculate pawn attack positions
    const pawnAttacks = [
        { row: kingRow - 1, col: kingCol - 1 },
        { row: kingRow - 1, col: kingCol + 1 }
    ];

    // Calculate knight attack positions
    const knightMoves = [
        { row: kingRow - 2, col: kingCol - 1 },
        { row: kingRow - 2, col: kingCol + 1 },
        { row: kingRow - 1, col: kingCol - 2 },
        { row: kingRow - 1, col: kingCol + 2 },
        { row: kingRow + 1, col: kingCol - 2 },
        { row: kingRow + 1, col: kingCol + 2 },
        { row: kingRow + 2, col: kingCol - 1 },
        { row: kingRow + 2, col: kingCol + 1 }
    ];

    // Calculate bishop attack positions (diagonals)
    const bishopDirections = [
        { rowDelta: -1, colDelta: -1 }, // top-left
        { rowDelta: -1, colDelta: 1 },  // top-right
        { rowDelta: 1, colDelta: -1 },  // bottom-left
        { rowDelta: 1, colDelta: 1 }    // bottom-right
    ];
    const bishopAttacks = getAllAttacksInDirection(kingRow, kingCol, bishopDirections);

    // Calculate rook attack positions (vertical and horizontal)
    const rookDirections = [
        { rowDelta: -1, colDelta: 0 }, // up
        { rowDelta: 1, colDelta: 0 },  // down
        { rowDelta: 0, colDelta: -1 }, // left
        { rowDelta: 0, colDelta: 1 }   // right
    ];

    const rookAttacks = getAllAttacksInDirection(kingRow, kingCol, rookDirections);

    // Calculate queen attack positions (combine bishop and rook attacks)
    const queenAttacks = [...bishopAttacks, ...rookAttacks];
    //console.log(isUnderThreat(kingPosition, pawnAttacks, "pawn", opponentColor))
    //console.log(isUnderThreat(kingPosition, pawnAttacks, "knight", opponentColor))
    //console.log(isUnderThreat(kingPosition, pawnAttacks, "bishop", opponentColor))
    //console.log(isUnderThreat(kingPosition, pawnAttacks, "rook", opponentColor))
    //console.log(isUnderThreat(kingPosition, pawnAttacks, "queen", opponentColor))

    // Check for threats from each type of piece

    const kingMoves = [
        { row: kingRow-1, col: kingCol },  // Move one square up
        { row: kingRow+1, col: kingCol },   // Move one square down
        { row: kingRow, col: kingCol-1 },  // Move one square left
        { row: kingRow, col: kingCol+1 },   // Move one square right
        { row: kingRow-1, col: kingCol-1 }, // Move one square up-left
        { row: kingRow-1, col: kingCol+1 },  // Move one square up-right
        { row: kingRow+1, col: kingCol-1 },  // Move one square down-left
        { row: kingRow+1, col: kingCol+1 }    // Move one square down-right
    ];


    if (isUnderThreat(kingPosition, pawnAttacks, "pawn", opponentColor)) {

        return true;
    }
    if (isUnderThreat(kingPosition, knightMoves, "knight", opponentColor)) {

        return true;
    }
    if (isUnderThreat(kingPosition, bishopAttacks, "bishop", opponentColor)) {

        return true;
    }
    if (isUnderThreat(kingPosition, rookAttacks, "rook", opponentColor)) {

        return true;
    }
    if (isUnderThreat(kingPosition, queenAttacks, "queen", opponentColor)) {

        return true;
    }

    if (isUnderThreat(kingPosition, kingMoves, "king", opponentColor)) {

        return true;
    }


    return false; // King is not in check by any of these pieces
}

// Helper function to calculate all attacks in a given direction until board boundary or capture
function getAllAttacksInDirection(kingRow, kingCol, directions) {
    let attacks = [];
    for (let dir of directions) {
        let { rowDelta, colDelta } = dir;
        let currentRow = kingRow + rowDelta;
        let currentCol = kingCol + colDelta;
        while (isValidPosition(currentRow, currentCol)) {
            attacks.push({ row: currentRow, col: currentCol });
            currentRow += rowDelta;
            currentCol += colDelta;
        }
    }
    return attacks;
}


// Helper function to check if the king is under threat from a given set of attacks

function isUnderThreat(kingPosition, attacks, pieceId, opponentColor) {
    for (let attack of attacks) {
        if (isValidPosition(attack.row, attack.col)) {
            const square = getSquareAtPosition(attack.row, attack.col);
            if (square.firstChild) {
                if (square.firstChild.id === pieceId && square.firstChild.firstChild.classList.contains(opponentColor)) {
                    getPieceId = pieceId
                    attackingRow = attack.row
                    attackingColumn = attack.col
                    switch(pieceId) {
                        case "rook":
                            changeInRow = kingPosition.row - attack.row
                            changeInColumn = kingPosition.column - attack.col
                            if (changeInColumn === 0) {
                                currentRow = attack.row
                                currentCol = attack.col
                                while (currentRow !== kingPosition.row) {
                                    if (isValidPosition(currentRow, currentCol) && currentRow !== attack.row) {
                                        blockingSquare = getSquareAtPosition(currentRow, currentCol);
                                        if (blockingSquare.firstChild) {
                                            // There's a piece blocking the attack
                                            return false;

                                        }
                                    }
                                    currentRow += (changeInRow / Math.abs(changeInRow));
                                }
                            }
                            else if (changeInRow === 0) {
                                currentRow = attack.row
                                currentCol = attack.col
                                while (currentCol !== kingPosition.column) {
                                    if (isValidPosition(currentRow, currentCol) && currentCol !== attack.col && currentRow !== attack.row) {
                                        blockingSquare = getSquareAtPosition(currentRow, currentCol);
                                        if (blockingSquare.firstChild) {
                                            // There's a piece blocking the attack
                                            return false;

                                        }
                                    }
                                    currentCol += (changeInColumn / Math.abs(changeInColumn));
                                }
                            }
                            return true;
                            break;
                        case "pawn":
                            return true;
                            break;
                        case "knight":
                            return true;
                            break;
                        case "king":
                            return true;
                            break;
                        case "bishop":
                            //Calculate delta
                            changeInRow = kingPosition.row - attack.row ;
                            changeInColumn = kingPosition.column - attack.col;
                            //Check for blocking pieces between the attacking piece and the king
                            currentRow = attack.row
                            currentCol = attack.col
                            while (currentRow !== kingPosition.row && currentCol !== kingPosition.column) {
                                if (isValidPosition(currentRow, currentCol) && (currentRow !== attack.row && currentCol !== attack.col)) {
                                    blockingSquare = getSquareAtPosition(currentRow, currentCol);
                                    if (blockingSquare.firstChild) {
                                        // There's a piece blocking the attack
                                        return false;
                                    }

                                }
                                currentRow += (changeInRow / Math.abs(changeInRow));
                                currentCol += (changeInColumn / Math.abs(changeInColumn));
                            }
                            // No blocking piece found, king is under threat
                            return true;
                            break;
                        case "queen":
                            changeInRow = kingPosition.row - attack.row ;
                            changeInColumn = kingPosition.column - attack.col;
                            if (changeInColumn === 0) {
                                currentRow = attack.row
                                currentCol = attack.col
                                while (currentRow !== kingPosition.row) {
                                    if (isValidPosition(currentRow, currentCol) && currentRow !== attack.row) {
                                        blockingSquare = getSquareAtPosition(currentRow, currentCol);
                                        if (blockingSquare.firstChild) {
                                            // There's a piece blocking the attack
                                            return false;

                                        }
                                    }
                                    currentRow += (changeInRow / Math.abs(changeInRow));
                                }
                            }
                            else if (changeInRow === 0) {
                                currentRow = attack.row
                                currentCol = attack.col
                                while (currentCol !== kingPosition.column) {
                                    if (isValidPosition(currentRow, currentCol) && currentCol !== attack.col) {
                                        blockingSquare = getSquareAtPosition(currentRow, currentCol);
                                        if (blockingSquare.firstChild) {
                                            // There's a piece blocking the attack
                                            return false;
                                        }
                                    }
                                    currentCol += (changeInColumn / Math.abs(changeInColumn));
                                }
                            }
                            else {
                                currentRow = attack.row
                                currentCol = attack.col
                                while (currentRow !== kingPosition.row && currentCol !== kingPosition.column) {
                                    if (isValidPosition(currentRow, currentCol) && (currentRow !== attack.row && currentCol !== attack.col)) {
                                        blockingSquare = getSquareAtPosition(currentRow, currentCol);
                                        integerId = (currentRow * width) + currentCol
                                        if (blockingSquare.firstChild) {
                                            // There's a piece blocking the attack
                                            return false;
                                        }
                                    }
                                    currentRow += (changeInRow / Math.abs(changeInRow));
                                    currentCol += (changeInColumn / Math.abs(changeInColumn));
                                }
                            }
                            return true;
                            break;

                    }
                }
            }
        }
    }
    return false;
}


// Example utility functions (replace with your actual implementations):
function isValidPosition(row, col) {
    //console.log(row)
    // Check if (row, col) is a valid position on the board
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function getSquareAtPosition(row, col) {
    // Returns the HTML element representing the square at (row, col)
    return document.querySelector(`[square-id="${row * 8 + col}"]`);
}

//when the king is in check
function getOutOfCheck(draggedPiece) {
    isPiecePresent = targetSquare.classList.contains("piece")
    if (isKingInCheck(kingCoordinates, opponentGo)) {
        if (isPiecePresent) {
            targetSquareParentNode.append(targetSquare)
            draggedPiece.remove()
            originalParentNode.append(draggedPiece)
        }
        else {
            originalParentNode.append(draggedPiece)
        }
        return false
    }
    else {
        if (isPiecePresent) {
            targetSquare.parentNode.append(draggedPiece)
            targetSquare.remove()
        }
        else {
            targetSquare.append(draggedPiece)
        }
    }
    return true
}

function counterPiece(piecePosition, playerColor) {
    const pieceRow = piecePosition.row;
    const pieceCol = piecePosition.column;

    // Calculate pawn attack positions
    const pawnAttacks = [
        { row: pieceRow + 1, col: pieceCol - 1 },
        { row: pieceRow + 1, col: pieceCol + 1 }
    ];

    // Calculate knight attack positions
    const knightMoves = [
        { row: pieceRow - 2, col: pieceCol - 1 },
        { row: pieceRow - 2, col: pieceCol + 1 },
        { row: pieceRow - 1, col: pieceCol - 2 },
        { row: pieceRow - 1, col: pieceCol + 2 },
        { row: pieceRow + 1, col: pieceCol - 2 },
        { row: pieceRow + 1, col: pieceCol + 2 },
        { row: pieceRow + 2, col: pieceCol - 1 },
        { row: pieceRow + 2, col: pieceCol + 1 }
    ];

    // Calculate bishop attack positions (diagonals)
    const bishopDirections = [
        { rowDelta: -1, colDelta: -1 }, // top-left
        { rowDelta: -1, colDelta: 1 },  // top-right
        { rowDelta: 1, colDelta: -1 },  // bottom-left
        { rowDelta: 1, colDelta: 1 }    // bottom-right
    ];
    const bishopAttacks = getAllAttacksInDirectionPiece(pieceRow, pieceCol, bishopDirections);

    // Calculate rook attack positions (vertical and horizontal)
    const rookDirections = [
        { rowDelta: -1, colDelta: 0 }, // up
        { rowDelta: 1, colDelta: 0 },  // down
        { rowDelta: 0, colDelta: -1 }, // left
        { rowDelta: 0, colDelta: 1 }   // right
    ];

    const rookAttacks = getAllAttacksInDirectionPiece(pieceRow, pieceCol, rookDirections);

    // Calculate queen attack positions (combine bishop and rook attacks)
    const queenAttacks = [...bishopAttacks, ...rookAttacks];

    // Check for threats from each type of piece

    const kingMoves = [
        { row: pieceRow-1, col: pieceCol },  // Move one square up
        { row: pieceRow+1, col: pieceCol },   // Move one square down
        { row: pieceRow, col: pieceCol-1 },  // Move one square left
        { row: pieceRow, col: pieceCol+1 },   // Move one square right
        { row: pieceRow-1, col: pieceCol-1 }, // Move one square up-left
        { row: pieceRow-1, col: pieceCol+1 },  // Move one square up-right
        { row: pieceRow+1, col: pieceCol-1 },  // Move one square down-left
        { row: pieceRow+1, col: pieceCol+1 }    // Move one square down-right
    ];


    if (isPieceUnderThreat(piecePosition, pawnAttacks, "pawn", playerColor)) {

        return true;
    }
    if (isPieceUnderThreat(piecePosition, knightMoves, "knight", playerColor)) {

        return true;
    }
    if (isPieceUnderThreat(piecePosition, bishopAttacks, "bishop", playerColor)) {

        return true;
    }
    if (isPieceUnderThreat(piecePosition, rookAttacks, "rook", playerColor)) {

        return true;
    }
    if (isPieceUnderThreat(piecePosition, queenAttacks, "queen", playerColor)) {

        return true;
    }

    if (isPieceUnderThreat(piecePosition, kingMoves, "king", playerColor)) {

        return true;
    }


    return false; // King is not in check by any of these pieces
}

// Helper function to calculate all attacks in a given direction until board boundary or capture
function getAllAttacksInDirectionPiece(pieceRow, pieceCol, directions) {
    let attacks = [];
    for (let dir of directions) {
        let { rowDelta, colDelta } = dir;
        let currentRow = pieceRow + rowDelta;
        let currentCol = pieceCol + colDelta;
        while (isValidPosition(currentRow, currentCol)) {
            attacks.push({ row: currentRow, col: currentCol });
            currentRow += rowDelta;
            currentCol += colDelta;
        }
    }
    //console.log(attacks)
    return attacks;
}



function isPieceUnderThreat(piecePosition, attacks, pieceId, playerColor) {
    for (let attack of attacks) {
        if (isValidPosition(attack.row, attack.col)) {
            const square = getSquareAtPosition(attack.row, attack.col);
            //console.log(square)
            if (square.firstChild) {
                if (square.firstChild.id === pieceId && square.firstChild.firstChild.classList.contains(playerColor)) {
                    getPieceId = pieceId
                    attackingRow = attack.row
                    attackingColumn = attack.col
                    switch(pieceId) {
                        case "pawn":
                            return true;
                            break;
                        case "knight":
                            return true;
                            break;
                        case "king":
                            return true;
                            break;
                        case "bishop":
                            //Calculate delta
                            changeInRow = piecePosition.row - attack.row ;
                            changeInColumn = piecePosition.column - attack.col;
                            //Check for blocking pieces between the attacking piece and the king
                            currentRow = attack.row
                            currentCol = attack.col
                            while (currentRow !== piecePosition.row && currentCol !== piecePosition.column) {
                                if (isValidPosition(currentRow, currentCol) && (currentRow !== attack.row && currentCol !== attack.col)) {
                                    blockingSquare = getSquareAtPosition(currentRow, currentCol);
                                    //console.log(blockingSquare)
                                    if (blockingSquare.firstChild) {
                                        // There's a piece blocking the attack
                                        return false;
                                    }
                                    //integerId = (currentRow * width) + currentCol

                                }
                                currentRow += (changeInRow / Math.abs(changeInRow));
                                currentCol += (changeInColumn / Math.abs(changeInColumn));
                            }
                            // No blocking piece found, king is under threat
                            return true;
                            break;
                        case "rook":
                            changeInRow = piecePosition.row - attack.row ;
                            changeInColumn = piecePosition.column - attack.col;
                            if (changeInColumn === 0) {
                                currentRow = attack.row
                                currentCol = attack.col
                                while (currentRow !== piecePosition.row) {
                                    if (isValidPosition(currentRow, currentCol) && currentRow !== attack.row) {
                                        blockingSquare = getSquareAtPosition(currentRow, currentCol);
                                        //console.log(blockingSquare)
                                        if (blockingSquare.firstChild) {
                                            // There's a piece blocking the attack
                                            return false;
                                        }

                                    }
                                    currentRow += (changeInRow / Math.abs(changeInRow));
                                }
                            }
                            else if (changeInRow === 0) {
                                currentRow = attack.row
                                currentCol = attack.col
                                while (currentCol !== piecePosition.column) {
                                    if (isValidPosition(currentRow, currentCol) && currentCol !== attack.column) {
                                        blockingSquare = getSquareAtPosition(currentRow, currentCol);
                                        //console.log(blockingSquare)
                                        if (blockingSquare.firstChild) {
                                            // There's a piece blocking the attack
                                            return false;
                                        }

                                    }
                                    currentCol += (changeInColumn / Math.abs(changeInColumn));
                                }
                            }
                            return true;
                            break;
                        case "queen":
                            changeInRow = piecePosition.row - attack.row ;
                            changeInColumn = piecePosition.column - attack.col;
                            if (changeInColumn == 0) {
                                currentRow = attack.row
                                currentCol = attack.col
                                while (currentRow !== piecePosition.row) {
                                    if (isValidPosition(currentRow, currentCol) && (currentRow !== attack.row && currentCol !== attack.column)) {
                                        blockingSquare = getSquareAtPosition(currentRow, currentCol);
                                        //console.log(blockingSquare)
                                        if (blockingSquare.firstChild) {
                                            // There's a piece blocking the attack
                                            return false;
                                        }

                                    }
                                    currentRow += (changeInRow / Math.abs(changeInRow));
                                }
                            }
                            else if (changeInRow == 0) {
                                currentRow = attack.row
                                currentCol = attack.col
                                while (currentCol !== piecePosition.column) {
                                    if (isValidPosition(currentRow, currentCol) && (currentCol !== attack.row && currentCol !== attack.col)) {
                                        blockingSquare = getSquareAtPosition(currentRow, currentCol);
                                        //console.log(blockingSquare)
                                        if (blockingSquare.firstChild) {
                                            // There's a piece blocking the attack
                                            return false;
                                        }

                                    }
                                    currentCol += (changeInColumn / Math.abs(changeInColumn));
                                }
                            }
                            else {
                                currentRow = attack.row
                                currentCol = attack.col
                                while (currentRow !== piecePosition.row && currentCol !== piecePosition.column) {
                                    if (isValidPosition(currentRow, currentCol) && (currentRow !== attack.row && currentCol !== attack.col)) {
                                        blockingSquare = getSquareAtPosition(currentRow, currentCol);
                                        //console.log(blockingSquare)
                                        if (blockingSquare.firstChild) {
                                            // There's a piece blocking the attack
                                            return false;
                                        }

                                    }
                                    currentRow += (changeInRow / Math.abs(changeInRow));
                                    currentCol += (changeInColumn / Math.abs(changeInColumn));
                                }
                            }
                            return true;
                            break;

                    }
                }
            }
        }
    }
    return false;
}

function canBlockCheck(kingPosition, piecePosition) {
    let kingRow = kingPosition.row
    let kingColumn = kingPosition.column

    let pieceRow = piecePosition.row
    let pieceColumn = piecePosition.column

    let changeInRow = kingRow - pieceRow
    let changeInColumn = kingColumn - pieceColumn

    let rowAtInstant = pieceRow
    let columnAtInstant = pieceColumn

    let currentSquare
    let currentSquareNumber

    //let canBlock

    if (changeInColumn === 0) {
        while (rowAtInstant !== kingRow) {
            if (rowAtInstant !== pieceRow) {
                currentSquareNumber = (rowAtInstant * width) + columnAtInstant
                currentSquare = document.querySelector(`[square-id="${currentSquareNumber}"]`)
                //canBlock = []
                for (let x = 0; x < width * width; x++) {
                    let containsPiece = document.querySelector(`[square-id="${x}"]`)
                    if (containsPiece.firstChild && containsPiece.firstChild.firstChild.classList.contains(playerGo)) {
                        validBlock = checkIfValid(currentSquare, x, containsPiece.firstChild)
                        if (validBlock && containsPiece.firstChild.id !== "king") {
                            return true
                        }
                        //canBlock.push(validBlock)
                    }
                }

                /*if (canBlock.includes(true)) {
                    return true
                }*/
            }
            rowAtInstant += (changeInRow / Math.abs(changeInRow))
        }
    }

    else if (changeInRow === 0) {
        while (columnAtInstant !== kingColumn) {
            if (columnAtInstant !== pieceColumn) {
                currentSquareNumber = (rowAtInstant * width) + columnAtInstant
                currentSquare = document.querySelector(`[square-id="${currentSquareNumber}"]`)
                //canBlock = []
                for (let x = 0; x < width * width; x++) {
                    let containsPiece = document.querySelector(`[square-id="${x}"]`)
                    if (containsPiece.firstChild && containsPiece.firstChild.firstChild.classList.contains(playerGo)) {
                        validBlock = checkIfValid(currentSquare, x, containsPiece.firstChild)
                        if (validBlock && containsPiece.firstChild.id !== "king") {
                            return true
                        }
                        //canBlock.push(validBlock)
                    }
                }

                /*if (canBlock.includes(true)) {
                    return true
                }*/
            }
            columnAtInstant += (changeInColumn / Math.abs(changeInColumn))
        }


    }
    else {
        while (rowAtInstant !== kingRow && columnAtInstant !== kingColumn) {
            if (rowAtInstant !== pieceRow && columnAtInstant !== pieceColumn) {
                currentSquareNumber = (rowAtInstant * width) + columnAtInstant
                currentSquare = document.querySelector(`[square-id="${currentSquareNumber}"]`)

                for (let x = 0; x < width * width; x++) {
                    let containsPiece = document.querySelector(`[square-id="${x}"]`)
                    if (containsPiece.firstChild && containsPiece.firstChild.firstChild.classList.contains(playerGo)) {
                        validBlock = checkIfValid(currentSquare, x, containsPiece.firstChild)
                        if (validBlock && containsPiece.firstChild.id !== "king") {
                            return true
                        }
                    }
                }
            }
            rowAtInstant += (changeInRow / Math.abs(changeInRow))
            columnAtInstant += (changeInColumn / Math.abs(changeInColumn))
        }
    }
    return false
}

function shortCastlesWhite() {
    if (shortCastleConditions()) {
        targetSquare.append(draggedElement)
        document.querySelector(`[square-id="${63}"]`).innerHTML = ""
        document.querySelector(`[square-id="${61}"]`).innerHTML = rook
        document.querySelector(`[square-id="${61}"]`).firstChild.setAttribute('draggable', true)
        document.querySelector(`[square-id="${61}"]`).firstChild.firstChild.classList.add(playerGo)
        whiteCanCastle = false
        changePlayer()
    }
}

function shortCastlesBlack() {
    if (shortCastleConditions()) {
        targetSquare.append(draggedElement)
        document.querySelector(`[square-id="${56}"]`).innerHTML = ""
        document.querySelector(`[square-id="${58}"]`).innerHTML = rook
        document.querySelector(`[square-id="${58}"]`).firstChild.setAttribute('draggable', true)
        document.querySelector(`[square-id="${58}"]`).firstChild.firstChild.classList.add(playerGo)
        blackCanCastle = false
        changePlayer()
    }
}

function longCastlesWhite() {
    if (longCastleConditions()) {
        targetSquare.append(draggedElement)
        document.querySelector(`[square-id="${56}"]`).innerHTML = ""
        document.querySelector(`[square-id="${59}"]`).innerHTML = rook
        document.querySelector(`[square-id="${59}"]`).firstChild.setAttribute('draggable', true)
        document.querySelector(`[square-id="${59}"]`).firstChild.firstChild.classList.add(playerGo)
        whiteCanCastle = false
        changePlayer()
    }
}

function longCastlesBlack() {
    if (longCastleConditions()) {
        targetSquare.append(draggedElement)
        document.querySelector(`[square-id="${63}"]`).innerHTML = ""
        document.querySelector(`[square-id="${60}"]`).innerHTML = rook
        document.querySelector(`[square-id="${60}"]`).firstChild.setAttribute('draggable', true)
        document.querySelector(`[square-id="${60}"]`).firstChild.firstChild.classList.add(playerGo)
        blackCanCastle = false
        changePlayer()
    }
}

function shortCastleConditions() {
    let coordinates
    let result
    if (playerGo === "white") {
        for (let y = 1; y < 3; y++) {
            coordinates = getCoordinatesOfKing(Number(startPositionId) + y)
            result = isKingInCheck(coordinates, opponentGo)
            if (result === true) {
                return false
            }
        }
    }
    else if (playerGo === "black") {
        for (let y = 1; y < 3; y++) {
            coordinates = getCoordinatesOfKing(Number(startPositionId) - y)
            result = isKingInCheck(coordinates, opponentGo)
            console.log(result)
            if (result === true) {
                return false
            }
        }
    }
    return true
}


function longCastleConditions() {
    let coordinates
    let result

    if (playerGo === "white") {
        for (let y = 1; y < 3; y++) {
            coordinates = getCoordinatesOfKing(Number(startPositionId) - y)
            result = isKingInCheck(coordinates, opponentGo)
            if (result === true) {
                return false
            }
        }
    }
    else if (playerGo === "black") {
        for (let y = 1; y < 3; y++) {
            coordinates = getCoordinatesOfKing(Number(startPositionId) + y)
            result = isKingInCheck(coordinates, opponentGo)
            console.log(result)
            if (result === true) {
                return false
            }
        }
    }
    return true
}

function pawnPromotion() {
    promotionChoices = document.querySelector('#promotion')
    promotion = true
    const availablePieces = [rook, knight, bishop, queen]
    alert("Please select a promotion choice below.")

    const header = document.createElement('h4')
    promotionChoices.append(header)
    header.innerHTML = "Select your promotion choice:"

    availablePieces.forEach((piece, i) => {
        const button = document.createElement('button')
        promotionChoices.append(button)
        button.className = "btn btn-primary"
        button.classList.add("choice")
        button.type = 'button'
        button.innerHTML = piece
        button.id = i
        button.firstChild.classList.add(playerGo)
    })

    const allButtons = document.querySelectorAll(".choice")

    allButtons.forEach((button) => {
        button.addEventListener('click', pawnTransform)
    })
}

function pawnTransform(e) {
    e.stopPropagation()

    if (e.currentTarget.id === "0") {
        currentSquare.innerHTML = rook
    }

    else if (e.currentTarget.id === "1") {
        currentSquare.innerHTML = knight
    }

    else if (e.currentTarget.id === "2") {
        currentSquare.innerHTML = bishop
    }

    else if (e.currentTarget.id === "3") {
        currentSquare.innerHTML = queen
    }

    currentSquare.firstChild.setAttribute('draggable', true)
    currentSquare.firstChild.firstChild.classList.add(playerGo)

    promotionChoices.innerHTML = ""
    promotion = false
    changePlayer()
}


function checkPawnPosition(id) {
    let lastMove
    let listOfIds = [33,34,35,36,37,38]

    if (allMoves.length > 0) {

        lastMove = allMoves[allMoves.length-1]

        if (draggedElement.id === "pawn" && lastMove.piece === "pawn" && lastMove.color === opponentGo) {

            //Case 1: edge cases

            if (Number(id) === 32) {
                if (lastMove.finalSquareId === Number(id) + 1 && lastMove.initialSquareId === lastMove.finalSquareId + (2 * width)) {

                    if ((width * width) - 1 - Number(targetSquare.getAttribute('square-id')) === lastMove.finalSquareId + 8) {

                        return true
                    }

                }
            }

            else if (Number(id) === 39) {
                if (lastMove.finalSquareId === Number(id) - 1 && lastMove.initialSquareId === lastMove.finalSquareId + (2 * width)) {
                    if ((width * width) - 1 - Number(targetSquare.getAttribute('square-id')) === lastMove.finalSquareId + 8) {

                        return true
                    }
                }
            }

            // Case 2: all other cases

            else if (listOfIds.includes(Number(id))) {
                if (lastMove.finalSquareId === Number(id) - 1 && lastMove.initialSquareId === lastMove.finalSquareId + (2 * width) || lastMove.finalSquareId === Number(id) + 1 && lastMove.initialSquareId === lastMove.finalSquareId + (2 * width)) {
                    if ((width * width) - 1 - Number(targetSquare.getAttribute('square-id')) === lastMove.finalSquareId + 8) {

                        return true
                    }
                }
            }

        }

    }

    return false

}


function enPassant(squareOriginal, squareTarget) {
    squareOriginal.innerHTML = ""
    squareTarget.append(draggedElement)
    let squareRemovePawn = document.querySelector(`[square-id="${Number(squareTarget.getAttribute("square-id")) + 8}"]`)
    squareRemovePawn.innerHTML = ""
    changePlayer()
}




