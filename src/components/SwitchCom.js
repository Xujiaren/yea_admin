import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd';

export default class SwitchCom extends Component {
	state = {

	}
	static propTypes = {
		disabled:PropTypes.bool,
		tips:PropTypes.string,
		value:PropTypes.number,
		onChange:PropTypes.func
	}
	static defaultProps = {
		value: 0,
		onChange: ()=>{},
		tips:''
	}
	render() {
		return (
			<>
				<Switch disabled={this.props.disabled} checked={this.props.value == 1?true:false} onChange={(e)=>{
					this.props.onChange(e?1:0 )
				}}/>
				{
					this.props.tips?<div className='tips'>{this.props.tips}</div>:null
				}
			</>
		);
	}
}