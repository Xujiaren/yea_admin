import React, { Component } from 'react';
import { Select,Tabs,Card,Input, PageHeader} from 'antd';
import { HorizontalBar} from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import connectComponent from '../../util/connect';
import _ from 'lodash'
import moment from 'moment';

const {Option} = Select;

const options = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: true
}

let line_course = {
    labels: [],
    datasets: [
        {   
            key:'course',
            maxBarThickness:50,
            label:'',
            borderWidth: 1,
            borderColor:'rgba(100, 190, 255,1)',
            backgroundColor:'rgb(100, 190, 255,0.4)',
            data:[]
        }
    ]
}
const course_sort = {
    'comment':'课程评论数',
    'hit':'课程播放数',
    'learn':'课程学习数',
    'score':'课程评分',
    'finish':'课程完成率'
}
class CourseStatInfo extends Component {

    constructor(props){
        super(props)
        this.state = {
            course_sort:'comment',
            course_data_title:'课程打赏人数'
        }
        this.line_course = line_course
    }
    componentWillMount(){
        const {search} = this.props.history.location
        if(search.indexOf('tab=') > -1){
            let tab = search.split('=')[1]
            this.setState({tab})
        }
    }
    componentDidMount(){
        const {actions} = this.props
        let val = 'comment'

        if(this.props.history.location.state){
            val = this.props.history.location.state.type
        }
        if(val == 'data'){
            this.getCourseData()
        }else{
            actions.getStatCourse({sort:val,limit:100000})
            
        }
        this.setState({course_sort: val})
	}
	componentWillReceiveProps(n_props){

        if(n_props.stat_course !== this.props.stat_course){
            const {stat_course} = n_props
            let labels = []
            let data = []
            this.stat_course = stat_course

            stat_course.map(ele=>{
                if(ele[1].length>15)
                    ele[1] = ele[1].slice(0,15)+'...'
                labels.push(ele[1])
                data.push(ele[2])
            })

            this.line_course.labels = labels
            this.line_course.datasets[0].data = data
            this.line_course.datasets[0].maxBarThickness = 15
        }
	}
    _onCommentClick(type,ele){
        console.log(ele)
        if(ele.length!==0){
            let id = ''
            id = this.stat_course[ele[0]._index][0]
            
            if(id !== '')
                this.props.history.push({
                    pathname:'/course-manager/view-course/'+id,
                    state:{
                        tab:3
                    }
                })
        }
        
    }
    getCourseData = ()=>{
        const {actions} = this.props
        const {course_data_title} = this.state
        actions.getCourseData({
            begin_time:'2019-10-01',
            end_time:moment().format('YYYY-MM-DD'),
            limit:100000,
            resolved:(data)=>{
                const {person,collection,frequency} = data
                let label = []
                let person_data = [],collection_data = [],frequency_data = []
                let stat_course_data = {}

                Object.keys(person).map(ele=>{
                    if(ele.length>15)
                        ele = ele.slice(0,15)+'...'
                    label.push(ele)
                    person_data.push(person[ele])
                })
                Object.keys(collection).map(ele=>{
                    collection_data.push(collection[ele])
                })
                Object.keys(frequency).map(ele=>{
                    frequency_data.push(frequency[ele])
                })

                stat_course_data = {
                    labels: label,
                    datasets: [
                        {   
                            key:'course_ava',
                            maxBarThickness:50,
                            label:course_data_title,
                            borderWidth: 1,
                            borderColor:'rgba(100, 190, 255,1)',
                            backgroundColor:'rgba(100, 190, 255,0.4)',
                            data:person_data
                        },
                    ]
                }
                if(course_data_title == '课程打赏次数'){
                    stat_course_data.datasets[0].data = frequency_data
                }else if(course_data_title == '课程收藏量'){
                    stat_course_data.datasets[0].data = collection_data
                }
                this.setState({stat_course_data,person_data,collection_data,frequency_data})
                
            }
        })
    }
    render() {
        return (
        <div className="animated fadeIn">
            <Card>
                <PageHeader
                    className="pad_0"
                    ghost={false}
                    onBack={() => window.history.back()}
                    subTitle={this.state.course_sort=='data'?this.state.course_data_title:course_sort[this.state.course_sort]}
                >
                </PageHeader>
                {this.state.course_sort !== 'data'?
                    <Card type="inner" className='mt_10'>
                        <div className="chart-wrapper">
                            {!this.state.view?<div>无查看权限</div>:
                                <HorizontalBar height={800} onElementsClick={this._onCommentClick.bind(this,'comment')} data={this.line_course} options={options} />
                            }
                        </div>
                    </Card>
                    :
                    <Card className='mt_10' type="inner" title={this.state.course_data_title}  extra={(
                        <div className="flex row align_items">
                            <Select 
                                    value={this.state.course_data_title}
                                    onChange={val=>{
                                        this.setState({course_data_title:val},()=>{
                                            this.getCourseData()
                                        })
                                    }}
                                >
                                    <Option value="课程打赏人数">课程打赏人数</Option>
                                    <Option value="课程打赏次数">课程打赏次数</Option>
                                    <Option value="课程收藏量">课程收藏量</Option>
                            </Select>
                        </div>
                    )}>
                        <div className="chart-wrapper">
                            <HorizontalBar height={800} data={this.state.stat_course_data} options={options} />
                        </div>
                    </Card>
                }
            </Card>
        </div>
        );
    }
}

const LayoutComponent =CourseStatInfo;
const mapStateToProps = state => {
    return {
        stat_course:state.dashboard.stat_course,
        user:state.site.user,
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});