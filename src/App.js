import React from 'react';
import './App.css';
import Game from './GameScreen';

class App extends React.Component {

	constructor(props) {
		super(props);

		//make it default to display auth screen
		this.state = {
			authScreen: true,
			gameScreen: false
		}

		this.startGame = this.startGame.bind(this);
	}

	componentDidMount() {

		//check if page is being rendered in same session
		if( sessionStorage.getItem('playerName') ) {
			this.setState({
				authScreen: false,
				gameScreen: true,
				level: 'EASY'
			})
		}
	}

	startGame() {

		let name = document.getElementById('playerName').value;

		if( name && name.length > 0 ) {

			let level = document.getElementById('levels').value;
			level = (level) ? level : 'EASY';

			sessionStorage.playerName = name;
			this.setState({
				authScreen: false,
				gameScreen: true,
				level: level
			})
		} else {
			alert('Please enter your name to play this game');
		}
	}

	render() {
		return (
		    <div className="App">
		    	{this.state.authScreen === true ? (
		    		<div className="authScreen">
			    		<h1>Fast Fingers </h1>
				    	<p>The Ultimate Typing Game</p>
				    	<input autoComplete="off" id='playerName' type="text" placeholder="TYPE YOUR NAME" />

				    	<div className="levels">
					    	<select data-testid="levels" name="level" id="levels">
					    		
					    		<option value="EASY">EASY</option>
					    		<option value="MEDIUM">MEDIUM</option>
					    		<option value="HARD">HARD</option>

					    	</select>
					    </div>

					    <div>
					    	<button onClick={() => this.startGame()}>START GAME</button>
					    </div>

					    <a href="http://google.com">learn react</a>
					</div>
		    	) : <Game 
		    			level={this.state.level}
		    		/> 
		    	}			    	
		    </div>
		);
	}

}

export default App;
