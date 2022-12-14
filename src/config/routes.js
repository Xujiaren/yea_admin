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
  { key: 'underActiveMng', path: '/underactive',exact:true,name: '??????????????????', component: UnderlineActive },
  { key: 'underActive/edit', path: '/underactive/edit/:id',exact:true,name: '??????????????????', component: UnderlineEdit },
  { key: 'underActive/view', path: '/underactive/view/:id',exact:true,name: '??????????????????', component: UnderlineEdit },
  { key: 'underActive/add', path: '/underactive/add/:id',exact:true,name: '??????', component: UnderlineEdit },
  { key: 'underActive/user', path: '/underactive/user/:id',exact:true,name: '????????????', component: UnderlineActiveUser },

  { key: 'fundMng', path: '/fund',exact:true,name: '??????????????????', component: Fapiao },
  { key: 'fapiao', path: '/fund/fapiao',exact:true,name: '????????????', component: Fapiao },
  { key: 'transaction', path: '/fund/transaction',exact:true,name: '????????????', component:Transaction },
  { key: 'withdraw', path: '/fund/withdraw',exact:true,name: '????????????', component: WithDraw },
 

  { key: 'courseOrder', path: '/mall/courseOrder',exact:true,name: '??????????????????', component: CourseOrder },

  { key: 'studymap', path: '/topic/study-map',exact:true,name: '??????????????????', component: StudyMap },
  { key: 'studymap/edit', path: '/topic/study-map/edit/:view/:id',exact:true,name: '????????????', component: StudyMapEdit },
  { key: 'studymapo2o', path: '/topic/o2oStudyMap',exact:true,name: '????????????O2O??????', component: StudyMapO2O },
  { key: 'studymapo2o/edit', path: '/topic/o2oStudyMap/edit/:mapId/:id',exact:true,name: '????????????', component: StudyMapO2OEdit },
  { key: 'studymapo2o/view', path: '/topic/o2oStudyMap/view/:mapId/:id',exact:true,name: '????????????', component: StudyMapO2OEdit },

  { key: 'taskRecord', path: '/member-manager/task/record',exact:true,name: '????????????', component: TaskRecord },
  { key: 'task', path: '/member-manager/task',exact:true,name: '????????????', component: TaskManager },

  { key: '', path: '/pkmatch',name: '???????????????', component: PkMatch },
  { key: '', path: '/pklevel',name: '????????????', component: PkLevel },
  { key: '', path: '/message',name: '??????', component: Message },
  { key: 'ui', path: '/web-manager/ui',name: 'UI????????????', component: UI },
  { key: 'feedlist/view', path: '/web-manager/feedback/listView/:id',name: '????????????', component: FeedbackInfo },
  { key: 'feedlist/edit', path: '/web-manager/feedback/listEdit/:id',name: '????????????', component: FeedbackInfo },
  { key: 'feedlist', path: '/web-manager/feedback',name: '??????????????????', component: Feedback },
  { key: 'mediaMng', path: '/media',exact:true,name: '?????????', component: MediaManager },
  { key: 'mapTopic', path: '/topic',exact:true,name: '????????????', component: Topic },
  { key: 'mapTopic', path: '/topic/list',exact:true,name: '????????????', component: Topic },
  { key: 'mapPaper', path: '/topic/paper',exact:true,name: '????????????', component: Paper },
  { key: 'mapTopic/edit', path: '/topic/list/edit/:ctype/:id',exact:true,name: '????????????', component: TopicEdit },
  { key: 'mapPaper/edit', path: '/topic/paper/edit/:id/:ctype',exact:true,name: '????????????', component: PaperEdit },
  { key: 'mapTopicCate', path: '/topic/classify',exact:true,name: '??????????????????', component: TopicClassify },

  { key: 'inventoryTran/edit', path: '/mall/inventory-transport/apply/:id',exact:true,name: '???????????????', component: InventoryApply },
  { key: 'inventoryTran', path: '/mall/inventory-transport',exact:true,name: '???????????????', component: InventoryTrans },
  { key: 'inventory', path: '/mall/inventory',exact:true,name: '????????????', component: Inventory },
  { key: 'express/setting', path: '/mall/express/edit/:id',exact:true,name: '????????????', component: ExpressEdit }, 
  { key: 'express', path: '/mall/express',exact:true,name: '????????????', component: Express }, 
  { key: 'goodsReturn', path: '/mall/goods-return',exact:true,name: '???????????????', component: GoodsReturn }, 
  // { key: '', path: '/mall/goods-return',exact:true,name: '???????????????', component: GoodsReturn }, 
  { key: 'goodsActive/edit', path: '/mall/goods-active/edit/:id',exact:true,name: '??????????????????', component: PromotionActiveEdit }, 
  { key: 'goodsActive', path: '/mall/goods-active',exact:true,name: '??????????????????', component: GoodsActiveManager }, 
  { key: 'order', path: '/mall/goods-order',exact:true,name: '????????????', component: OrderManager }, 
  { key: 'goodsType/rule', path: '/mall/goods-type/rull/:id',exact:true,name: '??????????????????', component: GoodsTypeRull }, 
  { key: 'goodsType', path: '/mall/goods-type',exact:true,name: '??????????????????', component: GoodsType }, 
  { key: 'goodsBrand', path: '/mall/brand',exact:true,name: '??????????????????', component: MallBrand },
  { key: 'goodsCate', path: '/mall/cate',exact:true,name: '??????????????????', component: MallCate },
  { key: 'goods/edit', path: '/mall/list/edit/:id',exact:true,name: '????????????', component: GoodsEdit },
  { key: 'goods', path: '/mall/list',exact:true,name: '????????????', component: Mall },
  { key: 'mallMng', path: '/mall',exact:true,name: '????????????', component: Mall },
  { key: 'couponMng', path: '/mall/coupon',exact:true,name: '???????????????', component: Coupon },
  { key: 'coupon/edit', path: '/mall/coupon/edit/:id',exact:true,name: '???????????????', component: CouponEdit },
  { key: 'coupon/view', path: '/mall/coupon/view/:id',exact:true,name: '???????????????', component: CouponEdit },
  { key: 'coupon/add', path: '/mall/coupon/add/:id',exact:true,name: '???????????????', component: CouponEdit },
  
  { key: 'couponYCMng', path: '/mall/couponYC',name: '???????????????????????????', component: CouponYC },
  
  { key: 'authTopic', path: '/auth/topic',exact:true,name: '??????????????????', component: AuthTopic },
  { key: 'authTopic/edit', path: '/auth/topic/edit/:id',exact:true,name: '????????????', component: AuthTopicEdit },
  { key: 'authVideo/edit', path: '/auth/course/edit/:id',exact:true,name: '???????????? ??????', component: AuthCourseEdit },
  { key: 'authVideo', path: '/auth/course',exact:true,name: '??????????????????', component: AuthCourse },
  { key: 'authPaper/edit', path: '/auth/paper/edit/:id',exact:true,name: '?????? ??????', component: AuthPaperEdit },
  { key: 'authPaper', path: '/auth/paper',exact:true,name: '????????????', component: AuthPaper },
  { key: 'authTcate', path: '/auth/topic-cate',exact:true,name: '?????????????????????', component: AuthCourseCate },
  { key: 'authVcate', path: '/auth/course-cate',exact:true,name: '????????????????????????', component: AuthCourseCate },
  { key: 'authClass/edit', path: '/auth/edit/:id',exact:true,name: '???????????????', component: AuthClassEdit },
  { key: 'authClass', path: '/auth',exact:true,name: '??????????????????', component: AuthClassMng },
  
  { key: 'authClass', path: '/auth/class-new',exact:true,name: '????????????', component: AuthClassMng },
  { key: 'underlineClass', path: '/auth/class-underline',exact:true,name: '??????????????????', component: AuthClassMng },
  { key: 'authClass', path: '/auth/list',exact:true,name: '?????????????????????', component: AuthClassMng },

  { key: 'authClass/edit', path: '/auth/class-new/edit/:id',exact:true,name: '???????????????', component: AuthClassEdit },
  { key: 'authClass/score', path: '/auth/class-new/score/:id',exact:true,name: '????????????', component: AuthClassScore },
  { key: 'underlineClass/edit', path: '/auth/class-underline/edit/:id',exact:true,name: '??????', component: AuthClassEdit },
  { key: '', path: '/auth/list/edit/:id',exact:true,name: '????????????????????? ??????', component: AuthClassEdit },

  { key: '', path: '/auth/class-new/user/:id',exact:true,name: '???????????? ????????????', component: AuthClassUser },
  { key: 'underlineClass/apply', path: '/auth/class-underline/user/:id',exact:true,name: '???????????????????????????', component: AuthClassUser },
  { key: 'authClass/apply', path: '/auth/list/user/:id',exact:true,name: '????????????????????? ????????????', component: AuthClassUser },

  { key: 'activity/result', path: '/activity/result/:atype/:id',name: '??????????????????', component: ActivityResult },

  { key: 'activity/edit', path: '/activity/edit/:view/:id',name: '????????????', component: ActivityEdit },
  { key: 'activityMng', path: '/activity',exact:true,name: '????????????', component: ActivityMng },
  { key: 'special/edit', path: '/col/edit/:id',name: '????????????', component: ColEdit },
  { key: 'specialMng', path: '/col',exact:true,name: '????????????', component: ColMng },
  { key: 'aboutMng', path: '/about',name: '????????????', component: AboutUs },
  { key: 'o2onews/edit', path: '/o2o/o2oNews/edit/:id',name: 'O2O????????????', component: O2ONewsEdit },
  { key: 'o2onews', path: '/o2o/o2oNews',exact:true,name: 'O2O??????', component: O2ONews },
  { key: 'o2oClass/user', path: '/o2o/o2oClass/user/:id',exact:true,name: '????????????', component: TrainingClassUser },
  { key: 'o2oClass/edit', path: '/o2o/edit/:id',exact:true,name: '???????????????', component: TrainingClassEdit },
  { key: 'o2oClass', path: '/o2o/o2oClass',exact:true,name: '???????????????', component: TrainingClassMng },

  { key: 'courseM/chapter', path: '/course-manager/MediaCourse/MediaChapterSetting/:id',name: '??????????????????', component: MediaChapterSetting },
  { key: 'courseM/edit', path: '/course-manager/MediaCourse/MediaEdit/:id',name: '????????????', component: MediaEdit },
  { key: 'courseM', path: '/course-manager/MediaCourse',exact: true,name: '????????????', component: MediaCourse },
  
  { key: 'live/edit', path: '/live/add/:id',name: '????????????', component: AddLive },
  { key: 'liveGift', path: '/live/gift',name: '????????????', component: GiftManager },

  { key: 'live/chapter', path: '/live/chapter/:course_id',name: '????????????', component: ChapterSetting },
  { key: 'live/mng', path: '/liveroom/:id',name: '??????????????????', component: LiveView },
  { key: 'live', path: '/live/list',name: '????????????', component: LiveManager },
  { key: 'live', path: '/live',exact: true,name: '????????????', component: LiveManager },

  { key: 'newsLabel', path: '/news/label', name: '????????????', component: NewsLabel },
  { key: 'news', path: '/news/list', exact: true, name: '????????????', component: News },
  { key: 'news', path: '/news', exact: true, name: '????????????', component: News },
  { key: 'news/edit', path: '/news/edit/:id', exact: true, name: '????????????', component: EditNews },

  { key: 'workbenchMng', path: '/', exact: true, name: '?????????'},
  { key: 'dashboard', path: '/dashboard', name: '?????????', component: Dashboard },

  { key: 'user/add', path: '/user-manager/add-user/:id', name: '????????????', component: AddUser },
  

  { key: 'teacher', path: '/user-manager/teacher/', exact: true, name: '????????????', component: Teacher },

  { key: 'todo', path: '/todo-list', exact: true,name: '????????????', component: TodoList },
  { key: 'comment', path: '/todo-list/comment-list/:ctype/:id', name: '????????????', component: Comment },
  { key: 'comment???edit', path: '/todo-list/comment-list/:ctype/:id', name: '????????????', component: Comment },

  { key: 'post', path: '/todo-list/post-list',name: '????????????', component: PostList },
  { key: 'feedback', path: '/feedback-list', exact: true, name: '????????????', component: FeedbackList },
  { key: 'feedback/cate', path: '/feedback-list/feedback-classify', name: '????????????', component: FeedbackClassify },

  { key: 'statistic', path: '/workbench/stat', exact:true, name: '????????????', component: Stat },
 
  { key: 'excel', path: '/workbench/excel-manager', name: '????????????', component: ExcelManager },
  { key: '', path: '/workbench/excel-manager/excel-detail', name: '????????????', component: ExcelDetail },
  
  { key: 'medal/view', path: '/member-manager/medal/view/:id',name: '????????????', component: MedalEdit },
  { key: 'medal/edit', path: '/member-manager/medal/edit/:id',name: '????????????', component: MedalEdit },
  { key: 'medal', path: '/member-manager/medal',name: '????????????', component: Medal },
  { key: 'user', path: '/member-manager', exact:true, name: '????????????', component: User },
  { key: 'user', path: '/member-manager/list',name: '????????????', component: User },
  { key: 'user/edit', path: '/member-manager/user-info/:index', name: '????????????', component: UserInfo },
  { key: 'user/view', path: '/member-manager/user-view/:userId', name: '????????????', component: UserView },
  { key: 'coin', path: '/member-manager/coin-setting',name: '??????????????????', component: CoinSetting },
  { key: 'level', path: '/member-manager/level-setting',name: '??????????????????', component: LevelSetting },
  { key: 'profit', path: '/member-manager/profit-setting',name: '??????????????????', component: ProfitSetting },
  
  { key: 'teacher', path: '/teacher', exact:true, name: '????????????', component: Teacher },
  
  { key: 'teacherRank/view', path: '/teacher/rank/edit/:view/:id',exact:true, name: '??????', component: TeacherApplyEdit },
  { key: 'teacherApply/add', path: '/teacher/apply/edit/:view/:id',exact:true, name: '????????????', component: TeacherApplyEdit },
  { key: 'teacherApply/view', path: '/teacher/apply/check/:view/:id',exact:true, name: '????????????', component: TeacherApplyCheck },
  { key: 'teacherApply', path: '/teacher/apply',exact:true, name: '??????????????????', component: TeacherApply },
  { key: 'teacherRank', path: '/ranks',exact:true, name: '??????????????????', component: TeacherRanks },

  { key: 'teacher', path: '/teacher/list', exact:true, name: '????????????', component: Teacher },

  { key: 'teacher/view', path: '/teacher-manager/teacher-detail/:id', name: '????????????', component: TeacherDetail },
  { key: 'teacher/edit', path: '/teacher-manager/teacher-edit/:id', name: '????????????', component: TeacherEdit },
  { key: 'teacherPro', path: '/member-manager/teacherLevel', name: '??????????????????', component: TeacherLevel },
  { path: '/teacher-manager/teacherAsk/:atype/:id', name: '????????????', component: TeacherAsk },


  { key: 'courseV', path: '/course-manager',exact:true,name: '????????????', component: CourseManager },
  { key: 'courseV', path: '/course-manager/video-course/:current_page',name: '????????????', component: CourseManager },
  { key: 'classify', path: '/course-manager/course-classify', name: '????????????', component: CourseClassify },
  { key: 'label', path: '/course-manager/label-manager',exact:true, name: '????????????', component: LabelManager },
  { key: 'newsLabel/view', path: '/course-manager/label-detail/:id',exact:true, name: '??????????????????', component: LabelDetail },
  
  { key: 'courseV/edit', path: '/course-manager/edit-course/:course_id', name: '??????????????????', component: EditCourse },
  { key: 'courseV/view', path: '/course-manager/view-course/:course_id', name: '??????????????????', component: EditCourse },
  { key: 'courseS/edit', path: '/course-manager/edit-static-course/:course_id', name: '??????????????????', component: EditStaticCourse },
  { key: 'courseS/view', path: '/course-manager/view-static-course/:course_id', name: '??????????????????', component: EditStaticCourse },
  { key: 'courseS', path: '/course-manager/static-course',name: '????????????', component: StaticCourse },

  { key: 'courseV/chapter', path: '/course-manager/chapter-setting/:course_id',name: '????????????', component: ChapterSetting },
  { key: 'column', path: '/course-manager/column-list',exact:true,name: '????????????', component: ColumnList },

  
  { key: 'column/course', path: '/course-manager/recommend-list/:channel_id',name: '????????????', component: RecommendList },
  { key: 'column/add', path: '/course-manager/create-recourse',name: '????????????', component: EditReCourse },
  { key: 'column/view', path: '/course-manager/view-recourse/:channel',name: '????????????', component: EditReCourse },
  { key: 'column/edit', path: '/course-manager/edit-recourse/:channel',name: '????????????', component: EditReCourse },

    { path: '/ask/cate',name: '????????????', component: AskCate },
  { path: '/ask/edit/:id',name: '????????????', component: AskEdit },
  { path: '/ask/comment',name: '????????????', component: AskComment },
  { path: '/ask/list',exact:true,name: '????????????', component: Ask },
  { path: '/ask',exact:true,name: '????????????', component: Ask },

  { key:'lanmu', path: '/meetting/classify',exact:true,name: '???????????????????????????', component: MeettingLabel },
  { key:'biaoqian', path: '/meetting/label',exact:true,name: '????????????', component: MeettingLabel },

  { key:'shijuan/edit', path: '/meetting/topic/paper/edit/:id',exact:true, name: '????????????', component: MeettingPaperEdit },
  { key:'shijuan/view', path: '/meetting/topic/paper/edit/:id',exact:true, name: '????????????', component: MeettingPaperEdit },
  { key:'shijuan', path: '/meetting/topic/paper',exact:true,name: '????????????', component: MeettingPaper },

  { key:'tikulist/edit',path: '/meetting/topic/edit/:id',exact:true,name: '????????????', component: MeettingTopicEdit },
  { key:'tikulist', path: '/meetting/topic/list',exact:true,name: '?????????????????????', component: MeettingTopic },
  { key:'tiku', path: '/meetting/topic',exact:true,name: '???????????????', component: MeettingTopic },

  { key:'tasks/view', path: '/meetting/task/view/:id',exact:true,name: '??????????????????', component: MeettingTaskEdit },
  { key:'tasks/edit', path: '/meetting/task/edit/:id',exact:true,name: '??????????????????', component: MeettingTaskEdit },
  { key:'tasks', path: '/meetting/task',exact:true,name: '??????????????????', component: MeettingTask },

  { key:'activity/view', path: '/meetting/activity/view/:id',exact:true,name: '??????????????????', component: MeettingActivityEdit },
  { key:'activity/edit', path: '/meetting/activity/edit/:id',exact:true,name: '??????????????????', component: MeettingActivityEdit },
  { key:'activity', path: '/meetting/activity',exact:true,name: '??????????????????', component: MeettingActivity },
  { key:'users/edit', path: '/meetting/user/edit/:id/:tagId',exact:true,name: '????????????', component: MeettingUserEdit },
  { key:'users/view', path: '/meetting/user/view/:id/:tagId',exact:true,name: '????????????', component: MeettingUserEdit },
  { key:'users', path: '/meetting/user',exact:true,name: '????????????', component: MeettingUser },
  { key:'mood', path: '/meetting/mood',exact:true,name: '???????????????', component: Mood },
  { key:'meetting', path: '/meetting',exact:true,name: '?????????', component: Meetting },
  { key:'kechen', path: '/meetting/list',exact:true,name: '?????????????????????', component: Meetting },
  { key:'kechen/edit',path: '/meetting/edit/:id',name: '????????????', component: MeettingEdit },
  { key:'kechen/view',path: '/meetting/view/:id',name: '????????????', component: MeettingEdit },
  { key:'meetcomment',path: '/meetting/comment',name: '?????????????????????', component: MeettingComment },

  { key: 'ad', path: '/web-manager',exact:true,name: '????????????', component: AdManager },
  { key: 'ad', path: '/web-manager/ad-manager',exact:true,name: '????????????', component: AdManager },
  { key: 'ad/edit', path: '/web-manager/ad-manager/edit-ad/:bill_id',name: '????????????', component: EditAd },

  { key: 'msg', path: '/web-manager/msg-manager',exact:true,name: '????????????', component: MsgManager},
  { key: 'msg/edit', path: '/web-manager/msg-manager/edit-msg/:view/:index',name: '????????????', component: EditMsg},

  { key: 'guagua', path: '/web-manager/guagua',exact:true,name: '???????????????', component: GuaGua },
  { key: 'guagua/list', path: '/web-manager/guagua/lucky-list',exact:true,name: '?????????????????????', component: GuaGuaLuckyList },

  { key: 'search', path: '/web-manager/search-manager',name: '????????????', component: SearchManager},
  { key: 'cardActive', path: '/web-manager/active-manager',exact:true,name: '????????????', component: ActiveManager},
  { key: 'cardActive/list', path: '/web-manager/active-manager/lucky-list',name: '????????????', component: LuckyList},
  { key: 'sen', path: '/web-manager/bandfilter', name: '???????????????', component: BandFilter },
  
  { key: 'invite/view', path: '/web-manager/invite-manager/info/:id',exact:true,name: '??????????????????', component: InviteDetail },
  { key: 'invite', path: '/web-manager/invite-manager',exact:true, name: '????????????', component: InviteManager },
  { key: 'inviteImg', path: '/web-manager/invite-manager/picture', name: '??????????????????', component: InvitePicture },
  { key: 'tmp', path: '/web-manager/tmp-manager',exact:true,name: '????????????', component: TmpManager },
  { key: 'tmp/add', path: '/web-manager/tmp-manager/add-tmp', name: '????????????', component: AddTmp },
  { key: 'tmp/view', path: '/web-manager/tmp-manager/view-tmp/:index', name: '????????????', component: ViewTmp },
  { key: 'tmp/edit', path: '/web-manager/tmp-manager/edit-tmp/:index', name: '????????????', component: EditTmp },
  
  { key: 'auth', path: '/system-manager',exact:true, name: '????????????', component: AuthManager },
  { key: 'admin', path: '/system-manager/admin',name: '???????????????', component: AdminManager },
  { key: 'log', path: '/system-manager/log',name: '????????????', component: LogManager },
  { key: 'auth', path: '/system-manager/auth',exact:true,name: '????????????', component: AuthManager },
  { key: 'auth', path: '/system-manager/exauth',exact:true,name: '??????????????????', component: EXAuthManager },

  { key: 'auth/add', path: '/system-manager/auth/add',name: '???????????????', component: EditRole },
  { key: 'auth/edit', path: '/system-manager/auth/edit/:id',name: '???????????????', component: EditRole },

  { key: 'year/setting', path: '/year/setting',exact:true,name: '???????????????', component: KeywordSetting },
  { key: 'year', path: '/year',exact:true,name: '??????????????????', component: Year },
  { key: 'year/edit', path: '/year/h5ds/:id',exact:true,name: '????????????', component: h5ds },

  { key: 'imgDownLoad/view', path: '/imgdownload/view/:id/:page/:ftype',exact:true,name: '????????????', component: ImgDownEdit },
  { key: 'imgDownLoad/edit', path: '/imgdownload/edit/:id/:page/:ftype',exact:true,name: '????????????', component: ImgDownEdit },
  { key: 'imgDownLoad', path: '/imgdownload',exact:true,name: '??????????????????', component: ImgDown },

  { key: 'province', path: '/province',exact:true,name: '??????????????????', component: Province },

  { key: 'rank/view', path: '/rank/list/:id/:rank/:begin/:end',exact:true,name: '????????????', component: RankList },
  { key: 'rank/edit', path: '/rank/edit/:id',exact:true,name: '????????????', component: RankEdit },
  { key: 'rank', path: '/rank',exact:true,name: '????????????', component: Rank },

  { key:'exchanges', path: '/tree/goods/exchange',exact:true,name: '????????????', component: ExchangeList },
  { key:'goodslist/view', path: '/tree/goods/view/:id',exact:true,name: '????????????', component: TreeGoodsEdit },
  { key:'goodslist/edit', path: '/tree/goods/edit/:id',exact:true,name: '????????????', component: TreeGoodsEdit },
  { key:'treegoods', path: '/tree/goods',exact:true,name: '????????????', component: TreeGoods },
  { key:'exchanges', path: '/tree/goods/list',exact:true,name: '????????????', component: TreeGoods },
  { key:'manual', path: '/tree/manual',exact:true,name: '????????????', component: Manual },
  { key:'manual/edit', path: '/tree/manual/edit/:id',exact:true,name: '????????????', component: ManualEdit },
  { key:'seed/view', path: '/tree/seed/view/:id',exact:true,name: '??????', component: SeedEdit },
  { key:'seed/edit', path: '/tree/seed/edit/:id',exact:true,name: '??????', component: SeedEdit },
  { key:'seed', path: '/tree/seed',exact:true,name: '????????????', component: Seed },
  { key:'suns', path: '/tree/sun',exact:true,name: '????????????', component: Sun },
  { key:'tree', path: '/tree',exact:true,name: '?????????', component: Seed },

  { key:'levelManager', path: '/game-manager/levelManager',name: '????????????', component: LevelManager },
  { key:'specialGame', path: '/game-manager/specialGame',name: '???????????????', component: GameManager },
  { key:'GameManager', path: '/game-manager',name: '??????????????????', component: GameManager },

  { key:'rankPaper', path: '/rankPaper-manager',exact:true,name: '????????????????????????', component: RankExerciseManager },
  { key:'QuestionClassify/edit', path: '/rankPaper-manager/edit/:id',name: '????????????', component: EditRankQuestion },
  { key:'QuestionClassify/edit', path: '/rankPaper-manager/add',name: '????????????', component: AddRankQuestion },
  { key:'QuestionClassify/check', path: '/rankPaper-manager/check',exact:true,name: '????????????', component: RankPaperManager },
  { key:'rankPaper', path: '/rankPaper-manager/list',exact:true,name: '????????????????????????', component: RankExerciseManager },
  { key:'QuestionClassifys', path: '/rankPaper-manager/QuestionClassify',name: '??????????????????', component: RankQuestionClassify },
];

export default routes;
