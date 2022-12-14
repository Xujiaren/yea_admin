import React, { Component } from 'react';
import { Row, Col, } from 'reactstrap';
import { DatePicker, message, Spin, Icon, Card, Select, Input, Button } from 'antd';
import connectComponent from '../../util/connect';
import config from '../../config/config'
import moment from 'moment'
import locale from 'antd/es/date-picker/locale/zh_CN';
import { number } from 'prop-types';

const { Option } = Select;

class ExcelManager extends Component {
    state = {
        loading: false,
        type: -1,
        url: '',
        begin_time: moment().subtract("day", 30).format('YYYY-MM-DD'),
        end_time: moment().format('YYYY-MM-DD'),
        id: '',
        atype: 0,
        is_auth: -1,
        types: 0,
        is_primary: 0,
        sn: '',
        auth: -1,
        region_id: 0,
        regions: [],
        squad_id: '',
        user_id: '',
        course_id: '',
        level: -1,
        sex: -1,
        idLevel: '',
        ageType: -1,
        keyword: '',
        downloadId: '',
        ttyp: 0,
        ttyps: 0,
        btype: 0,
        etype: 0,
        courseNum: 0,
        courseVal: 0,
        end_link: '',
        endt: '',
        month:'',
        mouth:null
    }
    excel_page = "https://view.officeapps.live.com/op/view.aspx?src="

    componentWillMount() {
        // this.getRewardExcel()
        this.props.actions.getAdressesList({
            resolved: (res) => {
                this.setState({
                    regions: res
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        this.props.actions.getCourseStatNum({
            resolved: (res) => {
                this.setState({
                    courseNum: res
                })
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }
    getRewardExcel = (activity_id) => {
        const { actions } = this.props
        const { begin_time, end_time, region_id, auth, ageType, idLevel, level, sex } = this.state

        actions.getRewardExcel({
            activity_id,
            begin_time,
            end_time,
            region_id: region_id,
            is_auth: auth,
            ageType: ageType,
            idLevel: idLevel,
            level: level,
            sex: sex,
            resolved: (data) => {
                this.setState({ loading: false, url: 'https://view.officeapps.live.com/op/view.aspx?src=' + data.adress })
            }
        })
    }
    getFeedExcel = () => {
        const { actions } = this.props
        const { begin_time, end_time, auth, region_id } = this.state

        actions.getFeedExcel({
            keyword: '',
            category_id: '',
            status: '',
            begin_time,
            end_time,
            region_id: region_id,
            is_auth: auth,
            resolved: (data) => {
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address
                this.setState({ url: this.excel_page + url, loading: false })
            }
        })
    }
    getSenExcel = () => {
        const { actions } = this.props
        const { begin_time, end_time, auth, region_id } = this.state

        actions.getSenExcel({
            begin_time, begin_time,
            end_time: end_time,
            is_auth: auth,
            regionId: region_id,
            resolved: (data) => {
                console.log(data)
                this.setState({ loading: false, url: this.excel_page + data.adress })
            }
        })
    }
    getCourseStat = () => {

        const { begin_time, end_time, courseVal } = this.state
        const course_ids = "ALL"
        const time_type = 0
        let ben = new Date(begin_time).getTime()
        let end = new Date(end_time).getTime()
        // if (end - ben > 15552000000) {
            this.props.actions.getCourseStat({
                begin_time, end_time, course_ids, type: 'export', action: 'export',
                resolved: (data) => {
                    // console.log(data)
                    // const { fileName, adress, name, address } = data
                    // let url = fileName || adress || name || address

                    // this.setState({ url: this.excel_page + url, loading: false })

                },
                rejected: (data) => {
                    this.setState({ loading: false })
                    message.info({ content: '????????????,??????????????????????????????????????????????????????????????????????????????' })
                }
            })
            message.info({ content: '???????????????????????????????????????????????????????????????????????????????????????????????????????????????,???????????????????????????????????????????????????????????????????????????????????????????????????' })
            setTimeout(() => {
                this.props.actions.getcourseExcelLink({
                    action: 0,
                    resolved: (res) => {
                        if (res) {
                            this.setState({
                                end_link: res.address,
                                endt: res.time
                            })
                            const { fileName, adress, name, address } = res
                            let url = fileName || adress || name || address

                            this.setState({ url: this.excel_page + url, loading: false })
                        }
                    },
                    rejected: (err) => {

                    }
                })
            }, 2000);
        // } else {
        //     this.props.actions.getCourseStat({
        //         begin_time, end_time, course_ids, type: 'export', action: 'export',
        //         resolved: (data) => {
        //             console.log(data)
        //             const { fileName, adress, name, address } = data
        //             let url = fileName || adress || name || address

        //             this.setState({ url: this.excel_page + url, loading: false })

        //         },
        //         rejected: (data) => {
        //             message.error(JSON.stringify(data))
        //             this.setState({ loading: false })
        //         }
        //     })
        // }
    }
    // getAuth=()=>{
    //     const{actions}=this.props
    //     actions.getStatAuth()
    // }
    getGuaggao = () => {
        const { actions } = this.props
        const { begin_time, end_time } = this.state
        actions.getGuanggaoExl({
            begin_time: begin_time,
            end_time: end_time,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getChenji = () => {
        const { actions } = this.props
        actions.getChenjiExl({
            paper_ids: '-1',
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getPeixun = () => {
        const { actions } = this.props
        actions.getPeixunExl({
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getUserInfo = () => {
        const { type, id, sn, is_primary } = this.state
        const { actions } = this.props
        // if (!id) { message.info({ content: '?????????ID' }); return; }
        if (id) {
            if (!parseInt(id)) { message.info({ content: 'ID???????????????' }); return; }
        }
        if (sn) {
            if (!parseInt(sn)) { message.info({ content: '?????????????????????' }); return; }
        }
        let ids = id
        if (!id) {
            ids = 0
        }
        actions.getJifenExl({
            userId: parseInt(ids),
            sn: parseInt(sn),
            is_primary: is_primary,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getGesheng = () => {
        const { atype, begin_time, end_time } = this.state
        const { actions } = this.props
        actions.getGeshengExl({
            begin_time: begin_time,
            end_time: end_time,
            type: atype,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getXuexi = () => {
        const { type, id, is_primary, sn } = this.state
        const { actions } = this.props
        // if (!id) { message.info({ content: '?????????ID' }); return; }
        if (id) {
            if (!parseInt(id)) { message.info({ content: 'ID???????????????' }); return; }
        }
        if (sn) {
            if (!parseInt(sn)) { message.info({ content: '?????????????????????' }); return; }
        }
        let ids = id
        if (!id) {
            ids = 0
        }
        actions.getXuexiExl({
            userId: parseInt(ids),
            sn: parseInt(sn),
            is_primary: is_primary,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getDowns = () => {
        const { type, id } = this.state
        const { actions } = this.props
        if (!id) { message.info({ content: '?????????ID' }); return; }
        if (!parseInt(id)) { message.info({ content: 'ID???????????????' }); return; }
        actions.getDownDetails({
            dowload_id: id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getSquads = () => {
        const { type, id } = this.state
        const { actions } = this.props
        if (!id) { message.info({ content: '?????????ID' }); return; }
        if (!parseInt(id)) { message.info({ content: 'ID???????????????' }); return; }
        actions.getSquadDetails({
            squad_id: id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = address.address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getHot = () => {
        const { is_auth, begin_time, end_time, region_id } = this.state
        const { actions } = this.props
        actions.getKeywordsInfo({
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            is_auth: is_auth,
            region_id: region_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getRewardstatic = () => {
        const { begin_time, end_time, region_id, auth } = this.state
        const { actions } = this.props
        actions.getRewardStaticInfo({
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getMalljump = () => {
        const { begin_time, end_time } = this.state
        const { actions } = this.props
        actions.getMallJump({
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getSeminarjump = () => {
        const { begin_time, end_time, course_id } = this.state
        const { actions } = this.props
        actions.getSeminarJump({
            course_id: course_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getRewardevery = () => {
        const { begin_time, end_time } = this.state
        const { actions } = this.props
        actions.getRewardEveryInfo({
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getBilldetail = () => {
        const { id } = this.state
        const { actions } = this.props
        if (!id) { message.info({ content: '?????????ID' }); return; }
        if (!parseInt(id)) { message.info({ content: 'ID???????????????' }); return; }
        actions.getBillDetails({
            type: 0,
            action: 'export',
            billId: id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getChuruku = () => {
        const { begin_time, end_time } = this.state
        const { actions } = this.props
        actions.getChuruku({
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            itype: 0,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getChurukus = () => {
        const { begin_time, end_time } = this.state
        const { actions } = this.props
        actions.getChuruku({
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            itype: 1,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getTui = () => {
        const { begin_time, end_time } = this.state
        const { actions } = this.props
        actions.getTuihuo({
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getHudon = () => {
        const { begin_time, end_time, auth, region_id, id } = this.state
        const { actions } = this.props
        actions.getHudon({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: id,
            status: -1,
            askId: id,
            time_type: 0,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getPeixun = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id } = this.state
        const { actions } = this.props
        actions.getPeixun({
            squad_id: squad_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url.address, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getShiping = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id } = this.state
        const { actions } = this.props
        actions.getShipingXuexi({
            squad_id: squad_id,
            user_id: user_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getSquadMessage = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id } = this.state
        const { actions } = this.props
        actions.getSquadMessage({
            squadId: squad_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getXiaoGuo = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id } = this.state
        if (!squad_id) { message.info({ content: '??????????????????id' }); return; }
        const { actions } = this.props
        actions.getXiaoGuo({
            squadId: squad_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getTuiHuo = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id } = this.state
        const { actions } = this.props
        actions.getTuiHuo({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: 0,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getGuaguas = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id } = this.state
        const { actions } = this.props
        actions.getReward({
            activity_id: 18,
            time_type: 0,
            begin_time: begin_time,
            end_time: end_time,
            is_auth: -1,
            action: 'export',
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getDownActall = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword } = this.state
        const { actions } = this.props
        actions.getDownActAll({
            action: 'export',
            time_type: 0,
            beginTime: begin_time,
            endTime: end_time,
            status: -1,
            stype: 8,
            keyword: keyword,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getLiuliang = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword } = this.state
        const { actions } = this.props
        actions.getMallLiuliang({
            action: 'export',
            beginTime: begin_time,
            endTime: end_time,
            time_type: 0,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getMapsMains = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary } = this.state
        if (!sn) { message.info({ content: '???????????????' }); return; }
        const { actions } = this.props
        actions.getMapMainExports({
            isPrimary: is_primary,
            sn: sn,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getDownloads = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId } = this.state
        const { actions } = this.props
        actions.getDownlistExports({
            downloadId: downloadId,
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getTiaozhuan = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId } = this.state
        const { actions } = this.props
        actions.getTiaozhuan({
            action: 'export',
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getHaibaos = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId } = this.state
        const { actions } = this.props
        actions.getHaibaoShenchen({
            action: 'export',
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getKechenDaihuo = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId, course_id } = this.state
        const { actions } = this.props
        actions.getKechenDaihuo({
            action: 'export',
            courseIds: course_id,
            time_type: 0,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getUserDaihuo = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId, course_id, ttyp } = this.state
        const { actions } = this.props
        if (!course_id) { message.info({ content: '???????????????id' }); return; }
        actions.getUserDaihuo({
            action: 'export',
            begin_time: begin_time,
            end_time: end_time,
            course_id: course_id,
            time_type: 0,
            is_auth: auth,
            region_id: region_id,
            type: ttyp,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getPaihangBang = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId, course_id, tty, ttyps } = this.state
        const { actions } = this.props
        actions.getPaihangExport({
            beginTime: begin_time,
            endTime: end_time,
            limit: 500,
            type: ttyps,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getLiveDaihuo = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId, course_id, tty, ttyps } = this.state
        const { actions } = this.props
        actions.getLiveDaihuo({
            action: 'export',
            courseIds: course_id,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    onExportRewardall = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId, course_id, tty, ttyps } = this.state
        const { actions } = this.props
        this.props.actions.getLiveRewards({
            action: 'export',
            courseIds: course_id,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    onBanstatics = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId, course_id, tty, ttyps, btype } = this.state
        const { actions } = this.props
        this.props.actions.getBanstatics({
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            type: btype,
            userId: user_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getCertification = () => {
        const { type, id } = this.state
        const { actions } = this.props
        if (!id) { message.info({ content: '?????????ID' }); return; }
        if (!parseInt(id)) { message.info({ content: 'ID???????????????' }); return; }
        actions.getCertificationExport({
            squad_id: id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getLiveBadsay = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId, course_id, tty, ttyps } = this.state
        const { actions } = this.props
        if (!course_id) { message.info({ content: '???????????????id' }); return; }
        this.props.actions.getLiveBadsay({
            action: 'export',
            courseId: course_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getLiveHudong = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId, course_id, tty, ttyps, is_auth } = this.state
        const { actions } = this.props
        if (!course_id) { message.info({ content: '???????????????id' }); return; }
        this.props.actions.getLiveHudon({
            action: 'export',
            courseIds: course_id,
            is_auth: is_auth,
            region_id: region_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getMessageExports = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId, course_id, tty, ttyps, is_auth, etype } = this.state
        const { actions } = this.props
        this.props.actions.getMessageExports({
            beginTime: begin_time,
            endTime: end_time,
            etype: etype,
            keywords: keyword,
            time_type: 0,
            is_auth,is_auth,
            region_id:region_id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getMessageInfos = () => {
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId, course_id, tty, ttyps, is_auth, etype } = this.state
        const { actions } = this.props
        this.props.actions.getMessageInfos({
            messageId: id,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    getMapInfoExp=()=>{
        const{month}=this.state
        const{actions}=this.props
        this.props.actions.getMapInfoExp({
            mouth:month,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    liveCome=()=>{
        const{actions}=this.props
        const { begin_time, end_time, auth, region_id, id, squad_id, user_id, keyword, sn, is_primary, downloadId, course_id, tty, ttyps, is_auth, etype } = this.state
        if(!course_id){
            message.info({content:'???????????????id'})
        }
        actions.liveCome({
            course_id:course_id,
            begin_time:begin_time,
            end_time:end_time,
            resolved: (data) => {
                console.log(data)
                const { fileName, adress, name, address } = data
                let url = fileName || adress || name || address

                this.setState({ url: this.excel_page + url, loading: false })
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                this.setState({ loading: false })
            }
        })
    }
    onOks = () => {
        window.open(this.state.end_link)
        this.props.actions.getcourseExcelLink({
            action: 1,
            resolved: (res) => {
                if (res) {
                    this.setState({
                        end_link: '',
                        endt: ''
                    })
                }
            },
            rejected: (err) => {

            }
        })
    }
    updateData = () => {

        const { type: val } = this.state

        if (val == -1) {
            message.info('?????????????????????'); return
        }
        this.setState({ loading: true })
        if (val == 0) {
            this.getRewardExcel(1)
        } else if (val == 1) {
            this.getFeedExcel()
        } else if (val == 2) {
            this.getSenExcel()
        } else if (val == 3) {
            this.getCourseStat()
        } else if (val == 4) {
            this.getRewardExcel(18)
        } else if (val == 5) {
            this.getGuaggao()
        } else if (val == 6) {
            this.getChenji()
        } else if (val == 7) {
            this.getPeixun()
        } else if (val == 8) {
            this.getUserInfo()
        } else if (val == 9) {
            this.getGesheng()
        } else if (val == 10) {
            this.getXuexi()
        } else if (val == 11) {
            this.getDowns()
        } else if (val == 12) {
            this.getSquads()
        } else if (val == 13) {
            this.getHot()
        } else if (val == 14) {
            this.getRewardstatic()
        } else if (val == 16) {
            this.getMalljump()
        } else if (val == 17) {
            this.getSeminarjump()
        } else if (val == 15) {
            this.getRewardevery()
        } else if (val == 18) {
            this.getBilldetail()
        } else if (val == 19) {
            this.getChuruku()
        } else if (val == 20) {
            this.getChurukus()
        } else if (val == 21) {
            this.getTui()
        } else if (val == 22) {
            this.getHudon()
        } else if (val == 23) {
            this.getPeixun()
        } else if (val == 24) {
            this.getShiping()
        } else if (val == 25) {
            this.getSquadMessage()
        } else if (val == 26) {
            this.getXiaoGuo()
        } else if (val == 27) {
            this.getTuiHuo()
        } else if (val == 28) {
            this.getGuaguas()
        } else if (val == 29) {
            this.getDownActall()
        } else if (val == 30) {
            this.getLiuliang()
        } else if (val == 31) {
            this.getMapsMains()
        } else if (val == 32) {
            this.getDownloads()
        } else if (val == 33) {
            this.getTiaozhuan()
        } else if (val == 34) {
            this.getHaibaos()
        } else if (val == 35) {
            this.getKechenDaihuo()
        } else if (val == 36) {
            this.getUserDaihuo()
        } else if (val == 37) {
            this.getPaihangBang()
        } else if (val == 38) {
            this.getLiveDaihuo()
        } else if (val == 39) {
            this.onExportRewardall()
        } else if (val == 40) {
            this.onBanstatics()
        } else if (val == 41) {
            this.getCertification()
        } else if (val == 42) {
            this.getLiveBadsay()
        } else if (val == 43) {
            this.getLiveHudong()
        } else if (val == 44) {
            this.getMessageExports()
        } else if (val == 45) {
            this.getMessageInfos()
        } else if (val == 46){
            this.getMapInfoExp()
        } else if (val ==47){
            this.liveCome()
        }
        // else if(val==5){
        //     this.getAuth()
        // }
    }
    _onSelect = (val) => {
        this.setState({ type: val, types: 0 }, () => {
            if (this.state.type == 3) {
                this.props.actions.getcourseExcelLink({
                    action: 0,
                    resolved: (res) => {
                        if (res) {
                            this.setState({
                                end_link: res.address,
                                endt: res.time
                            })
                            const { fileName, adress, name, address } = res
                            let url = fileName || adress || name || address

                            this.setState({ url: this.excel_page + url, loading: false })
                        }
                    },
                    rejected: (err) => {

                    }
                })
            }
        })

    }
    disabledDate = (current) => {
        return current > moment().subtract(0, 'day')
    }
    render() {
        const link = this.state.url.replace('https://view.officeapps.live.com/op/view.aspx?src=', '')
        return (
            <div className="animated fadeIn mb_10">
                <Row>
                    <Col xs="12">
                        <Card title="????????????">

                            <div className="flex f_row j_space_between align_items">
                                <div>
                                    <span>????????????&nbsp;</span>
                                    <Select disabled={this.state.loading} value={this.state.type} style={{ width: '180px' }} className='m_2' onChange={this._onSelect}
                                    >
                                        <Option value={-1}>???</Option>
                                        <Option value={0}>?????????????????????????????????</Option>
                                        <Option value={28}>?????????????????????</Option>
                                        <Option value={4}>?????????????????????</Option>
                                        <Option value={1}>????????????????????????</Option>
                                        <Option value={2}>????????????????????????????????????</Option>
                                        <Option value={3}>??????????????????</Option>
                                        <Option value={5}>??????????????????</Option>
                                        {/* <Option value={6}>????????????</Option> */}
                                        <Option value={7}>???????????????</Option>
                                        <Option value={8}>??????????????????</Option>
                                        <Option value={10}>??????????????????</Option>
                                        <Option value={9}>????????????</Option>
                                        <Option value={11}>??????????????????????????????</Option>
                                        <Option value={12}>?????????????????????</Option>
                                        <Option value={41}>????????????(????????????)</Option>
                                        <Option value={13}>?????????????????????</Option>
                                        <Option value={14}>????????????</Option>
                                        <Option value={15}>????????????(??????)</Option>
                                        <Option value={16}>????????????-???????????????????????????</Option>
                                        <Option value={17}>?????????-???????????????????????????</Option>
                                        <Option value={18}>????????????????????????</Option>
                                        <Option value={19}>????????????</Option>
                                        <Option value={20}>????????????</Option>
                                        <Option value={21}>????????????</Option>
                                        <Option value={22}>???????????????</Option>
                                        <Option value={23}>?????????????????????</Option>
                                        <Option value={24}>????????????????????????</Option>
                                        <Option value={25}>O2O??????????????????</Option>
                                        <Option value={26}>O2O??????????????????</Option>
                                        <Option value={27}>??????????????????</Option>
                                        <Option value={30}>??????????????????</Option>
                                        <Option value={29}>????????????????????????</Option>
                                        <Option value={31}>????????????????????????????????????</Option>
                                        <Option value={46}>????????????????????????</Option>
                                        <Option value={32}>????????????</Option>
                                        <Option value={33}>??????????????????</Option>
                                        <Option value={34}>???????????????</Option>
                                        <Option value={35}>??????????????????</Option>
                                        <Option value={36}>????????????????????????</Option>
                                        <Option value={37}>???????????????</Option>
                                        <Option value={38}>????????????????????????</Option>
                                        <Option value={39}>??????????????????</Option>
                                        <Option value={40}>????????????</Option>
                                        <Option value={42}>???????????????????????????</Option>
                                        <Option value={43}>??????????????????</Option>
                                        <Option value={47}>??????????????????</Option>
                                        <Option value={44}>????????????</Option>
                                        <Option value={45}>??????????????????</Option>
                                        {/* <Option value={5}>?????????????????????</Option> */}
                                        {/*
                                    <Option value='0'>????????????</Option>
                                    <Option value='1'>????????????</Option>
                                    <Option value='2'>????????????</Option>  
                                    
                                    <Option value={'collects'}>???????????????????????????</Option>
                                    <Option value={'comments'}>???????????????????????????</Option>
                                    <Option value={'gifts'}>??????????????????</Option>
                                    <Option value={'visitor'}>??????????????????</Option>
                                    <Option value={'shares'}>??????????????????</Option>
                                    */}
                                        {/*
                                    <Option value={1}>??????????????????????????????</Option>
                                    <Option value={7}>???????????????????????????</Option>
                                    */}

                                    </Select>
                                    {/*
                                &nbsp;
                                <Select defaultValue='0'>
                                    <Option value='0'>??????????????????</Option>
                                    <Option value='1'>??????????????????</Option>
                                    <Option value='2'>??????????????????</Option>
                                    <Option value='3'>??????????????????</Option>
                                </Select>*/}
                                    {
                                        this.state.type == 6 || this.state.type == 7 || this.state.type == 8 || this.state.type == 10 || this.state.type == 11 || this.state.type == 12 || this.state.type == 16 || this.state.type == 17 || this.state.type == 18 || this.state.type == 23 || this.state.type == 24 || this.state.type == 25 || this.state.type == 26 || this.state.type == 31 || this.state.type == 35 || this.state.type == 38 || this.state.type == 39 || this.state.type == 41 || this.state.type == 42 || this.state.type == 43 || this.state.type == 46 || this.state.type == 45?
                                            null
                                            :
                                            <DatePicker.RangePicker defaultValue={[moment().subtract("day", 30), moment()]} disabled={this.state.loading} className='m_2' allowClear={false} disabledDate={this.disabledDate} style={{ maxWidth: 250 }} format="YYYY-MM-DD" locale={locale} onChange={(date, dateString) => {
                                                if (dateString[0] == dateString[1]) { message.info('??????????????????????????????'); return; }
                                                this.setState({
                                                    begin_time: dateString[0],
                                                    end_time: dateString[1],
                                                })
                                            }} />
                                    }
                                    {
                                        this.state.type == 46?
                                        <DatePicker.MonthPicker  disabled={this.state.loading} className='m_2' value={this.state.mouth} disabledDate={val => val > moment()} allowClear={false} onChange={(date, dateString) => {
                                           this.setState({
                                               month:dateString,
                                               mouth:date
                                           })
                                        }} />:null
                                    }
                                    {/* {
                                        this.state.type == 3?
                                        <Select value={this.state.courseVal} onChange={(e) => {
                                            this.setState({
                                                courseVal: e
                                            })
                                        }}>
                                            <Option value={0}>??????0-200??????</Option>
                                            <Option value={200}>??????200-400??????</Option>
                                            <Option value={400}>??????400-600??????</Option>
                                            <Option value={600}>??????600-800??????</Option>
                                            <Option value={800}>??????800-1000??????</Option>
                                            <Option value={1000}>??????1000-1200??????</Option>
                                            <Option value={1200}>??????1200-1400??????</Option>
                                            <Option value={1400}>??????1400-1600??????</Option>
                                            <Option value={1600}>??????1600-1800??????</Option>
                                            <Option value={1800}>??????1800-2000??????</Option>
                                            <Option value={2000}>??????2000-2200??????</Option>
                                            <Option value={2200}>??????2200-2400??????</Option>
                                        </Select>
                                        :null
                                    } */}
                                    {
                                        this.state.type == 4 ?
                                            <Select value={this.state.ageType} style={{ width: '120px' }} onChange={(e) => {
                                                this.setState({
                                                    ageType: e
                                                })
                                            }}>
                                                <Option value={-1}>??????</Option>
                                                <Option value={0}>25????????????</Option>
                                                <Option value={1}>26-35</Option>
                                                <Option value={2}>36-45</Option>
                                                <Option value={3}>46-55</Option>
                                                <Option value={4}>56??????</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 4 ?
                                            <Select value={this.state.sex} style={{ width: '120px' }} onChange={(e) => {
                                                this.setState({
                                                    sex: e
                                                })
                                            }}>
                                                <Option value={-1}>??????</Option>
                                                <Option value={0}>??????</Option>
                                                <Option value={1}>???</Option>
                                                <Option value={2}>???</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 4 ?
                                            <Select value={this.state.idLevel} style={{ width: '120px' }} onChange={(e) => {
                                                this.setState({
                                                    idLevel: e
                                                })
                                            }}>
                                                <Option value={''}>??????????????????</Option>
                                                <Option value={'5'}>????????????</Option>
                                                <Option value={'6'}>????????????</Option>
                                                <Option value={'7'}>????????????</Option>
                                                <Option value={'8'}>????????????</Option>
                                                <Option value={'9'}>??????????????????</Option>
                                                <Option value={'GG'}>??????????????????</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 4 ?
                                            <Select value={this.state.level} style={{ width: '90px' }} onChange={(e) => {
                                                this.setState({
                                                    level: e
                                                })
                                            }}>
                                                <Option value={-1}>????????????</Option>
                                                <Option value={0}>0???</Option>
                                                <Option value={1}>1???</Option>
                                                <Option value={2}>2???</Option>
                                                <Option value={3}>3???</Option>
                                                <Option value={4}>4???</Option>
                                                <Option value={5}>5???</Option>
                                                <Option value={6}>6???</Option>
                                                <Option value={7}>7???</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 9 ?
                                            <Select value={this.state.atype} style={{ width: '120px' }} className='m_2' onChange={(e) => {
                                                this.setState({ atype: e })
                                            }}>
                                                <Option value={0}>??????</Option>
                                                <Option value={1}>????????????</Option>
                                                <Option value={2}>????????????</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 8 || this.state.type == 10 ?
                                            <Select style={{ width: '100px' }} value={this.state.types} onChange={(e) => {
                                                this.setState({
                                                    types: e,
                                                    id: '',
                                                    is_primary: 1,
                                                    sn: '',
                                                })
                                            }}>
                                                <Option value={0}>??????ID</Option>
                                                <Option value={1}>??????</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 8 && this.state.types == 1 || this.state.type == 10 && this.state.types == 1 || this.state.type == 31 ?
                                            <Select style={{ width: '100px' }} value={this.state.is_primary} onChange={(e) => {
                                                this.setState({
                                                    is_primary: e
                                                })
                                            }}>
                                                <Option value={0}>??????</Option>
                                                <Option value={1}>??????</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 29 ?
                                            <div style={{ width: '200px', display: 'inline-block' }}>
                                                <Input value={this.state.keyword} placeholder="?????????" onChange={(e) => { this.setState({ keyword: e.target.value }) }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        this.state.type == 44 ?
                                            <div style={{ width: '200px', display: 'inline-block' }}>
                                                <Input value={this.state.keyword} placeholder="?????????" onChange={(e) => { this.setState({ keyword: e.target.value }) }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        this.state.type ==32?
                                            <div style={{ width: '200px', display: 'inline-block' }}>
                                                <Input value={this.state.downloadId} placeholder="??????????????????id" onChange={(e) => { this.setState({ downloadId: e.target.value }) }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        this.state.type == 8 && this.state.types == 1 || this.state.type == 10 && this.state.types == 1 || this.state.type == 31 ?
                                            <div style={{ width: '200px', display: 'inline-block' }}>
                                                <Input value={this.state.sn} placeholder="???????????????" onChange={(e) => { this.setState({ sn: e.target.value }) }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        this.state.type == 8 && this.state.types == 0 || this.state.type == 10 && this.state.types == 0 || this.state.type == 18 || this.state.type == 22 ?
                                            <div style={{ width: '200px', display: 'inline-block' }}>
                                                <Input value={this.state.id} placeholder="?????????ID" onChange={(e) => { this.setState({ id: e.target.value }) }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        this.state.type == 11 ?
                                            <div style={{ width: '200px', display: 'inline-block' }}>
                                                <Input value={this.state.id} placeholder="??????????????????????????????ID" onChange={(e) => { this.setState({ id: e.target.value }) }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        this.state.type == 45 ?
                                            <div style={{ width: '200px', display: 'inline-block' }}>
                                                <Input value={this.state.id} placeholder="???????????????ID" onChange={(e) => { this.setState({ id: e.target.value }) }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        this.state.type == 12 || this.state.type == 41 ?
                                            <div style={{ width: '200px', display: 'inline-block' }}>
                                                <Input value={this.state.id} placeholder="??????????????????ID" onChange={(e) => { this.setState({ id: e.target.value }) }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        this.state.type == 17 || this.state.type == 35 || this.state.type == 36 || this.state.type == 38|| this.state.type == 39 || this.state.type == 42 || this.state.type == 43 || this.state.type == 47?
                                            <div style={{ width: '200px', display: 'inline-block' }}>
                                                <Input value={this.state.course_id} placeholder="????????????????????????ID" onChange={(e) => { this.setState({ course_id: e.target.value }) }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        this.state.type == 13 || this.state.type == 43 ?
                                            <Select value={this.state.is_auth} style={{ width: '120px' }} className='m_2' onChange={(e) => {
                                                this.setState({ is_auth: e })
                                            }}>
                                                <Option value={-1}>??????</Option>
                                                <Option value={0}>?????????</Option>
                                                <Option value={1}>?????????</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 22 || this.state.type == 1 || this.state.type == 0 || this.state.type == 14 || this.state.type == 2 || this.state.type == 27 || this.state.type == 33 || this.state.type == 34 || this.state.type == 35 || this.state.type == 36 || this.state.type == 38 || this.state.type == 39|| this.state.type == 44 ?
                                            <Select value={this.state.auth} style={{ width: '120px' }} className='m_2' onChange={(e) => {
                                                this.setState({ auth: e })
                                            }}>
                                                <Option value={-1}>??????</Option>
                                                <Option value={0}>?????????</Option>
                                                <Option value={1}>?????????</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 13 || this.state.type == 22 || this.state.type == 1 || this.state.type == 0 || this.state.type == 14 || this.state.type == 2 || this.state.type == 27 || this.state.type == 33 || this.state.type == 34 || this.state.type == 35 || this.state.type == 36 || this.state.type == 38 || this.state.type == 39 || this.state.type == 43|| this.state.type == 44 ?
                                            <Select value={this.state.region_id} style={{ width: '100px' }} onChange={(e) => {
                                                this.setState({
                                                    region_id: e
                                                })
                                            }}>
                                                <Option value={0}>??????</Option>
                                                {
                                                    this.state.regions.map(item => {
                                                        return (
                                                            <Option value={item.regionId}>{item.regionName}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 36 ?
                                            <Select value={this.state.ttyp} style={{ width: '120px' }} className='m_2' onChange={(e) => {
                                                this.setState({ ttyp: e })
                                            }}>
                                                <Option value={0}>??????????????????</Option>
                                                <Option value={1}>??????????????????</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 37 ?
                                            <Select value={this.state.ttyps} style={{ width: '120px' }} className='m_2' onChange={(e) => {
                                                this.setState({ ttyps: e })
                                            }}>
                                                <Option value={0}>??????</Option>
                                                <Option value={1}>??????</Option>
                                                <Option value={2}>??????</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 40 ?
                                            <Select value={this.state.btype} style={{ width: '120px' }} className='m_2' onChange={(e) => {
                                                this.setState({ btype: e })
                                            }}>
                                                <Option value={0}>??????</Option>
                                                <Option value={1}>??????</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 44 ?
                                            <Select value={this.state.etype} style={{ width: '120px' }} className='m_2' onChange={(e) => {
                                                this.setState({ etype: e })
                                            }}>
                                                <Option value={0}>??????</Option>
                                                <Option value={41}>????????????</Option>
                                                <Option value={40}>???????????????</Option>
                                                <Option value={42}>????????????</Option>
                                            </Select>
                                            : null
                                    }
                                    {
                                        this.state.type == 23 || this.state.type == 24 || this.state.type == 25 || this.state.type == 26 || this.state.type == 7?
                                            <div style={{ width: '200px', display: 'inline-block' }}>
                                                <Input value={this.state.squad_id} placeholder="??????????????????ID" onChange={(e) => { this.setState({ squad_id: e.target.value }) }} />
                                            </div>
                                            : null
                                    }
                                    {
                                        this.state.type == 40 ?
                                            <div style={{ width: '200px', display: 'inline-block' }}>
                                                <Input value={this.state.user_id} placeholder="???????????????ID" onChange={(e) => { this.setState({ user_id: e.target.value }) }} />
                                            </div>
                                            : null
                                    }
                                  
                                        <Button onClick={this.updateData} className='m_2'>??????</Button>
                                        
                                    
                                    {
                                        this.state.type == 3 && this.state.end_link ?
                                            <Button disabled={this.state.loading} disabled={true} className='m_2'>
                                                ????????????
                                            </Button>
                                            :
                                            <Button disabled={this.state.loading} className='m_2'>
                                                <a href={link} target='_black'>????????????</a>
                                            </Button>
                                            
                                    }

                                    {
                                        this.state.type == 3 && this.state.end_link ?
                                            <Button className='m_2' onClick={this.onOks}>
                                                {this.state.endt}??????
                                            </Button> : null
                                    }

                                </div>
                                <div>

                                </div>
                            </div>
                            {
                                this.state.type == 3 ?
                                    <div style={{ color: 'red', fontSize: '12px' }}>
                                        ???????????????????????????????????????????????????????????????????????????????????????????????????????????????,????????????????????????????????????????????????????????????????????????????????????????????????,???????????????????????????????????????????????????
                                    </div>
                                    : null
                            }
                            {/* {
                                this.state.type !== 45? */}
                                <Spin spinning={this.state.loading} >
                                <Card type='inner' className="mt_10" bodyStyle={{ minHeight: '610px', padding: 0 }}>
                                    {this.state.url==''||this.state.url=='https://view.officeapps.live.com/op/view.aspx?src=undefined' ? null :
                                        <iframe name={Date.now()} src={this.state.url} frameBorder='0' key={this.state.url} width='100%' height='610px'></iframe>
                                    }
                                </Card>
                            </Spin>
                            {/* :
                            <div className='text_center'>
                                <a onClick={()=>{
                                    window.open('https://home.console.aliyun.com/home/dashboard/ProductAndService')
                                }}>?????????????????????????????????</a>
                            </div>
                            } */}
                           
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

const LayoutComponent = ExcelManager;
const mapStateToProps = state => {
    return {
        stat_auth: state.dashboard.stat_auth,
    }
}
export default connectComponent({ LayoutComponent, mapStateToProps });