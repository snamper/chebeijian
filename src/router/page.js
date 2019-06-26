// Containers
import Full from '@/containers/common/Full';
import Router from 'vue-router';

import Index from '@/views/pages/index' // 首页
import Search from '@/views/pages/Search' // 首页搜索
import searchResult from '@/views/pages/searchResult' // 搜索结果
import Notice from '@/views/pages/Notice' // 首页消息
import noticeDetail from '@/views/pages/noticeDetail' // 消息详情
// 分类
import Classification from '@/views/pages/Classification' // 配件分类
// 门店
import storesList from '@/views/pages/storesList' // 门店列表
import storesDetail from '@/views/pages/storesDetail' // 门店详情


// 订单
import UpkeepOrderList from '@/views/pages/UpkeepOrderList' // 保养单订单列表
import GoodsOrderList from '@/views/pages/GoodsOrderList' //配件订单列表
import GoodsOrderDetail from '@/views/pages/GoodsOrderDetail' // 配件订单详情
import UpkeepOrderDetail from '@/views/pages/UpkeepOrderDetail' //  保养单订单详情
import OrderConfirm from '@/views/pages/OrderConfirm' // 确认订单
import ChooseInvoice from '@/views/pages/ChooseInvoice' // 选择发票
// 商品
import GoodsList from '@/views/pages/GoodsList' // 商品列表
import GoodsDetail from '@/views/pages/GoodsDetail' // 商品详情
import ChooseStore from '@/views/pages/ChooseStore' // 选择门店
// 购物车
import CartList from '@/views/pages/CartList' // 购物车列表



// 我的
import UserIndex from '@/views/pages/UserIndex' // 我的
import UserInfo from '@/views/pages/UserInfo' // 个人信息
import ModifyMobileStep1 from '@/views/pages/ModifyMobileStep1' // 修改手机号码1
import ModifyMobileStep2 from '@/views/pages/ModifyMobileStep2' // 修改手机号码2
import ModifyName from '@/views/pages/ModifyName' // 修改姓名
import CarList from '@/views/pages/CarList' // 车辆信息
import CarDetail from '@/views/pages/CarDetail' // 车辆信息详情
import AddCar from '@/views/pages/AddCar' // 新增车辆
import AddressList from '@/views/pages/AddressList' // 地址管理
import AddressEdit from '@/views/pages/AddressEdit' // 地址详情（修改地址）
import InvoiceList from '@/views/pages/InvoiceList' // 发票管理
import PersonalAddInvoice from '@/views/pages/PersonalAddInvoice' // 个人添加发票
import CompanyAddInvoice from '@/views/pages/CompanyAddInvoice' // 企业添加发票
import IntegralList from '@/views/pages/IntegralList' // 积分管理
import ModifyPassword from '@/views/pages/ModifyPassword' // 修改密码
import Setting from '@/views/pages/Setting' // 设置
import About from '@/views/pages/About' // 关于我们
import CollectList from '@/views/pages/CollectList' // 我的收藏



// 选择车型
import ChooseModels from '@/views/pages/ChooseModels' // 选择车型
import ChooseCar from '@/views/pages/ChooseCar' // 选择车型
import ChooseYear from '@/views/pages/ChooseYear' // 选择生成年份
// 预约保养
import UpkeepSubmit from '@/views/pages/UpkeepSubmit' // 保养单
import UpkeepStore from '@/views/pages/UpkeepStore' // 选择门店
import UpkeepSucceed from '@/views/pages/UpkeepSucceed' // 保养单提交成功
import UpkeepFailure from '@/views/pages/UpkeepFailure' // 保养单提交失败
// 预约车险
import CarInsurance from '@/views/pages/CarInsurance' // 预约车险
import Succeed from '@/views/pages/Succeed' // 预约成功
import Failure from '@/views/pages/Failure' // 预约失败
import CarInsuranceList from '@/views/pages/CarInsuranceList' // 我的保险预约单
import InsuranceList from '@/views/pages/InsuranceList' // 保险单
// 注册登录
import Login from '@/views/pages/Login' // 登录
import WeChatLogin from '@/views/pages/WeChatLogin' // 登录
import Register from '@/views/pages/Register' // 注册
import PasswordFind from '@/views/pages/PasswordFind' // 找回密码
import EnterPassword from '@/views/pages/EnterPassword' // 输入新密码
import UserAgreement from '@/views/pages/UserAgreement' // 用户协议

import paySucceed from '@/views/pages/paySucceed' // 支付成功



const route = [{
    path: '/',
    redirect: '/index',
    name: '爱车养护',
    component: Full,
    children: [{
            path: 'index',
            name: '首页',
            component: Index,
        },
        {
            path: 'Search',
            name: '搜索',
            component: Search,
        },
        {
            path: 'searchResult',
            name: '搜索结果',
            component: searchResult,
        },
        {
            path: 'Notice',
            name: '消息',
            component: Notice,
        },
        {
            path: 'noticeDetail',
            name: '消息详情',
            component: noticeDetail,
        },
        {
            path: 'Classification',
            name: '配件分类',
            component: Classification,
        },
        {
            path: 'storesList',
            name: '门店',
            component: storesList,
        },
        {
            path: 'storesDetail',
            name: '门店详情',
            component: storesDetail,
        },
        {
            path: 'UpkeepOrderList',
            name: '保养单订单',
            component: UpkeepOrderList,
        },
        {
            path: 'GoodsOrderList',
            name: '配件单订单',
            component: GoodsOrderList,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: 'GoodsOrderDetail',
            name: '配件订单详情',
            component: GoodsOrderDetail,
        },
        {
            path: 'UpkeepOrderDetail',
            name: '保养订单详情',
            component: UpkeepOrderDetail,
        },

        {
            path: 'UpkeepStore',
            name: '保养单选择门店',
            component: UpkeepStore,
        },
        {
            path: 'OrderConfirm',
            name: '确认订单',
            component: OrderConfirm,
        },
        {
            path: 'ChooseInvoice',
            name: '选择发票',
            component: ChooseInvoice,
        },
        {
            path: 'GoodsList',
            name: '商品列表',
            component: GoodsList,
        },
        {
            path: 'GoodsDetail',
            name: '商品详情',
            component: GoodsDetail,
        },
        {
            path: 'ChooseStore',
            name: '选择门店',
            component: ChooseStore,
        },
        {
            path: 'CartList',
            name: '购物车',
            component: CartList,
        },
        {
            path: 'UserIndex',
            name: '我的',
            component: UserIndex,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: 'UserInfo',
            name: '个人信息',
            component: UserInfo,
            meta: {
                requiresAuth: true
            }

        },
        {
            path: 'ModifyMobileStep1',
            name: '修改手机号',
            component: ModifyMobileStep1,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: 'ModifyMobileStep2',
            name: '修改手机号2',
            component: ModifyMobileStep2,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: 'ModifyName',
            name: '修改姓名',
            component: ModifyName,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: 'CarList',
            name: '车辆信息',
            component: CarList,
        }, {
            path: 'CarDetail',
            name: '车辆详情',
            component: CarDetail,
        }, {
            path: 'AddCar',
            name: '新增车辆',
            component: AddCar,
        }, {
            path: 'AddressList',
            name: '地址管理',
            component: AddressList,
        }, {
            path: 'AddressEdit',
            name: '地址详情',
            component: AddressEdit,
        }, {
            path: 'InvoiceList',
            name: '发票管理',
            component: InvoiceList,
        }, {
            path: 'PersonalAddInvoice',
            name: '个人添加发票',
            component: PersonalAddInvoice,
        }, {
            path: 'CompanyAddInvoice',
            name: '公司添加发票',
            component: CompanyAddInvoice,
        }, {
            path: 'IntegralList',
            name: '积分管理',
            component: IntegralList,
        }, {
            path: 'ModifyPassword',
            name: '修改密码',
            component: ModifyPassword,
        }, {
            path: 'Setting',
            name: '设置',
            component: Setting,
            meta: {
                requiresAuth: true
            }
        }, {
            path: 'About',
            name: '关于我们',
            component: About,
        }, {
            path: 'CollectList',
            name: '我的收藏',
            component: CollectList,
            meta: {
                requiresAuth: true
            }
        }, {
            path: 'ChooseModels',
            name: '搜索车型',
            component: ChooseModels,
        },
        {
            path: 'ChooseCar',
            name: '选择车型',
            component: ChooseCar,
        },
        {
            path: 'ChooseYear',
            name: '选择生成年份',
            component: ChooseYear,
        },
        {
            path: 'UpkeepSubmit',
            name: '预约保养',
            component: UpkeepSubmit,
        }, {
            path: 'UpkeepSucceed',
            name: '提交成功',
            component: UpkeepSucceed,
        }, {
            path: 'UpkeepFailure',
            name: '提交失败',
            component: UpkeepFailure,
        }, {
            path: 'CarInsurance',
            name: '预约车险',
            component: CarInsurance,
            meta: {
                requiresAuth: true
            }
        }, {
            path: 'pay/paySuccessMiddle',
            name: '预约成功',
            component: Succeed,
        }, {
            path: 'Failure',
            name: '预约失败',
            component: Failure,
        }, {
            path: 'CarInsuranceList',
            name: '我的保险预约单',
            component: CarInsuranceList,
        }, {
            path: 'InsuranceList',
            name: '保险单',
            component: InsuranceList,
        }, {
            path: 'Login',
            name: '用户登录',
            component: Login,
        }, {
            path: 'WeChatLogin',
            name: '微信登录',
            component: WeChatLogin,
        },
        {
            path: 'Register',
            name: '注册',
            component: Register,
        },
        {
            path: 'PasswordFind',
            name: '找回密码',
            component: PasswordFind,
        },
        {
            path: 'EnterPassword',
            name: '输入新密码',
            component: EnterPassword,
        },
        {
            path: 'UserAgreement',
            name: '用户协议',
            component: UserAgreement,
        },
        {
            path: 'paySucceed',
            name: '支付成功',
            component: paySucceed,
        },


    ],
}, ];
export default route;