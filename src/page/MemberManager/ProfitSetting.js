import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { Empty, Upload, Modal, Form, Slider, Tooltip, Select, Tabs, Card, DatePicker, Menu, Dropdown, Icon, message, Input, Avatar, InputNumber, Switch } from 'antd';

import TextArea from 'antd/lib/input/TextArea';
import connectComponent from '../../util/connect';
import config from '../../config/config';
import _, { first } from 'lodash'
import moment from 'moment'
import AntdOssUpload from '../../components/AntdOssUpload'
import { Button, Popconfirm } from '../../components/BtnComponent'
const { Option } = Select;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
function getBase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 文件!');
    }
    const isLt2M = file.size / 1024 < 500;
    if (!isLt2M) {
        message.error('图片文件需小于 500KB!');
    }
    return isJpgOrPng && isLt2M;
}

class ProfitSetting extends Component {

    equity_list = []
    state = {
        ttime:parseInt((new Date().getTime())/1000),
        view_mode: false,
        edit: false,
        view: false,
        loading: false,
        fileList: [],
        iconList: [],
        fileList2: [],

        previewImage: '',
        previewVisible: false,

        showEdit: false,
        visible: false,
        showView: false,
        keys: [],
        loading: false,
        imageUrl: '',

        tag: '',
        content: '',
        equity_name: '',
        equity_img: '',
        equity_id: 0,
        integral: 0,
        type: 0,
        type: '奖品类型',
        // type_b:'奖品类型',
        // type_c:'奖品类型',
        // type_d:'奖品类型',
        // type_e:'奖品类型',
        // type_f:'奖品类型',
        // type_g:'奖品类型',
        num_a: 0,
        num_b: 0,
        num_c: 0,
        num_d: 0,
        num_e: 0,
        num_f: 0,
        num_g: 0,
        num: [0, 0, 0, 0, 0, 0, 0],
        showsetting: false,
        rulePanel: false,
        text: '',
        showhome: false,
        isOpen: 0,
        fileList: [],
        fileList_1: [],
        fileList_2: [],
        fileList_3: [],
        fileList_4: [],
        fileList_5: [],
        fileList_6: [],
        fileList_7: [],
        fileList_8: [],
        fileList_9: [],
        fileList_10: [],
        fileList_11: [],
        fileList_12: [],
        fileList_13: [],
        fileList_14: [],
        fileList_15: [],
        fileList_16: [],
        fileList_17: [],
        fileList_18: [],
        fileList_19: [],
        fileList_20: [],
        fileList_21: [],
        fileList_22: [],
        fileList_23: [],
        fileList_24: [],
        fileList_25: [],
        fileList_26: [],
        fileList_27: [],
        fileList_28: [],
        fileList_29: [],
        fileList_30: [],
        fileList_a: [],
        fileList_b: [],
        fileList_c: [],
        fileList_d: [],
        fileList_e: [],
        fileList_f: [],
        fileList_g: [],
    };


    componentWillReceiveProps(nextProps) {

        if (nextProps.equity_list !== this.props.equity_list) {
            this.equity_list = nextProps.equity_list;
        }
        if (nextProps.num !== this.props.num) {
            let type_list = nextProps.num.filter(item => item.keyy == 'week_checkin_type')[0]
            let num_list = []
            if (type_list.val == 0) {
                num_list = nextProps.num.filter(item => item.keyy == 'week_checkin_integral')[0]
            } else {
                num_list = nextProps.num.filter(item => item.keyy == 'week_checkin_lottery')[0]
            }
            let isOpen = nextProps.num.filter(item => item.keyy == 'day_checkin_img_status')[0].val
            let img = nextProps.num.filter(item => item.keyy == 'day_checkin_button_img')[0].val
            let fileList = [{response: { resultBody: img }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: img }]
            this.setState({
                // num_a:parseInt(num_list.val.split(",")[0]),
                // num_b:parseInt(num_list.val.split(",")[1]),
                // num_c:parseInt(num_list.val.split(",")[2]),
                // num_d:parseInt(num_list.val.split(",")[3]),
                // num_e:parseInt(num_list.val.split(",")[4]),
                // num_f:parseInt(num_list.val.split(",")[5]),
                // num_g:parseInt(num_list.val.split(",")[7]),
                num: num_list.val.split(","),
                type: type_list.val,
                isOpen:parseInt(isOpen),
                fileList:fileList,
            })
        }
        if (nextProps.check_list !== this.props.check_list) {
            this.setState({
                text: nextProps.check_list[0].val
            })
        }

    }
    componentDidMount() {
        const { actions } = this.props;
        actions.getEquity();
        this.Num()
        this.Text()
        this.getHoms()
    }
    getHoms=()=>{
        const{actions}=this.props
        actions.postQiandao({
            type:0,
            resolved:(res)=>{
                let fileList_1=res[moment.unix(this.state.ttime).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime).format('YYYY-MM-DD')] }:null]:[]
                let fileList_2=res[moment.unix(this.state.ttime+1*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+1*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+1*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+1*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+1*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_3=res[moment.unix(this.state.ttime+2*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+2*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+2*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+2*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+2*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_4=res[moment.unix(this.state.ttime+3*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+3*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+3*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+3*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+3*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_5=res[moment.unix(this.state.ttime+4*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+4*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+4*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+4*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+4*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_6=res[moment.unix(this.state.ttime+5*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+5*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+5*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+5*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+5*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_7=res[moment.unix(this.state.ttime+6*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+6*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+6*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+6*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+6*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_8=res[moment.unix(this.state.ttime+7*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+7*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+7*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+7*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+7*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_9=res[moment.unix(this.state.ttime+8*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+8*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+8*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+8*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+8*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_10=res[moment.unix(this.state.ttime+9*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+9*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+9*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+9*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+9*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_11=res[moment.unix(this.state.ttime+10*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+10*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+10*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+10*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+10*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_12=res[moment.unix(this.state.ttime+11*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+11*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+11*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+11*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+11*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_13=res[moment.unix(this.state.ttime+12*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+12*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+12*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+12*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+12*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_14=res[moment.unix(this.state.ttime+13*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+13*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+13*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+13*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+13*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_15=res[moment.unix(this.state.ttime+14*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+14*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+14*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+14*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+14*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_16=res[moment.unix(this.state.ttime+15*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+15*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+15*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+15*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+15*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_17=res[moment.unix(this.state.ttime+16*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+16*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+16*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+16*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+16*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_18=res[moment.unix(this.state.ttime+17*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+17*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+17*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+17*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+17*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_19=res[moment.unix(this.state.ttime+18*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+18*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+18*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+18*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+18*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_20=res[moment.unix(this.state.ttime+19*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+19*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+19*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+19*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+19*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_21=res[moment.unix(this.state.ttime+20*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+20*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+20*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+20*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+20*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_22=res[moment.unix(this.state.ttime+21*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+21*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+21*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+21*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+21*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_23=res[moment.unix(this.state.ttime+22*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+22*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+22*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+22*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+22*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_24=res[moment.unix(this.state.ttime+23*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+23*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+23*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+23*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+23*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_25=res[moment.unix(this.state.ttime+24*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+24*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+24*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+24*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+24*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_26=res[moment.unix(this.state.ttime+25*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+25*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+25*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+25*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+25*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_27=res[moment.unix(this.state.ttime+26*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+26*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+26*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+26*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+26*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_28=res[moment.unix(this.state.ttime+27*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+27*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+27*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+27*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+27*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_29=res[moment.unix(this.state.ttime+28*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+28*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+28*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+28*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+28*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_30=res[moment.unix(this.state.ttime+29*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime+29*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime+29*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime+29*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime+29*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_a=res[moment.unix(this.state.ttime-1*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime-1*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime-1*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime-1*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime-1*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_b=res[moment.unix(this.state.ttime-2*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime-2*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime-2*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime-2*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime-2*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_c=res[moment.unix(this.state.ttime-3*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime-3*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime-3*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime-3*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime-3*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_d=res[moment.unix(this.state.ttime-4*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime-4*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime-4*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime-4*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime-4*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_e=res[moment.unix(this.state.ttime-5*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime-5*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime-5*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime-5*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime-5*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_f=res[moment.unix(this.state.ttime-6*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime-6*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime-6*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime-6*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime-6*86400).format('YYYY-MM-DD')] }:null]:[]
                let fileList_g=res[moment.unix(this.state.ttime-7*86400).format('YYYY-MM-DD')]&&res[moment.unix(this.state.ttime-7*86400).format('YYYY-MM-DD')]!==' '?[res[moment.unix(this.state.ttime-7*86400).format('YYYY-MM-DD')]?{response: { resultBody: res[moment.unix(this.state.ttime-7*86400).format('YYYY-MM-DD')] }, type: 'image/png', uid: 0, name: 'img' + 0, status: 'done', url: res[moment.unix(this.state.ttime-7*86400).format('YYYY-MM-DD')] }:null]:[]
                this.setState({
                    fileList_1,
                    fileList_2,
                    fileList_3,
                    fileList_4,
                    fileList_5,
                    fileList_6,
                    fileList_7,
                    fileList_8,
                    fileList_9,
                    fileList_10,
                    fileList_11,
                    fileList_12,
                    fileList_13,
                    fileList_14,
                    fileList_15,
                    fileList_16,
                    fileList_17,
                    fileList_18,
                    fileList_19,
                    fileList_20,
                    fileList_21,
                    fileList_22,
                    fileList_23,
                    fileList_24,
                    fileList_25,
                    fileList_26,
                    fileList_27,
                    fileList_28,
                    fileList_29,
                    fileList_30,
                    fileList_a,
                    fileList_b,
                    fileList_c,
                    fileList_d,
                    fileList_e,
                    fileList_f,
                    fileList_g,
                })
            }
        })
    }
    Num = () => {
        const { actions } = this.props
        actions.getNum('', 'user')
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
    onImgChange = ({ fileList }) => {
        let img = []
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                img.push(ele.response.resultBody)
            }
        })

        this.setState({
            fileList1: fileList,
            equity_img: img.join(',')
        })
    };
    onImgChangeEdit = ({ fileList }) => {
        let img = []
        fileList.map((ele, index) => {
            if (ele.status == 'done') {
                img.push(ele.response.resultBody)
            }
        })

        this.setState({
            fileList2: fileList,
            _equity_img: img.join(',')
        })
    };

    _onPublish = () => {
        let {
            tag,
            content,
            equity_name,

            equity_id,
            integral
        } = this.state;
        const { actions } = this.props
        let equity_img = ''
        let bottom_img = ''
        if (this.img) {
            equity_img = this.img.getValue() || ''
        }
        if (this.imgs) {
            bottom_img = this.imgs.getValue() || ''
        }
        if (!equity_name) {
            message.info('权益名称不能为空')
            return;
        }
        if (!tag) {
            message.info('服务权益不能为空')
            return;
        }
        if (!content) {
            message.info('权益说明不能为空')
            return;
        }
        if (!equity_img) {
            message.info('权益LOGO不能为空')
            return;
        }

        actions.publishEquity({

            bottom_img, tag, integral, equity_name, content, equity_img, equity_id,
            resolved: () => {
                this.hideModal()
                message.success("提交成功")
                actions.getEquity();
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }

    _onDelete(id) {
        const { actions } = this.props;
        actions.removeEquity({
            equity_id: id,
            resolved: (data) => {
                message.success("操作成功")

                actions.getEquity();
            },
            rejected: (data) => {
                message.error(data)
            }
        })
    }
    showEdit(index) {
        let item = this.equity_list[index];

        let fileList = [{ response: { resultBody: item.equityImg }, uid: item.equityId, name: 'img' + item.equityId, status: 'done', url: item.equityImg, type: 'image/png' }]
        let iconList = [{ response: { resultBody: item.bottomImg }, uid: item.equityId, name: 'img' + item.equityId, status: 'done', url: item.bottomImg, type: 'image/png' }]
        this.setState({
            visible: true,
            tag: item.tag,
            content: item.content,
            integral: item.integral,
            equity_name: item.equityName,
            equity_id: item.equityId,
            equity_img: item.equityImg,
            fileList: fileList,
            iconList: iconList
        });
    }
    _onAdd = () => {
        this.setState({
            tag: '',
            content: '',
            equity_name: '',
            fileList: [],
            iconList: [],
            equity_id: 0,
            integral: 0,
            visible: true,
        })
    }
    hideEdit = () => {
        this.setState({
            showEdit: false,
        });
    }
    showView(index) {
        this.setState({
            showView: true,
            level_item: this.level_list[index]
        });
    }
    hideView = () => {
        this.setState({
            showView: false,
        });
    }

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    onUploadChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };
    Text = () => {
        const { actions } = this.props
        actions.getCheck('qiandao_text', 'teacher')
    }
    onOk = () => {
        const { type, num } = this.state
        const { actions } = this.props
        if (type == '奖品类型') { message.info({ content: '请选择奖品类型' }); return; }
        actions.publishNum({
            keyy: 'week_checkin_type',
            section: 'user',
            val: type,
            resolved: (res) => {
                message.success({
                    content: '操作成功'
                })
                this.Num()
                this.setState({ showsetting: false })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        if (type == 0) {
            actions.publishNum({
                keyy: 'week_checkin_integral',
                section: 'user',
                val: num.toLocaleString(),
                resolved: (res) => {
                    message.success({
                        content: '操作成功'
                    })
                    this.Num()
                    this.setState({ showsetting: false })
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        } else {
            actions.publishNum({
                keyy: 'week_checkin_lottery',
                section: 'user',
                val: num.toLocaleString(),
                resolved: (res) => {
                    message.success({
                        content: '操作成功'
                    })
                    this.Num()
                    this.setState({ showsetting: false })
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        }

    }
    handleCancelModal = () => this.setState({ previewVisible: false });
    onOkey = () => {
        const { text } = this.state
        const { actions } = this.props
        actions.publishNum({
            keyy: 'qiandao_text',
            section: 'teacher',
            val: text,
            resolved: (res) => {
                message.success({
                    content: '操作成功'
                })
                this.Text()
                this.setState({
                    rulePanel: false
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onOks=()=>{
        const{actions}=this.props
        const{isOpen,ttime}=this.state
        let img = this.img.getValue()
        let img1 = this.img1.getValue()||' '
        let img2 = this.img2.getValue()||' '
        let img3 = this.img3.getValue()||' '
        let img4 = this.img4.getValue()||' '
        let img5 = this.img5.getValue()||' '
        let img6 = this.img6.getValue()||' '
        let img7 = this.img7.getValue()||' '
        let img8 = this.img8.getValue()||' '
        let img9 = this.img9.getValue()||' '
        let img10 = this.img10.getValue()||' '
        let img11 = this.img11.getValue()||' '
        let img12 = this.img12.getValue()||' '
        let img13 = this.img13.getValue()||' '
        let img14 = this.img14.getValue()||' '
        let img15 = this.img15.getValue()||' '
        let img16 = this.img16.getValue()||' '
        let img17 = this.img17.getValue()||' '
        let img18 = this.img18.getValue()||' '
        let img19 = this.img19.getValue()||' '
        let img20 = this.img20.getValue()||' '
        let img21 = this.img21.getValue()||' '
        let img22 = this.img22.getValue()||' '
        let img23 = this.img23.getValue()||' '
        let img24 = this.img24.getValue()||' '
        let img25 = this.img25.getValue()||' '
        let img26 = this.img26.getValue()||' '
        let img27 = this.img27.getValue()||' '
        let img28 = this.img28.getValue()||' '
        let img29 = this.img29.getValue()||' '
        let img30 = this.img30.getValue()||' '
        let vas = []
        vas = vas.concat(img1,img2,img3,img4,img5,img6,img7,img8,img9,img10,img11,img12,img13,img14,img15,img16,img17,img18,img19,img20,img21,img22,img23,img24,img25,img26,img27,img28,img29,img30)
        let lst = [moment.unix(this.state.ttime).format('YYYY-MM-DD'),moment.unix(this.state.ttime+1*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+2*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+3*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+4*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+5*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+6*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+7*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+8*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+9*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+10*86400).format('YYYY-MM-DD'),
        moment.unix(this.state.ttime+11*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+12*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+13*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+14*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+15*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+16*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+17*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+18*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+19*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+20*86400).format('YYYY-MM-DD'),
        moment.unix(this.state.ttime+21*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+22*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+23*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+24*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+25*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+26*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+27*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+28*86400).format('YYYY-MM-DD'),moment.unix(this.state.ttime+29*86400).format('YYYY-MM-DD')]
        actions.publishNum({
            keyy: 'day_checkin_img_status',
            section: 'user',
            val: isOpen,
            resolved: (res) => {
                
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.publishNum({
            keyy: 'day_checkin_button_img',
            section: 'user',
            val: img,
            resolved: (res) => {
               
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.postQiandao({
            type:1,
            day_times:lst.toString(),
            images:vas.toString(),
            resolved:(res)=>{
                message.success({content:'操作成功'})
                this.setState({
                    showhome:false
                },()=>{
                    this.Num()
                    this.getHoms()
                })
            },
            rejected:(err)=>{

            }
        })
    }
    render() {
        const uploadButton = (txt) => (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图标</div>

            </div>
        );
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

        const { imageUrl, level_item, num, equity_name, tag, content, _equity_name, _tag, _content } = this.state;

        return (
            <div className="animated fadeIn">
                <Card title="会员权益列表" extra={
                    <div>
                        <Button type='primary' style={{ marginRight: '10px' }} onClick={() => { this.setState({ showhome: true }) }}>首页签到设置</Button>
                        <Button type='primary' style={{ marginRight: '10px' }} onClick={() => { this.setState({ showsetting: true }) }}>签到设置</Button>
                        <Button style={{ marginRight: '10px' }} onClick={() => { this.setState({ rulePanel: true }) }}>签到规则</Button>
                        <Button value='profit/add' onClick={this._onAdd}>创建权益</Button>
                    </div>
                }>
                    <Table hover responsive size="sm" className="v_middle">
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>权益名称</th>
                                <th>权益图片</th>
                                <th>权益说明</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.equity_list.length == 0 ?
                                <tr>
                                    <td colSpan={5}>
                                        <Empty className="mt_20" description="暂时没有数据" />
                                    </td>
                                </tr>
                                : this.equity_list.map((ele, index) =>
                                    <tr key={index + 'profit'}>
                                        <td>{index + 1}</td>
                                        <td>{ele.equityName}</td>
                                        <td>
                                            <Avatar src={ele.equityImg} className="mr_10" size={'large'} shape="disc" />
                                        </td>
                                        <td>
                                            <div className="video_content">
                                                <Tooltip title={ele.content}>{ele.content}</Tooltip>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <Button value='profit/edit' onClick={this.showEdit.bind(this, index)} type="primary" size={'small'}>修改</Button>&nbsp;
                                                <Popconfirm
                                                    value='profit/del'
                                                    okText="确定"
                                                    cancelText='取消'
                                                    title='确定删除吗？'
                                                    onConfirm={this._onDelete.bind(this, ele.equityId)}
                                                >
                                                    <Button type="danger" ghost size={'small'}>删除</Button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </Table>
                </Card>
                <Modal
                    title={this.state.equity_id == 0 ? "创建权益" : '修改权益'}
                    visible={this.state.visible}
                    okText="提交"
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    onOk={this._onPublish}
                    bodyStyle={{ padding: "10px" }}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="权益名称">
                            <Input
                                onChange={(e) => {
                                    this.setState({ equity_name: e.target.value })
                                }}
                                value={equity_name}
                                placeholder="输入权益名称"
                            />
                        </Form.Item>
                        <Form.Item label="服务权益">
                            <Input
                                onChange={(e) => {
                                    this.setState({ tag: e.target.value })
                                }}
                                value={tag}
                                placeholder="输入服务权益"
                            />
                        </Form.Item>
                        <Form.Item label="金币设置">
                            <InputNumber value={this.state.integral} onChange={(e) => { this.setState({ integral: e }) }} />
                        </Form.Item>
                        <Form.Item label="权益说明">
                            <TextArea
                                value={content}
                                rows={4}
                                onChange={(e) => {
                                    this.setState({ content: e.target.value })
                                }}
                                placeholder="输入权益说明"
                            />
                        </Form.Item>
                        <Form.Item label="权益LOGO">
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img = ref}
                                listType="picture-card"
                                accept='image/*'
                                maxLength={1}
                                value={this.state.fileList}
                                tip='上传图片'
                            >

                            </AntdOssUpload>
                            <span style={{ marginTop: '-30px', display: 'block' }}>(45px * 45px)</span>
                        </Form.Item>
                        <Form.Item label="底部图片">
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imgs = ref}
                                listType="picture-card"
                                accept='image/*'
                                maxLength={1}
                                value={this.state.iconList}
                                tip='上传图片'
                            >

                            </AntdOssUpload>
                            <span style={{ marginTop: '-30px', display: 'block' }}>(200px * 200px)</span>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    visible={this.state.previewVisible} maskClosable={true} footer={null}
                    onCancel={this.handleCancelModal}>
                    <img alt="" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                <Modal
                    zIndex={90}
                    title="签到设置"
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
                            <Select onChange={(e) => { this.setState({ type: e }) }} value={this.state.type} style={{ width: 120 }} className="m_w400">
                                <Option key={'0'} value={'0'}>金币</Option>
                                <Option key={'1'} value={'1'}>抽奖机会</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='奖励设置'>
                            <div>
                                <span style={{ marginRight: '5px', color: '#000000', marginLeft: '20px' }}>1天： 金币数／抽奖次数:</span>
                                <InputNumber value={num[0]} onChange={(e) => { this.setState({ num: num.map((item, index) => index == 0 ? e : item) }) }} />
                            </div>
                            <div>
                                <span style={{ marginRight: '5px', color: '#000000', marginLeft: '20px' }}>2天：金币数／抽奖次数:</span>
                                <InputNumber value={num[1]} onChange={(e) => { this.setState({ num: num.map((item, index) => index == 1 ? e : item) }) }} />
                            </div>
                            <div>
                                <span style={{ marginRight: '5px', color: '#000000', marginLeft: '20px' }}>3天：金币数／抽奖次数:</span>
                                <InputNumber value={num[2]} onChange={(e) => { this.setState({ num: num.map((item, index) => index == 2 ? e : item) }) }} />
                            </div>
                            <div>
                                <span style={{ marginRight: '5px', color: '#000000', marginLeft: '20px' }}>4天：金币数／抽奖次数:</span>
                                <InputNumber value={num[3]} onChange={(e) => { this.setState({ num: num.map((item, index) => index == 3 ? e : item) }) }} />
                            </div>
                            <div>
                                <span style={{ marginRight: '5px', color: '#000000', marginLeft: '20px' }}>5天：金币数／抽奖次数:</span>
                                <InputNumber value={num[4]} onChange={(e) => { this.setState({ num: num.map((item, index) => index == 4 ? e : item) }) }} />
                            </div>
                            <div>
                                <span style={{ marginRight: '5px', color: '#000000', marginLeft: '20px' }}>6天：金币数／抽奖次数:</span>
                                <InputNumber value={num[5]} onChange={(e) => { this.setState({ num: num.map((item, index) => index == 5 ? e : item) }) }} />
                            </div>
                            <div>
                                <span style={{ marginRight: '5px', color: '#000000', marginLeft: '20px' }}>7天：金币数／抽奖次数:</span>
                                <InputNumber value={num[6]} onChange={(e) => { this.setState({ num: num.map((item, index) => index == 6 ? e : item) }) }} />
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    zIndex={90}
                    title="首页签到设置"
                    visible={this.state.showhome}
                    okText="确定"
                    width={800}
                    cancelText="取消"
                    closable={true}
                    maskClosable={true}
                    onOk={this.onOks}
                    onCancel={() => {
                        this.setState({ showhome: false })
                    }}
                    bodyStyle={{ padding: "10px 25px" }}
                >
                    <Form.Item label="是否开启">
                        <Switch checked={this.state.isOpen == 1 ? true : false} onChange={(e) => {
                            if (e) {
                                this.setState({ isOpen: 1 })
                            } else {
                                this.setState({ isOpen: 0 })
                            }
                        }} />
                    </Form.Item>
                    <Form.Item label="首页按钮图">
                        <AntdOssUpload
                            actions={this.props.actions}
                            ref={ref => this.img = ref}
                            value={this.state.fileList}
                            listType="picture-card"
                            maxLength={1}
                            accept='image/*'
                        > </AntdOssUpload>
                    </Form.Item>
                    <Form.Item label="签到图(30天)">
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img1 = ref}
                                value={this.state.fileList_1}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+1*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img2 = ref}
                                value={this.state.fileList_2}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+2*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img3 = ref}
                                value={this.state.fileList_3}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+3*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img4 = ref}
                                value={this.state.fileList_4}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+4*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img5 = ref}
                                value={this.state.fileList_5}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+5*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img6 = ref}
                                value={this.state.fileList_6}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+6*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img7 = ref}
                                value={this.state.fileList_7}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+7*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img8 = ref}
                                value={this.state.fileList_8}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+8*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img9 = ref}
                                value={this.state.fileList_9}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+9*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img10 = ref}
                                value={this.state.fileList_10}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+10*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img11 = ref}
                                value={this.state.fileList_11}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+11*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img12 = ref}
                                value={this.state.fileList_12}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+12*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img13 = ref}
                                value={this.state.fileList_13}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+13*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img14 = ref}
                                value={this.state.fileList_14}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+14*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img15 = ref}
                                value={this.state.fileList_15}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+15*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img16 = ref}
                                value={this.state.fileList_16}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+16*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img17 = ref}
                                value={this.state.fileList_17}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+17*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img18 = ref}
                                value={this.state.fileList_18}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+18*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img19 = ref}
                                value={this.state.fileList_19}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+19*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img20 = ref}
                                value={this.state.fileList_20}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+20*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img21 = ref}
                                value={this.state.fileList_21}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+21*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img22 = ref}
                                value={this.state.fileList_22}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+22*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img23 = ref}
                                value={this.state.fileList_23}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+23*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img24 = ref}
                                value={this.state.fileList_24}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+24*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img25 = ref}
                                value={this.state.fileList_25}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+25*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img26 = ref}
                                value={this.state.fileList_26}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+26*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img27 = ref}
                                value={this.state.fileList_27}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+27*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img28 = ref}
                                value={this.state.fileList_28}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+28*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img29 = ref}
                                value={this.state.fileList_29}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime+29*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.img30 = ref}
                                value={this.state.fileList_30}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                    </Form.Item>
                    <Form.Item label="已过期签到图(7天)">
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime-1*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imga = ref}
                                value={this.state.fileList_a}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime-2*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imgb = ref}
                                value={this.state.fileList_b}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime-3*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imgc = ref}
                                value={this.state.fileList_c}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime-4*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imgd = ref}
                                value={this.state.fileList_d}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime-5*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imge = ref}
                                value={this.state.fileList_e}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime-6*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imgf = ref}
                                value={this.state.fileList_f}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                        <div style={{display:'inline-block'}}>
                            <div>{moment.unix(this.state.ttime-7*86400).format('YYYY-MM-DD')}</div>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imgg = ref}
                                value={this.state.fileList_g}
                                listType="picture-card"
                                maxLength={1}
                                disabled={false}
                                accept='image/*'
                            >
                            </AntdOssUpload>
                        </div>
                    </Form.Item>
                </Modal>
                <Modal title={'签到规则设置'} onOk={this.onOkey} visible={this.state.rulePanel} maskClosable={false} okText="确定" cancelText='取消' onCancel={() => {
                    this.setState({ rulePanel: false })
                }}>
                    <Input.TextArea autoSize={{ minRows: 6 }} defaultValue={'签到规则设置'} value={this.state.text} onChange={e => { this.setState({ text: e.target.value }) }}></Input.TextArea>
                    {/* <div style={{color:'red',fontSize:'14px',marginTop:'10px',marginBottom:'10px'}}>提示:换行请用";"隔开,注意区分大小写</div>
                    <Button onClick={()=>{this.setState({
                        text:this.state.text+';'
                    })}}>换行</Button> */}
                </Modal>
            </div>
        );
    }
}

const LayoutComponent = ProfitSetting;
const mapStateToProps = state => {
    return {
        equity_list: state.user.equity_list,
        user: state.site.user,
        num: state.user.num,
        check_list: state.ad.check_list,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });