import React from 'react';
const dictionary = require('./data/dictionary.json');

class Game extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div className="gamescreen">
				<h1>Hello</h1>

				<div className="playerInfo">
					<h2>Name: {sessionStorage.playerName}</h2>
					<h2>Level: {this.props.level}</h2>
				</div>

				<div className="scoreBoard">

					<ul className="gamescores">
						
						<li>Game 1 : </li>
						<li>Game 2 : </li>
						<li>Game 3: </li>
						<li>Game 4: </li>
					</ul>
				</div>
			</div>
		)
	}
}



export default Game;