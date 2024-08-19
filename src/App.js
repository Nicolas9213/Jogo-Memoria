import { useEffect, useState } from 'react';
import './App.css';

export default function Memoria({ changeScreen, jogador1, jogador2 }) {
    const [clicks, setClicks] = useState(0);
    const [indexes, setIndexes] = useState([]);
    const [jogador, setJogador] = useState(jogador1);
    const [pares, setPares] = useState([0, 0]);

    const voltar = () => {
        changeScreen("homeVelha");
    }

    const generateGame = () => {
        const emojis = ["🧬", "🐒", "🦋", "🌱", "🦴", "🧠", "🌳", "🦒", "🦕", "🦖", "🦠", "👤",
                        "🧬", "🐒", "🦋", "🌱", "🦴", "🧠", "🌳", "🦒", "🦕", "🦖", "🦠", "👤"];

        const game = [
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""]
        ];

        game.forEach((row) => {
            for (let i = 0; i < 4; i++) {
                let index = Math.floor(Math.random() * emojis.length);
                row[i] = emojis[index];
                emojis.splice(index, 1);
            }
        });

        return game;
    }

    const [game, setGame] = useState([...generateGame()]);

    const [showedGame, setShowedGame] = useState([
        [{ val: "", player: "" }, { val: "", player: "" }, { val: "", player: "" }, { val: "", player: "" }],
        [{ val: "", player: "" }, { val: "", player: "" }, { val: "", player: "" }, { val: "", player: "" }],
        [{ val: "", player: "" }, { val: "", player: "" }, { val: "", player: "" }, { val: "", player: "" }],
        [{ val: "", player: "" }, { val: "", player: "" }, { val: "", player: "" }, { val: "", player: "" }],
        [{ val: "", player: "" }, { val: "", player: "" }, { val: "", player: "" }, { val: "", player: "" }],
        [{ val: "", player: "" }, { val: "", player: "" }, { val: "", player: "" }, { val: "", player: "" }]
    ]);

    useEffect(() => {
        checkWin();
    }, [showedGame]);

    const play = (row, col) => {
        let showedGameTmp = showedGame.map(row => row.map(cell => ({ ...cell })));

        let amountClicks = clicks;
        let clickIndexes = [...indexes];
        let paresTmp = [...pares];
        let gameTmp = [...game];

        if (amountClicks === 0) {
            setIndexes([row, col]);
            showedGameTmp[row][col].val = gameTmp[row][col];
        } else if (amountClicks === 1 && gameTmp[clickIndexes[0]][clickIndexes[1]] === gameTmp[row][col]) {
            showedGameTmp[row][col].val = gameTmp[row][col];
            showedGameTmp[clickIndexes[0]][clickIndexes[1]].player = jogador;
            showedGameTmp[row][col].player = jogador;

            jogador === jogador1 ? ++paresTmp[0] : ++paresTmp[1];
            setIndexes([]);
            amountClicks = -1;
        } else {
            setTimeout(() => {
                showedGameTmp[clickIndexes[0]][clickIndexes[1]].val = "";
                showedGameTmp[row][col].val = "";
                setShowedGame([...showedGameTmp]);
            }, 1000);

            showedGameTmp[row][col].val = gameTmp[row][col];
            setIndexes([]);
            amountClicks = -1;
            setJogador(jogador === jogador1 ? jogador2 : jogador1);
        }

        setPares([...paresTmp]);
        setShowedGame([...showedGameTmp]);
        ++amountClicks;
        setClicks(amountClicks);
    }

    const checkWin = () => {
        let temGanhador = true;
        showedGame.forEach(row => {
            row.forEach(card => {
                if (card.val === "") {
                    temGanhador = false;
                }
            });
        });
        if (temGanhador) {
            setTimeout(() => { definirGanhador(); }, 10);
        }
    }

    const definirGanhador = () => {
        if (pares[0] > pares[1]) {
            alert(`${jogador1} ganhou!`);
        } else {
            alert(`${jogador2} ganhou!`);
        }
        changeScreen("home");
    }

    return (
        <div className="container">
            <h1 className="title">Jogo da Memória - Evolução</h1>
            <p className="jogador1">Jogador 1: {pares[0]}</p>
            <p className="jogador2">Jogador2: {pares[1]}</p>
            <div>
                {showedGame.map((row, indexRow) => (
                    <div className="row" key={indexRow}>
                        {row.map((column, indexColumn) => (
                            <button
                                key={`${indexRow},${indexColumn}`}
                                onClick={() => play(indexRow, indexColumn)}
                                disabled={column.val !== ""}
                                className={`card-game ${column.val !== "" ? (column.player !== "" ? (column.player === jogador1 ? 'card-game-jog1' : 'card-game-jog2') : 'card-game-disabled') : ''}`}
                            >
                                <span className="card-game-font">{column.val}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            <button className="voltar" onClick={voltar}>Voltar</button>
        </div>
    )
}
