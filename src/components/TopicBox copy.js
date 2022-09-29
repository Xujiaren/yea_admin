import React, { Component } from 'react';
import { Modal, Form, Upload, message, Button, Icon,Transfer, Switch, Table, Tag } from 'antd';
import difference from 'lodash/difference';
import connectComponent from '../util/connect';

export default class TopicBox extends Component {
	state = {
		category_id:0,
        paper_id:0,
        topic_id:0,
		keyword:'',
		targetKeys: originTargetKeys,
		disabled: false,
		showSearch: false,
		
	};
	componentWillMount() {
		const {actions} = this.props;
		this.getAuthTopic()
	}
	componentDidMount() {

	}
	componentWillReceiveProps(n_props) {
		if (n_props.value !== this.props.value) {
			this.setState({ fileList: n_props.value })
		}
		if(n_props.auth_topic_list !== this.props.auth_topic_list){
            console.log(n_props.auth_topic_list)
            this.auth_topic_list = n_props.auth_topic_list.data
            this.page_current = n_props.auth_topic_list.page+1
            this.page_total = n_props.auth_topic_list.total
        }
	}
	getAuthTopic = ()=>{
        const {actions} = this.props
        const {paper_id,topic_id,category_id,keyword} = this.state

        actions.getAuthTopic({
            paper_id,
            topic_id,
            category_id,
            keyword,
            page: this.page_current-1,
            pageSize: this.page_size
        })
    }
	getValue = () => {

	}
	onChange = nextTargetKeys => {
		this.setState({ targetKeys: nextTargetKeys });
	}
	render() {
		
		const { targetKeys, disabled, showSearch } = this.state;
		return (
			<Transfer {...restProps} showSelectAll={false}>
				{({
					direction,
					filteredItems,
					onItemSelectAll,
					onItemSelect,
					selectedKeys: listSelectedKeys,
					disabled: listDisabled,
				}) => {

				const columns = direction === 'left' ? leftColumns : rightColumns;

				const rowSelection = {
					getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
					onSelectAll(selected, selectedRows) {
					const treeSelectedKeys = selectedRows
						.filter(item => !item.disabled)
						.map(({ key }) => key);
					const diffKeys = selected
						? difference(treeSelectedKeys, listSelectedKeys)
						: difference(listSelectedKeys, treeSelectedKeys);
					onItemSelectAll(diffKeys, selected);
					},
					onSelect({ key }, selected) {
					onItemSelect(key, selected);
					},
					selectedRowKeys: listSelectedKeys,
				};

				return (
					<Table
						targetKeys={targetKeys}
						onChange={this.onChange}
						rowSelection={rowSelection}
						columns={columns}
						dataSource={filteredItems}
						size="small"
						onRow={({ key, disabled: itemDisabled }) => ({
							onClick: () => {
							if (itemDisabled || listDisabled) return;
							onItemSelect(key, !listSelectedKeys.includes(key));
							},
						})}
						filterOption={(inputValue, item) =>
							item.title.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
						}
					/>
				)
				}}
			</Transfer>
		)

		rightTableColumns = [
			{
			  dataIndex: 'title',
			  title: 'Name',
			},
		]
		leftTableColumns = [
			{
			  dataIndex: 'title',
			  title: 'Name',
			},
			{
			  dataIndex: 'tag',
			  title: 'Tag',
			  render: tag => <Tag>{tag}</Tag>,
			},
			{
			  dataIndex: 'description',
			  title: 'Description',
			},
		]
	}
}
const LayoutComponent = TopicBox;
const mapStateToProps = state => {
    return {
        auth_topic_list:state.auth.auth_topic_list
    }
}
export default connectComponent({LayoutComponent, mapStateToProps});
