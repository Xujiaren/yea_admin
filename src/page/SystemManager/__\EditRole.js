import React, { Component } from 'react';
import { Table,FormGroup,Label,Badge, CardBody, CardHeader, Col, PaginationItem, PaginationLink, Row } from 'reactstrap';
import {Checkbox,Card,PageHeader,Tree,Form,Modal,DatePicker,Menu, Dropdown, Button, Icon, message,Input,Pagination, Select} from 'antd';
import {Link,NavLink} from 'react-router-dom'
import connectComponent from '../../util/connect';
import _ from 'lodash';

const {RangePicker} = DatePicker;
const { Search } = Input;
const InputGroup = Input.Group;
const {Option} = Select;

const { TreeNode } = Tree;

const the_pri = {
    'dashboard':['dashboard/view','dashboard/edit'],
    'excel':['excel/view','excel/edit'],
    'statistic':['statistic/view'],
    'todo':['todo/view','todo/edit'],
	'comment': ['comment/view', 'comment/edit'],
	'post':['post/view', 'post/edit'],
	'feedback': ['feedback/view', 'feedback/edit'],
    'statistic':['statistic/view','statistic/edit'],

    'user':['user/view','user/edit'],
    'level':['level/view','level/edit'],
    'profit':['profit/view','profit/edit'],
    'coin':['coin/view','coin/edit'],

    'teacher':['teacher/view','teacher/edit'],
    'teacherApply':['teacherApply/view','teacherApply/edit'],
    'teacherRank':['teacherRank/view','teacherRank/edit'],

    'course':['course/view','course/edit'],
    'column':['column/view','column/edit'],
    'classify':['classify/view','classify/edit'],
    'label':['label/view','label/edit'],

    'live':['live/view','live/edit'],
    'liveGift':['liveGift/view','liveGift/edit'],
    
    'spe':['spe/view','spe/edit'],
    'authMng':['authMng/view','authMng/edit'],
    'authcate':['authcate/view','authcate/edit'],
    'authv':['authv/view','authv/edit'],
    'authTopicCate':['authTopicCate/view','authTopicCate/edit'],
    'authTopic':['authTopic/view','authTopic/edit'],
    'authExam':['authExam/view','authExam/edit'],
    'authClass':['authClass/view','authClass/edit'],
    'media':['media/view','media/edit'],

    'news':['news/view','news/edit'],
    'newsLabel':['newsLabel/view','newsLabel/edit'],
    
    'ad':['ad/view','ad/edit'],
    'msg':['msg/view','msg/edit'],
    'tmp':['tmp/view','tmp/edit'],

    'search':['search/view','search/edit'],
    
    'active':['active/view','active/edit'],
    'bandfilter':['bandfilter/view','bandfilter/edit'],
    'invite':['invite/view','invite/edit'],

    'auth':['auth/view','auth/edit'],
    'admin':['admin/view','admin/edit'],
    'log':['log/view','log/edit'],

}
const full =??["todo/view","todo/edit","todo","feedback/view","feedback/edit","feedback","statistic/view","statistic/edit","statistic","excel/view","excel/edit","excel","dashboard/view","dashboard/edit","dashboard","comment/view","comment/edit","comment","post/view","post/edit","post","user/view","user/edit","user","level/view","level/edit","level","profit/view","profit/edit","profit","coin/view","coin/edit","coin","teacher/view","teacher/edit","teacher","teacherApply/view","teacherApply/edit","teacherApply","teacherRank/view","teacherRank/edit","teacherRank","course/view","course/edit","course","column/view","column/edit","column","classify/view","classify/edit","classify","label/view","label/edit","label","live/view","live/edit","live","liveGift/view","liveGift/edit","liveGift","spe/view","spe/edit","spe","teacherApply/@1@","teacherRank/$1$","authMng/view","authMng/edit","authMng","authcate/view","authcate/edit","authcate","authv/view","authv/edit","authv","authTopicCate/view","authTopicCate/edit","authTopicCate","authTopic/view","authTopic/edit","authTopic","authExam/view","authExam/edit","authExam","authClass/view","authClass/edit","authClass","news/view","news/edit","news","newsLabel/view","newsLabel/edit","newsLabel","ad/view","ad/edit","ad","msg/view","msg/edit","msg","tmp/view","tmp/edit","tmp","search/view","search/edit","search","active/view","active/edit","active","bandfilter/view","bandfilter/edit","bandfilter","invite/view","invite/edit","invite","media/view","media/edit","media","auth/view","auth/edit","auth","admin/view","admin/edit","admin","log/view","log","log/edit"]
class EditRole extends Component {
    state = {
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        rule:[],
        role_name:'',
        role_id:0,
        status:0,

        pri:the_pri,
    };
   
    componentWillMount(){
        console.log(this.props.match)
        if(this.props.match.path == '/system-manager/auth/edit/:id'){
            const role_id = this.props.match.params.id
            const {actions} = this.props
            actions.getRoleInfo({role_id})
        }
        this.getSetting()
     }
     getSetting = ()=>{
         this.props.actions.getApplySetting({
             keyy:'audits',
             section:'teacher',
             resolved:(data)=>{
                if(Array.isArray(data) && data['length'] > 0 && data[0]){
                 let val = data[0].val||1
                 if(val){
                     let {pri} = this.state
                     for(let i=1;i<=Number(val);i++){
                        //  pri['teacherApply'].push('teacherApply/@'+i+'@')
                        //  pri['teacherRank'].push('teacherRank/$'+i+'$')
                     }
                     this.setState({ checkNum:Number(val),pri:pri })
                 }
                }
                
             },
             rejected:(data)=>{
                 message.error(JSON.stringify(data))
             }
         })
     }
    componentWillReceiveProps(n_props){
        if(n_props.role_info !== this.props.role_info){
            console.log(n_props.role_info)
            let rule
            if(_.indexOf(n_props.role_info.rule, '*') >= 0){
                rule = full
            }else{
                rule = n_props.role_info.rule.split(',')
            }
            let role_name = n_props.role_info.name
            let role_id = n_props.role_info.roleId
            let status = n_props.role_info.status
            this.setState({
                rule,
                role_name,
                role_id,
                status
            })
        }
    }
    _onPublish = ()=>{
        let {role_name,rule,role_id,status} = this.state
        const {actions} = this.props
        if(rule.length === 0){
            message.info('?????????????????????'); return
        }
        if(!role_name){
            message.info('????????????????????????'); return
        }
        console.log(JSON.stringify(rule))
        rule = rule.join(',')
        actions.publishRole({
            role_id:role_id,name:role_name,rule:rule,status:status,
            resolved:(data)=>{
                message.success({
                    content:'????????????',
                    onClose:()=>{
                        window.history.back()
                    }
                });
            },
            rejected:(data)=>{
                message.error(data);
            }
        })
    }
	_onChoose(r) {
		let rule = this.state.rule;
        const {pri} = this.state
		if (_.indexOf(rule, r) >= 0) {
			_.pull(rule, r);
			rule = _.filter(rule, cr => cr.indexOf(r) < 0);
		} else {

			if (r.indexOf('/') >= 0) {
				let pr = r.split('/')[0];

				if (_.indexOf(rule, pr) < 0) {
					rule.push(pr);
				}
			} else {
				pri[r] && pri[r].map((pr, index) => {
					rule.push(pr);
				})
			}

			rule.push(r);
        }
        
        console.log(rule)
		this.setState({
			rule: rule
		})
	}
    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onCheck = checkedKeys => {
        this.setState({ checkedKeys });
    };

    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys });
    };

    renderTreeNodes = data =>
        data.map(item => {
        if (item.children) {
            return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
            </TreeNode>
            );
        }
        return <TreeNode key={item.key} {...item} />;
    });

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 2 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 10 },
                sm: { span: 10 },
            },
        };
        const renderFooter = ()=>{
            let arr = []
            
            for(let i=1;i<=this.state.checkNum;i++){
    
                arr.push(
                    <div>
                        <Label check>
                            <Checkbox 
                                type="checkbox" 
                                checked={_.indexOf(this.state.rule, 'teacherApply/@'+i+'@') >= 0} 
                                onChange={() => {
                                    let flag = false
                                    let rule_length = 0
                                    this.state.rule.map(ele=>{
                                        if('teacherApply/@'+i+'@' === ele )
                                            flag = true
                                        if(/^(teacherApply\/@)\d{1}@$/.test(ele)){
                                            rule_length += 1
                                        }
                                    })
                                    
                                    if( !flag && rule_length !== 0){ message.info('?????????????????????????????????????????????');return; }

                                    this._onChoose('teacherApply/@'+i+'@')
                                }}
                            />
                                {' '}??????{i}???
                        </Label>
                    </div>
                )
            }
            return arr
        }
        const renderFooterRank = ()=>{
            let arr = []
            for(let i=1;i<=this.state.checkNum;i++){
                arr.push(
                    <div>
                        <Label check>
                            <Checkbox 
                                type="checkbox" 
                                checked={_.indexOf(this.state.rule, 'teacherRank/$'+i+'$') >= 0} 
                                onChange={() => {
                                    let flag = false
                                    let rule_length = 0
                                    this.state.rule.map(ele=>{
                                        if('teacherRank/$'+i+'$' === ele)
                                                flag = true
                                        if(/^(teacherRank\/\$)\d{1}\$$/.test(ele)){
                                            rule_length += 1
                                        }
                                    })
                                    if( !flag && rule_length !== 0){ message.info('?????????????????????????????????????????????');return; }

                                    this._onChoose('teacherRank/$'+i+'$')
                                }}
                            />
                                {' '}??????{i}???
                        </Label>
                    </div>
                )
            }
            return arr
        }
        return (
            <div className="animated fadeIn">
                <PageHeader
                    ghost={false}
                    onBack={() => this.props.history.goBack()}
                    subTitle={this.state.role_id==0?"???????????????":"???????????????"}
                >
                    {/*<Table columns={columns} dataSource={this.data} />*/}
                    <Card type='inner'>
                        <Form {...formItemLayout}>
                        <Form.Item label="???????????????">
                            <Input 
                                value={this.state.role_name}
                                onChange={e=>{
                                    this.setState({
                                        role_name:e.target.value
                                    })
                                }}
                                style={{width:'200px'}} 
                                placeholder="???????????????"
                            />
                        </Form.Item>
                        <Form.Item label="????????????">
                        <Table className="role_table col-sm-12">
                            <thead>
                                <tr>
                                    <th>??????</th>
                                    <th>??????</th>
                                    <th>??????</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td colSpan="3">?????????</td>
                            </tr>
                                    <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'todo') >= 0} onChange={() => this._onChoose('todo')}/>{' '}????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'todo/view') >= 0} onChange={() => this._onChoose('todo/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'todo/edit') >= 0} onChange={() => this._onChoose('todo/edit')}/>{' '}??????</Label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'feedback') >= 0} onChange={() => this._onChoose('feedback')}/>{' '}????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'feedback/view') >= 0} onChange={() => this._onChoose('feedback/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'feedback/edit') >= 0} onChange={() => this._onChoose('feedback/edit')}/>{' '}??????</Label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'statistic') >= 0} onChange={() => this._onChoose('statistic')}/>{' '}????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'statistic/view') >= 0} onChange={() => this._onChoose('statistic/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'statistic/edit') >= 0} onChange={() => this._onChoose('statistic/edit')}/>{' '}??????</Label>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'excel') >= 0} onChange={() => this._onChoose('excel')}/>{' '}????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'excel/view') >= 0} onChange={() => this._onChoose('excel/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'excel/edit') >= 0} onChange={() => this._onChoose('excel/edit')}/>{' '}??????</Label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'dashboard') >= 0} onChange={() => this._onChoose('dashboard')}/>{' '}????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'dashboard/view') >= 0} onChange={() => this._onChoose('dashboard/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'dashboard/edit') >= 0} onChange={() => this._onChoose('dashboard/edit')}/>{' '}??????</Label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'comment') >= 0} onChange={() => this._onChoose('comment')}/>{' '}????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'comment/view') >= 0} onChange={() => this._onChoose('comment/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'comment/edit') >= 0} onChange={() => this._onChoose('comment/edit')}/>{' '}??????</Label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'post') >= 0} onChange={() => this._onChoose('post')}/>{' '}????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'post/view') >= 0} onChange={() => this._onChoose('post/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'post/edit') >= 0} onChange={() => this._onChoose('post/edit')}/>{' '}??????</Label>
                                        </div>
                                    </td>
                                </tr>
                                
                            <tr>
                                <td colSpan="3">????????????</td>
                            </tr>
                                    <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'user') >= 0} onChange={() => this._onChoose('user')}/>{' '}????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'user/view') >= 0} onChange={() => this._onChoose('user/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'user/edit') >= 0} onChange={() => this._onChoose('user/edit')}/>{' '}??????</Label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'level') >= 0} onChange={() => this._onChoose('level')}/>{' '}????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'level/view') >= 0} onChange={() => this._onChoose('level/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'level/edit') >= 0} onChange={() => this._onChoose('level/edit')}/>{' '}??????</Label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'profit') >= 0} onChange={() => this._onChoose('profit')}/>{' '}????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'profit/view') >= 0} onChange={() => this._onChoose('profit/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'profit/edit') >= 0} onChange={() => this._onChoose('profit/edit')}/>{' '}??????</Label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'coin') >= 0} onChange={() => this._onChoose('coin')}/>{' '}????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'coin/view') >= 0} onChange={() => this._onChoose('coin/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'coin/edit') >= 0} onChange={() => this._onChoose('coin/edit')}/>{' '}??????</Label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                <td colSpan="3">????????????</td>
                            </tr>
                                    <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'teacher') >= 0} onChange={() => this._onChoose('teacher')}/>{' '}????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'teacher/view') >= 0} onChange={() => this._onChoose('teacher/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'teacher/edit') >= 0} onChange={() => this._onChoose('teacher/edit')}/>{' '}??????</Label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'teacherApply') >= 0} onChange={() => this._onChoose('teacherApply')}/>{' '}??????????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'teacherApply/view') >= 0} onChange={() => this._onChoose('teacherApply/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'teacherApply/edit') >= 0} onChange={() => this._onChoose('teacherApply/edit')}/>{' '}??????</Label>
                                        </div>
                                        {
                                            renderFooter()
                                        }
                                    </td>
                                    
                                </tr>
                            
                            <tr>
                                <td colSpan="3">??????????????????</td>
                            </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'teacherRank') >= 0} onChange={() => this._onChoose('teacherRank')}/>{' '}??????????????????</Label>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'teacherRank/view') >= 0} onChange={() => this._onChoose('teacherRank/view')}/>{' '}??????</Label>
                                        </div>
                                        <div>
                                            <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'teacherRank/edit') >= 0} onChange={() => this._onChoose('teacherRank/edit')}/>{' '}??????</Label>
                                        </div>
                                        {
                                            renderFooterRank()
                                        }
                                    </td>
                                    
                                </tr>
                            <tr>
                                <td colSpan="3">????????????</td>
                            </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'course') >= 0} onChange={() => this._onChoose('course')}/>{' '}????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'course/view') >= 0} onChange={() => this._onChoose('course/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'course/edit') >= 0} onChange={() => this._onChoose('course/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'column') >= 0} onChange={() => this._onChoose('column')}/>{' '}????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'column/view') >= 0} onChange={() => this._onChoose('column/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'column/edit') >= 0} onChange={() => this._onChoose('column/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'classify') >= 0} onChange={() => this._onChoose('classify')}/>{' '}????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'classify/view') >= 0} onChange={() => this._onChoose('classify/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'classify/edit') >= 0} onChange={() => this._onChoose('classify/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'label') >= 0} onChange={() => this._onChoose('label')}/>{' '}????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'label/view') >= 0} onChange={() => this._onChoose('label/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'label/edit') >= 0} onChange={() => this._onChoose('label/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>

                            <tr>
                                <td colSpan="3">??????????????????</td>
                            </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'live') >= 0} onChange={() => this._onChoose('live')}/>{' '}????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'live/view') >= 0} onChange={() => this._onChoose('live/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'live/edit') >= 0} onChange={() => this._onChoose('live/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'liveGift') >= 0} onChange={() => this._onChoose('liveGift')}/>{' '}????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'liveGift/view') >= 0} onChange={() => this._onChoose('liveGift/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'liveGift/edit') >= 0} onChange={() => this._onChoose('liveGift/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                            <td colSpan="3">????????????</td>
                            </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'spe') >= 0} onChange={() => this._onChoose('spe')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'spe/view') >= 0} onChange={() => this._onChoose('spe/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'spe/edit') >= 0} onChange={() => this._onChoose('spe/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                   
                                    <tr>
                            <td colSpan="3">??????????????????</td>
                            </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authMng') >= 0} onChange={() => this._onChoose('authMng')}/>{' '}?????????????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authMng/view') >= 0} onChange={() => this._onChoose('authMng/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authMng/edit') >= 0} onChange={() => this._onChoose('authMng/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authcate') >= 0} onChange={() => this._onChoose('authcate')}/>{' '}????????????????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authcate/view') >= 0} onChange={() => this._onChoose('authcate/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authcate/edit') >= 0} onChange={() => this._onChoose('authcate/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authv') >= 0} onChange={() => this._onChoose('authv')}/>{' '}??????????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authv/view') >= 0} onChange={() => this._onChoose('authv/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authv/edit') >= 0} onChange={() => this._onChoose('authv/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authTopicCate') >= 0} onChange={() => this._onChoose('authTopicCate')}/>{' '}?????????????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authTopicCate/view') >= 0} onChange={() => this._onChoose('authTopicCate/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authTopicCate/edit') >= 0} onChange={() => this._onChoose('authTopicCate/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authTopic') >= 0} onChange={() => this._onChoose('authTopic')}/>{' '}??????????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authTopic/view') >= 0} onChange={() => this._onChoose('authTopic/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authTopic/edit') >= 0} onChange={() => this._onChoose('authTopic/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authExam') >= 0} onChange={() => this._onChoose('authExam')}/>{' '}????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authExam/view') >= 0} onChange={() => this._onChoose('authExam/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authExam/edit') >= 0} onChange={() => this._onChoose('authExam/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authClass') >= 0} onChange={() => this._onChoose('authClass')}/>{' '}??????????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authClass/view') >= 0} onChange={() => this._onChoose('authClass/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'authClass/edit') >= 0} onChange={() => this._onChoose('authClass/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                            <tr>
                                <td colSpan="3">????????????</td>
                            </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'news') >= 0} onChange={() => this._onChoose('news')}/>{' '}????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'news/view') >= 0} onChange={() => this._onChoose('news/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'news/edit') >= 0} onChange={() => this._onChoose('news/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'newsLabel') >= 0} onChange={() => this._onChoose('newsLabel')}/>{' '}????????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'newsLabel/view') >= 0} onChange={() => this._onChoose('newsLabel/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'newsLabel/edit') >= 0} onChange={() => this._onChoose('newsLabel/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                <tr>
                                    <td colSpan="3">????????????</td>
                                </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'ad') >= 0} onChange={() => this._onChoose('ad')}/>{' '}????????????</Label>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'ad/view') >= 0} onChange={() => this._onChoose('ad/view')}/>{' '}??????</Label>
                                                </div>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'ad/edit') >= 0} onChange={() => this._onChoose('ad/edit')}/>{' '}??????</Label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'msg') >= 0} onChange={() => this._onChoose('msg')}/>{' '}????????????</Label>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'msg/view') >= 0} onChange={() => this._onChoose('msg/view')}/>{' '}??????</Label>
                                                </div>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'msg/edit') >= 0} onChange={() => this._onChoose('msg/edit')}/>{' '}??????</Label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'tmp') >= 0} onChange={() => this._onChoose('tmp')}/>{' '}????????????</Label>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'tmp/view') >= 0} onChange={() => this._onChoose('tmp/view')}/>{' '}??????</Label>
                                                </div>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'tmp/edit') >= 0} onChange={() => this._onChoose('tmp/edit')}/>{' '}??????</Label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'search') >= 0} onChange={() => this._onChoose('search')}/>{' '}????????????</Label>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'search/view') >= 0} onChange={() => this._onChoose('search/view')}/>{' '}??????</Label>
                                                </div>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'search/edit') >= 0} onChange={() => this._onChoose('search/edit')}/>{' '}??????</Label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'active') >= 0} onChange={() => this._onChoose('active')}/>{' '}????????????</Label>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'active/view') >= 0} onChange={() => this._onChoose('active/view')}/>{' '}??????</Label>
                                                </div>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'active/edit') >= 0} onChange={() => this._onChoose('active/edit')}/>{' '}??????</Label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'bandfilter') >= 0} onChange={() => this._onChoose('bandfilter')}/>{' '}???????????????</Label>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'bandfilter/view') >= 0} onChange={() => this._onChoose('bandfilter/view')}/>{' '}??????</Label>
                                                </div>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'bandfilter/edit') >= 0} onChange={() => this._onChoose('bandfilter/edit')}/>{' '}??????</Label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'invite') >= 0} onChange={() => this._onChoose('invite')}/>{' '}????????????</Label>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'invite/view') >= 0} onChange={() => this._onChoose('invite/view')}/>{' '}??????</Label>
                                                </div>
                                                <div>
                                                    <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'invite/edit') >= 0} onChange={() => this._onChoose('invite/edit')}/>{' '}??????</Label>
                                                </div>
                                            </td>
                                        </tr>
                            <tr>
                                <td colSpan="3">?????????</td>
                            </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'media') >= 0} onChange={() => this._onChoose('media')}/>{' '}?????????</Label>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'media/view') >= 0} onChange={() => this._onChoose('media/view')}/>{' '}??????</Label>
                                            </div>
                                            <div>
                                                <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'media/edit') >= 0} onChange={() => this._onChoose('media/edit')}/>{' '}??????</Label>
                                            </div>
                                        </td>
                                    </tr>
                            <tr>
                                <td colSpan="3">????????????</td>
                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <div>
                                                        <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'auth') >= 0} onChange={() => this._onChoose('auth')}/>{' '}????????????</Label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'auth/view') >= 0} onChange={() => this._onChoose('auth/view')}/>{' '}??????</Label>
                                                    </div>
                                                    <div>
                                                        <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'auth/edit') >= 0} onChange={() => this._onChoose('auth/edit')}/>{' '}??????</Label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <div>
                                                        <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'admin') >= 0} onChange={() => this._onChoose('admin')}/>{' '}???????????????</Label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'admin/view') >= 0} onChange={() => this._onChoose('admin/view')}/>{' '}??????</Label>
                                                    </div>
                                                    <div>
                                                        <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'admin/edit') >= 0} onChange={() => this._onChoose('admin/edit')}/>{' '}??????</Label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <div>
                                                        <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'log') >= 0} onChange={() => this._onChoose('log')}/>{' '}????????????</Label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'log/view') >= 0} onChange={() => this._onChoose('log/view')}/>{' '}??????</Label>
                                                    </div>
                                                    <div>
                                                        <Label check><Checkbox type="checkbox" checked={_.indexOf(this.state.rule, 'log/edit') >= 0} onChange={() => this._onChoose('log/edit')}/>{' '}??????</Label>
                                                    </div>
                                                </td>
                                            </tr>
                        </tbody>


                        </Table>
                        </Form.Item>
                        <Form.Item colon={false} label=" ">
                            <Button onClick={this._onPublish}>??????</Button>
                        </Form.Item>
                        </Form>
                        
                    </Card>
                </PageHeader>
            </div>
        );
    }
}

const LayoutComponent = EditRole;
const mapStateToProps = state => {
    return {
        role_info:state.system.role_info
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});