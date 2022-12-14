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
            if (url == '') { message.info('???????????????'); return; }
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
                    message.success('????????????')
                },
                rejected: (data) => {
                    message.error(data)
                }
            })
        }
    }
    onUp = () => {
        const { set, method, rate, vuser_tax, user_tax, user_tab, rate_two, rate_three, user_taxs } = this.state
        // if (!rate_two) { message.info('??????????????????????????????????????????"0"???'); return; }
        if (rate_two < 0 || rate_two > 100) { message.info('????????????????????????100'); return; }
        // if (!rate_three) { message.info('??????????????????????????????????????????"0"???'); return; }
        // if (!vuser_tax) { message.info('????????????????????????????????????????????????"0"???'); return; }
        // if (!user_tax) { message.info('???????????????????????????????????????'); return; }
        if (rate_three < 0 || rate_three > 100) { message.info('????????????????????????100'); return; }
        if (vuser_tax + user_tax + user_taxs > 100) { message.info('????????????????????????100'); return; }
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
                message.success('????????????')
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
                message.success('????????????')
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
        //             message.success('????????????')
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
        //             message.success('????????????')
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
            message.info('????????????????????????')
            return
        }
        if (integral > 10000) {
            message.info('?????????????????????1???')
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
                message.success('????????????')
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
            message.info('????????????????????????')
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
                message.success('????????????')
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
                message.success('????????????')
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
            message.info('?????????????????????')
            return
        }
        if (!item_img) {
            message.info('?????????????????????')
            return
        }
        if (rate > 1000) {
            message.info('????????????????????????1000')
            return
        }
        if (itemNum > 30000) {
            message.info('????????????????????????3???')
            return
        }
        if (integral > 30000) {
            message.info('????????????????????????3???')
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
                message.success('????????????')
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
            message.info('?????????????????????'); return;
        }
        if (!gift_img) {
            message.info('?????????????????????'); return;
        }
        if (integral > 30000) {
            message.info('????????????????????????3???'); return;
        }
        const { actions } = this.props
        actions.publishGift({
            gift_id, gift_img, gift_name, integral, status, gtype,
            resolved: (data) => {
                actions.getGift({ page: this.page_current - 1 })
                message.success('????????????')
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
                    content: '????????????'
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
        if (!sn) { message.info({ content: '???????????????' }); return; }
        actions.postReward({
            reward_id: rid,
            ship_sn: sn,
            resolved: (res) => {
                message.success({
                    content: "????????????"
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
					content: '????????????'
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
                message.info({content:'????????????????????????ID'})
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
                message.info({content:'????????????????????????ID'});
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
                message.info({content:'????????????????????????ID'});
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
                message.success({content:'????????????'})
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
                <div className="ant-upload-text">????????????</div>
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
                        <TabPane tab="????????????" key="1">
                            <Card
                                type="inner"
                                title="????????????"
                                extra={
                                    <div>
                                        <Button className='m_2' style={{ marginLeft: '30px' }} onClick={() => {
                                            this.setState({ rulePanel: true })
                                        }}>??????????????????</Button>
                                        <Button value='cardActive/giftAdd' onClick={this.showAddProduct.bind(this, 'add')}>????????????</Button>
                                        {/*<Button onClick={this.showRecord}>????????????</Button>*/}
                                    </div>
                                }
                                bodyStyle={{ paddingTop: 0 }}
                            >
                                <Table responsive size="sm" className="v_middle">
                                    <thead>
                                        <tr>
                                            <th>????????????</th>
                                            <th>????????????</th>
                                            <th>????????????</th>
                                            <th>??????</th>
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
                                                        <Button value='cardActive/edit' onClick={this.onEdit.bind(this, index)} type="primary" size={'small'}>??????</Button>&nbsp;
                                                        <Popconfirm
                                                            value='cardActive/del'
                                                            cancelText="??????"
                                                            okText="??????"
                                                            title="??????????????????"
                                                            onConfirm={this._onDelete.bind(this, ele.giftId)}
                                                        >
                                                            <Button type="danger" size={'small'}>??????</Button>
                                                        </Popconfirm>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <Pagination showTotal={() => ('??????' + this.page_total + '???')} showQuickJumper pageSize={this.page_size} defaultCurrent={this.page_current} onChange={this._onPage} total={this.page_total} />
                            </Card>
                        </TabPane>
                        <TabPane tab="????????????" key="2">
                            <Card
                                type="inner"
                                title="????????????"
                                extra={
                                    <Input.Group compact>
                                        {/*<Button onClick={this.add}>??????</Button>
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
                                        }}>??????????????????</Button>
                                        <Button value='cardActive/coinsetting' onClick={() => { this.setState({ showCoin: true }) }}>??????????????????</Button>

                                        <Button value='cardActive/list' onClick={() => {
                                            this.props.history.push("/web-manager/active-manager/lucky-list")
                                        }}>????????????</Button>
                                        <Button value='cardActive/rulesetting' onClick={this.showRule}>????????????</Button>

                                    </Input.Group>
                                }
                                bodyStyle={{ paddingTop: 0 }}
                            >
                                <Table responsive size="sm" className="v_middle">
                                    <thead>
                                        <tr>
                                            <th>????????????</th>
                                            <th>????????????<span className="be_ll_gray">(77px * 77px)</span></th>
                                            <th>????????????</th>
                                            <th>????????????</th>
                                            <th>????????????</th>
                                            <th>????????????</th>
                                            <th>????????????<span className="be_ll_gray">(??????0??????????????????0)</span></th>
                                            <th>??????</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cardList.map((ele, index) =>
                                            <tr key={'list' + index}>
                                                <td>???{index + 1}</td>
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
                                                        placeholder="??????????????????"
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
                                                        placeholder="????????????"
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
                                                        <Select.Option value={0}>???</Select.Option>
                                                        <Select.Option value={1}>??????</Select.Option>
                                                        <Select.Option value={2}>??????</Select.Option>
                                                    </Select>
                                                </td>
                                                <td>
                                                    <InputNumber
                                                        min={0} max={800000}
                                                        disabled={ele.isCoinType ? false : true}
                                                        placeholder="??????????????????"
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
                                                        placeholder="??????????????????"
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
                                                    >{ele.isZero ? "??????????????????0" : null}
                                                    </div>
                                                </td>
                                                <td style={{ width: '220px' }}>
                                                    <div>
                                                        <Button value='cardActive/edit' onClick={this._onPublishCard.bind(this, index)}>??????</Button>&nbsp;
                                                        {/*<Button size={'small'}>??????</Button>*/}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>

                            </Card>
                        </TabPane>
                        <TabPane tab="??????" key="3">
                            <div style={{ height: '600px' }}>
                                <div style={{ border: '1px solid #cccccc', marginTop: '20px' }}>
                                    <div>????????????</div>
                                    <div style={{ marginLeft: '40px', padding: '20px' }}>
                                        <span>??????&nbsp;&nbsp;</span>
                                        <InputNumber value={this.state.rate_two} min={0} onChange={rate_two => this.setState({ rate_two })} style={{ width: '150px' }} />
                                        <div style={{ color: 'red', fontSize: '12px', marginLeft: '40px' }}>????????????????????????????????????????????????"0"???</div>
                                    </div>
                                </div>
                                <div style={{ border: '1px solid #cccccc', marginTop: '20px' }}>
                                    <div>????????????</div>
                                    <div style={{ marginLeft: '40px', padding: '20px' }}>
                                        <span>??????&nbsp;&nbsp;</span>
                                        <InputNumber value={this.state.rate_three} min={0} onChange={rate_three => this.setState({ rate_three })} style={{ width: '150px' }} />
                                        <div style={{ color: 'red', fontSize: '12px', marginLeft: '40px' }}>????????????????????????????????????????????????"0"???</div>
                                    </div>
                                </div>
                                <div style={{ border: '1px solid #cccccc', marginTop: '20px' }}>
                                    <div>????????????</div>
                                    <div style={{ margin: '30px 40px' }}>
                                        <div>
                                            ??????????????????&nbsp;&nbsp;<InputNumber value={this.state.vuser_tax} min={0} onChange={vuser_tax => this.setState({ vuser_tax })} />
                                            <div style={{ color: 'red', fontSize: '12px', marginTop: '6px', marginLeft: '100px' }}>??????????????????"0"</div>
                                        </div>
                                        <div style={{ marginTop: '10px' }}>
                                            {/* <Select style={{ width: '16%' }} value={this.state.user_tab} onChange={val => {
                                                this.setState({ user_tab: val })
                                            }}>
                                                <Option value={0}>??????????????????</Option>
                                                <Option value={1}>????????????????????? </Option>
                                            </Select> */}
                                            <span style={{ marginRight: '10px' }}>??????????????????</span>
                                            <InputNumber value={this.state.user_tax} min={0} onChange={user_tax => this.setState({ user_tax })} style={{ width: '150px' }} />
                                        </div>
                                        <div style={{ marginTop: '10px' }}>
                                            {/* <Select style={{ width: '16%' }} value={this.state.user_tab} onChange={val => {
                                                this.setState({ user_tab: val })
                                            }}>
                                                <Option value={0}>??????????????????</Option>
                                                <Option value={1}>????????????????????? </Option>
                                            </Select> */}
                                            <span style={{ marginRight: '10px' }}>?????????????????????</span>
                                            <InputNumber value={this.state.user_taxs} min={0} onChange={user_taxs => this.setState({ user_taxs })} style={{ width: '150px' }} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid #cccccc", marginTop: '30px', paddingTop: '30px', textAlign: 'center' }}>
                                    <Button style={{ width: '80px' }} onClick={this.onUp}>??????</Button>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="??????" key="4">
                            <Card title='??????'>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>??????</th>
                                            <th>??????</th>
                                            <th>?????????</th>
                                            <th>??????</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.recharge.map((ele, index) =>
                                            <tr key={ele.giftId + 'gift'}>
                                                <td style={{ width: "100px" }}>{ele.rechargeId}</td>
                                                <td style={{ width: "100px" }}>{ele.rechargeId}</td>
                                                <td>??{ele.amount}</td>
                                                <td>{ele.rechargeIntegral}</td>
                                                <td style={{ width: '220px' }}>
                                                    <div>
                                                        <Button value='cardActive/edit' onClick={this.onEdite.bind(this, ele)} type="primary" size={'small'}>????????????</Button>&nbsp;
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card>
                        </TabPane>
                        <TabPane tab="????????????" key="5">
                            <Card title='????????????'>
                                <Tabs defaultActiveKey="1" onChange={this.on_change}>
                                    <TabPane tab="?????????" key="1">
                                        <div>
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>?????????</th>
                                                        <th>?????????</th>
                                                        <th>?????????</th>
                                                        <th>??????</th>
                                                        <th>????????????</th>
                                                        <th>????????????</th>
                                                        <th>??????</th>
                                                        <th>??????</th>
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
                                                            <td>{ele.ctype == 0 ? '??????' : '??????'}</td>
                                                            <td>{ele.itemName}</td>
                                                            <td>{ele.winningTime}</td>
                                                            <td style={{ width: '220px' }}>
                                                                <div>
                                                                    <Button value='cardActive/edit' type="primary" size={'small'} onClick={() => { this.setState({ showsettings: true, rid: ele.rewardId }) }}>??????</Button>&nbsp;
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
                                                    showTotal={(total) => '??????' + total + '???'}
                                                />
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="?????????" key="2">
                                        <div>
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>?????????</th>
                                                        <th>?????????</th>
                                                        <th>?????????</th>
                                                        <th>?????????</th>
                                                        <th>??????</th>
                                                        <th>????????????</th>
                                                        <th>????????????</th>
                                                        <th>??????</th>
                                                        <th>??????</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.rewards.map((ele, index) =>
                                                        <tr key={ele.giftId + 'gift'}>
                                                            <td style={{ width: "100px" }}>{ele.rewardId}</td>
                                                            <td>{ele.shipSn}</td>
                                                            <td style={{ width: "100px" }}>??????{ele.nickname}</td>
                                                            <td>{ele.realname}</td>
                                                            <td>{ele.mobile}</td>
                                                            <td>{ele.address}</td>
                                                            <td>{ele.ctype == 0 ? '??????' : '??????'}</td>
                                                            <td>{ele.itemName}</td>
                                                            <td>{ele.winningTime}</td>
                                                            <td style={{ width: '220px' }}>
                                                                <div>
                                                                    <Button value='cardActive/edit' disabled={true} type="dashed" size={'small'}>?????????</Button>&nbsp;
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
                                                    showTotal={(total) => '??????' + total + '???'}
                                                />
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>

                            </Card>
                        </TabPane>
                        <TabPane tab="??????????????????" key="6">
                            <Card title='??????????????????'>
                                <Tabs defaultActiveKey="1" onChange={()=>{
                                    this.setState({
                                        userId:'',
                                        mobile:''
                                    })
                                }}>
                                    <TabPane tab="??????" key="1">
                                        <div>
                                            <Input style={{width:'150px'}} value={this.state.userId} placeholder={'??????ID'} onChange={(e)=>{
                                                this.setState({
                                                    userId:e.target.value
                                                })
                                            }}/>
                                             <Input style={{width:'150px'}} value={this.state.mobile} placeholder={'?????????'} onChange={(e)=>{
                                                this.setState({
                                                    mobile:e.target.value
                                                })
                                            }}/>
                                            <Button onClick={this.zhunru.bind(this,0)}>??????</Button>
                                            <Button style={{float:'right'}} loading={this.state.exportLoading} onClick={this.onExports.bind(this,0)}>??????</Button>
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>?????????</th>
                                                        <th>?????????</th>
                                                        <th>??????</th>
                                                        <th>??????????????????</th>
                                                        <th>??????????????????</th>
                                                        <th>????????????</th>
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
                                                    showTotal={(total) => '??????' + total + '???'}
                                                />
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="??????" key="2">
                                        <div>
                                        <Input style={{width:'150px'}} value={this.state.userId} placeholder={'??????ID'} onChange={(e)=>{
                                                this.setState({
                                                    userId:e.target.value
                                                })
                                            }}/>
                                             <Input style={{width:'150px'}} value={this.state.mobile} placeholder={'?????????'} onChange={(e)=>{
                                                this.setState({
                                                    mobile:e.target.value
                                                })
                                            }}/>
                                            <Button onClick={this.zhunrus.bind(this,0)}>??????</Button>
                                            <Button style={{float:'right'}} loading={this.state.exportLoading} onClick={this.onExports.bind(this,1)}>??????</Button>
                                        <Table>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>?????????</th>
                                                        <th>?????????</th>
                                                        <th>??????</th>
                                                        <th>??????????????????</th>
                                                        <th>??????????????????</th>
                                                        <th>????????????</th>
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
                                                    showTotal={(total) => '??????' + total + '???'}
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
                    title={this.state.isEdit ? "????????????" : "????????????"}
                    visible={this.state.showAddProduct}
                    okText="??????"
                    cancelText="??????"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideAddProduct}
                    bodyStyle={{ padding: "10px" }}
                    onOk={this._onPublish}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="????????????">
                            <Input
                                onChange={e => {
                                    this.setState({
                                        gift_name: e.target.value
                                    })
                                }}
                                value={this.state.gift_name}
                            />
                        </Form.Item>
                        <Form.Item label="??????(JPG/PNG)">
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
                        <Form.Item label="????????????">
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
                    title={"????????????"}
                    visible={this.state.showCoin}
                    okText="??????"
                    cancelText="??????"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.hideCoin}
                    bodyStyle={{ padding: "10px" }}
                    onOk={this._onPublishCoin}
                >
                    <Form {...formItemLayout}>

                        <Form.Item label="????????????">

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
                    title="??????????????????"
                    visible={this.state.showBgImg}
                    okText="??????"
                    cancelText="??????"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => this.setState({ showBgImg: false })}
                    onOk={this.setBgImg}
                    footer={null}
                >
                    <Form layout='vertical'>
                        <Form.Item label="?????? (620px * 618px) ">
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
                            <div className='tip'>* ???????????????????????????????????????????????????????????????????????????</div>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal

                    title="????????????"
                    visible={this.state.showRule}
                    okText="??????"
                    cancelText="??????"
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
                        placeholder='?????????????????????'
                    ></TextArea>
                </Modal>
                <Modal
                    width="60%"
                    title="????????????"
                    visible={this.state.showRecord}
                    okText="??????"
                    cancelText="??????"
                    closable={true}
                    maskClosable={true}
                    onOk={this.hideRecord}
                    onCancel={this.hideRecord}
                    bodyStyle={{ padding: "10px 20px" }}
                >
                    <p>?????????<span className='ml_40'>100???</span></p>
                    <p>?????????<span className='ml_40'>100???</span></p>
                    <p>?????????<span className='ml_40'>100???</span></p>
                </Modal>
                <Modal visible={this.state.previewVisible} maskClosable={true} footer={null} onCancel={this.handleCancelModal}>
                    <img alt="????????????" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    zIndex={90}
                    title="????????????"
                    visible={this.state.showsetting}
                    okText="??????"
                    width={800}
                    cancelText="??????"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showsetting: false })
                    }}
                    onOk={this.onOk}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='????????????'>
                            <Select onChange={(e) => { this.setState({ type: e, integral: 0 }) }} value={this.state.type} style={{ width: 120 }} className="m_w400">
                                <Option key={'0'} value={'0'}>??????</Option>
                                <Option key={'1'} value={'1'}>??????</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='??????'>
                            <Input value={this.state.item_name} onChange={(e) => { this.setState({ item_name: e.target.value }) }} />
                        </Form.Item>
                        {
                            this.state.type == '0' ?
                                <Form.Item label='?????????'>
                                    <InputNumber value={this.state.integral} onChange={(e) => { this.setState({ integral: e }) }} />
                                </Form.Item>
                                :
                                null

                        }
                        <div>
                            <Form.Item label='??????'>
                                <InputNumber value={this.state.itemNum} onChange={(e) => { this.setState({ itemNum: e }) }} />
                            </Form.Item>
                        </div>
                        <Form.Item label="??????">
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imgss = ref}
                                listType="picture-card"
                                accept='image/*'
                                maxLength={1}
                                value={this.state.List}
                                tip='????????????'
                            >

                            </AntdOssUpload>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
                    title="????????????"
                    visible={this.state.showsettings}
                    okText="??????"
                    width={800}
                    cancelText="??????"
                    closable={true}
                    maskClosable={true}
                    onCancel={() => {
                        this.setState({ showsettings: false })
                    }}
                    onOk={this.onOkey}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label='??????'>
                            <Input value={this.state.sn} onChange={(e) => { this.setState({ sn: e.target.value }) }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={'????????????'} onOk={this.onOkey} visible={this.state.rulePanel} maskClosable={false} okText="??????" cancelText='??????' onCancel={() => {
					this.setState({ rulePanel: false })
				}}>
					<Form.Item label='????????????'>
						<Input.TextArea autoSize={{ minRows: 6 }} defaultValue={'????????????'} value={this.state.text} onChange={e => { this.setState({ text: e.target.value }) }}></Input.TextArea>
						{/* <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>??????:????????????";"??????</div> */}
					</Form.Item>
					<Form.Item label='??????????????????????????????'>
						<Switch checked={this.state.again_two ? true : false} onChange={(e) => {
							if (e) {
								this.setState({ again_two: 1 })
							} else {
								this.setState({ again_two: 0 })
							}
						}} />
					</Form.Item>
					<Form.Item label='????????????????????????'>
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
							<Form.Item label='????????????'>
								<Input.TextArea autoSize={{ minRows: 6 }} defaultValue={'????????????'} value={this.state.iftext} onChange={e => { this.setState({ iftext: e.target.value }) }}></Input.TextArea>
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
