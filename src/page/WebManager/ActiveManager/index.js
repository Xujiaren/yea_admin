import React, { Component } from 'react';
import { Col, Row, Table } from 'reactstrap';
import { Pagination, Upload, Form, Modal,Switch, Select, Tabs, Card, DatePicker, Menu, Dropdown, Icon, message, Input, InputNumber } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import connectComponent from '../../../util/connect';
import config from '../../../config/config';
import _ from 'lodash'
import AntdOssUpload from '../../../components/AntdOssUpload'
import { Button, Popconfirm } from '../../../components/BtnComponent'
import action from '../../../redux/action';
import FontSize from '../../../components/braft-editor/components/business/FontSize';

const { TabPane } = Tabs;
const { Search, TextArea } = Input;
const { Option } = Select;
function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class ActiveManager extends Component {


    state = {
        tab: '1',

        edit: false,
        view: false,
        rule: '',
        previewVisible: false,
        previewImage: '',

        integral: 0,
        gift_name: '',
        gift_img: '',
        gift_id: '',
        status: '',
        gtype: '0',

        showAddProduct: false,
        showAddCard: false,
        showRule: false,
        showRecord: false,
        fileList: [],
        cardFileList: [],
        isCoinType: false,
        showCoin: false,
        coin: 0,

        isEdit: false,

        method: '',
        rate_two: 0,
        rate_three: 0,
        set: null,
        rate: null,
        tuser_tax: 0,
        vuser_tax: 0,
        user_tax: 0,
        user_tab: 0,
        recharge: [],
        img: [],
        cardList: [
            {
                isZero: false,
                isCoinType: false,

                ctype: 0,
                activity_id: 1,
                integral: 0,
                item_img: '',
                item_index: 0,
                item_name: '',
                itemNum: 0,
                rate: 0,
                fileList: []
            }
        ],
        type: '0',
        integral: 0,
        itemNum: 9999,
        item_img: '',
        item_name: '',
        list: [],
        id: '',
        showsetting: false,
        reward: [],
        rewards: [],
        activeTab: '0',
        showsettings: false,
        sn: 0,
        rid: 0,
        user_taxs: 0,
        rulePanel:false,
        text: '',
		iftext: '',
		rulePanels: false,
		ttext: '',
		again_one: 0,
		again_two: 0,
		agree: 0,
		forOut:false,
        zhun_list:[],
        zhun_lists:[],
        page_currentsss:0,
        page_totalsss:0,
        page_currentssss:0,
        page_totalssss:0,
        act:'1',
        mobile:'',
        userId:'',
        exportLoading:false,
    }

    gift_list = []
    page_total = 0
    page_current = 1
    page_size = 10
    page_currents = 0
    page_totals = 0
    page_currentss = 0
    page_totalss = 0
    page_currentsss = 0
    page_totalsss = 0
    active_list = []
    active_info = {}
    active_item_list = []

    add = () => {
        this.setState(pre => {
            let obj = pre.cardList
            obj.push({
                isZero: false,
                isCoinType: false,

                ctype: 0,
                activity_id: 1,
                integral: 0,
                item_img: '',
                item_index: 3,
                item_name: '',
                itemNum: 0,
                rate: 0,
                fileList: []
            })
            return {
                cardList: obj
            }
        })
    }
    componentWillMount() {
        const { search } = this.props.history.location
        if (search.indexOf('tab=') > -1) {
            let tab = search.split('=')[1]
            this.setState({ tab })
        }
        let page = 0
        if (search.indexOf('page=') > -1) {
            page = search.split('=')[1] - 1
            this.page_currents = page
            this.page_currentss = page
        }
        this.reward()
        this.rewards()
        this.Text()
        this.zhunru(this.state.page_currentsss)
        this.zhunrus(this.state.page_currentssss)
    }
   
    Text = () => {
		const { actions } = this.props
		// actions.getCheck('fund_text', 'teacher')
		// actions.getNumss('fund_iftext', 'teacher')
		actions.postZhunru({
			again:0,
			open:1,
			text:'',
			v:0,
			agree:0,
			agree_text:'',
            keyy:'rewards_text',
            key:'teacher',
			resolved:(res)=>{
				console.log(res)
				this.setState({
					agree:res.agree,
					text:res.text,
					iftext:res.agreeText,
					again_two:res.again
				})
			},
			rejected:(err)=>{
				console.log(err)
			}
		})
	}
    reward = () => {
        const { actions } = this.props
        actions.getRewardss(0, 1, this.page_currents, this.page_size)
    }
    rewards = () => {
        const { actions } = this.props
        actions.getRewardsss(0, 2, this.page_currents, this.page_size)
    }
    recharge = () => {
        const { actions } = this.props
        actions.getRecharge()
    }
    Num = () => {
        const { actions } = this.props
        actions.getNum('', 'reward')
    }
    componentDidMount() {
        const { actions } = this.props
        actions.getGift({
            page: this.page_current - 1,
            pageSize: this.page_size,
            gtype: this.state.gtype
        })
        actions.getActiveInfo({ activity_id: 1 })
        actions.getActiveItem({ activity_id: 1 })
        this.Num()
        this.recharge()
    }
    componentWillReceiveProps(n_props) {

        if (n_props.gift_list !== this.props.gift_list) {
            this.gift_list = n_props.gift_list.data
            this.page_total = n_props.gift_list.total
            this.page_current = n_props.gift_list.page + 1

        }
        if (n_props.active_info !== this.props.active_info) {
            console.log(this.active_info)
            this.active_info = n_props.active_info
            this.setState({
                rule: this.active_info.rule,
                coin: this.active_info.integral
            })
        }
        if (n_props.recharge !== this.props.recharge) {
            this.setState({
                recharge: n_props.recharge
            })
        }
        if (n_props.item !== this.props.item) {
            let list = []
            let imgs = n_props.item.itemImg.split(',')
            imgs.map((ele, idx) => {
                list.push({
                    response: { resultBody: ele },
                    uid: idx,
                    name: 'img' + idx,
                    status: 'done',
                    url: ele,
                    type: 'image/png'
                })
            })
            this.setState({
                type: n_props.item.ctype.toString(),
                integral: n_props.item.integral,
                item_img: n_props.item.itemImg,
                item_name: n_props.item.itemName,
                itemNum: n_props.item.itemNum,
                List: list,
            })
        }
        if (n_props.rewards !== this.props.rewards) {
            this.setState({
                reward: n_props.rewards.data
            })
            this.page_currents = n_props.rewards.page
            this.page_totals = n_props.rewards.total
        }
        if (n_props.rewardss !== this.props.rewardss) {
            this.setState({
                rewards: n_props.rewardss.data
            })
            this.page_currentss = n_props.rewardss.page
            this.page_totalss = n_props.rewardss.total
        }
        if (n_props.num !== this.props.num) {
            this.setState({
                rate_two: parseInt(n_props.num.filter(item => item.keyy == 'teacher_course_rate')[0].val),
                rate_three: parseInt(n_props.num.filter(item => item.keyy == 'teacher_reward_rate')[0].val),
                vuser_tax: parseInt(n_props.num.filter(item => item.keyy == 'teacher_course_by_rate')[0].val),
                user_tax: parseInt(n_props.num.filter(item => item.keyy == 'auth_user_rate')[0].val),
                user_taxs: parseInt(n_props.num.filter(item => item.keyy == 'user_course_rate')[0].val),
            })
        }
        if (n_props.active_item_list !== this.props.active_item_list) {
            this.active_item_list = n_props.active_item_list.data
            let _active_item = []
            this.active_item_list.map((ele, idx) => {
                let isCoinType = ele.ctype == 1 ? true : false
                _active_item.push(
                    {
                        isZero: false,
                        isCoinType: isCoinType,

                        ctype: ele.ctype,
                        activity_id: ele.activityId,
                        integral: ele.integral,
                        item_img: ele.itemImg,
                        item_index: ele.itemIndex,
                        item_name: ele.itemName,
                        itemNum: ele.itemNum,
                        rate: ele.rate,
                        fileList: [{
                            response: { resultBody: ele.itemImg },
                            uid: idx,
                            name: 'img' + idx,
                            status: 'done',
                            url: ele.itemImg,
                            type: 'image/png'
                        }]
                    }
                )
            })
            this.setState({
                cardList: _active_item
            })

        }

    }
    setBgImg = () => {
        if (this.img) {
            const url = this.img.getValue() || ''
            if (url == '') { message.info('请上传图片'); return; }
            const { actions } = this.props
            const {
                activityId: activity_id,
                atype: atype,
                content: content,
                integral: integral,
                status: status,
                title: title,
                beginTime: begin_time,
                endTime: end_time,
                rule: rule
            } = this.active_info

            actions.publishActive({
                url,
                begin_time,
                end_time,
                activity_id,
                atype,
                content,
                integral,
                rule,
                status,
                title,
                resolved: (data) => {
                    this.setState({
                        showBgImg: false,
                    });
                    message.success('提交成功')
                },
                rejected: (data) => {
                    message.error(data)
                }
            })
        }
    }
    onUp = () => {
        const { set, method, rate, vuser_tax, user_tax, user_tab, rate_two, rate_three, user_taxs } = this.state
        // if (!rate_two) { message.info('请输入讲师比例（如没有，请填"0"）'); return; }
        if (rate_two < 0 || rate_two > 100) { message.info('讲师数量不能超过100'); return; }
        // if (!rate_three) { message.info('请输入讲师比例（如没有，请填"0"）'); return; }
        // if (!vuser_tax) { message.info('请输入老师佣金比例（如没有，请填"0"）'); return; }
        // if (!user_tax) { message.info('请输入认证或非认证佣金比例'); return; }
        if (rate_three < 0 || rate_three > 100) { message.info('讲师数量不能超过100'); return; }
        if (vuser_tax + user_tax + user_taxs > 100) { message.info('佣金比例不能超过100'); return; }
        const { actions } = this.props
        actions.publishReward({
            method: 'set',
            rate: rate_two,
            type: 0,
            resolved: (data) => {
                this.Num()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
        actions.publishReward({
            method: 'set',
            rate: rate_three,
            type: 1,
            resolved: (data) => {
                this.Num()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
        actions.publishReward({
            method: 'set',
            rate: vuser_tax,
            type: 2,
            resolved: (data) => {
                this.Num()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
        actions.publishReward({
            method: 'set',
            rate: user_tax,
            type: 3,
            resolved: (data) => {
                message.success('提交成功')
                this.Num()
            },
            rejected: (data) => {
                message.error(data)
            }
        })
        actions.publishReward({
            method: 'set',
            rate: user_taxs,
            type: 4,
            resolved: (data) => {
                message.success('提交成功')
                this.Num()
                this.setState({
                    tab: '1',
                })
            },
            rejected: (data) => {
                message.error(data)
            }
        })
        // if (user_tab == 0) {
        //     actions.publishReward({
        //         method: 'set',
        //         rate: user_tax,
        //         type: 3,
        //         resolved: (data) => {
        //             message.success('提交成功')
        //             this.setState({
        //                 tab: '1',
        //                 user_tab: 0
        //             })
        //             this.Num()
        //         },
        //         rejected: (data) => {
        //             message.error(data)
        //         }
        //     })
        // } else if (user_tab == 1) {
        //     let use_tax = 100 - vuser_tax - user_tax
        //     console.log(user_tax)
        //     actions.publishReward({
        //         method: 'set',
        //         rate: use_tax,
        //         type: 3,
        //         resolved: (data) => {
        //             message.success('提交成功')
        //             this.setState({
        //                 tab: '1',
        //                 user_tab: 0
        //             })
        //             this.Num()
        //         },
        //         rejected: (data) => {
        //             message.error(data)
        //         }
        //     })
        // }

    }
    _onPublishCoin = () => {
        const { actions } = this.props
        const { coin: integral } = this.state
        const {
            activityId: activity_id,
            atype: atype,
            content: content,
            status: status,
            title: title,
            beginTime: begin_time,
            endTime: end_time,
            rule: rule
        } = this.active_info
        if (integral == '') {
            message.info('请输入金币再提交')
            return
        }
        if (integral > 10000) {
            message.info('金币数不能大于1万')
            return
        }
        actions.publishActive({
            begin_time,
            end_time,
            activity_id,
            atype,
            content,
            integral,
            rule,
            status,
            title,
            resolved: (data) => {
                this.setState({
                    showCoin: false,
                });
                message.success('提交成功')
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    _onUpdateRule = () => {
        const { actions } = this.props
        const { rule } = this.state
        const {
            activityId: activity_id,
            atype: atype,
            content: content,
            integral: integral,
            status: status,
            title: title,
            beginTime: begin_time,
            endTime: end_time
        } = this.active_info
        if (!rule) {
            message.info('请输入数据再提交')
            return
        }
        actions.publishActive({
            begin_time,
            end_time,
            activity_id,
            atype,
            content,
            integral,
            rule,
            status,
            title,
            resolved: (data) => {
                this.setState({
                    showRule: false,
                });
                message.success('提交成功')
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    _onDelete(id) {
        const { actions } = this.props
        actions.updateGift({
            action: 'delete', gift_id: id,
            resolved: (data) => {
                actions.getGift({ page: this.page_current - 1 })
                message.success('操作成功')
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    _onPublishCard(index) {

        const { actions } = this.props
        let obj = this.state.cardList[index]
        let {
            activity_id,
            ctype,
            integral,
            itemNum,
            item_img,
            item_index,
            item_name,
            rate
        } = obj

        if (!item_name) {
            message.info('请输入商品名称')
            return
        }
        if (!item_img) {
            message.info('请上传卡牌图片')
            return
        }
        if (rate > 1000) {
            message.info('中奖概率不能超过1000')
            return
        }
        if (itemNum > 30000) {
            message.info('商品数量不能超过3万')
            return
        }
        if (integral > 30000) {
            message.info('金币面额不能超过3万')
            return
        }
        actions.publishActiveItem({
            activity_id,
            ctype,
            integral,
            itemNum,
            item_img,
            item_index,
            item_name,
            rate,
            resolved: (data) => {
                message.success('提交成功')
                actions.getActiveItem({ activity_id: 1 })
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    _onPage = (val) => {
        const { actions } = this.props;
        actions.getGift({ page: val - 1 })
    }
    _onPublish = () => {
        const { gift_id, gift_img, gift_name, integral, status, gtype } = this.state
        if (!gift_name) {
            message.info('请输入礼物名称'); return;
        }
        if (!gift_img) {
            message.info('请上传礼物图片'); return;
        }
        if (integral > 30000) {
            message.info('金币花费不能超过3万'); return;
        }
        const { actions } = this.props
        actions.publishGift({
            gift_id, gift_img, gift_name, integral, status, gtype,
            resolved: (data) => {
                actions.getGift({ page: this.page_current - 1 })
                message.success('提交成功')
                this.hideAddProduct()
            }
        })
    }

    showAddProduct() {
        let isEdit = false
        this.setState({
            fileList: [],
            integral: 0,
            gift_name: '',
            gift_img: '',
            gift_id: '',
            status: 1,
            isEdit: isEdit,
            showAddProduct: true,
        });
    };
    onEdit(index) {
        let { giftId, giftImg, giftName, integral, status } = this.gift_list[index]
        let fileList =
            [{
                response: { resultBody: giftImg },
                uid: '-1',
                name: 'img',
                status: 'done',
                url: giftImg,
                type: 'image/png'
            }];
        this.setState({
            fileList: fileList,
            integral: integral,
            gift_name: giftName,
            gift_img: giftImg,
            gift_id: giftId,
            status: status,
            isEdit: true,
            showAddProduct: true,
        })
    }
    hideAddProduct = () => {
        this.setState({
            showAddProduct: false,
        });
    };
    showAddCard(edit) {
        let isEdit = false
        if (edit === "edit") {
            isEdit = true
        }
        this.setState({
            isEdit: isEdit,
            showAddCard: true,
        });
    };
    showRecord = () => {
        this.setState({
            showRecord: true,
        });
    }
    hideRecord = () => {
        this.setState({
            showRecord: false,
        });
    }
    showRule = () => {
        this.setState({
            showRule: true,
        });
    }
    hideRule = () => {
        this.setState({
            showRule: false,
        });
    }
    hideCoin = () => {
        this.setState({
            showCoin: false,
        });
    }
    hideAddCard = () => {
        this.setState({
            showAddCard: false,
        });
    };


    uploadChangeCard = ({ cardFileList }) => this.setState({ cardFileList });
    uploadChange = ({ fileList }) => {
        let img = []
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                img.push(ele.url)
            }
        })

        this.setState({
            fileList: fileList,
            gift_img: img.join(',')
        })
    };
    onEdite = (val) => {
        const { actions } = this.props
        this.setState({ showsetting: true, id: val.rechargeId })
        let recharge_id = val.rechargeId
        actions.getRechargeitem(recharge_id)
    }
    onOk = () => {
        const { actions } = this.props
        const { type, integral, itemNum, item_name, id } = this.state
        const img = (this.imgss && this.imgss.getValue()) || ''
        actions.publishRechargeitem({
            v: 1,
            recharge_id: id,
            ctype: parseInt(type),
            integral: integral,
            itemNum: itemNum,
            item_name: item_name,
            item_img: img,
            resolved: (res) => {
                message.success({
                    content: '操作成功'
                })
                this.setState({
                    showsetting: false
                })
                this.recharge()
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    handleCancelModal = () => this.setState({ previewVisible: false });
    on_change = (e) => {
        this.setState({ activeTab: e })
        this.page_currentss = 0
        this.page_currents = 0
        this.page_currentsss = 0
    }
    onOkey = () => {
        const { actions } = this.props
        const { rid, sn } = this.state
        if (!sn) { message.info({ content: '请填写单号' }); return; }
        actions.postReward({
            reward_id: rid,
            ship_sn: sn,
            resolved: (res) => {
                message.success({
                    content: "操作成功"
                })
                this.setState({
                    showsettings: false
                })
                this.reward()
                this.rewards()
            }
        })
    }
    onOkey = (val) => {
		const { text, iftext,agree,again_two } = this.state
		const { actions } = this.props
		actions.postZhunru({
			again:again_two,
			open:1,
			text:text,
			v:1,
			agree:agree,
			agree_text:iftext,
            keyy:'rewards_text',
            key:'teacher',
			resolved:(res)=>{
				message.success({
					content: '提交成功'
				})
				this.setState({
					rulePanel: false
				})
			},
			rejected:(err)=>{
				console.log(err)
			}
		})
	}
    zhunru=(val)=>{
        let lst=0
        if(this.state.userId){
            lst=parseInt(this.state.userId)
            if(!lst){
                message.info({content:'请输入正确的用户ID'})
                return;
            }
        }
        this.props.actions.getZhunruUser({
            type:0,
            page:val,
            pageSize:10,
            mobile:this.state.mobile,
            userId:lst,
            resolved:(res)=>{
                this.setState({
                    zhun_list:res.data,
                    page_totalsss:res.total
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
    zhunrus=(val)=>{
        let lst=0
        if(this.state.userId){
            lst=parseInt(this.state.userId)
            if(!lst){
                message.info({content:'请输入正确的用户ID'});
                return;
            }
        }
        this.props.actions.getZhunruUser({
            type:1,
            page:val,
            pageSize:10,
            mobile:this.state.mobile,
            userId:lst,
            resolved:(res)=>{
                this.setState({
                    zhun_lists:res.data,
                    page_totalssss:res.total
                })
            },
            rejected:(err)=>{
                console.log(err)
            }
        })
    }
   onExports=(val)=>{
        let lst=0
        if(this.state.userId){
            lst=parseInt(this.state.userId)
            if(!lst){
                message.info({content:'请输入正确的用户ID'});
                return;
            }
        }
        this.setState({
            exportLoading:true
        })
        this.props.actions.getZhunruExport({
            type:val,
            mobile:this.state.mobile,
            userId:lst,
            resolved:(res)=>{
                message.success({content:'操作成功'})
                window.open(res.address)
                this.setState({
                    exportLoading:false
                })
            },
            rejected:(err)=>{
                console.log(err)
                this.setState({
                    exportLoading:false
                })
            }
        })
   }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        const uploadButtonImg = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const { cardList, tab } = this.state
        return (
            <div className="animated fadeIn">
                <Card bodyStyle={{ paddingTop: 0 }}>
                    <Tabs activeKey={this.state.tab} onChange={val => {
                        let pathname = this.props.history.location.pathname
                        this.setState({ tab: val })
                        this.props.history.replace(pathname + '?tab=' + val)
                    }}>
                        <TabPane tab="打赏设置" key="1">
                            <Card
                                type="inner"
                                title="礼物列表"
                                extra={
                                    <div>
                                        <Button className='m_2' style={{ marginLeft: '30px' }} onClick={() => {
                                            this.setState({ rulePanel: true })
                                        }}>准入文案编辑</Button>
                                        <Button value='cardActive/giftAdd' onClick={this.showAddProduct.bind(this, 'add')}>添加礼物</Button>
                                        {/*<Button onClick={this.showRecord}>打赏记录</Button>*/}
                                    </div>
                                }
                                bodyStyle={{ paddingTop: 0 }}
                            >
                                <Table responsive size="sm" className="v_middle">
                                    <thead>
                                        <tr>
                                            <th>礼物名称</th>
                                            <th>礼物图片</th>
                                            <th>金币花费</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.gift_list.map((ele, index) =>
                                            <tr key={ele.giftId + 'gift'}>
                                                <td style={{ width: "100px" }}>{ele.giftName}</td>
                                                <td>
                                                    <a>
                                                        <img src={ele.giftImg} style={{ height: 'auto', width: '60px', margin: '20px 0', display: 'block' }} />
                                                    </a>
                                                </td>
                                                <td>{ele.integral}</td>
                                                <td style={{ width: '220px' }}>
                                                    <div>
                                                        <Button value='cardActive/edit' onClick={this.onEdit.bind(this, index)} type="primary" size={'small'}>修改</Button>&nbsp;
                                                        <Popconfirm
                                                            value='cardActive/del'
                                                            cancelText="取消"
                                                            okText="确定"
                                                            title="确定删除吗？"
                                                            onConfirm={this._onDelete.bind(this, ele.giftId)}
                                                        >
                                                            <Button type="danger" size={'small'}>删除</Button>
                                                        </Popconfirm>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <Pagination showTotal={() => ('总共' + this.page_total + '条')} showQuickJumper pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                            </Card>
                        </TabPane>
                        <TabPane tab="翻牌抽奖" key="2">
                            <Card
                                type="inner"
                                title="卡牌列表"
                                extra={
                                    <Input.Group compact>
                                        {/*<Button onClick={this.add}>添加</Button>
                                    */}
                                        <Button value='cardActive/post' onClick={() => {
                                            this.setState({
                                                showBgImg: true,
                                                img: [{
                                                    uid: '88',
                                                    url: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/$activity_img.png?' + Date.now(),
                                                    status: 'done',
                                                    type: 'image/png'
                                                }]
                                            })
                                        }}>设置翻牌封面</Button>
                                        <Button value='cardActive/coinsetting' onClick={() => { this.setState({ showCoin: true }) }}>设置金币消耗</Button>

                                        <Button value='cardActive/list' onClick={() => {
                                            this.props.history.push("/web-manager/active-manager/lucky-list")
                                        }}>获奖列表</Button>
                                        <Button value='cardActive/rulesetting' onClick={this.showRule}>翻牌规则</Button>

                                    </Input.Group>
                                }
                                bodyStyle={{ paddingTop: 0 }}
                            >
                                <Table responsive size="sm" className="v_middle">
                                    <thead>
                                        <tr>
                                            <th>卡牌名称</th>
                                            <th>卡牌图片<span className="be_ll_gray">(77px * 77px)</span></th>
                                            <th>商品名称</th>
                                            <th>中奖概率</th>
                                            <th>中奖类型</th>
                                            <th>金币面额</th>
                                            <th>商品数量<span className="be_ll_gray">(值为0时中奖概率为0)</span></th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cardList.map((ele, index) =>
                                            <tr key={'list' + index}>
                                                <td>牌{index + 1}</td>
                                                <td>
                                                    <AntdOssUpload
                                                        showMedia={false}
                                                        className="mt_10"
                                                        listType="picture-card"
                                                        value={ele.fileList}
                                                        onChange={({ fileList }) => {
                                                            let img = []
                                                            fileList.map((_ele) => {
                                                                if (_ele.status == 'done') {
                                                                    img.push(_ele.url)
                                                                }
                                                            })

                                                            this.setState(pre => {
                                                                let obj = pre.cardList
                                                                obj[index].fileList = fileList
                                                                obj[index].item_img = img.join(',')
                                                                return {
                                                                    cardList: obj
                                                                }
                                                            })
                                                        }}
                                                        accept='image/*'
                                                    >
                                                    </AntdOssUpload>
                                                </td>
                                                <td>
                                                    <Input
                                                        value={ele.item_name}
                                                        placeholder="输入商品名称"
                                                        onChange={e => {
                                                            let _val = e.target.value
                                                            this.setState(pre => {
                                                                let _list = pre.cardList
                                                                _list[index].item_name = _val

                                                                return {
                                                                    cardList: _list
                                                                }
                                                            })
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <InputNumber
                                                        min={0}
                                                        value={ele.rate}
                                                        onChange={val => {
                                                            if (val !== '' && !isNaN(val)) {
                                                                val = Math.round(val)
                                                                if (val < 0) val = 0
                                                                this.setState(pre => {
                                                                    let _list = pre.cardList
                                                                    _list[index].rate = val
                                                                    return {
                                                                        cardList: _list
                                                                    }
                                                                })
                                                            }
                                                        }}
                                                        placeholder="中奖概率"
                                                    />
                                                </td>
                                                <td>
                                                    <Select
                                                        style={{ width: '100px' }}
                                                        value={ele.ctype}
                                                        onChange={val => {
                                                            this.setState(pre => {
                                                                let obj = pre.cardList

                                                                obj[index].ctype = val

                                                                if (val === 1) {
                                                                    obj[index].isCoinType = true
                                                                }
                                                                else {
                                                                    obj[index].integral = 0
                                                                    obj[index].isCoinType = false
                                                                }
                                                                return { cardList: obj }
                                                            })
                                                        }}
                                                    >
                                                        <Select.Option value={0}>无</Select.Option>
                                                        <Select.Option value={1}>金币</Select.Option>
                                                        <Select.Option value={2}>实物</Select.Option>
                                                    </Select>
                                                </td>
                                                <td>
                                                    <InputNumber
                                                        min={0} max={800000}
                                                        disabled={ele.isCoinType ? false : true}
                                                        placeholder="输入金币面额"
                                                        value={ele.integral}
                                                        onChange={val => {
                                                            if (val !== '' && !isNaN(val)) {
                                                                val = Math.round(val)
                                                                if (val < 0) val = 0
                                                                this.setState(pre => {
                                                                    let _list = pre.cardList
                                                                    _list[index].integral = val
                                                                    return {
                                                                        cardList: _list
                                                                    }
                                                                })
                                                            }
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ position: 'relative' }}>
                                                    <InputNumber
                                                        min={0} max={80000}
                                                        placeholder="输入商品数量"
                                                        style={{ width: "150px" }}
                                                        value={ele.itemNum}
                                                        onChange={val => {
                                                            if (val !== '' && !isNaN(val)) {
                                                                val = Math.round(val)
                                                                if (val < 0) val = 0
                                                                this.setState(pre => {
                                                                    let _list = pre.cardList
                                                                    _list[index].itemNum = val
                                                                    if (val == 0)
                                                                        _list[index].isZero = true
                                                                    else
                                                                        _list[index].isZero = false
                                                                    return {
                                                                        cardList: _list
                                                                    }
                                                                })
                                                            }

                                                        }}
                                                    />
                                                    <div
                                                        className="be_ll_gray"
                                                        style={{ position: 'absolute', bottom: "25px" }}
                                                    >{ele.isZero ? "中奖概率将为0" : null}
                                                    </div>
                                                </td>
                                                <td style={{ width: '220px' }}>
                                                    <div>
                                                        <Button value='cardActive/edit' onClick={this._onPublishCard.bind(this, index)}>提交</Button>&nbsp;
                                                        {/*<Button size={'small'}>删除</Button>*/}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>

                            </Card>
                        </TabPane>
                        <TabPane tab="分成" key="3">
                            <div style={{ height: '600px' }}>
                                <div style={{ border: '1px solid #cccccc', marginTop: '20px' }}>
                                    <div>课程分成</div>
                                    <div style={{ marginLeft: '40px', padding: '20px' }}>
                                        <span>讲师&nbsp;&nbsp;</span>
                                        <InputNumber value={this.state.rate_two} min={0} onChange={rate_two => this.setState({ rate_two })} style={{ width: '150px' }} />
                                        <div style={{ color: 'red', fontSize: '12px', marginLeft: '40px' }}>其余分成归平台所有（如没有，请填"0"）</div>
                                    </div>
                                </div>
                                <div style={{ border: '1px solid #cccccc', marginTop: '20px' }}>
                                    <div>打赏分成</div>
                                    <div style={{ marginLeft: '40px', padding: '20px' }}>
                                        <span>讲师&nbsp;&nbsp;</span>
                                        <InputNumber value={this.state.rate_three} min={0} onChange={rate_three => this.setState({ rate_three })} style={{ width: '150px' }} />
                                        <div style={{ color: 'red', fontSize: '12px', marginLeft: '40px' }}>其余分成归平台所有（如没有，请填"0"）</div>
                                    </div>
                                </div>
                                <div style={{ border: '1px solid #cccccc', marginTop: '20px' }}>
                                    <div>推课佣金</div>
                                    <div style={{ margin: '30px 40px' }}>
                                        <div>
                                            老师佣金比例&nbsp;&nbsp;<InputNumber value={this.state.vuser_tax} min={0} onChange={vuser_tax => this.setState({ vuser_tax })} />
                                            <div style={{ color: 'red', fontSize: '12px', marginTop: '6px', marginLeft: '100px' }}>如没有，请填"0"</div>
                                        </div>
                                        <div style={{ marginTop: '10px' }}>
                                            {/* <Select style={{ width: '16%' }} value={this.state.user_tab} onChange={val => {
                                                this.setState({ user_tab: val })
                                            }}>
                                                <Option value={0}>认证佣金比例</Option>
                                                <Option value={1}>非认证佣金比例 </Option>
                                            </Select> */}
                                            <span style={{ marginRight: '10px' }}>认证佣金比例</span>
                                            <InputNumber value={this.state.user_tax} min={0} onChange={user_tax => this.setState({ user_tax })} style={{ width: '150px' }} />
                                        </div>
                                        <div style={{ marginTop: '10px' }}>
                                            {/* <Select style={{ width: '16%' }} value={this.state.user_tab} onChange={val => {
                                                this.setState({ user_tab: val })
                                            }}>
                                                <Option value={0}>认证佣金比例</Option>
                                                <Option value={1}>非认证佣金比例 </Option>
                                            </Select> */}
                                            <span style={{ marginRight: '10px' }}>非认证佣金比例</span>
                                            <InputNumber value={this.state.user_taxs} min={0} onChange={user_taxs => this.setState({ user_taxs })} style={{ width: '150px' }} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #cccccc", marginTop: '30px', paddingTop: '30px', textAlign: 'center' }}>
                                    <Button style={{ width: '80px' }} onClick={this.onUp}>保存</Button>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="套餐" key="4">
                            <Card title='套餐'>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>名称</th>
                                            <th>价格</th>
                                            <th>金币数</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.recharge.map((ele, index) =>
                                            <tr key={ele.giftId + 'gift'}>
                                                <td style={{ width: "100px" }}>{ele.rechargeId}</td>
                                                <td style={{ width: "100px" }}>{ele.rechargeId}</td>
                                                <td>¥{ele.amount}</td>
                                                <td>{ele.rechargeIntegral}</td>
                                                <td style={{ width: '220px' }}>
                                                    <div>
                                                        <Button value='cardActive/edit' onClick={this.onEdite.bind(this, ele)} type="primary" size={'small'}>奖品设置</Button>&nbsp;
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card>
                        </TabPane>
                        <TabPane tab="赠品订单" key="5">
                            <Card title='赠品订单'>
                                <Tabs defaultActiveKey="1" onChange={this.on_change}>
                                    <TabPane tab="待发货" key="1">
                                        <div>
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>用户名</th>
                                                        <th>收货名</th>
                                                        <th>手机号</th>
                                                        <th>地址</th>
                                                        <th>赠品类型</th>
                                                        <th>赠品名称</th>
                                                        <th>时间</th>
                                                        <th>操作</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.reward.map((ele, index) =>
                                                        <tr key={ele.giftId + 'gift'}>
                                                            <td style={{ width: "100px" }}>{ele.rewardId}</td>
                                                            <td style={{ width: "100px" }}>{ele.nickname}</td>
                                                            <td>{ele.realname}</td>
                                                            <td>{ele.mobile}</td>
                                                            <td>{ele.address}</td>
                                                            <td>{ele.ctype == 0 ? '金币' : '实物'}</td>
                                                            <td>{ele.itemName}</td>
                                                            <td>{ele.winningTime}</td>
                                                            <td style={{ width: '220px' }}>
                                                                <div>
                                                                    <Button value='cardActive/edit' type="primary" size={'small'} onClick={() => { this.setState({ showsettings: true, rid: ele.rewardId }) }}>发货</Button>&nbsp;
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                            <div style={{ float: 'right' }}>
                                                <Pagination
                                                    current={this.page_currents + 1}
                                                    pageSize={this.page_size}
                                                    total={this.page_totals}
                                                    showQuickJumper={true}
                                                    onChange={val => {
                                                        let pathname = this.props.history.location.pathname
                                                        this.props.history.replace(pathname + '?page=' + val)
                                                        this.page_currents = val - 1
                                                        this.reward()
                                                    }}
                                                    showTotal={(total) => '总共' + total + '条'}
                                                />
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="已发货" key="2">
                                        <div>
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>运单号</th>
                                                        <th>用户名</th>
                                                        <th>收货名</th>
                                                        <th>手机号</th>
                                                        <th>地址</th>
                                                        <th>赠品类型</th>
                                                        <th>赠品名称</th>
                                                        <th>时间</th>
                                                        <th>操作</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.rewards.map((ele, index) =>
                                                        <tr key={ele.giftId + 'gift'}>
                                                            <td style={{ width: "100px" }}>{ele.rewardId}</td>
                                                            <td>{ele.shipSn}</td>
                                                            <td style={{ width: "100px" }}>套餐{ele.nickname}</td>
                                                            <td>{ele.realname}</td>
                                                            <td>{ele.mobile}</td>
                                                            <td>{ele.address}</td>
                                                            <td>{ele.ctype == 0 ? '金币' : '实物'}</td>
                                                            <td>{ele.itemName}</td>
                                                            <td>{ele.winningTime}</td>
                                                            <td style={{ width: '220px' }}>
                                                                <div>
                                                                    <Button value='cardActive/edit' disabled={true} type="dashed" size={'small'}>已发货</Button>&nbsp;
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                            <div style={{ float: 'right' }}>
                                                <Pagination
                                                    current={this.page_currentss + 1}
                                                    pageSize={this.page_size}
                                                    total={this.page_totalss}
                                                    showQuickJumper={true}
                                                    onChange={val => {
                                                        let pathname = this.props.history.location.pathname
                                                        this.props.history.replace(pathname + '?page=' + val)
                                                        this.page_currentss = val - 1
                                                        this.rewards()
                                                    }}
                                                    showTotal={(total) => '总共' + total + '条'}
                                                />
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>

                            </Card>
                        </TabPane>
                        <TabPane tab="准入用户明细" key="6">
                            <Card title='准入用户明细'>
                                <Tabs defaultActiveKey="1" onChange={()=>{
                                    this.setState({
                                        userId:'',
                                        mobile:''
                                    })
                                }}>
                                    <TabPane tab="提现" key="1">
                                        <div>
                                            <Input style={{width:'150px'}} value={this.state.userId} placeholder={'用户ID'} onChange={(e)=>{
                                                this.setState({
                                                    userId:e.target.value
                                                })
                                            }}/>
                                             <Input style={{width:'150px'}} value={this.state.mobile} placeholder={'手机号'} onChange={(e)=>{
                                                this.setState({
                                                    mobile:e.target.value
                                                })
                                            }}/>
                                            <Button onClick={this.zhunru.bind(this,0)}>筛选</Button>
                                            <Button style={{float:'right'}} loading={this.state.exportLoading} onClick={this.onExports.bind(this,0)}>导出</Button>
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>用户名</th>
                                                        <th>手机号</th>
                                                        <th>卡号</th>
                                                        <th>用户同意时间</th>
                                                        <th>规则提交时间</th>
                                                        <th>用户操作</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.zhun_list.map((ele, index) =>
                                                        <tr key={ele.giftId + 'gift'}>
                                                            <td style={{ width: "100px" }}>{ele.user.userId}</td>
                                                            <td style={{ width: "100px" }}>{ele.user.nickname}</td>
                                                            <td>{ele.user.mobile}</td>
                                                            <td>{ele.user.sn}</td>
                                                            <td>{moment.unix(ele.contentId).format('YYYY-MM-DD HH:mm')}</td>
                                                            <td>{ele.timeFormat}</td>
                                                            <td>{ele.action}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                            <div style={{ float: 'right' }}>
                                                <Pagination
                                                    current={this.state.page_currentsss + 1}
                                                    pageSize={this.page_size}
                                                    total={this.state.page_totalsss}
                                                    showQuickJumper={true}
                                                    onChange={val => {
                                                        let pathname = this.props.history.location.pathname
                                                        this.props.history.replace(pathname + '?page=' + val)
                                                        this.setState({
                                                            page_currentsss:val - 1
                                                        })
                                                        this.zhunru(val - 1)
                                                    }}
                                                    showTotal={(total) => '总共' + total + '条'}
                                                />
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="打赏" key="2">
                                        <div>
                                        <Input style={{width:'150px'}} value={this.state.userId} placeholder={'用户ID'} onChange={(e)=>{
                                                this.setState({
                                                    userId:e.target.value
                                                })
                                            }}/>
                                             <Input style={{width:'150px'}} value={this.state.mobile} placeholder={'手机号'} onChange={(e)=>{
                                                this.setState({
                                                    mobile:e.target.value
                                                })
                                            }}/>
                                            <Button onClick={this.zhunrus.bind(this,0)}>筛选</Button>
                                            <Button style={{float:'right'}} loading={this.state.exportLoading} onClick={this.onExports.bind(this,1)}>导出</Button>
                                        <Table>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>用户名</th>
                                                        <th>手机号</th>
                                                        <th>卡号</th>
                                                        <th>用户同意时间</th>
                                                        <th>规则提交时间</th>
                                                        <th>用户操作</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.zhun_lists.map((ele, index) =>
                                                        <tr key={ele.giftId + 'gift'}>
                                                            <td style={{ width: "100px" }}>{ele.user.userId}</td>
                                                            <td style={{ width: "100px" }}>{ele.user.nickname}</td>
                                                            <td>{ele.user.mobile}</td>
                                                            <td>{ele.user.sn}</td>
                                                            <td>{moment.unix(ele.contentId).format('YYYY-MM-DD HH:mm')}</td>
                                                            <td>{ele.timeFormat}</td>
                                                            <td>{ele.action}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                            <div style={{ float: 'right' }}>
                                                <Pagination
                                                    current={this.state.page_currentssss + 1}
                                                    pageSize={this.page_size}
                                                    total={this.state.page_totalssss}
                                                    showQuickJumper={true}
                                                    onChange={val => {
                                                        let pathname = this.props.history.location.pathname
                                                        this.props.history.replace(pathname + '?page=' + val)
                                                        this.setState({
                                                            page_currentssss:val - 1
                                                        })
                                                        this.zhunrus(val - 1)
                                                    }}
                                                    showTotal={(total) => '总共' + total + '条'}
                                                />
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>

                            </Card>
                        </TabPane>
                    </Tabs>
                </Card>
                <Modal
                    title={this.state.isEdit ? "修改礼物" : "添加礼物"}
                    visible={this.state.showAddProduct}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideAddProduct}
                    bodyStyle={{ padding: "10px" }}
                    onOk={this._onPublish}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="礼物名称">
                            <Input
                                onChange={e => {
                                    this.setState({
                                        gift_name: e.target.value
                                    })
                                }}
                                value={this.state.gift_name}
                            />
                        </Form.Item>
                        <Form.Item label="图片(JPG/PNG)">
                            <AntdOssUpload
                                actions={this.props.actions}
                                accept='image/*'
                                listType="picture-card"
                                value={this.state.fileList}
                                onChange={this.uploadChange}
                            >
                            </AntdOssUpload>
                            <span style={{ marginTop: '-20px', display: 'block' }}>60px * 60px</span>
                        </Form.Item>
                        <Form.Item label="金币花费">
                            <InputNumber
                                min={0} max={800000}
                                value={this.state.integral}
                                onChange={val => {
                                    if (val !== '' && !isNaN(val)) {
                                        val = Math.round(val)
                                        if (val < 0) val = 0
                                        this.setState({
                                            integral: val
                                        })
                                    }
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title={"金币消耗"}
                    visible={this.state.showCoin}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideCoin}
                    bodyStyle={{ padding: "10px" }}
                    onOk={this._onPublishCoin}
                >
                    <Form {...formItemLayout}>

                        <Form.Item label="金币消耗">

                            <InputNumber
                                min={0} max={80000}
                                style={{ width: '250px' }}
                                value={this.state.coin}
                                onChange={val => {
                                    if (val !== '' && !isNaN(val)) {
                                        val = Math.round(val)
                                        if (val < 0) val = 0
                                        this.setState({
                                            coin: val
                                        })
                                    }
                                }}
                            />

                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="设置翻牌封面"
                    visible={this.state.showBgImg}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => this.setState({ showBgImg: false })}
                    onOk={this.setBgImg}
                    footer={null}
                >
                    <Form layout='vertical'>
                        <Form.Item label="图片 (620px * 618px) ">
                            <AntdOssUpload
                                showMedia={false}
                                actions={this.props.actions}
                                ref={ref => this.img = ref}
                                value={this.state.img}
                                accept='image/*'
                                maxLength={1}
                                listType='picture-card'
                                fixedName='$activity_img.png'
                            ></AntdOssUpload>
                            <div className='tip'>* 测试服修改图片后，正式服的翻牌背景图片也会同步修改</div>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal

                    title="翻牌规则"
                    visible={this.state.showRule}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideRule}
                    onOk={this._onUpdateRule}
                    bodyStyle={{ padding: "10px" }}
                >
                    <TextArea
                        rows={16}
                        value={this.state.rule}
                        onChange={e => this.setState({ rule: e.target.value })}
                        placeholder='请输入翻牌规则'
                    ></TextArea>
                </Modal>
                <Modal
                    width="60%"
                    title="打赏记录"
                    visible={this.state.showRecord}
                    okText="确定"
                    cancelText="关闭"
                    closable={true}
                    maskClosable={true}
                    onOk={this.hideRecord}
                    onCancel={this.hideRecord}
                    bodyStyle={{ padding: "10px 20px" }}
                >
                    <p>红玫瑰<span className='ml_40'>100份</span></p>
                    <p>红玫瑰<span className='ml_40'>100份</span></p>
                    <p>红玫瑰<span className='ml_40'>100份</span></p>
                </Modal>
                <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={this.handleCancelModal}>
                    <img alt="图片预览" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    zIndex={90}
                    title="赠品设置"
                    visible={this.state.showsetting}
                    okText="确定"
                    width={800}
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showsetting: false })
                    }}
                    onOk={this.onOk}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='奖品类型'>
                            <Select onChange={(e) => { this.setState({ type: e, integral: 0 }) }} value={this.state.type} style={{ width: 120 }} className="m_w400">
                                <Option key={'0'} value={'0'}>金币</Option>
                                <Option key={'1'} value={'1'}>实物</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='名称'>
                            <Input value={this.state.item_name} onChange={(e) => { this.setState({ item_name: e.target.value }) }} />
                        </Form.Item>
                        {
                            this.state.type == '0' ?
                                <Form.Item label='金币数'>
                                    <InputNumber value={this.state.integral} onChange={(e) => { this.setState({ integral: e }) }} />
                                </Form.Item>
                                :
                                null

                        }
                        <div>
                            <Form.Item label='数量'>
                                <InputNumber value={this.state.itemNum} onChange={(e) => { this.setState({ itemNum: e }) }} />
                            </Form.Item>
                        </div>
                        <Form.Item label="图片">
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imgss = ref}
                                listType="picture-card"
                                accept='image/*'
                                maxLength={1}
                                value={this.state.List}
                                tip='上传图片'
                            >

                            </AntdOssUpload>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
                    title="运单设置"
                    visible={this.state.showsettings}
                    okText="确定"
                    width={800}
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showsettings: false })
                    }}
                    onOk={this.onOkey}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='单号'>
                            <Input value={this.state.sn} onChange={(e) => { this.setState({ sn: e.target.value }) }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={'准入提示'} onOk={this.onOkey} visible={this.state.rulePanel} maskClosable={false} okText="确定" cancelText='取消' onCancel={() => {
					this.setState({ rulePanel: false })
				}}>
					<Form.Item label='准入提示'>
						<Input.TextArea autoSize={{ minRows: 6 }} defaultValue={'准入提示'} value={this.state.text} onChange={e => { this.setState({ text: e.target.value }) }}></Input.TextArea>
						{/* <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>提示:换行请用";"隔开</div> */}
					</Form.Item>
					<Form.Item label='是否启用不再提示按钮'>
						<Switch checked={this.state.again_two ? true : false} onChange={(e) => {
							if (e) {
								this.setState({ again_two: 1 })
							} else {
								this.setState({ again_two: 0 })
							}
						}} />
					</Form.Item>
					<Form.Item label='是否开启同意明细'>
						<Switch checked={this.state.agree ? true : false} onChange={(e) => {
							if (e) {
								this.setState({ agree: 1 })
							} else {
								this.setState({ agree: 0 })
							}
						}} />
					</Form.Item>
					{
						this.state.agree ?
							<Form.Item label='同意明细'>
								<Input.TextArea autoSize={{ minRows: 6 }} defaultValue={'同意明细'} value={this.state.iftext} onChange={e => { this.setState({ iftext: e.target.value }) }}></Input.TextArea>
							</Form.Item>
							: null
					}

				</Modal>
            </div>
        );
    }
}

const LayoutComponent = ActiveManager;
const mapStateToProps = state => {
    return {
        gift_list: state.ad.gift_list,
        active_list: state.ad.active_list,
        active_info: state.ad.active_info,
        active_item_list: state.ad.active_item_list,
        user: state.site.user,
        num: state.user.num,
        recharge: state.user.recharge,
        item: state.user.item,
        rewards: state.user.rewards,
        rewardss: state.user.rewardss
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
