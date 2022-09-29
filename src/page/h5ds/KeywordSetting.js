import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, InputNumber } from 'antd'
import FormItem from 'antd/lib/form/FormItem';
import AntdOssUpload from '../../components/AntdOssUpload';
import { words } from 'lodash';
class KeywordSetting extends Component {
    state = {
        study_zero: '',
        study_eleven: '',
        study_thirtyone: '',
        study_fiftyone: '',
        rmb_zero: '',
        rmb_onehundred: '',
        rmb_threehundred: '',
        rmb_fivehundred: '',
        problem_one: '',
        problem_two: '',
        problem_three: '',
        problem_four: '',
        problem_five: '',
        problem_six: '',
        imgs: ['', '', '', '', '', '', '', '', '', '', '', '','',''],
        words: ['', '', '', '', '', '', '', '', '', '', '', '','',''],
        inpt: '',
        fileList: [],
        rulePanels: false,
        index: 0,
    }

    page_current = 0
    page_total = 0
    page_size = 10

    componentWillMount() {

    }
    componentWillReceiveProps(n_props) {

    }
    componentDidMount() {
        this.getSetting()
    }
    getSetting = () => {
        this.props.actions.getApplySetting({
            keyy: 'yearbill_key',
            section: 'yearbill',
            resolved: (data) => {
                let val = data[0].val
                let list = val.split(',')
                this.setState({
                    study_zero: list[0],
                    study_eleven: list[1],
                    study_thirtyone: list[2],
                    study_fiftyone:list[3],
                    rmb_zero: list[4],
                    rmb_onehundred: list[5],
                    rmb_threehundred:list[6],
                    rmb_fivehundred:list[7],
                    problem_one: list[8],
                    problem_two: list[9],
                    problem_three:list[10],
                    problem_four: list[11],
                    problem_five:list[12],
                    problem_six: list[13],
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        this.props.actions.getApplySetting({
            keyy: 'yearbill_imgs',
            section: 'yearbill',
            resolved: (data) => {
                let val = data[0].val
                let imgs = val.split(',')
                let lst = []
                this.state.imgs.map((item,index)=>{
                    if(index+1<=imgs.length){
                        lst.push(imgs[index])
                    }else{
                        lst.push('')
                    }
                })
                this.setState({
                    imgs:lst
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        this.props.actions.getApplySetting({
            keyy: 'yearbill_words',
            section: 'yearbill',
            resolved: (data) => {
                let val = data[0].val
                let words = val.split(',')
                let lst = []
                this.state.words.map((item,index)=>{
                    if(index+1<=words.length){
                        lst.push(words[index])
                    }else{
                        lst.push('')
                    }
                })
                this.setState({
                    words:lst
                })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    publishApplySetting = () => {
        const {
            study_zero,
            study_eleven,
            study_thirtyone,
            study_fiftyone,
            rmb_zero,
            rmb_onehundred,
            rmb_threehundred,
            rmb_fivehundred,
            problem_one,
            problem_two,
            problem_three,
            problem_four,
            problem_five,
            problem_six,
            imgs,
            words,
        } = this.state
        if (!study_zero || !study_eleven || !study_thirtyone || !study_fiftyone || !rmb_zero || !rmb_onehundred || !rmb_threehundred || !rmb_fivehundred || !problem_one || !problem_two || !problem_three || !problem_four || !problem_five || !problem_six) {
            message.info({
                content: '请填写完整关键字'
            });
            return
        }
        imgs.map(item => {
            if (!item) {
                message.info({
                    content: '请上传相对应的图片'
                });
                return;
            }
        })
        words.map(item => {
            if (!item) {
                message.info({
                    content: '请填写像对应的介绍'
                });
                return;
            }
        })
        let arr = []
        arr.push(study_zero, study_eleven,
            study_thirtyone,
            study_fiftyone,
            rmb_zero,
            rmb_onehundred,
            rmb_threehundred,
            rmb_fivehundred,
            problem_one,
            problem_two,
            problem_three,
            problem_four,
            problem_five,
            problem_six)
        console.log(arr.toLocaleString(), '???')
        this.props.actions.publishNum({
            keyy: 'yearbill_key',
            section: 'yearbill',
            val: arr.toLocaleString(),
            resolved: (data) => {

            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        this.props.actions.publishNum({
            keyy: 'yearbill_imgs',
            section: 'yearbill',
            val: imgs.toLocaleString(),
            resolved: (data) => {

            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        this.props.actions.publishNum({
            keyy: 'yearbill_words',
            section: 'yearbill',
            val: words.toLocaleString(),
            resolved: (data) => {
                message.success('提交成功')
                setTimeout(() => {
                    window.history.back()
                }, 1000);
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    onBack = () => {
        const { actions } = this.props;
        const { study_zero,
            study_eleven,
            study_thirtyone,
            study_fiftyone,
            rmb_zero,
            rmb_onehundred,
            rmb_threehundred,
            rmb_fivehundred,
            problem_one,
            problem_two,
            problem_three,
            problem_four,
            problem_five,
            problem_six, } = this.state;

        // message.success({
        //     content:'提交成功',
        //     onClose:()=>{
        //         window.history.back()
        //     }
        // })
    }
    onOpen = (val) => {
        let fileList = []
        const { imgs, words } = this.state
        if (imgs[val]) {
            fileList.push({ response: { resultBody: imgs[val] }, type: 'image/png', uid: val, name: 'img' + val, status: 'done', url: imgs[val] })
            this.setState({
                fileList: fileList
            })
        } else {
            this.setState({
                fileList: []
            })
        }
        this.setState({
            index: val,
            inpt: words[val],
            rulePanels: true
        })
    }
    onOk = () => {
        const { index, imgs, words, inpt } = this.state
        const img = (this.imgs && this.imgs.getValue()) || ''
        if (!inpt) { message.info({ content: '请填写介绍' }); return; }
        if (!img) { message.info({ content: '请上传图片' }); return; }
        this.setState({
            imgs: imgs.map((item, idx) => idx == index ? img : item),
            words: words.map((item, idx) => idx == index ? inpt : item),
            rulePanels: false,
        })
    }
    render() {
        const { study_zero,
            study_eleven,
            study_thirtyone,
            study_fiftyone,
            rmb_zero,
            rmb_onehundred,
            rmb_threehundred,
            rmb_fivehundred,
            problem_one,
            problem_two,
            problem_three,
            problem_four,
            problem_five,
            problem_six, } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={() => window.history.back()}
                        title=""
                        subTitle={'关键词设置'}
                        extra={<>
                            <Button onClick={this.publishApplySetting}>保存</Button>
                        </>}
                    >
                        <Card className='mb_10' size='small' title='学习课程数量（门，包含视频、图文、音频）'>
                            <Form labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                                <Form.Item label='0-10门'> <Input value={study_zero} onChange={(e) => { this.setState({ study_zero: e.target.value }) }} className='m_w400' placeholder='关键词'></Input> <Button onClick={this.onOpen.bind(this, 0)} style={{ marginLeft: '30px' }}>详情设置</Button> </Form.Item>
                                <Form.Item label='11-30门'> <Input value={study_eleven} onChange={(e) => { this.setState({ study_eleven: e.target.value }) }} className='m_w400' placeholder='关键词'></Input>  <Button onClick={this.onOpen.bind(this, 1)} style={{ marginLeft: '30px' }}>详情设置</Button> </Form.Item>
                                <Form.Item label='31-50门'> <Input value={study_thirtyone} onChange={(e) => { this.setState({ study_thirtyone: e.target.value }) }} className='m_w400' placeholder='关键词'></Input> <Button onClick={this.onOpen.bind(this, 2)} style={{ marginLeft: '30px' }}>详情设置</Button> </Form.Item>
                                <Form.Item label='51-80门'> <Input value={study_fiftyone} onChange={(e) => { this.setState({ study_fiftyone: e.target.value }) }} className='m_w400' placeholder='关键词'></Input> <Button onClick={this.onOpen.bind(this, 3)} style={{ marginLeft: '30px' }}>详情设置</Button> </Form.Item>
                            </Form>
                        </Card>
                        <Card className='mb_10' size='small' title='课程现金消费（元）'>
                            <Form labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                                <Form.Item label='0-100元'> <Input value={rmb_zero} onChange={(e) => { this.setState({ rmb_zero: e.target.value }) }} className='m_w400' placeholder='关键词'></Input> <Button onClick={this.onOpen.bind(this, 4)} style={{ marginLeft: '30px' }}>详情设置</Button> </Form.Item>
                                <Form.Item label='101-300元'> <Input value={rmb_onehundred} onChange={(e) => { this.setState({ rmb_onehundred: e.target.value }) }} className='m_w400' placeholder='关键词'></Input> <Button onClick={this.onOpen.bind(this, 5)} style={{ marginLeft: '30px' }}>详情设置</Button> </Form.Item>
                                <Form.Item label='301-500元'> <Input value={rmb_threehundred} onChange={(e) => { this.setState({ rmb_threehundred: e.target.value }) }} className='m_w400' placeholder='关键词'></Input> <Button onClick={this.onOpen.bind(this, 6)} style={{ marginLeft: '30px' }}>详情设置</Button> </Form.Item>
                                <Form.Item label='501-800元'> <Input value={rmb_fivehundred} onChange={(e) => { this.setState({ rmb_fivehundred: e.target.value }) }} className='m_w400' placeholder='关键词'></Input> <Button onClick={this.onOpen.bind(this, 7)} style={{ marginLeft: '30px' }}>详情设置</Button> </Form.Item>
                            </Form>
                        </Card>
                        <Form layout='vertical'>
                            <Form.Item label='经常在22：00-06：00时间段学习'> <Input value={problem_one} onChange={(e) => { this.setState({ problem_one: e.target.value }) }} className='m_w400' placeholder='关键词'></Input> <Button onClick={this.onOpen.bind(this, 8)} style={{ marginLeft: '30px' }}>详情设置</Button> </Form.Item>
                            <Form.Item label='关注超过10名讲师'> <Input value={problem_two} onChange={(e) => { this.setState({ problem_two: e.target.value }) }} className='m_w400' placeholder='关键词'></Input> <Button onClick={this.onOpen.bind(this, 9)} style={{ marginLeft: '30px' }}>详情设置</Button> </Form.Item>
                            <Form.Item label='观看超过10场直播'> <Input value={problem_three} onChange={(e) => { this.setState({ problem_three: e.target.value }) }} className='m_w400' placeholder='关键词'></Input>  <Button onClick={this.onOpen.bind(this, 10)} style={{ marginLeft: '30px' }}>详情设置</Button></Form.Item>
                            <Form.Item label='评论超过20条'> <Input value={problem_four} onChange={(e) => { this.setState({ problem_four: e.target.value }) }} className='m_w400' placeholder='关键词'></Input> <Button onClick={this.onOpen.bind(this, 11)} style={{ marginLeft: '30px' }}>详情设置</Button> </Form.Item>
                            <Form.Item label='问吧回复超过10条'> <Input value={problem_five} onChange={(e) => { this.setState({ problem_five: e.target.value }) }} className='m_w400' placeholder='关键词'></Input>  <Button onClick={this.onOpen.bind(this, 12)} style={{ marginLeft: '30px' }}>详情设置</Button></Form.Item>
                            <Form.Item label='商城消费超过全国50%'> <Input value={problem_six} onChange={(e) => { this.setState({ problem_six: e.target.value }) }} className='m_w400' placeholder='关键词'></Input> <Button onClick={this.onOpen.bind(this, 13)} style={{ marginLeft: '30px' }}>详情设置</Button> </Form.Item>
                        </Form>
                    </PageHeader>
                    <Modal title={'详情'} onOk={this.onOk} visible={this.state.rulePanels} maskClosable={false} okText="确定" cancelText='取消' onCancel={() => {
                        this.setState({ rulePanels: false })
                    }}>
                        <FormItem label='图片'>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imgs = ref}
                                listType="picture-card"
                                accept='image/*'
                                maxLength={1}
                                value={this.state.fileList}
                                tip='上传图片'
                            >
                            </AntdOssUpload>
                        </FormItem>
                        <FormItem label='关键字描述'>
                            <Input value={this.state.inpt} onChange={(e) => {
                                this.setState({
                                    inpt: e.target.value
                                })
                            }}></Input>
                        </FormItem>

                    </Modal>
                </Card>
            </div>
        )
    }
}

const LayoutComponent = KeywordSetting;
const mapStateToProps = state => {
    return {
        user: state.site.user,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
