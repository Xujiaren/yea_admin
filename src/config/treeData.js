export let treeData = [

    {
        title: '工作台',
        key: 'workbenchMng',
        top: true,
        children: [
            {
                title: '待办事项',
                key: 'todo',
                children: [
                    { title: '查看', key: 'todo/view' },
                    { title: '评论审核', key: 'todo/comment' },
                    { title: '讲师审核', key: 'todo/teacher' },
                    { title: '主题活动审核', key: 'todo/avtive' },
                    { title: '商城', key: 'todo/mall' },
                    { title: '中奖', key: 'todo/reward' },
                    { title: '问题反馈', key: 'todo/feed' },
                ],
            },
            {
                title: '反馈管理',
                key: 'feedback',
                children: [
                    { title: '添加', key: 'feedback/add' },
                    { title: '查看', key: 'feedback/view' },
                    { title: '修改', key: 'feedback/edit' },
                    { title: '删除', key: 'feedback/del' },
                    {
                        title: '类型管理',
                        key: 'feedback/cate',
                        children: [
                            { title: '添加', key: 'feedbackClassify/add' },
                            { title: '禁启用', key: 'feedbackClassify/status' },
                            { title: '修改', key: 'feedbackClassify/edit' },
                            { title: '删除', key: 'feedbackClassify/del' },
                        ],
                    },
                ],
            },
            {
                title: '数据统计',
                key: 'statistic',
                children: [
                    { title: '查看', key: 'statistic/view' },
                ]
            },
            {
                title: '报表管理',
                key: 'excel',
                children: [
                    { title: '查看', key: 'excel/view' },
                ]
            },
            {
                title: '服务监控',
                key: 'dashboard',
                children: [
                    { title: '查看', key: 'dashboard/view' },
                ]
            },
            {
                title: '评论列表',
                key: 'comment',
                children: [
                    { title: '审核', key: 'comment/check' },
                    { title: '查看', key: 'comment/view' },
                    { title: '回复', key: 'comment/edit' },
                    { title: '删除', key: 'comment/del' },
                ]
            },
            {
                title: '邮寄列表',
                key: 'post',
                children: [
                    { title: '查看', key: 'post/view' },
                    { title: '修改', key: 'post/edit' },
                ]
            },
        ],
    },
    {
        title: '会员管理',
        key: 'userMng',
        top: true,
        children: [
            {
                title: '用户管理',
                key: 'user',
                children: [
                    { title: '添加', key: 'user/add' },
                    { title: '查看', key: 'user/view' },
                    { title: '修改', key: 'user/edit' },
                    { title: '删除', key: 'user/del' },
                ],
            },
            {
                title: '金币规则',
                key: 'coin',
                children: [
                    { title: '修改', key: 'coin/edit' },
                ],
            },
            {
                title: '会员等级',
                key: 'level',
                children: [
                    { title: '添加', key: 'level/add' },
                    { title: '查看', key: 'level/view' },
                    { title: '修改', key: 'level/edit' },
                    { title: '删除', key: 'level/del' },
                ],
            },
            {
                title: '会员权益',
                key: 'profit',
                children: [
                    { title: '添加', key: 'profit/add' },
                    { title: '查看', key: 'profit/view' },
                    { title: '修改', key: 'profit/edit' },
                    { title: '删除', key: 'profit/del' },
                ],
            },
            {
                title: '讲师权益管理',
                key: 'teacherPro',
                children: [
                    { title: '修改', key: 'teacherPro/edit' },
                ],
            },
            {
                title: '任务管理',
                key: 'task',
                children: [
                    { title: '添加', key: 'task/add' },
                    { title: '查看', key: 'task/view' },
                    { title: '修改', key: 'task/edit' },
                    { title: '上下架', key: 'task/status' },
                    { title: '删除', key: 'task/del' },
                    { title: '任务记录', key: 'taskRecord' },
                ],
            },
            {
                title: '徽章管理',
                key: 'medal',
                children: [
                    { title: '添加', key: 'medal/add' },
                    { title: '查看', key: 'medal/view' },
                    { title: '修改', key: 'medal/edit' },
                    { title: '删除', key: 'medal/del' },
                ],
            },
        ],
    },
    {
        title: '讲师管理',
        key: 'teacherMng',
        top: true,
        children: [
            {
                title: '讲师管理',
                key: 'teacher',
                children: [
                    { title: '导出', key: 'teacher/out' },
                    { title: '导入', key: 'teacher/in' },
                    { title: '领导风采排序', key: 'teacher/order' },
                    { title: '添加', key: 'teacher/add' },
                    { title: '查看', key: 'teacher/view' },
                    { title: '修改', key: 'teacher/edit' },
                    { title: '删除', key: 'teacher/del' },
                ],
            },
            {
                title: '讲师申请管理',
                key: 'teacherApply',
                children: [
                    { title: '导出', key: 'teacherApply/out' },
                    { title: '申请讲师', key: 'teacherApply/add' },
                    { title: '审核记录', key: 'teacherApply/history' },
                    { title: '查看', key: 'teacherApply/view' },
                    { title: '删除', key: 'teacherApply/del' },
                ],
            },
        ]
    },
    {
        title: '讲师定级管理',
        key: 'teacherRank',
        top: true,
        children: [
            { title: '导入课程数据', key: 'teacherRank/course' },
            { title: '导出', key: 'teacherRank/out' },
            { title: '审核记录', key: 'teacherRank/history' },
            { title: '设置', key: 'teacherRank/setting' },
            { title: '查看', key: 'teacherRank/view' },
            { title: '修改', key: 'teacherRank/edit' },
            { title: '删除', key: 'teacherRank/del' },
        ]
    },
    {
        title: '课程管理',
        key: 'courseMng',
        top: true,
        children: [
            {
                title: '视频课程',
                key: 'courseV',
                children: [
                    { title: '添加', key: 'courseV/add' },
                    { title: '修改', key: 'courseV/edit' },
                    { title: '查看', key: 'courseV/view' },
                    { title: '删除', key: 'courseV/del' },
                    { title: '章节设置', key: 'courseV/chapter' },
                    { title: '用户评论', key: 'courseV/usercom' },
                ]
            },
            {
                title: '图文课程',
                key: 'courseS',
                children: [
                    { title: '添加', key: 'courseS/add' },
                    { title: '修改', key: 'courseS/edit' },
                    { title: '查看', key: 'courseS/view' },
                    { title: '删除', key: 'courseS/del' },
                    { title: '用户评论', key: 'courseS/usercom' },
                ]
            },
            {
                title: '音频课程',
                key: 'courseM',
                children: [
                    { title: '添加', key: 'courseM/add' },
                    { title: '修改', key: 'courseM/edit' },
                    { title: '查看', key: 'courseM/view' },
                    { title: '删除', key: 'courseM/del' },
                    { title: '章节设置', key: 'courseM/chapter' },
                    { title: '用户评论', key: 'courseM/usercom' },
                ]
            },
            {
                title: '专栏列表',
                key: 'column',
                children: [
                    { title: '首页菜单排序', key: 'column/menu' },
                    { title: '首页专栏排序', key: 'column/content' },

                    { title: '创建栏目', key: 'column/add' },
                    { title: '修改', key: 'column/edit' },
                    { title: '查看', key: 'column/view' },
                    { title: '查看课程', key: 'column/course' },
                    { title: '删除', key: 'column/del' },
                    { title: '菜单排序', key: 'column/sort' },
                ]
            },
            {
                title: '课程分类',
                key: 'classify',
                children: [
                    { title: '添加', key: 'classify/add' },
                    { title: '修改', key: 'classify/edit' },
                    { title: '查看', key: 'classify/view' },
                    { title: '删除', key: 'classify/del' },

                ]
            },
            {
                title: '标签管理',
                key: 'label',
                children: [
                    { title: '添加', key: 'label/add' },
                    { title: '修改', key: 'label/edit' },
                    { title: '查看', key: 'label/view' },
                    { title: '删除', key: 'label/del' },
                    { title: '所有课程', key: 'label/all' },
                ]
            },
        ]
    },
    {
        title: '直播管理',
        key: 'liveMng',
        top: true,
        children: [
            {
                title: '直播列表',
                key: 'live',
                children: [
                    { title: '添加', key: 'live/add' },
                    { title: '修改', key: 'live/edit' },
                    { title: '查看', key: 'live/view' },
                    { title: '删除', key: 'live/del' },
                    { title: '直播管理', key: 'live/mng' },

                    { title: '开始直播', key: 'live/start' },
                    { title: '下载', key: 'live/down' },
                    { title: '上传', key: 'live/chapter' },
                    { title: '导出用户', key: 'live/exportuser' },
                    { title: '用户评论', key: 'live/comment' },
                ]
            },
            {
                title: '礼物管理',
                key: 'liveGift',
                children: [
                    { title: '添加', key: 'liveGift/add' },
                    { title: '修改', key: 'liveGift/edit' },
                    { title: '查看', key: 'liveGift/view' },
                    { title: '删除', key: 'liveGift/del' },
                ]
            },
        ]
    },
    {
        title: '资金管理',
        key: 'fundMng',
        top: true,
        children: [
            {
                title: '发票管理',
                key: 'fapiao',
                children: [
                    { title: '查看', key: 'fapiao/view' },
                    // { title: '导出用户', key: 'live/export' },
                ]
            },
            {
                title: '财务确认',
                key: 'transaction',
                children: [
                    { title: '处理', key: 'transaction/edit' },
                    { title: '查看', key: 'transaction/view' },
                ]
            },
            {
                title: '提现管理',
                key: 'withdraw',
                children: [
                    { title: '处理', key: 'withdraw/edit' },
                    { title: '查看', key: 'withdraw/view' },
                ]
            },
        ]
    },
    {
        title: '商城管理',
        key: 'mallMng',
        top: true,
        children: [
            {
                title: '商品管理',
                key: 'goods',
                children: [
                    { title: '设置配送时间', key: 'goods/time' },
                    { title: '查看', key: 'goods/view' },
                    { title: '上下架', key: 'goods/status' },
                    { title: '推荐操作', key: 'goods/recomm' },
                    { title: '设置限时抢购', key: 'goods/limit' },
                    { title: '加热销标签', key: 'goods/tag' },
                    { title: '修改', key: 'goods/edit' },
                    { title: '删除', key: 'goods/del' },
                    { title: '添加', key: 'goods/add' },
                    // { title: '导出用户', key: 'live/export' },
                ]
            },
            {
                title: '物流管理',
                key: 'express',
                children: [
                    { title: '查看', key: 'express/view' },
                    { title: '运费配置', key: 'express/setting' },
                    // { title: '删除', key: 'express/del' },
                    // { title: '添加', key: 'express/add' },
                    // { title: '导出用户', key: 'live/export' },
                ]
            },
            {
                title: '退换货管理',
                key: 'goodsReturn',
                children: [
                    { title: '处理', key: 'goodsReturn/edit' },
                    { title: '查看', key: 'goodsReturn/view' },
                ]
            },
            {
                title: '订单管理',
                key: 'order',
                children: [
                    { title: '导出订单', key: 'order/out' },
                    { title: '打印配货单', key: 'order/print' },
                    { title: '下载配货单', key: 'order/down' },
                    { title: '查看', key: 'order/view' },
                    { title: '关闭订单/取消订单', key: 'order/close' },
                    { title: '修改', key: 'order/edit' },
                    { title: '发货', key: 'order/send' },
                ]
            },
            {
                title: '课程订单管理',
                key: 'courseOrder',
                children: [
                    { title: '查看', key: 'courseOrder/view' },
                    { title: '导出订单', key: 'courseOrder/out' },
                ]
            },
            {
                title: '库存管理',
                key: 'inventoryMng',
                children: [
                    {
                        title: '库存', key: 'inventory', children: [
                            { title: '查看', key: 'inventory/view' },
                            { title: '导出', key: 'inventory/export' },
                        ]
                    },
                    {
                        title: '出入库管理', key: 'inventoryTran', children: [
                            { title: '入库申请', key: 'inventoryTran/apply' },
                            { title: '出库申请', key: 'inventoryTran/applyOut' },
                            { title: '审批', key: 'inventoryTran/check' },
                            { title: '报废', key: 'inventoryTran/baofei' },
                            { title: '打印', key: 'inventoryTran/print' },
                            { title: '查看', key: 'inventoryTran/view' },
                            { title: '导入', key: 'inventoryTran/in' },
                            { title: '导出', key: 'inventoryTran/out' },
                            { title: '修改', key: 'inventoryTran/edit' },
                        ]
                    },
                ]
            },
            {
                title: '商品分类管理',
                key: 'goodsCate',
                children: [
                    { title: '查看', key: 'goodsCate/view' },
                    { title: '修改', key: 'goodsCate/edit' },
                    { title: '删除', key: 'goodsCate/del' },
                    { title: '添加', key: 'goodsCate/add' },
                ]
            },
            {
                title: '商品类型管理',
                key: 'goodsType',
                children: [
                    { title: '查看', key: 'goodsType/view' },
                    { title: '修改', key: 'goodsType/edit' },
                    { title: '删除', key: 'goodsType/del' },
                    { title: '添加', key: 'goodsType/add' },
                    { title: '商品类型规则', key: 'goodsType/rule' },
                ]
            },
            {
                title: '商品品牌管理',
                key: 'goodsBrand',
                children: [
                    { title: '查看', key: 'goodsBrand/view' },
                    { title: '修改', key: 'goodsBrand/edit' },
                    { title: '删除', key: 'goodsBrand/del' },
                    { title: '添加', key: 'goodsBrand/add' },
                ]
            },
            {
                title: '优惠券管理',
                key: 'couponMng',
                children: [
                    { title: '查看数据', key: 'coupon/data' },
                    { title: '查看', key: 'coupon/view' },
                    { title: '修改', key: 'coupon/edit' },
                    { title: '禁启用', key: 'coupon/status' },
                    { title: '删除', key: 'coupon/del' },
                    { title: '添加优惠券', key: 'coupon/add' },
                ]
            },
            {
                title: '油葱商城优惠码',
                key: 'couponYCMng',
                children: [
                    { title: '查看', key: 'couponYC/view' },
                    { title: '修改', key: 'couponYC/edit' },
                    { title: '删除', key: 'couponYC/del' },
                    { title: '导入', key: 'couponYC/add' },
                ]
            },
            {
                title: '促销活动管理',
                key: 'goodsActive',
                children: [
                    { title: '查看', key: 'goodsActive/view' },
                    { title: '添加', key: 'goodsActive/add' },
                    { title: '修改', key: 'goodsActive/edit' },
                    { title: '删除', key: 'goodsActive/del' },
                ]
            },
        ]
    },
    {
        title: '学习地图(课程)题库',
        key: 'studymapMng',
        top: true,
        children: [
            {
                title: '学习地图管理',
                key: 'studymap',
                children: [
                    { title: '排序', key: 'studymap/order' },
                    { title: '查看', key: 'studymap/view' },
                    { title: '添加', key: 'studymap/add' },
                    { title: '修改', key: 'studymap/edit' },
                    { title: '删除', key: 'studymap/del' },
                ]
            },
            {
                title: '学习地图O2O管理',
                key: 'studymapo2o',
                children: [
                    { title: '排序', key: 'studymapo2o/order' },
                    { title: '查看', key: 'studymapo2o/view' },
                    { title: '添加', key: 'studymapo2o/add' },
                    { title: '修改', key: 'studymapo2o/edit' },
                    { title: '删除', key: 'studymapo2o/del' },
                ]
            },
            {
                title: '题库列表',
                key: 'mapTopic',
                children: [
                    { title: '查看', key: 'mapTopic/view' },
                    { title: '发布题目', key: 'mapTopic/add' },
                    { title: '导入', key: 'mapTopic/in' },
                    { title: '修改', key: 'mapTopic/edit' },
                    { title: '删除', key: 'mapTopic/del' },
                ]
            },
            {
                title: '试卷管理',
                key: 'mapPaper',
                children: [
                    { title: '查看', key: 'mapPaper/view' },
                    { title: '添加', key: 'mapPaper/add' },
                    { title: '导入', key: 'mapPaper/in' },
                    { title: '修改', key: 'mapPaper/edit' },
                    { title: '删除', key: 'mapPaper/del' },
                ]
            },
            {
                title: '题目分类管理',
                key: 'mapTopicCate',
                children: [
                    { title: '查看', key: 'mapTopicCate/view' },
                    { title: '添加', key: 'mapTopicCate/add' },
                    { title: '修改', key: 'mapTopicCate/edit' },
                    { title: '删除', key: 'mapTopicCate/del' },
                ]
            },
        ]
    },
    {
        title: '专题管理',
        key: 'specialMng',
        top: true,
        children: [
            { title: '置顶', key: 'special/top' },
            { title: '上下架', key: 'special/status' },
            { title: '查看', key: 'special/view' },
            { title: '添加', key: 'special/add' },
            { title: '修改', key: 'special/edit' },
            { title: '删除', key: 'special/del' },
            { title: '评论列表', key: 'special/comment' },
        ]
    },
    {
        title: '活动管理',
        key: 'activityMng',
        top: true,
        children: [
            { title: '禁启用', key: 'activity/status' },
            { title: '推荐', key: 'activity/recomm' },
            { title: '评论列表', key: 'activity/comment' },
            { title: '审核', key: 'activity/check' },
            { title: '查看活动结果', key: 'activity/result' },
            { title: '查看', key: 'activity/view' },
            { title: '添加', key: 'activity/add' },
            { title: '修改', key: 'activity/edit' },
            { title: '删除', key: 'activity/del' },
        ]
    },
    {
        title: '资格认证管理',
        key: 'authClassMng',
        top: true,
        children: [
            {
                title: '报名与信息管理',
                key: 'authClass',
                children: [
                    { title: '查看', key: 'authClass/view' },
                    { title: '查看报名', key: 'authClass/apply' },
                    { title: '添加', key: 'authClass/add' },
                    { title: '修改', key: 'authClass/edit' },
                    { title: '上下架', key: 'authClass/status' },
                    { title: '删除', key: 'authClass/del' },
                    { title: '导出', key: 'authClass/out' },
                    { title: '成绩管理', key: 'authClass/score' },
                ]
            },
            {
                title: '视频课程分类设置',
                key: 'authVcate',
                children: [
                    { title: '查看', key: 'authVcate/view' },
                    { title: '添加', key: 'authVcate/add' },
                    { title: '修改', key: 'authVcate/edit' },
                    { title: '禁启用', key: 'authVcate/status' },
                    { title: '删除', key: 'authVcate/del' },
                ]
            },
            {
                title: '视频课程导入',
                key: 'authVideo',
                children: [
                    { title: '上下架', key: 'authVideo/status' },
                    { title: '查看', key: 'authVideo/view' },
                    { title: '添加', key: 'authVideo/add' },
                    { title: '修改', key: 'authVideo/edit' },
                    { title: '删除', key: 'authVideo/del' },
                ]
            },
            {
                title: '练习题分类设置',
                key: 'authTcate',
                children: [
                    { title: '查看', key: 'authTcate/view' },
                    { title: '添加', key: 'authTcate/add' },
                    { title: '修改', key: 'authTcate/edit' },
                    { title: '禁启用', key: 'authTcate/status' },
                    { title: '删除', key: 'authTcate/del' },
                ]
            },
            {
                title: '练习题目管理',
                key: 'authTopic',
                children: [
                    { title: '查看', key: 'authTopic/view' },
                    { title: '发布题目', key: 'authTopic/add' },
                    { title: '禁启用', key: 'authTopic/status' },
                    { title: '修改', key: 'authTopic/edit' },
                    { title: '删除', key: 'authTopic/del' },
                    { title: '导入', key: 'authTopic/in' },
                ]
            },
            {
                title: '考题管理',
                key: 'authPaper',
                children: [
                    { title: '禁启用', key: 'authPaper/status' },
                    { title: '查看', key: 'authPaper/view' },
                    { title: '添加', key: 'authPaper/add' },
                    { title: '修改', key: 'authPaper/edit' },
                    { title: '删除', key: 'authPaper/del' },
                    { title: '导入', key: 'authPaper/in' },
                ]
            },
            {
                title: '线下课程管理',
                key: 'underlineClass',
                children: [
                    { title: '查看报名', key: 'underlineClass/apply' },
                    { title: '查看', key: 'underlineClass/view' },
                    { title: '上下架', key: 'underlineClass/status' },
                    { title: '添加', key: 'underlineClass/add' },
                    { title: '修改', key: 'underlineClass/edit' },
                    { title: '删除', key: 'underlineClass/del' },
                    { title: '导出', key: 'underlineClass/out' },
                ]
            },
        ]
    },
    {
        title: 'O2O管理',
        key: 'o2oMng',
        top: true,
        children: [
            {
                title: 'O2O资讯管理',
                key: 'o2onews',
                children: [
                    { title: '添加', key: 'o2onews/add' },
                    { title: '上下架', key: 'o2onews/status' },
                    { title: '修改', key: 'o2onews/edit' },
                    { title: '查看', key: 'o2onews/view' },
                    { title: '删除', key: 'o2onews/del' },
                ]
            },
            {
                title: '培训班管理',
                key: 'o2oClass',
                children: [
                    { title: '添加', key: 'o2oClass/add' },
                    { title: '上下架', key: 'o2oClass/status' },
                    { title: '修改', key: 'o2oClass/edit' },
                    { title: '查看', key: 'o2oClass/view' },
                    { title: '查看用户', key: 'o2oClass/user' },
                    { title: '删除', key: 'o2oClass/del' },
                    { title: '导入', key: 'o2oClass/in' },
                ]
            },
        ]
    },
    {
        title: '资讯管理',
        key: 'newsMng',
        top: true,
        children: [
            {
                title: '资讯管理',
                key: 'news',
                children: [
                    { title: '置顶', key: 'news/top' },
                    { title: '上下架', key: 'news/status' },
                    { title: '添加', key: 'news/add' },
                    { title: '所有评论', key: 'news/all' },
                    { title: '修改', key: 'news/edit' },
                    { title: '查看', key: 'news/view' },
                    { title: '删除', key: 'news/del' },
                    { title: '查看结果', key: 'news/res' },
                ]
            },
            {
                title: '标签管理',
                key: 'newsLabel',
                children: [
                    { title: '禁启用', key: 'newsLabel/status' },
                    { title: '添加', key: 'newsLabel/add' },
                    { title: '修改', key: 'newsLabel/edit' },
                    { title: '查看', key: 'newsLabel/view' },
                    { title: '删除', key: 'newsLabel/del' },
                ]
            },
        ]
    },
    {
        title: '问答管理',
        key: 'ask',
        top: true,
        children: [
            { title: '问答管理', key: 'ask/list' },
            { title: '回答管理', key: 'ask/comment' },
            { title: '分类管理', key: 'ask/cate' },
            { title: '添加', key: 'ask/add' },
            { title: '修改', key: 'ask/edit' },
            { title: '删除', key: 'ask/del' },
        ]
    },
    {
        title: '运营管理',
        key: 'operateMng',
        top: true,
        children: [
            {
                title: '广告管理',
                key: 'ad',
                children: [
                    { title: '查看报表', key: 'ad/excel' },
                    { title: '添加', key: 'ad/add' },
                    { title: '上下架', key: 'ad/status' },
                    { title: '修改', key: 'ad/edit' },
                    { title: '查看', key: 'ad/view' },
                    { title: '删除', key: 'ad/del' },
                ]
            },
            {
                title: '消息管理',
                key: 'msg',
                children: [
                    { title: '撤回', key: 'msg/dimiss' },
                    { title: '推送', key: 'msg/push' },
                    { title: '添加', key: 'msg/add' },
                    { title: '修改', key: 'msg/edit' },
                    { title: '查看', key: 'msg/view' },
                    { title: '删除', key: 'msg/del' },
                ]
            },
            {
                title: '模版管理',
                key: 'tmp',
                children: [
                    { title: '添加', key: 'tmp/add' },
                    { title: '修改', key: 'tmp/edit' },
                    { title: '查看', key: 'tmp/view' },
                    { title: '删除', key: 'tmp/del' },
                ]
            },
            {
                title: '搜索管理',
                key: 'search',
                children: [
                    { title: '添加', key: 'search/add' },
                    // { title: '修改', key: 'search/edit' },
                    { title: '删除', key: 'search/del' },
                ]
            },
            {
                title: '打赏翻牌',
                key: 'cardActive',
                children: [
                    { title: '设置金币消耗', key: 'cardActive/coinsetting' },
                    { title: '设置翻牌封面', key: 'cardActive/post' },
                    { title: '翻牌规则', key: 'cardActive/rulesetting' },
                    { title: '添加礼物', key: 'cardActive/giftAdd' },
                    { title: '添加', key: 'cardActive/add' },
                    { title: '修改', key: 'cardActive/edit' },
                    { title: '删除', key: 'cardActive/del' },
                    { title: '获奖列表', key: 'cardActive/list' },
                ]
            },
            {
                title: '敏感词管理',
                key: 'sen',
                children: [
                    { title: '添加', key: 'sen/add' },
                    { title: '修改', key: 'sen/edit' },
                    { title: '删除', key: 'sen/del' },
                ]
            },
            {
                title: '邀请管理',
                key: 'invite',
                children: [
                    { title: '查看', key: 'invite/view' },
                    {
                        title: '推荐图片管理', key: 'inviteImg', children: [
                            { title: '添加', key: 'inviteImg/add' },
                            { title: '查看', key: 'inviteImg/view' },
                            { title: '修改', key: 'inviteImg/edit' },
                            { title: '删除', key: 'inviteImg/del' },
                        ]
                    },
                ]
            },
            {
                title: '刮刮卡管理',
                key: 'guagua',
                children: [
                    { title: '添加', key: 'guagua/add' },
                    { title: '修改', key: 'guagua/edit' },
                    { title: '获奖列表', key: 'guagua/list' },
                ]
            },
            {
                title: 'UI装修管理',
                key: 'ui',
                children: [
                    { title: '查看', key: 'ui/view' },
                    { title: '修改', key: 'ui/edit' },
                ]
            },
            {
                title: '帮助反馈管理',
                key: 'feedlist',
                children: [
                    { title: '查看', key: 'feedlist/view' },
                    { title: '查看问题', key: 'feedlist/question' },
                    { title: '禁启用', key: 'feedlist/status' },
                    { title: '修改', key: 'feedlist/edit' },
                    { title: '添加问题', key: 'feedlist/add' },
                    { title: '添加分类', key: 'feedlist/addCate' },
                    { title: '删除', key: 'feedlist/del' },
                ]
            },
        ]
    },
    {
        title: '素材库',
        key: 'mediaMng',
        children: [
            { title: '查看', key: 'mediaMng/view' },
        ]
    },
    {
        title: '线下活动管理',
        key: 'underActiveMng',
        children: [
            { title: '查看', key: 'underActive/view' },
            { title: '修改', key: 'underActive/edit' },
            { title: '上下架', key: 'underActive/status' },
            { title: '添加', key: 'underActive/add' },
            { title: '删除', key: 'underActive/del' },
            { title: '查看报名', key: 'underActive/user' },
            { title: '导入', key: 'underActive/in' },
        ]
    },
    {
        title: '关于我们',
        key: 'aboutMng',
        children: [
            { title: '查看', key: 'about/view' },
            { title: '修改', key: 'about/edit' },
        ]
    },
    {
        title: '系统管理',
        key: 'sysMng',
        top: true,
        children: [
            {
                title: '权限管理',
                key: 'auth',
                children: [
                    { title: '添加', key: 'auth/add' },
                    { title: '设置', key: 'auth/edit' },
                    { title: '禁用启用', key: 'auth/status' },
                    { title: '删除', key: 'auth/del' },
                ]
            },
            {
                title: '管理员管理',
                key: 'admin',
                children: [
                    { title: '添加', key: 'admin/add' },
                    { title: '修改', key: 'admin/edit' },
                    { title: '禁启用', key: 'admin/status' },
                    // { title: '删除', key: 'admin/del' },
                ]
            },
            {
                title: '日志管理',
                key: 'log',
                children: [
                    { title: '查看', key: 'log/view' },
                ]
            }
        ]
    },
    {
        title: '年度账单',
        key: 'year',
        children: [
            { title: '编辑', key: 'year/edit' },
            { title: '查看', key: 'year/view' },
            { title: '设置', key: 'year/setting' },
        ]
    },
    {
        title:'榜单管理',
        key:'rank',
        children: [
            { title: '编辑', key: 'rank/edit' },
            { title: '查看', key: 'rank/view' },
        ]
    },
    {
        title:'风采省份管理',
        key:'province',
        children: [
            { title: '查看', key: 'province/view' },
            { title: '设置', key: 'province/edit' }
        ]
    },
    {
        title:'下载专区管理',
        key:'imgDownLoad',
        children: [
            { title: '编辑', key: 'imgDownLoad/edit' },
            { title: '查看', key: 'imgDownLoad/view' },
            // { title: '查看', key: 'imgDownLoad/delete' },
        ]
    },
    {
        title:'研讨会',
        key:'meetting',
        top: true,
        children:[
            {
                title:'研讨会课程管理',
                key:'kechen',
                children:[
                    {title:'查看',key:'kechen/view'},
                    {title:'修改',key:'kechen/edit'},
                    {title:'删除',key:'kechen/delete'},
                ]
            },
            {
                title:'研讨会评论管理',
                key:'meetcomment',
                children:[
                    {title:'查看',key:'meetcomment/view'},
                    {title:'评论管理',key:'meetcomment/check'},
                    {title:'删除',key:'meetcomment/delete'},
                ]
            },
            {
                title:'心情墙管理',
                key:'mood',
                children:[
                    {title:'审核',key:'kechen/mood'},
                ]
            },
            {
                title:'名单管理',
                key:'users',
                children:[
                    {title:'查看',key:'users/view'},
                    {title:'修改',key:'users/edit'},
                    {title:'删除',key:'users/delete'},
                ]
            },
            {
                title:'精彩瞬间管理',
                key:'activity',
                children:[
                    {title:'查看',key:'activity/view'},
                    {title:'修改',key:'activity/edit'},
                    {title:'删除',key:'activity/delete'},
                ]
            },
            {
                title:'闯关任务管理',
                key:'tasks',
                children:[
                    {title:'查看',key:'tasks/view'},
                    {title:'修改',key:'tasks/edit'},
                ]
            },
            {
                title:'研讨会题库',
                key:'tiku',
                children:[
                    {
                        title:'研讨会题目列表',
                        key:'tikulist',
                        children:[
                            {title:'查看',key:'tikulist/view'},
                            {title:'修改',key:'tikulist/edit'},
                            {title:'删除',key:'tikulist/delete'},
                        ]
                    },
                    {
                        title:'试卷管理',
                        key:'shijuan',
                        children:[
                            {title:'查看',key:'shijuan/view'},
                            {title:'修改',key:'shijuan/edit'},
                            {title:'删除',key:'shijuan/delete'},
                        ]
                    }
                ]
            },
            {
                title:'研讨会标签管理',
                key:'biaoqian',
                children:[
                    {title:'查看',key:'biaoqian/view'},
                    {title:'修改',key:'biaoqian/edit'},
                    {title:'删除',key:'biaoqian/delete'},
                ]
            },
            {
                title:'研讨会课程栏目管理',
                key:'lanmu',
                children:[
                    {title:'查看',key:'lanmu/view'},
                    {title:'修改',key:'lanmu/edit'},
                    {title:'删除',key:'lanmu/delete'},
                ]
            },
        ]
    },
    // {
    //     title:'完美林',
    //     key:'tree',
    //     top: true,
    //     children:[
    //         {
    //             title:'种子管理',
    //             key:'seed',
    //             children:[
    //                 {title:'查看',key:'seed/view'},
    //                 {title:'修改',key:'seed/edit'},
    //                 {title:'删除',key:'seed/delete'},
    //             ]
    //         },
    //         {
    //             title:'兑换管理',
    //             key:'treegoods',
    //             children:[
    //                 {
    //                     title:'商品管理',
    //                     key:'goodslist',
    //                     children:[
    //                         {title:'查看',key:'goodslist/view'},
    //                         {title:'修改',key:'goodslist/edit'},
    //                         {title:'删除',key:'goodslist/delete'},
    //                     ]
    //                 },
    //                 {
    //                     title:'兑换列表',
    //                     key:'exchanges',
    //                     children:[
    //                         {title:'修改',key:'exchanges/edit'},
    //                     ]
    //                 },
    //             ]
    //         },
    //         {
    //             title:'阳光管理',
    //             key:'suns',
    //             children:[
    //                 {title:'修改',key:'suns/edit'},
    //             ]
    //         },
    //         {
    //             title:'攻略管理',
    //             key:'manual',
    //             children:[
    //                 {title:'修改',key:'manual/edit'},
    //                 {title:'删除',key:'seed/delete'},
    //             ]
    //         },
    //     ]
    // },
    // {
    //     title:'趣味探索管理',
    //     key:'GameManager',
    //     top: true,
    //     children:[
    //         {
    //             title:'专题赛管理',
    //             key:'specialGame',
    //             children:[
    //                 {title:'查看',key:'specialGame/view'},
    //                 {title:'修改',key:'specialGame/edit'},
    //                 {title:'删除',key:'specialGame/delete'},
    //             ]
    //         },
    //         {
    //             title:'段位管理',
    //             key:'levelManager',
    //             children:[
    //                 {title:'查看',key:'levelManager/view'},
    //                 {title:'修改',key:'levelManager/edit'},
    //                 {title:'删除',key:'levelManager/delete'},
    //             ]
    //         },
    //         {
    //             title:'趣味探索题库管理',
    //             key:'rankPaper',
    //             children:[
    //                 {
    //                     title:'趣味探索题库',
    //                     key:'QuestionClassify',
    //                     children:[
    //                         {title:'审核',key:'QuestionClassify/check'},
    //                         {title:'修改',key:'QuestionClassify/edit'},
    //                         {title:'删除',key:'QuestionClassify/delete'},
    //                     ]
    //                 },
    //                 {
    //                     title:'题目分类管理',
    //                     key:'QuestionClassifys',
    //                     children:[
    //                         {title:'查看',key:'QuestionClassifys/view'},
    //                         {title:'修改',key:'QuestionClassifys/edit'},
    //                         {title:'删除',key:'QuestionClassifys/delete'},
    //                     ]
    //                 },
    //             ]
    //         },
    //     ]
    // }
]