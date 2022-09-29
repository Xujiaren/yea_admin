import React, { Component } from 'react';
import { Badge, CardBody, CardHeader, Col, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import {Popconfirm,PageHeader,Card,Form,Modal,Checkbox,DatePicker,Menu, Dropdown, Button, Icon, message,Input,Pagination, Select, Empty} from 'antd';
import {Link,NavLink} from 'react-router-dom'
import locale from 'antd/es/date-picker/locale/zh_CN';
import connectComponent from '../../util/connect';
import _ from 'lodash';

const {RangePicker} = DatePicker;
const { Search } = Input;

class LabelDetail extends Component {
    state = {
        view:false,
        edit:false,

        showImgPanel:false,
        visible: false,
        group:[],

        isAll:false,
        selected_g:[],
        id_group:[],
    };
    tag_id = ''
    tag_course_list = []
    page_total=0
    page_current=1
    page_size=10

    _onPage=(val)=>{
        const {actions} = this.props
        actions.getTagCourse('',val-1,this.tag_id);
    }
    _onRemove(id){
        const {actions} = this.props
        actions.removeTagCourse({
            tag_id:this.tag_id,
            course_id:id,
            resolved:(data)=>{
                this.handleCancel()
                message.success("操作成功")
                actions.getTagCourse('',this.page_current-1,this.tag_id);
            },
            rejected:(data)=>{
                message.error(data)
            }
        })
    }
    _onDeleteAll = ()=>{
		const {actions} = this.props
		const {selected_g} = this.state
		if(selected_g.length == 0){
			message.info('请选择课程');return;
		}
		actions.removeTagCourseAll({
            tag_id:this.tag_id,
			course_ids:selected_g.join(','),
			resolved:(data)=>{
				this.setState({
                    selected_g:[],
                    isAll:false
                })
				message.success('操作成功')
                actions.getTagCourse('',this.page_current-1,this.tag_id);
			},
			rejected:(data)=>{
				message.error(data)
			}
		})
	}
    componentWillReceiveProps(n_props){
        if(n_props.tag_course_list !== this.props.tag_course_list){
            this.tag_course_list = n_props.tag_course_list.data;
            this.page_total=n_props.tag_course_list.total
            this.page_current=n_props.tag_course_list.page+1


            let _id_tmp =[]
                
            this.tag_course_list.map((ele,index)=>{
                _id_tmp.push({id:ele.courseId,checked:false})
            })
            this.setState({
                id_group:_id_tmp
            })

        }
    }
    componentDidMount(){
        this.tag_id = this.props.match.params.id
        const {actions} = this.props
        actions.getTagCourse('',0,this.tag_id);
    }

    _onCheckAll=()=>{

        this.setState(pre=>{
            let selected_g = []
            let id_group = pre.id_group

            let isAll =false
            if(pre.isAll){
                isAll =false
 
                id_group.map(ele=>{
                    ele.checked = false
                })

            }else{
                isAll =true
                id_group.map(ele=>{
                    selected_g.push(ele.id)
                    ele.checked = true
                })
            }
            return{
                isAll,
                selected_g,
                id_group
            }
        })

    }
    _onCheck(idx,e){
        const id = e.target['data-id']

        this.setState((pre)=>{
            let id_group = pre.id_group
            let selected_g =[]
            let tmp = []
            let isAll = false

            if(e.target.checked){
                id_group[idx].checked = true
                selected_g = [...pre.selected_g,id]
            }else{
                id_group[idx].checked = false
                tmp = pre.selected_g.filter((ele)=>(
                    ele !== id
                ))
                selected_g = tmp
            }

            return {
                id_group,
                selected_g,
                isAll
            }
            
        },()=>{
            let isAll = false
            if(this.state.selected_g.length == this.state.id_group.length)
                isAll = true
            this.setState({ isAll })
        })
      
    }
    showImgPanel(url){
        this.setState({
            showImgPanel: true,
            previewImage:url
        });
    }
    hideImgPanel=()=>{
        this.setState({
            showImgPanel: false
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    
    _onSelectAll=()=>{
        
    }
    render() {

        return (
            <div className="animated fadeIn">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                subTitle="该标签所有课程"
            >
            <Row>
                    <Col xs="12" lg="12">
                    <Card bodyStyle={{padding:"10px"}}>
                            <div className="pad_b10">
                                <Button onClick={this._onCheckAll} type="" size={'small'} className="">{this.state.isAll?'取消全选':'全选'}</Button>&nbsp;
                                <Popconfirm
                                    title="确定删除吗？"
                                    onConfirm={this._onDeleteAll}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Button type="" size={'small'} className="">删除</Button>
                                </Popconfirm>&nbsp;
                            </div>
                            <Table responsive size="sm">
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>课程主图</th>
                                    <th>课程ID</th>
                                    <th>课程名称</th>
                                
                                    <th>主讲人</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                
                                {this.tag_course_list.length==0?
                                    <tr><td colSpan={6}>
                                        <Empty description="暂时没有数据"/>
                                    </td></tr>
                                    :this.tag_course_list.map((ele,index)=>
                                    <tr key={ele.courseId+'tag'}>
                                        <td>
                                            <Checkbox 
                                                data-id={ele.courseId}
                                                onChange={this._onCheck.bind(this,index)}
                                                checked={this.state.id_group[index].checked}
                                            />
                                        </td>
                                        <td>
                                            <a>
                                                <img 
                                                    onClick={this.showImgPanel.bind(this,ele.courseImg)} 
                                                    className="head-example-img" 
                                                    src={ele.courseImg}
                                                />
                                            </a>
                                        </td>
                                        <td>{ele.courseId}</td>
                                        <td>{ele.courseName}</td>
                                        <td>{ele.teacherName?ele.teacherName:'无'}</td>
                                        <td>
                                            <div>
                                                <Popconfirm 
                                                    okText="确定"
                                                    cancelText='取消'
                                                    title='确定删除吗？'
                                                    onConfirm={this._onRemove.bind(this,ele.courseId)}
                                                >
                                                    <Button type="danger" ghost size={'small'}>删除</Button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                            <Pagination  showTotal={()=>('总共'+this.page_total+'条')} showQuickJumper pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                        
                    </Card>
                    </Col>
                </Row>
                </PageHeader>
                <Modal visible={this.state.showImgPanel} maskClosable={true} footer={null} onCancel={this.hideImgPanel}>
                    <img alt="课程主图" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        );
    }
}
const LayoutComponent =LabelDetail;
const mapStateToProps = state => {
    return {
        tag_course_list:state.course.tag_course_list,
        user:state.site.user
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
