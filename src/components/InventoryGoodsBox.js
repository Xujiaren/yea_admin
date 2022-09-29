import React, { Component } from 'react';
import { Modal, Form, Upload, message, Button, Icon,Transfer, Switch, Table, Tag } from 'antd';
import difference from 'lodash/difference';


export default class InventoryGoodsBox extends React.Component {
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
	filterItem = []
	page_total=0
    page_current=1
	page_size=0

	componentWillMount(){
		console.log(this.props.goodslist)
		let dataSource = []

		this.props.goodslist.map(ele=>{
			dataSource.push({
				key:ele.goodsId,
				title:ele.goodsName,
				stock:ele.stock,

				goodsId:ele.goodsId,
				goodsSn:ele.goodsSn,
				goodsName:ele.goodsName,
				attrStockMaps:ele.attrStockMaps,
				goodsNum:'1',
				goodsAttr:'',
				goodsAttrId:'',
				supplierName:'',
				managerName:'',
				orderSn:''
			})
		})
		
		this.dataSource = dataSource
		this.setState({dataSource:dataSource, loading:false})
	}
	componentDidMount(){
		if(this.props.goodslist.length>0){
			this.setState({ loading:false })
		}
		this.setState({ targetKeys:this.props.targetKeys })
	}
	
	componentWillReceiveProps(n_props){
		if(n_props.goodslist !== this.props.goodslist){
			let dataSource = []
			n_props.goodslist.map((ele,index)=>{
				dataSource.push({
					index:index,
					key:ele.goodsId,
					title:ele.goodsName,
					stock:ele.stock,
					
					goodsId:ele.goodsId,
					goodsSn:ele.goodsSn,
					goodsName:ele.goodsName,
					attrStockMaps:ele.attrStockMaps,
					goodsNum:'1',
					goodsAttr:'',
					goodsAttrId:'',
					supplierName:'',
					managerName:'',
					orderSn:''
				})
			})
			this.dataSource = dataSource
			
			this.setState({dataSource:dataSource, loading:false})
		}
		if(n_props.targetKeys !== this.props.targetKeys){
			this.setState({ targetKeys: n_props.targetKeys })
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
					dataSource={this.state.dataSource}
					targetKeys={targetKeys}
					disabled={disabled}
					showSearch={showSearch}
					onChange={this.onChange}
					filterOption={(inputValue, item) =>{
						return item.title.indexOf(inputValue) !== -1
					}}
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
						
						const columns = direction === 'left' ? this.props.leftTableColumns : this.props.rightTableColumns;
						
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
						if(direction === 'right'){
							this.filterItem = filteredItems
						}
						
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
