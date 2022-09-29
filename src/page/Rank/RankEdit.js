import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, InputNumber } from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';
import SwitchCom from '../../components/SwitchCom';
// import Seed from '../Tree/Seed';

class RankEdit extends Component {
    state = {
        view_mode: false,
        course_type: 1,
        course_exchange: 2,
        is_must: 0,
        status: 0,
        id: 0,
        begin_rank: null,
        end_rank: null,
        ctype: 0,
        title: '',
        rank_img: '',
        v_list: [
            { id: 1, title: 2, begin_rank: 1, end_rank: 5, ctype: 1, imgList: [], },
            { id: 2, title: 3, begin_rank: 6, end_rank: 10, ctype: 1, imgList: [], },
            { id: 3, title: 4, begin_rank: 11, end_rank: 20, ctype: 1, imgList: [], },
        ],
        p_list: [],
        fileList: [],
        fileList1: [],
        editPanel: false,
        edit_index: -1,
        edit_title: '',
        edit_intro: '',
        posterList: [],
        imgList: [],
        isVideo: false,
        atype: 0,
    }
    componentWillMount() {
        const { id } = this.props.match.params
        const { path } = this.props.match
        // if(path=='/tree/seed/view/:id'){
        //     this.setState({ view_mode:true })
        // }
        // if(parseInt(id)!==0){
        //     this.setState({id:parseInt(id)})
        // }
        const { actions } = this.props
        if (id == 1) {
            this.setState({ atype: 11 }, () => {
                this.getRanks()
            })
        } else if (id == 2) {
            this.setState({ atype: 12 }, () => {
                this.getRanks()
            })
        } else if (id == 3) {
            this.setState({ atype: 13 }, () => {
                this.getRanks()
            })
        }
        // actions.getCheck(id,'rank')
    }
    getRanks = () => {
        const { actions } = this.props
        const { atype } = this.state
        actions.getRankItem({
            atype: atype
        })
    }
    componentWillReceiveProps(n_props) {
        // if(n_props.check_list!==this.props.check_list){
        //     var list = JSON.parse(n_props.check_list[0].val)
        //     var vlist = []
        //     // var reward = ['谢谢参与','谢谢参与','电脑包','自拍杆','充电宝','电子翻页笔','金币10个','金币50个','金币100个']
        //     Object.keys(list).map((item,index)=>{
        //         let beg = item.split('-')[0]
        //         let en = item.split('-')[1]
        //         // let rew = reward[Object.values(list)[index]]
        //         let typ = 0
        //         if(Object.values(list)[index]>5){
        //             typ = 1
        //         }else{
        //             typ = 2
        //         }
        //         let itms = {
        //             id:index+1,
        //             title:Object.values(list)[index],
        //             begin_rank:parseInt(beg),
        //             end_rank:parseInt(en),
        //             ctype: typ,
        //             imgList: [],
        //         }
        //         vlist = vlist.concat(itms)
        //         this.setState({
        //             v_list:vlist
        //         })
        //     })
        // }
        if (n_props.rank_item !== this.props.rank_item) {
            var list = []
            var val = []
            list = Object.keys(n_props.rank_item)
            val = Object.values(n_props.rank_item)
            console.log(val)
            let lists = []
            list.map((item, idx) => {
                let itms = item.split('-')
                let fileList = []
                fileList.push({ response: { resultBody: val[idx].itemImg }, type: 'image/png', uid: 1, name: 'img' + 1, status: 'done', url: val[idx].itemImg })
                console.log(itms)
                let obj = {
                    id: idx + 1,
                    title: val[idx].itemName,
                    begin_rank: itms[0],
                    end_rank: itms[1],
                    ctype: val[idx].ctype,
                    imgList: fileList
                }
                lists = lists.concat(obj)
            })
            console.log(lists, '??')
            this.setState({
                v_list: lists
            })
        }
    }

    onUpload = (val, idx) => {
        const { begin_rank, end_rank, ctype, title, v_list, atype } = this.state
        // if(!begin_rank||!end_rank){message.info('请输入名次');return;}
        // if(ctype==0){message.info('请选择奖品类型');return;}
        // if(!title){message.info('请输入奖品名称');return;}
        // let rank_img = (this.img && this.img.getValue()) || ''
        // const { id } = this.props.match.params
        // const { path } = this.props.match
        // const activity_id = id
        // let data = {}
        // v_list.map((item,index)=>{
        //     let  begin = item.begin_rank
        //     let end = item.end_rank
        //     let one = begin+'-'+end
        //     let dat = {[one]:item.title}
        //     data = Object.assign(data,dat)
        // })
        // let data_list = JSON.stringify(data)
        // const { actions } = this.props
        // actions.publishRankReward({
        //     activity_id: activity_id,
        //     jsonStr: data_list,
        //     resolved: async (data) => {
        //         message.success({
        //             content: '提交成功',
        //         })
        //     },
        //     rejected: (data) => {
        //         message.error({
        //             content: data
        //         })

        //     }
        // })
        const imgs = (this.img && this.img.getValue()) || ''
        let fileList = []
        console.log(val,'???')
        if (imgs) {
            fileList.push({ response: { resultBody: imgs }, type: 'image/png', uid: 1, name: 'img' + 1, status: 'done', url: imgs })
        } else {
            message.info({
                content: '请上传图片'
            });
            return;
        }
        this.setState({
            v_list: v_list.map((item, index) => index == idx ? { ...item, imgList: fileList } : item)
        })
    }
    onSave=(val)=>{
        console.log(val,'///')
        const{actions}=this.props
        const{atype}=this.state
        let integral=0
        let name = val.title
        if(val.ctype==0){
            if(!parseInt(val.title)){message.info({content:'请填写正确的金币数'});return;}
            integral=parseInt(val.title)
        }
        actions.postRankItem({
            atype:atype,
            begin_index:val.begin_rank,
            end_index:val.end_rank,
            ctype:val.ctype,
            integral:integral,
            itemNum:9999,
            item_index:-1,
            item_img:val.imgList[0].url,
            item_name:name,
            resolved:(res)=>{
                message.success({
                    content:'保存成功'
                })
                this.getRanks()
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    onDelete=(ele)=>{
        const{actions}=this.props
        this.setState({ v_list: this.state.v_list.filter(_ele => ele.id !== _ele.id) })
        actions.deleteRankItem({
            atype:this.state.atype,
            key:ele.begin_rank+'-'+ele.end_rank,
            resolved:(res)=>{
                this.getRanks()
            },
            rejected:(err)=>{
                this.getRanks()
            }
        })
    }
    render() {
        const { view_mode, id, isVideo } = this.state
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle='奖品设置'
                        extra={<Button onClick={() => {
                            let { v_list } = this.state
                            v_list.push({ id: Date.now().toString(), title: '', ctype: 0, begin_rank: 0, end_rank: 0, imgList: [] })
                            this.setState({ v_list })
                        }}>增加名次</Button>}
                    >
                        <Card title="" style={{ minHeight: '400px' }} >
                            <Table rowKey='id' pagination={false} size='small' columns={this.v_col} dataSource={this.state.v_list} bordered={true} />
                        </Card>
                    </PageHeader>
                </Card>

                <Modal visible={this.state.showImgPanel} maskClosable={false} footer={null} onCancel={() => {
                    this.setState({ showImgPanel: false })
                }}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>

            </div>
        )
    }

    v_col = [
        { dataIndex: 'id', key: 'id', title: '序号', render: (item, ele, index) => index + 1 },

        {
            dataIndex: 'rank', key: 'rank', title: '名次', ellipsis: false, render: (item, ele, index) => {
                return (
                    <> 
                        <InputNumber value={ele.begin_rank} min={0} onChange={val => {
                            const { v_list } = this.state
                            message.info({content:'如修改名次，请删除本条记录重新添加'})
                            if (val !== '' && !isNaN(val)) {
                                val = Math.round(val)
                                if (val < 0) val = 0
                                this.setState({ begin_list: parseInt(val), v_list: v_list.map((_item, idx) => idx === index ? { ..._item, begin_rank: parseInt(val) } : _item) })
                            }
                        }} />
                        <span className="pad_l5 pad_r5">至</span>
                        <InputNumber value={ele.end_rank} min={0} onChange={val => {
                            const { v_list } = this.state
                            message.info({content:'如修改名次，请删除本条记录重新添加'})
                            if (val !== '' && !isNaN(val)) {
                                val = Math.round(val)
                                if (val < 0) val = 0
                                this.setState({ end_list: parseInt(val), v_list: v_list.map((_item, idx) => idx === index ? { ..._item, end_rank: parseInt(val) } : _item) })
                            }
                        }} />
                    </>
                )
            }
        },
        {
            dataIndex: 'ctype', key: 'ctype', title: '奖品类型', render: (item, ele, index) => {
                return (
                    <Select value={ele.ctype} onChange={val => {
                        const { v_list } = this.state
                        this.setState({ v_list: v_list.map((_item, idx) => idx === index ? { ..._item, ctype: val } : _item) })
                    }}>
                        <Select.Option value={0}>金币</Select.Option>
                        <Select.Option value={1}>实物</Select.Option>
                    </Select>
                )
            }
        },
        {
            dataIndex: 'title', key: 'title', title: '奖品名称/金币数量', render: (item, ele, index) => {
                return (
                    <Input value={ele.title} onChange={(e) => {
                        const { v_list } = this.state
                        this.setState({ title: e.target.value, v_list: v_list.map((_item, idx) => idx === index ? { ..._item, title: e.target.value } : _item) })
                    }}></Input>
                    // <Select defaultValue={2} style={{width:'200px'}} value={ele.title} onChange={val => {
                    //     const {v_list} = this.state
                    //     // this.setState({v_list:v_list.map((_item,idx)=>idx===index?{..._item,title:val}:_item) })
                    //     if(val>5){
                    //         this.setState({v_list:v_list.map((_item,idx)=>idx===index?{..._item,ctype:1,title:val}:_item) })
                    //     }else{
                    //         this.setState({v_list:v_list.map((_item,idx)=>idx===index?{..._item,ctype:2,title:val}:_item) })
                    //     }
                    // }}>
                    //     <Select.Option value={2}>电脑包</Select.Option>
                    //     <Select.Option value={3}>自拍杆</Select.Option>
                    //     <Select.Option value={4}>充电宝</Select.Option>
                    //     <Select.Option value={5}>电子翻页笔</Select.Option>
                    //     <Select.Option value={6}>金币10个</Select.Option>
                    //     <Select.Option value={7}>金币50个</Select.Option>
                    //     <Select.Option value={8}>金币100个</Select.Option>
                    // </Select>
                )
            }
        },
        {
            dataIndex: 'img_list', key: 'img_list', title: '奖品图片', render: (item, ele, index) => {
                return <AntdOssUpload
                    actions={this.props.actions}
                    disabled={this.state.view_mode}
                    ref={ref => this.img = ref}
                    value={ele.imgList}
                    listType="picture-card"
                    maxLength={1}
                    accept='image/*'
                ></AntdOssUpload>
            }
        },
        {
            dataIndex: 'img', key: 'img', title: '操作', render: (item, ele, index) => {
                return <div>
                    {/* <a onClick={() => {
                        const { v_list } = this.state
                        if (v_list.length == 3) { message.info('请保留3个名次'); return; }
                        this.setState({ v_list: v_list.filter(_ele => ele.id !== _ele.id) })
                    }}>删除</a> */}
                      <a onClick={this.onDelete.bind(this,ele)}>删除</a>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Popconfirm
                        value='save'
                        title={"确定保存吗？"}
                        onConfirm={this.onSave.bind(this, ele)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <a onClick={this.onUpload.bind(this, ele, index)}>保存</a>
                        </Popconfirm>
                </div>
            }
        },
    ]

}

const LayoutComponent = RankEdit;
const mapStateToProps = state => {
    return {
                        user: state.site.user,
        check_list:state.ad.check_list,
        rank_item:state.ad.rank_item,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
