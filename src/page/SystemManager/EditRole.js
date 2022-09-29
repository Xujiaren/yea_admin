import React, { Component } from 'react';
import {Row, Col,Checkbox,Card,PageHeader,Tree,Form,Modal,Menu, Dropdown, Button, Icon, message,Input,Pagination, Select} from 'antd';
import connectComponent from '../../util/connect';
import _ from 'lodash';
import {treeData} from '../../config/treeData';

const { TreeNode } = Tree;
class EditRole extends Component {
    state = {
        userKey: [],
        courseKey: [],
        workData: [],
        halfCheckedKeys:[],

        rule:[],
        role_name:'',
        role_id:0,
        status:0,
    };
    tree = {
        state:{ halfCheckedKeys: [] }
    }

    componentWillMount(){
        this.getSetting()
     }
     getRoleInfo = ()=>{
        console.log(this.props.match)
        if(this.props.match.path == '/system-manager/auth/edit/:id'){
            const role_id = this.props.match.params.id
            const {actions} = this.props
            actions.getRoleInfo({role_id})
        }
     }
    getSetting = ()=>{
        this.props.actions.getApplySetting({
            keyy:'apply_audits',
            section:'teacher',
            resolved:(data)=>{
               if(Array.isArray(data) && data['length'] > 0 && data[0]){
                let val = data[0].val||1
                if(val){
                    let apply_arr = []
                    // for (let i = 0; i < Number(val); i++){
                    //    apply_arr.push({
                    //        top: true,
                    //        key:'teacherApply/@'+(i+1)+'@',
                    //        title:'讲师申请评审'+(i+1)+'组'
                    //    })
                    // } 
                   this.setState({
                       workData: [...treeData,...apply_arr],
                       checkNum:Number(val)
                   },()=>{
                    this.props.actions.getApplySetting({
                        keyy:'audits',
                        section:'teacher',
                        resolved:(data)=>{
                           if(Array.isArray(data) && data['length'] > 0 && data[0]){
                            let val = data[0].val||1
                            if(val){
                                let rank_arr = []
                              
                                // for (let i = 0; i < Number(val); i++){
                                //    rank_arr.push({
                                //        top: true,
                                //        key:'teacherRank/$'+(i+1)+'$',
                                //        title:'讲师定级评审'+(i+1)+'组'
                                //    })
                                // }
                                let list = this.state.workData.concat([...rank_arr])
                               this.setState({
                                   workData: list,
                                   checkNum:Number(val)
                               })
                               this.getRoleInfo()
                           }}
                        },
                        rejected:(data)=>{
                            message.error(JSON.stringify(data))
                        }
                    })
                   })
                   this.getRoleInfo()
               }}
            },
            rejected:(data)=>{
                message.error(JSON.stringify(data))
            }
        })
        
        
    }
    componentWillReceiveProps(n_props){
        if(n_props.role_info !== this.props.role_info){
            console.log(n_props.role_info)
            let courseKey = []
            let res = n_props.role_info.rule.split('|||')
            if(res.length == 2){
                courseKey = res[1].split(',')
            }else{
                courseKey = res[0].split(',')
            }
            let role_name = n_props.role_info.name
            let role_id = n_props.role_info.roleId
            let status = n_props.role_info.status
            this.setState({
                courseKey,
                role_name,
                role_id,
                status
            })
        }
    }
    _onPublish = ()=>{
        let {role_name,role_id,status,courseKey,halfCheckedKeys} = this.state
        const {actions} = this.props
        if(courseKey.length === 0){
            message.info('请勾选相关权限'); return
        }
        if(!role_name){
            message.info('请输入管理员名称'); return
        }
        courseKey = courseKey.join(',')
        // const {halfCheckedKeys} = this.tree.state
        console.log(this.tree)
        if(halfCheckedKeys.length>0){
            courseKey = halfCheckedKeys.join(',') + '|||' +courseKey
        }
        console.log(courseKey,'aaa')
        actions.publishRole({
            role_id:role_id,name:role_name,rule:courseKey,status:status,
            resolved:(data)=>{
                this.props.actions.user()
                message.success({
                    content:'提交成功',
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
	
    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys });
    };
    onCheck = (courseKey,info)=>{
        const { halfCheckedKeys } = info
        console.log(courseKey,info)
        let flag = false
        let rule_length = 0
         //如果点击到了评审的选项，限制只能选其中的一个
         if(/^(teacherApply\/@)\d{1}@$/.test( info.node.props.eventKey )){
            this.state.courseKey.map(ele=>{
                if( info.node.props.eventKey === ele )
                    flag = true
                if(/^(teacherApply\/@)\d{1}@$/.test(ele)){
                    rule_length += 1
                }
            })
            if( !flag && rule_length !== 0 ){ message.info('一个审核组只能选择一项审核权限');return; }
        }

        //如果点击到了定级审核的选项，限制只能选其中的一个
        if(/^(teacherRank\/\$)\d{1}\$$/.test( info.node.props.eventKey )){
            this.state.courseKey.map(ele=>{
                if( info.node.props.eventKey === ele )
                    flag = true
                if(/^(teacherRank\/\$)\d{1}\$$/.test(ele)){
                    rule_length += 1
                }
            })
            if( !flag && rule_length !== 0 ){ message.info('一个审核组只能选择一项审核权限');return; }
        }
        this.setState({ 
            courseKey: courseKey,
            halfCheckedKeys: halfCheckedKeys
        },()=>{
            console.log(courseKey,'???')
        })
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 3 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 20 },
            },
        };
        return (
            <div className="animated fadeIn">
                <PageHeader
                    ghost={false}
                    onBack={() => this.props.history.goBack()}
                    subTitle={this.state.role_id==0?"创建管理组":"修改管理组"}
                >
                    <Card type='inner'>
                        <Form {...formItemLayout}>
                        <Form.Item label="管理组名称">
                            <Input 
                                value={this.state.role_name}
                                onChange={e=>{
                                    this.setState({
                                        role_name:e.target.value
                                    })
                                }}
                                style={{width:'200px'}} 
                                placeholder="请输入名称"
                            />
                        </Form.Item>
                        <Form.Item label="权限设置">
                            <Row gutter={[8, 8]}>
                                <Col xs={{span:24}} sm={{span:24}} md={{span:8}} lg={{span:8}} xl={{span:8}} xxl={{span:8}}>
                                    <Card size='small'>
                                        {
                                            this.state.workData.length>0?
                                            <Tree
                                                ref={ref=>this.tree = ref}
                                                checkable
                                                onCheck={this.onCheck}
                                                checkedKeys={{
                                                    checked: this.state.courseKey,
                                                    // halfChecked: this.state.halfCheckedKeys
                                                }}
                                                treeData={this.state.workData}
                                                height={400}
                                                virtual={true}
                                            >
                                            </Tree>:null
                                        }
                                        
                                        
                                        {/* <Tree
                                            checkable
                                            onCheck={(courseKey,info)=>{
                                                console.log(info.node.props.eventKey)

                                                let flag = false
                                                let rule_length = 0
                                                
                                                //如果点击到了评审的选项，限制只能选其中的一个
                                                if(/^(teacherApply\/@)\d{1}@$/.test( info.node.props.eventKey )){
                                                    this.state.courseKey.map(ele=>{
                                                        if( info.node.props.eventKey === ele )
                                                            flag = true
                                                        if(/^(teacherApply\/@)\d{1}@$/.test(ele)){
                                                            rule_length += 1
                                                        }
                                                    })
                                                    if( !flag && rule_length !== 0 ){ message.info('一个审核组只能选择一项审核权限');return; }
                                                }

                                                //如果点击到了定级审核的选项，限制只能选其中的一个
                                                if(/^(teacherRank\/\$)\d{1}\$$/.test( info.node.props.eventKey )){
                                                    this.state.courseKey.map(ele=>{
                                                        if( info.node.props.eventKey === ele )
                                                            flag = true
                                                        if(/^(teacherRank\/\$)\d{1}\$$/.test(ele)){
                                                            rule_length += 1
                                                        }
                                                    })
                                                    if( !flag && rule_length !== 0 ){ message.info('一个审核组只能选择一项审核权限');return; }
                                                }

                                                this.setState({courseKey})
                                            }}
                                            checkedKeys={this.state.courseKey}
                                        >
                                            {this.renderTreeNodes(this.workData)}
                                        </Tree> */}
                                    </Card>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item colon={false} label=" ">
                            <Button onClick={this._onPublish}>提交</Button>
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