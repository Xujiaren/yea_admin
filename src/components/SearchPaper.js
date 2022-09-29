import React, { Component } from 'react';
import { Radio, Empty,Select,Spin, Modal, Form, Upload, message, Button, Icon } from 'antd';
import PropTypes from 'prop-types'
import action from '../redux/action';

export default class SearchPaper extends Component {
	
	static propTypes = {
		value: PropTypes.array,
		disabled: PropTypes.bool,
        onChange: PropTypes.func,
        actions: PropTypes.object,
	}
	static defaultProps = {
        disabled:false,
        value: [],
        onChange:()=>{},
        actions:null,
        id:0,
	}
	constructor(props){
		super(props)
        this.state = {
			fileList: [],
			previewImage: '',
			previewVisible: false,
            showFolder: false,
            selectedPaper: [],
            paper_list:[]
        }
        this.paper_ctype = 26
        this.paper_keyword = ''
    }
	componentWillMount(){
		this.getAuthPaper()
    }
    componentDidMount(){
        this.getCoursePaper()
    }
    getCoursePaper = ()=>{
        if(this.props.id!== 0&&this.props.id)
        this.props.actions&&this.props.actions.getCoursePaper({
            course_id:this.props.id,
            resolved:(data)=>{
                if(data instanceof Array){
                    let selectedPaper = []
                    let ltype = 0
                    
                    data.map(ele=>{
                        ltype = parseInt(ele.ltype)||0
                        selectedPaper.push(ele['paperId'])
                    })
                    this.setState({ ltype,selectedPaper })
                }
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    setCoursePapers = (course_id)=>{
        const {selectedPaper} = this.state
        selectedPaper.map(ele=>{
            this.setCoursePaper(course_id,ele)
        })
    }
    setCoursePaper = (course_id,paper_id)=>{
        console.log(course_id,paper_id)
        
        this.props.actions&&this.props.actions.setCoursePaper({
            course_id: course_id,
            paper_id: paper_id,
            ltype:this.state.ltype,
            resolved:(data)=>{

            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    actionCoursePaper = (course_id,paper_id)=>{
        this.props.actions&&this.props.actions.actionCoursePaper({
            course_id:course_id,
            paper_id:paper_id,
            resolved:(data)=>{

            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
    }
    getAuthPaper = ()=>{
        this.setState({ fetchingPaper: true })
        const {actions} = this.props;
        actions&&actions._getAuthPaper({
            ctype:this.paper_ctype,
            page:0,
            pageSize:20,
            keyword:this.paper_keyword,
            resolved:(data)=>{
                this.setState({ fetchingPaper: false,paper_list:data['data']||[] })
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
                this.setState({ fetchingPaper: false })
            }
        })
    }
    _onSearchPaper = (value)=>{
        this.setState({ fetchingPaper: true })
        this.paper_keyword = value
        this.getAuthPaper()
    }
    _onSelectPaper = (value) => {
        console.log(value)
        const {selectedPaper} = this.state
        if(value.length>1){
            message.info('最多设置一张试卷');
            return
        }
        let item = 0
        if(value.length > selectedPaper.length){
            item = value.filter(ele=>selectedPaper.indexOf(ele) == -1)[0]
        }else{
            item = selectedPaper.filter(ele=>value.indexOf(ele) == -1)[0]
        }
        if(parseInt( this.props.id )!== 0 ){
            if(value.length < selectedPaper.length)
                this.actionCoursePaper(this.props.id||0,item)
            else
                this.setCoursePaper(this.props.id||0,item)
        }
        this.setState({
            selectedPaper:value,
        });
        
    };
	render() {
		return (
			<>
				<Select
                    disabled={this.props.view_mode}
                    value={this.state.selectedPaper}
                    placeholder="搜索试卷"
                    mode='multiple'
                    className='m_w400'
                    showSearch
                    notFoundContent={this.state.fetchingPaper ? <Spin size="small" /> : <Empty />}
                    filterOption={false}
                    onSearch={this._onSearchPaper}
                    onChange={this._onSelectPaper}
                >
                    {this.state.paper_list.map(item => (
                        <Select.Option key={item.paperId} value={item.paperId}>{item.paperName}</Select.Option>
                    ))}
                </Select>
                <div>
                <Radio.Group
                    value={this.state.ltype}
                    onChange={e => {
                        this.setState({ ltype: e.target.value })
                    }}
                >
                    <Radio value={0}>课程前</Radio>
                    <Radio value={1}>课程后</Radio>
                </Radio.Group>
                </div>
			</>
		);
	}
}