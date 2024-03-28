import {React, useState} from 'react';
import './Game.css';
import playerA from '../images/logo192.png';
import playerB from '../images/arrer.png';

const Player = (props) => {
    return (
        <div className="Player">
            <img src={props.playerType} alt='playerImg' className='playerImage'/>
        </div>
    );
}

const Square = (props) => {
    let player = null;
    if (props.x === props.positionA[0] && props.y === props.positionA[1]) {
        player = <Player playerType={playerA}/>;
    } else if (props.x === props.positionB[0] && props.y === props.positionB[1]) {
        player = <Player playerType={playerB}/>;
    }

    return (
        <div className="Square">
            {player}
        </div> 
    );
}

const SquareRow = (props) => {
    const squares = Array(9).fill(0);

    const row = squares.map((square, x) => {
        return <Square x={x} y={props.y} positionA={props.positionA} positionB={props.positionB}/>;
    });

    return (
        <div className="SquareRow">
            {row}
        </div>
    );
}

const Board = (props) => {
    const rows = Array(props.boardSize[1]).fill(0);

    let board = rows.map((row, y) => {
        return <SquareRow y={y} positionA={props.positionA} positionB={props.positionB}/>;
    });

    return (
        <div className="Board">
            {board}
        </div>
    );
}

function manageTurn(step, turn, setStep, setTurn) {
    if (step < 3) {
        setStep(step + 1);
    }
    if (step === 2) {
        setStep(0);
        setTurn(!turn);
    }
}

function attack(step, turn, positionA, positionB, setWinner) {
    if (step < 3) {
        if (turn === true && positionA[0] === positionB[0]-1 && positionA[1]-positionB[1] < 2 && positionA[1]-positionB[1] > -2) {
            setWinner('Player A');
        } else if (turn === false && positionB[0] === positionA[0]+1 && positionB[1]-positionA[1] < 2 && positionB[1]-positionA[1] > -2) {
            setWinner('Player B');
        }
    }
}

function Game() {
    const [positionA, setPositionA] = useState([0, 4]);
    const [positionB, setPositionB] = useState([8, 4]);
    const [boardSize, setBoardSize] = useState([9, 9]);
    const [turn, setTurn] = useState(true);
    const [step, setStep] = useState(0);
    const [winner, setWinner] = useState(null);

    const handleKeyDown = (event) => {

        if (event.key === 'ArrowUp') {
            if (turn === true && positionA[1] >= 1) {
                setPositionA([positionA[0], positionA[1] - 1]);
                manageTurn(step, turn, setStep, setTurn);

            } else if (turn === false && positionB[1] >= 1){
                setPositionB([positionB[0], positionB[1] - 1]);
                manageTurn(step, turn, setStep, setTurn);
            }
        }

        if (event.key === 'ArrowDown') {
            if (turn === true && positionA[1] <= boardSize[1] - 2) {
                setPositionA([positionA[0], positionA[1] + 1]);
                manageTurn(step, turn, setStep, setTurn);

            } else if (turn === false && positionB[1] <= boardSize[1] - 2){
                setPositionB([positionB[0], positionB[1] + 1]);
                manageTurn(step, turn, setStep, setTurn);
            }
        }

        if (event.key === 'ArrowLeft') {
            if (turn === true && positionA[0] >= 1) {
                setPositionA([positionA[0] - 1, positionA[1]]);
                manageTurn(step, turn, setStep, setTurn);

            } else if (turn === false && positionB[0] >= 1){
                setPositionB([positionB[0] - 1, positionB[1]]);
                manageTurn(step, turn, setStep, setTurn);
            }
        }

        if (event.key === 'ArrowRight') {
            if (turn === true && positionA[0] <= boardSize[0] - 2) {
                setPositionA([positionA[0] + 1, positionA[1]]);
                manageTurn(step, turn, setStep, setTurn);

            } else if (turn === false && positionB[0] <= boardSize[0] - 2){
                setPositionB([positionB[0] + 1, positionB[1]]);
                manageTurn(step, turn, setStep, setTurn);
            }
        }

        if (event.key === 'Enter') {
            attack(step, turn, positionA, positionB, setWinner);
        }
    };

    return (
        <div className="Game" tabIndex={0} onKeyDown={handleKeyDown}>
            <Board boardSize={boardSize} positionA={positionA} positionB={positionB}/>
            <h1>{winner}</h1>
        </div>
    );
}

export default Game;