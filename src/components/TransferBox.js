import React from "react";
import { Tree } from 'antd';

const { TreeNode } = Tree;

const treeData = [
	{
		title: '讲师',
		key: '0-0',
	},
	{
		title: '店主',
		key: '0-3'
	},
	{
		title: '店员',
		key: '0-4'
	},
	{
		title: '优惠顾客',
		key: '0-5'
	},
	{
		title: '直销员',
		key: '0-6',
	},
	{ title: '初级业务员', key: '0-6-0' },
	{ title: '中级业务员', key: '0-6-1' },
	{ title: '高级业务员', key: '0-6-2' },
	{ title: '资深级业务员', key: '0-6-3' }
];

export default class TransferBox extends React.Component {
	state = {
		expandedKeys: [],
		autoExpandParent: true,
		checkedKeys: [],
		selectedKeys: [],
	};

	onExpand = expandedKeys => {
		this.setState({
			expandedKeys,
			autoExpandParent: false,
		});
	};

	onCheck = checkedKeys => {
		this.setState({ checkedKeys });
	};

	onSelect = (selectedKeys, info) => {
		this.setState({ selectedKeys });
	};

	renderTreeNodes = data =>
		data.map(item => {
			if (item.children) {
				return (
					<TreeNode title={item.title} key={item.key} dataRef={item}>
						{this.renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode key={item.key} {...item} />;
		});

	render() {
		return (
			<Tree
				checkable
				onExpand={this.onExpand}
				expandedKeys={this.state.expandedKeys}
				autoExpandParent={this.state.autoExpandParent}
				onCheck={this.onCheck}
				checkedKeys={this.state.checkedKeys}
				onSelect={this.onSelect}
				selectedKeys={this.state.selectedKeys}
			>
				{this.renderTreeNodes(treeData)}
			</Tree>
		);
	}
}