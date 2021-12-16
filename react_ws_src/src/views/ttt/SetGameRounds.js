import React, {Component} from 'react'

export default class SetGameRounds extends Component {

	constructor (props) {
		super(props)

		this.state = {}
	}

//	------------------------	------------------------	------------------------

	render () {
		return (
			<div id='SetGameRounds'>

				<h1>Choose game rounds</h1>

				<button type='submit' onClick={this.setRoundsSingle.bind(this)} className='btn-main type'><span>Single <span className='fa fa-caret-right'></span></span></button>
			
				<button type='submit' onClick={this.setRoundsMulti.bind(this)} className='btn-main type'><span>Multiple <span className='fa fa-caret-right'></span></span></button>

			</div>
		)
	}

//	------------------------	------------------------	------------------------

	setRoundsSingle (e) {

		this.props.onSetRounds(1)
	}

//	------------------------	------------------------	------------------------

	setRoundsMulti (e) {

		this.props.onSetRounds(3)
	}

}
