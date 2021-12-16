import React, {Component} from 'react'
import { Link } from 'react-router'
// import logo from '../../img/react_sha.png'

import MessageBar from '../layouts/MessageBar'

export default class Header extends Component {

	constructor (props) {
		super(props)
	}

	render () {

		return (
			<header id='main_header'>
				<div id='brand'>
					<div className='header_container'>

						<Link to={app.settings.ws_conf.header.head_l_logo.u} className='logo-tl'>
							<img src={app.settings.ws_conf.header.head_l_logo.i} />
						</Link>


						<Link to={app.settings.ws_conf.header.site_title.u} className='main-site-name'>
							{app.settings.ws_conf.header.site_title.txt}
						</Link>

						<nav>
							<ul>
								{
									app.settings.ws_conf.main_menu.pages.p.map(function (p, i) {
										return (
											<li key={i}>
												<Link to={p.u} >
													<i className={'fa fa-2x '+p.ico} aria-hidden="true"></i>
									
												</Link>
												<span className='nav-name'>{p.name}</span>
											</li>
										)
									})
								}
							</ul>
						</nav>

					</div>
				</div>

				<MessageBar />

			</header>
		)
	}
								// <li className='showMobile'>
								// 	<Link ref='lnkMenu' className='menu no-interfere' to='' onClick={this.showHomeClicked.bind(this)}>menu</Link>
								// </li>
/*
	showPageClicked (e) {
		e.preventDefault()
		this.context.router.push(e.target.href)
		jquery(e.target).toggleClass('active')
		return false
	}

	showHomeClicked (e) {
		e.preventDefault()
		this.context.router.push('/')
		jquery(e.target).toggleClass('active')
		return false
	}
*/
}

// property validation
Header.propTypes = {
	children: React.PropTypes.any
}

Header.contextTypes = {
	router: React.PropTypes.object.isRequired
}
