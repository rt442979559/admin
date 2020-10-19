<template>
  <div class="home">
    <el-container class="home-container">
        <!-- 头部区 -->
      <el-header>
          <div>
              <img src="~assets/img/cat.jpg" alt="">
              <span>后台管理系统</span>
          </div>
          <!-- 退出按钮 -->
          <el-button type="info" @click="logout" round plain>退出</el-button>
      </el-header>
      <!-- 页面主体区 -->
      <el-container>
          <!-- 侧边栏 -->
        <el-aside :width="isCollapse? '60px':'200px'">
            <!-- 折叠按钮 -->
            <Aside @zhedie="zhedie"></Aside>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from 'components/home/aside/Aside'
export default {
  name: "Home",
  data() {
      return {
          isCollapse:false
      }
  },
  components:{
      Aside
  },
  methods: {
    //用户退出
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message.success("退出");
    },
    //点击按钮，菜单栏的折叠和展开
    zhedie(isCollapse){
        // console.log(isCollapse);
        this.isCollapse = isCollapse
    }
  }
};
</script>

<style scoped>
.home-container{
    height: 100vh;
}
.el-header{
    background-color: skyblue;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    align-items: center;
    font-size: 20px;
    color: white;
}
.el-header div{
    display: flex;
    align-items: center; 
}
.el-header div img{
    width: 45px;
    height: 45px;
    margin-right: 20px;
    border-radius: 50%;
}
.el-aside{
    background-color: paleturquoise;
}
.el-main{
    background-color: pink;
}

</style>