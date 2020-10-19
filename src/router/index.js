import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
import Login from 'views/login/Login'
import Home from '../components/home/Home'
import Welcome from '../components/home/welcome/Welcome'
import Users from 'components/users/Users'
import Rights from 'components/power/Rights'
import Roles from 'components/power/Roles'
import Cate from 'components/goods/Cate'
import Params from 'components/goods/Params'
import List from 'components/goods/List'
import Add from 'components/goods/Add'
const routes = [
    {
        path:'/',
        redirect:'/login'
    },
    {
        path:'/login',
        component:Login
    },
    {
        path:'/home',
        component:Home,
        redirect:'/welcome',
        children:[
            {
                path:'/welcome',
                component:Welcome
            },
            {
                path:'/users',
                component:Users
            },
            {
                path:'/rights',
                component:Rights
            },
            {
                path:'/roles',
                component:Roles
            },
            {
                path:'/categories',
                component:Cate
            },
            {
                path:'/params',
                component:Params
            },
            {
                path:'/goods',
                component:List
            },
            {
                path:'/goods/add',
                component:Add
            },
        ]
    },

]
const router = new VueRouter({
    routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
    //to 将要访问的路径
    //from 代表从哪个路径跳转而来
    //next 是一个函数，表示放行
    //  next() 放行 next('/login') 强制跳转

    // 根据to.path来判断路由地址
    //如果用户访问的是登录页，可以直接放行 所以next()过去
    if(to.path === '/login'){
        return next()
    }
    //把用户储存在sessionStorage中的token来做一个判断，
    //如果没有tokenStr,则跳转到login页面
    
    if(!tokenStr){const tokenStr = window.sessionStorage.getItem('token')
        return next('/login')
    }else{
        next()
    }
})

// 解决双击路由报错问题
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

export default router