
export const navigation = [
		{
			key: 'workbenchMng',
			name: '工作台',
			url: '/base',
			icon: 'icon-speedometer',
			children: [
				{
					key: 'todo',
					name: '待办事项',
					url: '/todo-list',
				},
				{
					key: 'feedback',
					name: '反馈管理',
					url: '/feedback-list',
				},
				{
					key: 'statistic',
					name: '数据统计',
					url: '/workbench/stat',
				},
				{
					key: 'excel',
					name: '报表管理',
					url: '/workbench/excel-manager',
				},
				{
					key: 'dashboard',
					name: '服务监控',
					url: '/dashboard',
				},
			]
		},
		{
			key:'userMng',
			name: '会员管理',
			url: '/member-manager',
			icon: 'icon-puzzle',
			children: [
				{
					key: 'user',
					name: '会员管理',
					url: '/member-manager/list',
				},
				{
					key: 'coin',
					name: '金币规则设置',
					url: '/member-manager/coin-setting',
				},
				{
					key: 'level',
					name: '会员等级设置',
					url: '/member-manager/level-setting',
				},
				{
					key: 'profit',
					name: '会员权益设置',
					url: '/member-manager/profit-setting',
				},
				{
					key: 'teacherPro',
					name: '讲师权益管理',
					url: '/member-manager/teacherLevel',
				},
			
				{
					key:'task',
					name: '任务管理',
					url: '/member-manager/task',
					// icon: 'icon-layers'
				},
				{
					key: 'medal',
					name: '徽章管理',
					url: '/member-manager/medal',
				}
			],
		},
		{
			key:'teacherMng',
			name: '讲师管理',
			url: '/teacher',
			icon: 'icon-briefcase',
			children: [
				{
					key: 'teacher',
					name: '讲师列表',
					url: '/teacher/list',
				},
			
				{
					key: 'teacherApply',
					name: '讲师申请管理',
					url: '/teacher/apply',
				}
			],
		},
		{
			key:'teacherRank',
			name: '讲师定级管理',
			url: '/ranks',
			icon: 'icon-briefcase',
		},
		{
			key:'courseMng',
			name: '课程管理',
			url: '/course-manager',
			icon: 'icon-star',
			children: [
				{
					key: 'courseV',
					name: '视频课程',
					url: '/course-manager/video-course/1',
				},
				{
					key: 'courseS',
					  name: '图文课程',
					  url: '/course-manager/static-course',
				},
				{
					key: 'courseM',
					  name: '音频课程',
					  url: '/course-manager/MediaCourse',
				},
				
				{
					key: 'column',
					name: '专栏列表',
					url: '/course-manager/column-list',
				},
				{
					key: 'classify',
					name: '课程分类',
					url: '/course-manager/course-classify',
				},
				{
					key: 'label',
					name: '标签管理',
					url: '/course-manager/label-manager',
				},
			],
		},
		{
			key:'liveMng',
			name: '直播列表管理',
			url: '/live',
			icon: 'icon-layers',
			children:[
				{
					key: 'live',
					name: '直播列表',
					url: '/live/list',
				},
				{
					key: 'liveGift',
					name: '礼物管理',
					url: '/live/gift'
				},
			]
		},
		{
			key:'fundMng',
			name: '资金管理',
			url: '/fund',
			icon: 'icon-star',
			children: [
				{
					key:'fapiao',
					name: '发票管理',
					url: '/fund/fapiao',
				},
				{
					key:'transaction',
					name: '财务确认',
					url: '/fund/transaction',
				},
				{
					key:'withdraw',
					name: '提现管理',
					url: '/fund/withdraw',
				},
			],
		},
		{
			key:'mallMng',
			name: '商城管理',
			url: '/mall',
			icon: 'icon-layers',
			children:[
				{
					key:'goods',
					name: '商品管理',
					url: '/mall/list',
				},
				{
					key:'express',
					name: '物流管理',
					url: '/mall/express',
				},
				{
					key:'goodsReturn',
					name: '退换货管理',
					url: '/mall/goods-return',
				},
				{
					key:'order',
					name: '订单管理',
					url: '/mall/goods-order',
				},
				{
					key:'courseOrder',
					name: '课程订单管理',
					url: '/mall/courseOrder',
				},
				{
					key:'inventoryMng',
					name: '库存管理',
					children:[
						{
							key:'inventory',
							name: '库存',
							url: '/mall/inventory',
						},
						{
							key:'inventoryTran',
							name: '出入库管理',
							url: '/mall/inventory-transport',
						},
					]
				},
				
				{
					key:'goodsCate',
					name: '商品分类管理',
					url: '/mall/cate',
				},
				{
					key:'goodsType',
					name: '商品类型管理',
					url: '/mall/goods-type',
				},
				{
					key:'goodsBrand',
					name: '商品品牌管理',
					url: '/mall/brand',
				},
				{
					key:'couponMng',
					name: '优惠券管理',
					url: '/mall/coupon',
				},
				{
					key:'couponYCMng',
					name: '油葱商城优惠码',
					url: '/mall/couponYC',
				},
				{
					key:'goodsActive',
					name: '促销活动管理',
					url: '/mall/goods-active',
				},

			]
		},
		{
			key:'studymapMng',
			name: '学习地图(课程)题库',
			url: '/topic',
			icon: 'icon-layers',
			children:[
				{
					key: 'studymap',
					name: '学习地图管理',
					url: '/topic/study-map',
				},
				{
					key: 'studymapo2o',
					name: '学习地图O2O管理',
					url: '/topic/o2oStudyMap',
				},
				{
					key:'mapTopic',
					name: '题库列表',
					url: '/topic/list',
				},
				{
					key:'mapPaper',
					name: '试卷管理',
					url: '/topic/paper',
				},
				{
					key:'mapTopicCate',
					name: '题目分类管理',
					url: '/topic/classify',
				},
			]
		},

		{
			key:'specialMng',
			name: '专题管理',
			url: '/col',
			icon: 'icon-layers',
		},
		{
			key:'activityMng',
			name: '活动管理',
			url: '/activity',
			icon: 'icon-layers',
		},
		{
			key:'authClassMng',
			name: '资格认证管理',
			url: '/auth',
			icon: 'icon-layers',
			children:[
				{
					key:'authClass',
					name: '报名与信息管理',
					url: '/auth/class-new',
				},
				// {
				// 	key:'classNew',
				// 	name: '创建班级',
				// 	url: '/auth/class-new',
				// },
				{
					key:'authVcate',
					name: '视频课程分类设置',
					url: '/auth/course-cate',
				},
				{
					key:'authVideo',
					name: '视频课程导入',
					url: '/auth/course',
				},
				
				{
					key:'authTcate',
					name: '练习题分类设置',
					url: '/auth/topic-cate',
				},
				{
					key:'authTopic',
					name: '练习题目管理',
					url: '/auth/topic',
				},
				{
					key:'authPaper',
					name: '考题管理',
					url: '/auth/paper',
				},
				{
					key:'underlineClass',
					name: '线下课程管理',
					url: '/auth/class-underline',
				},
			]
		},
		// {
		// 	key:'pk',
		// 	name: '趣味探索管理',
		// 	url: '/pk',
		// 	icon: 'icon-layers',
		// 	children:[
		// 		{
		// 			key:'o2oNews',
		// 			name: '段位管理',
		// 			url: '/pklevel',
		// 		},
		// 		{
		// 			key:'o2oNews',
		// 			name: '专题赛管理',
		// 			url: '/pkmatch',
		// 		},
		// 	]
		// },
		{
			key:'o2oMng',
			name: 'O2O管理',
			url: '/o2o',
			icon: 'icon-layers',
			children:[
				{
					key:'o2onews',
					name: 'O2O资讯管理',
					url: '/o2o/o2oNews',
				},
				{
					key:'o2oClass',
					name: '培训班管理',
					url: '/o2o/o2oClass',
				},
				
			]
		},
		{
			key:'newsMng',
			name:'资讯管理',
			url: '/news',
			icon: 'icon-layers',
			children: [
				{
					key: 'news',
					name: '资讯列表',
					url: '/news/list',
				},
				{
					key:'newsLabel',
					name:'标签管理',
					url:'/news/label'
				}
			],
		},
		{
			key:'ask',
			name: '问答管理',
			url: '/ask',
			icon: 'icon-layers',
			children:[
				{
					key: 'ask',
					name: '问答管理',
					url: '/ask/list',
				},
				{
					key: 'ask',
					name: '回答管理',
					url: '/ask/comment',
				},
				{
					key: 'ask',
					name: '分类管理',
					url: '/ask/cate',
				},
			]
		},
		{
			key:'rank',
			name: '榜单管理',
			url: '/rank',
			icon: 'icon-layers',
		},
		{
			key:'province',
			name: '风采省份管理',
			url: '/province',
			icon: 'icon-layers',
		},
		{
			key:'imgDownLoad',
			name: '下载专区管理',
			url: '/imgdownload',
			icon: 'icon-layers',
		},
		{
			key:'operateMng',
			name: '运营管理',
			url: '/web-manager',
			icon: 'icon-layers',
			children: [
				{
					key: 'ad',
					name: '广告管理',
					url: '/web-manager/ad-manager',
				},
				{
					key: 'msg',
					name: '消息管理',
					url: '/web-manager/msg-manager',
			
				},
				{
					key: 'tmp',
					name: '模版管理',
					url: '/web-manager/tmp-manager',
			
				},
				{
					key: 'search',
					name: '搜索管理',
					url: '/web-manager/search-manager',
			
				},
				{
					key: 'cardActive',
					name: '打赏翻牌',
					url: '/web-manager/active-manager',
			
				},
				{
					key: 'sen',
					name: '敏感词管理',
					url: '/web-manager/bandfilter',
			
				},
				{
					key: 'invite',
					name: '邀请管理',
					url: '/web-manager/invite-manager',
			
				},
				{
					key: 'guagua',
					name: '刮刮卡管理',
					url: '/web-manager/guagua',
			
				},
				{
					key: 'ui',
					name: 'UI装修管理',
					url: '/web-manager/ui',
			
				},
				{
					key: 'feedlist',
					name: '帮助反馈管理',
					url: '/web-manager/feedback',
			
				},
			],
		},
		{
			key:'mediaMng',
			name: '素材库',
			url: '/media',
			icon: 'icon-layers'
		},
		{
			key:'underActiveMng',
			name: '线下活动管理',
			url: '/underactive',
			icon: 'icon-layers',
		},
		{
			key:'aboutMng',
			name: '关于我们',
			url: '/about',
			icon: 'icon-layers',
		},
		{
			key:'sysMng',
			name: '系统管理',
			url: '/system-manager',
			icon: 'icon-settings',
			children: [
				{
					key: 'auth',
					name: '权限管理',
					url: '/system-manager/auth',
			
				},
				{
					key: 'admin',
					name: '管理员管理',
					url: '/system-manager/admin',
			
				},
				{
					key: 'log',
					name: '日志管理',
					url: '/system-manager/log',
				}
			],
		},
		{
			key:'ask',
			name: '年度账单',
			url: '/year',
			icon: 'icon-layers',
		},
		{
			key:'meetting',
			name: '研讨会',
			url: '/meetting',
			icon: 'icon-layers',
			children:[
				{
					key: 'kechen',
					name: '研讨会课程管理',
					url: '/meetting/list',
				},
				{
					key: 'meetcomment',
					name: '研讨会评论管理',
					url: '/meetting/comment',
				},
				{
					key: 'mood',
					name: '心情墙管理',
					url: '/meetting/mood',
				},
				{
					key: 'users',
					name: '名单管理',
					url: '/meetting/user',
				},
				{
					key: 'activity',
					name: '精彩瞬间管理',
					url: '/meetting/activity',
				},
				{
					key: 'tasks',
					name: '闯关任务管理',
					url: '/meetting/task',
				},
				{
					key: 'tiku',
					name: '研讨会题库',
					url: '/meetting/task',
					children:[
						{
							key: 'tikulist',
							name: '研讨会题目列表',
							url: '/meetting/topic/list',
						},
						{
							key: 'shijuan',
							name: '试卷管理',
							url: '/meetting/topic/paper',
						},
					]
				},
				
				{
					key: 'biaoqian',
					name: '研讨会标签管理',
					url: '/meetting/label',
				},
				{
					key: 'lanmu',
					name: '研讨会课程栏目管理',
					url: '/meetting/classify',
				},
				// {
				// 	key:'LiveManager',
				// 	name: '研讨会直播管理',
				// 	url: '/meetting/live',
				// 	children:[
				// 		{
				// 			key: 'LiveList',
				// 			name: '直播列表',
				// 			url: '/meetting/live/list',
				// 		},
				// 		{
				// 			key: 'LiveGift',
				// 			name: '礼物管理',
				// 			url: '/meetting/live/gift'
				// 		}
				// 	]
				// },
			]
		},
		// {	
		// 	key:'Tree',
		// 	name: '完美林',
		// 	url: '/tree',
		// 	icon: 'icon-layers',
		// 	children:[
		// 		{
		// 			key: 'seed',
		// 			name: '种子管理',
		// 			url: '/tree/seed',
		// 		},
		// 		{
		// 			key: 'treegoods',
		// 			name: '兑换管理',
		// 			url: '/tree/goods',
		// 			children:[
		// 				{
		// 					key: 'goodslist',
		// 					name: '商品管理',
		// 					url: '/tree/goods/list',
		// 				},
		// 				{
		// 					key: 'exchanges',
		// 					name: '兑换列表',
		// 					url: '/tree/goods/exchange',
		// 				},
		// 			]
		// 		},
		// 		{
		// 			key: 'suns',
		// 			name: '阳光管理',
		// 			url: '/tree/sun',
		// 		},
		// 		{
		// 			key: 'manual',
		// 			name: '攻略管理',
		// 			url: '/tree/manual',
		// 		},
		// 	]
		// },
		// {
		// 	key:'GameManager',
		// 	name: '趣味探索管理',
			
		// 	icon: 'icon-layers',
		// 	children:[
		// 		{
		// 			key: 'specialGame',
		// 			name: '专题赛管理',
		// 			url: '/game-manager/specialGame',
		// 		},
		// 		{
		// 			key: 'levelManager',
		// 			name: '段位管理',
		// 			url: '/game-manager/levelManager',
		// 		},
		// 		{
		// 			key:'rankPaper',
		// 			name: '趣味探索题库管理',
		// 			url: '/rankPaper-manager',
		// 			children:[
		// 				{
		// 					key: 'QuestionClassify',
		// 					name: '趣味探索题库',
		// 					url: '/rankPaper-manager/list',
		// 				},
		// 				{
		// 					key: 'QuestionClassifys',
		// 					name: '题目分类管理',
		// 					url: '/rankPaper-manager/QuestionClassify',
		// 				},
		// 			]
		// 		},
		// 	]
		// },
]
