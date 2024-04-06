import {React, useState, useEffect} from 'react';
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
    const squares = Array(props.boardSize[0]).fill(0);

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
        return <SquareRow y={y} positionA={props.positionA} positionB={props.positionB} boardSize={props.boardSize}/>;
    });

    return (
        <div className="Board">
            {board}
        </div>
    );
}

function manageTurn(step, turn, setStep, setTurn) {
    setTurn(!turn);
}

function attack(attackerName, attackerPosition, enemyPosition, attackEreaX, attackEreaY, setWinner, enemyHp, setEnemyHp, turn, setTurn, damage = 1) {
    if ((attackerPosition[0] - enemyPosition[0] >= -attackEreaX && attackerPosition[0] - enemyPosition[0] <= attackEreaX)
        && attackerPosition[1]-enemyPosition[1] <= attackEreaY
        && attackerPosition[1]-enemyPosition[1] >= -attackEreaY) {
        
        if (attackerName === 'A' && turn === true) {
            setEnemyHp(enemyHp - damage);
            setTurn(!turn);
        } else if (attackerName === 'B' && turn === false) {
            setEnemyHp(enemyHp - damage);
            setTurn(!turn);
        }
    }
}



function Game() {
    const [positionA, setPositionA] = useState([0, 4]);
    const [positionB, setPositionB] = useState([9, 4]);
    const [boardSize, setBoardSize] = useState([10, 9]);
    const [turn, setTurn] = useState(true);
    const [step, setStep] = useState(0);
    const [hpA, setHpA] = useState(6);
    const [hpB, setHpB] = useState(6);
    const [defenceA, setDefenceA] = useState(false);
    const [defenceB, setDefenceB] = useState(false);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        if (hpA <= 0) {
            setWinner('Player B');
        } else if (hpB <= 0) {
            setWinner('Player A');
        }
    }, [hpA, hpB]);

    useEffect(() => {
        if (turn === true) {
            setDefenceA(false);
        } else {
            setDefenceB(false);
        }
    }, [turn]);

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
            attack(step, turn, positionA, positionB, setWinner, hpA, hpB, setHpA, setHpB);
            manageTurn(step, turn, setStep, setTurn);
        }
    };

    return (
        <div className="Game" tabIndex={0} onKeyDown={handleKeyDown}>
            <div className="state A">
                <h1>{winner}</h1>
                <p>{turn ? 'My' : 'Enemy\'s'} Turn</p>
                <p>Player A's HP: {hpA}</p>
                <button onClick={() => attack('A', positionA, positionB, 1, 1, setWinner, hpB, setHpB, turn, setTurn, 2)}>攻撃</button>
                <button onClick={() => attack('A', positionA, positionB, 2, 1, setWinner, hpB, setHpB, turn, setTurn, 1)}>たま</button>
                <button onClick={() => manageTurn(step, turn, setStep, setTurn)}>ようすみ</button>
            </div>

            <Board boardSize={boardSize} positionA={positionA} positionB={positionB}/>

            <div className="state B">
                <h1>{winner}</h1>
                <p>{turn ? 'Enemy\'s' : 'My'} Turn</p>
                <p>Player B's HP: {hpB}</p>
                <button onClick={() => attack('B', positionB, positionA, 1, 1, setWinner, hpA, setHpA, turn, setTurn, 2)}>攻撃</button>
                <button onClick={() => attack('B', positionB, positionA, 2, 1, setWinner, hpA, setHpA, turn, setTurn, 1)}>たま</button>
                <button onClick={() => manageTurn(step, turn, setStep, setTurn)}>ようすみ</button>
            </div>
        </div>
    );
}

export default Game;