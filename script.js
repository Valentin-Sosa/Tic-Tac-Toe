function display()
{
    const startButton = document.getElementById("start-btn");
    const modal = document.getElementById("start-game");
    const restartModal = document.getElementById("restart-game");
    const winner = document.getElementById("winner");
    const restartBtn = document.getElementById("restart-btn")
    const newGameBtn = document.getElementById("new-game");
    const form = document.querySelector("form");
    const player1Input = document.getElementById("playerX");
    const player2Input = document.getElementById("playerO");
    const board = document.getElementById("gameboard");
    const squares = document.querySelectorAll("#gameboard > .square");
    const turn = document.getElementById("turn");
    
    const getStartButton = () => startButton;
    const getInputName1 = () => player1Input.value;
    const getInputName2 = () => player2Input.value;
    const getModal = () => modal;
    const getForm = () => form;
    const getBoard = () => board;
    const getTurn = () => turn;

    const resetSquares = () => squares.forEach(square => square.textContent = "");

    const resetGame = (player,dis,state) =>
    {
        restartModal.showModal();
        if(state === "win") winner.textContent = `The winner is ${player.getName()}!`;
        else winner.textContent = `Is a tie!`
        restartBtn.addEventListener("click", ()=>
        {
            resetSquares();
            restartModal.close();
            game(dis);
        });
        newGameBtn.addEventListener("click",()=>
        {
            turn.style.display = "none";
            startButton.style.display = "block";
            resetSquares();
            restartModal.close();
        })
    };

    return {getStartButton, getForm,getInputName1,getInputName2,getModal,getBoard,getTurn,resetGame};
}

function player(selection,playerName)
{
    const name = playerName;
    const charSelection = selection;
    const getName = () => name;
    const getSelection = () => charSelection;

    return{getName, getSelection};
}

function cell()
{
    let value = "";
    const setSelection = selection => value = selection;
    const getValue = () => value;
    return {setSelection, getValue};
}

function setGame()
{
    const dis = display();
    dis.getStartButton().addEventListener("click",()=>{
        dis.getForm().reset();
        dis.getModal().showModal();
    });
    dis.getForm().addEventListener("submit", ()=>
    {
        dis.getModal().close();
        dis.getStartButton().style.display = "none";
        dis.getTurn().style.display = "block";
        game(dis);
    })
}

function game(dis)
{
    const player1 = player("X",dis.getInputName1());
    const player2 = player("O", dis.getInputName2());
    const gameboard = (()=>
    {
        const board = [];
        for(let i = 0; i<3; i++)
        {
            board[i]= [];
            for(let j = 0; j<3; j++)
                board[i].push(cell());
        }

        const resetBoard = () => 
        {
            for(let i = 0; i<3; i++)
            {
                for(let j = 0; j<3; j++)
                    board[i].pop();
                for(let h = 0; h<3; h++)
                    board[i].push(cell());
            }
        }

        let currentPlayer = player1;

        const switchPlayer = () => currentPlayer = currentPlayer === player1 ? player2 : player1;

        const getCurrentPlayer = () => currentPlayer;

        const setPlayerSelection = (row, column, selection) =>
        {
            if(board[row][column].getValue() === "")
            {
                board[row][column].setSelection(selection);
                return true;
            } 
            return false;
        }

        const checkTie = () =>
        {
            let valuesCounter=0;
            let boardValues = board.map((row) => row.map((cell) => cell.getValue()));
            for(let i = 0; i<3; i++)
            {
                for(let j = 0; j<3; j++)
                    if(boardValues[i][j] !== "") valuesCounter++;
            }
            if(valuesCounter === 9) return true;

            return false;
        }

        const checkWinner = player => 
        {
            const selection = player.getSelection();
            let boardValues = board.map((row) => row.map((cell) => cell.getValue()));
            for(let i = 0; i<3; i++)
            {
                if(boardValues[i][0] === selection && boardValues[i][1] === selection && boardValues[i][2] === selection) return true;
                else if(boardValues[0][i] === selection && boardValues[1][i] === selection && boardValues[2][i] === selection) return true;
            }
            if(boardValues[0][0] === selection && boardValues[1][1] === selection && boardValues[2][2] === selection||
            boardValues[0][2] === selection && boardValues[1][1] === selection && boardValues[2][0] === selection) return true;

            return false;
        }
        
        return {setPlayerSelection, resetBoard, checkTie,checkWinner,switchPlayer,getCurrentPlayer};
    })();



    dis.getTurn().textContent = `Is the turn of ${gameboard.getCurrentPlayer().getName()}`;
    dis.getBoard().addEventListener("click", e =>
    {
        const currentPlayer = gameboard.getCurrentPlayer();
        if(gameboard.setPlayerSelection(e.target.dataset.row, e.target.dataset.column, currentPlayer.getSelection()))
            e.target.textContent = currentPlayer.getSelection();
        else return;
        
        if(gameboard.checkWinner(currentPlayer)) 
        {
            gameboard.resetBoard();
            dis.resetGame(currentPlayer, dis,"win");
        }
        else if(gameboard.checkTie())
        {
            gameboard.resetBoard();
            dis.resetGame(currentPlayer, dis,"tie");
        } 
        else 
        {
            gameboard.switchPlayer();
            dis.getTurn().textContent = `Is the turn of ${gameboard.getCurrentPlayer().getName()}`;
        }
    });
}

setGame();
