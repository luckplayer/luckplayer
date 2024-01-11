
export default {
  define_status: {
    all: '全部',
    yes: '是',
    no: '否'
  },
  define_user_status: {
    all: '全部',
    yes: '正常',
    no: '锁定'
  },
  define_op_status: {
    yes: '成功',
    no: '失败'
  },
  define_table: {
    created_at: '创建时间',
    updated_at: '编辑时间',
    operation: '操作',
    role: '角色',
    role_name: '角色名称',
    permission: '权限',
    permission_name: '权限名称',
    permission_path: '权限路径',
    permission_is_show: '是否栏目',
    permission_refresh: '权限刷新',
    full_name: '姓名',
    user_name: '用户名',
    status: '状态',
    last_ip: '最后登录ip'
  },
  define_button: {
    select: '查询',
    add: '新增',
    edit: '编辑',
    delete: '删除',
    batch_delete: '批量删除',
    submit: '提交',
    cancel: '取消'
  },
  define_field: {
    uc_c_status: {
      all: '全部',
      yes: '正常',
      no: '锁定'
    },
    status: '状态',
    pwd: '密码',
    re_pwd: '重复密码',
    log_op_username: '操作人员账号',
    log_op_uid: '操作人员id',
    log_op_ip: '操作人员ip',
    log_op_permission: '操作权限',
    log_op_result: '操作结果',
    log_op_rquest: '操作信息',
    log_op_time: '操作时间',
    log_op_detail: '查看详情',
    log_op_msg: '请求信息',
    reason: '原因',
    start_at: '开始日期',
    end_at: '结束日期',
    hello: '您好',

    uc_m_name: '会员名',
    uc_m_username: '会员账号',
    uc_m_status: {
      all: '全部',
      yes: '正常',
      no: '锁定',
      expire: '过期'
    },
    uc_m_limit: '有效期',
    uc_m_client_num: '开通销售端（个）'
  },
  define_permission: {
    Dashboard: '控制台',
    home: '首页',
    welcome: '欢迎',
    system: '系统管理',
    sys_permissions: '权限列表',
    sys_roles: '角色列表',
    sys_users: '用户列表',
    sys_logs: '操作日志',
    usercenter: '用户中心',
    usercenter_manage: '会员账号',
    usercenter_client: '销售端账号'
  },
  tagsView: {
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  navbar: {
    title: '自动化管理系统',
    languageSwitch: '语言切换',
    theme: '主题'
  },
  skin: {
    Blue: '天空蓝',
    Green: '典雅绿',
    Red: '樱桃红',
    Purple: '贵族紫',
    Default: '默认'
  },
  route: {
  },
  permission: {
    // system_permission: '权限设置',
    // roles: '你的权限',
    // switchRoles: '切换权限'
  },
  excel: {
    export: '导出',
    selectedExport: '导出已选择项',
    placeholder: '请输入文件名(默认excel-list)'
  },
  zip: {
    export: '导出',
    placeholder: '请输入文件名(默认file)'
  },
  componentss: {
    documentation: '文档',
    tinymceTips: '富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了Tinymce。更详细的富文本比较和介绍见',
    dropzoneTips: '由于我司业务有特殊需求，而且要传七牛 所以没用第三方，选择了自己封装。代码非常的简单，具体代码你可以在这里看到 @/components/Dropzone',
    stickyTips: '当页面滚动到预设的位置会吸附在顶部',
    backToTopTips1: '页面滚动到指定位置会在右下角出现返回顶部按钮',
    backToTopTips2: '可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips: '由于我在使用时它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的话，优先还是使用官方版本。'
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  }
}
