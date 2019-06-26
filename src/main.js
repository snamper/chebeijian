import Vue from 'vue'
import VueResource from 'vue-resource'
import VueLazyload from 'vue-lazyload'
import BoostrapVue from 'bootstrap-vue'
import VueProgressBar from 'vue-progressbar'
import VueResourceProgressBarInterceptor from 'vue-resource-progressbar-interceptor'
import VueQuillEditor from 'vue-quill-editor'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import App from './App.vue'
import router from './router'
import './config'

// 定义公共图片调用网址
import global_ from './App.vue' //引用文件
Vue.prototype.GLOBAL = global_ //挂载到Vue实例上面

import '../theme/index.css'

import './js/common/api'
import './js/common/login'
import './js/common/storage'

import $ from 'jquery'

// 配置全局域名
import domain from './js/domain.js'
global.domain = domain

//配置图标全局网址
import iconUrl from './js/domain.js'
global.iconUrl = iconUrl

import 'vant/lib/vant-css/index.css'

import {
  Row,
  Col,
  Cell,
  Icon,
  Field,
  CellGroup,
  Swipe,
  SwipeItem,
  Button,
  NavBar,
  List,
} from 'vant'
Vue.use(Row)
Vue.use(Col)
Vue.use(Cell)
Vue.use(Icon)
Vue.use(Field)
Vue.use(CellGroup)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Button)
Vue.use(NavBar)
Vue.use(List)
Vue.use(VueAwesomeSwiper)

// 颜色选择器插件
import colorPicker from './plugin/vue-color-picker'

Vue.use(colorPicker)

Vue.use(VueResource)
Vue.use(BoostrapVue)
Vue.use(VueLazyload)
Vue.use(VueProgressBar)
// 设置进度条，超过50ms未响应的API将显示进度条
Vue.use(VueResourceProgressBarInterceptor, {
  latencyThreshold: 50,
  responseLatency: 50,
})
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

function formatComponentName(vm) {
  if (vm.$root === vm) return 'root'

  var name = vm._isVue ?
    (vm.$options && vm.$options.name) ||
    (vm.$options && vm.$options._componentTag) :
    vm.name
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options && vm.$options.__file ?
      ' at ' + (vm.$options && vm.$options.__file) :
      '')
  )
}

// 测试环境不监听BUG
if (__API_HOSTURL__ !== 'http://apidaily.mockuai.com/') {
  Vue.config.errorHandler = function (err, vm, info) {
    var componentName = formatComponentName(vm)
    var propsData = vm.$options && vm.$options.propsData

    fundebug.notifyError(err, {
      metaData: {
        componentName: componentName,
        propsData: propsData,
        info: info,
      },
    })
  }
}

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App,
  },
})