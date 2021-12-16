import React, {Component} from 'react'

import io from 'socket.io-client'

import TweenMax from 'gsap'

import rand_arr_elem from '../../helpers/rand_arr_elem'
import rand_to_fro from '../../helpers/rand_to_fro'

export default class GameMain extends Component {

	constructor (props) {
		super(props)

		this.win_sets = [
			['c1', 'c2', 'c3'],
			['c4', 'c5', 'c6'],
			['c7', 'c8', 'c9'],

			['c1', 'c4', 'c7'],
			['c2', 'c5', 'c8'],
			['c3', 'c6', 'c9'],

			['c1', 'c5', 'c9'],
			['c3', 'c5', 'c7']
		]


		if (this.props.game_type != 'live')
			this.state = {
				cell_vals: {},
				next_turn_ply: true,
				game_play: true,
				game_stat: 'Start game',
				count: 0,
				reset_game: this.reset_game.bind(this)
			}
		else {
			this.sock_start()

			this.state = {
				cell_vals: {},
				next_turn_ply: true,
				game_play: false,
				game_stat: 'Connecting',
				count: 0,
				reset_game: this.reset_game.bind(this)
			}
		}
	}

//	------------------------	------------------------	------------------------

	componentDidMount () {
    	TweenMax.from('#game_stat', 1, {display: 'none', opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeIn})
    	TweenMax.from('#game_board', 1, {display: 'none', opacity: 0, x:-200, y:-200, scaleX:0, scaleY:0, ease: Power4.easeIn})
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	sock_start () {

		this.socket = io(app.settings.ws_conf.loc.SOCKET__io.u);

		this.socket.on('connect', function(data) { 
			// console.log('socket connected', data)

			this.socket.emit('new player', { name: app.settings.curr_user.name });

		}.bind(this));

		this.socket.on('pair_players', function(data) { 
			// console.log('paired with ', data)

			this.setState({
				next_turn_ply: data.mode=='m',
				game_play: true,
				game_stat: 'Playing with ' + data.opp.name
			})

		}.bind(this));


		this.socket.on('opp_turn', this.turn_opp_live.bind(this));



	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	componentWillUnmount () {

		this.socket && this.socket.disconnect();
	}

//	------------------------	------------------------	------------------------

	cell_cont (c) {
		const { cell_vals } = this.state

		return (<div>
		        	{cell_vals && cell_vals[c]=='x' && <i className="fa fa-times fa-5x"></i>}
					{cell_vals && cell_vals[c]=='o' && <i className="fa fa-circle-o fa-5x"></i>}
				</div>)
	}

//	------------------------	------------------------	------------------------

	render () {
		const { cell_vals } = this.state

		return (
			<div id='GameMain'>
			
				<div id="game_stat">
					<h4>{this.state.game_stat != 'Play' && this.state.game_stat}</h4>
					{this.state.game_play && <h4>{this.state.next_turn_ply ? 'Your turn' : 'Opponent turn'}</h4>}

				</div>
			
				<div id="game_board">
					{[...Array(9)].map((e, i) => <div className="box" key={i} id={`game_board-c${i+1}`} ref={`c${i+1}`} onClick={this.click_cell.bind(this)}>
					{this.cell_cont(`c${i+1}`)}</div>)}
				</div>

				<div className="game_sidebar">
					<h2>Games Left {this.props.game_rounds - this.state.count}</h2>
					<button type='submit' onClick={this.end_game.bind(this)} className='button'><span>End Game <span className='fa fa-caret-right'></span></span></button>
				</div>
				
		
			</div>
		)
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	click_cell (e) {
		// console.log(e.currentTarget.id.substr(11))
		// console.log(e.currentTarget)

		if (!this.state.next_turn_ply || !this.state.game_play) return

		const cell_id = e.currentTarget.id.substr(11)
		if (this.state.cell_vals[cell_id]) return

		if (this.props.game_type != 'live')
			this.turn_ply_comp(cell_id)
		else
			this.turn_ply_live(cell_id)
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	turn_ply_comp (cell_id) {

		let { cell_vals } = this.state

		cell_vals[cell_id] = 'x'

		TweenMax.from(this.refs[cell_id], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})

		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: false
		// })

		// setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

		this.state.cell_vals = cell_vals
		this.check_turn()
	}

//	------------------------	------------------------	------------------------

	turn_comp () {
		console.log("comp turn");

		let { cell_vals } = this.state
		let empty_cells_arr = []


		for (let i=1; i<=9; i++) 
			!cell_vals['c'+i] && empty_cells_arr.push('c'+i)
		// console.log(cell_vals, empty_cells_arr, rand_arr_elem(empty_cells_arr))

		const c = rand_arr_elem(empty_cells_arr)
		cell_vals[c] = 'o'

		TweenMax.from(this.refs[c], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})

		this.state.cell_vals = cell_vals

		this.check_turn()
	}


//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	turn_ply_live (cell_id) {

		let { cell_vals } = this.state

		cell_vals[cell_id] = 'x'

		TweenMax.from(this.refs[cell_id], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})

		this.socket.emit('ply_turn', { cell_id: cell_id });

		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: false
		// })

		// setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

		this.state.cell_vals = cell_vals

		this.check_turn()
	}

//	------------------------	------------------------	------------------------

	turn_opp_live (data) {

		let { cell_vals } = this.state
		let empty_cells_arr = []


		const c = data.cell_id
		cell_vals[c] = 'o'

		TweenMax.from(this.refs[c], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})


		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: true
		// })

		this.state.cell_vals = cell_vals

		this.check_turn()
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	check_turn () {

		const { cell_vals } = this.state

		let win = false
		let set
		let fin = true


		if (this.props.game_type!='live')
			this.state.game_stat = 'Play'


		for (let i=0; !win && i<this.win_sets.length; i++) {
			set = this.win_sets[i]
			if (cell_vals[set[0]] && cell_vals[set[0]]==cell_vals[set[1]] && cell_vals[set[0]]==cell_vals[set[2]])
			win = true
		}

		for (let i=1; i<=9; i++) 
			!cell_vals['c'+i] && (fin = false)
		
		
		// win && console.log('win set: ', set)


		if (win) {
			console.log("win");

			let winner = cell_vals[set[0]]=='x' ? 'You' : 'Opponent'; // get winner
			this.props.onSetWinner(winner);

			// set class name for coloured rows
			for(var i = 0; i < 3; i++)
			{
				this.refs[set[i]].classList.add(winner === 'You' ? 'player_wins':'win');
			}
			
			// animations
			TweenMax.killAll(true)
			TweenMax.from('td.win', 1, {opacity: 0, ease: Linear.easeIn})
	
			// change status
			this.setState({
				game_stat: `${winner} won!`
			})

			setTimeout(() => {
				this.reset_game(set)
			  }, 1500);

		}
		else if (fin) {
			console.log("fin");

			this.props.onSetWinner('Draw');
		
			this.setState({
				game_stat: 'Draw',
			})

			setTimeout(() => {
				this.reset_game(set)
			  }, 1500);
		}

		else {
			this.props.game_type!='live' && this.state.next_turn_ply && setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

			this.setState({
				next_turn_ply: !this.state.next_turn_ply
			})
		}
		
	}
//	------------------------	------------------------	------------------------

	reset_game (set) {

		this.setState({
			count: this.state.count +1
		})

		// if last game, finish
		if(this.props.game_rounds === this.state.count) {
		
			this.setState({
				game_play: false
			})

			this.socket && this.socket.disconnect();
			this.props.onGameOver()
		} 
		// reset for next round
		else {
			for(var i = 0; i < 3; i++) 
				this.refs[set[i]].classList.remove('player_wins', 'win');
			
			this.setState({ cell_vals: {}});
			this.setState({game_stat: 'Start Game'})
			this.check_turn()
		}
	}

//	------------------------	------------------------	------------------------

	end_game () {
		this.socket && this.socket.disconnect();

		this.props.onEndGame()
	}



}
