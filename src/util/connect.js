import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../redux/action';

const options = {
	withRef: false
};

export default function connectComponent({ mapStateToProps, mapDispatchToProps, mergeProps, LayoutComponent }) {
	return connect(
		mapStateToProps || function (state) {
			return {};
		},
		mapDispatchToProps || function (dispatch) {
			return {
				actions: bindActionCreators(actions, dispatch)
			}
		},
		mergeProps,
		options
	)(LayoutComponent);
}