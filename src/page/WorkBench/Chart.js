import React, { Components, useState, useEffect } from 'react'
import { Pagination, Divider, Row, Col, Statistic, Empty, Table, Button, Card, Select, DatePicker, message, Modal, Input, Tag, Spin, } from 'antd'
import moment from 'moment'
import { Interaction, Chart, Axis, Tooltip, Geom, Interval, Legend, Slider, Coordinate, Annotation } from 'bizcharts';
import PieChart from 'bizcharts/lib/plots/PieChart'
import connectComponent from "../../util/connect";
import FormItem from 'antd/lib/form/FormItem';
import DataSet from '@antv/data-set';
import { truncate } from 'lodash';

const { DataView } = DataSet;
const { Option } = Select;
const flag_arg = {
    '1': '直销员',
    '2': '新用户',
    '3': '服务中心员工',
    '4': '服务中心负责人',
    '5': '优惠顾客',
    '6': '初级经理',
    '7': '中级经理',
    '8': '客户总监',
    '9': '高级客户总监',
    'GG': '资深客户总监及以上'
}
const YearPicker = ({ disabled = false, onChange = () => { } }) => {
    const [isopen, setIsopen] = useState(false)
    const [time, setTime] = useState(null)
    const handlePanelChange = (date, string) => {
        setTime(date)
        setIsopen(false)
        onChange(date, date.format('YYYY'))
    }
    const handleOpenChange = (status) => {
        setIsopen(status ? true : false)
    }
    const clearValue = () => {
        setTime(null)
    }

    return (
        <DatePicker
            disabled={disabled}
            size='small'
            value={time}
            open={isopen}
            mode="year"
            placeholder='请选择年份'
            format="YYYY"
            onOpenChange={handleOpenChange}
            onPanelChange={handlePanelChange}
            onChange={clearValue}
            allowClear={false}
            disabledDate={val => val > moment()}
        />
    )
}
const Filter = ({ showTimeType = true, disabled = false, hasSeaon = true, isRange = 1, format = 'YYYY-MM-DD', onChange = () => { } }) => {

    const [timeType, setTimeType] = useState(0)
    const [season, setSeason] = useState('0')

    const [atime, setAtime] = useState(null)
    const renderFn = () => {
        if (timeType == 0) {
            if (isRange)
                return <DatePicker.RangePicker disabled={disabled} size='small' value={atime} format={format} disabledDate={val => val > moment()} allowClear={false} onChange={(date, dateString) => {
                    setAtime(date)
                    onChange({ time_type: timeType, begin_time: dateString[0], end_time: dateString[1] })
                }} />
            else
                return <DatePicker disabled={disabled} size='small' value={atime} format={format} disabledDate={val => val > moment()} allowClear={false} onChange={(date, dateString) => {
                    setAtime(date)
                    onChange({ time_type: timeType, begin_time: dateString, end_time: '' })
                }} />
        }
        if (timeType == 1) {

            return <DatePicker disabled={disabled} size='small' value={atime} format={format} disabledDate={val => val > moment()} allowClear={false} onChange={(date, dateString) => {
                setAtime(date)
                onChange({ time_type: timeType, begin_time: dateString, end_time: '' })
            }} />
        }
        if (timeType == 2) {
            return <DatePicker.WeekPicker disabled={disabled} size='small' value={atime} disabledDate={val => val > moment()} allowClear={false} onChange={(date, dateString) => {
                setAtime(date)
                onChange({ time_type: timeType, begin_time: dateString.substring(0, dateString.length - 1), end_time: '' })
            }} />
        }
        if (timeType == 3) {
            return <DatePicker.MonthPicker disabled={disabled} size='small' value={atime} disabledDate={val => val > moment()} allowClear={false} onChange={(date, dateString) => {
                setAtime(date)
                onChange({ time_type: timeType, begin_time: dateString, end_time: '' })
            }} />
        }
        if (timeType == 4) {
            return <>
                <YearPicker disabled={disabled} onChange={(date, str) => {
                    console.log(date, str)
                    setAtime(date)
                    onChange({ time_type: timeType, begin_time: str + '-' + season, end_time: '' })
                }} />
                <Select disabled={disabled} size='small' value={season} onChange={val => {
                    setSeason(val)
                    let _begin_time = ''
                    if (atime) _begin_time = atime.format('YYYY') + '-' + val
                    onChange({ time_type: timeType, begin_time: _begin_time, end_time: '' })
                }}>
                    <Select.Option value={'0'}>第一季</Select.Option>
                    <Select.Option value={'1'}>第二季</Select.Option>
                    <Select.Option value={'2'}>第三季</Select.Option>
                    <Select.Option value={'3'}>第四季</Select.Option>
                </Select>
            </>
        }
        if (timeType == 5) {
            return <YearPicker disabled={disabled} onChange={(date, str) => {
                setAtime(date)
                onChange({ time_type: timeType, begin_time: str, end_time: '' })
            }} />
        }
    }
    return (
        <>
            {
                !showTimeType ? null :
                    <Select disabled={disabled} size='small' value={timeType} onChange={(val) => {
                        setAtime(null)
                        setTimeType(val)
                    }}>
                        <Select.Option value={0}>自定义</Select.Option>
                        <Select.Option value={1}>按日</Select.Option>
                        <Select.Option value={2}>按周</Select.Option>
                        <Select.Option value={3}>按月</Select.Option>
                        {hasSeaon ?
                            <Select.Option value={4}>按季</Select.Option>
                            : null}
                        <Select.Option value={5}>按年</Select.Option>
                    </Select>
            }
            {
                renderFn()
            }
        </>
    )
}
const UserChart = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [timeType, setTimeType] = useState(1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true

        actions._getStatUser({
            timeType: timeType,
            resolved: (data) => {
                if (!visible) return
                let arr = []
                Object.keys(data).map(ele => {
                    const { parent, self } = data[ele]
                    arr.push({ type: ele, value: parent, name: '被邀请注册数' })
                    arr.push({ type: ele, value: self, name: '主动注册数' })
                })
                setData(arr)
                setLoading(false)
            },
            rejected: (data) => {

            }
        })
        return () => visible = false
    }, [timeType])
    const onExport = () => {
        setLoading(true)
        actions._getStatUser({
            timeType: timeType,
            action: 'export',
            resolved: (data) => {
                const { address, adress } = data
                const url = address || adress || ''
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(Object.keys(url)[0], '_black')
                    }
                })
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} title='会员注册总人数' bordered={false} size='small' bodyStyle={{ padding: 20 }} extra={
            <>
                <Select disabled={loading} className='m_2' value={timeType} onChange={(val) => { setTimeType(val) }}>
                    <Select.Option value={0}>最近7天</Select.Option>
                    <Select.Option value={1}>最近15天</Select.Option>
                    <Select.Option value={2}>最近1月</Select.Option>
                </Select>
                <Button loading={loading} className='m_2' onClick={onExport}>导出</Button>
            </>
        }>
            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="line"
                    color='name'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const UserLevel = (props) => {
    const [data, setData] = useState([])
    // const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    // const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    // const [timeType, setTimeType] = useState(1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        actions._getStatUserLevel({
            resolved: (data) => {
                if (!visible) return
                setData(Object.keys(data).map(ele => ({ type: 'LV' + ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    return (
        <Card loading={loading} title='权益用户统计' bordered={false} size='small' bodyStyle={{ padding: 20 }}
        // extra={<Select value={timeType} onChange={(val) => { setTimeType(val) }}>
        //     <Select.Option value={1}>最近7天</Select.Option>
        //     <Select.Option value={2}>最近一周</Select.Option>
        // </Select>}
        >
            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Alluser = (props) => {
    const [data, setData] = useState([])
    const [data_a, setDataA] = useState([])
    const [data_b, setDataB] = useState([])
    const [data_c, setDataC] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD HH:mm'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD HH:mm'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(1)
    const [loading, setLoading] = useState(true)
    const [ageType, setAgeType] = useState(-1)
    const [region_id, setRegion] = useState(0)
    const [sex, setSex] = useState(-1)
    const [auth, setAuth] = useState(-1)
    const [regions, setRegions] = useState([])
    const { actions } = props
    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getAllUserInfoStat({
            beginStr: begin_time,
            endStr: end_time,
            ageType: ageType,
            sex: sex,
            region_id: region_id,
            resolved: (data) => {
                // if (!visible) return
                let map = data['data']
                setData(Object.keys(data).map(ele => (ele != 'data' ? { type: ele, value: parseInt(data[ele]) } : '')))
                setDataA(Object.keys(map).map(ele => ({ type: ele, value: parseInt(map[ele]['今日未认证人数']) })))
                setDataB(Object.keys(map).map(ele => ({ type: ele, value: parseInt(map[ele]['今日认证人数']) })))
                setDataC(Object.keys(map).map(ele => ({ type: ele, value: parseInt(map[ele]['今日注册人数']) })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const OrderNums = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getAllUserInfoStat({
            beginStr: begin_time,
            endStr: end_time,
            ageType: ageType,
            sex: sex,
            region_id: region_id,
            resolved: (data) => {
                // if (!visible) return
                let map = data['data']
                setData(Object.keys(data).map(ele => (ele != 'data' ? { type: ele, value: parseInt(data[ele]) } : '')))
                setDataA(Object.keys(map).map(ele => ({ type: ele, value: parseInt(map[ele]['今日未认证人数']) })))
                setDataB(Object.keys(map).map(ele => ({ type: ele, value: parseInt(map[ele]['今日认证人数']) })))
                setDataC(Object.keys(map).map(ele => ({ type: ele, value: parseInt(map[ele]['今日注册人数']) })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (
        <Card loading={loading} title='用户概况' bordered={false} size='small' bodyStyle={{ padding: 20 }}
            extra={
                <>
                    <Filter showTimeType={false} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Select style={{ width: '120px' }} value={ageType} size='small' onChange={(e) => {
                        setAgeType(e)
                    }}>
                        <Option value={-1}>全部</Option>
                        <Option value={0}>25岁及以下</Option>
                        <Option value={1}>26-35</Option>
                        <Option value={2}>36-45</Option>
                        <Option value={3}>46-55</Option>
                        <Option value={4}>56以上</Option>
                    </Select>
                    <Select value={sex} size='small' onChange={(e) => {
                        setSex(e)
                    }}>
                        <Option value={-1}>全部</Option>
                        <Option value={0}>未知</Option>
                        <Option value={1}>男</Option>
                        <Option value={2}>女</Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegion(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }

                    <Button onClick={OrderNums} size='small'>筛选</Button>
                </>
            }
        >
            <FormItem label='概况'>
                <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="interval"
                        label={["value", { style: { fill: '#535353' } }]}
                        color='type'
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
            </FormItem>
            <FormItem label='未认证人数'>
                <Chart height={400} autoFit data={data_a} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="interval"
                        label={["value", { style: { fill: '#535353' } }]}
                        color='type'
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
            </FormItem>
            <FormItem label='认证人数'>
                <Chart height={400} autoFit data={data_b} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="interval"
                        label={["value", { style: { fill: '#535353' } }]}
                        color='type'
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
            </FormItem>
            <FormItem label='注册人数'>
                <Chart height={400} autoFit data={data_c} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="interval"
                        label={["value", { style: { fill: '#535353' } }]}
                        color='type'
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
            </FormItem>

        </Card>
    )
}
export const EveryDayTime = (props) => {
    const [data, setData] = useState([])
    const [data_a, setDataA] = useState([])
    const [data_b, setDataB] = useState([])
    const [data_c, setDataC] = useState([])
    const [begin, setBeg] = useState(null)
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 0).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(1)
    const [loading, setLoading] = useState(true)
    const [ageType, setAgeType] = useState(0)
    const [region_id, setRegion] = useState(0)
    const [sex, setSex] = useState(-1)
    const [auth, setAuth] = useState(-1)
    const [time, setTimes] = useState('')
    const [regions, setRegions] = useState([])
    const { actions } = props
    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getUserTime({
            begin_time: beginTime,
            ageType: ageType,
            sex: sex,
            region_id: region_id,
            time: time,
            resolved: (data) => {
                setData(Object.keys(data).map(ele => ({ type: ele + '-' + (parseInt(ele) + 1), value: data[ele] })))

                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                setLoading(false)
            }
        })
        return () => visible = false
    }, [atime, auth, region_id, sex])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getUserTime({
            begin_time: beginTime,
            ageType: ageType,
            sex: sex,
            region_id: region_id,
            time: time,
            resolved: (data) => {
                setData(Object.keys(data).map(ele => ({ type: ele + '-' + (parseInt(ele) + 1), value: data[ele] })))

                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                setLoading(false)
            }
        })
    }
    return (
        <Card loading={loading} title='用户在线时间段分布' bordered={false} size='small' bodyStyle={{ padding: 20 }}
            extra={
                <>
                    <DatePicker
                        format={'YYYY-MM-DD'}
                        allowClear={false}
                        value={begin}
                        size='small'
                        onChange={(val, dateString) => {
                            setBeginTime(dateString)
                            setBeg(val)
                        }} />
                    <Select size='small' value={auth} style={{ width: '90px' }} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    <Select value={sex} size='small' onChange={(e) => {
                        setSex(e)
                    }}>
                        <Option value={-1}>全部</Option>
                        <Option value={0}>未知</Option>
                        <Option value={1}>男</Option>
                        <Option value={2}>女</Option>
                    </Select>
                    <Select value={time} style={{ width: '120px' }} size='small' onChange={(e) => {
                        setTimes(e)
                    }}>
                        <Option value={''}>全部时间段</Option>
                        <Option value={'0'}>0-1时</Option>
                        <Option value={'1'}>1-2时</Option>
                        <Option value={'2'}>2-3时</Option>
                        <Option value={'3'}>3-4时</Option>
                        <Option value={'5'}>5-6时</Option>
                        <Option value={'6'}>6-7时</Option>
                        <Option value={'7'}>7-8时</Option>
                        <Option value={'8'}>8-9时</Option>
                        <Option value={'9'}>9-10时</Option>
                        <Option value={'10'}>10-11时</Option>
                        <Option value={'11'}>11-12时</Option>
                        <Option value={'12'}>12-13时</Option>
                        <Option value={'13'}>13-14时</Option>
                        <Option value={'14'}>14-15时</Option>
                        <Option value={'15'}>15-16时</Option>
                        <Option value={'16'}>16-17时</Option>
                        <Option value={'17'}>17-18时</Option>
                        <Option value={'18'}>18-19时</Option>
                        <Option value={'19'}>19-20时</Option>
                        <Option value={'20'}>20-21时</Option>
                        <Option value={'21'}>21-22时</Option>
                        <Option value={'22'}>22-23时</Option>
                        <Option value={'23'}>23-24时</Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegion(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button size='small' onClick={onOk}>筛选</Button>
                </>
            }
        >
            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
        </Card>
    )
}
export const OrderNums = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD HH:mm'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD HH:mm'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(1)
    const [loading, setLoading] = useState(true)
    const [auth, setAuth] = useState(-1)
    const { actions } = props
    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getOrdernums({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: -1,
            time_type: timeType,
            resolved: (data) => {
                // if (!visible) return
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const OrderNums = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getOrdernums({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: -1,
            time_type: time_type,
            resolved: (data) => {
                // if (!visible) return
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (
        <Card loading={loading} title='销售分析' bordered={false} size='small' bodyStyle={{ padding: 20 }}
            extra={
                <>
                    {/* <Select value={timeType} size='small' onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={1}>最近7天</Select.Option>
                        <Select.Option value={2}>最近一周</Select.Option>
                    </Select> */}
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    <Button size='small' onClick={OrderNums}>筛选</Button>
                </>
            }
        >
            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const OrderNumsFenxi = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD HH:mm'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD HH:mm'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(1)
    const [loading, setLoading] = useState(true)
    const [loads, setLoads] = useState(false)
    const [auth, setAuth] = useState(-1)
    const { actions } = props
    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getXiaoShouFenxi({
            beginTime: begin_time,
            endTime: end_time,
            time_type: time_type,
            action: '',
            resolved: (data) => {
                setData(data)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const OrderNums = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getXiaoShouFenxi({
            beginStr: begin_time,
            endStr: end_time,
            time_type: time_type,
            action: '',
            resolved: (data) => {
                setData(data)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    const Export = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoads(true)
        actions.getXiaoShouFenxi({
            beginStr: begin_time,
            endStr: end_time,
            time_type: time_type,
            action: 'export',
            resolved: (data) => {
                window.open(data.address)
                setLoads(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                setLoads(false)
            }
        })
    }
    return (
        <Card loading={loading} title='销售分析' bordered={false} size='small' bodyStyle={{ padding: 20 }}
            extra={
                <>

                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Button size='small' onClick={OrderNums}>筛选</Button>
                    <Button size='small' onClick={Export}>导出</Button>
                </>
            }
        >
            {
                Object.keys(data).map(item => {
                    console.log(item)
                    return (
                        <Card title={item}>
                            <Table columns={[
                                { dataIndex: '总成本', key: '总成本', title: '总成本' },
                                { dataIndex: '销售额', key: '销售额', title: '销售额' },
                                { dataIndex: '商品名', key: '商品名', title: '商品名' },
                                { dataIndex: '销售数量', key: '销售数量', title: '销售数量' },
                                { dataIndex: '商品分类', key: '商品分类', title: '商品分类' },
                                { dataIndex: '商品价格', key: '商品价格', title: '商品价格' },
                                { dataIndex: '总利润', key: '总利润', title: '总利润' },

                            ]} dataSource={data[item]}></Table>
                        </Card>
                    )
                })
            }

        </Card>
    )
}
export const OrdeReturn = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD HH:mm'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD HH:mm'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(1)
    const [loading, setLoading] = useState(true)
    const [auth, setAuth] = useState(-1)
    const { actions } = props
    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getOrderReturns({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: -1,
            time_type: timeType,
            attr: '',
            resolved: (data) => {
                // if (!visible) return
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const OrderNums = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getOrderReturns({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: -1,
            time_type: timeType,
            attr: '',
            resolved: (data) => {
                // if (!visible) return
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (
        <Card loading={loading} title='退货统计' bordered={false} size='small' bodyStyle={{ padding: 20 }}
            extra={
                <>
                    <Select value={timeType} onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={1}>最近7天</Select.Option>
                        <Select.Option value={2}>最近一周</Select.Option>
                    </Select>
                    <Filter showTimeType={false} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    <Button onClick={OrderNums}>筛选</Button>
                </>
            }
        >
            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const UserActive = (props) => {
    const [data, setData] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [state, setState] = useState({
        activenum: 0,
        back: 0,
        lose: 0,
        loyalty: 0,
        register: 0
    })
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [regions, setRegions] = useState([])
    const [region_id, setRegion] = useState(0)
    const [sex, setSex] = useState(-1)
    const [activenum, setActivenum] = useState(0)
    const { actions } = props

    useEffect(() => {
        let visible = true
        setLoading(true)
        setData([])
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getUserActive({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            region_id: region_id,
            sex: sex,
            resolved: (res) => {

                if (!visible) return
                const { active, activenum } = res
                if (active) {
                    let tmp = Object.keys(active).map(ele => ({
                        type: ele,
                        value: active[ele]
                    }))
                    setData(tmp)
                }
                if (activenum) {
                    setState(res)
                }
                setLoading(false)
            },
            rejected: (res) => {
                message.error(JSON.stringify(res))
                setLoading(false)
            }
        })
        actions.getEveryUserActive({
            begin_time,
            end_time,
            is_auth: auth,
            region_id: region_id,
            sex: sex,
            resolved: (res) => {
                setActivenum(res.activenum)
            },
            rejected: (res) => {
                message.error(JSON.stringify(res))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id, sex])
    const onExport = () => {
        setLoading(true)
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getUserActive({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            action: 'export',
            region_id: region_id,
            sex: sex,
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <div>
            <Card loading={loading} title='用户活跃度' bordered={false} size='small' bodyStyle={{ padding: 20 }}
                extra={
                    <>
                        <Filter showTimeType={false} disabled={loading} onChange={(res) => {
                            console.log(res)
                            setAtime(res)
                        }} />
                        <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        <Select value={sex} size='small' onChange={(e) => {
                            setSex(e)
                        }}>
                            <Option value={-1}>全部</Option>
                            <Option value={0}>未知</Option>
                            <Option value={1}>男</Option>
                            <Option value={2}>女</Option>
                        </Select>
                        {
                            regions.length > 0 ?
                                <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                    setRegion(e)
                                }}>
                                    <Option value={0}>全部</Option>
                                    {
                                        regions.map(item => {
                                            return (
                                                <Option value={item.regionId}>{item.regionName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                : null
                        }
                        <Button size="small" onClick={onExport} loading={loading}>导出</Button>
                    </>}
            >
                <div>
                    <span className='pad_r10'>注册数：<Tag>{state.register}</Tag></span>
                    <span className='pad_r10'>流失用户：<Tag>{state.lose}</Tag></span>
                    <span className='pad_r10'>回流用户：<Tag>{state.back}</Tag></span>
                    <span className='pad_r10'>忠诚用户数：<Tag>{state.loyalty}</Tag></span>
                    <span className='pad_r10'>活跃用户数：<Tag>{state.activenum}</Tag></span>
                </div>
                <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="line"
                        position="type*value"
                        color="l(90) 0:#3DA4FF 1:#97ceff"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>

            </Card>
            <Card loading={loading} title='人均活跃天数' bordered={false} size='small' bodyStyle={{ padding: 20 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="人均活跃天数" value={activenum} />
                    </Col>
                </Row>
            </Card>
        </div>
    )
}
export const UserNumbers = (props) => {
    const [data, setData] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [state, setState] = useState({
        activenum: 0,
        back: 0,
        lose: 0,
        loyalty: 0,
        register: 0
    })
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [regions, setRegions] = useState([])
    const [region_id, setRegion] = useState(0)
    const [sex, setSex] = useState(-1)
    const [activenum, setActivenum] = useState(0)
    const [level, setLevel] = useState(-1)
    const [id_level, setIdLevel] = useState('')
    const [is_buy, setIsBuy] = useState(-1)
    const [time_type, setTimetype] = useState(0)
    const { actions } = props

    useEffect(() => {
        let visible = true
        setLoading(true)
        setData([])
        const { begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getUserAllNumber({
            beginTime: begin_time,
            endTime: end_time,
            is_auth: auth,
            region_id: region_id,
            sex: sex,
            id_level: id_level,
            is_buy: is_buy,
            level: level,
            time_type: time_type,
            resolved: (res) => {
                setData(res)
                setLoading(false)
            },
            rejected: (err) => {
                message.error(JSON.stringify(err))
                setLoading(false)
            }
        })
        return () => visible = false
    }, [atime, auth, region_id, sex, level, id_level, is_buy, time_type])
    return (
        <div>
            <Card loading={loading} title='用户数' bordered={false} size='small' bodyStyle={{ padding: 20 }}
                extra={
                    <>
                        <Filter showTimeType={false} disabled={loading} onChange={(res) => {
                            console.log(res)
                            setAtime(res)
                        }} />
                        <Select size='small' style={{ width: '80px' }} value={auth} onChange={(val) => { setAuth(val) }}>
                            <Select.Option value={-1}>全部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        <Select value={sex} style={{ width: '100px' }} size='small' onChange={(e) => {
                            setSex(e)
                        }}>
                            <Option value={-1}>全部性别</Option>
                            <Option value={0}>未知</Option>
                            <Option value={1}>男</Option>
                            <Option value={2}>女</Option>
                        </Select>
                        <Select value={level} style={{ width: '90px' }} size='small' onChange={(e) => {
                            setLevel(e)
                        }}>
                            <Option value={-1}>全部等级</Option>
                            <Option value={0}>0级</Option>
                            <Option value={1}>1级</Option>
                            <Option value={2}>2级</Option>
                            <Option value={3}>3级</Option>
                            <Option value={4}>4级</Option>
                            <Option value={5}>5级</Option>
                            <Option value={6}>6级</Option>
                            <Option value={7}>7级</Option>
                        </Select>
                        <Select value={is_buy} style={{ width: '90px' }} size='small' onChange={(e) => {
                            setIsBuy(e)
                        }}>
                            <Option value={-1}>全部</Option>
                            <Option value={0}>已充值</Option>
                            <Option value={1}>未充值</Option>
                        </Select>
                        <Select value={time_type} style={{ width: '140px' }} size='small' onChange={(e) => {
                            setTimetype(e)
                        }}>
                            <Option value={0}>全部时间段</Option>
                            <Option value={1}>0-30分钟</Option>
                            <Option value={2}>30分钟-1小时</Option>
                            <Option value={3}>1-2小时</Option>
                            <Option value={4}>2-4小时</Option>
                            <Option value={5}>4小时以上</Option>
                        </Select>
                        <Select value={id_level} style={{ width: '120px' }} size='small' onChange={(e) => {
                            setIdLevel(e)
                        }}>
                            <Option value={''}>业绩等级全部</Option>
                            <Option value={'5'}>客户代表</Option>
                            <Option value={'6'}>客户经理</Option>
                            <Option value={'7'}>中级经理</Option>
                            <Option value={'8'}>客户总监</Option>
                            <Option value={'9'}>高级客户总监</Option>
                            <Option value={'GG'}>资深客户总监</Option>
                        </Select>
                        {
                            regions.length > 0 ?
                                <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                    setRegion(e)
                                }}>
                                    <Option value={0}>全部地区</Option>
                                    {
                                        regions.map(item => {
                                            return (
                                                <Option value={item.regionId}>{item.regionName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                : null
                        }
                    </>}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="用户数" value={data['用户数']} />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="会员数" value={data['会员数']} />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="游客数" value={data['游客数']} />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="认证会员数" value={data['认证会员数']} />
                    </Col>
                </Row>

            </Card>
        </div>
    )
}
export const UserFlag = (props) => {
    const [data, setData] = useState([])
    // const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    // const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    // const [timeType, setTimeType] = useState(1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        actions._getStatFlag({
            resolved: (data) => {
                if (!visible) return
                setData(Object.keys(data).map(ele => ({
                    type: flag_arg[ele],
                    value: data[ele]
                })))
                setLoading(false)
            },
            rejected: (data) => {

            }
        })
        return () => visible = false
    }, [])
    return (
        <Card loading={loading} title='业绩用户统计' bordered={false} size='small' bodyStyle={{ padding: 20 }}
        // extra={<Select value={timeType} onChange={(val) => { setTimeType(val) }}>
        //     <Select.Option value={1}>最近7天</Select.Option>
        //     <Select.Option value={2}>最近一周</Select.Option>
        // </Select>}
        >
            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const CourseRatess = (props) => {
    const [data, setData] = useState([])
    const [val, setVal] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: moment().subtract('days', 30).format('YYYY-MM-DD'), end_time: moment().format('YYYY-MM-DD') })
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [courseId, setCourseId] = useState('')
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.courseRate({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            course_id: courseId,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.courseRate({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            course_id: courseId,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Input placeholder='请输入课程ID' size='small' style={{ width: '120px' }} value={courseId} onChange={(e) => {
                        setCourseId(e.target.value)
                    }} />
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    {/* <Select size='small' className='m_2'  value={type} onChange={(val) => { setType(val) }}>
                    <Select.Option value={'num'}>触发次数</Select.Option>
                    <Select.Option value={'rate'}>触发占比</Select.Option>
                </Select> */}
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button className='m_2' loading={loading} size={'small'} onClick={onOk}>筛选</Button>

                </>}
        >

            <FormItem label='单课销售分析'>
                <Row gutter={16}>
                    {
                        val.map((item, index) => {
                            return (
                                <Col span={12} style={{ marginTop: '20px' }}>
                                    <Statistic title={item} value={data[index]} />
                                </Col>
                            )
                        })
                    }

                </Row>
            </FormItem>

        </Card>
    )
}
export const CourseRates = (props) => {
    const [data, setData] = useState([])
    const [res, setRes] = useState([])
    const [atime, setAtime] = useState({
        timeType: 0,
        begin_time: '',
        end_time: ''
    })

    // const [type, setType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const [courseId, setCourseId] = useState('')
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        setData([])
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.courseRates({
            beginTime: begin_time,
            endTime: end_time,
            time_type: 0,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                let asd = []
                asd.push(data)
                if (!visible) return
                if (asd.length > 0) {
                    let lst = []
                    let nas = []
                    asd.map((item, index) => {
                        let vas = []
                        Object.keys(item).map((itm, idx) => {
                            if(itm=='支付量'){
                                vas.push({ action: itm, pv: item[itm] })
                            }
                        })
                        Object.keys(item).map((itm, idx) => {
                            if(itm=='下单量'){
                                vas.push({ action: itm, pv: item[itm] })
                            }
                        })
                         Object.keys(item).map((itm, idx) => {
                            if(itm=='试听数'){
                                vas.push({ action: itm, pv: item[itm] })
                            }
                        })
                        Object.keys(item).map((itm, idx) => {
                            if(itm=='浏览量'){
                                vas.push({ action: itm, pv: item[itm] })
                            }
                        })  
                        lst.push(JSON.stringify(vas))
                        nas.push(item)
                    })
                    setData(lst)
                    setRes(nas)
                }
                setLoading(false)
            },
            rejected: () => {
                setLoading(false)
            }
        })
        return () => visible = false
    }, [])
    const onOk = () =>{
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.courseRates({
            beginTime: begin_time,
            endTime: end_time,
            time_type: 0,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                let asd = []
                asd.push(data)
                if (asd.length > 0) {
                    let lst = []
                    let nas = []
                    asd.map((item, index) => {
                        let vas = []
                        Object.keys(item).map((itm, idx) => {
                            if(itm=='支付量'){
                                vas.push({ action: itm, pv: item[itm] })
                            }
                        })
                        Object.keys(item).map((itm, idx) => {
                            if(itm=='下单量'){
                                vas.push({ action: itm, pv: item[itm] })
                            }
                        })
                         Object.keys(item).map((itm, idx) => {
                            if(itm=='试听数'){
                                vas.push({ action: itm, pv: item[itm] })
                            }
                        })
                        Object.keys(item).map((itm, idx) => {
                            if(itm=='浏览量'){
                                vas.push({ action: itm, pv: item[itm] })
                            }
                        })  
                        lst.push(JSON.stringify(vas))
                        nas.push(item)
                    })
                    setData(lst)
                    setRes(nas)
                }
                setLoading(false)
            },
            rejected: () => {
                setLoading(false)
            }
        })
    }
    return (
        <Spin spinning={loading}>
            <Card title='课程销售分析' bordered={false} size='small' bodyStyle={{ padding: 20 }}
                extra={
                    <>
                        <Input placeholder='请输入课程ID' size='small' style={{ width: '120px' }} value={courseId} onChange={(e) => {
                        setCourseId(e.target.value)
                    }} />
                        <Filter showTimeType={false} hasSeason={false} onChange={(data) => {
                            setAtime(data)
                        }} />
                         <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        {
                            regions.length > 0 ?
                                <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                    setRegionId(e)
                                }}>
                                    <Option value={0}>全部</Option>
                                    {
                                        regions.map(item => {
                                            return (
                                                <Option value={item.regionId}>{item.regionName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                : null
                        }
                        <Button className='m_2' loading={loading} size={'small'} onClick={onOk}>筛选</Button>
                    </>}
            >
                {
                    data.length > 0 ?
                        <div>
                            {
                                data.map((item, index) => {
                                    let val = JSON.parse(item)
                                    val.reverse()
                                    const dv = new DataView().source(val)
                                    dv.transform({
                                        type: 'map',
                                        callback(row) {
                                            if(row.pv==0){
                                                row.percent = 0
                                            }else if(val[0].pv==0){
                                                row.percent = row.pv
                                            }else{
                                                row.percent = row.pv / val[0].pv;
                                            }
                                            
                                            return row;
                                        },
                                    });
                                    let nas = res[index]
                                    return (
                                        <Card>
                                            <Chart
                                                height={600}
                                                data={dv.rows}
                                                padding={[20, 120, 95]}
                                                autoFit
                                            >
                                                <Tooltip
                                                    showTitle={false}
                                                    itemTpl="<li data-index={index} style=&quot;margin-bottom:4px;&quot;><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}<br/><span style=&quot;padding-left: 16px&quot;>浏览人数：{pv}</span><br/><span style=&quot;padding-left: 16px&quot;>占比：{percent}</span><br/></li>"
                                                />
                                                <Axis name='percent' grid={null} label={null} />
                                                <Axis name='action' label={null} line={null} grid={null} tickLine={null} />
                                                <Coordinate scale={[1, -1]} transpose type="rect" />
                                                <Legend />
                                                {dv.rows.map(obj => {
                                                    return (
                                                        <Annotation.Text
                                                            top={true}
                                                            position={[obj.action, 0.5]}

                                                            content={parseInt(obj.percent * 100) + "%"}
                                                            style={{
                                                                fill: "#fff",
                                                                fontSize: "12",
                                                                textAlign: "center",
                                                                shadowBlur: 2,
                                                                shadowColor: "rgba(0, 0, 0, .45)"
                                                            }}
                                                        />
                                                    );
                                                })}
                                                <Interval
                                                    position="action*percent"
                                                    adjust="symmetric"
                                                    shape="funnel"
                                                    color={[
                                                        "action",
                                                        ["#0050B3", "#1890FF", "#40A9FF", "#69C0FF", "#BAE7FF"]
                                                    ]}
                                                    tooltip={[
                                                        "action*pv*percent",
                                                        (action, pv, percent) => {
                                                            return {
                                                                name: action,
                                                                percent: parseInt(percent * 100) + "%",
                                                                pv: pv
                                                            };
                                                        }
                                                    ]}
                                                    label={["action*pv",
                                                        (action, pv) => {
                                                            return { content: action + " " + pv };
                                                        },
                                                        {
                                                            offset: 35,
                                                            labelLine: {
                                                                style: {
                                                                    lineWidth: 1,
                                                                    stroke: 'rgba(0, 0, 0, 0.15)',
                                                                },
                                                            },
                                                        }]}
                                                >
                                                </Interval>
                                            </Chart>
                                        </Card>
                                    )
                                })
                            }
                        </div>
                        : null
                }
            </Card>
        </Spin>
    )
}
export const GoodsRates = (props) => {
    const [data, setData] = useState([])
    const [res, setRes] = useState([])
    const [atime, setAtime] = useState({
        timeType: 0,
        begin_time: '',
        end_time: ''
    })

    // const [type, setType] = useState(0)
    // const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        setData([])
        actions.getGoodsRates({
            beginTime: begin_time,
            endTime: end_time,
            time_type: 0,
            resolved: (data) => {
                if (!visible) return
                if (data.length > 0) {
                    let lst = []
                    let nas = []
                    data.map((item, index) => {
                        let vas = []
                        Object.keys(item).map((itm, idx) => {
                            if (itm != '商品名') {
                                vas.push({ action: itm, pv: item[itm] })
                            }
                        })
                        lst.push(JSON.stringify(vas))
                        nas.push(item['商品名'])
                    })
                    setData(lst)
                    setRes(nas)
                }
                setLoading(false)
            },
            rejected: () => {
                setLoading(false)
            }
        })
        return () => visible = false
    }, [atime])
    return (
        <Spin spinning={loading}>
            <Card title='商品转化率' bordered={false} size='small' bodyStyle={{ padding: 20 }}
                extra={
                    <>
                        <Filter showTimeType={false} hasSeason={false} onChange={(data) => {
                            setAtime(data)
                        }} />
                    </>}
            >
                {
                    data.length > 0 ?
                        <div>
                            {
                                data.map((item, index) => {
                                    let val = JSON.parse(item)
                                    val.reverse()
                                    const dv = new DataView().source(val)
                                    dv.transform({
                                        type: 'map',
                                        callback(row) {
                                            if(row.pv==0){
                                                row.percent = 0
                                            }else if(val[0].pv==0){
                                                row.percent = row.pv
                                            }else{
                                                row.percent = row.pv / val[0].pv;
                                            }
                                            return row;
                                        },
                                    });
                                    let nas = res[index]
                                    return (
                                        <Card title={nas}>
                                            <Chart
                                                height={600}
                                                data={dv.rows}
                                                padding={[20, 120, 95]}
                                                autoFit
                                            >
                                                <Tooltip
                                                    showTitle={false}
                                                    itemTpl="<li data-index={index} style=&quot;margin-bottom:4px;&quot;><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}<br/><span style=&quot;padding-left: 16px&quot;>浏览人数：{pv}</span><br/><span style=&quot;padding-left: 16px&quot;>占比：{percent}</span><br/></li>"
                                                />
                                                <Axis name='percent' grid={null} label={null} />
                                                <Axis name='action' label={null} line={null} grid={null} tickLine={null} />
                                                <Coordinate scale={[1, -1]} transpose type="rect" />
                                                <Legend />
                                                {dv.rows.map(obj => {
                                                    return (
                                                        <Annotation.Text
                                                            top={true}
                                                            position={[obj.action, 0.5]}

                                                            content={parseInt(obj.percent * 100) + "%"}
                                                            style={{
                                                                fill: "#fff",
                                                                fontSize: "12",
                                                                textAlign: "center",
                                                                shadowBlur: 2,
                                                                shadowColor: "rgba(0, 0, 0, .45)"
                                                            }}
                                                        />
                                                    );
                                                })}
                                                <Interval
                                                    position="action*percent"
                                                    adjust="symmetric"
                                                    shape="funnel"
                                                    color={[
                                                        "action",
                                                        ["#0050B3", "#1890FF", "#40A9FF", "#69C0FF", "#BAE7FF"]
                                                    ]}
                                                    tooltip={[
                                                        "action*pv*percent",
                                                        (action, pv, percent) => {
                                                            return {
                                                                name: action,
                                                                percent: parseInt(percent * 100) + "%",
                                                                pv: pv
                                                            };
                                                        }
                                                    ]}
                                                    label={["action*pv",
                                                        (action, pv) => {
                                                            return { content: action + " " + pv };
                                                        },
                                                        {
                                                            offset: 35,
                                                            labelLine: {
                                                                style: {
                                                                    lineWidth: 1,
                                                                    stroke: 'rgba(0, 0, 0, 0.15)',
                                                                },
                                                            },
                                                        }]}
                                                >
                                                </Interval>
                                            </Chart>
                                        </Card>
                                    )
                                })
                            }
                        </div>
                        : null
                }
            </Card>
        </Spin>
    )
}
export const TeacherStat = (props) => {
    const [data, setData] = useState([])
    const [atime, setAtime] = useState({
        timeType: 0,
        begin_time: '',
        end_time: ''
    })

    // const [type, setType] = useState(0)
    // const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        setData([])
        actions.getStatTeacherInfo({
            time_type,
            begin_time,
            end_time,
            // is_auth: auth,
            // type,
            resolved: (data) => {
                if (!visible) return
                if (Array.isArray(data)) {
                    setData(data)
                }
                setLoading(false)
            },
            rejected: () => {
                setLoading(false)
            }
        })
        return () => visible = false
    }, [atime])
    return (
        <Spin spinning={loading}>
            <Card title='讲师统计' bordered={false} size='small' bodyStyle={{ padding: 20 }}
                extra={
                    <>
                        <Filter showTimeType={false} hasSeason={false} onChange={(data) => {
                            setAtime(data)
                        }} />
                        {/* <Select size='small' value={type} onChange={(val) => { setType(val) }}>
                        <Select.Option value={0}>日留存</Select.Option>
                        <Select.Option value={1}>周留存</Select.Option>
                        <Select.Option value={2}>月留存</Select.Option>
                        <Select.Option value={3}>季留存</Select.Option>
                        <Select.Option value={4}>年留存</Select.Option>
                    </Select>
                    <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    <Button size="small" onClick={onExport} loading={loading}>导出</Button> */}
                    </>}
            >
                <Table rowKey='teacherId' dataSource={data} columns={[
                    { title: 'ID', dataIndex: 'teacherId', key: 'teacherId' },
                    { title: '讲师姓名', dataIndex: 'teacherName', key: 'teacherName' },
                    { title: '讲师课程数', dataIndex: 'course', key: 'course' },
                    { title: '粉丝数', dataIndex: 'follow', key: 'follow' },
                    { title: '讲师级别', dataIndex: 'levelName', key: 'levelName' },
                    { title: '新课数', dataIndex: 'newCourse', key: 'newCourse' },
                    { title: '满意度', dataIndex: 'satisfaction', key: 'satisfaction' },
                    { title: '评分', dataIndex: 'score', key: 'score' },
                ]}></Table>
            </Card>
        </Spin>
    )
}
export const CourseSell = (props) => {
    const [data, setData] = useState([])
    const [keys, setKeys] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: moment().subtract('days', 30).format('YYYY-MM-DD'), end_time: moment().format('YYYY-MM-DD') })
    // const [type, setType] = useState(0)
    // const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [auth, setAuth] = useState(-1)
    const [type, setType] = useState(0)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        setData([])
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getCourseSell({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            type: type,
            resolved: (data) => {
                if (!visible) return


                let lst = []
                let vas = []
                Object.keys(data).map(item => {
                    lst.push(JSON.parse(item))
                })

                setData(lst)
                setKeys(Object.values(data))

                setLoading(false)
            },
            rejected: () => {
                setLoading(false)
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    return (
        <Spin spinning={loading}>
            <Card title='讲师统计' bordered={false} size='small' bodyStyle={{ padding: 20 }}
                extra={
                    <>
                        <Filter showTimeType={true} hasSeason={false} onChange={(data) => {
                            setAtime(data)
                        }} />
                        <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        <Select size='small' style={{ width: '100px' }} className='m_2' value={type} onChange={(val) => { setType(val) }}>
                            <Select.Option value={0}>全部课程</Select.Option>
                            <Select.Option value={1}>分销课程</Select.Option>
                        </Select>
                        {
                            regions.length > 0 ?
                                <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                    setRegionId(e)
                                }}>
                                    <Option value={0}>全部</Option>
                                    {
                                        regions.map(item => {
                                            return (
                                                <Option value={item.regionId}>{item.regionName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                : null
                        }

                    </>}
            >
                <Table rowKey='teacherId' dataSource={data} columns={[
                    {
                        title: '排名', dataIndex: '', key: '', render: (item, ele, index) => {
                            let vas = data.filter(item => item.courseId == ele.courseId)[0]
                            return data.indexOf(vas) + 1
                        }
                    },
                    { title: 'ID', dataIndex: 'courseId', key: 'tcourseId' },
                    { title: '课程名', dataIndex: 'courseName', key: 'courseName' },
                    { title: '课程编号', dataIndex: 'sn', key: 'sn' },
                    {
                        title: '创建时间', dataIndex: '', key: '', render: (ele, index) => {
                            return moment.unix(ele.pubTime).format('YYYY-MM-DD HH:mm')
                        }
                    },
                    {
                        title: '上架时间', dataIndex: '', key: '', render: (ele, index) => {
                            if (ele.shelvesTime > 0)
                                return moment.unix(ele.shelvesTime).format('YYYY-MM-DD HH:mm')
                            else
                                return '未获取上架时间'
                        }
                    },
                    { title: '销售价格', dataIndex: 'integral', key: 'integral' },
                    {
                        title: '销量', dataIndex: '', key: '', render: (item, ele, index) => {
                            let vas = data.filter(item => item.courseId == ele.courseId)[0]
                            return keys[data.indexOf(vas)]
                        }
                    },
                ]}></Table>
            </Card>
        </Spin>
    )
}
export const OrderRecharge = (props) => {
    const [data, setData] = useState([])
    const [keys, setKeys] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    // const [type, setType] = useState(0)
    // const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [auth, setAuth] = useState(-1)
    const [type, setType] = useState(0)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        setData([])
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getOrderRecharge({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            regionId: region_id,
            rechargeId: 0,
            page: 0,
            pageSize: 10000,
            resolved: (data) => {
                if (!visible) return
                setData(data.data)
                setLoading(false)
            },
            rejected: () => {
                setLoading(false)
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    return (
        <Spin spinning={loading}>
            <Card title='充值订单' bordered={false} size='small' bodyStyle={{ padding: 20 }}
                extra={
                    <>
                        <Filter showTimeType={true} hasSeason={false} onChange={(data) => {
                            setAtime(data)
                        }} />
                        <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        {
                            regions.length > 0 ?
                                <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                    setRegionId(e)
                                }}>
                                    <Option value={0}>全部</Option>
                                    {
                                        regions.map(item => {
                                            return (
                                                <Option value={item.regionId}>{item.regionName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                : null
                        }

                    </>}
            >
                <Table rowKey='teacherId' dataSource={data} columns={[
                    { title: 'ID', dataIndex: 'orderId', key: 'orderId' },
                    { title: '订单价格', dataIndex: 'orderAmount', key: 'orderAmount' },
                    { title: '订单号', dataIndex: 'orderSn', key: 'orderSn' },
                    {
                        title: '订单时间', dataIndex: '', key: '', render: (ele, index) => {
                            return moment.unix(ele.payTime).format('YYYY-MM-DD HH:mm')
                        }
                    },
                    { title: '订单详情', dataIndex: 'remark', key: 'remark' },
                ]}></Table>
            </Card>
        </Spin>
    )
}
export const WithdrawTeacher = (props) => {
    const [data, setData] = useState([])
    const [keys, setKeys] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '2020-01-01', end_time: moment().format('YYYY-MM-DD') })
    // const [type, setType] = useState(0)
    // const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [auth, setAuth] = useState(-1)
    const [type, setType] = useState(0)
    const [teacherId, setTeacherId] = useState('')
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        setData([])
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getwithdrawTeacher({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            teacherId: teacherId,
            time_type: time_type,
            resolved: (data) => {
                if (!visible) return
                let lst = Object.values(data)
                let vas = Object.keys(data)
                setData(lst)
                setKeys(vas)
                setLoading(false)
            },
            rejected: () => {
                setLoading(false)
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getwithdrawTeacher({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            regionId: region_id,
            teacherId: teacherId,
            time_type: time_type,
            resolved: (data) => {
                let lst = Object.values(data)
                let vas = Object.keys(data)
                setData(lst)
                setKeys(vas)
                setLoading(false)
            },
            rejected: () => {
                setLoading(false)
            }
        })
    }
    return (
        <Spin spinning={loading}>
            <Card title='不同讲师提现金额' bordered={false} size='small' bodyStyle={{ padding: 20 }}
                extra={
                    <>
                        <Input value={teacherId} size='small' placeholder='请输入讲师ID' style={{ width: '120px' }} onChange={(e) => {
                            setTeacherId(e.target.value)
                        }} />
                        <Filter showTimeType={true} hasSeason={false} onChange={(data) => {
                            setAtime(data)
                        }} />
                        <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        {
                            regions.length > 0 ?
                                <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                    setRegionId(e)
                                }}>
                                    <Option value={0}>全部</Option>
                                    {
                                        regions.map(item => {
                                            return (
                                                <Option value={item.regionId}>{item.regionName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                : null
                        }
                        <Button size='small' onClick={onOk}>筛选</Button>
                    </>}
            >
                <Table rowKey='teacherId' dataSource={data} columns={[
                    { title: '讲师ID', dataIndex: 'teacherId', key: 'teacherId' },
                    { title: '讲师名', dataIndex: 'teacherName', key: 'teacherName' },
                    { title: '单号', dataIndex: 'sn', key: 'sn' },
                    {
                        title: '提现时间', dataIndex: '', key: '', render: (ele, index) => {
                            return moment.unix(ele.pub_time).format('YYYY-MM-DD HH:mm')
                        }
                    },
                    {
                        title: '提现金额', dataIndex: '', key: '', render: (item, ele, index) => {
                            let vas = data.filter(item => item.teacherId == ele.teacherId)[0]
                            return keys[data.indexOf(vas)]
                        }
                    },
                ]}></Table>
            </Card>
        </Spin>
    )
}
export const GoodsTable = (props) => {
    const [data, setData] = useState([])
    const [sortType, setSrtType] = useState(0)
    const [goodsName, setGoodsName] = useState('')
    const [atime, setAtime] = useState({
        timeType: 0,
        begin_time: '',
        end_time: ''
    })

    // const [type, setType] = useState(0)
    // const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        setData([])
        actions.getGoodsTable({
            sortType: sortType,
            beginTime: begin_time,
            endTime: end_time,
            time_type: time_type,
            goodsName: goodsName,
            resolved: (data) => {
                if (!visible) return
                if (Array.isArray(data)) {
                    setData(data)
                }
                setLoading(false)
            },
            rejected: () => {
                setLoading(false)
            }
        })
        return () => visible = false
    }, [atime])
    const onOk = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        setData([])
        actions.getGoodsTable({
            sortType: sortType,
            beginTime: begin_time,
            endTime: end_time,
            time_type: time_type,
            goodsName: goodsName,
            resolved: (data) => {
                if (!visible) return
                if (Array.isArray(data)) {
                    setData(data)
                }
                setLoading(false)
            },
            rejected: () => {
                setLoading(false)
            }
        })
        return () => visible = false
    }
    return (
        <Spin spinning={loading}>
            <Card title='商城流量分析' bordered={false} size='small' bodyStyle={{ padding: 20 }}
                extra={
                    <>
                        <Select size='small' style={{ width: '100px' }} value={sortType} onChange={(e) => {
                            setSrtType(e)
                        }}>
                            <Option value={0}>pv排序</Option>
                            <Option value={1}>uv排序</Option>
                        </Select>
                        <Filter showTimeType={true} hasSeason={false} onChange={(data) => {
                            setAtime(data)
                        }} />
                        <Input size='small' placeholder='商品名' style={{ width: '120px' }} value={goodsName} onChange={(e) => {
                            setGoodsName(e.target.value)
                        }} />
                        <Button size='small' onClick={onOk}>筛选</Button>
                    </>}
            >
                <Table rowKey='teacherId' dataSource={data} columns={[
                    { title: '商品名', dataIndex: '商品名', key: '商品名' },
                    { title: 'UV', dataIndex: 'UV', key: 'UV' },
                    { title: 'PV', dataIndex: 'PV', key: 'PV' },

                ]}></Table>
            </Card>
        </Spin>
    )
}
export const UserStay = (props) => {
    const [data, setData] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [sex, setSex] = useState(-1)
    const [type, setType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        setData([])
        actions.getUserStay({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            type,
            sex: sex,
            region_id: region_id,
            resolved: (data) => {
                if (!visible) return
                setData(Object.keys(data).map(ele => ({
                    type: ele,
                    value: parseFloat(data[ele])
                })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                setLoading(false)
            }
        })
        return () => visible = false
    }, [atime, auth, type, sex, region_id])
    const onExport = () => {
        if (!Array.isArray(atime)) return;
        setLoading(true)
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getUserStay({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            action: 'export',
            sex: sex,
            region_id: region_id,
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} title='用户留存率' bordered={false} size='small' bodyStyle={{ padding: 20 }}
            extra={
                <>
                    <Filter showTimeType={false} hasSeason={false} onChange={(data) => {
                        setAtime(data)
                    }} />
                    <Select size='small' value={type} onChange={(val) => { setType(val) }}>
                        <Select.Option value={0}>日留存</Select.Option>
                        <Select.Option value={1}>周留存</Select.Option>
                        <Select.Option value={2}>月留存</Select.Option>
                        <Select.Option value={3}>季留存</Select.Option>
                        <Select.Option value={4}>年留存</Select.Option>
                    </Select>
                    <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    <Select value={sex} size='small' onChange={(e) => {
                        setSex(e)
                    }}>
                        <Option value={-1}>全部</Option>
                        <Option value={0}>未知</Option>
                        <Option value={1}>男</Option>
                        <Option value={2}>女</Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    {/* <Button size="small" onClick={onExport} loading={loading}>导出</Button> */}
                </>}
        >
            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="line"
                    position="type*value"
                    color="l(90) 0:#3DA4FF 1:#97ceff"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const UserTags = (props) => {
    const [data, setData] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })

    const [type, setType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        setData([])
        actions.getUserTags({
            time_type,
            begin_time,
            end_time,
            resolved: (data) => {
                if (!visible) return
                setData(Object.keys(data).map(ele => ({
                    type: ele,
                    value: data[ele]
                })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                setLoading(false)
            }
        })
        return () => visible = false
    }, [atime, auth, type])
    return (
        <Card loading={loading} title='课程标签分析' bordered={false} size='small' bodyStyle={{ padding: 20 }}
            extra={
                <>
                    <Filter showTimeType={false} hasSeason={false} onChange={(data) => {
                        setAtime(data)
                    }} />

                    {/* <Button size="small" onClick={onExport} loading={loading}>导出</Button> */}
                </>}
        >
            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="line"
                    position="type*value"
                    color="l(90) 0:#3DA4FF 1:#97ceff"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const UserSex = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        actions.getStatUserSex({
            resolved: (data) => {
                if (!visible) return
                const map = { manusers: '男性', womanusers: '女性' }
                setData(Object.keys(data).map(ele => ({ type: map[ele], value: data[ele] * 100 })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    return (

        <Card loading={loading} bordered={false} size='small' title='用户男女性别比例'
            extra={
                <>
                    {/* <DatePicker.RangePicker size='small' onChange={(dataString,data)=>{
                    setBeginTime(dataString[0])
                    setEndTime(dataString[1])
                }}></DatePicker.RangePicker>
                
                <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                    <Select.Option value={-1}>全 部</Select.Option>
                    <Select.Option value={0}>未认证</Select.Option>
                    <Select.Option value={1}>已认证</Select.Option>
                </Select> */}
                </>}
        >

            <PieChart
                data={data || []}
                title={{
                    visible: false,
                    text: ''
                }}
                description={{
                    visible: false,
                    text: '',
                }}
                radius={0.6}
                angleField='value'
                colorField='type'
                label={{
                    visible: true,
                    type: 'outer',
                    offset: 20,
                }}
            />
        </Card>
    )
}
export const CourseText = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '2020-01-01', end_time: moment().format('YYYY-MM-DD') })
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(0)
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(true)
    const [type, setType] = useState(0)
    const [name, setName] = useState('')
    const [namelst, setNamelst] = useState([])
    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        message.info({ content: '请输入课程id' })
        setLoading(false)
        return () => visible = false
    }, [])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        if (!userId) { message.info({ content: '请输入课程id' }); return; }
        setLoading(true)
        props.actions.actions.getCourseResults({
            course_id: userId, type: 1,
            resolved: (data) => {
                let lst = Object.keys(data).map(ele => {
                    let { title, ttype, result } = data[ele][0]
                    if (ttype !== 4) result = Object.keys(result).map(_ele => ({ type: _ele, value: result[_ele] }))
                    return {
                        id: ele,
                        title: title,
                        ttype: ttype,
                        result: result
                    }
                })
                setData(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    const onOuts = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        if (!userId) { message.info({ content: '请输入课程id' }); return; }
        props.actions.actions.getCourseResultExp({
            course_id: userId, type: 1,
            resolved: (data) => {
                window.open(data.address)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    const onChange = (e, val) => {
        setName(e)
        setUserId(val.key)
        props.actions.actions.getCourseResults({
            course_id: parseInt(val.key), type: 1,
            resolved: (data) => {
                let lst = Object.keys(data).map(ele => {
                    let { title, ttype, result } = data[ele][0]
                    if (ttype !== 4) result = Object.keys(result).map(_ele => ({ type: _ele, value: result[_ele] }))
                    return {
                        id: ele,
                        title: title,
                        ttype: ttype,
                        result: result
                    }
                })
                setData(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    const onSearch = (e) => {
        props.actions.actions.getCourselst({
            ccategoryId: 0,
            keyword: e,
            page: 0,
            pageSize: 20,
            category_id: 0,
            ctype: 0,
            resolved: (res) => {
                setNamelst(res.data)
            },
            rejected: (err) => {

            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Select value={type} size='small' style={{ width: '80px' }} onChange={(e) => { setType(e) }}>
                        <Option value={0}>ID</Option>
                        <Option value={1}>课程名</Option>
                    </Select>
                    {
                        type == 0 ?
                            <Input size='small' placeholder='请输入课程ID' value={userId} style={{ width: '120px' }} onChange={(e) => {
                                setUserId(e.target.value)
                            }} />
                            :
                            <Select
                                showSearch
                                size='small'
                                placeholder="课程名"
                                optionFilterProp="children"
                                style={{ width: '200px' }}
                                onChange={onChange}
                                onSearch={onSearch}
                            >
                                {
                                    namelst.map((item, index) => {
                                        return (
                                            <Option value={item.courseName} key={item.courseId}>{item.courseName}</Option>
                                        )
                                    })
                                }
                            </Select>
                    }
                    {
                        type == 0 ?
                            <Button size='small' onClick={onOk}>筛选</Button>
                            : null
                    }
                    <Button size='small' onClick={onOuts}>导出</Button>
                </>}
        >
            <Table
                columns={
                    [
                        {
                            title: 'ID',
                            dataIndex: 'id',
                            key: 'id',
                            ellipsis: false,
                            width: 100
                        },
                        {
                            width: 150,
                            title: '题目类型',
                            dataIndex: 'ttype',
                            key: 'ttype',
                            ellipsis: false,
                            render: (item, ele) => ele.ttype == 0 ? '单选题' : ele.ttype == 3 ? '多选题' : ele.ttype == 4 ? '开放题' : '未知',
                        },
                        {
                            title: '题目',
                            dataIndex: 'title',
                            key: 'title',
                            ellipsis: false,
                        },
                    ]
                }
                expandedRowRender={(ele) => {
                    if (ele.ttype == 4) {

                        return (
                            <Table
                                rowKey='userId'
                                size='small'
                                columns={
                                    [
                                        {
                                            title: 'UID',
                                            dataIndex: 'userId',
                                            key: 'userId',
                                            ellipsis: false,
                                        },
                                        {
                                            title: '回答',
                                            dataIndex: 'answer',
                                            key: 'answer',
                                            ellipsis: false,
                                        },
                                    ]
                                }
                                dataSource={ele.result}
                                pagination={{
                                    position: 'bottom',
                                    showTotal: (total) => '总共' + total + '条'
                                }}
                            />
                        )
                    }
                    return (
                        <div>
                            <PieChart
                                data={ele.result}
                                title={{
                                    visible: false,
                                    text: ''
                                }}
                                description={{
                                    visible: true,
                                    text: ele.title,
                                }}
                                radius={0.8}
                                angleField='value'
                                colorField='type'
                                label={{
                                    visible: true,
                                    type: 'outer',
                                    offset: 20,
                                }}
                            />
                        </div>
                    )
                }
                }
                dataSource={data}
                rowKey='activityId'
            />

        </Card>
    )
}
export const TeacherSex = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '2020-01-01', end_time: moment().format('YYYY-MM-DD') })
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(0)
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(true)
    const [type, setType] = useState(0)
    const [name, setName] = useState('')
    const [namelst, setNamelst] = useState([])
    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        message.info({ content: '请输入课程id' })
        setLoading(false)
        return () => visible = false
    }, [])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        if (!userId) { message.info({ content: '请输入课程id' }); return; }
        setLoading(true)
        props.actions.actions.getCourseResults({
            course_id: userId, type: 0,
            resolved: (data) => {
                let lst = Object.keys(data).map(ele => {
                    let { title, ttype, result } = data[ele][0]
                    if (ttype !== 4) result = Object.keys(result).map(_ele => ({ type: _ele, value: result[_ele] }))
                    return {
                        id: ele,
                        title: title,
                        ttype: ttype,
                        result: result
                    }
                })
                setData(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    const onOuts = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        if (!userId) { message.info({ content: '请输入课程id' }); return; }
        props.actions.actions.getCourseResultExp({
            course_id: userId, type: 0,
            resolved: (data) => {
                window.open(data.address)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    const onChange = (e, val) => {
        setName(e)
        setUserId(val.key)
        props.actions.actions.getCourseResults({
            course_id: parseInt(val.key), type: 0,
            resolved: (data) => {
                let lst = Object.keys(data).map(ele => {
                    let { title, ttype, result } = data[ele][0]
                    if (ttype !== 4) result = Object.keys(result).map(_ele => ({ type: _ele, value: result[_ele] }))
                    return {
                        id: ele,
                        title: title,
                        ttype: ttype,
                        result: result
                    }
                })
                setData(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    const onSearch = (e) => {
        props.actions.actions.getCourselst({
            ccategoryId: 0,
            keyword: e,
            page: 0,
            pageSize: 20,
            category_id: 0,
            ctype: 0,
            resolved: (res) => {
                setNamelst(res.data)
            },
            rejected: (err) => {

            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Select value={type} size='small' style={{ width: '80px' }} onChange={(e) => { setType(e) }}>
                        <Option value={0}>ID</Option>
                        <Option value={1}>课程名</Option>
                    </Select>
                    {
                        type == 0 ?
                            <Input size='small' placeholder='请输入课程ID' value={userId} style={{ width: '120px' }} onChange={(e) => {
                                setUserId(e.target.value)
                            }} />
                            :
                            <Select
                                showSearch
                                size='small'
                                placeholder="课程名"
                                optionFilterProp="children"
                                style={{ width: '200px' }}
                                onChange={onChange}
                                onSearch={onSearch}
                            >
                                {
                                    namelst.map((item, index) => {
                                        return (
                                            <Option value={item.courseName} key={item.courseId}>{item.courseName}</Option>
                                        )
                                    })
                                }
                            </Select>
                    }
                    {
                        type == 0 ?
                            <Button size='small' onClick={onOk}>筛选</Button>
                            : null
                    }
                    <Button size='small' onClick={onOuts}>导出</Button>
                </>}
        >
            <Table
                columns={
                    [
                        {
                            title: 'ID',
                            dataIndex: 'id',
                            key: 'id',
                            ellipsis: false,
                            width: 100
                        },
                        {
                            width: 150,
                            title: '问卷类型',
                            dataIndex: 'ttype',
                            key: 'ttype',
                            ellipsis: false,
                            render: (item, ele) => ele.ttype == 0 ? '单选题' : ele.ttype == 3 ? '多选题' : ele.ttype == 4 ? '开放题' : '未知',
                        },
                        {
                            title: '问卷',
                            dataIndex: 'title',
                            key: 'title',
                            ellipsis: false,
                        },
                    ]
                }
                expandedRowRender={(ele) => {
                    if (ele.ttype == 4) {

                        return (
                            <Table
                                rowKey='userId'
                                size='small'
                                columns={
                                    [
                                        {
                                            title: 'UID',
                                            dataIndex: 'userId',
                                            key: 'userId',
                                            ellipsis: false,
                                        },
                                        {
                                            title: '回答',
                                            dataIndex: 'answer',
                                            key: 'answer',
                                            ellipsis: false,
                                        },
                                    ]
                                }
                                dataSource={ele.result}
                                pagination={{
                                    position: 'bottom',
                                    showTotal: (total) => '总共' + total + '条'
                                }}
                            />
                        )
                    }
                    return (
                        <div>
                            <PieChart
                                data={ele.result}
                                title={{
                                    visible: false,
                                    text: ''
                                }}
                                description={{
                                    visible: true,
                                    text: ele.title,
                                }}
                                radius={0.8}
                                angleField='value'
                                colorField='type'
                                label={{
                                    visible: true,
                                    type: 'outer',
                                    offset: 20,
                                }}
                            />
                        </div>
                    )
                }
                }
                dataSource={data}
                rowKey='activityId'
            />

        </Card>
    )
}
export const TeacherArea = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '2020-01-01', end_time: moment().format('YYYY-MM-DD') })
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(0)
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getTeachersArea({
            beginTime: begin_time, endTime: end_time, teacher_id: userId, time_type,
            resolved: (data) => {
                if (!visible) return
                // const map = { manusers: '男性', womanusers: '女性' }
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] * 100 })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        setLoading(true)
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getTeachersArea({
            beginTime: begin_time, endTime: end_time, teacher_id: userId, time_type,
            resolved: (data) => {
                // if (!visible) return
                // const map = { manusers: '男性', womanusers: '女性' }
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] * 100 })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='讲师用户地区详情'
            extra={
                <>
                    <Input size='small' placeholder='请输入讲师ID' value={userId} style={{ width: '120px' }} onChange={(e) => {
                        setUserId(e.target.value)
                    }} />
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Button size='small' onClick={onOk}>筛选</Button>
                </>}
        >

            <PieChart
                data={data || []}
                title={{
                    visible: false,
                    text: ''
                }}
                description={{
                    visible: false,
                    text: '',
                }}
                radius={0.6}
                angleField='value'
                colorField='type'
                label={{
                    visible: true,
                    type: 'outer',
                    offset: 20,
                }}
            />
        </Card>
    )
}
export const ShopUsers = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [timeType, setTimeType] = useState(0)
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        const { timeType: time_type, begin_time, end_time } = atime
        let visible = true
        actions.getShopUsers({
            beginTime: begin_time,
            endTime: end_time,
            time_type: time_type,
            resolved: (data) => {
                if (!visible) return
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] * 100 })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime])
    return (

        <Card loading={loading} bordered={false} size='small' title='商城访客分析'
            extra={
                <>
                    <Filter showTimeType={true} hasSeason={false} onChange={(data) => {
                        setAtime(data)
                    }} />
                </>}
        >

            <PieChart
                data={data || []}
                title={{
                    visible: false,
                    text: ''
                }}
                description={{
                    visible: false,
                    text: '',
                }}
                radius={0.6}
                angleField='value'
                colorField='type'
                label={{
                    visible: true,
                    type: 'outer',
                    offset: 20,
                }}
            />
        </Card>
    )
}
export const CourseAsks = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(0)
    const [teacher_id, setTeacherId] = useState('')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getTeacherAsks({
            begin_tim: begin_time,
            end_time: end_time,
            teacher_id: '',
            time_type: 0,
            course_id: teacher_id,
            type: 0,
            resolved: (data) => {
                if (!visible) return
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getTeacherAsks({
            begin_tim: begin_time,
            end_time: end_time,
            teacher_id: '',
            time_type: 0,
            course_id: teacher_id,
            type: 0,
            resolved: (data) => {
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                setLoading(false)
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='课程问卷数据情况分析'
            extra={
                <>
                    <Input size='small' placeholder='请输入课程Id' style={{ width: '120px' }} value={teacher_id} onChange={(e) => {
                        setTeacherId(e.target.value)
                    }} />
                    <Filter showTimeType={false} hasSeason={false} onChange={(data) => {
                        setAtime(data)
                    }} />
                    <Button size='small' onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
        </Card>
    )
}
export const Coursetsts = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(0)
    const [teacher_id, setTeacherId] = useState('')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getTeacherAsks({
            begin_tim: begin_time,
            end_time: end_time,
            teacher_id: '',
            time_type: 0,
            course_id: teacher_id,
            type: 1,
            resolved: (data) => {
                if (!visible) return
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getTeacherAsks({
            begin_tim: begin_time,
            end_time: end_time,
            teacher_id: '',
            time_type: 0,
            course_id: teacher_id,
            type: 1,
            resolved: (data) => {
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                setLoading(false)
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='课程试卷数据情况分析'
            extra={
                <>
                    <Input size='small' placeholder='请输入课程Id' style={{ width: '120px' }} value={teacher_id} onChange={(e) => {
                        setTeacherId(e.target.value)
                    }} />
                    <Filter showTimeType={false} hasSeason={false} onChange={(data) => {
                        setAtime(data)
                    }} />
                    <Button size='small' onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
        </Card>
    )
}
export const UserAge = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        actions.getUserAges({
            resolved: (data) => {
                if (!visible) return
                const map = { '0-10': data['0-10'], '10-20': data['10-20'], '20-30': data['20-30'], '30-40': data['30-40'], '40-50': data['40-50'], '50-60': data['50-60'], '60-70': data['60-70'], '70-80': data['70-80'], '80-90': data['80-90'], '90-100': data['90-100'] }
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    return (

        <Card loading={loading} bordered={false} size='small' title='用户年龄层次结构'
            extra={
                <>
                </>}
        >

            <PieChart
                data={data || []}
                title={{
                    visible: false,
                    text: ''
                }}
                description={{
                    visible: false,
                    text: '',
                }}
                radius={0.6}
                angleField='value'
                colorField='type'
                label={{
                    visible: true,
                    type: 'outer',
                    offset: 20,
                }}
            />
        </Card>
    )
}
export const Shouyi = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    // const [timeType, setTimeType] = useState(0)
    const [timeType, setTimeType] = useState(0)
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState('')
    const [itype, setItype] = useState(-1)
    const [ctype, setCtype] = useState(-1)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        // const begin_time = atime[0].format('YYYY-MM-DD') || ''
        // const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getShouyi({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            teacher_id: userId,
            itype: itype,
            action: '',
            resolved: (data) => {
                if (!visible) return
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [itype, atime])
    const onOk = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        // const begin_time = atime[0].format('YYYY-MM-DD') || ''
        // const end_time = atime[1].format('YYYY-MM-DD') || ''
        setLoading(true)
        actions.getShouyi({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            teacher_id: userId,
            itype: itype,
            action: '',
            resolved: (data) => {
                if (!visible) return
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                // setCtype(itype)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    const onExport = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        // const begin_time = atime[0].format('YYYY-MM-DD') || ''
        // const end_time = atime[1].format('YYYY-MM-DD') || ''
        setLoading(true)
        actions.getShouyis({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            teacher_id: userId,
            itype: itype,
            action: 'export',
            resolved: (data) => {
                const { address, adress } = data[0]
                const url = address || adress || ''
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address, '_black')
                    }
                })
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    const onExports = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        // const begin_time = atime[0].format('YYYY-MM-DD') || ''
        // const end_time = atime[1].format('YYYY-MM-DD') || ''
        setLoading(true)
        actions.getTeacherShouyi({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            teacher_id: userId,
            itype: itype,
            action: 'export',
            resolved: (data) => {
                const { address, adress } = data
                const url = address || adress || ''
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address, '_black')
                    }
                })
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='讲师收益'
            extra={
                <>
                    <Input value={userId} size='small' placeholder="请输入讲师id" style={{ width: '200px' }} onChange={(e) => { setUserId(e.target.value) }}></Input>
                    <Button style={{ marginRight: '5px' }} size='small' onClick={onOk}>搜索</Button>
                    {/* <Select value={timeType} size='small' style={{ width: '80px' }} onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>最近7天</Select.Option>
                        <Select.Option value={2}>最近一周</Select.Option>
                    </Select> */}
                    <Select value={itype} size='small' style={{ width: '80px' }} onChange={(val) => { setItype(val) }}>
                        <Select.Option value={-1}>全部</Select.Option>
                        <Select.Option value={0}>收益</Select.Option>
                        <Select.Option value={1}>支出</Select.Option>
                    </Select>
                    <Filter showTimeType={true} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />

                    <Button loading={loading} size='small' onClick={onExport}>导出</Button>
                    <Button loading={loading} size='small' onClick={onExports}>明细导出</Button>
                </>}
        >
            {/* {itype == -1 ?
                <PieChart
                    data={data || []}
                    title={{
                        visible: false,
                        text: ''
                    }}
                    description={{
                        visible: false,
                        text: '',
                    }}
                    radius={0.6}
                    angleField='value'
                    colorField='type'
                    label={{
                        visible: true,
                        type: 'outer',
                        offset: 20,
                    }}
                /> : */}
            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
            {/* } */}

        </Card>
    )
}
export const SquadLast = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [squadId, setSquadId] = useState('')
    const [loading, setLoading] = useState(true)
    const { actions } = props

    const onOk = () => {
        let visible = true
        if (!squadId) { message.info({ content: '请输入ID' }); return; }
        if (!parseInt(squadId)) { message.info({ content: 'ID格式不正确' }); return; }
        actions.getSquadlast({
            squad_id: squadId,
            resolved: (data) => {
                if (!visible) return

                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='考试情况统计（请先进行筛选）'
            extra={
                <>
                    <Input value={squadId} placeholder="请输入ID进行筛选" style={{ width: '150px' }} onChange={(e) => { setSquadId(e.target.value) }}></Input>
                    <Button onClick={onOk}>筛选</Button>
                </>}
        >

            <PieChart
                data={data || []}
                title={{
                    visible: false,
                    text: ''
                }}
                description={{
                    visible: false,
                    text: '',
                }}
                radius={0.6}
                angleField='value'
                colorField='type'
                label={{
                    visible: true,
                    type: 'outer',
                    offset: 20,
                }}
            />
        </Card>
    )
}
export const SquadPractise = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [squadId, setSquadId] = useState('')
    const [loading, setLoading] = useState(true)
    const { actions } = props

    const onOk = () => {
        let visible = true
        if (!squadId) { message.info({ content: '请输入ID' }); return; }
        if (!parseInt(squadId)) { message.info({ content: 'ID格式不正确' }); return; }
        actions.getSquadpractise({
            squadId: squadId,
            resolved: (data) => {
                if (!visible) return

                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='练习情况统计（请先进行筛选）'
            extra={
                <>
                    <Input value={squadId} placeholder="请输入ID进行筛选" style={{ width: '150px' }} onChange={(e) => { setSquadId(e.target.value) }}></Input>
                    <Button onClick={onOk}>筛选</Button>
                </>}
        >

            <PieChart
                data={data || []}
                title={{
                    visible: false,
                    text: ''
                }}
                description={{
                    visible: false,
                    text: '',
                }}
                radius={0.6}
                angleField='value'
                colorField='type'
                label={{
                    visible: true,
                    type: 'outer',
                    offset: 20,
                }}
            />
        </Card>
    )
}
export const ReturnResons = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        actions.getReturnReson({
            action: '',
            resolved: (data) => {
                // if (!visible) return
                const map = data['退款原因比例']
                setData(Object.keys(map).map(ele => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    return (

        <Card loading={loading} bordered={false} size='small' title='退货原因分析'
            extra={
                <>
                </>}
        >

            <PieChart
                data={data || []}
                title={{
                    visible: false,
                    text: ''
                }}
                description={{
                    visible: false,
                    text: '',
                }}
                radius={0.6}
                angleField='value'
                colorField='type'
                label={{
                    visible: true,
                    type: 'outer',
                    offset: 20,
                }}
            />
        </Card>
    )
}
export const Revenues = (props) => {
    const [data, setData] = useState([])
    const [val, setVal] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [region_id, setRegion] = useState(0)
    const [regions, setRegions] = useState([])
    const { actions } = props

    useEffect(() => {
        let visible = true
        // const begin_time = atime[0].format('YYYY-MM-DD') || ''
        // const end_time = atime[1].format('YYYY-MM-DD') || ''
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getRevenues({
            begin_time: begin_time,
            end_time: end_time,
            time_type: time_type,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                let val = data['月度退款金额']
                let vas = Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] }))
                vas = vas.filter((itm, idx) => idx < 3)
                setData(vas)
                setVal(Object.keys(val).map((ele, index) => ({ type: ele, value: val[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getRevenues({
            begin_time: begin_time,
            end_time: end_time,
            time_type: time_type,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                let val = data['月度退款金额']
                setData(Object.keys(map).map((ele, index) => (index < 3 ? { type: ele, value: map[ele] } : { type: Object.keys(val)[0], value: val[Object.keys(val)[0]] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='财务看板数据'
            extra={
                <>
                    {/* <DatePicker.RangePicker size='small' value={atime} allowClear={false} className='m_2' onChange={(val, dataString) => {
                        setAtime(val)
                    }} disabledDate={val => val > moment()}></DatePicker.RangePicker> */}
                    <Filter showTimeType={true} hasSeason={false} onChange={(data) => {
                        setAtime(data)
                    }} />
                    <Select size='small' value={auth} style={{ width: '90px' }} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegion(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button size='small' onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
            <Chart height={400} autoFit data={val} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
        </Card>
    )
}
export const StaticOrder = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getStaticOrders({
            begin_time: begin_time,
            end_time: end_time,
            time_type: time_type,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getStaticOrders({
            begin_time: begin_time,
            end_time: end_time,
            time_type: time_type,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='课程订单分析'
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button size='small' onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const MessageBacks = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getMessageBacks({
            begin_time: begin_time,
            end_time: end_time,
            time_type: time_type,
            is_auth: auth,
            region_id: region_id,
            messageId: 0,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getMessageBacks({
            begin_time: begin_time,
            end_time: end_time,
            time_type: time_type,
            is_auth: auth,
            region_id: region_id,
            messageId: 0,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='消息看板'
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button size='small' onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const LivePerson = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(0)
    const [courseId, setCourseId] = useState('')
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        let id = 0
        if (!courseId) {
            id = 0
        } else {
            id = courseId
        }
        actions.getLivePerson({
            courseId: id,
            type: auth,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        let id = 0
        if (!courseId) {
            id = 0
        } else {
            id = courseId
        }
        setLoading(true)
        actions.getLivePerson({
            courseId: id,
            type: auth,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='消息看板'
            extra={
                <>
                    <Input value={courseId} placeholder='请输入直播间id' size='small' style={{ width: '120px' }} onChange={(e) => {
                        setCourseId(e.target.value)
                    }} />
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={0}>性别</Select.Option>
                        <Select.Option value={1}>年龄</Select.Option>
                        <Select.Option value={2}>地域</Select.Option>
                    </Select>
                    <Button size='small' onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const LiveKeyword = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(0)
    const [courseId, setCourseId] = useState('')
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    // useEffect(() => {
    //     let visible = true
    //     const { timeType: time_type, begin_time, end_time } = atime
    //     let id = 0
    //     if(!courseId){
    //         id=0
    //     }else{
    //         id=courseId
    //     }
    //     actions.getLivePerson({
    //         courseId:id,
    //         type:auth,
    //         resolved: (data) => {
    //             // if (!visible) return
    //             const map = data
    //             setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
    //             setLoading(false)
    //         },
    //         rejected: (data) => {
    //             message.error(JSON.stringify(data))
    //         }
    //     })
    //     return () => visible = false
    // }, [])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        if (!courseId) { message.info({ content: '请输入直播间id' }); return; }
        let id = 0
        if (!courseId) {
            id = 0
        } else {
            id = courseId
        }
        setLoading(true)
        actions.getLiveKeyword({
            courseId: id,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='消息看板'
            extra={
                <>
                    <Input value={courseId} placeholder='请输入直播间id' size='small' style={{ width: '120px' }} onChange={(e) => {
                        setCourseId(e.target.value)
                    }} />
                    <Button size='small' onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const ShopOrder = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getShopOrders({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    return (

        <Card loading={loading} bordered={false} size='small' title='商城订单分析'
            extra={
                <>
                    <Select value={timeType} style={{ width: '80px' }} onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>最近7天</Select.Option>
                        <Select.Option value={2}>最近一周</Select.Option>
                    </Select>
                    <DatePicker.RangePicker size='small' value={atime} allowClear={false} className='m_2' onChange={(val, dataString) => {
                        setAtime(val)
                    }} disabledDate={val => val > moment()}></DatePicker.RangePicker>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const WithOrder = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: moment().subtract('days', 30).format('YYYY-MM-DD'), end_time: moment().format('YYYY-MM-DD') })
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getWithdrawOrders({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getWithdrawOrders({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='提现分析'
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Daystatic = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getDaystatic({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOks = () => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getDaystatic({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='每日签到'
            extra={
                <>
                    {/* <Select value={timeType} style={{width:'80px'}} onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>最近7天</Select.Option>
                        <Select.Option value={2}>最近一周</Select.Option>
                    </Select> */}
                    <DatePicker.RangePicker size='small' value={atime} allowClear={false} className='m_2' onChange={(val, dataString) => {
                        setAtime(val)
                    }} disabledDate={val => val > moment()}></DatePicker.RangePicker>
                    <Button onClick={onOks}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Daylasting = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getDaylasting({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOks = () => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getDaylasting({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='连续签到'
            extra={
                <>
                    {/* <Select value={timeType} style={{width:'80px'}} onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>最近7天</Select.Option>
                        <Select.Option value={2}>最近一周</Select.Option>
                    </Select> */}
                    <DatePicker.RangePicker size='small' value={atime} allowClear={false} className='m_2' onChange={(val, dataString) => {
                        setAtime(val)
                    }} disabledDate={val => val > moment()}></DatePicker.RangePicker>
                    <Button onClick={onOks}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Tixian = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: moment().subtract('days', 30).format('YYYY-MM-DD'), end_time: moment().format('YYYY-MM-DD') })
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        setLoading(true)
        actions.getTixian({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getTixian({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='提现排行'
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button className='m_2' loading={loading} size={'small'} onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Niandus = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getNiandus({
            billd: 0,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    return (

        <Card loading={loading} bordered={false} size='small' title='年度账单'
            extra={
                <>

                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const ZhongUser = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 365).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 365), moment()])
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getZhongUser({
            type: timeType,
            activity_id: 1,
            begin_time: begin_time,
            end_time: end_time,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getZhongUser({
            type: timeType,
            activity_id: 1,
            begin_time: begin_time,
            end_time: end_time,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='中奖用户概况'
            extra={
                <>
                    <Select value={timeType} size='small' style={{ width: '80px' }} onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={0}>认证</Select.Option>
                        <Select.Option value={1}>等级</Select.Option>
                        <Select.Option value={2}>性别</Select.Option>
                        <Select.Option value={3}>年龄阶段</Select.Option>
                        <Select.Option value={4}>省份</Select.Option>
                    </Select>
                    <DatePicker.RangePicker size='small' value={atime} allowClear={false} className='m_2' onChange={(val, dataString) => {
                        setAtime(val)
                    }} disabledDate={val => val > moment()}></DatePicker.RangePicker>
                    <Button onClick={onOk} size='small'>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Youer = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getYuer({
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    return (

        <Card loading={loading} bordered={false} size='small' title='金币余额'
            extra={
                <>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Xiaoshou = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().format('YYYY-MM-DD HH:mm'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD HH:mm'))
    const [atime, setAtime] = useState([moment().subtract('days', 1), moment()])
    const [timeType, setTimeType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getXiaoshou({
            beginStr: begin_time,
            endStr: end_time,
            resolved: (data) => {
                // if (!visible) return
                let val = Object.keys(data)[0]
                const map = data[val]
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    return (

        <Card loading={loading} bordered={false} size='small' title='销售分析'
            extra={
                <>
                    {/* <Select value={timeType} style={{width:'80px'}} onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>最近7天</Select.Option>
                        <Select.Option value={2}>最近一周</Select.Option>
                    </Select>
                    <DatePicker.RangePicker size='small' value={atime} allowClear={false} className='m_2' onChange={(val, dataString) => {
                        setAtime(val)
                    }} disabledDate={val => val > moment()}></DatePicker.RangePicker> */}
                    {/* <DatePicker value={beginTime} className='m_2' onChange={(val)=>{
                        setBeginTime(val)
                        setEndTime(val)
                    }}>

                    </DatePicker> */}
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Alives = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getAlives({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            user_id: userId,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: Number(map[ele].replace('天', '')) })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getAlives({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            user_id: userId,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='生命周期'
            extra={
                <>
                    <Input value={userId} placeholder="请输入用户id" style={{ width: '200px' }} onChange={(e) => { setUserId(e.target.value) }}></Input>
                    <Select value={timeType} style={{ width: '80px' }} onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>最近7天</Select.Option>
                        <Select.Option value={2}>最近一周</Select.Option>
                    </Select>
                    <DatePicker.RangePicker size='small' value={atime} allowClear={false} className='m_2' onChange={(val, dataString) => {
                        setAtime(val)
                    }} disabledDate={val => val > moment()}></DatePicker.RangePicker>
                    <Button onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Guanzhu = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getGuanzhu({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getGuanzhu({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            action: '',
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    const onExport = () => {
        setLoading(true)
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getGuanzhu({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            action: 'export',
            resolved: (data) => {
                const { address, adress } = data
                const url = address || adress || ''
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address, '_black')
                    }
                })
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='讲师关注'
            extra={
                <>
                    {/* <Select value={timeType} style={{ width: '80px' }} onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>最近7天</Select.Option>
                        <Select.Option value={2}>最近一周</Select.Option>
                    </Select> */}
                    <DatePicker.RangePicker size='small' value={atime} allowClear={false} className='m_2' onChange={(val, dataString) => {
                        setAtime(val)
                    }} disabledDate={val => val > moment()}></DatePicker.RangePicker>
                    <Button size='small' onClick={onOk}>筛选</Button>
                    <Button loading={loading} className='m_2' onClick={onExport}>导出</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Kaoshi = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getKaoshi({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            teacher_id: userId,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        let visible = true
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getKaoshi({
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            teacher_id: userId,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='讲师课程考试'
            extra={
                <>
                    <Input value={userId} size='small' placeholder="请输入讲师id" style={{ width: '200px' }} onChange={(e) => { setUserId(e.target.value) }}></Input>
                    {/* <Select value={timeType} style={{ width: '80px' }} onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>最近7天</Select.Option>
                        <Select.Option value={2}>最近一周</Select.Option>
                    </Select> */}
                    <DatePicker.RangePicker size='small' value={atime} allowClear={false} className='m_2' onChange={(val, dataString) => {
                        setAtime(val)
                    }} disabledDate={val => val > moment()}></DatePicker.RangePicker>
                    <Button size='small' onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Xianxia = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        actions.getXianxia({
            squadId: userId,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        let visible = true
        setLoading(true)
        actions.getXianxia({
            squadId: userId,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    const onExport = () => {
        let visible = true
        if (!userId) { message.info({ content: '请输入线下课id' }); return; }
        setLoading(true)
        actions.getSquadDetails({
            squad_id: userId,
            resolved: (data) => {
                window.open(data.address.address)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                setLoading(false)
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='线下课程报名'
            extra={
                <>
                    <Input value={userId} placeholder="请输入线下课程id" style={{ width: '200px' }} onChange={(e) => { setUserId(e.target.value) }}></Input>
                    <Button onClick={onOk}>筛选</Button>
                    <Button loading={loading} onClick={onExport}>导出</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const KechenChuXi = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        actions.getKechenChuXi({
            squadId: userId,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        let visible = true
        actions.getKechenChuXi({
            squadId: userId,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='课程出席统计'
            extra={
                <>
                    <Input value={userId} placeholder="请输入培训班id" style={{ width: '200px' }} onChange={(e) => { setUserId(e.target.value) }}></Input>
                    <Button onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const JianKon = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        actions.getJianKon({
            squadId: userId,
            resolved: (data) => {
                // if (!visible) return
                let map = data
                delete map.address
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        let visible = true
        setLoading(true)
        actions.getJianKon({
            squadId: userId,
            resolved: (data) => {
                // if (!visible) return
                let map = data
                delete map.address
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    const onExport = () => {
        let visible = true
        setLoading(true)
        actions.getJianKon({
            squadId: userId,
            resolved: (data) => {
                // if (!visible) return
                window.open(data.address)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='活动过程监控'
            extra={
                <>
                    <Input value={userId} placeholder="请输入培训班id" style={{ width: '200px' }} onChange={(e) => { setUserId(e.target.value) }}></Input>
                    <Button onClick={onOk}>筛选</Button>
                    <Button loading={loading} onClick={onExport}>导出</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const ActMessage = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [loads, setLoads] = useState(false)
    const { actions } = props

    const onOk = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        if (!userId) { message.info({ content: '请填写活动id' }); return }
        setLoading(true)
        actions.getActMessage({
            action: '0',
            activityId: userId,
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    const onExport = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        if (!userId) { message.info({ content: '请填写活动id' }); return }
        setLoads(true)
        actions.getActMessage({
            action: 'export',
            activityId: userId,
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            resolved: (data) => {
                setLoads(false)
                window.open(data.address)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='活动消息发送情况'
            extra={
                <>
                    <Input value={userId} size='small' placeholder="活动ID" style={{ width: '120px' }} onChange={(e) => { setUserId(e.target.value) }}></Input>
                    <Filter showTimeType={false} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Button size='small' onClick={onOk}>筛选</Button>
                    <Button size='small' loading={loads} onClick={onExport}>用户明细导出</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Actin = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [loads, setLoads] = useState(false)
    const [url, setUrl] = useState('')
    const { actions } = props

    const onOk = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        if (!userId) { message.info({ content: '请填写活动id' }); return }
        setLoading(true)
        actions.getActins({
            activityId: userId,
            begin_time: begin_time,
            end_time: end_time,
            time_type: 0,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                let lst = []
                Object.keys(map).map((ele, index) => {
                    if (ele !== 'address') {
                        let vas = { type: ele, value: map[ele] }
                        lst.push(vas)
                    }
                })
                setData(lst)
                setLoading(false)
                setUrl(data.address)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    const onExport = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        if (!userId) { message.info({ content: '请填写活动id' }); return }
        window.open(url)
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='活动参与情况'
            extra={
                <>
                    <Input value={userId} size='small' placeholder="活动ID" style={{ width: '120px' }} onChange={(e) => { setUserId(e.target.value) }}></Input>
                    <Filter showTimeType={false} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Button size='small' onClick={onOk}>筛选</Button>
                    <Button size='small' loading={loads} onClick={onExport}>导出</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const ActinUser = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ begin_time: '', end_time: '' })
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loads, setLoads] = useState(false)
    const [url, setUrl] = useState('')
    const { actions } = props
    useEffect(() => {
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
    }, [])
    const onOk = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        if (!userId) { message.info({ content: '请填写活动id' }); return }
        setLoads(true)
        actions.getActinsUser({
            activityId: userId,
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: 0,
            resolved: (data) => {
                window.open(data.address)
                setLoads(false)

            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    const onExport = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        if (!userId) { message.info({ content: '请填写活动id' }); return }
        window.open(url)
    }
    return (

        <Card bordered={false} size='small' title='活动参与情况'
            extra={
                <>
                    <Input value={userId} size='small' placeholder="活动ID" style={{ width: '120px' }} onChange={(e) => { setUserId(e.target.value) }}></Input>
                    <Filter showTimeType={false} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未知</Select.Option>
                        <Select.Option value={1}>男</Select.Option>
                        <Select.Option value={2}>女</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button size='small' loading={loads} onClick={onOk}>导出</Button>
                </>}
        >

        </Card>
    )
}
export const WeiJing = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '2020-01-01', end_time: moment().format('YYYY-MM-DD') })
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getWeiJing({
            begin_time: begin_time,
            end_time: end_time,
            time_type: time_type,
            userId: userId,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        setLoading(true)
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getWeiJing({
            begin_time: begin_time,
            end_time: end_time,
            time_type: time_type,
            userId: userId,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='违禁分析'
            extra={
                <>
                    <Input value={userId} size='small' placeholder="请输入用户id" style={{ width: '120px' }} onChange={(e) => { setUserId(e.target.value) }}></Input>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Button size='small' onClick={onOk}>筛选</Button>
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Zhibo = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        actions.getZhibo({
            regionId: userId,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] || 0 })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        let visible = true
        actions.getZhibo({
            regionId: userId,
            resolved: (data) => {
                // if (!visible) return
                const map = data
                setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] || 0 })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='直播统计'
            extra={
                <>
                    {/* <Select style={{width:'120px'}} value={userId} onChange={(e)=>{setUserId(e)}}>
                    <Option value={0}>全部</Option>
                    <Option value={2}>安徽</Option>
                    <Option value={1685}>北京市</Option>
                    <Option value={2034}>重庆</Option>
                    <Option value={2919}>福建</Option>
                    <Option value={4198}>甘肃</Option>
                    <Option value={5712}>广东</Option>
                    <Option value={7563}>广西</Option>
                    <Option value={8956}>贵州</Option>
                    <Option value={10210}>海南</Option>
                    <Option value={10287}>河北</Option>
                    <Option value={12768}>黑龙江</Option>
                    <Option value={14702}>河南</Option>
                    <Option value={17381}>湖北</Option>
                    <Option value={18893}>湖南</Option>
                    <Option value={21493}>江苏</Option>
                    <Option value={23098}>江西</Option>
                    <Option value={24988}>吉林</Option>
                    <Option value={26075}>辽宁</Option>
                    <Option value={27752}>内蒙古</Option>
                    <Option value={29123}>宁夏</Option>
                    <Option value={29414}>青海</Option>
                    <Option value={29883}>山东</Option>
                    <Option value={31861}>上海</Option>
                    <Option value={32110}>山西</Option>
                    <Option value={33692}>陕西</Option>
                    <Option value={35251}>四川</Option>
                    <Option value={40079}>天津</Option>
                    <Option value={40403}>新疆</Option>
                    <Option value={41866}>西藏</Option>
                    <Option value={42634}>云南</Option>
                    <Option value={44146}>浙江</Option>
                </Select>
                    <Button onClick={onOk}>筛选</Button> */}
                </>}
        >

            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const Manyi = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    // const [timeType, setTimeType] = useState(0)
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [scoreType, setScoreTypeh] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [map, setMap] = useState([])
    const [course, setCourse] = useState([])
    const [lst, setLst] = useState([])
    const { actions } = props

    useEffect(() => {
        let visible = true
        // const begin_time = atime[0].format('YYYY-MM-DD') || ''
        // const end_time = atime[1].format('YYYY-MM-DD') || ''
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getManyi({
            scoreType: scoreType,
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            teacher_id: userId,
            action: '',
            resolved: (data) => {
                // if (!visible) return
                if (scoreType == 2) {
                    const map = Object.values(data)[0]
                    setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                    delete map['学习人数']
                    delete map['评分人数']
                    setLst(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                    setLoading(false)
                } else {
                    const map = data
                    setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                    delete map['学习人数']
                    delete map['评分人数']
                    setLst(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                    setLoading(false)
                }

            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, scoreType, timeType])
    const onOk = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        // const begin_time = atime[0].format('YYYY-MM-DD') || ''
        // const end_time = atime[1].format('YYYY-MM-DD') || ''
        setLoading(true)
        if (scoreType == 1) {
            if (!userId) { message.info({ content: '请输入讲师id' }); return; }
            actions.getTeacherInfos({
                id: userId,
                resolved: (res) => {
                    setLoading(false)
                    if (res.courses.length > 0) {
                        setData(res.courses.map(ele => ({
                            type: ele.courseName,
                            value: ele.score
                        })))
                    }
                },
                rejected: (err) => {
                    message.error(JSON.stringify(data))
                }
            })
        } else {
            actions.getManyi({
                scoreType: scoreType,
                begin_time: begin_time,
                end_time: end_time,
                time_type: timeType,
                teacher_id: userId,
                action: '',
                resolved: (data) => {
                    // if (!visible) return

                    if (scoreType == 1) {
                        var course = Object.keys(data)
                        var maps = Object.values(data)
                        let map = []
                        maps.map(itm => {
                            let lst = []
                            let item = itm
                            delete item['学习人数']
                            delete item['评分人数']
                            Object.keys(item).map(itm => {
                                let vas = { type: itm, value: item[itm] }
                                lst = lst.concat(vas)
                            })
                            map = map.concat(JSON.stringify(lst))
                        })
                        setMap(map)
                        setCourse(course)
                        setLoading(false)
                    } else if (scoreType == 2) {
                        var map = Object.values(data)[0]
                        setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                        delete map['学习人数']
                        delete map['评分人数']
                        setLst(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                        setLoading(false)
                    } else {
                        var map = data
                        setData(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                        delete map['学习人数']
                        delete map['评分人数']
                        setLst(Object.keys(map).map((ele, index) => ({ type: ele, value: map[ele] })))
                        setLoading(false)
                    }


                },
                rejected: (data) => {
                    message.error(JSON.stringify(data))
                }
            })
        }
        return () => visible = false
    }
    const onExport = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        // const begin_time = atime[0].format('YYYY-MM-DD') || ''
        // const end_time = atime[1].format('YYYY-MM-DD') || ''
        // if (scoreType == 1 && !userId) {
        //     message.info({ content: '请填写讲师id' }); return;
        // }
        setLoading(true)
        actions.getManyi({
            scoreType: scoreType,
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            teacher_id: userId,
            action: 'export',
            resolved: (data) => {
                window.open(data.address)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                setLoading(false)
            }
        })
        return () => visible = false
    }
    return (

        <Card loading={loading} bordered={false} size='small' title='讲师满意度'
            extra={
                <>
                    <Input style={{ marginLeft: '5px' }} value={userId} size='small' placeholder="请输入讲师id" style={{ width: '200px' }} onChange={(e) => { setUserId(e.target.value) }}></Input>
                    <Button style={{ marginRight: '5px' }} size='small' onClick={onOk}>搜索</Button>
                    <Select value={scoreType} size='small' style={{ width: '120px' }} onChange={(val) => { setScoreTypeh(val) }}>
                        <Select.Option value={0}>全部</Select.Option>
                        {/* <Select.Option value={1}>各课程满意度</Select.Option> */}
                        <Select.Option value={2}>各讲师满意度</Select.Option>
                    </Select>
                    {/* <Select value={timeType} size='small' style={{ width: '80px' }} onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>最近7天</Select.Option>
                        <Select.Option value={2}>最近一周</Select.Option>
                    </Select> */}
                    <Filter showTimeType={true} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Button size='small' loading={loading} onClick={onExport}>导出</Button>
                </>}
        >


            {
                scoreType == 1 ?
                    <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                        <Axis name="value" visible={true} />
                        <Axis name="type" visible={true} />
                        <Geom
                            shape='smooth'
                            type="line"
                            position="type*value"
                            color="l(90) 0:#3DA4FF 1:#97ceff"
                        />
                        <Legend position='top' itemName={{
                            style: {
                                fill: "#333"
                            }
                        }} />
                        <Tooltip shared showCrosshairs />
                        <Slider end={1} height={25} />
                    </Chart>
                    :
                    <Card loading={loading} bordered={false} size='small' title=''
                        extra={
                            <>

                            </>}
                    >
                        <PieChart
                            data={lst || []}
                            title={{
                                visible: false,
                                text: ''
                            }}
                            description={{
                                visible: false,
                                text: '',
                            }}
                            radius={0.6}
                            angleField='value'
                            colorField='type'
                            label={{
                                visible: true,
                                type: 'outer',
                                offset: 20,
                            }}
                        />
                        <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                            <Axis name="value" visible={true} />
                            <Axis name="type" visible={true} />
                            <Geom
                                shape='smooth'
                                type="interval"
                                label={["value", { style: { fill: '#535353' } }]}
                                color='type'
                                position="type*value"
                            />
                            <Legend position='top' itemName={{
                                style: {
                                    fill: "#333"
                                }
                            }} />
                            <Tooltip shared showCrosshairs />
                            <Slider end={1} height={25} />
                        </Chart>
                    </Card>
            }

        </Card>
    )
}
export const Manyis = (props) => {
    const [data, setData] = useState([])
    const [datas, setDatas] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 30).format('YYYY-MM-DD'))
    const [endTime, setEndTime] = useState(moment().format('YYYY-MM-DD'))
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    // const [timeType, setTimeType] = useState(0)
    const [timeType, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [scoreType, setScoreTypeh] = useState(1)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(false)
    const [loadings, setLoadings] = useState(true)
    const [map, setMap] = useState([])
    const [course, setCourse] = useState([])
    const [lst, setLst] = useState([])
    const { actions } = props
    const [ress, setress] = useState(null)
    const [page, setpage] = useState(0)
    const [pages, setpages] = useState(1)
    useEffect(() => {
        let visible = true
        actions.getcourseExcelLink({
            action: 0,
            section: 'teacherCourseExcel',
            resolved: (res) => {
                console.log(res)
                if (res.address) {
                    setress(res)
                }
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime

        setLoading(true)
        if (scoreType == 1) {
            // if (!userId) { message.info({ content: '请输入讲师id' }); return; }
            actions.getTeacherInfos({
                id: userId,
                page: page,
                resolved: (res) => {
                    setLoading(false)
                    setLoadings(false)
                    if (!userId) {
                        if (res.data.length > 0) {
                            setDatas(res.data)
                            setData([])
                            setpages(res.pages)
                        }
                    } else {
                        if (res.courses) {
                            let lst = []
                            res.courses.map(ele => {
                                lst.push({
                                    type: ele.courseName,
                                    value: ele.score
                                })
                            })
                            setData(lst)
                            setDatas([])
                        }
                    }
                },
                rejected: (err) => {
                    message.error(JSON.stringify(data))
                }
            })

        }
        return () => visible = false
    }
    const onExport = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        // const begin_time = atime[0].format('YYYY-MM-DD') || ''
        // const end_time = atime[1].format('YYYY-MM-DD') || ''
        // if (scoreType == 1 && !userId) {
        //     message.info({ content: '请填写讲师id' }); return;
        // }
        let ben = new Date(begin_time).getTime()
        let end = new Date(end_time).getTime()
        setLoading(true)
        actions.getManyi({
            scoreType: scoreType,
            begin_time: begin_time,
            end_time: end_time,
            time_type: timeType,
            teacher_id: userId,
            action: 'export',
            resolved: (data) => {
                window.open(data.address)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                setLoading(false)
            }
        })
        if (!userId && end - ben > 15552000000 * 2) {
            message.info({ content: '如果数据过大，在加载中不能展示，请耐心等待两分钟，如下侧未出现新的下载按钮,请再次点击筛选，待出现新按钮再点击下载（等待过程中可浏览其他页面）' })
            setTimeout(() => {
                actions.getcourseExcelLink({
                    action: 0,
                    section: 'teacherCourseExcel',
                    resolved: (res) => {
                        console.log(res)
                    }
                })
            }, 1000);
        }
        return () => visible = false
    }
    const onOuts = () => {
        actions.getcourseExcelLink({
            action: 1,
            section: 'teacherCourseExcel',
        })
        setress(null)
        window.open(ress.address)
    }
    const onXia = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setpage(page + 1)
        setLoading(true)
        if (scoreType == 1) {
            // if (!userId) { message.info({ content: '请输入讲师id' }); return; }
            actions.getTeacherInfos({
                id: userId,
                page: page + 1,
                resolved: (res) => {
                    setLoading(false)
                    setLoadings(false)
                    if (!userId) {
                        if (res.data.length > 0) {
                            setDatas(res.data)
                            setData([])
                            setpages(res.pages)
                        }
                    } else {
                        if (res.courses) {
                            let lst = []
                            res.courses.map(ele => {
                                lst.push({
                                    type: ele.courseName,
                                    value: ele.score
                                })
                            })
                            setData(lst)
                            setDatas([])
                        }
                    }
                },
                rejected: (err) => {
                    message.error(JSON.stringify(data))
                }
            })

        }
        return () => visible = false
    }
    const onSha = () => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        setpage(page - 1)
        setLoading(true)
        if (scoreType == 1) {
            // if (!userId) { message.info({ content: '请输入讲师id' }); return; }
            actions.getTeacherInfos({
                id: userId,
                page: page - 1,
                resolved: (res) => {
                    setLoading(false)
                    setLoadings(false)
                    if (!userId) {
                        if (res.data.length > 0) {
                            setDatas(res.data)
                            setData([])
                            setpages(res.pages)
                        }
                    } else {
                        if (res.courses) {
                            let lst = []
                            res.courses.map(ele => {
                                lst.push({
                                    type: ele.courseName,
                                    value: ele.score
                                })
                            })
                            setData(lst)
                            setDatas([])
                        }
                    }
                },
                rejected: (err) => {
                    message.error(JSON.stringify(data))
                }
            })

        }
        return () => visible = false
    }
    return (

        <Card bordered={false} size='small' title='课程满意度'
            extra={
                <>
                    <Input loading={loading} style={{ marginLeft: '5px' }} value={userId} size='small' placeholder="请输入讲师id" style={{ width: '200px' }} onChange={(e) => { setUserId(e.target.value) }}></Input>

                    {/* <Select value={scoreType} size='small' style={{ width: '120px' }} onChange={(val) => { setScoreTypeh(val) }}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>各课程满意度</Select.Option>
                        <Select.Option value={2}>各讲师满意度</Select.Option>
                    </Select> */}
                    {/* <Select value={timeType} size='small' style={{ width: '80px' }} onChange={(val) => { setTimeType(val) }}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>最近7天</Select.Option>
                        <Select.Option value={2}>最近一周</Select.Option>
                    </Select> */}
                    <Filter showTimeType={true} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    <Button style={{ marginRight: '5px' }} size='small' onClick={onOk}>筛选</Button>
                    <Button size='small' loading={loading} onClick={onExport}>导出</Button>
                </>}
        >
            {
                ress ?
                    <div style={{ textAlign: 'center', width: '100%', marginTop: '200px' }}>
                        <Button onClick={onOuts}>
                            {ress.time}导出
                        </Button>
                    </div>
                    :
                    <div>
                        {
                            loadings ?
                                <div style={{ textAlign: 'center', width: '100%', marginTop: '200px' }}>请先进行筛选</div>
                                :
                                <div>
                                    {
                                        data.length > 0 ?
                                            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                                                <Axis name="value" visible={true} />
                                                <Axis name="type" visible={true} />
                                                <Geom
                                                    shape='smooth'
                                                    type="interval"
                                                    label={["value", { style: { fill: '#535353' } }]}
                                                    color='type'
                                                    position="type*value"
                                                />
                                                <Legend position='top' itemName={{
                                                    style: {
                                                        fill: "#333"
                                                    }
                                                }} />
                                                <Tooltip shared showCrosshairs />
                                                <Slider end={1} height={25} />
                                            </Chart> : null
                                    }
                                    {
                                        datas.length > 0 ?
                                            <div>
                                                {
                                                    datas.map(item => {
                                                        let lst = []
                                                        if (item.courses) {
                                                            item.courses.map(itm => {
                                                                lst.push({
                                                                    type: itm.courseName,
                                                                    value: itm.score
                                                                })
                                                            })
                                                        }
                                                        return (
                                                            <div>
                                                                <Chart height={400} autoFit data={lst} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                                                                    <Axis name="value" visible={true} />
                                                                    <Axis name="type" visible={true} />
                                                                    <Geom
                                                                        shape='smooth'
                                                                        type="interval"
                                                                        label={["value", { style: { fill: '#535353' } }]}
                                                                        color='type'
                                                                        position="type*value"
                                                                    />
                                                                    <Legend position='top' itemName={{
                                                                        style: {
                                                                            fill: "#333"
                                                                        }
                                                                    }} />
                                                                    <Tooltip shared showCrosshairs />
                                                                    <Slider end={1} height={25} />
                                                                </Chart>
                                                                <div style={{ textAlign: 'center', width: '100%', marginTop: '5px' }}>{item.teacherName}</div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <div style={{ textAlign: 'center', width: '100%', marginTop: '5px' }}>
                                                    {page == 0 ? null : <Button onClick={onSha}>上一页</Button>}
                                                    {page < pages ? <Button onClick={onXia}>下一页</Button> : null}
                                                </div>
                                            </div>
                                            : null
                                    }
                                </div>

                        }
                    </div>
            }

        </Card>
    )
}
export const UserDuration = (props) => {
    const [data, setData] = useState('')
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        if (!Array.isArray(atime)) return;
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getUserDuration({
            begin_time, end_time, is_auth: auth,
            resolved: (data) => {
                if (!visible) return
                // const map = {manusers:'男性',womanusers:'女性'}
                setData(data.averageduration)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth])
    const onExport = () => {
        if (!Array.isArray(atime)) return;
        setLoading(true)
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getUserDuration({
            begin_time,
            end_time,
            is_auth: auth,
            action: 'export',
            resolved: (data) => {
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} bordered={false} size='small' title='在线时长分析'
            extra={
                <>
                    <DatePicker.RangePicker size='small' value={atime} allowClear={false} className='m_2' onChange={(val, dataString) => {
                        setAtime(val)
                    }} disabledDate={val => val > moment()}></DatePicker.RangePicker>
                    <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    <Button size="small" onClick={onExport} loading={loading}>导出</Button>
                </>
            }
        >
            平均在线：<Tag>{data + '分钟'}</Tag>
        </Card>
    )
}
export const UserOnlineTime = (props) => {
    const [data, setData] = useState([])
    const [beginTime, setBeginTime] = useState(moment().subtract('days', 1))
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const begin_time = beginTime.format('YYYY-MM-DD') || ''
        actions.getUserTime({
            is_auth: auth,
            begin_time: begin_time,
            resolved: (data) => {
                if (!visible) return
                setData(Object.keys(data).map(ele => ({ type: ele, value: data[ele] })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [auth, beginTime])
    const onExport = () => {
        setLoading(true)
        const begin_time = beginTime.format('YYYY-MM-DD') || ''
        actions.getUserTime({
            begin_time,
            is_auth: auth,
            action: 'export',
            resolved: (data) => {
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} bordered={false} size='small' title='在线时段分布'
            extra={
                <>
                    <DatePicker size='small' allowClear={false} value={beginTime} onChange={(dataString, data) => {
                        setBeginTime(dataString)
                    }} disabledDate={val => val > moment()}></DatePicker>
                    <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    <Button size="small" onClick={onExport} loading={loading}>导出</Button>
                </>}
        >
            <Chart height={400} autoFit data={data || []} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="line"
                    position="type*value"
                    color="l(90) 0:#3DA4FF 1:#97ceff"
                />
                <Legend position='top' />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
        </Card>
    )
}
export const CourseInfo = (props) => {
    const [data, setData] = useState({
        categoryaverage: [],
        pv: [],
        uv: [],
        number: null,
        average: null,
    })
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [type, setType] = useState('categoryaverage')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props
    const onExport = () => {
        if (!Array.isArray(atime)) return;
        setLoading(true)
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''
        actions.getCourseDao({
            action: 'export',
            begin_time: begin_time,
            end_time: end_time,
            resolved: (data) => {
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    useEffect(() => {
        let visible = true
        if (!Array.isArray(atime)) return;
        setLoading(true)
        const begin_time = atime[0].format('YYYY-MM-DD') || ''
        const end_time = atime[1].format('YYYY-MM-DD') || ''

        actions.getStatCourseInfo({
            time_type: 1,
            begin_time,
            end_time,
            is_auth: auth,
            time_type: 0,
            resolved: (data) => {
                console.log(data)
                const { categoryaverage, uv, pv } = data
                if (!visible) return
                data.categoryaverage = Object.keys(categoryaverage).map(ele => ({ type: ele, value: parseInt(categoryaverage[ele]) }))
                data.uv = Object.keys(uv).map(ele => ({ type: ele, value: parseInt(uv[ele]) }))
                data.pv = Object.keys(pv).map(ele => ({ type: ele, value: parseInt(pv[ele]) }))
                setData(data)
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth])
    useEffect(() => {

    }, [type])
    return (

        <Card loading={loading} bordered={false} size='small'
            extra={
                <>
                    {/* <Select value={type} className='m_2' onChange={val => {
                        setType(val)
                    }}>
                        <Select.Option value={'categoryaverage'}>各分类课程平均分</Select.Option>
                        <Select.Option value={'uv'}>各分类课程UV</Select.Option>
                        <Select.Option value={'pv'}>各分类课程PV</Select.Option>
                    </Select> */}
                    <DatePicker.RangePicker value={atime} allowClear={false} className='m_2' onChange={(data, dataString) => {
                        setAtime(data)
                    }} disabledDate={val => val > moment()}></DatePicker.RangePicker>
                    {/* <Select size='small' value={auth} onChange={(val) => { setAuth(val) }} className='m_2'>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select> */}
                    <Button onClick={onExport} loading={loading}>导出</Button>
                </>}
        >
            <div>课程数量：<Tag>{data ? data['number'] : '暂无数据'}</Tag></div>
            <div className='mb_10'>课程总平均分：<Tag>{data ? data['average'] : '暂无数据'}</Tag></div>

            <Chart height={400} autoFit data={data[type]} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    size={20}
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
        </Card>
    )
}
export const CourseRate = (props) => {

    const [atime, setAtime] = useState({ time_type: 0, begin_time: '', end_time: '' })

    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [coursePanel, setCoursePanel] = useState(false)
    const [panelLoading, setPanelLoading] = useState(false)

    const [pageTotal, setPageTotal] = useState(0)
    const [dataSource, setDataSource] = useState([])
    const [courseId, setCourseId] = useState(1)
    const [ctype, setCtype] = useState(0)
    const [courseName, setCourseName] = useState('')
    const [page, setPage] = useState(0)
    const [keyword, setKeyword] = useState('')

    const [courseRate, setCourseRate] = useState([])

    const { actions } = props

    const course_col = [
        { dataIndex: 'courseId', title: 'ID', key: 'courseId', width: 68 },
        { dataIndex: 'courseName', title: '课程名', key: 'courseName', ellipsis: true },
        {
            title: '操作', render: (item, ele) => {
                return <a onClick={() => {
                    setCoursePanel(false)
                    setCourseId(ele.courseId || 1)
                }}>选择</a>
            }
        }
    ]
    const onExport = () => {
        setLoading(true)
        const { time_type, begin_time, end_time } = atime
        actions.getStatCourseSingle({
            time_type,
            course_id: courseId,
            begin_time,
            end_time,
            is_auth: auth,
            action: 'export',
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    useEffect(() => {
        let visible = true
        setPanelLoading(true)
        setDataSource([])
        actions.getCourseList({
            keyword: keyword,
            page: page,
            pageSize: 10,
            category_id: '',
            ctype: ctype,
            resolved: (res) => {
                if (!visible) return
                const { page, total, data } = res

                if (data instanceof Array) {
                    setDataSource(data)
                    setPage(page)
                    setPageTotal(total)

                }
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [ctype, page, keyword])
    useEffect(() => {
        let visible = true
        setLoading(true)
        const { time_type, begin_time, end_time } = atime

        actions.getStatCourseSingle({
            time_type,
            course_id: courseId,
            begin_time,
            end_time,
            is_auth: auth,
            resolved: (data) => {
                if (!visible) return
                const courseRate = {
                    num: data['课程平均分'] || 0,
                    rate: data['讲师表现评分'] || 0
                }
                setCourseRate([courseRate])
                setCourseName(data['课程名称'])
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, courseId])

    return (
        <>

            <Card loading={loading} bordered={false} size='small' title={courseName}
                extra={
                    <>
                        <Button size='small' className='m_2' onClick={() => { setCoursePanel(true) }}>选择课程</Button>
                        <Filter hasSeaon={false} size='small' value={atime} allowClear={false} className='m_2' onChange={(data, dataString) => {
                            setAtime(data)
                        }} disabledDate={val => val > moment()} />
                        <Select size='small' value={auth} onChange={(val) => { setAuth(val) }} className='m_2'>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        <Button size="small" className='m_2' onClick={onExport} loading={loading}>导出</Button>
                    </>}
            >
                <Table size='small' dataSource={courseRate} pagination={false} columns={[
                    { dataIndex: 'num', title: '单门课平均分值', key: 'num' },
                    { dataIndex: 'rate', title: '讲师表现评分', key: 'rate' }
                ]}></Table>
            </Card>
            <Modal loading={panelLoading} title='选择课程' visible={coursePanel} onCancel={() => { setCoursePanel(false) }} onOk={() => { setCoursePanel(false) }}>
                <div className='d_flex'>
                    <Select value={ctype} className='m_2' onChange={(val) => { setPage(0); setCtype(val) }} className='m_2'>
                        <Select.Option value={0}>视频课</Select.Option>
                        <Select.Option value={1}>音频课</Select.Option>
                        <Select.Option value={2}>直播课</Select.Option>
                        <Select.Option value={3}>图文课</Select.Option>
                    </Select>
                    <Input.Search value={keyword} className='m_2' onChange={(e) => setKeyword(e.target.value)}></Input.Search>
                </div>
                <Table size='small' rowKey='courseId' columns={course_col} dataSource={dataSource} pagination={{
                    current: page + 1,
                    total: pageTotal,
                    showQuickJumper: true,
                    onChange: (val) => {
                        setPage(val - 1)
                    },
                    showTotal: (total) => '总共' + total + '条'
                }}></Table>
            </Modal>
        </>
    )
}

export const CourseRelearn = (props) => {
    const [dataSource, setDataSource] = useState([])
    const [dataSourceTimes, setDataSourceTimes] = useState([])
    const [atime, setAtime] = useState({ time_type: 0, begin_time: '', end_time: '' })

    // const [type, setType] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { time_type, begin_time, end_time } = atime
        setLoading(true)

        actions.getStatCourseRelearn({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            resolved: (data) => {
                if (!visible) return
                const { personNum, againTime } = data
                let arr = []//复学次数
                let arrTimes = []//复学人数
                if (personNum && personNum instanceof Array) {

                    let key = ''
                    personNum.map(ele => {
                        key = Object.keys(ele)[0]
                        arr.push({ type: key, value: ele[key], name: '复学人数' })
                    })
                }
                if (againTime && againTime instanceof Array) {

                    let key = ''
                    againTime.map(ele => {
                        key = Object.keys(ele)[0]
                        arrTimes.push({ type: key, value: ele[key], name: '复学次数' })
                    })
                }
                setDataSource(arr)
                setDataSourceTimes(arrTimes)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
                setLoading(false)
            }
        })
        return () => visible = false
    }, [atime, auth])
    const onExport = () => {
        setLoading(true)
        const { time_type, begin_time, end_time } = atime
        actions.getStatCourseRelearn({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            action: 'export',
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} title='全部课程复学人数、复学次数' bordered={false} size='small' bodyStyle={{ padding: 20 }}
            extra={
                <>
                    <Filter hasSeaon={false} size='small' value={atime} allowClear={false} onChange={(data, dataString) => {
                        setAtime(data)
                    }} disabledDate={val => val > moment()} />

                    <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {/* <Button size="small" onClick={onExport} loading={loading}>导出</Button> */}
                </>}
        >
            <Chart height={400} autoFit data={dataSource} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="line"
                    color='name'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
            <Chart className='mt_20' height={400} autoFit data={dataSourceTimes} interactions={['active-region']} padding={[40, 40, 100, 40]} description={{
                visible: true,
                text: '复学次数',
            }}>
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="line"
                    color='name'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>

        </Card>
    )
}
export const CardAvtivity = (props) => {
    const [data, setData] = useState({
        integral: [],
        reward: [],
        count: 0,
    })
    const [type, setType] = useState('reward')
    const [atime, setAtime] = useState({ time_type: 0, begin_time: '', end_time: '' })
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props
    useEffect(() => {
        let visible = true

        setLoading(true)
        const { time_type, begin_time, end_time } = atime
        console.log(time_type, atime)
        actions.getReward({
            time_type,
            type: 'all',
            begin_time,
            end_time,
            is_auth: auth,
            resolved: (data) => {
                if (!visible) return
                const { integral, reward } = data
                data['integral'] = Object.keys(integral).map(ele => ({ type: ele, value: parseInt(integral[ele]) }))
                data['reward'] = Object.keys(reward).map(ele => ({ type: ele, value: parseInt(reward[ele]) }))
                setData(data)
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth])
    useEffect(() => {

    }, [type])
    const onExport = () => {

        setLoading(true)
        const { time_type, begin_time, end_time } = atime
        actions.getReward({
            time_type,
            type: 'all',
            begin_time,
            end_time,
            is_auth: auth,
            action: 'export',
            resolved: (data) => {
                console.log(data)
                console.log(data)
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })

    }
    return (

        <Card loading={loading} bordered={false} size='small' title='翻牌抽奖'
            extra={
                <>
                    <Filter hasSeaon={false} className='m_2 w200' onChange={(data, dataString) => {
                        setAtime(data)
                    }} />
                    {/* <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select> */}
                    <Select size='small' value={type} onChange={(val) => { setType(val) }}>
                        <Select.Option value={'reward'}>中奖数量</Select.Option>
                        <Select.Option value={'integral'}>中奖总额</Select.Option>
                    </Select>
                    <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button>
                </>}
        >
            <div>翻牌次数：{data && data['count']}</div>
            <Chart height={400} autoFit data={data[type] || []} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
        </Card>
    )
}

export const CardAvtivityDaily = (props) => {
    const [data, setData] = useState({
        rate: [],
        reward: []
    })
    const [atime, setAtime] = useState(moment())
    const [type, setType] = useState('reward')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props
    useEffect(() => {
        let visible = true
        setLoading(true)
        const begin_time = atime.format('YYYY-MM-DD') || ''

        actions.getReward({
            time_type: 1,
            begin_time,
            // end_time,
            is_auth: auth,
            resolved: (data) => {
                if (!visible) return
                const { rate, reward } = data
                data.rate = Object.keys(rate).map(ele => ({
                    type: ele,
                    value: parseInt(rate[ele])
                }))
                data.reward = Object.keys(reward).map(ele => ({
                    type: ele,
                    value: parseInt(reward[ele])
                }))
                setData(data)
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, type])
    const onExport = () => {
        setLoading(true)
        const begin_time = atime.format('YYYY-MM-DD') || ''
        actions.getReward({
            time_type: 1,
            begin_time,
            is_auth: auth,
            action: 'export',
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <DatePicker size='small' value={atime} allowClear={false} className='m_2 w200' onChange={(data, dataString) => {
                        setAtime(data)
                    }} disabledDate={val => val > moment()}></DatePicker>
                    <Select size='small' value={type} onChange={(val) => { setType(val) }}>
                        <Select.Option value={'rate'}>每日奖品占比</Select.Option>
                        <Select.Option value={'reward'}>每日中奖数量</Select.Option>
                    </Select>
                    <Select size='small' className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button>
                </>}
        >
            {type == 'reward' ?
                <Chart height={400} autoFit data={data[type]} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="interval"
                        label={["value", { style: { fill: '#535353' } }]}
                        color='type'
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
                :
                <PieChart
                    data={data[type]}
                    title={{
                        visible: true,
                        text: ''
                    }}
                    description={{
                        visible: true,
                        text: '',
                    }}
                    radius={0.8}
                    angleField='value'
                    colorField='type'
                    label={{
                        visible: true,
                        type: 'outer',
                        offset: 20,
                    }}
                />
            }
        </Card>
    )
}
export const GuaCardAvtivityDaily = (props) => {
    const [data, setData] = useState({
        rate: [],
        reward: []
    })
    const [atime, setAtime] = useState(moment())
    const [type, setType] = useState('reward')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props
    useEffect(() => {
        let visible = true
        setLoading(true)
        const begin_time = atime.format('YYYY-MM-DD') || ''

        actions.getReward({
            activity_id: 18,
            time_type: 1,
            begin_time,
            // end_time,
            is_auth: auth,
            resolved: (data) => {
                if (!visible) return
                const { rate, reward } = data
                data.rate = Object.keys(rate).map(ele => ({
                    type: ele,
                    value: parseInt(rate[ele])
                }))
                data.reward = Object.keys(reward).map(ele => ({
                    type: ele,
                    value: parseInt(reward[ele])
                }))
                setData(data)
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, type])
    const onExport = () => {
        setLoading(true)
        const begin_time = atime.format('YYYY-MM-DD') || ''
        actions.getReward({
            activity_id: 18,
            time_type: 1,
            begin_time,
            is_auth: auth,
            action: 'export',
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <DatePicker size='small' value={atime} allowClear={false} className='m_2 w200' onChange={(data, dataString) => {
                        setAtime(data)
                    }} disabledDate={val => val > moment()}></DatePicker>
                    <Select size='small' value={type} onChange={(val) => { setType(val) }}>
                        <Select.Option value={'rate'}>每日奖品占比</Select.Option>
                        <Select.Option value={'reward'}>每日中奖数量</Select.Option>
                    </Select>
                    <Select size='small' className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button>
                </>}
        >
            {type == 'reward' ?
                <Chart height={400} autoFit data={data[type]} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="interval"
                        label={["value", { style: { fill: '#535353' } }]}
                        color='type'
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
                :
                <PieChart
                    data={data[type]}
                    title={{
                        visible: true,
                        text: ''
                    }}
                    description={{
                        visible: true,
                        text: '',
                    }}
                    radius={0.8}
                    angleField='value'
                    colorField='type'
                    label={{
                        visible: true,
                        type: 'outer',
                        offset: 20,
                    }}
                />
            }
        </Card>
    )
}
export const Feedback = (props) => {
    const [data, setData] = useState(null)
    const [dataFeed, setDataFeed] = useState(null)

    const [atime, setAtime] = useState({ time_type: 0, begin_time: '', end_time: '' })
    const [atimeFeed, setAtimeFeed] = useState({ time_type: 0, begin_time: '', end_time: '' })

    const [auth, setAuth] = useState(-1)
    const [authFeed, setAuthFeed] = useState(-1)

    const [loading, setLoading] = useState(true)
    const [loadingFeed, setLoadingFeed] = useState(true)

    const { actions } = props
    useEffect(() => {
        let visible = true
        setLoading(true)
        const { time_type, begin_time, end_time } = atime

        actions.getFeedData({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            resolved: (data) => {
                if (!visible) return
                data.data = Object.keys(data['data']).map(ele => ({
                    type: ele,
                    value: parseInt(data['data'][ele])
                }))
                setData(data)
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth])
    useEffect(() => {
        let visible = true
        setLoadingFeed(true)
        const { time_type, begin_time, end_time } = atimeFeed

        actions.getFeedLine({
            time_type,
            begin_time,
            end_time,
            is_auth: authFeed,
            action: '',
            resolved: (data) => {
                if (!visible) return

                setDataFeed(Object.keys(data).map(ele => ({
                    type: ele,
                    value: parseInt(data[ele])
                })))
                setLoadingFeed(false)
            },
            rejected: (data) => {
                setLoadingFeed(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atimeFeed, authFeed])
    const onExportFeed = () => {
        setLoadingFeed(true)
        const { time_type, begin_time, end_time } = atimeFeed

        actions.getFeedLine({
            time_type,
            begin_time,
            end_time,
            is_auth: authFeed,
            action: 'export',
            resolved: (data) => {
                console.log(data)
                setLoadingFeed(false)
                const { address } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoadingFeed(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    const onExport = () => {
        setLoading(true)
        const { time_type, begin_time, end_time } = atime

        actions.getFeedData({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            action: 'export',
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <>
            <Card loading={loading} bordered={false} size='small' title='会员反馈帮助数量统计'
                extra={
                    <>
                        <Filter size='small' value={atime} allowClear={false} className='m_2 w200' onChange={(data, dataString) => {
                            setAtime(data)
                        }} disabledDate={val => val > moment()} />

                        <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button>
                    </>}
            >
                <div className='mb_10'>总数：<Tag>{data && data['total']}</Tag></div>
                <Chart height={400} autoFit data={data && (data['data'] || [])} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="interval"
                        label={["value", { style: { fill: '#535353' } }]}
                        color='type'
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
            </Card>
            <Card loading={loadingFeed} bordered={false} size='small' title='每日会员反馈帮助人数'
                extra={
                    <>
                        <Filter size='small' value={atimeFeed} allowClear={false} className='m_2 w200' onChange={(data, dataString) => {
                            setAtimeFeed(data)
                        }} disabledDate={val => val > moment()} />

                        <Select size='small' value={authFeed} onChange={(val) => { setAuthFeed(val) }}>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        <Button className='m_2' loading={loadingFeed} size={'small'} onClick={onExportFeed}>导出</Button>
                    </>}
            >
                <Chart height={400} autoFit data={dataFeed || []} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="line"
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
            </Card>
        </>
    )
}
export const ExpressInfo = (props) => {
    const [data, setData] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })

    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const { actions } = props
    useEffect(() => {
        let visible = true

        setLoading(true)
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })

        actions.getExpressStat({
            time_type: time_type,
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                if (!visible) return
                let arr = []
                Object.keys(data).map(ele => {
                    const { return: _return, refund } = data[ele]
                    arr.push({ type: ele, value: _return, name: '每日退货退款申请量' })
                    arr.push({ type: ele, value: refund, name: '每日退款申请量' })
                })
                setData(arr)
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    return (
        <Card bordered={false} size='small' title=''>
            <Card loading={loading} bordered={false} size='small' title=''
                extra={
                    <>
                        <Filter size='small' value={atime} allowClear={false} className='m_2 w200' onChange={(data, dataString) => {
                            setAtime(data)
                        }} disabledDate={val => val > moment()} />
                        <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        {
                            regions.length > 0 ?
                                <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                    setRegionId(e)
                                }}>
                                    <Option value={0}>全部</Option>
                                    {
                                        regions.map(item => {
                                            return (
                                                <Option value={item.regionId}>{item.regionName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                : null
                        }
                    </>}
            >
                <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="line"
                        color='name'
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
            </Card>
        </Card>
    )
}
export const CourseComment = (props) => {
    const [data, setData] = useState([])
    const [courseData, setCourseData] = useState([])
    const [atime, setAtime] = useState({ time_type: 0, begin_time: '', end_time: '' })
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const { actions } = props
    useEffect(() => {
        let visible = true
        setLoading(true)
        const { time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getCommentLine({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            region_id: region_id,
            resolved: (data) => {
                if (!visible) return
                const { userComment, courseComment } = data
                let c_data = []
                if (userComment) {
                    setData(Object.keys(userComment).map(ele => ({
                        type: ele,
                        value: parseInt(userComment[ele])
                    })))
                }
                if (courseComment) {
                    Object.keys(courseComment).map(ele => {
                        // if(courseComment[ele]!==0)
                        c_data.push({ type: ele, value: courseComment[ele] })
                    })
                    c_data.sort((a, b) => {
                        return a['value'] > b['value'] ? 1 : -1
                    })
                    setCourseData(c_data)
                }
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])

    const onExport = () => {
        setLoading(true)
        const { time_type, begin_time, end_time } = atime

        actions.getCommentLine({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            region_id: region_id,
            action: 'export',
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card bordered={false} size='small' title=''>
            <Card loading={loading} bordered={false} size='small' title='每日用户提交评论数'
                extra={
                    <>
                        <Filter size='small' value={atime} allowClear={false} className='m_2 w200' onChange={(data, dataString) => {
                            setAtime(data)
                        }} disabledDate={val => val > moment()} />

                        {/* <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button> */}
                        <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        {
                            regions.length > 0 ?
                                <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                    setRegionId(e)
                                }}>
                                    <Option value={0}>全部</Option>
                                    {
                                        regions.map(item => {
                                            return (
                                                <Option value={item.regionId}>{item.regionName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                : null
                        }
                    </>}
            >
                <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="line"
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
            </Card>
            <Card loading={loading} bordered={false} size='small' title='课程累计评论数量排行'>
                <Chart height={680} autoFit data={courseData} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={false} />
                    <Geom
                        shape='smooth'
                        type="interval"
                        // label={["value", { style: { fill: '#535353' } }]}
                        color='type'
                        position="type*value"
                    />
                    <Coordinate transpose />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
            </Card>
        </Card>
    )
}
export const CoinInfo = (props) => {

    const [data, setData] = useState([])
    const [atime, setAtime] = useState({ time_type: 0, begin_time: '', end_time: '' })

    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const { actions } = props

    useEffect(() => {
        let visible = true
        setLoading(true)

        const { time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getCoinInfo({
            time_type,
            is_auth: auth,
            begin_time,
            end_time,
            action: '',
            region_id,
            resolved: (data) => {
                if (!visible) return
                const map = {
                    activityget: '平台翻牌获得',
                    platform: '平台发放金币总量',
                    total: '平台获得总量',
                    usercostintegral: '用户金币消耗总量',
                    usergetintegral: '用户金币获得总量',
                    userleftintegral: '用户金币结余总量',
                    userrewardget: "打赏平台抽成获得",
                }
                setData(Object.keys(data).map(ele => ({ type: map[ele], value: parseInt(data[ele]) })))
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    const onExport = () => {
        setLoading(true)

        const { time_type, begin_time, end_time } = atime
        actions.getCoinInfo({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            action: 'export',
            region_id,
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter size='small' className='m_2 w200' onChange={(date) => {
                        setAtime(date)
                    }} />

                    <Select size='small' className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button>
                </>}
        >
            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
        </Card>
    )
}
export const CoinConsume = (props) => {
    const [data, setData] = useState([])
    const [atime, setAtime] = useState({ time_type: 0, begin_time: '', end_time: '' })
    const [auth, setAuth] = useState(-1)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        setLoading(true)
        const { time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getCoinConsume({
            time_type,
            is_auth: auth,
            begin_time,
            end_time,
            action: '',
            region_id,
            resolved: (data) => {
                if (!visible) return
                const map = {
                    'userrewardcost': '金币打赏消耗总数',
                    'askcostintegral': '答题消耗金币总数',
                    'activitycostintegral': '翻牌抽奖消耗金币总数',
                    '完美林种子兑换消耗': '完美森林活动统计金币消耗总数',
                    "buyCost": "所有用户购物（电子、实物）消耗金币总数"
                }
                setData(Object.keys(data).map(ele => ({ type: map[ele], value: parseInt(data[ele]) })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    const onExport = () => {

        setLoading(true)
        const { time_type, begin_time, end_time } = atime
        actions.getCoinConsume({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            action: 'export',
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter size='small' allowClear={false} value={atime} className='m_2 w200' onChange={(date, data) => {
                        setAtime(date)
                    }} disabledDate={val => val > moment()} />

                    <Select size='small' className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button>
                </>}
        >
            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
        </Card>
    )
}
export const CoinOrigin = (props) => {
    const [data, setData] = useState([])
    const [atime, setAtime] = useState({ time_type: 0, begin_time: '', end_time: '' })
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        setLoading(true)
        actions.getCoinOrigin({
            time_type,
            is_auth: auth,
            begin_time,
            end_time,
            action: '',
            region_id,
            resolved: (data) => {
                if (!visible) return
                const map = {
                    'userget': '用户获取',
                    'platformget': '管理员操作增加',
                    'platformreduce': '管理员操作减少'
                }
                setData(Object.keys(data).map(ele => ({ type: map[ele], value: parseInt(data[ele]) })))
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [auth, atime, region_id])
    const onExport = () => {
        setLoading(true)
        const { time_type, begin_time, end_time } = atime

        actions.getCoinOrigin({
            time_type,
            begin_time,
            end_time,
            is_auth: auth,
            action: 'export',
            region_id,
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter size='small' value={atime} allowClear={false} onChange={(data, dataString) => {
                        setAtime(data)
                    }} disabledDate={val => val > moment()} />
                    <Select size='small' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button size="small" onClick={onExport} loading={loading}>导出</Button>

                </>}
        >
            <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart>
        </Card>
    )
}
export const CoinRank = (props) => {
    const [data, setData] = useState([])
    const [atime, setAtime] = useState(moment())

    const [auth, setAuth] = useState(-1)
    const [pageSize, setPageSize] = useState(10)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        let visible = true
        setLoading(true)
        const begin_time = atime.format('YYYY-MM-DD') || ''
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        actions.getCoinRank({
            page: 0,
            pageSize: pageSize,
            is_auth: auth,
            action: '',
            begin_time: begin_time,
            end_time: '',
            regionId: region_id,
            resolved: (data) => {
                if (!visible) return
                setData(data['data'] || [])
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [pageSize, auth, region_id, atime])
    const onExport = () => {
        setLoading(true)
        const begin_time = atime.format('YYYY-MM-DD') || ''
        actions.getCoinRank({
            page: 0,
            begin_time: begin_time,
            pageSize,
            is_auth: auth,
            action: 'export',
            regionId: region_id,
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(data['data'], '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    const columns = [
        {
            title: 'UID',
            dataIndex: 'userId',
            key: 'userId'
        },
        {
            title: '金币',
            dataIndex: 'integral',
            key: 'integral'
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname'
        },
        {
            title: '姓名',
            dataIndex: 'username',
            key: 'username'
        },

        {
            title: '性别',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (item, record) => record.sex == 0 ? '未知' : record.sex == 1 ? '男' : '女'
        },
        {
            title: '联系电话',
            dataIndex: 'mobile',
            key: 'mobile',
            ellipsis: true,
        },
    ]
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <DatePicker size='small' value={atime} allowClear={false} className='m_2' onChange={(date, data) => {
                        setAtime(date)
                    }} disabledDate={val => val > moment()}></DatePicker>
                    <Select size='small' className='m_2' value={pageSize} onChange={val => { setPageSize(val) }}>
                        <Select.Option value={10}>前10名</Select.Option>
                        <Select.Option value={50}>前50名</Select.Option>
                        <Select.Option value={100}>前100名</Select.Option>
                    </Select>
                    <Select size='small' className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button>
                </>}
        >
            <Table dataSource={data} columns={columns} rowKey={'userId'} tableLayout={'fixed'} size={'small'} pagination={false} />
        </Card>
    )
}
export const SenStat = (props) => {
    const [data, setData] = useState({
        num: [],
        rate: []
    })
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        let visible = true
        const{begin_time, end_time }=atime
        actions.getSenStat({
            is_auth: auth,
            begin_time,
            end_time,
            action: '',
            resolved: (data) => {
                if (!visible) return
                const { num, rate } = data
                data.num = Object.keys(num).map((ele) => ({
                    type: ele,
                    value: parseFloat(num[ele])
                }))
                data.rate = Object.keys(rate).map((ele, index) => ({
                    type: ele,
                    value: parseFloat(rate[ele])
                }))
                setData(data)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth])
    const onExport = () => {
        setLoading(true)
        const{begin_time, end_time }=atime
        actions.getSenStat({
            begin_time,
            end_time,
            is_auth: auth,
            action: 'export',
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                     <Filter showTimeType={false} disabled={loading} onChange={(res) => {
                            console.log(res)
                            setAtime(res)
                        }} />
                    <Select size='small' className='m_2' value={type} onChange={(val) => { setType(val) }}>
                        <Select.Option value={'num'}>触发次数</Select.Option>
                        <Select.Option value={'rate'}>触发占比</Select.Option>
                    </Select>
                    <Select size='small' className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button>

                </>}
        >
            {type == 'num' ?
                <Chart height={400} autoFit data={data[type]} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="interval"
                        label={["value", { style: { fill: '#535353' } }]}
                        color='type'
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
                :
                <PieChart
                    data={data[type]}
                    title={{
                        visible: true,
                        text: ''
                    }}
                    description={{
                        visible: true,
                        text: '',
                    }}
                    radius={0.8}
                    angleField='value'
                    colorField='type'
                    label={{
                        visible: true,
                        type: 'outer',
                        offset: 20,
                    }}
                />
            }
        </Card>
    )
}
export const AskChart = (props) => {
    const [data, setData] = useState([])
    // const [atime, setAtime] = useState({
    //     time_type:0,
    //     begin_time:moment().subtract(30,'days').format('YYYY-MM-DD'),
    //     end_time:moment().format('YYYY-MM-DD')
    // })
    const [atime, setAtime] = useState([moment().subtract('days', 30), moment()])
    const [loading, setLoading] = useState(true)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [auth, setAuth] = useState(-1)
    const { actions } = props

    useEffect(() => {
        let visible = true
        if (!Array.isArray(atime)) return;
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        setLoading(true)
        actions.getAskChartStat({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type || 0,
            resolved: (res) => {
                if (!visible) return
                if (res && typeof res === 'object') {
                    let arr = []
                    let lst = Object.values(res)[0]
                    Object.keys(lst).map(ele => {
                        if (ele == 'reply') {
                            arr.push({ type: '提交数', value: lst['reply'], name: '提交数' })
                        }
                        if (ele == 'ask') {
                            arr.push({ type: '回答数', value: lst['ask'], name: '回答数' })
                        }
                        if (ele == 'iNum') {
                            arr.push({ type: '悬赏问题数', value: lst['iNum'], name: '悬赏问题数' })
                        }
                        if (ele == 'tIntegral') {
                            arr.push({ type: '悬赏金币总额', value: lst['tIntegral'], name: '悬赏金币总额' })
                        }
                    })
                    setData(arr)
                }
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getAskChartStat({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type || 0,
            resolved: (res) => {
                if (res && typeof res === 'object') {
                    let arr = []
                    let lst = Object.values(res)[0]
                    Object.keys(lst).map(ele => {
                        if (ele == 'reply') {
                            arr.push({ type: '提交数', value: lst['reply'], name: '提交数' })
                        }
                        if (ele == 'ask') {
                            arr.push({ type: '回答数', value: lst['ask'], name: '回答数' })
                        }
                        if (ele == 'iNum') {
                            arr.push({ type: '悬赏问题数', value: lst['iNum'], name: '悬赏问题数' })
                        }
                        if (ele == 'tIntegral') {
                            arr.push({ type: '悬赏金币总额', value: lst['tIntegral'], name: '悬赏金币总额' })
                        }
                    })
                    setData(arr)
                }
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Spin spinning={loading}>
            <Card bordered={false} size='small' title=''
                extra={
                    <>
                        <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                            console.log(res)
                            setAtime(res)
                        }} />
                        <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        {
                            regions.length > 0 ?
                                <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                    setRegionId(e)
                                }}>
                                    <Option value={0}>全部</Option>
                                    {
                                        regions.map(item => {
                                            return (
                                                <Option value={item.regionId}>{item.regionName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                : null
                        }
                        <Button size='small' onClick={onOk}>筛选</Button>
                    </>}
            >
                <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="interval"
                        label={["value", { style: { fill: '#535353' } }]}
                        color='type'
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
            </Card>
        </Spin>
    )
}
export const AskInfo = (props) => {
    const [data, setData] = useState({
        hit: 0,
        answer: 0,
        comm: 0,
        list: []
    })
    // const [atime, setAtime] = useState({
    //     time_type:0,
    //     begin_time:moment().subtract(30,'days').format('YYYY-MM-DD'),
    //     end_time:moment().format('YYYY-MM-DD'),
    // })
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '2020-01-01', end_time: moment().format('YYYY-MM-DD') })
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const { actions } = props

    useEffect(() => {
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        setLoading(true)
        actions.getAskInfoStat({
            time_type: time_type,
            is_auth: auth,
            begin_time: begin_time,
            end_time: end_time,
            action: '',
            region_id: region_id,
            resolved: (res) => {
                if (!visible) return
                setData({
                    answer: res['回答量'],
                    hit: res['点击量'],
                    comm: res['评论量'],
                    list: res['热门问题排行榜前50']
                })
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [auth, atime, region_id])

    return (
        <Spin spinning={loading}>
            <Card bordered={false} size='small' title=''
                extra={
                    <>
                        <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                            console.log(res)
                            setAtime(res)
                        }} />
                        <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                            <Select.Option value={-1}>全 部</Select.Option>
                            <Select.Option value={0}>未认证</Select.Option>
                            <Select.Option value={1}>已认证</Select.Option>
                        </Select>
                        {
                            regions.length > 0 ?
                                <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                    setRegionId(e)
                                }}>
                                    <Option value={0}>全部</Option>
                                    {
                                        regions.map(item => {
                                            return (
                                                <Option value={item.regionId}>{item.regionName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                : null
                        }

                    </>}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="问题点击量"
                                value={data['hit']}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="问题回答量"
                                value={data['answer']}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="问题评论量"
                                value={data['comm']}
                                valueStyle={{ color: 'orange' }}
                            />
                        </Card>
                    </Col>
                </Row>
                <Card title='热门话题（问题）排行榜' style={{ marginTop: 10 }}>
                    <Table columns={[
                        { dataIndex: 'askId', key: 'askId', title: 'ID' },
                        { dataIndex: 'title', key: 'title', title: '问题' },
                        { dataIndex: 'content', key: 'content', title: '问题描述' },
                        { dataIndex: 'nickname', key: 'nickname', title: '用户' },
                        {
                            title: '发布时间', render: (item, ele) => {
                                return moment.unix(ele.pubTime).format('YYYY-MM-DD')
                            }
                        },
                    ]} dataSource={data['list']}></Table>
                </Card>
                {/* <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                <Axis name="value" visible={true} />
                <Axis name="type" visible={true} />
                <Geom
                    shape='smooth'
                    type="interval"
                    label={["value", { style: { fill: '#535353' } }]}
                    color='type'
                    position="type*value"
                />
                <Legend position='top' itemName={{
                    style: {
                        fill: "#333"
                    }
                }} />
                <Tooltip shared showCrosshairs />
                <Slider end={1} height={25} />
            </Chart> */}
            </Card>
        </Spin>
    )
}
export const CourseTag = (props) => {
    const [data, setData] = useState({
        rate: [],
        times: []
    })
    const [atime, setAtime] = useState({
        time_type: 0,
        begin_time: moment().subtract(30, 'days').format('YYYY-MM-DD'),
        end_time: moment().format('YYYY-MM-DD'),
    })
    const [type, setType] = useState('times')
    const [auth, setAuth] = useState(-1)
    const [loading, setLoading] = useState(true)
    const { actions } = props
    useEffect(() => {
        let visible = true
        setLoading(true)
        // const begin_time = atime.format('YYYY-MM-DD') || ''

        actions.getStatCourseTag({
            time_type: 1,
            ...atime,
            resolved: (res) => {
                console.log(res)
                if (!visible) return
                const { data, total } = res
                let tmp = {
                    rate: [],
                    times: []
                }
                if (data && typeof data === 'object' && Object.keys(data).length > 0) {

                    tmp.times = Object.keys(data).map(ele => ({
                        type: ele,
                        value: parseInt(data[ele])
                    }))
                    tmp.rate = Object.keys(data).map(ele => ({
                        type: ele,
                        value: Math.floor(parseInt(data[ele]) / total * 100)
                    }))
                }
                setData(tmp)
                setLoading(false)
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth])
    const onExport = () => {
        setLoading(true)
        actions.getStatCourseTag({
            time_type: 1,
            ...atime,
            action: 'export',
            resolved: (data) => {
                console.log(data)
                setLoading(false)
                const { address, adress } = data
                message.success({
                    content: '导出成功',
                    onClose: () => {
                        window.open(address || adress, '_black')
                    }
                })
            },
            rejected: (data) => {
                setLoading(false)
                message.error(JSON.stringify(data))
            }
        })
    }
    return (

        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter hasSelect={true} size='small' value={atime} allowClear={false} className='m_2 w200' onChange={(data, dataString) => {
                        setAtime(data)
                    }} disabledDate={val => val > moment()} />
                    <Select value={type} onChange={(val) => { setType(val) }}>
                        <Select.Option value={'times'}>观看次数</Select.Option>
                        <Select.Option value={'rate'}>观看占比</Select.Option>
                    </Select>
                    <Button className='m_2' loading={loading} onClick={onExport}>导出</Button>
                </>}
        >
            {
                data[type].length === 0 ?
                    <Empty description='暂无数据' style={{ margin: 20 }}></Empty> :
                    type == 'times' ?
                        <Chart height={400} autoFit data={data[type]} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                            <Axis name="value" visible={true} />
                            <Axis name="type" visible={true} />
                            <Geom
                                size={20}
                                shape='smooth'
                                type="interval"
                                label={["value", { style: { fill: '#535353' } }]}
                                color='type'
                                position="type*value"
                            />
                            <Legend position='top' itemName={{
                                style: {
                                    fill: "#333"
                                }
                            }} />
                            <Tooltip shared showCrosshairs />
                            <Slider end={1} height={25} />
                        </Chart>
                        :
                        <PieChart
                            data={data[type]}
                            title={{
                                visible: true,
                                text: ''
                            }}
                            description={{
                                visible: true,
                                text: '',
                            }}
                            radius={0.8}
                            angleField='value'
                            colorField='type'
                            label={{
                                visible: true,
                                type: 'outer',
                                offset: 20,
                            }}
                        />
            }
        </Card>
    )
}
export const SenStats = (props) => {
    const [data, setData] = useState({
        num: [],
        rate: []
    })
    const [datas, setDatas] = useState({
        num: [],
        rate: []
    })
    const [datass, setDatass] = useState({
        num: [],
        rate: []
    })
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const [time_types, setTimeType] = useState(0)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getYouhui({
            beginTime: begin_time,
            endTime: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_types.time_type || 0,
            action: '',
            resolved: (data) => {
                console.log(data)
                if (!visible) return

                let num = []
                let rate = []
                let nums = []
                let rates = []
                let numss = []
                let ratess = []
                let obj = Object.values(data)
                Object.keys(data).map((ele, index) => {
                    if (ele.indexOf('通用') !== -1) {
                        let itm = {
                            type: ele,
                            value: obj[index]
                        }
                        num = num.concat(itm)
                        rate = rate.concat(itm)
                    }
                    if (ele.indexOf('商城') !== -1) {
                        let itm = {
                            type: ele,
                            value: obj[index]
                        }
                        nums = nums.concat(itm)
                        rates = rates.concat(itm)
                    }
                    if (ele.indexOf('课程') !== -1) {
                        let itm = {
                            type: ele,
                            value: obj[index]
                        }
                        numss = numss.concat(itm)
                        ratess = ratess.concat(itm)
                    }

                })
                setData({ num: num, rate: rate })
                setDatas({ num: nums, rate: rates })
                setDatass({ num: numss, rate: ratess })
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    const onExport = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getYouhui({
            beginTime: begin_time,
            endTime: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_types.time_type || 0,
            action: 'export',
            resolved: (data) => {

                window.open(data.address)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                        setTimeType(res)
                    }} />
                    {/* <Select size='small' className='m_2'  value={type} onChange={(val) => { setType(val) }}>
                    <Select.Option value={'num'}>触发次数</Select.Option>
                    <Select.Option value={'rate'}>触发占比</Select.Option>
                </Select> */}
                    <Select size='small' className='m_2' style={{ width: '100px' }} value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button>

                </>}
        >
            {type == 'num' ?
                <div>
                    <Chart height={400} autoFit data={data[type]} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                        <Axis name="value" visible={true} />
                        <Axis name="type" visible={true} />
                        <Geom
                            shape='smooth'
                            type="interval"
                            label={["value", { style: { fill: '#535353' } }]}
                            color='type'
                            position="type*value"
                        />
                        <Legend position='top' itemName={{
                            style: {
                                fill: "#333"
                            }
                        }} />
                        <Tooltip shared showCrosshairs />
                        <Slider end={1} height={25} />
                    </Chart>
                    <Chart height={400} autoFit data={datas[type]} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                        <Axis name="value" visible={true} />
                        <Axis name="type" visible={true} />
                        <Geom
                            shape='smooth'
                            type="interval"
                            label={["value", { style: { fill: '#535353' } }]}
                            color='type'
                            position="type*value"
                        />
                        <Legend position='top' itemName={{
                            style: {
                                fill: "#333"
                            }
                        }} />
                        <Tooltip shared showCrosshairs />
                        <Slider end={1} height={25} />
                    </Chart>
                    <Chart height={400} autoFit data={datass[type]} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                        <Axis name="value" visible={true} />
                        <Axis name="type" visible={true} />
                        <Geom
                            shape='smooth'
                            type="interval"
                            label={["value", { style: { fill: '#535353' } }]}
                            color='type'
                            position="type*value"
                        />
                        <Legend position='top' itemName={{
                            style: {
                                fill: "#333"
                            }
                        }} />
                        <Tooltip shared showCrosshairs />
                        <Slider end={1} height={25} />
                    </Chart>
                </div>
                :
                <PieChart
                    data={data[type]}
                    title={{
                        visible: true,
                        text: ''
                    }}
                    description={{
                        visible: true,
                        text: '',
                    }}
                    radius={0.8}
                    angleField='value'
                    colorField='type'
                    label={{
                        visible: true,
                        type: 'outer',
                        offset: 20,
                    }}
                />
            }
        </Card>
    )
}
export const CouponUse = (props) => {
    const [data, setData] = useState({
        num: [],
        rate: []
    })
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const [time_types, setTimeType] = useState(0)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getCouponUse({
            action: '',
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_types.time_type || 0,
            resolved: (data) => {
                console.log(data)
                if (!visible) return

                let num = []
                let rate = []
                let obj = Object.values(data)
                Object.keys(data).map((ele, index) => {
                    console.log(ele)
                    let itm = {
                        type: ele,
                        value: obj[index]
                    }
                    num = num.concat(itm)
                    rate = rate.concat(itm)
                })
                console.log(num, rate)
                setData({ num: num, rate: rate })
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    const onExport = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getCouponUse({
            action: 'export',
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_types.time_type || 0,
            resolved: (data) => {
                window.open(data.address)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                        setTimeType(res)
                    }} />
                    {/* <Select size='small' className='m_2'  value={type} onChange={(val) => { setType(val) }}>
                    <Select.Option value={'num'}>触发次数</Select.Option>
                    <Select.Option value={'rate'}>触发占比</Select.Option>
                </Select> */}
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button>

                </>}
        >
            {type == 'num' ?
                <Chart height={400} autoFit data={data[type]} interactions={['active-region']} padding={[40, 40, 100, 40]} >
                    <Axis name="value" visible={true} />
                    <Axis name="type" visible={true} />
                    <Geom
                        shape='smooth'
                        type="interval"
                        label={["value", { style: { fill: '#535353' } }]}
                        color='type'
                        position="type*value"
                    />
                    <Legend position='top' itemName={{
                        style: {
                            fill: "#333"
                        }
                    }} />
                    <Tooltip shared showCrosshairs />
                    <Slider end={1} height={25} />
                </Chart>
                :
                <PieChart
                    data={data[type]}
                    title={{
                        visible: true,
                        text: ''
                    }}
                    description={{
                        visible: true,
                        text: '',
                    }}
                    radius={0.8}
                    angleField='value'
                    colorField='type'
                    label={{
                        visible: true,
                        type: 'outer',
                        offset: 20,
                    }}
                />
            }
        </Card>
    )
}
export const CouponCome = (props) => {
    const [data, setData] = useState([])
    const [val, setVal] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getCouponComes({
            action: '',
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    const onExport = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getCouponComes({
            action: 'export',
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            resolved: (data) => {
                window.open(data.address)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    {/* <Select size='small' className='m_2'  value={type} onChange={(val) => { setType(val) }}>
                    <Select.Option value={'num'}>触发次数</Select.Option>
                    <Select.Option value={'rate'}>触发占比</Select.Option>
                </Select> */}
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button>

                </>}
        >
            {
                data.map((item, index) => {
                    let lst = Object.keys(item)
                    return (
                        <FormItem label={val[index]}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic title={lst[0]} value={item[lst[0]]} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title={lst[1]} value={item[lst[1]]} />
                                </Col>
                            </Row>
                        </FormItem>
                    )
                })
            }

        </Card>
    )
}
export const Everypv = (props) => {
    const [data, setData] = useState([])
    const [val, setVal] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '', end_time: '' })
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getEveryPv({
            begin_time: begin_time,
            end_time: end_time,
            regionId: region_id,
            time_type: time_type,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])

    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    {/* <Select size='small' className='m_2'  value={type} onChange={(val) => { setType(val) }}>
                    <Select.Option value={'num'}>触发次数</Select.Option>
                    <Select.Option value={'rate'}>触发占比</Select.Option>
                </Select> */}
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    {/* <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button> */}

                </>}
        >
            {
                data.map((item, index) => {
                    let lst = Object.keys(item)
                    return (
                        <FormItem label={val[index]}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic title={lst[0]} value={item[lst[0]]} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title={lst[1]} value={item[lst[1]]} />
                                </Col>
                            </Row>
                        </FormItem>
                    )
                })
            }

        </Card>
    )
}
export const AmountTotal = (props) => {
    const [data, setData] = useState([])
    const [val, setVal] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: moment().subtract('days', 30).format('YYYY-MM-DD'), end_time: moment().format('YYYY-MM-DD') })
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getAmountTotal({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])

    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    {/* <Select size='small' className='m_2'  value={type} onChange={(val) => { setType(val) }}>
                    <Select.Option value={'num'}>触发次数</Select.Option>
                    <Select.Option value={'rate'}>触发占比</Select.Option>
                </Select> */}
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    {/* <Button className='m_2' loading={loading} size={'small'} onClick={onExport}>导出</Button> */}

                </>}
        >
            {
                data.map((item, index) => {
                    let lst = item.split(' + ')
                    return (
                        <FormItem label={val[index]}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic title='现金' value={lst[0]} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title='金币' value={lst[1]} />
                                </Col>
                            </Row>
                        </FormItem>
                    )
                })
            }

        </Card>
    )
}
export const CourseAgent = (props) => {
    const [data, setData] = useState([])
    const [val, setVal] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: moment().subtract('days', 30).format('YYYY-MM-DD'), end_time: moment().format('YYYY-MM-DD') })
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [courseId, setCourseId] = useState('')
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getCourseAgent({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            courseId: courseId,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getCourseAgent({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            courseId: courseId,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Input placeholder='请输入课程ID' size='small' style={{ width: '120px' }} value={courseId} onChange={(e) => {
                        setCourseId(e.target.value)
                    }} />
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    {/* <Select size='small' className='m_2'  value={type} onChange={(val) => { setType(val) }}>
                    <Select.Option value={'num'}>触发次数</Select.Option>
                    <Select.Option value={'rate'}>触发占比</Select.Option>
                </Select> */}
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button className='m_2' loading={loading} size={'small'} onClick={onOk}>筛选</Button>

                </>}
        >

            <FormItem label='课程分销分析'>
                <Row gutter={16}>
                    {
                        val.map((item, index) => {
                            return (
                                <Col span={12} style={{ marginTop: '20px' }}>
                                    <Statistic title={item} value={data[index]} />
                                </Col>
                            )
                        })
                    }

                </Row>
            </FormItem>

        </Card>
    )
}
export const CashTotal = (props) => {
    const [data, setData] = useState([])
    const [val, setVal] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: moment().subtract('days', 30).format('YYYY-MM-DD'), end_time: moment().format('YYYY-MM-DD') })
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [courseId, setCourseId] = useState('')
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getCashTotal({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    {/* <Select size='small' className='m_2'  value={type} onChange={(val) => { setType(val) }}>
                    <Select.Option value={'num'}>触发次数</Select.Option>
                    <Select.Option value={'rate'}>触发占比</Select.Option>
                </Select> */}
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }

                </>}
        >

            <FormItem label='资金情况'>
                <Row gutter={16}>
                    {
                        val.map((item, index) => {
                            return (
                                <Col span={12} style={{ marginTop: '20px' }}>
                                    <Statistic title={item} value={data[index]} />
                                </Col>
                            )
                        })
                    }

                </Row>
            </FormItem>

        </Card>
    )
}
export const CashIntegral = (props) => {
    const [data, setData] = useState([])
    const [val, setVal] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: moment().subtract('days', 30).format('YYYY-MM-DD'), end_time: moment().format('YYYY-MM-DD') })
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [courseId, setCourseId] = useState('')
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getCashIntegral({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            region_id: region_id,
            time_type: time_type,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                    }} />
                    {/* <Select size='small' className='m_2'  value={type} onChange={(val) => { setType(val) }}>
                    <Select.Option value={'num'}>触发次数</Select.Option>
                    <Select.Option value={'rate'}>触发占比</Select.Option>
                </Select> */}
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }

                </>}
        >

            <FormItem label='商城金币情况'>
                <Row gutter={16}>
                    {
                        val.map((item, index) => {
                            return (
                                <Col span={12} style={{ marginTop: '20px' }}>
                                    <Statistic title={item} value={data[index]} />
                                </Col>
                            )
                        })
                    }

                </Row>
            </FormItem>

        </Card>
    )
}
export const CashIntegralUsers = (props) => {
    const [data, setData] = useState([])
    const [val, setVal] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '2020-01-01', end_time: moment().format('YYYY-MM-DD') })
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [time_types, setTimeType] = useState(0)
    const [userId, setUserId] = useState('')
    const [courseId, setCourseId] = useState('')
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getCashIntegralUsers({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            regionId: region_id,
            time_type: time_type,
            userId: userId,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [])
    const onOk = () => {
        const { timeType: time_type, begin_time, end_time } = atime
        setLoading(true)
        actions.getCashIntegralUsers({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            regionId: region_id,
            time_type: time_types.time_type || 0,
            userId: userId,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
    }
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Input size='small' placeholder='请输入用户ID' value={userId} style={{ width: '120px' }} onChange={(e) => {
                        setUserId(e.target.value)
                    }} />
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                        setTimeType(res)
                    }} />
                    {/* <Select size='small' className='m_2'  value={type} onChange={(val) => { setType(val) }}>
                    <Select.Option value={'num'}>触发次数</Select.Option>
                    <Select.Option value={'rate'}>触发占比</Select.Option>
                </Select> */}
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }
                    <Button size='small' onClick={onOk}>筛选</Button>

                </>}
        >

            <FormItem label='用户金币情况'>
                <Row gutter={16}>
                    {
                        val.map((item, index) => {
                            return (
                                <Col span={12} style={{ marginTop: '20px' }}>
                                    <Statistic title={item} value={data[index]} />
                                </Col>
                            )
                        })
                    }

                </Row>
            </FormItem>

        </Card>
    )
}
export const CashIntegralRage = (props) => {
    const [data, setData] = useState([])
    const [val, setVal] = useState([])
    const [datas, setDatas] = useState([])
    const [vals, setVals] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '2020-01-01', end_time: moment().format('YYYY-MM-DD') })
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [userId, setUserId] = useState('')
    const [courseId, setCourseId] = useState('')
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const [time_types, setTimeType] = useState(0)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.getCashIntegralRage({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            regionId: region_id,
            time_type: time_types.time_type || 0,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        actions.getPingtaiFen({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            regionId: region_id,
            time_type: time_types.time_type || 0,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setDatas(vas)
                setVals(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                        setTimeType(res)
                    }} />
                    {/* <Select size='small' className='m_2'  value={type} onChange={(val) => { setType(val) }}>
                    <Select.Option value={'num'}>触发次数</Select.Option>
                    <Select.Option value={'rate'}>触发占比</Select.Option>
                </Select> */}
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }

                </>}
        >

            <FormItem label='平台金币情况'>
                <Row gutter={16}>
                    {
                        val.map((item, index) => {
                            return (
                                <Col span={12} style={{ marginTop: '20px' }}>
                                    <Statistic title={item} value={data[index]} />
                                </Col>
                            )
                        })
                    }

                </Row>
            </FormItem>
            <FormItem label='平台分成金币'>
                <Row gutter={16}>
                    {
                        vals.map((item, index) => {
                            return (
                                <Col span={12} style={{ marginTop: '20px' }}>
                                    <Statistic title={item} value={datas[index]} />
                                </Col>
                            )
                        })
                    }

                </Row>
            </FormItem>

        </Card>
    )
}
export const CashIntegralTeacher = (props) => {
    const [data, setData] = useState([])
    const [val, setVal] = useState([])
    const [atime, setAtime] = useState({ timeType: 0, begin_time: '2020-01-01', end_time: moment().format('YYYY-MM-DD') })
    const [type, setType] = useState('num')
    const [auth, setAuth] = useState(-1)
    const [userId, setUserId] = useState('')
    const [courseId, setCourseId] = useState('')
    const [regions, setRegions] = useState([])
    const [region_id, setRegionId] = useState(0)
    const [loading, setLoading] = useState(true)
    const [time_types, setTimeType] = useState(0)
    const { actions } = props

    useEffect(() => {
        setLoading(true)
        actions.getAdressesList({
            resolved: (res) => {
                setRegions(res)
            },
            rejected: (err) => {
                console.log(err)
            }
        })
        let visible = true
        const { timeType: time_type, begin_time, end_time } = atime
        actions.CashIntegralTeacher({
            begin_time: begin_time,
            end_time: end_time,
            is_auth: auth,
            regionId: region_id,
            time_type: time_types.time_type || 0,
            resolved: (data) => {
                let lst = Object.keys(data)
                let vas = Object.values(data)
                setData(vas)
                setVal(lst)
                setLoading(false)
            },
            rejected: (data) => {
                message.error(JSON.stringify(data))
            }
        })
        return () => visible = false
    }, [atime, auth, region_id])
    return (
        <Card loading={loading} bordered={false} size='small' title=''
            extra={
                <>
                    <Filter showTimeType={true} disabled={loading} onChange={(res) => {
                        console.log(res)
                        setAtime(res)
                        setTimeType(res)
                    }} />
                    {/* <Select size='small' className='m_2'  value={type} onChange={(val) => { setType(val) }}>
                    <Select.Option value={'num'}>触发次数</Select.Option>
                    <Select.Option value={'rate'}>触发占比</Select.Option>
                </Select> */}
                    <Select size='small' style={{ width: '100px' }} className='m_2' value={auth} onChange={(val) => { setAuth(val) }}>
                        <Select.Option value={-1}>全 部</Select.Option>
                        <Select.Option value={0}>未认证</Select.Option>
                        <Select.Option value={1}>已认证</Select.Option>
                    </Select>
                    {
                        regions.length > 0 ?
                            <Select value={region_id} style={{ width: '100px' }} size='small' onChange={(e) => {
                                setRegionId(e)
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    regions.map(item => {
                                        return (
                                            <Option value={item.regionId}>{item.regionName}</Option>
                                        )
                                    })
                                }
                            </Select>
                            : null
                    }

                </>}
        >

            <FormItem label='讲师金币情况'>
                <Row gutter={16}>
                    {
                        val.map((item, index) => {
                            return (
                                <Col span={12} style={{ marginTop: '20px' }}>
                                    <Statistic title={item} value={data[index]} />
                                </Col>
                            )
                        })
                    }

                </Row>
            </FormItem>

        </Card>
    )
}

export default UserChart