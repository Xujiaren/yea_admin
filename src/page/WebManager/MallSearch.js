import React, { Component } from 'react';
import { Tag,Modal,Select,Tabs,Card, DatePicker,Menu, Dropdown, Button, Icon, message,Input} from 'antd';
import connectComponent from '../../util/connect';
import { TweenOneGroup } from 'rc-tween-one';
import _ from 'lodash'

const { TabPane } = Tabs;
const { Search } = Input;
const {Option} = Select;

class MallSearch extends Component {
    state = {

        edit : true,
        view : true,
        hot_index:[],
        def_index:[],
        h_search_val:'',
        d_search_val:'',

        hot_tags: [],
        inputVisible: false,
        inputValue: '',

        default_tags: [],
        d_inputVisible: false,
        d_inputValue: '',
    };
    keyword_list = {}


	onRefuse = ()=>{
		message.info('当前管理员无此权限');
    }

    componentDidMount(){
        this.getKeyword()
    }

    componentWillReceiveProps(n_props){
    }
    getKeyword = ()=>{
        const that = this
        this.props.actions._getKeyword({
            action:'goods',
            resolved:(res)=>{
                const {hot = [],def = [] } = res
                this.setState({
                    hot_tags: hot,
                    default_tags: def,
                })
                console.log(res)
            }
        })
    }
    _onDefSearch =(val)=>{
        if(!val){
            message.info('请输入搜索词'); return;
        }
        let def_index = []

        this.state.default_tags.map((tag,idx) =>{
           if(tag.indexOf(val) > -1)
                def_index.push(tag)
        });
        if(def_index.length === 0)
            message.info('没有对应热词')
        else
            this.setState({ def_index,d_search_val:'' })
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
                closable={!this.props.rule.includes('search/del')?false:true}
                onClose={!this.props.rule.includes('search/del')?this.onRefuse:e => {
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
    handleClose = (removedTag) => {
        const {actions} = this.props
        actions.removeKeywords({
            keyword:removedTag,
            type:'hot',
            action:'goods',
            resolved:(data)=>{
                message.success('操作成功')
                const hot_tags = this.state.hot_tags.filter(tag => tag !== removedTag);

                this.setState(pre=>{
                    let hot_index = pre.hot_index.filter(item => item !== removedTag);
                    return { 
                        hot_tags,
                        hot_index
                    }
                });
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = () => {
        const { inputValue,hot_tags } = this.state;
        if(!inputValue) return
        if (hot_tags.indexOf(inputValue) > -1) {
            message.info('该词已存在，请重新输入')
			return
        }
        const {actions} =this.props
        

        let that = this
        actions.publishKeywords({
            keyword:inputValue,
            action:'goods',
            type:'hot',
            resolved:(data)=>{
                message.success('操作成功')
            
                that.setState({
                    inputVisible: false,
                    inputValue: '',
                });
                that.getKeyword()
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    };

///////
    
    d_handleClose = (removedTag) => {
        const {actions} = this.props
        actions.removeKeywords({
            keyword:removedTag,
            type:'def',
            action:'goods',
            resolved:(data)=>{
                message.success('操作成功')
                const default_tags = this.state.default_tags.filter(tag => tag !== removedTag);

                this.setState(pre=>{
                    let def_index = pre.def_index.filter(item => item !== removedTag);
                    return { 
                        default_tags,
                        def_index
                    }
                });
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
        
    };

    d_showInput = () => {
        this.setState({ d_inputVisible: true }, () => this.input.focus());
    };

    d_handleInputChange = e => {
        this.setState({ d_inputValue: e.target.value });
    };

    d_handleInputConfirm = () => {
        const { d_inputValue } = this.state;
        if(!d_inputValue) return

        let { default_tags } = this.state;
        const {actions} =this.props
        let that = this
        actions.publishKeywords({
            keyword:d_inputValue,
            action:'goods',
            type:'def',
            resolved:(data)=>{
                message.success('操作成功')
                if (d_inputValue && default_tags.indexOf(d_inputValue) === -1) {
                    default_tags = [...default_tags, d_inputValue];
                }

                that.setState({
                    default_tags,
                    d_inputVisible: false,
                    d_inputValue: '',
                });
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
        
    };
    d_forMap = (tag,idx) => {
        const tagElem = (
            <Tag
                className='mt_2 mb_2'
                color={this.state.def_index.indexOf(tag) > -1?"#108ee9":""}
                closable={!this.props.rule.includes('search/del')?false:true}
                onClose={!this.props.rule.includes('search/del')?this.onRefuse:e => {
                    e.preventDefault();
                    this.d_handleClose(tag,idx);
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


    saveInputRef = input => (this.input = input);
    render() {
        const { hot_tags, default_tags,inputVisible, inputValue ,d_inputVisible, d_inputValue } = this.state;
        const hotTagChild = hot_tags.map(this.forMap);
        const defaultTagChild = default_tags.map(this.d_forMap);
        return (
            <>
                <Card 
                    extra={
                        <Search 
                            placeholder="搜索"
                            onChange={e=>this.setState({h_search_val:e.target.value})}
                            value={this.state.h_search_val}
                            onSearch={this._onHotSearch}
                        ></Search>
                    } 
                    type='inner' 
                    title="热词" 
                    bodyStyle={{paddingTop:"15px"}}
                >
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
                            <Tag onClick={!this.props.rule.includes('search/add')?this.onRefuse:this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                                <Icon type="plus" />添加热词
                            </Tag>
                        )}
                    </div>
                </Card>
                <Card 
                    extra={
                        <Search 
                            placeholder="搜索"
                            onChange={e=>this.setState({d_search_val:e.target.value})}
                            value={this.state.d_search_val}
                            onSearch={this._onDefSearch}
                        ></Search>
                    }  
                    className="mt_15" 
                    type='inner' 
                    title="默认搜索词" 
                    bodyStyle={{marginTop:'5px',paddingTop:"15px"}}
                >
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
                            {defaultTagChild}
                        </TweenOneGroup>
                        </div>
                        {d_inputVisible && (
                        <Input
                            ref={this.saveInputRef}
                            type="text"
                            size="small"
                            style={{ width: 78 }}
                            value={d_inputValue}
                            onChange={this.d_handleInputChange}
                            onBlur={this.d_handleInputConfirm}
                            onPressEnter={this.d_handleInputConfirm}
                        />
                        )}
                        {!d_inputVisible && (
                            <Tag onClick={!this.props.rule.includes('search/add')?this.onRefuse:this.d_showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                                <Icon type="plus" /> 添加默认词
                            </Tag>
                        )}
                    </div>
                </Card>
            </>
        );
    }
}

const LayoutComponent =MallSearch;
const mapStateToProps = state => {
    return {
        keyword_list:state.ad.keyword_list,
        user:state.site.user,
        rule:state.site.user.rule,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});