import React, { Component} from 'react'
import { Link } from 'react-router'

import SetName from './SetName'
import SetGameType from './SetGameType'
import SetGameRounds from './SetGameRounds'

import GameMain from './GameMain'

export default class Ttt extends Component {

	constructor (props) {
		super(props)

		this.state = {
			game_step: this.set_game_step(),
			game_rounds: 0,
			player_score: 0,
			opp_score: 0,
			winner: ""
		}
	}

//	------------------------	------------------------	------------------------

	render () {

		const {game_step} = this.state

		console.log(game_step)

		return (
			<section id='TTT_game'>
				<div id='page-container'>
					{game_step == 'set_name' && <SetName 
														onSetName={this.saveUserName.bind(this)} 
												/>}

					{game_step === 'start_game' && 
						<div id="game_banner">
							<h5>Welcome, {app.settings.curr_user.name}</h5>
							<h5>Playing {this.state.game_type}</h5>
							<div id="score">
								<h4>You {this.state.player_score}</h4>
								<h4>Opp  {this.state.opp_score}</h4>
							</div>
						</div>
					}

					{game_step == 'set_game_rounds' && <SetGameRounds
														onSetRounds={this.saveGameRounds.bind(this)} 
													/>}

					{game_step == 'set_game_type' && <SetGameType 
														onSetType={this.saveGameType.bind(this)} 
													/>}
					
					{game_step == 'start_game' && <GameMain 
														game_rounds={this.state.game_rounds}
														game_type={this.state.game_type}
														onEndGame={this.gameEnd.bind(this)}
														onGameOver={this.gameOver.bind(this)}
														onSetWinner={this.gameWinner.bind(this) }
													/>}
					{game_step == 'finish_game' && 
					<div>
					
						<h2>The winner is {this.state.winner}</h2>
						<Link to={app.settings.ws_conf.header.site_title.u} className='main-site-name'>
							<button className="btn-main">Start Again</button>
						</Link>
					
					</div>}

				</div>
			</section>
		)
	}

//	------------------------	------------------------	------------------------

	saveUserName (n) {
		app.settings.curr_user = {}
		app.settings.curr_user.name = n

		this.upd_game_step()
	}

//	------------------------	------------------------	------------------------

	saveGameType (t) {
		this.state.game_type = t

		this.upd_game_step()
	}

//	------------------------	------------------------	------------------------

	saveGameRounds (r) {
		this.state.game_rounds = r

		this.upd_game_step()
	}
//	------------------------	------------------------	------------------------

	gameWinner (w) {

		console.log(`winner ${w}` );
		
		// add to player score
		if(w != 'Draw') {
			w === 'You' ? this.setState({player_score: this.state.player_score+1}) : this.setState({opp_score: this.state.opp_score+1})
		}
		
	}

	// all game rounds completed
	gameOver (t) {
		if(this.state.player_score != this.state.opp_score) {
			this.state.player_score > this.state.opp_score ? this.setState({winner: "You, Congratulations!"}) : this.setState({winner: "your Opponent!"}) 
		} else {
			this.setState({winner: "nobody, it was a Draw!"}) 
		}
		this.setState({game_step: 'finish_game'})
		app.settings.curr_user.name = null
	}


//	------------------------	------------------------	------------------------

	gameEnd (t) {
		this.state.game_type = null
		app.settings.curr_user.name = null
		this.setState({
			player_score: 0,
			opp_score: 0,
		})

		this.upd_game_step()
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	upd_game_step () {

		this.setState({
			game_step: this.set_game_step()
		})
	}

//	------------------------	------------------------	------------------------

	set_game_step () {

		if (!app.settings.curr_user || !app.settings.curr_user.name)
			return 'set_name'
		else if (!this.state.game_rounds)
			return 'set_game_rounds'
		else if (!this.state.game_type)
			return 'set_game_type'
		else
			return 'start_game'
	}

}

//	------------------------	------------------------	------------------------

Ttt.propTypes = {
	params: React.PropTypes.any
}

Ttt.contextTypes = {
  router: React.PropTypes.object.isRequired
}