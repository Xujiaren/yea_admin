import React from "react";
import {Spin,Empty,Select,Divider,Pagination} from 'antd';
import connectComponent from '../../util/connect';
import debounce from 'lodash/debounce';
import config from '../../config/config';
import * as courseService from '../../redux/service/course'
const {Option} = Select;

export default class SelectCom extends React.Component {
    constructor(props) {
        super(props);
    }
    state={
        parent_id:0,
        cctype:'-1',
        ctype:'7',
        category_list:[],
        fetching:false
    }
    parentlist = []

    _onChange = (val)=>{
        console.log(val)
        
        const {onSelect} = this.props

        let parent_id = val
        this.setState({ parent_id })

        onSelect(parent_id)
    }
    componentWillMount(){
        this.parentlist = this.props.parentlist
    }
    componentWillReceiveProps(n_props){
        if(this.props.parentlist !== n_props.parentlist){
            this.parentlist = n_props.parentlist
        }
    }
    render() {
        const {value,disabled} = this.props
        return (
            <Select
                disabled={disabled}
                onChange={this._onChange}
                value={value}
                filterOption={false}
            >
                <Option value={0}>新分类</Option>
                {this.parentlist.map((item,index) => (
                    <Option key={item.categoryName+'_select'} value={item.categoryId+''}>{item.categoryName}</Option>
                ))}
            </Select>
        )
    }

}