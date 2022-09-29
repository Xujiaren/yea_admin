
import React from "react";
import { Tag,Table as TableAntd, Radio,List, Icon, Avatar, Modal, Form, Card, Select, Input, Button, message } from 'antd';
import moment from 'moment'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import UploadList from 'antd/es/upload/UploadList';
import zhCN from 'antd/es/locale/zh_CN';

export default class PersonType extends React.Component {
    state = {
        dataSource:[],
        title:'',
        ttype:0,
        edit_index:-1,
        topicList: [],
        topicIndex:-1,
    }
    componentDidMount(){
        this.setState({ topicList:this.props.dataSource||[] })
    }
    componentWillReceiveProps(n_props) {
        if (this.props.dataSource !== n_props.dataSource) {
            this.setState({topicList:n_props.dataSource||[]})
        }
    }
    getValue = ()=>{
        return this.state.topicList
    }
    onOk = () => {
        const {dataSource,title,ttype,topicIndex} = this.state
        let {topicList} = this.state
        let empty = false
        let charater = ''
        let options = []
       
        for(let i = 0; i<dataSource.length; i++){
            if(dataSource[i].title == ''){
                charater = String.fromCharCode(i+65)
                empty = true
                break
            }else{
                options.push(dataSource[i].title)
            }
        }

        if(!title){ message.info('请输入题干'); return false;}
        if(ttype !== 4 && dataSource.length==0){
            message.info('请设置选项'); return false;
        }
        if(empty){
            message.info('选项'+charater+'的内容不能为空')
            return false
        }
        if(topicIndex==-1){
            topicList.push({
                name:title,
                uid:Date.now()+'',
                title,
                ttype,
                options: options,
                dataSource: dataSource
            })
        }else{
            topicList[topicIndex].name = title
            topicList[topicIndex].title = title
            topicList[topicIndex].options = options
            topicList[topicIndex].ttype = ttype
            topicList[topicIndex].dataSource = dataSource
        }
        
        this.setState({ topicList,visible:false })
    }
 
    onRemove = index => {
        this.setState((pre)=>{
            const {topicList} = pre
            const newFileList = topicList.filter((_item,_index) => index !== _index);
            return { topicList: newFileList }
        });
    }
    add = ()=>{
        this.setState(pre=>{
            let {dataSource} = pre
            let label = String.fromCharCode(dataSource.length+65) 
            dataSource.push({
                label,
                title:'',
            })
            return{
                edit_value:'',
                dataSource,
                edit_index:dataSource.length-1
            }
        })
    }
    edit(index){
        let {dataSource} = this.state

        this.setState({
            edit_value:dataSource[index].title,
            edit_index:index
        })
    }
    save(index){
        this.setState(pre=>{
            let {edit_value,dataSource} = pre

            dataSource[index].title = edit_value
            return{
                dataSource,
                edit_value:'',
                edit_index:-1
            }
        })
    }
    delete(index){
        this.setState(pre=>{
            let {dataSource} = pre
            dataSource = dataSource.filter((ele,idx)=>{
                return idx !== index
            })
            return{
                dataSource
            }
        })
    }
    onDragEnd = ({ source, destination }) => {
        if(destination == null) return

        const reorder = (list, startIndex, endIndex) => {
          const [removed] = list.splice(startIndex, 1);
          list.splice(endIndex, 0, removed);
    
          return list;
        }

        this.setState(pre=>{
            return {topicList:reorder([...pre.topicList], source.index, destination.index)}
        })
    }
    onEdit = (index)=>{
        const {topicList} = this.state
        const topicIndex = index
        const visible = true
        const {
           title,dataSource,ttype
        } = topicList[index]
        this.setState({ visible,title,dataSource,ttype,topicIndex })
    }
    render() {
        const {title,ttype,topicList} = this.state
        const {disabled} = this.props
        const renderOptions = ()=>{
            const {edit_index} = this.state
            return (
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={this.state.dataSource}
                    renderItem={(item,index) => (
                        <List.Item
                            actions={disabled?null:[
                                <a 
                                    onClick={edit_index === index?
                                        this.save.bind(this,index):
                                        this.edit.bind(this,index)
                                    }
                                    key="list-loadmore-edit"
                                >
                                    {edit_index === index?'保存':'修改'}
                                </a>,
                                <a 
                                    key="list-loadmore-more"
                                    onClick={this.delete.bind(this,index)}
                                >删除</a>
                            ]}
                        >
                            <List.Item.Meta
                                style={{flex:'0 1'}}
                                avatar={
                                    <Avatar style={{background:'#f56a00'}}>{String.fromCharCode(index+65)}</Avatar>
                                }
                            />
                                <div style={{flex:'1 1'}}>
                                    {
                                        this.state.edit_index === index?
                                        <Input.TextArea
                                            autoSize={{minRows:1}}
                                            placeholder='请输入选项内容'
                                            style={{flex:'1 1'}} 
                                            onChange={(e)=>{
                                                this.setState({
                                                    edit_value:e.currentTarget.value
                                                })
                                            }}
                                            value={this.state.edit_value}
                                        />
                                    :
                                        <div style={{flex:'1 1'}}>{item.title?item.title:'空'}</div>
                                    }
                                </div>
                        </List.Item>
                    )}
                />
                
            )
        }
        return (
            <>
                <div className='mb_10'>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable" >
                        {provided => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {topicList.map((item, index) => (
                                <Draggable key={item.uid} draggableId={item.uid} index={index}>
                                    {provided => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <div style={{padding:'10px 0',lineHeight:1.5}}>
                                            <span>{index+1}、 <Tag>{item.ttype==0?'单选题':item.ttype==3?'多选':'开放题'}</Tag></span> 
                                            <span style={{paddingLeft:'10px'}}>{item.title}</span>
                                            {disabled?null:
                                            <span style={{float:'right'}}>
                                                <a onClick={this.onEdit.bind(this,index)} style={{paddingRight:'10px'}}>修改</a>
                                                <a onClick={this.onRemove.bind(this,index)}>删除</a>
                                            </span>
                                            }
                                        </div>
                                    </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                        )}
                    </Droppable>
                    </DragDropContext>
                </div>
                {disabled?null:
                <Button type="dashed" onClick={()=>{ this.setState({ 
                    visible:true,
                    topicIndex: -1,
                    title:'',
                    ttype:0,
                    dataSource:[]
                })}} style={{ minWidth: '10%' }}>
                    <Icon type="plus" /> 添加问卷题目
                </Button>
                }
                <Modal 
                    visible={this.state.visible}
                    onCancel={()=>{ this.setState({visible:false}) }}
                    onOk={this.onOk}
                >
                    <Form wrapperCol={{span:18}} labelCol={{span:6}}>
                        <Form.Item label='题目类型'>
                            <Radio.Group value={this.state.ttype} onChange={(e)=>{
                                if(e.target.value == 4){
                                    this.setState({dataSource:[]})
                                }
                                this.setState({ ttype:e.target.value })
                            }}>
                                <Radio value={0}>单选题</Radio>
                                {/* <Radio value={3}>多选题</Radio>
                                <Radio value={4}>开放题</Radio> */}
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='题干'>
                            <Input.TextArea
                                autoSize={{minRows:4}}
                                onChange={e=>{
                                    this.setState({
                                        title:e.target.value
                                    })
                                }}
                                className="m_w400" 
                                placeholder="输入题干"
                                value={this.state.title}
                            />
                        </Form.Item>
                        {
                        this.state.ttype==4?null:
                        <Form.Item label="选项">
                            <div className='m_w400'>
                                {renderOptions()}
                            </div>
                            <Button type="dashed" onClick={this.add} style={{ minWidth: '10%' }}>
                                <Icon type="plus" /> 添加选项
                            </Button>
                        </Form.Item>
                        }
                    </Form>
                </Modal> 
            </>
        );

        
    }
    
}
// import {useState, userEffect, forwardRef} from 'react'
// export default Quetionna = ({props})=>{

//     const [dataList, setDataList] = useState([]);
//     userEffect(()=>{
//         setDataList(dataList||[])
//     },[props.dataList])

    
//     if(props['ref'])
//         props.ref = this
    
//     return(
//         <>
//             {
//                 dataList.map((ele,index)=>(
//                     <div>{index}</div>
//                 ))
//             }
//         </>
//     )
// }