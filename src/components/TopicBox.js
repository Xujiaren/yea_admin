import React, { Component } from 'react';
import { Modal, Form, message, Button, Icon,Transfer, Switch, Table, Tag } from 'antd';
import difference from 'lodash/difference';

const leftTableColumns = [
	{
		dataIndex: 'key',
		title: 'ID',
	},
	{
		dataIndex: 'title',
		title: '题目题干',
	}
];
const rightTableColumns = [
	{
		dataIndex: 'key',
		title: 'ID',
	},
	{
		dataIndex: 'title',
		title: '题目题干',
	},
];

export default class TopicBox extends React.Component {
	state = {
		dataSource:[],
		selected:[],
		targetKeys: [],
		disabled: false,
		showSearch: true,

		category_id:0,
        paper_id:0,
        topic_id:0,
		keyword:'',
		loading:false,
	};
	dataSource = []
	auth_topic_list = []
	page_total=0
    page_current=1
	page_size=0
	
	componentWillMount(){
		console.log(this.props.topiclist)
		let dataSource = []

		this.auth_topic_list = this.props.topiclist
		
		this.auth_topic_list.map(ele=>{
			dataSource.push({
				key:ele.topicId,
				title:ele.title
			})
		})
		this.dataSource = dataSource
	}
	componentDidMount(){
		if(this.props.topiclist.length>0){
			this.setState({ loading:false })
		}
	}
	
	componentWillReceiveProps(n_props){
		console.log(n_props.topiclist)

		
		if(n_props.topiclist !== this.props.topiclist){
			
			let dataSource = []
			this.auth_topic_list = n_props.topiclist

			this.auth_topic_list.map(ele=>{
				dataSource.push({
					key:ele.topicId,
					title:ele.title
				})
			})
			this.dataSource = dataSource
			this.setState({loading:false})
		}
		
		
	}

	onChange = nextTargetKeys => {
		console.log(nextTargetKeys)
		this.setState({ targetKeys: nextTargetKeys });
	}
	getValue = ()=>{
		const {targetKeys} = this.state
		return targetKeys
	}
	render() {
		const { targetKeys, disabled, showSearch,loading } = this.state;
		return (
			<div>
		
				<Transfer 
					dataSource={this.dataSource}
					targetKeys={targetKeys}
					disabled={disabled}
					showSearch={showSearch}
					onChange={this.onChange}
					filterOption={(inputValue, item) =>item['title'].indexOf(inputValue) !== -1 }
					showSelectAll={false}
				>
					{({
						direction,
						filteredItems,
						onItemSelectAll,
						onItemSelect,
						selectedKeys: listSelectedKeys,
						disabled: listDisabled,
					}) => {
						const pagination= {
							position: 'bottom',
							current: this.page_current,
							pageSize: this.page_size,
							total: this.page_total,
							showQuickJumper:true,
							onChange: this._onPage,
							showTotal:(total)=>'总共'+total+'条'
						}
						const columns = direction === 'left' ? leftTableColumns : rightTableColumns;

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
								loading={loading}
								rowSelection={rowSelection}
								columns={columns}
								dataSource={filteredItems}
								size="small"
								style={{ pointerEvents: listDisabled ? 'none' : null }}
								onRow={({ key, disabled: itemDisabled }) => ({
									onClick: () => {
										if (itemDisabled || listDisabled) return;
										onItemSelect(key, !listSelectedKeys.includes(key));
									},
								})}
							/>
						);
					}}
				</Transfer>
			</div>
		);
	}
}
