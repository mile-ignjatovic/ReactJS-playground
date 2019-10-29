import React, { Component } from 'react';
import classes from './main.module.css';
import axios from 'axios';
import firstAnswers from '../../data/first-answers';
import secondAnswers from '../../data/second-answers';
import missAnswersResponses from '../../data/miss-answers-responses';

class main extends Component {
	constructor() {
		super();
		// input ref so that we can target input field
		this.inputRef = React.createRef();
	}

	// app state
	state = {
		allAnswersEver: null,
		currentImg: '',
		text: '',
		input: '',
		counter: 31,
		interval: undefined,
		gameStarted: false,
		firstStepPassed: false,
		secondStepPassed: false,
		success: false,
		fail: false,
		possibleFirstAnswers: firstAnswers,
		possibleEndAnswers: secondAnswers,
		missAnswers: missAnswersResponses,
		pantsOffMessage: 'You pull your pants down...',
		successMessage: 'You didnt shit your pants!',
		failMessage: 'You shat your pants... You are such a looser...',
		startImg: require('../../assets/images/1.jpg'),
		pantsDownImg: require('../../assets/images/2.jpg'),
		shitInPantsImg: require('../../assets/images/3.jpg'),
		successMessyImg: require('../../assets/images/4.jpg'),
		successImg: require('../../assets/images/5.jpg'),
	};

	// print all answers given ever
	getAllAnswers = async () => {
		let answers = await this.getAllAnswersFromBE();
		console.log(answers);
	};

	// get the answers from be,it allready have them just return data
	getAllAnswersFromBE = async () => {
		if (!this.state.allAnswersEver) {
			let response = await axios.get('https://shit-game.firebaseio.com/userInput.json');
			this.setState({allAnswersEver: response.data})
			return response.data;
		} else {
			return this.state.allAnswersEver;
		}
	}

	// print all unique answers
	getAllUniqueAnswers= async () => {
		let answers = await this.getAllAnswersFromBE();
		console.log(this.filterForUniqueAnswers(answers));
	}

	// filter answers for uniques
	filterForUniqueAnswers = (data) => {
		const tempArray = [];
		Object.keys(data).forEach(key => {
			if (
				(data[key]['answer'] &&
					data[key]['answer'] !== '' && data[key]['answer'] !== ' ')
			) {
				tempArray.push(data[key]['answer']);
			}
		});
		const uniqueAnswersArray = tempArray.filter((value, index, self) => self.indexOf(value) === index);
		return uniqueAnswersArray
	}

	// react lifecycle hook (after page initialised)
	componentDidMount() {
		// add this component as a global variable so that we are able to acces helper functions from the console
		window.map = this;
	}

	// on input change
	handleChange = event => {
		this.setState({ input: event.target.value });
	};

	// finish game successfuly
	completeGame = () => {
		// complete screen
		// success image has 2 options
		let successImg = Math.floor(Math.random() * 1 + 1);
		this.setState({
			currentImg:
				successImg > 0
					? this.state.successImg
					: this.state.successMessyImg
		});
		// success message
		this.setState({ text: this.state.successMessage });
		// stop and clear interval
		clearInterval(this.state.interval);
		this.setState({ interval: undefined });
		// success state true
		this.setState({ success: true });
		this.setState({ fail: false });
	};

	// finish game by failing
	failGame = () => {
		// fail screen
		// fail image
		this.setState({ currentImg: this.state.shitInPantsImg });
		// fail message
		this.setState({ text: this.state.failMessage });
		// stop interval
		clearInterval(this.state.interval);
		this.setState({ interval: undefined });
		// fail state true
		this.setState({ success: false });
		this.setState({ fail: true });
	};

	// saves the answer to BE
	saveToBe = input => {
		axios
			.post('https://shit-game.firebaseio.com/userInput.json', {
				answer: input
			})
			.then(() => {});
	};

	startNewGame = () => {
		this.setState({ currentImg: this.state.startImg });
		this.setState({ text: 'You want to take a shit.' });
		this.setState({ gameStarted: true }, () => {
			if (!this.state.interval) {
				this.setState({ counter: 31 }, () => {
					this.startIntervalCountdown();
				});
			}
		});
	};

	startIntervalCountdown = () => {
		this.setState({
			interval: setInterval(() => {
				// decrease counter with each interval
				this.setState((previousState, props) => {
					return { counter: this.state.counter - 1 };
				});

				// random message
				if (this.state.counter === 4) {
					this.setState({
						text:
							'OOOOHH shit, you are going to explode!!!'
					});
				}
				// random message
				if (this.state.counter === 21) {
					this.setState({
						text: 'You feel the preasure rising!!!'
					});
				}

				if (this.state.counter === 0) {
					if (this.state.firstStepPassed) {
						this.completeGame();
						this.setState({
							text:
								'You cant hold it any more, so you just take a dump on the floor. But since you already took your pants off, its OK !'
						});
					} else {
						this.failGame();
					}
				}
			}, 1000)
		});
	}

	resetGame = () => {
		this.setState({ input: '' });
		this.setState({ text: '' });
		this.setState({ gameStarted: false });
		this.setState({ firstStepPassed: false });
		this.setState({ secondStepPassed: false });
		this.setState({ success: false });
		this.setState({ fail: false });
		clearInterval(this.state.interval);
		this.setState({ interval: undefined });
	};

	checkIfFirstStepPassed = (input) => {
		this.setState(
			{
				firstStepPassed:
					this.state.possibleFirstAnswers.indexOf(
						input
					) !== -1
						? true
						: false
			},
			() => {
				if (this.state.firstStepPassed) {
					this.setState({
						currentImg: this.state.pantsDownImg
					});
					this.setState({
						text: this.state.pantsOffMessage
					});
				}
				if (
					!this.state.firstStepPassed &&
					this.state.secondStepPassed
				) {
					this.failGame();
				}
				if (
					this.state.firstStepPassed &&
					this.state.secondStepPassed
				) {
					this.completeGame();
				}
			}
		);
	}

	checkIfSecondStepPassed = (input) => {
		this.setState(
			{
				secondStepPassed:
					this.state.possibleEndAnswers.indexOf(input) !==
					-1
						? true
						: false
			},
			() => {
				if (
					!this.state.firstStepPassed &&
					this.state.secondStepPassed
				) {
					this.failGame();
				}
				if (
					this.state.firstStepPassed &&
					this.state.secondStepPassed
				) {
					this.completeGame();
				}
			}
		);
	}

	handleKeyDownOnInput = event => {
		let input = this.state.input.toLowerCase().trim();
		if (event.key === 'Escape') {
			if (this.state.gameStarted) {
				this.resetGame();
			}
			if (this.state.success || this.state.fail) {
				this.resetGame();
			}
		}

		if (event.key === 'Enter') {
			if (this.state.success || this.state.fail) {
				this.resetGame();
			}
			// if game has started save answer to BE for later examination
			if (
				input !== 'start' ||
				(input !== 'scores' && this.state.gameStarted)
			) {
				this.saveToBe(input);
			}

			// start new game if input start and game not started already
			if (input === 'start' && !this.state.gameStarted) {
				this.startNewGame();
			}

			// get scores in input is scores and game is not started
			if (input === 'scores' && !this.state.gameStarted) {
				this.setState({ text: 'Feature Still in development...' });
			}

			// if game is started check input
			if (this.state.gameStarted) {
				if (!this.state.secondStepPassed) {
					this.checkIfSecondStepPassed(input);
				}
				if (!this.state.firstStepPassed) {
					this.checkIfFirstStepPassed(input);
				}

				// miss
				if (this.state.gameStarted && !this.state.secondStepPassed) {
					let answerExists = false;
					// check for possible miss responses
					this.state.missAnswers.forEach(missAnswer => {
						if(input === missAnswer.answer) {
							this.setState({
								text: missAnswer.response
							});
							answerExists = true;
							return;
						}
					});
					// default miss response
					if (!answerExists) {
						if (
							!this.firstStepPassed ||
							!this.secondStepPassed
						) {
							this.setState({
								text: `You dont know how to ${input}...`
							});
						}
					}
				}
			}
			// reset input
			this.setState({ input: '' });
		}
	};

	focusInput = () => {
		this.inputRef.current.focus();
	};

	render() {
		let img = (
			<div className={classes.content}>
				<h1>Don't Shit Your Pants !!!</h1>
				<div>
					In this game the goal is for you not to shit your pants...
				</div>
				<div>
					To start a{' '}
					<span className={classes.colorPurple}>new game</span>, type{' '}
					<span className={classes.colorGreen}>start</span> in the
					console and press{' '}
					<span className={classes.colorGold}>'Enter'</span>
				</div>
				<div>
					To see the{' '}
					<span className={classes.colorPurple}>scores</span>, type{' '}
					<span className={classes.colorGreen}>scores</span> in the
					console and press{' '}
					<span className={classes.colorGold}>'Enter'</span>
				</div>
			</div>
		);
		let counter = null;
		if (this.state.gameStarted) {
			img = (
				<img
					className={[classes.content, classes.image]}
					src={this.state.currentImg}
					alt='game progress depiction'
				/>
			);
			counter = (
				<div>
					00 : {this.state.counter < 10 ? '0' : ''}
					{this.state.counter}
				</div>
			);
		}

		let helperCountDown;
		if (this.state.gameStarted) {
			helperCountDown = (
				<div className={classes.helperCountDown}>
					00 : {this.state.counter < 10 ? '0' : ''}
					{this.state.counter}
				</div>
			);
		} else {
			helperCountDown = null;
		}

		let resetButton;
		if (this.state.success || this.state.fail) {
			resetButton = (
				<button className={classes.btn} onClick={this.resetGame}>
					<span>...Reset game</span>
				</button>
			);
		} else {
			resetButton = null;
		}

		let mainClasses = `${classes.main}`;
		if (this.state.success) {
			mainClasses = `${classes.main} ${classes.mainWin}`;
		} else if (this.state.fail) {
			mainClasses = `${classes.main} ${classes.mainLose}`;
		} else {
			mainClasses = `${classes.main}`;
		}

		return (
			<div className={mainClasses}>
				<header className={classes.header}>Shit Game {counter}</header>
				<div>
					{img}
					{helperCountDown}
					{resetButton}
				</div>
				<div className={classes.center}>
					<div className={classes.text}>{this.state.text}</div>
					<div className={classes.inputBox}>
						<span
							onClick={this.focusInput}
							className={classes.noMargin}
						>
							<img
								className={classes.svg}
								src={require('../../assets/images/chevron-right-solid.svg')}
							/>
						</span>
						<input
							ref={this.inputRef}
							type='text'
							className={classes.input}
							value={this.state.input}
							onChange={this.handleChange}
							onKeyDown={this.handleKeyDownOnInput}
						/>
					</div>
				</div>
				<footer>
					<div>
						Based on the original "Don't Shit Your Pants". Made
						using ReactJs.
					</div>
					<div>
						By
						<a href='https://linkedin.com/in/mile-ignjatovic-683188138'>
							Mile Ignjatovic
						</a>
					</div>
				</footer>
			</div>
		);
	}
}

export default main;
