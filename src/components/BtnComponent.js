import React, { Components, useState, useEffect } from 'react'
import connectComponent from '../util/connect';
import {Button as Btn,message,Popconfirm as Pop} from 'antd'

function onRefuse(){
    message.info("暂无权限")
}
const BtnCom = (props)=>{
    const { value='',disabled=false } = props

    if(value && !props.rule.includes(value)){
        return (
            <a style={{position:'relative'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,zIndex:8}} onClick={onRefuse}></div>
                <Btn {...props} disabled={true}>{props.children}</Btn>
            </a>
        )
    }
    return (
        <Btn {...props}>{props.children}</Btn>
    )
}
const Popcom = (props)=>{
    let { value='',disabled=false } = props

    if(value && !props.rule.includes(value)){
       return (
        <span style={{opacity:0.5}}>
        <Pop {...props} disabled={false} onConfirm={()=>{
            message.info("暂无权限")
        }}>
            {/* <Btn disabled={isdisable} size='small' danger={type=='white'?false:true} type='ghost'>{text}</Btn> */}
            {props.children}
        </Pop>
        </span>
       )
    }
    return (
        <Pop {...props}>
            {/* <Btn disabled={isdisable} size='small' danger={type=='white'?false:true} type='ghost'>{text}</Btn> */}
            {props.children}
        </Pop>
    )
}
export const Button = connectComponent({LayoutComponent:BtnCom, mapStateToProps:state => {
    return {
        rule:state.site.user.rule
    }
}});
export const Popconfirm = connectComponent({LayoutComponent:Popcom, mapStateToProps:state => {
    return {
        rule:state.site.user.rule
    }
}});

