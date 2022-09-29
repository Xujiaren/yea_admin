import React from 'react';

const Stat = React.lazy(() => import('../page/WorkBench/Stat'));
const BandFilter = React.lazy(() => import('../page/WebManager/BandFilter'));
const Dashboard = React.lazy(() => import('../page/WorkBench/Dashboard'));

const Teacher = React.lazy(() => import('../page/MemberManager/Teacher/Teacher'));

const TeacherDetail = React.lazy(() => import('../page/MemberManager/Teacher/TeacherDetail'));
const TeacherEdit = React.lazy(() => import('../page/MemberManager/Teacher/TeacherEdit'));
const TeacherLevel = React.lazy(()=>import('../page/MemberManager/TeacherLevel'))
const TeacherAsk = React.lazy(()=>import('../page/MemberManager/Teacher/TeacherAsk'))
const CourseStatInfo = React.lazy(() => import('../page/WorkBench/CourseStatInfo'));
const Statistic = React.lazy(() => import('../page/WorkBench/Statistic'));
const ExcelManager = React.lazy(() => import('../page/WorkBench/ExcelManager'));
const ExcelDetail = React.lazy(() => import('../page/WorkBench/ExcelDetail'));

const TodoList = React.lazy(() => import('../page/WorkBench/TodoList'));
const Comment = React.lazy(() => import('../page/WorkBench/TodoList/Comment'));

const FeedbackList = React.lazy(() => import('../page/WorkBench/TodoList/FeedbackList'));
const FeedbackClassify = React.lazy(() => import('../page/WorkBench/TodoList/FeedbackClassify'));
const PostList=  React.lazy(() => import('../page/WorkBench/TodoList/PostList'));

const UserInfo = React.lazy(() => import('../page/MemberManager/User/UserInfo'));
const User = React.lazy(() => import('../page/MemberManager/User/User'));
const UserView = React.lazy(() => import('../page/MemberManager/User/UserView'));
const AddUser = React.lazy(() => import('../page/MemberManager/User/Add'));
const CoinSetting = React.lazy(() => import('../page/MemberManager/CoinSetting'));
const LevelSetting = React.lazy(() => import('../page/MemberManager/LevelSetting'));
const ProfitSetting = React.lazy(() => import('../page/MemberManager/ProfitSetting'));

const CourseManager = React.lazy(() => import('../page/CourseManager'));
const CourseClassify = React.lazy(() => import('../page/CourseManager/CourseClassify')); 
const LabelManager = React.lazy(() => import('../page/CourseManager/LabelManager'));
const LabelDetail = React.lazy(() => import('../page/CourseManager/LabelDetail'));
const EditCourse = React.lazy(() => import('../page/CourseManager/EditCourse'));
const EditStaticCourse = React.lazy(() => import('../page/CourseManager/EditStaticCourse'));

const StaticCourse = React.lazy(() => import('../page/CourseManager/StaticCourse'));

const ChapterSetting = React.lazy(() => import('../page/CourseManager/ChapterSetting'));
const ColumnList = React.lazy(() => import('../page/CourseManager/ColumnList/ColumnList'));

const RecommendList =  React.lazy(() => import('../page/CourseManager/ColumnList/RecommendList'));
const EditReCourse = React.lazy(() => import('../page/CourseManager/ColumnList/EditReCourse'));


const GuaGua =  React.lazy(() => import('../page/WebManager/GuaGua'));
const GuaGuaLuckyList =  React.lazy(() => import('../page/WebManager/GuaGuaLuckyList'));

const AdManager =  React.lazy(() => import('../page/WebManager/AdManager'));

const EditAd =  React.lazy(() => import('../page/WebManager/EditAd'));

const EditMsg =  React.lazy(() => import('../page/WebManager/MsgManager/EditMsg'));
const MsgManager = React.lazy(() => import('../page/WebManager/MsgManager'));

const SearchManager = React.lazy(() => import('../page/WebManager/SearchManager'));
const ActiveManager = React.lazy(() => import('../page/WebManager/ActiveManager'));
const LuckyList = React.lazy(() => import('../page/WebManager/ActiveManager/LuckyList'));
const InviteManager = React.lazy(() => import('../page/WebManager/InviteManager'));
const InviteDetail = React.lazy(() => import('../page/WebManager/InviteManager/InviteDetail'));
const InvitePicture = React.lazy(() => import('../page/WebManager/InviteManager/InvitePicture'));
const TmpManager = React.lazy(() => import('../page/WebManager/TmpManager'));
const AddTmp = React.lazy(() => import('../page/WebManager/TmpManager/AddTmp'));
const EditTmp = React.lazy(() => import('../page/WebManager/TmpManager/EditTmp'));
const ViewTmp = React.lazy(() => import('../page/WebManager/TmpManager/ViewTmp'));

const LogManager = React.lazy(() => import('../page/SystemManager/Log'));
const AuthManager = React.lazy(() => import('../page/SystemManager/Auth'));
const EXAuthManager = React.lazy(() => import('../page/SystemManager/EXAuth'));
const AdminManager = React.lazy(() => import('../page/SystemManager/Admin'));

const EditRole = React.lazy(() => import('../page/SystemManager/EditRole'));

const News = React.lazy(() => import('../page/News/News'));
const EditNews = React.lazy(() => import('../page/News/EditNews'));
const NewsLabel = React.lazy(() => import('../page/News/NewsLabel'));

const LiveManager= React.lazy(() => import('../page/Live/LiveManager'));
const LiveView= React.lazy(() => import('../page/Live/LiveView'));
const GiftManager= React.lazy(() => import('../page/Live/GiftManager'));
const AddLive= React.lazy(() => import('../page/Live/AddLive'));


const MediaCourse= React.lazy(() => import('../page/CourseManager/MediaCourse'));
const MediaEdit= React.lazy(() => import('../page/CourseManager/MediaEdit'));
const MediaChapterSetting = React.lazy(() => import('../page/CourseManager/MediaChapterSetting'));
const AboutUs = React.lazy(() => import('../page/AboutUs/AboutUs'));
const TrainingClassMng = React.lazy(() => import('../page/O2OMng/TrainingClassMng'));
const TrainingClassEdit = React.lazy(()=> import('../page/O2OMng/EditO2O'))
const TrainingClassUser = React.lazy(()=> import('../page/O2OMng/TrainingClassUser'))
const O2ONews = React.lazy(()=> import('../page/O2OMng/O2ONews'))
const O2ONewsEdit = React.lazy(()=> import('../page/O2OMng/O2ONewsEdit'))
const ColMng = React.lazy(()=> import('../page/ColumnManager/ColumnManager'))
const ColEdit = React.lazy(()=> import('../page/ColumnManager/ColumnEdit'))
const ActivityMng = React.lazy(()=> import('../page/ActivityMng/ActivityMng'))
const ActivityResult = React.lazy(()=> import('../page/ActivityMng/ActivityResult'))
const ActivityEdit = React.lazy(()=> import('../page/ActivityMng/ActivityEdit'))
const AuthClassMng = React.lazy(()=> import('../page/AuthMng/AuthClassMng'))
const AuthClassUser = React.lazy(()=> import('../page/AuthMng/AuthClassUser'))
const AuthClassEdit = React.lazy(()=> import('../page/AuthMng/AuthClassEdit'))
const AuthClassScore = React.lazy(()=> import('../page/AuthMng/AuthClassScore'))
const AuthCourseCate = React.lazy(()=> import('../page/AuthMng/AuthCourseCate'))
const AuthPaper = React.lazy(()=> import('../page/AuthMng/AuthPaper/AuthPaper'))
const AuthPaperEdit = React.lazy(()=> import('../page/AuthMng/AuthPaper/AuthPaperEdit'))
const AuthCourse = React.lazy(()=> import('../page/AuthMng/AuthCourse/AuthCourse'))
const AuthCourseEdit = React.lazy(()=> import('../page/AuthMng/AuthCourse/AuthCourseEdit'))
const AuthTopic = React.lazy(()=> import('../page/AuthMng/AuthTopic'))
const AuthTopicEdit = React.lazy(()=> import('../page/AuthMng/AuthTopicEdit'))

const Mall = React.lazy(()=> import('../page/Mall/MallManager'))
const GoodsEdit = React.lazy(()=> import('../page/Mall/GoodsEdit'))
const MallCate = React.lazy(()=> import('../page/Mall/GoodsClassify'))
const MallBrand = React.lazy(()=> import('../page/Mall/GoodsBrand'))
const GoodsType = React.lazy(()=> import('../page/Mall/GoodsType'))
const GoodsTypeRull = React.lazy(()=> import('../page/Mall/GoodsTypeRull'))
const OrderManager = React.lazy(()=> import('../page/Mall/OrderManager'))
const GoodsActiveManager = React.lazy(()=> import('../page/Mall/PromotionActive'))
const PromotionActiveEdit = React.lazy(()=> import('../page/Mall/PromotionActiveEdit'))
const GoodsReturn = React.lazy(()=> import('../page/Mall/GoodsReturn'))
const Express = React.lazy(()=> import('../page/Mall/Express/Express'))
const ExpressEdit = React.lazy(()=> import('../page/Mall/Express/ExpressSetting'))
const Inventory = React.lazy(()=> import('../page/Mall/Inventory/Inventory'))
const InventoryTrans = React.lazy(()=> import('../page/Mall/Inventory/InventoryTransport'))
const InventoryApply = React.lazy(()=> import('../page/Mall/Inventory/InventoryApply'))

const TopicEdit = React.lazy(()=> import('../page/TopicMng/TopicEdit'))
const PaperEdit = React.lazy(()=> import('../page/TopicMng/PaperEdit'))
const Topic = React.lazy(()=> import('../page/TopicMng/Topic'))
const Paper = React.lazy(()=> import('../page/TopicMng/Paper'))
const TopicClassify = React.lazy(()=> import('../page/TopicMng/TopicClassify'))

const TeacherApply = React.lazy(()=> import('../page/MemberManager/Teacher/TeacherApply'))
const TeacherApplyEdit = React.lazy(()=> import('../page/MemberManager/Teacher/TeacherApplyEdit'))
const TeacherApplyCheck = React.lazy(()=> import('../page/MemberManager/Teacher/TeacherApplyEdit'))

const TeacherRanks = React.lazy(()=> import('../page/MemberManager/Teacher/TeacherRanks'))
const Medal = React.lazy(()=> import('../page/Medal/Medal'))
const MedalEdit = React.lazy(()=> import('../page/Medal/MedalEdit'))
const MediaManager = React.lazy(()=> import('../page/MediaManager'))
const Feedback = React.lazy(()=> import('../page/WebManager/Feedback'))
const FeedbackInfo = React.lazy(()=> import('../page/WebManager/FeedbackInfo'))
const Message = React.lazy(()=>import('../components/Chat'))
const UI = React.lazy(()=>import('../page/UI/UImanager'))
const PkLevel = React.lazy(()=>import('../page/Pk/PkLevel'))
const PkMatch = React.lazy(()=>import('../page/Pk/PkMatch'))
const CouponYC = React.lazy(()=>import('../page/Mall/CouponYC'))
const Coupon = React.lazy(()=>import('../page/Mall/PromotionManager/Coupon'))
const CouponEdit = React.lazy(()=>import('../page/Mall/PromotionManager/CouponEdit'))

const TaskManager= React.lazy(() => import('../page/Task/TaskManager'));
const TaskRecord= React.lazy(() => import('../page/Task/TaskRecord'));
const StudyMapO2O = React.lazy(() => import('../page/StudyMap/StudyMapO2O'));
const StudyMap = React.lazy(()=> import('../page/StudyMap/StudyMap'))
const StudyMapEdit = React.lazy(()=> import('../page/StudyMap/StudyMapEdit'))
const StudyMapO2OEdit = React.lazy(()=> import('../page/StudyMap/StudyMapO2OEdit'))
const CourseOrder = React.lazy(()=> import('../page/Mall/CourseOrder'))
const Fapiao = React.lazy(()=> import('../page/FundMng/Fapiao'))
const WithDraw = React.lazy(()=> import('../page/FundMng/WithDraw'))
const Transaction = React.lazy(()=> import('../page/FundMng/Transaction'))
const UnderlineActive = React.lazy(()=> import('../page/UnderlineActive/UnderlineActive'))
const UnderlineActiveUser = React.lazy(()=> import('../page/UnderlineActive/UnderlineActiveUser'))
const UnderlineEdit = React.lazy(()=> import('../page/UnderlineActive/EditO2O'))

const Ask = React.lazy(()=>import('../page/Ask/Ask'))
const AskComment = React.lazy(()=>import('../page/Ask/AskComment'))
const AskEdit = React.lazy(()=>import('../page/Ask/AskEdit'))
const AskCate = React.lazy(()=>import('../page/Ask/AskCate'))

const Meetting = React.lazy(()=>import('../page/Meetting/Meetting'))
const MeettingEdit = React.lazy(()=>import('../page/Meetting/MeettingEdit'))
const Mood = React.lazy(()=>import('../page/Meetting/Mood'))
const MeettingUser = React.lazy(()=>import('../page/Meetting/MeettingUser'))
const MeettingUserEdit = React.lazy(()=>import('../page/Meetting/MeettingUserEdit'))
const MeettingActivity = React.lazy(()=>import('../page/Meetting/MeettingActivity'))
const MeettingActivityEdit = React.lazy(()=>import('../page/Meetting/MeettingActivityEdit'))
const MeettingComment = React.lazy(()=>import('../page/Meetting/MeettingComment'))
const MeettingTask = React.lazy(()=>import('../page/Meetting/MeettingTask'))
const MeettingTaskEdit = React.lazy(()=>import('../page/Meetting/MeettingTaskEdit'))

const MeettingTopic = React.lazy(()=>import('../page/Meetting/MeettingTopic'))
const MeettingTopicEdit = React.lazy(()=>import('../page/Meetting/MeettingTopicEdit'))
const MeettingPaper = React.lazy(()=>import('../page/Meetting/MeettingPaper'))
const MeettingPaperEdit = React.lazy(()=>import('../page/Meetting/MeettingPaperEdit'))
const MeettingLabel = React.lazy(()=>import('../page/Meetting/MeettingLabel'))

const h5ds = React.lazy(()=>import('../page/h5ds/h5'))
const Year = React.lazy(()=>import('../page/h5ds/Year'))
const KeywordSetting = React.lazy(()=>import('../page/h5ds/KeywordSetting'))

const ImgDown = React.lazy(()=>import('../page/ImgDownload'))
const ImgDownEdit = React.lazy(()=>import('../page/ImgDownload/ImgDownEdit'))

const Province = React.lazy(()=>import('../page/Province/Province'))

const Rank = React.lazy(()=>import('../page/Rank/Rank'))
const RankEdit = React.lazy(()=>import('../page/Rank/RankEdit'))
const RankList = React.lazy(()=>import('../page/Rank/RankList'))
const Seed = React.lazy(()=>import('../page/Tree/Seed'))
const SeedEdit = React.lazy(()=>import('../page/Tree/SeedEdit'))
const Manual = React.lazy(()=>import('../page/Tree/Manual'))
const ManualEdit = React.lazy(()=>import('../page/Tree/ManualEdit'))

const TreeGoods = React.lazy(()=>import('../page/Tree/TreeGoods'))
const TreeGoodsEdit = React.lazy(()=>import('../page/Tree/TreeGoodsEdit'))

const ExchangeList = React.lazy(()=>import('../page/Tree/ExchangeList'))
const Sun = React.lazy(()=>import('../page/Tree/Sun'))

const GameManager= React.lazy(() => import('../page/GameManager/SpecialGame'));
const LevelManager= React.lazy(() => import('../page/GameManager/LevelManager'));

const RankExerciseManager = React.lazy(() => import('../page/RankPaperManager/ExerciseManager'));
const RankPaperManager= React.lazy(() => import('../page/RankPaperManager/RankPaperManager'));
const RankQuestionClassify =  React.lazy(() => import('../page/RankPaperManager/RankQuestionClassify'));
const EditRankQuestion= React.lazy(() => import('../page/RankPaperManager/EditRankQuestion'));
const AddRankQuestion= React.lazy(() => import('../page/RankPaperManager/AddRankQuestion'));
const routes = [
  { key: 'underActiveMng', path: '/underactive',exact:true,name: '线下活动管理', component: UnderlineActive },
  { key: 'underActive/edit', path: '/underactive/edit/:id',exact:true,name: '线下活动修改', component: UnderlineEdit },
  { key: 'underActive/view', path: '/underactive/view/:id',exact:true,name: '线下活动查看', component: UnderlineEdit },
  { key: 'underActive/add', path: '/underactive/add/:id',exact:true,name: '添加', component: UnderlineEdit },
  { key: 'underActive/user', path: '/underactive/user/:id',exact:true,name: '查看报名', component: UnderlineActiveUser },

  { key: 'fundMng', path: '/fund',exact:true,name: '资金管理管理', component: Fapiao },
  { key: 'fapiao', path: '/fund/fapiao',exact:true,name: '发票管理', component: Fapiao },
  { key: 'transaction', path: '/fund/transaction',exact:true,name: '财务确认', component:Transaction },
  { key: 'withdraw', path: '/fund/withdraw',exact:true,name: '提现管理', component: WithDraw },
 

  { key: 'courseOrder', path: '/mall/courseOrder',exact:true,name: '课程订单管理', component: CourseOrder },

  { key: 'studymap', path: '/topic/study-map',exact:true,name: '学习地图管理', component: StudyMap },
  { key: 'studymap/edit', path: '/topic/study-map/edit/:view/:id',exact:true,name: '关卡编辑', component: StudyMapEdit },
  { key: 'studymapo2o', path: '/topic/o2oStudyMap',exact:true,name: '学习地图O2O管理', component: StudyMapO2O },
  { key: 'studymapo2o/edit', path: '/topic/o2oStudyMap/edit/:mapId/:id',exact:true,name: '关卡编辑', component: StudyMapO2OEdit },
  { key: 'studymapo2o/view', path: '/topic/o2oStudyMap/view/:mapId/:id',exact:true,name: '关卡编辑', component: StudyMapO2OEdit },

  { key: 'taskRecord', path: '/member-manager/task/record',exact:true,name: '任务记录', component: TaskRecord },
  { key: 'task', path: '/member-manager/task',exact:true,name: '任务管理', component: TaskManager },

  { key: '', path: '/pkmatch',name: '专题赛管理', component: PkMatch },
  { key: '', path: '/pklevel',name: '段位管理', component: PkLevel },
  { key: '', path: '/message',name: '消息', component: Message },
  { key: 'ui', path: '/web-manager/ui',name: 'UI装修管理', component: UI },
  { key: 'feedlist/view', path: '/web-manager/feedback/listView/:id',name: '查看问题', component: FeedbackInfo },
  { key: 'feedlist/edit', path: '/web-manager/feedback/listEdit/:id',name: '修改问题', component: FeedbackInfo },
  { key: 'feedlist', path: '/web-manager/feedback',name: '帮助反馈管理', component: Feedback },
  { key: 'mediaMng', path: '/media',exact:true,name: '素材库', component: MediaManager },
  { key: 'mapTopic', path: '/topic',exact:true,name: '题库管理', component: Topic },
  { key: 'mapTopic', path: '/topic/list',exact:true,name: '题库列表', component: Topic },
  { key: 'mapPaper', path: '/topic/paper',exact:true,name: '试卷管理', component: Paper },
  { key: 'mapTopic/edit', path: '/topic/list/edit/:ctype/:id',exact:true,name: '题目编辑', component: TopicEdit },
  { key: 'mapPaper/edit', path: '/topic/paper/edit/:id/:ctype',exact:true,name: '试卷编辑', component: PaperEdit },
  { key: 'mapTopicCate', path: '/topic/classify',exact:true,name: '题目分类管理', component: TopicClassify },

  { key: 'inventoryTran/edit', path: '/mall/inventory-transport/apply/:id',exact:true,name: '出入库申请', component: InventoryApply },
  { key: 'inventoryTran', path: '/mall/inventory-transport',exact:true,name: '出入库管理', component: InventoryTrans },
  { key: 'inventory', path: '/mall/inventory',exact:true,name: '库存管理', component: Inventory },
  { key: 'express/setting', path: '/mall/express/edit/:id',exact:true,name: '运费配置', component: ExpressEdit }, 
  { key: 'express', path: '/mall/express',exact:true,name: '物流管理', component: Express }, 
  { key: 'goodsReturn', path: '/mall/goods-return',exact:true,name: '退换货管理', component: GoodsReturn }, 
  // { key: '', path: '/mall/goods-return',exact:true,name: '退换货管理', component: GoodsReturn }, 
  { key: 'goodsActive/edit', path: '/mall/goods-active/edit/:id',exact:true,name: '促销活动编辑', component: PromotionActiveEdit }, 
  { key: 'goodsActive', path: '/mall/goods-active',exact:true,name: '促销活动管理', component: GoodsActiveManager }, 
  { key: 'order', path: '/mall/goods-order',exact:true,name: '订单管理', component: OrderManager }, 
  { key: 'goodsType/rule', path: '/mall/goods-type/rull/:id',exact:true,name: '商品类型规则', component: GoodsTypeRull }, 
  { key: 'goodsType', path: '/mall/goods-type',exact:true,name: '商品类型管理', component: GoodsType }, 
  { key: 'goodsBrand', path: '/mall/brand',exact:true,name: '商品品牌管理', component: MallBrand },
  { key: 'goodsCate', path: '/mall/cate',exact:true,name: '商品分类管理', component: MallCate },
  { key: 'goods/edit', path: '/mall/list/edit/:id',exact:true,name: '商品编辑', component: GoodsEdit },
  { key: 'goods', path: '/mall/list',exact:true,name: '商品管理', component: Mall },
  { key: 'mallMng', path: '/mall',exact:true,name: '商城管理', component: Mall },
  { key: 'couponMng', path: '/mall/coupon',exact:true,name: '优惠券管理', component: Coupon },
  { key: 'coupon/edit', path: '/mall/coupon/edit/:id',exact:true,name: '优惠券编辑', component: CouponEdit },
  { key: 'coupon/view', path: '/mall/coupon/view/:id',exact:true,name: '优惠券查看', component: CouponEdit },
  { key: 'coupon/add', path: '/mall/coupon/add/:id',exact:true,name: '优惠券添加', component: CouponEdit },
  
  { key: 'couponYCMng', path: '/mall/couponYC',name: '油葱商城优惠码管理', component: CouponYC },
  
  { key: 'authTopic', path: '/auth/topic',exact:true,name: '练习题目管理', component: AuthTopic },
  { key: 'authTopic/edit', path: '/auth/topic/edit/:id',exact:true,name: '题目编辑', component: AuthTopicEdit },
  { key: 'authVideo/edit', path: '/auth/course/edit/:id',exact:true,name: '视频课程 编辑', component: AuthCourseEdit },
  { key: 'authVideo', path: '/auth/course',exact:true,name: '视频课程导入', component: AuthCourse },
  { key: 'authPaper/edit', path: '/auth/paper/edit/:id',exact:true,name: '考题 编辑', component: AuthPaperEdit },
  { key: 'authPaper', path: '/auth/paper',exact:true,name: '考题管理', component: AuthPaper },
  { key: 'authTcate', path: '/auth/topic-cate',exact:true,name: '练习题分类设置', component: AuthCourseCate },
  { key: 'authVcate', path: '/auth/course-cate',exact:true,name: '视频课程分类设置', component: AuthCourseCate },
  { key: 'authClass/edit', path: '/auth/edit/:id',exact:true,name: '培训班设置', component: AuthClassEdit },
  { key: 'authClass', path: '/auth',exact:true,name: '资格认证管理', component: AuthClassMng },
  
  { key: 'authClass', path: '/auth/class-new',exact:true,name: '创建班级', component: AuthClassMng },
  { key: 'underlineClass', path: '/auth/class-underline',exact:true,name: '线下课程管理', component: AuthClassMng },
  { key: 'authClass', path: '/auth/list',exact:true,name: '报名与信息管理', component: AuthClassMng },

  { key: 'authClass/edit', path: '/auth/class-new/edit/:id',exact:true,name: '培训班编辑', component: AuthClassEdit },
  { key: 'authClass/score', path: '/auth/class-new/score/:id',exact:true,name: '成绩管理', component: AuthClassScore },
  { key: 'underlineClass/edit', path: '/auth/class-underline/edit/:id',exact:true,name: '编辑', component: AuthClassEdit },
  { key: '', path: '/auth/list/edit/:id',exact:true,name: '报名与信息管理 编辑', component: AuthClassEdit },

  { key: '', path: '/auth/class-new/user/:id',exact:true,name: '创建班级 查看报名', component: AuthClassUser },
  { key: 'underlineClass/apply', path: '/auth/class-underline/user/:id',exact:true,name: '线下培训班查看报名', component: AuthClassUser },
  { key: 'authClass/apply', path: '/auth/list/user/:id',exact:true,name: '报名与信息管理 查看报名', component: AuthClassUser },

  { key: 'activity/result', path: '/activity/result/:atype/:id',name: '查看活动结果', component: ActivityResult },

  { key: 'activity/edit', path: '/activity/edit/:view/:id',name: '活动设置', component: ActivityEdit },
  { key: 'activityMng', path: '/activity',exact:true,name: '活动管理', component: ActivityMng },
  { key: 'special/edit', path: '/col/edit/:id',name: '专题设置', component: ColEdit },
  { key: 'specialMng', path: '/col',exact:true,name: '专题管理', component: ColMng },
  { key: 'aboutMng', path: '/about',name: '关于我们', component: AboutUs },
  { key: 'o2onews/edit', path: '/o2o/o2oNews/edit/:id',name: 'O2O资讯设置', component: O2ONewsEdit },
  { key: 'o2onews', path: '/o2o/o2oNews',exact:true,name: 'O2O资讯', component: O2ONews },
  { key: 'o2oClass/user', path: '/o2o/o2oClass/user/:id',exact:true,name: '查看报名', component: TrainingClassUser },
  { key: 'o2oClass/edit', path: '/o2o/edit/:id',exact:true,name: '培训班设置', component: TrainingClassEdit },
  { key: 'o2oClass', path: '/o2o/o2oClass',exact:true,name: '培训班管理', component: TrainingClassMng },

  { key: 'courseM/chapter', path: '/course-manager/MediaCourse/MediaChapterSetting/:id',name: '音频章节设置', component: MediaChapterSetting },
  { key: 'courseM/edit', path: '/course-manager/MediaCourse/MediaEdit/:id',name: '音频设置', component: MediaEdit },
  { key: 'courseM', path: '/course-manager/MediaCourse',exact: true,name: '音频课程', component: MediaCourse },
  
  { key: 'live/edit', path: '/live/add/:id',name: '直播设置', component: AddLive },
  { key: 'liveGift', path: '/live/gift',name: '礼物管理', component: GiftManager },

  { key: 'live/chapter', path: '/live/chapter/:course_id',name: '章节设置', component: ChapterSetting },
  { key: 'live/mng', path: '/liveroom/:id',name: '直播过程管理', component: LiveView },
  { key: 'live', path: '/live/list',name: '直播列表', component: LiveManager },
  { key: 'live', path: '/live',exact: true,name: '直播管理', component: LiveManager },

  { key: 'newsLabel', path: '/news/label', name: '标签管理', component: NewsLabel },
  { key: 'news', path: '/news/list', exact: true, name: '资讯管理', component: News },
  { key: 'news', path: '/news', exact: true, name: '资讯管理', component: News },
  { key: 'news/edit', path: '/news/edit/:id', exact: true, name: '资讯编辑', component: EditNews },

  { key: 'workbenchMng', path: '/', exact: true, name: '工作台'},
  { key: 'dashboard', path: '/dashboard', name: '仪表盘', component: Dashboard },

  { key: 'user/add', path: '/user-manager/add-user/:id', name: '添加用户', component: AddUser },
  

  { key: 'teacher', path: '/user-manager/teacher/', exact: true, name: '讲师管理', component: Teacher },

  { key: 'todo', path: '/todo-list', exact: true,name: '待办事项', component: TodoList },
  { key: 'comment', path: '/todo-list/comment-list/:ctype/:id', name: '评论列表', component: Comment },
  { key: 'comment／edit', path: '/todo-list/comment-list/:ctype/:id', name: '评论列表', component: Comment },

  { key: 'post', path: '/todo-list/post-list',name: '邮寄列表', component: PostList },
  { key: 'feedback', path: '/feedback-list', exact: true, name: '反馈列表', component: FeedbackList },
  { key: 'feedback/cate', path: '/feedback-list/feedback-classify', name: '反馈分类', component: FeedbackClassify },

  { key: 'statistic', path: '/workbench/stat', exact:true, name: '数据统计', component: Stat },
 
  { key: 'excel', path: '/workbench/excel-manager', name: '报表管理', component: ExcelManager },
  { key: '', path: '/workbench/excel-manager/excel-detail', name: '报表详情', component: ExcelDetail },
  
  { key: 'medal/view', path: '/member-manager/medal/view/:id',name: '徽章查看', component: MedalEdit },
  { key: 'medal/edit', path: '/member-manager/medal/edit/:id',name: '徽章编辑', component: MedalEdit },
  { key: 'medal', path: '/member-manager/medal',name: '徽章管理', component: Medal },
  { key: 'user', path: '/member-manager', exact:true, name: '会员管理', component: User },
  { key: 'user', path: '/member-manager/list',name: '用户列表', component: User },
  { key: 'user/edit', path: '/member-manager/user-info/:index', name: '编辑用户', component: UserInfo },
  { key: 'user/view', path: '/member-manager/user-view/:userId', name: '用户查看', component: UserView },
  { key: 'coin', path: '/member-manager/coin-setting',name: '金币规则设置', component: CoinSetting },
  { key: 'level', path: '/member-manager/level-setting',name: '会员等级设置', component: LevelSetting },
  { key: 'profit', path: '/member-manager/profit-setting',name: '会员权益设置', component: ProfitSetting },
  
  { key: 'teacher', path: '/teacher', exact:true, name: '讲师管理', component: Teacher },
  
  { key: 'teacherRank/view', path: '/teacher/rank/edit/:view/:id',exact:true, name: '详情', component: TeacherApplyEdit },
  { key: 'teacherApply/add', path: '/teacher/apply/edit/:view/:id',exact:true, name: '讲师申请', component: TeacherApplyEdit },
  { key: 'teacherApply/view', path: '/teacher/apply/check/:view/:id',exact:true, name: '讲师审核', component: TeacherApplyCheck },
  { key: 'teacherApply', path: '/teacher/apply',exact:true, name: '讲师申请管理', component: TeacherApply },
  { key: 'teacherRank', path: '/ranks',exact:true, name: '讲师定级管理', component: TeacherRanks },

  { key: 'teacher', path: '/teacher/list', exact:true, name: '讲师管理', component: Teacher },

  { key: 'teacher/view', path: '/teacher-manager/teacher-detail/:id', name: '讲师详情', component: TeacherDetail },
  { key: 'teacher/edit', path: '/teacher-manager/teacher-edit/:id', name: '讲师编辑', component: TeacherEdit },
  { key: 'teacherPro', path: '/member-manager/teacherLevel', name: '讲师权益管理', component: TeacherLevel },
  { path: '/teacher-manager/teacherAsk/:atype/:id', name: '讲师问卷', component: TeacherAsk },


  { key: 'courseV', path: '/course-manager',exact:true,name: '课程管理', component: CourseManager },
  { key: 'courseV', path: '/course-manager/video-course/:current_page',name: '视频课程', component: CourseManager },
  { key: 'classify', path: '/course-manager/course-classify', name: '课程分类', component: CourseClassify },
  { key: 'label', path: '/course-manager/label-manager',exact:true, name: '标签管理', component: LabelManager },
  { key: 'newsLabel/view', path: '/course-manager/label-detail/:id',exact:true, name: '标签所有课程', component: LabelDetail },
  
  { key: 'courseV/edit', path: '/course-manager/edit-course/:course_id', name: '编辑视频课程', component: EditCourse },
  { key: 'courseV/view', path: '/course-manager/view-course/:course_id', name: '视频课程详情', component: EditCourse },
  { key: 'courseS/edit', path: '/course-manager/edit-static-course/:course_id', name: '编辑图文课程', component: EditStaticCourse },
  { key: 'courseS/view', path: '/course-manager/view-static-course/:course_id', name: '图文课程详情', component: EditStaticCourse },
  { key: 'courseS', path: '/course-manager/static-course',name: '图文课程', component: StaticCourse },

  { key: 'courseV/chapter', path: '/course-manager/chapter-setting/:course_id',name: '章节设置', component: ChapterSetting },
  { key: 'column', path: '/course-manager/column-list',exact:true,name: '专栏列表', component: ColumnList },

  
  { key: 'column/course', path: '/course-manager/recommend-list/:channel_id',name: '专栏列表', component: RecommendList },
  { key: 'column/add', path: '/course-manager/create-recourse',name: '创建专栏', component: EditReCourse },
  { key: 'column/view', path: '/course-manager/view-recourse/:channel',name: '查看专栏', component: EditReCourse },
  { key: 'column/edit', path: '/course-manager/edit-recourse/:channel',name: '修改专栏', component: EditReCourse },

    { path: '/ask/cate',name: '标签管理', component: AskCate },
  { path: '/ask/edit/:id',name: '问题编辑', component: AskEdit },
  { path: '/ask/comment',name: '回答管理', component: AskComment },
  { path: '/ask/list',exact:true,name: '问答管理', component: Ask },
  { path: '/ask',exact:true,name: '问答管理', component: Ask },

  { key:'lanmu', path: '/meetting/classify',exact:true,name: '研讨会课程栏目管理', component: MeettingLabel },
  { key:'biaoqian', path: '/meetting/label',exact:true,name: '标签管理', component: MeettingLabel },

  { key:'shijuan/edit', path: '/meetting/topic/paper/edit/:id',exact:true, name: '试卷编辑', component: MeettingPaperEdit },
  { key:'shijuan/view', path: '/meetting/topic/paper/edit/:id',exact:true, name: '试卷查看', component: MeettingPaperEdit },
  { key:'shijuan', path: '/meetting/topic/paper',exact:true,name: '试卷管理', component: MeettingPaper },

  { key:'tikulist/edit',path: '/meetting/topic/edit/:id',exact:true,name: '题目编辑', component: MeettingTopicEdit },
  { key:'tikulist', path: '/meetting/topic/list',exact:true,name: '研讨会题目列表', component: MeettingTopic },
  { key:'tiku', path: '/meetting/topic',exact:true,name: '研讨会题库', component: MeettingTopic },

  { key:'tasks/view', path: '/meetting/task/view/:id',exact:true,name: '闯关任务查看', component: MeettingTaskEdit },
  { key:'tasks/edit', path: '/meetting/task/edit/:id',exact:true,name: '闯关任务修改', component: MeettingTaskEdit },
  { key:'tasks', path: '/meetting/task',exact:true,name: '闯关任务管理', component: MeettingTask },

  { key:'activity/view', path: '/meetting/activity/view/:id',exact:true,name: '精彩瞬间查看', component: MeettingActivityEdit },
  { key:'activity/edit', path: '/meetting/activity/edit/:id',exact:true,name: '精彩瞬间修改', component: MeettingActivityEdit },
  { key:'activity', path: '/meetting/activity',exact:true,name: '精彩瞬间管理', component: MeettingActivity },
  { key:'users/edit', path: '/meetting/user/edit/:id/:tagId',exact:true,name: '用户编辑', component: MeettingUserEdit },
  { key:'users/view', path: '/meetting/user/view/:id/:tagId',exact:true,name: '用户详情', component: MeettingUserEdit },
  { key:'users', path: '/meetting/user',exact:true,name: '名单管理', component: MeettingUser },
  { key:'mood', path: '/meetting/mood',exact:true,name: '心情墙管理', component: Mood },
  { key:'meetting', path: '/meetting',exact:true,name: '研讨会', component: Meetting },
  { key:'kechen', path: '/meetting/list',exact:true,name: '研讨会课程管理', component: Meetting },
  { key:'kechen/edit',path: '/meetting/edit/:id',name: '编辑课程', component: MeettingEdit },
  { key:'kechen/view',path: '/meetting/view/:id',name: '查看课程', component: MeettingEdit },
  { key:'meetcomment',path: '/meetting/comment',name: '研讨会课程评论', component: MeettingComment },

  { key: 'ad', path: '/web-manager',exact:true,name: '运营管理', component: AdManager },
  { key: 'ad', path: '/web-manager/ad-manager',exact:true,name: '广告管理', component: AdManager },
  { key: 'ad/edit', path: '/web-manager/ad-manager/edit-ad/:bill_id',name: '广告编辑', component: EditAd },

  { key: 'msg', path: '/web-manager/msg-manager',exact:true,name: '消息管理', component: MsgManager},
  { key: 'msg/edit', path: '/web-manager/msg-manager/edit-msg/:view/:index',name: '消息编辑', component: EditMsg},

  { key: 'guagua', path: '/web-manager/guagua',exact:true,name: '刮刮卡管理', component: GuaGua },
  { key: 'guagua/list', path: '/web-manager/guagua/lucky-list',exact:true,name: '刮刮卡获奖列表', component: GuaGuaLuckyList },

  { key: 'search', path: '/web-manager/search-manager',name: '搜索管理', component: SearchManager},
  { key: 'cardActive', path: '/web-manager/active-manager',exact:true,name: '活动管理', component: ActiveManager},
  { key: 'cardActive/list', path: '/web-manager/active-manager/lucky-list',name: '获奖列表', component: LuckyList},
  { key: 'sen', path: '/web-manager/bandfilter', name: '敏感词管理', component: BandFilter },
  
  { key: 'invite/view', path: '/web-manager/invite-manager/info/:id',exact:true,name: '查看邀请明细', component: InviteDetail },
  { key: 'invite', path: '/web-manager/invite-manager',exact:true, name: '邀请管理', component: InviteManager },
  { key: 'inviteImg', path: '/web-manager/invite-manager/picture', name: '推荐图片管理', component: InvitePicture },
  { key: 'tmp', path: '/web-manager/tmp-manager',exact:true,name: '模板管理', component: TmpManager },
  { key: 'tmp/add', path: '/web-manager/tmp-manager/add-tmp', name: '添加模板', component: AddTmp },
  { key: 'tmp/view', path: '/web-manager/tmp-manager/view-tmp/:index', name: '模板详情', component: ViewTmp },
  { key: 'tmp/edit', path: '/web-manager/tmp-manager/edit-tmp/:index', name: '修改模板', component: EditTmp },
  
  { key: 'auth', path: '/system-manager',exact:true, name: '系统管理', component: AuthManager },
  { key: 'admin', path: '/system-manager/admin',name: '管理员管理', component: AdminManager },
  { key: 'log', path: '/system-manager/log',name: '日志管理', component: LogManager },
  { key: 'auth', path: '/system-manager/auth',exact:true,name: '权限管理', component: AuthManager },
  { key: 'auth', path: '/system-manager/exauth',exact:true,name: '特殊权限管理', component: EXAuthManager },

  { key: 'auth/add', path: '/system-manager/auth/add',name: '添加管理组', component: EditRole },
  { key: 'auth/edit', path: '/system-manager/auth/edit/:id',name: '修改管理组', component: EditRole },

  { key: 'year/setting', path: '/year/setting',exact:true,name: '关键词设置', component: KeywordSetting },
  { key: 'year', path: '/year',exact:true,name: '年度账单管理', component: Year },
  { key: 'year/edit', path: '/year/h5ds/:id',exact:true,name: '年度账单', component: h5ds },

  { key: 'imgDownLoad/view', path: '/imgdownload/view/:id/:page/:ftype',exact:true,name: '图集查看', component: ImgDownEdit },
  { key: 'imgDownLoad/edit', path: '/imgdownload/edit/:id/:page/:ftype',exact:true,name: '图集编辑', component: ImgDownEdit },
  { key: 'imgDownLoad', path: '/imgdownload',exact:true,name: '下载专区管理', component: ImgDown },

  { key: 'province', path: '/province',exact:true,name: '风采省份管理', component: Province },

  { key: 'rank/view', path: '/rank/list/:id/:rank/:begin/:end',exact:true,name: '查看名单', component: RankList },
  { key: 'rank/edit', path: '/rank/edit/:id',exact:true,name: '奖品设置', component: RankEdit },
  { key: 'rank', path: '/rank',exact:true,name: '榜单管理', component: Rank },

  { key:'exchanges', path: '/tree/goods/exchange',exact:true,name: '兑换列表', component: ExchangeList },
  { key:'goodslist/view', path: '/tree/goods/view/:id',exact:true,name: '查看商品', component: TreeGoodsEdit },
  { key:'goodslist/edit', path: '/tree/goods/edit/:id',exact:true,name: '商品编辑', component: TreeGoodsEdit },
  { key:'treegoods', path: '/tree/goods',exact:true,name: '兑换管理', component: TreeGoods },
  { key:'exchanges', path: '/tree/goods/list',exact:true,name: '兑换列表', component: TreeGoods },
  { key:'manual', path: '/tree/manual',exact:true,name: '攻略管理', component: Manual },
  { key:'manual/edit', path: '/tree/manual/edit/:id',exact:true,name: '攻略编辑', component: ManualEdit },
  { key:'seed/view', path: '/tree/seed/view/:id',exact:true,name: '查看', component: SeedEdit },
  { key:'seed/edit', path: '/tree/seed/edit/:id',exact:true,name: '编辑', component: SeedEdit },
  { key:'seed', path: '/tree/seed',exact:true,name: '种子管理', component: Seed },
  { key:'suns', path: '/tree/sun',exact:true,name: '阳光管理', component: Sun },
  { key:'tree', path: '/tree',exact:true,name: '完美林', component: Seed },

  { key:'levelManager', path: '/game-manager/levelManager',name: '段位管理', component: LevelManager },
  { key:'specialGame', path: '/game-manager/specialGame',name: '专题赛管理', component: GameManager },
  { key:'GameManager', path: '/game-manager',name: '趣味探索管理', component: GameManager },

  { key:'rankPaper', path: '/rankPaper-manager',exact:true,name: '趣味探索题库管理', component: RankExerciseManager },
  { key:'QuestionClassify/edit', path: '/rankPaper-manager/edit/:id',name: '修改题目', component: EditRankQuestion },
  { key:'QuestionClassify/edit', path: '/rankPaper-manager/add',name: '发布题目', component: AddRankQuestion },
  { key:'QuestionClassify/check', path: '/rankPaper-manager/check',exact:true,name: '题目审核', component: RankPaperManager },
  { key:'rankPaper', path: '/rankPaper-manager/list',exact:true,name: '趣味探索题库管理', component: RankExerciseManager },
  { key:'QuestionClassifys', path: '/rankPaper-manager/QuestionClassify',name: '题目分类管理', component: RankQuestionClassify },
];

export default routes;
