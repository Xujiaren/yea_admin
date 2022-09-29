import React, { Component } from 'react';
import { CardBody, CardHeader, } from 'reactstrap';
import { Badge, Card, Col, Row, DatePicker, Menu, Dropdown, Icon, message, Input } from 'antd';
import { Link } from 'react-router-dom';
import connectComponent from '../../../util/connect';

const { Search } = Input;

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.todo_info = {}
    this.state = {
      activityRewards: '',
      comments: '',
      feedBacks: '',
      notShip: '',
      receipt: '',
      refund: '',
      _return: '',
      teacherRview: '0',
      theme: '0',
      _ask: '',
      withDrawal: '0',
      invoice: '0',
      withdraw: '0',
      ask: [],
      keyword: '',
      reply: [],
      _reply: '',
      askComment: '',
      reward_num: 0,
      water: 0,
      pkerTopic: 0,
      count_course_comment:0,
      count_meet_course_comment:0,
      count_article_comment:0,
      count_special_comment:0,
      count_activity_comment:0,
      count_offline_squad_comment:0,
      count_ask_reply:0
    }
  }
  componentDidMount() {
    const { actions } = this.props
    actions.getTodo()
    console.log(this.status)
    actions.ask(this.keyword, 0, 10, 0)
    actions.reply(this.keyword, 0, 10, 0)
    this.reward()
  }
  reward = () => {
    const { actions } = this.props
    actions.getRewardss(0, 1, 0, 10)
  }
  componentWillReceiveProps(n_props) {
    // if (n_props.reply !== this.props.reply) {
    //   this.reply = n_props.reply
    //   this.setState({ _reply: this.reply.data.length })
    // }
    if (n_props.ask !== this.props.ask) {
      this.ask = n_props.ask
      this.setState({ _ask: this.ask.data.length })
    }
    if (n_props.rewards !== this.props.rewards) {
      this.setState({
        reward_num: n_props.rewards.total
      })
    }
    if (n_props.todo_info !== this.props.todo_info) {
      this.todo_info = n_props.todo_info
      const {
        activityRewards,
        comments,
        feedBacks,
        notShip,
        receipt,
        refund,
        return: _return,
        teacherRview,
        theme,
        invoice,
        withdraw,
        askComment,
        askReplycomment,
        water,
        pkerTopic,
        count_course_comment,
        count_meet_course_comment,
        count_article_comment,
        count_special_comment,
        count_activity_comment,
        count_offline_squad_comment,
        count_ask_reply
      } = n_props.todo_info
      this.setState({
        activityRewards,
        comments,
        feedBacks,
        notShip,
        receipt,
        refund,
        _return,
        teacherRview,
        theme,
        invoice,
        withdraw,
        _reply: askReplycomment,
        askComment: askComment,
        water: water,
        pkerTopic,
        count_course_comment,
        count_meet_course_comment,
        count_article_comment,
        count_special_comment,
        count_activity_comment,
        count_offline_squad_comment,
        count_ask_reply
      })
    }
  }
  render() {
    return (
      <div className="animated fadeIn">
        {!this.props.rule.includes('todo/comment') ? null :
          <Card title="评论审核" bordered={false}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexWrap: "wrap" }}>
              {/* <div span={6} className='pad_10'>
                <Badge count={this.state.comments == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to="/todo-list/comment-list/-1/-1" className="todo-block head-example text_center flex f_col j_center">
                    待审核
                    <div className="mt_10">{this.state.comments}</div>
                  </Link>
                </Badge>
              </div> */}
              <div span={6} className='pad_10'>
                <Badge count={this.state.count_course_comment == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to="/todo-list/comment-list/3/-1" className="todo-block head-example text_center flex f_col j_center">
                    课程评论审核
                    <div className="mt_10">{this.state.count_course_comment}</div>
                  </Link>
                </Badge>
              </div>
              <div span={6} className='pad_10'>
                <Badge count={this.state.count_meet_course_comment == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to="/todo-list/comment-list/48/-1" className="todo-block head-example text_center flex f_col j_center">
                    研讨会课程评论审核
                    <div className="mt_10">{this.state.count_meet_course_comment}</div>
                  </Link>
                </Badge>
              </div>
              <div span={6} className='pad_10'>
                <Badge count={this.state.count_article_comment == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to="/todo-list/comment-list/11/-1" className="todo-block head-example text_center flex f_col j_center">
                    资讯评论审核
                    <div className="mt_10">{this.state.count_article_comment}</div>
                  </Link>
                </Badge>
              </div>
              <div span={6} className='pad_10'>
                <Badge count={this.state.count_special_comment == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to="/todo-list/comment-list/15/-1" className="todo-block head-example text_center flex f_col j_center">
                    专题评论审核
                    <div className="mt_10">{this.state.count_special_comment}</div>
                  </Link>
                </Badge>
              </div>
              <div span={6} className='pad_10'>
                <Badge count={this.state.count_activity_comment == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to="/todo-list/comment-list/2/-1" className="todo-block head-example text_center flex f_col j_center">
                    活动评论审核
                    <div className="mt_10">{this.state.count_activity_comment}</div>
                  </Link>
                </Badge>
              </div>
              <div span={6} className='pad_10'>
                <Badge count={this.state.count_offline_squad_comment == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to="/todo-list/comment-list/54/-1" className="todo-block head-example text_center flex f_col j_center">
                    线下活动评论审核
                    <div className="mt_10">{this.state.count_offline_squad_comment}</div>
                  </Link>
                </Badge>
              </div>
            </div>
          </Card>
        }
        <Card className="mt_10" bordered={false}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexWrap: "wrap" }}>
            {!this.props.rule.includes('todo/teacher') ? null :
              <div span={6} className='pad_10'>
                <Badge count={this.state.teacherRview == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to='/teacher/apply' className="todo-block head-example text_center flex f_col j_center">
                    讲师审核
                    <div className="mt_10">{this.state.teacherRview}</div>
                  </Link>
                </Badge>
              </div>
            }
            {!this.props.rule.includes('todo/avtive') ? null :
              <div span={6} className='pad_10'>
                <Badge count={this.state.theme == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to='/activity' className="todo-block head-example text_center flex f_col j_center">
                    主题活动审核
                    <div className="mt_10">{this.state.theme}</div>
                  </Link>
                </Badge>
              </div>
            }
            {/* <div span={6} className='pad_10'>
              <Badge count={this.state.pkerTopic == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                <Link to='/rankPaper-manager/list' className="todo-block head-example text_center flex f_col j_center">
                  趣味探索题库
                    <div className="mt_10">{this.state.pkerTopic}</div>
                </Link>
              </Badge>
            </div> */}
          </div>
        </Card>
        <Card className="mt_10" bordered={false} title="问吧">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexWrap: "wrap" }}>
            <div span={6} className='pad_10'>
              <Badge count={this.state._reply == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                <Link to='/todo-list/comment-list/34/-1' className="todo-block head-example text_center flex f_col j_center">
                  回答评论审核
                  <div className="mt_10">{this.state._reply}</div>
                </Link>
              </Badge>
            </div>
            <div span={6} className='pad_10'>
              <Badge count={this.state.askComment == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                <Link to='/todo-list/comment-list/10/-1' className="todo-block head-example text_center flex f_col j_center">
                  问吧评论审核
                  <div className="mt_10">{this.state.askComment}</div>
                </Link>
              </Badge>
            </div>
            <div span={6} className='pad_10'>
              <Badge count={this.state._ask == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                <Link to='/ask/list' className="todo-block head-example text_center flex f_col j_center">
                  问吧提问审核
                  <div className="mt_10">{this.state._ask}</div>
                </Link>
              </Badge>
            </div>
            <div span={6} className='pad_10'>
              <Badge count={this.state._ask == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                <Link to='/ask/comment' className="todo-block head-example text_center flex f_col j_center">
                  问吧回答审核
                  <div className="mt_10">{this.state.count_ask_reply}</div>
                </Link>
              </Badge>
            </div>
          </div>
        </Card>
        {!this.props.rule.includes('todo/mall') ? null :
          <Card className="mt_10" bordered={false} title="商城">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexWrap: "wrap" }}>
              <div span={6} className='pad_10'>
                <Badge count={this.state.notShip == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to='/mall/goods-order?tab=0' className="todo-block head-example text_center flex f_col j_center">
                    待发货订单
                    <div className="mt_10">{this.state.notShip}</div>
                  </Link>
                </Badge>
              </div>
              <div span={6} className='pad_10'>
                <Badge count={this.state.refund == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to='/mall/goods-order?tab=2' className="todo-block head-example text_center flex f_col j_center">
                    退款订单
                    <div className="mt_10">{this.state.refund}</div>
                  </Link>
                </Badge>
              </div>
              <div span={6} className='pad_10'>
                <Badge count={this.state._return == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to='/mall/goods-order?tab=2' className="todo-block head-example text_center flex f_col j_center">
                    退款退货订单
                    <div className="mt_10">{this.state._return}</div>
                  </Link>
                </Badge>
              </div>
              <div span={6} className='pad_10'>
                <Badge count={this.state.receipt == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to='/mall/goods-return' className="todo-block head-example text_center flex f_col j_center">
                    退货确认处理
                    <div className="mt_10">{this.state.receipt}</div>
                  </Link>
                </Badge>
              </div>
              <div span={6} className='pad_10'>
                <Badge count={this.state.receipt == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to='/web-manager/active-manager?tab=5' className="todo-block head-example text_center flex f_col j_center">
                    赠品订单管理
                    <div className="mt_10">{this.state.reward_num}</div>
                  </Link>
                </Badge>
              </div>
            </div>
          </Card>
        }
        {!this.props.rule.includes('todo/reward') ? null :
          <Card className="mt_10" bordered={false} title="中奖" extra={<Link to={'/todo-list/post-list'}>更多</Link>}>
            <Row gutter={8}>
              <Col span={6}>
                <Badge count={this.state.activityRewards == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to='/todo-list/post-list' className="todo-block head-example text_center flex f_col j_center">
                    待邮寄
                    <div className="mt_10">{this.state.activityRewards}</div>
                  </Link>
                </Badge>
              </Col>
            </Row>
          </Card>
        }
        {!this.props.rule.includes('todo/feed') ? null :
          <Card className="mt_10" bordered={false} title="问题反馈" extra={<Link to={'/feedback-list'}>更多</Link>}>
            <Row gutter={8}>
              <Col span={6}>
                <Badge count={this.state.feedBacks == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to='/feedback-list' className="todo-block head-example text_center flex f_col j_center">
                    帮助反馈
                    <div className="mt_10">{this.state.feedBacks}</div>
                  </Link>
                </Badge>
              </Col>
            </Row>
          </Card>
        }
        {!this.props.rule.includes('todo/feed') ? null :
          <Card className="mt_10" bordered={false} title="资金管理">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexWrap: "wrap" }}>
              {!this.props.rule.includes('todo/teacher') ? null :
                <div span={6} className='pad_10'>
                  <Badge count={this.state.withdraw == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                    <Link to='/fund/withdraw' className="todo-block head-example text_center flex f_col j_center">
                      待提现
                      <div className="mt_10">{this.state.withdraw}</div>
                    </Link>
                  </Badge>
                </div>
              }
              <div span={6} className='pad_10'>
                <Badge count={this.state.invoice == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to='/fund/fapiao' className="todo-block head-example text_center flex f_col j_center">
                    待开票
                    <div className="mt_10">{this.state.invoice}</div>
                  </Link>
                </Badge>
              </div>
              <div span={6} className='pad_10'>
                <Badge count={this.state.water == 0 ? null : <Icon type="clock-circle" style={{ color: '#f5222d' }} />}>
                  <Link to='/fund/transaction' className="todo-block head-example text_center flex f_col j_center">
                    待财务确认
                    <div className="mt_10">{this.state.water}</div>
                  </Link>
                </Badge>
              </div>
            </div>
          </Card>
        }
      </div>
    );
  }
}

const LayoutComponent = TodoList;
const mapStateToProps = state => {
  return {
    todo_info: state.dashboard.todo_info,
    rule: state.site.user.rule,
    ask: state.ask.ask,
    reply: state.ask.reply,
    rewards: state.user.rewards
  }
}
export default connectComponent({ LayoutComponent, mapStateToProps });
