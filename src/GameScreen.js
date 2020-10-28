import React from 'react';
const dictionary = require('./data/dictionary.json');

class Game extends React.Component {

	constructor(props) {
		super(props);
		console.log(this.props.level);
		this.intervals = false;
		this.gameStarted = false;
		this.progressTimer = false;
		this.state = {
			'level' : this.props.level,
			'wordList': {
				'EASY' : [],
				'MEDIUM' : [],
				'HARD' : []
			},
			'EASY': 1,
			'MEDIUM': 1.5,
			'HARD': 2,
			'wordToDisplay': '',
			'wordCountDisplay' : 0,
			'wordTimerValue': 0,
			'gameFinished' : false,
			'intervals' : false,
			'timeFinished' : false,
			'allGames': [],
			'gameStopped' : false
		}

		this.wordList = this.wordList.bind(this);
		this.displayWord = this.displayWord.bind(this);
		this.updateWordTimerValue = this.updateWordTimerValue.bind(this);
		this.updateDiffFactor = this.updateDiffFactor.bind(this);
		this.updateLevel = this.updateLevel.bind(this);
		this.triggerTimerEvent = this.triggerTimerEvent.bind(this);
		this.onWordWrite = this.onWordWrite.bind(this);
		this.insertGame = this.insertGame.bind(this);
		this.addLastGameScore = this.addLastGameScore.bind(this);
		this.playAgain = this.playAgain.bind(this);
		this.stopGame = this.stopGame.bind(this);
		this.updateProgress = this.updateProgress.bind(this);
	}

	async componentDidMount() {

		let ref = this;
		await ref.wordList();
		ref.insertGame();
		setTimeout(function() {			
			ref.displayWord();
		}, 2000);

		document.getElementById('typedWord').autofocus = true;
	}

	updateProgress() {

		let ref = this;
		var timeleft = this.state.wordTimerValue;
		this.progressTimer = setInterval(function(){
			if(timeleft <= 0){
				clearInterval(ref.progressTimer);
			}
			let el = document.getElementById("progressBar");

			if( el ) {
				el.value = ref.state.wordTimerValue - timeleft;
				timeleft -= .2;
			}

		}, 200);
	}

	quitGame(e) {
		e.preventDefault();
		sessionStorage.clear();
		window.location.reload();
	}

	stopGame(e) {
		e.preventDefault();
		this.setState({
			gameStopped: true
		})
		this.onWordWrite();
	}

	async playAgain(e) {
		e.preventDefault();

		this.setState({
			gameFinished: false
		});

		this.insertGame();

		await this.wordList();
		this.displayWord();

		document.getElementById('typedWord').autofocus = true;

	}

	insertGame() {

		let gameName = 'Game ' + (this.state.allGames.length + 1);
		let allGames = this.state.allGames;

		allGames.push({
			name: gameName,
			score: 0
		})

		this.setState({
			allGames: allGames
		})
	}

	addLastGameScore(score) {

		score = score/1000;

		let allGames = this.state.allGames;
		score = Number(score) + Number(allGames[(allGames.length - 1)].score);
		console.log(score);
		allGames[(allGames.length - 1)].score = score.toFixed(2);
		this.setState({

			allGames: allGames

		})
	}

	onWordWrite(e) {

		let now = new Date().getTime();

		if( e ) {

			let enteredValue = e.target.value;

			if( enteredValue && enteredValue.length > 0 ) {

				if( this.state.timeFinished ) {

					this.setState({
						gameFinished: true
					});

				} else {
					if( enteredValue === this.state.wordToDisplay ) {

						e.target.value = '';

						let gameScore = now - this.gameStarted;
						this.addLastGameScore(gameScore);

						clearTimeout(this.intervals);
						clearInterval(this.progressTimer);
						this.displayWord();
					}
				}
			}
		} else {
			clearInterval(this.progressTimer);
			clearTimeout(this.intervals);
			this.setState({
				gameFinished: true
			});
		}
	}	

	triggerTimerEvent() {

		this.gameStarted = new Date().getTime();

		let ref = this;
		this.intervals = setTimeout(function() {
			ref.onWordWrite();
			ref.setState({
				'timeFinished' : true
			})
		}, (this.state.wordTimerValue < 2 ? 2 : this.state.wordTimerValue) * 1000);
	}

	updateLevel() {

		if( this.state.level === 'EASY' ) {
			if( this.state[this.state.level] >= 1.5 ) {
				this.setState({
					'level' : 'MEDIUM',
					'wordTimerValue' : 0,
				})
			}
		} else if( this.state.level === 'MEDIUM' ) {
			if( this.state[this.state.level] >= 2 ) {
				this.setState({
					'level' : 'HARD',
					'wordTimerValue' : 0,
				})
			}
		} else if( this.state.level === 'HARD' ) {
			if( this.state[this.state.level] >= 2.5 ) {
				this.setState({
					'gameFinished' : true,
					'wordTimerValue' : 0,
				})
			}
		}
	}

	updateDiffFactor() {

		this.setState({
			[this.state.level]: (this.state[this.state.level] + 0.01)
		}, () => {
			this.updateLevel();
		})
		
	}

	updateWordTimerValue() {

		let ref = this;

		let newTimerValue = (this.state.wordToDisplay.length) / this.state[this.state.level];
		newTimerValue = newTimerValue < 2 ? 2 : newTimerValue;

		this.setState({
			wordTimerValue: newTimerValue.toFixed(2)
		}, () => {
			ref.updateProgress();
			ref.updateDiffFactor();
		})
	}

	displayWord() {
		this.setState({
			wordToDisplay: this.state.wordList[this.state.level][this.state.wordCountDisplay],
			wordCountDisplay: this.state.wordCountDisplay + 1,
			timeFinished: false
		}, () => {
			this.updateWordTimerValue();
			this.triggerTimerEvent();
		})
	}

	async wordList() {

		return new Promise((resolve, reject) => {
			let easyWordList = [], mediumWordList = [], hardWordList = [];

			for( let word of dictionary ) {

				if( easyWordList.length >= 60 && mediumWordList.length >= 60 && hardWordList.length >= 60 ) {
					break;
				}

				if( word.length <= 4 ) {
					easyWordList.push(word);
				} else if( word.length >= 5 && word.length <= 8 ) {
					mediumWordList.push(word);
				} else {
					hardWordList.push( word );
				}
			}

			this.setState({
				wordList: {
					'EASY' : easyWordList.sort( () => .5 - Math.random()),
					'MEDIUM' : mediumWordList.sort( () => .5 - Math.random()),
					'HARD' : hardWordList.sort( () => .5 - Math.random())
				}
			}, () => {
				resolve(true);
			})
		})		
	}

	render() {
		return(
			<div className="gamescreen">

				<div className="playerInfo">
					<h2>Name: {sessionStorage.playerName}</h2>
					<h2>Level: {this.state.level}</h2>
				</div>

				<div className="scoreBoard">

					<h4>Score Board</h4>

					<table className="gamescores">
						<thead>
							<tr>
								<th>Game No.</th>
								<th>Score</th>
							</tr>
						</thead>
						<tbody>
						{this.state.allGames.map( (games, index) => (

							<tr key={index}>
								<td>{games.name}</td>
								<td>{games.score}</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>

				{this.state.gameFinished === true ? (

					<div className='gameFinishedBlock'>

						<h2>Score: {this.state.allGames[this.state.allGames.length-1].score}</h2>

						<p><button onClick={(e) => this.playAgain(e)}>Play Again.</button></p>
					</div>
				) : 
					<div className="wordBox">

						<progress value="0" max={this.state.wordTimerValue} id="progressBar"></progress>

						<p>Time to Complete: {this.state.wordTimerValue}</p>

						<h2>{this.state.wordToDisplay}</h2>

						<input autoFocus="autofocus" autoComplete="off" onChange={(e) => {this.onWordWrite(e)}} type="text" id="typedWord" />
					</div>
				}

				{this.state.gameStopped === true ? (

						<p><button onClick={(e) => this.quitGame(e)}>Quit Game</button></p>

					) : (
						<p><button onClick={(e) => this.stopGame(e)}>Stop Game</button></p>
					)}
			</div>
		)
	}
}



export default Game;