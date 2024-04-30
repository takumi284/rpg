import {React, useState, useEffect} from 'react';
import './Game.css';
import playerA from '../images/logo192.png';
import playerB from '../images/arrer.png';

const MOVE_UP_ID = 0;
const MOVE_DOWN_ID = 1;
const MOVE_LEFT_ID = 2;
const MOVE_RIGHT_ID = 3;
const DEFENCE_ID = 4;
const ATTACK_ID = 5;
const TAMA_ID = 6;
const NO_ATTACK_EREA = [0, 0, 0];
const ATTACK_EREA = [1, 1, 2];
const TAMA_EREA = [2, 1, 1];
const STYLE_LIGHT = {backgroundColor: '#a9a9a9'};
const STYLE_DARK = {backgroundColor: '#f0f0f0'};

function manageTurn(turn, setTurn, firstTurn, setFirstTurn) {
    if (turn === true && firstTurn === true) {
        setTurn(!turn);
    } else if (turn === false && firstTurn === false) {
        setTurn(!turn);
    } else if (turn === false && firstTurn === true) {
        alert('行動を解決します');
        // processBooks(books, setBooks, positionA, setPositionA, positionB, setPositionB, setAttackEreaA, setAttackEreaB, defenceA, setDefenceA, defenceB, setDefenceB);
        setFirstTurn(!firstTurn);
    } else if (turn === true && firstTurn === false) {
        alert('行動を解決します');
        // processBooks(books, setBooks, positionB, setPositionB, positionA, setPositionA, setAttackEreaB, setAttackEreaA, defenceB, setDefenceB, defenceA, setDefenceA);
        setFirstTurn(!firstTurn);
    }
}

function inAttackErea(myPosition, attackerPosition, attackErea) {
    if (myPosition[0] <= attackerPosition[0] + attackErea[0] && myPosition[0] >= attackerPosition[0] - attackErea[0]
        && myPosition[1] <= attackerPosition[1] + attackErea[1] && myPosition[1] >= attackerPosition[1] - attackErea[1]) {
        
        return true;
    }
    return false;
}

function move(position, setPosition, moveId) {
    if (moveId === MOVE_UP_ID) {
        setPosition([position[0], position[1] - 1]);
    } else if (moveId === MOVE_DOWN_ID) {
        setPosition([position[0], position[1] + 1]);
    } else if (moveId === MOVE_LEFT_ID) {
        setPosition([position[0] - 1, position[1]]);
    } else if (moveId === MOVE_RIGHT_ID) {
        setPosition([position[0] + 1, position[1]]);
    }
}

function bookAction(turn, firstTurn, books, setBooks, actionId) {
    if (turn === true && firstTurn === true || turn === false && firstTurn === false) {
        setBooks([actionId, books[1]]);
    } else if (turn === true && firstTurn === false || turn === false && firstTurn === true) {
        setBooks([books[0], actionId]);
    }
}

function bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, actionId) {
    bookAction(turn, firstTurn, books, setBooks, actionId);
    manageTurn(turn, setTurn, firstTurn, setFirstTurn);
}

function processBooks(books, setBooks, positionFirst, setPositionFirst, positionSecond, setPositionSecond, setAttackEreaFirst, setAttackEreaSecond, defenceFirst,setDefenceFirst, defenceSecond,setDefenceSecond) {
    const bookFirst = books[0];
    const bookSecond = books[1];
    
    move(positionFirst, setPositionFirst, bookFirst);
    move(positionSecond, setPositionSecond, bookSecond);

    if (bookFirst === DEFENCE_ID) {
        setDefenceFirst(true);
    }

    if (bookSecond === DEFENCE_ID) {
        setDefenceSecond(true);
    }

    if (bookFirst === ATTACK_ID && bookSecond === ATTACK_ID && inAttackErea(positionSecond, positionFirst, ATTACK_EREA)) {
        setAttackEreaFirst(ATTACK_EREA);
        return;
    }
    if (bookFirst === ATTACK_ID) {
        if (defenceSecond === true && inAttackErea(positionSecond, positionFirst, ATTACK_EREA)) {
            return;
        } else {
            setAttackEreaFirst(ATTACK_EREA);
        }
    }
    if (bookSecond === ATTACK_ID) {
        if (defenceFirst === true && inAttackErea(positionFirst, positionSecond, ATTACK_EREA)) {
            return;
        } else {
            setAttackEreaSecond(ATTACK_EREA);
        }
    }

    if (bookFirst === TAMA_ID && bookSecond === TAMA_ID && inAttackErea(positionFirst, positionSecond, TAMA_EREA)) {
        return;
    }
    if (bookFirst === TAMA_ID) {
        if (defenceSecond === true && inAttackErea(positionSecond, positionFirst, TAMA_EREA)) {
            return;
        } else {
            setAttackEreaFirst(TAMA_EREA);
        }
    }
    if (bookSecond === TAMA_ID) {
        if (defenceFirst === true && inAttackErea(positionFirst, positionSecond, TAMA_EREA)) {
            return;
        } else {
            setAttackEreaSecond(TAMA_EREA);
        }
    }
}

const Player = (props) => {
    if (props.attackedDamage > 0) {
        props.setHp(props.hp - props.attackedDamage);
        props.setAttackErea([props.attackErea[0], props.attackErea[1], 0]);
    }
    return (
        <div className="Player">
            <img src={props.playerType} alt='playerImg' className='playerImage'/>
        </div>
    );
}

const Square = (props) => {
    let stl = null;
    let attackDamageByA = 0;
    let attackDamageByB = 0;

    if (inAttackErea([props.x, props.y], props.positionA, props.attackEreaA) && inAttackErea([props.x, props.y], props.positionB, props.attackEreaB)) { 
        stl = {backgroundColor: 'purple'};
    } else if (inAttackErea([props.x, props.y], props.positionA, props.attackEreaA)) {
        attackDamageByA = props.attackEreaA[2];
        stl = {backgroundColor: 'red'};
    } else if (inAttackErea([props.x, props.y], props.positionB, props.attackEreaB)) {
        attackDamageByB = props.attackEreaB[2];
        stl = {backgroundColor: 'blue'};
    }

    let player = null;
    if (props.x === props.positionA[0] && props.y === props.positionA[1]) {

        player = <Player playerType={playerA} myPosition={props.positionA}
                    attackedDamage={attackDamageByB}
                    attackErea={props.attackEreaB} setAttackErea={props.setAttackEreaB}
                    hp={props.hpA} setHp={props.setHpA}/>;

    } else if (props.x === props.positionB[0] && props.y === props.positionB[1]) {

        player = <Player playerType={playerB} myPosition={props.positionB}
                    attackedDamage={attackDamageByA}
                    attackErea={props.attackEreaA} setAttackErea={props.setAttackEreaA}
                    hp={props.hpB} setHp={props.setHpB}/>;
    }

    return (
        <div className="Square" style={stl}>
            {player}
        </div> 
    );
}

const SquareRow = (props) => {
    const squares = Array(props.boardSize[0]).fill(0);

    const row = squares.map((square, x) => {
        return <Square x={x} y={props.y} positionA={props.positionA} positionB={props.positionB}
                attackEreaA={props.attackEreaA} attackEreaB={props.attackEreaB}
                setAttackEreaA={props.setAttackEreaA} setAttackEreaB={props.setAttackEreaB}
                hpA={props.hpA} setHpA={props.setHpA} hpB={props.hpB} setHpB={props.setHpB}/>;
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
        return <SquareRow y={y} positionA={props.positionA} positionB={props.positionB} boardSize={props.boardSize}
                attackEreaA={props.attackEreaA} attackEreaB={props.attackEreaB}
                setAttackEreaA={props.setAttackEreaA} setAttackEreaB={props.setAttackEreaB}
                hpA={props.hpA} setHpA={props.setHpA} hpB={props.hpB} setHpB={props.setHpB}/>;
    });

    return (
        <div className="Board">
            {board}
        </div>
    );
}

function Game() {
    const [positionA, setPositionA] = useState([0, 4]);
    const [positionB, setPositionB] = useState([9, 4]);
    const [boardSize, setBoardSize] = useState([10, 9]);
    const [turn, setTurn] = useState(true);
    const [firstTurn, setFirstTurn] = useState(true);
    const [step, setStep] = useState(0);
    const [hpA, setHpA] = useState(6);
    const [hpB, setHpB] = useState(6);
    const [attackEreaA, setAttackEreaA] = useState(NO_ATTACK_EREA);
    const [attackEreaB, setAttackEreaB] = useState(NO_ATTACK_EREA);
    const [defenceA, setDefenceA] = useState(false);
    const [defenceB, setDefenceB] = useState(false);
    const [books, setBooks] = useState([-1, -1]);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        if (hpA <= 0) {
            setWinner('Player B');
        } else if (hpB <= 0) {
            setWinner('Player A');
        }
    }, [hpA, hpB]);


    useEffect(() => {
        setDefenceA(false);
        setDefenceB(false);
        setAttackEreaA(NO_ATTACK_EREA);
        setAttackEreaB(NO_ATTACK_EREA);

        if (firstTurn === false){
            processBooks(books, setBooks, positionA, setPositionA, positionB, setPositionB,
                setAttackEreaA, setAttackEreaB, defenceA, setDefenceA, defenceB, setDefenceB);
        } else {
            processBooks(books, setBooks, positionB, setPositionB, positionA, setPositionA,
                setAttackEreaB, setAttackEreaA, defenceB, setDefenceB, defenceA, setDefenceA);
        }
    }, [firstTurn]);

    const handleKeyDown = (event) => {

        if (event.key === 'ArrowUp') {
            if (turn === true && positionA[1] >= 1) {
                bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, MOVE_UP_ID);

            } else if (turn === false && positionB[1] >= 1){
                bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, MOVE_UP_ID);
            }
        }

        if (event.key === 'ArrowDown') {
            if (turn === true && positionA[1] <= boardSize[1] - 2) {
                bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, MOVE_DOWN_ID);

            } else if (turn === false && positionB[1] <= boardSize[1] - 2){
                bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, MOVE_DOWN_ID);
            }
        }

        if (event.key === 'ArrowLeft') {
            if (turn === true && positionA[0] >= 1) {
                bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, MOVE_LEFT_ID);

            } else if (turn === false && positionB[0] >= 1){
                bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, MOVE_LEFT_ID);
            }
        }

        if (event.key === 'ArrowRight') {
            if (turn === true && positionA[0] <= boardSize[0] - 2) {
                bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, MOVE_RIGHT_ID);

            } else if (turn === false && positionB[0] <= boardSize[0] - 2){
                bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, MOVE_RIGHT_ID);
            }
        }
    };

    return (
        <div className="Game" tabIndex={0} onKeyDown={handleKeyDown}>
            <div className="state A" style={turn ? STYLE_LIGHT : STYLE_DARK}>
                <h1>{winner}</h1>
                <p>{turn ? 'My' : 'Enemy\'s'} Turn</p>
                <p>Player A's HP: {hpA}</p>
                <button onClick={() => bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, ATTACK_ID)}>攻撃</button>

                <button onClick={() => bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, TAMA_ID)}>たま</button>

                <button onClick={() => bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, DEFENCE_ID)}>ガード</button>
            </div>

            <Board boardSize={boardSize} positionA={positionA} positionB={positionB} 
                    attackEreaA={attackEreaA} attackEreaB={attackEreaB}
                    setAttackEreaA={setAttackEreaA} setAttackEreaB={setAttackEreaB}
                    hpA={hpA} setHpA={setHpA} hpB={hpB} setHpB={setHpB}/>
            
            {books[0]}{books[1]}

            <div className="state B" style={turn ? STYLE_DARK : STYLE_LIGHT}>
                <h1>{winner}</h1>
                <p>{turn ? 'Enemy\'s' : 'My'} Turn</p>
                <p>Player B's HP: {hpB}</p>
                <button onClick={() => bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, ATTACK_ID)}>攻撃</button>

                <button onClick={() => bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, TAMA_ID)}>たま</button>

                <button onClick={() => bookAndManageTurn(turn, setTurn, firstTurn, setFirstTurn, books, setBooks, DEFENCE_ID)}>ガード</button>
            </div>
        </div>
    );
}

export default Game;