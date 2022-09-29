import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Tag,Menu, Dropdown, Button, Icon, message,Input, InputNumber} from 'antd';

import connectComponent from '../../util/connect';
import { TweenOneGroup } from 'rc-tween-one';
import _ from 'lodash'

const { Search } = Input;

class BandFilter extends Component {

	state = {
		edit : false,
    	view : false,
        hot_index:[],

        h_search_val:'',

        hot_tags: [],
        inputVisible: false,
		inputValue: '',
		times:''
	};
	sen_list = {}


	onRefuse = ()=>{
		message.info('当前管理员无此权限');
    }

	componentDidMount(){
        const {actions} = this.props
        actions.getSen()
	}
	componentWillMount(){
        
    }
	componentWillReceiveProps(n_props){

        if(n_props.sen_list !== this.props.sen_list){
			let hot_tags = n_props.sen_list.sensitive_list
			let times =  n_props.sen_list.sensitive_times
            console.log(this.sen_list)
            this.setState({
				hot_tags,
				times
            })
        }
	}
	handleInputConfirm = () => {
        const { inputValue ,hot_tags } = this.state;
		if(!inputValue) return

		let _tmp = [...hot_tags]
		if (hot_tags.indexOf(inputValue) === -1) {
			_tmp = [...hot_tags, inputValue];
		}else{
			message.info('敏感词已存在')
			return
		}
		
        const {actions} =this.props
        

        let that = this
        actions.publishSen({
            sensitive:_tmp.join(','),
            resolved:(data)=>{
                message.success('操作成功')

                that.setState({
                    inputVisible: false,
                    inputValue: '',
				});
				actions.getSen()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
	};
	handleClose = removedTag => {
		
        const {actions} = this.props

		let that = this
		const _tmp = this.state.hot_tags.filter(tag => tag !== removedTag);
		console.log(_tmp)

        actions.publishSen({
            sensitive:_tmp.join(','),
            resolved:(data)=>{
                message.success('操作成功')

				this.setState(pre=>{
					let hot_index = pre.hot_index.filter(item => item !== removedTag);
					return { 
						hot_index,
						inputVisible:false,
						inputValue: ''
					}
				});
				actions.getSen()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    };
	submitTimes = ()=>{
		const {actions} = this.props
		if(this.state.times>127){
			message.info('限制次数不能大于127')
			return
		}
		actions.setSenTimes({times:this.state.times,
			resolved:(data)=>{
				message.success('提交成功')
				actions.getSen()
			},
			rejected:(data)=>{
				message.error(data)
			}
		})
	}
	_onHotSearch =(val)=>{
        if(!val){
            message.info('请输入搜索词'); return;
        }
        let hot_index = []

        this.state.hot_tags.map((tag,idx) =>{
           if(tag.indexOf(val) > -1)
                hot_index.push(tag)
        });
        if(hot_index.length === 0)
            message.info('没有对应热词')
        else
            this.setState({ hot_index,h_search_val:'' })
    }
    forMap = (tag,idx) => {
        
        const tagElem = (
			<Tag
				className='mt_2 mb_2'
				color={this.state.hot_index.indexOf(tag) > -1?"#108ee9":""}
                closable={!this.props.rule.includes('sen/del')?false:true}
                onClose={!this.props.rule.includes('sen/del')?this.onRefuse:e => {
                    e.preventDefault();
                    this.handleClose(tag,idx);
                }}
            >
                {tag}
            </Tag>
        );
        return (
            <span key={tag} style={{ display: 'inline-block' }}>
                {tagElem}
            </span>
        );
    };
    

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    
	saveInputRef = input => (this.input = input);
	render() {
		const { hot_tags,inputVisible, inputValue } = this.state;
        const hotTagChild = hot_tags.map(this.forMap);
        
		return (
		<div className="animated fadeIn">
			<Row>
			<Col xs="12">
				<Card style={{minHeight:'400px'}}>
				<CardHeader>
					敏感词过滤
					<div className="card-header-actions">
					
					<Search 
						placeholder="搜索敏感词"
						onChange={e=>this.setState({h_search_val:e.target.value})}
						value={this.state.h_search_val}
						onSearch={this._onHotSearch}
					></Search>
					</div>
				</CardHeader>
				<CardBody>
					<div>
						<div style={{ marginBottom: 16 }}>
						<TweenOneGroup
							enter={{
								scale: 0.8,
								opacity: 0,
								type: 'from',
								duration: 100,
								onComplete: e => {
									e.target.style = '';
								},
							}}
							leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
							appear={false}
						>
							{hotTagChild}
						</TweenOneGroup>
						</div>
						{inputVisible && (
						<Input
							ref={this.saveInputRef}
							type="text"
							size="small"
							style={{ width: 78 }}
							value={inputValue}
							onChange={this.handleInputChange}
							onBlur={this.handleInputConfirm}
							onPressEnter={this.handleInputConfirm}
						/>
						)}
						{!inputVisible && (
							<Tag onClick={!this.props.rule.includes('sen/add')?this.onRefuse:this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
								<Icon type="plus" />添加敏感词
							</Tag>
						)}
					</div>
				</CardBody>
				<CardHeader className="flex j_space_between">
					<div>
						<span><strong>敏感词出现次数</strong>(符合条件的用户将被禁用)&nbsp;&nbsp;</span>
						<InputNumber
						 	min={0} max={127}
							value={this.state.times}
							onChange={val=>{
								
								if(val !== ''&&!isNaN(val)){
									val = Math.round(val)
									if(val<0) val=0
									this.setState({
										times:val
									})
								}
							}}
							style={{ maxWidth: '60px'}}
						/>&nbsp;&nbsp;
						<Button onClick={!this.props.rule.includes('sen/edit')?this.onRefuse:this.submitTimes}>提交</Button>
					</div>
					<div className="card-header-actions">
						
					</div>
				</CardHeader>
				</Card>
			</Col>
			</Row>
		</div>
		);
	}
}

const LayoutComponent = BandFilter;
const mapStateToProps = state => {
    return {
		sen_list:state.ad.sen_list,
		user:state.site.user,
		rule:state.site.user.rule,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
