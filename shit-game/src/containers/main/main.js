import React, { Component } from 'react';
import classes from './main.module.css';
import axios from 'axios';
import {Subject} from 'rxjs';

class main extends Component {

    constructor() {
        super();
        this.inputRef = React.createRef(); 
    }

    state = {
        subject: new Subject(),
        currentImg: '',
        text: '',
        input: '',
        gameStarted: false,
        fail: false,
        counter: 31,
        interval: undefined,
        startImg: require('../../assets/images/1.jpg'), 
        pantsDownImg: require('../../assets/images/2.jpg'),
        shitInPantsImg: require('../../assets/images/3.jpg'), 
        successMessyImg: require('../../assets/images/4.jpg'), 
        successImg: require('../../assets/images/5.jpg'),
        possibleFirstAnswers: [
            'take pants off',
            'take off pants',
            'drop pants',
            'pants off',
            'get naked',
            'pull off pants',
            'pull pants off',
        ],
        pantsOffMessage: 'You pull your pants down...',
        firstStepPassed: false,
        secondStepPassed: false,
        possibleEndAnswers: [
            'shit on the floor',
            'shit on floor',
            'shit', 
            'shit on the wall',
            'poop on the floor',
            'poop',
            'poop on floor',
            'crap',
            'crap on the floor',
            'crap on floor'
        ],
        success: false,
        missAnswers: [
            {answer: 'look around', response: 'You look around and see a door, and a hallway. You want to burst!'}, 
            {answer: 'go down the hall', response: 'You try to move, but you cant! Your gonna crap your pants!'}, 
            {answer: 'open door', response: 'You try to open the door, but its sealed shut! You are gonna shit your pants!'}, 
            {answer: 'open the door', response: 'You try to open the door, but its sealed shut! You are gonna shit your pants!'}, 
            {answer: 'go to bathroom', response: 'Yea... You realy want to go to the bathroom.'}, 
            {answer: 'go to the bathroom', response: 'Yea... You realy want to go to the bathroom.'}, 
            {answer: 'go to toilet', response: 'You realy should...'}, 
            {answer: 'go to the toilet', response: 'You realy should...'}, 
            {answer: 'sit down', response: 'You are going to explode. You cant sit down.'}, 
            {answer: 'sit', response: 'You are going to explode. You cant sit down.'}, 
            {answer: 'squat', response: 'You are going to explode. You cant do a slav squat now.'}, 
            {answer: 'lay', response: 'Why would you even try to lay down? You cant shit laying down!'}, 
            {answer: 'lay down', response: 'Why would you even try to lay down? You cant shit laying down!'}, 
           
            {answer: 'look', response: 'You look around and see a door, and a hallway. You want to burst!'}, 
            {answer: 'look at door', response: 'You take a look at the door. Its shut!'}, 
            {answer: 'look at the door', response: 'You take a look at the door. Its shut!'}, 
            {answer: 'go down the hallway', response: 'You try to move, but you cant! Your gonna crap your pants!'}, 
            {answer: 'go to hallway', response: 'You wanna go, but you cant!'}, 
            {answer: 'go to hall', response: 'You try to move, but you cant! Your gonna crap your pants!'}, 
            {answer: 'go to door', response: 'Oh shiiit!'}, 
            {answer: 'go to the door', response: 'The door is shut!'}, 
            {answer: 'pee', response: 'You dont want to pee, you want to take a shit!'},
        ],
        failMessage: 'You shat your pants... You are such a looser...',
        successMessage: 'You didnt shit your pants!'
    }
    handleChange = (event) => {
        this.setState({input: event.target.value})
    } 

    completeGame = () => {
        // complete screen
        // success image
        let successImg = Math.floor((Math.random() * 1) + 1);
        this.setState({currentImg: successImg > 0 ? this.state.successImg : this.state.successMessyImg});
        // success message
        this.setState({text: this.state.successMessage});
        // stop interval
        clearInterval(this.state.interval);
        this.setState({interval: undefined});
        // success state true
        this.setState({success: true});
        this.setState({fail: false});
    }

    failGame = () => {
        // fail screen
        // fail image
        this.setState({currentImg: this.state.shitInPantsImg});
        // fail message
        this.setState({text: this.state.failMessage})
        // stop interval
        clearInterval(this.state.interval);
        this.setState({interval: undefined});
        // fail state true
        this.setState({success: false});
        this.setState({fail: true});
    }

    saveToBe = (input) => {
        axios.post('https://shit-game.firebaseio.com/userInput.json', {answer: input})
        .then(response => {
            console.log(response);
        });
    }

    startNewGame = () => {        
        this.setState({fail: false});
        this.setState({success: false});
        this.setState({currentImg: this.state.startImg});
        this.setState({text: 'You want to take a shit.'});
        this.setState({firstStepPassed: false});
        this.setState({secondStepPassed: false});
        this.setState({gameStarted: true}, () => {
            if (this.state.gameStarted && !this.state.interval) {
                this.setState({counter: 31}, () => {
                    this.setState({interval: setInterval(()=> {
                        this.setState((previousState, props) => {return {counter: this.state.counter - 1}})
        
                        if (this.state.counter === Math.floor((Math.random() * 5) + 3)) {
                            this.setState({text: 'OOOOHH shit, you are going to explode!!!'})
                        }
                        if (this.state.counter === Math.floor((Math.random() * 10) + 8)) {
                            this.setState({text: 'You feel the preasure rising!!!'})
                        }
                        if (this.state.counter === Math.floor((Math.random() * 15) + 12)) {
                            this.setState({text: 'Hurry Up! You realy dont want to shit your pants'})
                        }
                        if (this.state.counter === 0) {
                            if (this.state.firstStepPassed) {
                                this.completeGame();
                                this.setState({text: 'You cant hold it any more, so you just take a dump on the floor. But since you already took your pants off, its OK !'});
                            } else {
                                this.failGame();
                            }
                        }
                    }, 1000)});
                });
            }
            this.render();
        });
    }

    goToMainScreen = () => {
        this.setState({input: ''});
        this.setState({text: ''});
        this.setState({gameStarted: false})
        this.setState({success: false})
        this.setState({fail: false})
    }

    resetGame = () => {
        this.setState({input: ''});
        this.setState({text: ''});
        this.setState({gameStarted: false})
        this.setState({firstStepPassed: false});
        this.setState({secondStepPassed: false});
        this.setState({success: false});
        this.setState({fail: false});
        clearInterval(this.state.interval);
        this.setState({interval: undefined});
    }

    handleKeyDown = (event) => {
        let input = this.state.input.toLowerCase().trim();
        if (event.key === 'Escape') {
            if (this.state.gameStarted) {
                this.resetGame();
            }
            if (this.state.success || this.state.fail) {
                this.goToMainScreen();
            }
        }

        if (event.key === 'Enter') {
            if (this.state.success || this.state.fail) {
                this.goToMainScreen();
            }
            // if not start or scores and game has started save it to the BE for later examination
            if (input !== 'start' || input !== 'scores' && this.state.gameStarted) {
                this.saveToBe(input);
            }

            // start new game if input start and game not started already
            if (input === 'start' && !this.state.gameStarted) {
                this.startNewGame();
            }

            // get scores in input is scores and game is not started
            if (input === 'scores' && !this.state.gameStarted) {
                this.setState({text: 'Feature Still in development...'});
            }

            // if game is started check input
            if (this.state.gameStarted) {
                if (!this.state.secondStepPassed) {
                    this.setState({secondStepPassed: this.state.possibleEndAnswers.indexOf(input) !== -1 ? true : false}, () => {
                        if (!this.state.firstStepPassed && this.state.secondStepPassed) {
                            this.failGame();
                        }
                        if (this.state.firstStepPassed && this.state.secondStepPassed) {
                            this.completeGame();
                        }
                    });
                }
                if (!this.state.firstStepPassed) {
                    this.setState({firstStepPassed: this.state.possibleFirstAnswers.indexOf(input) !== -1 ? true : false}, () => {
                        if (this.state.firstStepPassed) {
                            this.setState({currentImg: this.state.pantsDownImg});
                            this.setState({text: this.state.pantsOffMessage});
                        }
                        if (!this.state.firstStepPassed && this.state.secondStepPassed) {
                            this.failGame();
                        }
                        if (this.state.firstStepPassed && this.state.secondStepPassed) {
                            this.completeGame();
                        }
                    });
                }

                // miss
                if (this.state.gameStarted && !this.state.secondStepPassed) {
                    switch(input) {
                        case this.state.missAnswers[0].answer: 
                            this.setState({text: this.state.missAnswers[0].response}); 
                            break;   
                        case this.state.missAnswers[1].answer: 
                            this.setState({text: this.state.missAnswers[1].response}); 
                            break;
                        case this.state.missAnswers[2].answer: 
                            this.setState({text: this.state.missAnswers[2].response}); 
                            break;
                        case this.state.missAnswers[3].answer: 
                            this.setState({text: this.state.missAnswers[3].response}); 
                            break;
                        case this.state.missAnswers[4].answer: 
                            this.setState({text: this.state.missAnswers[4].response}); 
                            break;
                        case this.state.missAnswers[5].answer: 
                            this.setState({text: this.state.missAnswers[5].response}); 
                            break;
                        case this.state.missAnswers[6].answer: 
                            this.setState({text: this.state.missAnswers[6].response}); 
                            break;
                        case this.state.missAnswers[7].answer: 
                            this.setState({text: this.state.missAnswers[7].response}); 
                            break;
                        case this.state.missAnswers[8].answer: 
                            this.setState({text: this.state.missAnswers[8].response}); 
                            break;
                        case this.state.missAnswers[9].answer: 
                            this.setState({text: this.state.missAnswers[9].response}); 
                            break;
                        case this.state.missAnswers[10].answer: 
                            this.setState({text: this.state.missAnswers[10].response}); 
                            break;
                        case this.state.missAnswers[11].answer: 
                            this.setState({text: this.state.missAnswers[11].response}); 
                            break;
                        case this.state.missAnswers[12].answer: 
                            this.setState({text: this.state.missAnswers[12].response});
                            break;
                        case this.state.missAnswers[13].answer: 
                            this.setState({text: this.state.missAnswers[13].response});
                            break;
                        case this.state.missAnswers[14].answer: 
                            this.setState({text: this.state.missAnswers[14].response});
                            break;
                        case this.state.missAnswers[15].answer: 
                            this.setState({text: this.state.missAnswers[15].response});
                            break;
                        case this.state.missAnswers[16].answer: 
                            this.setState({text: this.state.missAnswers[16].response});
                            break;
                        case this.state.missAnswers[17].answer: 
                            this.setState({text: this.state.missAnswers[17].response});
                            break;
                        case this.state.missAnswers[18].answer: 
                            this.setState({text: this.state.missAnswers[18].response});
                            break;
                        case this.state.missAnswers[19].answer: 
                            this.setState({text: this.state.missAnswers[19].response});
                            break;
                        case this.state.missAnswers[20].answer: 
                            this.setState({text: this.state.missAnswers[20].response});
                            break;
                        case this.state.missAnswers[21].answer: 
                            this.setState({text: this.state.missAnswers[21].response});
                            break;
                        default: {
                            if (!this.firstStepPassed || !this.secondStepPassed) {
                                this.setState({text: `You dont know how to ${input}...`});
                            }
                        }
                    }
                }
            }

            // reset input
            this.setState({input: ''})
        }
    }

    focusInput = () => {
        this.inputRef.current.focus()
    }

    render () {
        let counter;
        let img = (
        <div className={classes.content}>
            <h1>Don't Shit Your Pants !!!</h1>
            <div>In  this  game  the  goal  is  for  you  not  to  shit  your  pants...</div>
            <div>To  start  a  <span className={classes.colorPurple}>new  game</span>,  type  <span className={classes.colorGreen}>start</span>  in  the  console  and  press  <span className={classes.colorGold}>'Enter'</span></div>
            <div>To  see  the  <span className={classes.colorPurple}>scores</span>,  type  <span className={classes.colorGreen}>scores</span>  in  the  console  and  press  <span className={classes.colorGold}>'Enter'</span></div>
        </div>
        );
        if (this.state.gameStarted){
            img = <img className={[classes.content, classes.image]} src={this.state.currentImg} alt="game progress depiction"/>
            counter = (
                <div>00 : {this.state.counter < 10 ? '0' : ''}{this.state.counter}</div>
            )
        }

        let helperCountDown;
        if (this.state.gameStarted) {
            helperCountDown = (<div className={classes.helperCountDown}>00 : {this.state.counter < 10 ? '0' : ''}{this.state.counter}</div>)
        } else {
            helperCountDown = null;
        }

        let resetButton
        if (this.state.success || this.state.fail) {
            resetButton = (<button className={ classes.btn} onClick={this.resetGame}><span>...Reset game</span></button>)
        } else {
            resetButton = null;
        }

        return (
        <div className={classes.main}>
            <header className={classes.header}>Shit Game {counter}</header>
            <div>
                {img}
                {helperCountDown}
                {resetButton}
            </div>
            <div className={classes.center}>
                <div className={classes.text}>{this.state.text}</div>
                <div className={classes.inputBox}>
                    <span onClick={this.focusInput} className={classes.noMargin}><img className={classes.svg} src={require('../../assets/images/chevron-right-solid.svg')} /></span>
                    <input 
                        ref={this.inputRef}
                        type="text"
                        className={classes.input} 
                        value={this.state.input} 
                        onChange={this.handleChange} 
                        onKeyDown={this.handleKeyDown}/>
                </div>
            </div>
            <footer>
                <div>Based on the original "Don't Shit Your Pants". Made using ReactJs.</div>
                <div>By<a href="https://linkedin.com/in/mile-ignjatovic-683188138">Mile Ignjatovic</a></div>
            </footer>
        </div>
        )
    }

}

export default main;