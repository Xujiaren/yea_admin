import React, { Component } from 'react';
import connectComponent from '../../util/connect';
import { message, Tag, Icon, Radio, Spin, Form, Empty, Select, Button, Modal, Table, Popconfirm, Card, PageHeader, Input, InputNumber, Upload } from 'antd'
import AntdOssUpload from '../../components/AntdOssUpload';
import customUpload from '../../components/customUpload'
import { number } from 'prop-types';
class H5 extends Component {
    state = {
        page: ['', '', '', '', '', '', '', '', '', '', '', ''],
        billId: 0,
        bill: {},
        billList: ['', '', '', '', '', '', '', '', '', '', '', ''],
        frontColor: '#000000',
        frontColor2: '#000000',
        frontSize: '10',
        frontSize2: '10',
        frontSpace: 'Simsun',
        frontSpace2: 'Simsun',
        img: '',
        isRough: 0,
        rowSpace: '100%',
        text: '',
        title: '',
        year: 0,
        cover_url: '',
        rulePanel: false,
        fileList: [],
        rulePanels: false,
        rulePanelss: false,
        pageIndex: 1,
        videoList: [],
        ruleMusic: false,
        fileLists: [],
        imgPanels: false,
        bill_img: '',
        align_type: 0,
        text_space: '1',
        colorTip:true,
        type:0,
    }

    page_current = 0
    page_total = 0
    page_size = 10
    componentDidMount() {
        const { id } = this.props.match.params
        const { actions } = this.props
        if (id != 0) {
            this.setState({
                billId: parseInt(id),
                type:1
            }, () => {
                this.getBill()
            })
        } else {
            var date = new Date();
            var year = date.getFullYear()
            actions.postOpBills({
                bill_id: 0,
                year: year,
                resolved: (res) => {
                    this.setState({
                        billId: res.billId,
                        year: res.year,
                        billList: ['', '', '', '', '', '', '', '', '', '', '', ''],
                    })
                },
                rejected: (err) => {
                    console.log(err)
                }
            })
        }

    }
    componentWillMount() {

    }
    componentWillReceiveProps(n_props) {

    }
    getBill = () => {
        const { actions } = this.props
        const { page } = this.state
        actions.getOpBill({
            keyword: '',
            billId: this.state.billId,
            resolved: (res) => {
                let list = JSON.parse(res[0].data)
                let lists = Object.values(list)
                let lit = lists
                for (var i = 0; i < page.length - lists.length; i++) {
                    var obj = {
                        frontColor: '',
                        frontSize: '',
                        frontSpace: '',
                        img: '',
                        isRough: '',
                        rowSpace: '',
                        text: ''
                    }
                    lit = lit.concat(obj)
                }
                let fileLists = []
                fileLists.push({ response: { resultBody: res[0].billImg }, type: 'image/png', uid: 1, name: 'img' + 1, status: 'done', url: res[0].billImg })
                this.setState({
                    fileLists: fileLists,
                    bill_img: res[0].billImg,
                    bill: res[0],
                    billList: lit,
                    title: res[0].title,
                    year: res[0].year,
                    pageIndex: 1,
                    cover_url: res[0].coverUrl,
                }, () => {
                    this.onItem(this.state.billList[0], 0)
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onCourseVideoChange = ({ file, fileList }) => {
        const isMedia = file.type.indexOf('audio') > -1
        if (!isMedia) {
            message.error('???????????? MP3 ?????????????????????!');
            return;
        }
        let media_id = ''
        let duration = ''
        let size = ''
        let videoList = fileList
        if (file.status == 'done' && file.response.err == '0') {
            media_id = file.response.data.videoId
            message.info('????????????')
            size = (file.size / 1000000).toFixed(2)
            this.setState({
                size,
                duration
            })
        } else if (file.status == 'error') {
            message.info('????????????')
        }
        this.setState({
            videoList: videoList,
            cover_url: media_id
        })
        console.log(videoList)
    }
    onBack = () => {
        const { id } = this.props.match.params
        const { actions } = this.props
        if (id == 0) {
            actions.deleteBills({
                bill_ids: this.state.billId,
                action: 'delete',
                resolved: (data) => {
                    window.history.back()
                },
                rejected: (data) => {
                    message.error({
                        content: data
                    })
                }
            })
        } else {
            window.history.back()
        }
    }
    onItem = (val, ele) => {
        const { bill, pageIndex, img, frontSize, frontColor, frontSpace, isRough, rowSpace, text } = this.state
        let list = bill[pageIndex - 1]
        // if(list.img!=img||list.frontColor!=frontColor||list.frontSize!=frontSize||list.frontSpace!=frontSpace||list.isRough!=isRough||list.rowSpace!=rowSpace||list.text!=text){
        //     message.info({
        //         content:'???????????????????????????'
        //     });
        //     return;
        // }
        let fileList = []
        if (val.img) {
            fileList.push({ response: { resultBody: val.img }, type: 'image/png', uid: ele, name: 'img' + ele, status: 'done', url: val.img })
            this.setState({
                fileList: fileList
            })
        } else {
            this.setState({
                fileList: []
            })
        }
        if (val.frontColor) {
            this.setState({
                frontColor: val.frontColor,
            })
        } else {
            this.setState({
                frontColor: '#000000',
            })
        }
        if (val.frontSize) {
            this.setState({
                frontSize: val.frontSize,
            })
        } else {
            this.setState({
                frontSize: '10',
            })
        }
        if (val.frontSpace) {
            this.setState({
                frontSpace: val.frontSpace,
            })
        } else {
            this.setState({
                frontSpace: 'Simsun',
            })
        }
        if (val.frontColor2) {
            this.setState({
                frontColor2: val.frontColor2,
            })
        } else {
            this.setState({
                frontColor2: '#000000',
            })
        }
        if (val.frontSize2) {
            this.setState({
                frontSize2: val.frontSize2,
            })
        } else {
            this.setState({
                frontSize2: '10',
            })
        }
        if (val.frontSpace2) {
            this.setState({
                frontSpace2: val.frontSpace2,
            })
        } else {
            this.setState({
                frontSpace2: 'Simsun',
            })
        }
        if (val.isRough) {
            this.setState({
                isRough: parseInt(val.isRough),
            })
        } else {
            this.setState({
                isRough: '0',
            })
        }
        if (val.rowSpace) {
            this.setState({
                rowSpace: val.rowSpace,
            })
        } else {
            this.setState({
                rowSpace: '100%',
            })
        }
        if (val.img) {
            this.setState({
                img: val.img
            })
        } else {
            this.setState({
                img: ''
            })
        }
        if (val.text) {
            this.setState({
                text: val.text
            })
        } else {
            this.setState({
                text: ''
            })
        }
        if (val.textSpace) {
            this.setState({
                text_space: val.textSpace
            })
        } else {
            this.setState({
                text_space: '0'
            })
        }
        if (val.alignType) {
            this.setState({
                align_type: val.alignType
            })
        } else {
            this.setState({
                align_type: 'left'
            })
        }
        this.setState({
            pageIndex: ele + 1
        })
    }
    onOk = () => {
        const img = (this.imgs && this.imgs.getValue()) || ''
        this.setState({
            img: img,
            rulePanels: false
        })
    }
    onImgs = () => {
        const img = (this.imgss && this.imgss.getValue()) || ''
        this.setState({
            bill_img: img,
            imgPanels: false
        })
    }
    onTrue = () => {
        var that = this
        const { actions } = this.props
        const { page, title, year, billId, cover_url, frontColor, frontSize, frontSpace, img, isRough, pageIndex, rowSpace, text, bill_img, frontColor2, frontSpace2, frontSize2, align_type, text_space } = this.state
        actions.postOpBill({
            title: title,
            year: year,
            bill_id: billId,
            cover_url: cover_url,
            front_color: frontColor,
            front_size: frontSize,
            front_space: frontSpace,
            img: img,
            is_rough: isRough,
            pageIndex: pageIndex,
            row_space: rowSpace,
            status: 0,
            text: text,
            bill_img: bill_img,
            front_color2: frontColor2,
            front_size2: frontSize2,
            front_space2: frontSpace2,
            align_type: align_type,
            text_space: text_space,
            resolved: (res) => {
                message.success({ content: '????????????' })
                actions.getOpBill({
                    keyword: '',
                    billId: billId,
                    resolved: (res) => {
                        let list = JSON.parse(res[0].data)
                        let lists = Object.values(list)
                        for (var i = 0; i < page.length - lists.length; i++) {
                            var obj = {
                                frontColor: '',
                                frontSize: '',
                                frontSpace: '',
                                img: '',
                                isRough: '',
                                rowSpace: '',
                                text: ''
                            }
                            lists = lists.concat(obj)
                        }
                        that.setState({
                            bill: res[0],
                            billList: lists,
                            title: res[0].title,
                            year: res[0].year,
                            cover_url: res[0].coverUrl,
                            pageIndex: pageIndex,
                        }, () => {
                            that.onItem(that.state.billList[pageIndex - 1], pageIndex - 1)
                        })
                    },
                    rejected: (err) => {
                        console.log(err)
                    }
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    onAdd = (val) => {
        let lst = this.state.text.split(';')
        let vas = lst[lst.length-1]
        if(vas.indexOf('${')>-1){
            message.info({content:'????????????????????????????????????????????????????????????'});
            return;
        }
        this.setState({
            text: this.state.text + val
        })
    }
    render() {
        const { page, billList } = this.state
        const uploadBtnVideo = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">????????????</div>
            </div>
        );
        let color=['','','','','','','','','','','','','','','','']
        let colors=['','','','','','','','','','','','','','','','']
        let col=['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F']
        return (
            <div className="animated fadeIn">
                <Card>
                    <PageHeader
                        className="pad_0"
                        ghost={false}
                        onBack={this.onBack}
                        title=""
                        subTitle={'??????????????????'}
                        extra={<>
                            <Button onClick={() => {
                                this.setState({
                                    rulePanelss: true
                                })
                            }}>?????????????????????</Button>
                            <Button onClick={() => { this.setState({ imgPanels: true }) }}>????????????</Button>
                            <Button onClick={() => { this.setState({ ruleMusic: true }) }}>??????</Button>
                            {/* <Button onClick={() => this.props.history.push("/year/setting")}>?????????</Button> */}
                            {/* <Button onClick={() => this.props.history.push("/year/setting")}>??????</Button> */}
                            <Button onClick={this.onBack}>??????</Button>
                            <Button disabled={this.state.type==1?true:false} onClick={() => { 
                                if(!this.state.bill_img){
                                    message.info({
                                        content:'???????????????'
                                    });
                                    return;
                                }
                                this.onTrue();
                                window.history.back()
                             }}>??????</Button>
                        </>}
                    >
                        {/* <iframe frameBorder={0} src='/h5ds.html' style={{width:'100%',height:680}}></iframe> */}
                        <Card style={{ width: '100%', height: 680, backgroundColor: '#000000' }}>
                            <div style={{ width: '100vw', display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '226px', height: '620px', margin: '5px', border: '1px solid #cccccc', overflowY: 'scroll', backgroundColor: '#ffffff', overflowX: 'hidden' }}>
                                    {
                                        billList.map((item, index) => {
                                            return (
                                                <div style={{ width: '200px', height: '300px', marginLeft: '5px', marginTop: '5px', marginBottom: '5px', border: '1px solid #cccccc', cursor: 'pointer' }}
                                                    onClick={this.state.pageIndex != index + 1 ? this.onItem.bind(this, item, index) : null}
                                                >
                                                    {
                                                        item.img ?
                                                            <img src={item.img} style={{ width: '100%', height: '100%' }} />
                                                            : null
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div style={{ width: '900px', height: '620px', backgroundColor: '#000000', display: 'inline-block', marginTop: '5px', marginLeft: '20px' }}>
                                    <div style={{ color: '#ffffff', textAlign: 'center', fontSize: '12px' }}>?????????????????????????????????????????????????????????;???????????????????????????'?????????????????????+???????????????????????????'</div>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                                        <Button onClick={() => { this.setState({ rulePanels: true }) }}>??????</Button>
                                        <Button style={{ marginLeft: '30px' }} onClick={() => { this.setState({ rulePanel: true }) }}>??????</Button>
                                        <Button style={{ marginLeft: '30px' }} disabled={this.state.type==1?true:false} onClick={this.onTrue}>??????</Button>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                        <div style={{ width: '360px', height: '540px', backgroundColor: '#ffffff', position: 'relative' }}>
                                            {
                                                this.state.img ?
                                                    <img src={this.state.img} style={{ width: '100%', height: '100%' }} />
                                                    : null
                                            }
                                            <div style={{ position: 'absolute', left: '0', top: '10px', textAlign: 'center', width: '360px', fontSize: '16px' }}>{this.state.pageIndex}/12</div>
                                            <div style={{ position: 'absolute', left: '0', top: '80px', marginLeft: '10px', width: '360px' }}>
                                                {
                                                    this.state.text.split(';').map((item, index) => {
                                                        let val = [
                                                            '${regDate}',
                                                            '${regDays}',
                                                            '${year}',
                                                            '${learnCourses}',
                                                            '${learnCoursesPercent}',
                                                            '${localtion}',
                                                            '${locationRank}',
                                                            '${authDate}',
                                                            '${userBalance}',
                                                            '${muchCourseName}',
                                                            '${muchCourseTimes}',
                                                            '${ngintDate}',
                                                            '${ngintDateCourseName}',
                                                            '${okHours}',
                                                            '${pkVictors}',
                                                            '${pkAmarys}',
                                                            '${pkCalled}',
                                                            '${followTeacherName}',
                                                            '${watchFollowCourses}',
                                                            '${rewardTeacherName}',
                                                            '${rewardTimes}',
                                                            '${rewardIntegrals}',
                                                            '${yearCalled}',
                                                            '${activePercent}',
                                                            '${keywordIntro}',
                                                            '${keyword}'
                                                        ]
                                                        let words = []
                                                        let vas = ''
                                                        for (var i = 0; i < val.length; i++) {
                                                            let ads = `</span><span style={{color:'${this.state.frontColor2}',fontSize:'${this.state.frontSize2}',fontFamily:'${this.state.frontSpace2}'}}>${val[i]}</span><span>`

                                                            if (item.indexOf(val[i]) > -1) {
                                                                words = item.split(val[i])
                                                                vas = val[i]
                                                            }

                                                        }

                                                        return (
                                                            <div style={this.state.isRough == 1 ? { color: this.state.frontColor, fontSize: this.state.frontSize + 'px', fontFamily: this.state.frontSpace, lineHeight: this.state.rowSpace, fontWeight: 'bolder', width: '350px', textAlign: this.state.align_type } :
                                                                { color: this.state.frontColor, fontSize: this.state.frontSize + 'px', fontFamily: this.state.frontSpace, lineHeight: this.state.rowSpace, width: '350px', textAlign: this.state.align_type }
                                                            }>
                                                                {
                                                                    words.length > 0 ?
                                                                        <span style={{ letterSpacing: this.state.text_space + 'px' }}>{words[0]}</span>
                                                                        :
                                                                        <span style={{ letterSpacing: this.state.text_space + 'px' }}>{item}</span>
                                                                }
                                                                {
                                                                    words.length > 0 ?
                                                                        <span style={{ color: this.state.frontColor2, fontSize: this.state.frontSize2 + 'px', fontFamily: this.state.frontSpace2 }}>{vas}</span>
                                                                        : null
                                                                }
                                                                {
                                                                    words.length > 0 ?
                                                                        <span style={{ letterSpacing: this.state.text_space + 'px' }}>{words[1]}</span>
                                                                        : null
                                                                }

                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ width: '380px', height: '620px', backgroundColor: '#ffffff', display: 'inline-block', marginTop: '5px', marginLeft: '20px', padding: '20px', }}>
                                    {
                                        this.state.text ?
                                            <div>
                                                <div style={{ fontSize: '18px', height: '30px', lineHeight: '30px', fontWeight: 'bolder' }}>????????????</div>
                                                <div style={{ borderTop: '1px solid #cccccc', marginTop: '10px' }}></div>
                                                <div style={{ marginTop: '4px', display: 'flex' }}>
                                                    <div>
                                                        <Form.Item label="????????????">
                                                            <Select style={{ width: '150px' }} value={this.state.frontSpace} onChange={(e) => { this.setState({ frontSpace: e }) }}>
                                                                <Select.Option value={'Simsun'}>??????(??????)</Select.Option>
                                                                <Select.Option value={'STXihei'}>????????????</Select.Option>
                                                                <Select.Option value={'serif'}>????????????</Select.Option>
                                                                <Select.Option value={'fantasy'}>????????????</Select.Option>
                                                                {/* <Select.Option value={'STHeiti'}>????????????</Select.Option> */}
                                                                <Select.Option value={'STKaiti'}>????????????</Select.Option>
                                                                <Select.Option value={'STSong'}>????????????</Select.Option>
                                                                <Select.Option value={'STFangsong'}>????????????</Select.Option>
                                                                <Select.Option value={'STZhongsong'}>????????????</Select.Option>
                                                                <Select.Option value={'SimHei'}>??????</Select.Option>
                                                                <Select.Option value={'NSimSun'}>?????????</Select.Option>
                                                                <Select.Option value={'FangSong'}>??????</Select.Option>
                                                                <Select.Option value={'KaiTi'}>??????</Select.Option>
                                                                <Select.Option value={'LiSu'}>??????</Select.Option>
                                                                {/* <Select.Option value={'FangSong_GB2312'}>??????_GB2312</Select.Option>
                                                            <Select.Option value={'KaiTi_GB2312'}>??????_GB2312</Select.Option>
                                                            <Select.Option value={'Microsoft JhengHei'}>???????????????</Select.Option>
                                                            <Select.Option value={'Microsoft YaHei'}>???????????????</Select.Option> */}
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item label="????????????">
                                                            {/* <Select style={{ width: '150px' }} value={this.state.frontSize} onChange={(e) => { this.setState({ frontSize: e }) }}>
                                                            <Select.Option value={'10'}>??????(10)</Select.Option>
                                                                <Select.Option value={'12'}>12</Select.Option>
                                                                <Select.Option value={'14'}>14</Select.Option>
                                                                <Select.Option value={'16'}>16</Select.Option>
                                                                <Select.Option value={'18'}>18</Select.Option>
                                                                <Select.Option value={'20'}>20</Select.Option>
                                                                <Select.Option value={'22'}>22</Select.Option>
                                                                <Select.Option value={'24'}>24</Select.Option>
                                                                <Select.Option value={'26'}>26</Select.Option>
                                                                <Select.Option value={'28'}>28</Select.Option>
                                                                <Select.Option value={'30'}>30</Select.Option>
                                                                <Select.Option value={'32'}>32</Select.Option>
                                                                <Select.Option value={'34'}>34</Select.Option>
                                                                <Select.Option value={'36'}>36</Select.Option>
                                                                <Select.Option value={'38'}>38</Select.Option>
                                                                <Select.Option value={'40'}>40</Select.Option>
                                                                <Select.Option value={'42'}>42</Select.Option>
                                                                <Select.Option value={'44'}>44</Select.Option>
                                                                <Select.Option value={'46'}>46</Select.Option>
                                                                <Select.Option value={'48'}>48</Select.Option>
                                                                <Select.Option value={'50'}>50</Select.Option>
                                                            </Select> */}
                                                            <InputNumber style={{ width: '150px' }} min={10} max={80} value={this.state.frontSize} onChange={(val) => {
                                                                if (val !== '' && !isNaN(val)) {
                                                                    val = Math.round(val)
                                                                    if (val < 0) val = 0
                                                                    this.setState({ frontSize: val })
                                                                }
                                                            }} />
                                                        </Form.Item>
                                                        <Form.Item label="????????????">
                                                            <Select style={{ width: '150px' }} value={this.state.frontColor} onChange={(e) => { this.setState({ frontColor: e }) }}>
                                                                <Select.Option value={'#000000'}><span style={{ color: '#000000' }}>???</span> ??????(#000000) </Select.Option>
                                                                {/* <Select.Option value={'#000000'}></Select.Option> */}
                                                                <Select.Option value={'#FF0000'}><span style={{ color: '#FF0000' }}>???</span> #FF0000 </Select.Option>
                                                                <Select.Option value={'#00FF00'}><span style={{ color: '#00FF00' }}>???</span> #00FF00 </Select.Option>
                                                                <Select.Option value={'#0000FF'}><span style={{ color: '#0000FF' }}>???</span> #0000FF </Select.Option>
                                                                <Select.Option value={'#FFFF00'}><span style={{ color: '#FFFF00' }}>???</span> #FFFF00 </Select.Option>
                                                                <Select.Option value={'#00FFFF'}><span style={{ color: '#00FFFF' }}>???</span> #00FFFF </Select.Option>
                                                                <Select.Option value={'#C0C0C0'}><span style={{ color: '#C0C0C0' }}>???</span> #C0C0C0 </Select.Option>
                                                                <Select.Option value={'#FFFFFF'}><span style={{ color: '#FFFFFF' }}>???</span> #FFFFFF </Select.Option>
                                                                <Select.Option value={'#AAAAAA'}><span style={{ color: '#AAAAAA' }}>???</span> #AAAAAA </Select.Option>
                                                                <Select.Option value={'#FF44AA'}><span style={{ color: '#FF44AA' }}>???</span> #FF44AA </Select.Option>
                                                                <Select.Option value={'#FF7744'}><span style={{ color: '#FF7744' }}>???</span> #FF7744 </Select.Option>
                                                                <Select.Option value={'#FFAA33'}><span style={{ color: '#FFAA33' }}>???</span> #FFAA33 </Select.Option>
                                                                <Select.Option value={'#CCFF33'}><span style={{ color: '#CCFF33' }}>???</span> #CCFF33 </Select.Option>
                                                                <Select.Option value={'#33FFAA'}><span style={{ color: '#33FFAA' }}>???</span> #33FFAA </Select.Option>
                                                                <Select.Option value={'#33FFFF'}><span style={{ color: '#33FFFF' }}>???</span> #33FFFF </Select.Option>
                                                                <Select.Option value={'#7744FF'}><span style={{ color: '#7744FF' }}>???</span> #7744FF </Select.Option>
                                                                <Select.Option value={'#4400CC'}><span style={{ color: '#4400CC' }}>???</span> #4400CC </Select.Option>
                                                                <Select.Option value={'#B94FFF'}><span style={{ color: '#B94FFF' }}>???</span> #B94FFF </Select.Option>
                                                                <Select.Option value={'#880000'}><span style={{ color: '#880000' }}>???</span> #880000 </Select.Option>
                                                                <Select.Option value={'#EEEE00'}><span style={{ color: '#EEEE00' }}>???</span> #EEEE00 </Select.Option>
                                                                <Select.Option value={'#CCBBFF'}><span style={{ color: '#CCBBFF' }}>???</span> #CCBBFF </Select.Option>
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item label="????????????">
                                                            <Select style={{ width: '150px' }} value={this.state.isRough} onChange={(e) => { this.setState({ isRough: e }) }}>
                                                                <Select.Option value={0}>???</Select.Option>
                                                                <Select.Option value={1}>???</Select.Option>

                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item label="?????????">
                                                            {/* <Select style={{ width: '150px' }} value={this.state.rowSpace} onChange={(e) => { this.setState({ rowSpace: e }) }}>
                                                                <Select.Option value={'100%'}>??????(100%)</Select.Option>
                                                                <Select.Option value={'90%'}>90%</Select.Option>
                                                                <Select.Option value={'150%'}>150%</Select.Option>
                                                                <Select.Option value={'200%'}>200%</Select.Option>
                                                                <Select.Option value={'250%'}>250%</Select.Option>
                                                                <Select.Option value={'300%'}>300%</Select.Option>
                                                                <Select.Option value={'350%'}>350%</Select.Option>
                                                                <Select.Option value={'400%'}>400%</Select.Option>
                                                                <Select.Option value={'450%'}>450%</Select.Option>
                                                                <Select.Option value={'500%'}>500%</Select.Option>
                                                                <Select.Option value={'550%'}>550%</Select.Option>
                                                                <Select.Option value={'600%'}>600%</Select.Option>
                                                                <Select.Option value={'650%'}>650%</Select.Option>
                                                                <Select.Option value={'700%'}>700%</Select.Option>
                                                                <Select.Option value={'750%'}>750%</Select.Option>
                                                                <Select.Option value={'800%'}>800%</Select.Option>
                                                                <Select.Option value={'850%'}>850%</Select.Option>
                                                                <Select.Option value={'900%'}>900%</Select.Option>
                                                                <Select.Option value={'950%'}>950%</Select.Option>
                                                                <Select.Option value={'1000%'}>1000%</Select.Option>
                                                            </Select> */}
                                                            <InputNumber style={{ width: '150px' }} min={0} max={2000}
                                                                value={this.state.rowSpace} onChange={(val) => {
                                                                    if (val !== '' && !isNaN(val)) {
                                                                        val = Math.round(val)
                                                                        if (val < 0) val = 0
                                                                        this.setState({ rowSpace: val })
                                                                    }
                                                                    console.log(val,'???')
                                                                    this.setState({ rowSpace: val+'%' })
                                                                }} />
                                                        </Form.Item>
                                                    </div>
                                                    <div>
                                                        <Form.Item label="??????????????????">
                                                            <Select style={{ width: '150px' }} value={this.state.frontSpace2} onChange={(e) => { this.setState({ frontSpace2: e }) }}>
                                                                <Select.Option value={'Simsun'}>??????(??????)</Select.Option>
                                                                <Select.Option value={'STXihei'}>????????????</Select.Option>
                                                                <Select.Option value={'serif'}>????????????</Select.Option>
                                                                <Select.Option value={'fantasy'}>????????????</Select.Option>
                                                                {/* <Select.Option value={'STHeiti'}>????????????</Select.Option> */}
                                                                <Select.Option value={'STKaiti'}>????????????</Select.Option>
                                                                <Select.Option value={'STSong'}>????????????</Select.Option>
                                                                <Select.Option value={'STFangsong'}>????????????</Select.Option>
                                                                <Select.Option value={'STZhongsong'}>????????????</Select.Option>
                                                                <Select.Option value={'SimHei'}>??????</Select.Option>
                                                                <Select.Option value={'NSimSun'}>?????????</Select.Option>
                                                                <Select.Option value={'FangSong'}>??????</Select.Option>
                                                                <Select.Option value={'KaiTi'}>??????</Select.Option>
                                                                <Select.Option value={'LiSu'}>??????</Select.Option>
                                                                {/* <Select.Option value={'FangSong_GB2312'}>??????_GB2312</Select.Option>
                                                            <Select.Option value={'KaiTi_GB2312'}>??????_GB2312</Select.Option>
                                                            <Select.Option value={'Microsoft JhengHei'}>???????????????</Select.Option>
                                                            <Select.Option value={'Microsoft YaHei'}>???????????????</Select.Option> */}
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item label="??????????????????">
                                                            {/* <Select style={{ width: '150px' }} value={this.state.frontSize2} onChange={(e) => { this.setState({ frontSize2: e }) }}>
                                                                <Select.Option value={'10'}>??????(10)</Select.Option>
                                                                <Select.Option value={'12'}>12</Select.Option>
                                                                <Select.Option value={'14'}>14</Select.Option>
                                                                <Select.Option value={'16'}>16</Select.Option>
                                                                <Select.Option value={'18'}>18</Select.Option>
                                                                <Select.Option value={'20'}>20</Select.Option>
                                                                <Select.Option value={'22'}>22</Select.Option>
                                                                <Select.Option value={'24'}>24</Select.Option>
                                                                <Select.Option value={'26'}>26</Select.Option>
                                                                <Select.Option value={'28'}>28</Select.Option>
                                                                <Select.Option value={'30'}>30</Select.Option>
                                                                <Select.Option value={'32'}>32</Select.Option>
                                                                <Select.Option value={'34'}>34</Select.Option>
                                                                <Select.Option value={'36'}>36</Select.Option>
                                                                <Select.Option value={'38'}>38</Select.Option>
                                                                <Select.Option value={'40'}>40</Select.Option>
                                                                <Select.Option value={'42'}>42</Select.Option>
                                                                <Select.Option value={'44'}>44</Select.Option>
                                                                <Select.Option value={'46'}>46</Select.Option>
                                                                <Select.Option value={'48'}>48</Select.Option>
                                                                <Select.Option value={'50'}>50</Select.Option>
                                                            </Select> */}
                                                            <InputNumber style={{ width: '150px' }} min={10} max={80} value={this.state.frontSize2} onChange={(val) => {
                                                                if (val !== '' && !isNaN(val)) {
                                                                    val = Math.round(val)
                                                                    if (val < 0) val = 0
                                                                    this.setState({ frontSize2: val })
                                                                }
                                                            }} />
                                                        </Form.Item>
                                                        <Form.Item label="??????????????????">
                                                            <Select style={{ width: '150px' }} value={this.state.frontColor2} onChange={(e) => { this.setState({ frontColor2: e }) }}>
                                                                <Select.Option value={'#000000'}><span style={{ color: '#000000' }}>???</span> ??????(#000000) </Select.Option>
                                                                {/* <Select.Option value={'#000000'}></Select.Option> */}
                                                                <Select.Option value={'#FF0000'}><span style={{ color: '#FF0000' }}>???</span> #FF0000 </Select.Option>
                                                                <Select.Option value={'#00FF00'}><span style={{ color: '#00FF00' }}>???</span> #00FF00 </Select.Option>
                                                                <Select.Option value={'#0000FF'}><span style={{ color: '#0000FF' }}>???</span> #0000FF </Select.Option>
                                                                <Select.Option value={'#FFFF00'}><span style={{ color: '#FFFF00' }}>???</span> #FFFF00 </Select.Option>
                                                                <Select.Option value={'#00FFFF'}><span style={{ color: '#00FFFF' }}>???</span> #00FFFF </Select.Option>
                                                                <Select.Option value={'#C0C0C0'}><span style={{ color: '#C0C0C0' }}>???</span> #C0C0C0 </Select.Option>
                                                                <Select.Option value={'#FFFFFF'}><span style={{ color: '#FFFFFF' }}>???</span> #FFFFFF </Select.Option>
                                                                <Select.Option value={'#AAAAAA'}><span style={{ color: '#AAAAAA' }}>???</span> #AAAAAA </Select.Option>
                                                                <Select.Option value={'#FF44AA'}><span style={{ color: '#FF44AA' }}>???</span> #FF44AA </Select.Option>
                                                                <Select.Option value={'#FF7744'}><span style={{ color: '#FF7744' }}>???</span> #FF7744 </Select.Option>
                                                                <Select.Option value={'#FFAA33'}><span style={{ color: '#FFAA33' }}>???</span> #FFAA33 </Select.Option>
                                                                <Select.Option value={'#CCFF33'}><span style={{ color: '#CCFF33' }}>???</span> #CCFF33 </Select.Option>
                                                                <Select.Option value={'#33FFAA'}><span style={{ color: '#33FFAA' }}>???</span> #33FFAA </Select.Option>
                                                                <Select.Option value={'#33FFFF'}><span style={{ color: '#33FFFF' }}>???</span> #33FFFF </Select.Option>
                                                                <Select.Option value={'#7744FF'}><span style={{ color: '#7744FF' }}>???</span> #7744FF </Select.Option>
                                                                <Select.Option value={'#4400CC'}><span style={{ color: '#4400CC' }}>???</span> #4400CC </Select.Option>
                                                                <Select.Option value={'#B94FFF'}><span style={{ color: '#B94FFF' }}>???</span> #B94FFF </Select.Option>
                                                                <Select.Option value={'#880000'}><span style={{ color: '#880000' }}>???</span> #880000 </Select.Option>
                                                                <Select.Option value={'#EEEE00'}><span style={{ color: '#EEEE00' }}>???</span> #EEEE00 </Select.Option>
                                                                <Select.Option value={'#CCBBFF'}><span style={{ color: '#CCBBFF' }}>???</span> #CCBBFF </Select.Option>
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item label="????????????">
                                                            <Select style={{ width: '150px' }} value={this.state.align_type} onChange={(e) => { this.setState({ align_type: e }) }}>
                                                                <Select.Option value={'left'}>?????????</Select.Option>
                                                                <Select.Option value={'center'}>??????</Select.Option>
                                                                <Select.Option value={'right'}>?????????</Select.Option>
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item label="?????????">
                                                            {/* <Select style={{ width: '150px' }} value={this.state.text_space} onChange={(e) => { this.setState({ text_space: e }) }}>
                                                                <Select.Option value={'0'}>??????0</Select.Option>
                                                                <Select.Option value={'5'}>5px</Select.Option>
                                                                <Select.Option value={'10'}>10px</Select.Option>
                                                                <Select.Option value={'15'}>15px</Select.Option>
                                                                <Select.Option value={'20'}>20px</Select.Option>
                                                                <Select.Option value={'25'}>25px</Select.Option>
                                                                <Select.Option value={'30'}>30px</Select.Option>
                                                            </Select> */}
                                                            <InputNumber style={{ width: '150px' }} min={0} max={50} value={this.state.text_space} onChange={(val) => {
                                                                if (val !== '' && !isNaN(val)) {
                                                                    val = Math.round(val)
                                                                    if (val < 0) val = 0
                                                                    this.setState({ text_space: val })
                                                                }
                                                            }} />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            </div>
                                            : null
                                    }
                                </div>
                            </div>

                        </Card>
                    </PageHeader>
                </Card>
                <Modal title={'??????'} onOk={() => { this.setState({ rulePanel: false }) }} visible={this.state.rulePanel} maskClosable={false} okText="??????" cancelText='??????' onCancel={() => {
                    this.setState({ rulePanel: false })
                }}>
                    <Input.TextArea autoSize={{ minRows: 6 }} value={this.state.text} onChange={e => { this.setState({ text: e.target.value }) }}></Input.TextArea>
                    <div style={{ marginTop: '10px' }}>
                        <Button onClick={() => {
                            this.setState({
                                text: this.state.text + ';'
                            })
                        }}>????????????</Button>
                    </div>
                    <div style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>??????????????????????????????";"??????,???????????????"???"!</div>
                    <div style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>????????????????????????????????????????????????????????????????????????????????????(??????)?????????</div>
                    <Form.Item label="????????????????????????">
                        <Button onClick={this.onAdd.bind(this, '${regDate}')}>????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${regDays}')}>????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${year}')}>??????</Button>
                        <Button onClick={this.onAdd.bind(this, '${learnCourses}')}>??????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${learnCoursesPercent}')}>?????????????????????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${localtion}')}>?????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${locationRank}')}>??????</Button>
                        <Button onClick={this.onAdd.bind(this, '${authDate}')}>????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${userBalance}')}>????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${muchCourseName}')}>????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${muchCourseTimes}')}>????????????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${ngintDate}')}>??????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${ngintDateCourseName}')}>??????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${okHours}')}>pk??????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${pkVictors}')}>pk????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${pkAmarys}')}>pk??????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${pkCalled}')}>pk??????</Button>
                        <Button onClick={this.onAdd.bind(this, '${followTeacherName}')}>?????????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${watchFollowCourses}')}>?????????????????????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${rewardTeacherName}')}>????????????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${rewardTimes}')}>?????????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${rewardIntegrals}')}>??????????????????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${yearCalled}')}>????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${activePercent}')}>?????????????????????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${keywordIntro}')}>?????????????????????</Button>
                        <Button onClick={this.onAdd.bind(this, '${keyword}')}>???????????????</Button>
                    </Form.Item>
                </Modal>
                <Modal title={'??????'} onOk={this.onImgs} visible={this.state.imgPanels} maskClosable={false} okText="??????" cancelText='??????' onCancel={() => {
                    this.setState({ imgPanels: false })
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '150px' }}>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imgss = ref}
                                listType="picture-card"
                                accept='image/*'
                                maxLength={1}
                                value={this.state.fileLists}
                                tip='????????????'
                            >
                            </AntdOssUpload>
                            <span style={{ display: 'block' }}>(335px * 80px)</span>
                        </div>
                    </div>
                </Modal>
                <Modal title={'??????'} onOk={this.onOk} visible={this.state.rulePanels} maskClosable={false} okText="??????" cancelText='??????' onCancel={() => {
                    this.setState({ rulePanels: false })
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '150px' }}>
                            <AntdOssUpload
                                actions={this.props.actions}
                                ref={ref => this.imgs = ref}
                                listType="picture-card"
                                accept='image/*'
                                maxLength={1}
                                value={this.state.fileList}
                                tip='????????????'
                            >
                            </AntdOssUpload>
                            <span style={{ display: 'block' }}>(375px * 812px)</span>
                        </div>
                    </div>
                </Modal>
                <Modal title={'??????????????????'} onOk={() => { this.setState({ rulePanelss: false }) }} visible={this.state.rulePanelss} maskClosable={false} okText="??????" cancelText='??????' onCancel={() => {
                    this.setState({ rulePanelss: false })
                }}>
                    <Form.Item label="??????">
                        <Input value={this.state.title} onChange={(e) => {
                            this.setState({
                                title: e.target.value
                            })
                        }}></Input>
                    </Form.Item>
                    <Form.Item label="??????">
                        <InputNumber value={this.state.year} min={0} onChange={(e) => {
                            this.setState({
                                year: e
                            })
                        }}></InputNumber>
                    </Form.Item>
                </Modal>
                <Modal title={'??????'} onOk={() => { this.setState({ ruleMusic: false }) }} visible={this.state.ruleMusic} maskClosable={false} okText="??????" cancelText='??????' onCancel={() => {
                    this.setState({ ruleMusic: false })
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '150px' }}>
                            <Upload
                                listType="picture-card"
                                fileList={this.state.videoList}
                                onChange={this.onCourseVideoChange}
                                beforeUpload={this.beforeVideoUpload}
                                customRequest={customUpload}
                            >
                                {this.state.videoList.length >= 1 ? null : uploadBtnVideo}
                            </Upload>

                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {
                            this.state.cover_url ?
                                <Tag>?????????{this.state.cover_url}</Tag>
                                : null
                        }
                    </div>

                </Modal>
                {/* <Modal visible={this.state.ruleMusic} visible={this.state.colorTip}>
                    <div>
                        {
                            color.map((item,index)=>{
                                return(
                                    <div style={{display:'flex',marginTop:'3px'}}>
                                        {
                                            colors.map((_item,idx)=>{
                                                return(
                                                    <div style={{width:'20px',height:'20px',backgroundColor:'#'+col[index]+col[col.length-1-index]+col[col.length-1-index]+col[idx]+col[col.length-1-idx]+col[col.length-1-idx],marginLeft:'3px'}}></div>
                                                )
                                            })
                                        }
                                        
                                    </div>
                                )
                            })
                        }
                        
                    </div>
                </Modal> */}
            </div >
        )
    }
}

const LayoutComponent = H5;
const mapStateToProps = state => {
    return {
        user: state.site.user,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
