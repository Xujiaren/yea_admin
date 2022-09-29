/**
 * @Wang
 */
import React, { Component } from 'react';

import './ModalPanel.scss'

export default class ModalPanel extends Component  {

    constructor () {
        super(...arguments)
        this.state = {

        }
    }

    componentWillReceiveProps () {}
    componentWillMount () {}

    render () {
        
        const modal_img = "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/box-live.png"
        const {title,content,visible} = this.props

        return (
            <div className='root'>
                <div className={visible ? 'show_modal modal':'modal'}>
                    <div className='pannel'>
                        <img className='modal_img' mode='widthFix' src={modal_img}/>
                        <div className='pannel_cons'>
                            <span className='modal_txt'>{title}</span>
                            <span className='modal_sum'>{content}</span>
                            <div className='modal_btn' onClick={this.props.onClose}>
                                <span className='modal_btn_txt'>确定</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

