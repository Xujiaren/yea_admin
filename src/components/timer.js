
import React, { PureComponent } from 'react'

function getSeconds(duration){
    let m = parseInt(duration/60)
    let s = (duration%60).toString()
    if(s<10) s = '0'+s
    return m+'分'+s+'秒'
}

export default class Timer extends PureComponent {
    state = {
        seconds: 0,
    }
    componentWillMount(){
        const {duration} = this.props
        if(duration>=0)
        this.setState({seconds:duration})
    }
    componentDidMount() {
        const that = this
        this.myInterval = setInterval(() => {
            that.setState(({ seconds }) =>{
                if(seconds>0){
                    return {seconds:seconds -1}
                }else{
                    clearInterval(that.myInterval)
                    that.props.onZero()
                }
            })
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    render() {
        const { seconds } = this.state
        return (
            <span>
                {getSeconds(seconds)}
            </span>
        )
    }
}