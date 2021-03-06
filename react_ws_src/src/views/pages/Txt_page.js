import React, { Component} from 'react'
import { Link } from 'react-router'

import X2JS from 'x2js'

export default class Txt_page extends Component {

	constructor (props) {
		super(props)

		this.state = {}
	}

//	------------------------	------------------------	------------------------

	render () {
		// const { page } = this.props.params
		const page = this.props.params.page || 'home' 
		const page_x = app.settings.ws_conf.pgs[page]

		// console.log('Txt_page', page)

		if (!page || !page_x) return null

		return (
			<section id='Txt_page'>
				<div id='page-container'>

					<div dangerouslySetInnerHTML={{__html: page_x.txt.__cdata}} />

					<div className='btns'>
					{
						(new X2JS()).asArray(page_x.btns.b).map(function (b, i) {
							console.log(b)
							return (
								<Link to={b.u} key={i} >
									<div className="btn-main">
										<span>{b.txt} <span className='fa fa-caret-right'></span></span>
									</div>
								</Link>
							)
						})
					}
					</div>
				</div>
			</section>
		)
	}

}

Txt_page.propTypes = {
	params: React.PropTypes.any
}

Txt_page.contextTypes = {
  router: React.PropTypes.object.isRequired
}