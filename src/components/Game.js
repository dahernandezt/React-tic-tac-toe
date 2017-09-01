import React from 'react';
import './game.css';
import Board from './Board';

class Game extends React.Component {
    constructor() {
      super();
      this.state = {
        history: [
          {
            squares: Array(9).fill(null)
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        movesDescending: false,
        winners: [],
        winnerPlayer: null,
        showWinner:false
      };
    }

    calculateWinner(squares) {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ];
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return {winners:lines[i], winnerPlayer:squares[a]};
        }
      }
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(this.state.showWinner || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      const winnerState = this.calculateWinner(squares);
      const newState = {
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        winners: [],
        winnerPlayer: null,
        showWinner:false
      };

      if (winnerState) {
        newState.winnerPlayer = winnerState.winnerPlayer;
        newState.winners = winnerState.winners;
        newState.showWinner = true;
      } 

      this.setState(newState);
    }
  
    jumpTo(step) {
      let newState = {
        stepNumber: step,
        xIsNext: (step % 2) === 0
      };
      newState.showWinner = (step === this.state.history.length-1);
      this.setState(newState);
    }

    onClickToggleOrder(){
      const newOrder = !this.state.movesDescending;
      this.setState({movesDescending:newOrder});
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = this.state.winnerPlayer;
      let moves = history.map((step, move) => {
      const desc = move ? "Move #" + move : "Game start";
      const moveClassName = (move === this.state.stepNumber) ? "selected" : "";
        return (
          <li key={move}>
            <a className={moveClassName} href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
          </li>
        );
      });

      if(this.state.movesDescending){
        moves = moves.reverse();
      }
  
      let status;
      if (winner && this.state.showWinner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              winners={this.state.showWinner ? this.state.winners : []}
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            <button onClick={this.onClickToggleOrder.bind(this)}>&#8593;&#8595;</button>
          </div>
        </div>
      );
    }
  }

  export default Game;