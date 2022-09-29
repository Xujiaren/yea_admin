import React, { Component } from 'react';
import { Tag, Input, List, Modal, Form, Upload, message, Button, Icon } from 'antd';
import config from '../config/config'
import PropTypes from 'prop-types'

export default class CoursePrice extends Component {
	
	static propTypes = {
		value: PropTypes.string,
	}
	static defaultProps = {
		value: '',
	}
	constructor(props){
		super(props)
        this.state = {
            dataSource:[]
		}
    }
	componentDidMount() {
        const { value } = this.props
        this.init(value)
	}
	componentWillMount(){

	}
	componentWillReceiveProps(n_props) {
		if (n_props.value !== this.props.value) {
            const { value } = n_props
            this.init(value)
		}
	}
	init = (value)=>{
        if(value){
            console.log(value)
            let obj = JSON.parse(value)
            if(typeof obj === 'object'){
                let dataSource = Object.keys(obj).map(ele=>({ value: obj[ele] }))
                this.setState({ dataSource })
            }
        }
    }
	getValue = () => {
        const {dataSource} = this.state
        let tmp = {}
        if(dataSource.length > 0){
            dataSource.map((ele,index)=>{
                tmp[index+1] = ele['value']
            })
            return JSON.stringify(tmp)
        }else{
            return ''
        }
    }
    add = () => {
        this.setState(pre => {
            let { dataSource } = pre
            dataSource.push({
                value: 0
            })
            return {
                dataSource,
                edit_index: dataSource.length - 1,
                edit_value: ''
            }
        })
    }
    edit(index) {
        let { dataSource } = this.state
        let edit_value = dataSource[index].value

        this.setState({
            edit_value,
            edit_index: index,
            dataSource
        })
    }
    save(index) {
        this.setState(pre => {
            let { edit_value, dataSource } = pre
            if (!edit_value||edit_value=='') {
                edit_value = 0
            }
            if (isNaN(edit_value)) {
                message.info('请输入正确的价格')
                return null
            }
            dataSource[index].value = parseInt(edit_value)

            return {
                dataSource,
                edit_index: -1
            }
        })
    }
    delete(index) {
        this.setState(pre => {
            let { dataSource } = pre
            dataSource = dataSource.filter((ele, idx) => {
                return idx !== index
            })
            return {
                edit_index: -1,
                dataSource
            }
        })
    }

	render() {
		const {disabled} = this.props
		return (
			<>
				<List
                    className="demo-loadmore-list m_w400"
                    style={{ marginTop: '-2px' }}
                    itemLayout="horizontal"
                    dataSource={this.state.dataSource}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={disabled?[]:[
                                <a
                                    onClick={this.state.edit_index === index ?
                                        this.save.bind(this, index) :
                                        this.edit.bind(this, index)
                                    }
                                    key="list-loadmore-edit"
                                >
                                    {this.state.edit_index === index ? '保存' : '修改'}
                                </a>,
                                <a
                                    key="list-loadmore-more"
                                    onClick={this.delete.bind(this, index)}
                                >删除</a>
                            ]}
                        >
                            <div style={{ display: 'flex',flexWrap:'nowrap',alignItems:'center',width:'100%' }}>
                                <div style={{flexShrink:0,width:100}}>等级：<Tag>LV{index+1}</Tag></div>
                                {this.state.edit_index===index?
                                    <Input
                                        disabled={disabled}
                                        placeholder='请输入价格'
                                        style={{ flexGrow: 1, }}
                                        onChange={(e) => {
                                            this.setState({
                                                edit_value: e.target.value
                                            })
                                        }}
                                        value={this.state.edit_value}
                                    />:
                                    <div style={{ flexGrow: 1 }}>价格：<Tag>{item.value}</Tag></div>
                                }
                            </div>
                        </List.Item>
                    )}
                />
                {disabled?null:
                <Button type="dashed" onClick={this.add} style={{ minWidth: '10%' }}>
                    <Icon type="plus" /> 添加
                </Button>
                }
			</>
		);
	}
}