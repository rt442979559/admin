<template>
  <div>
    <div class="toggle-button" @click="toggleClick" >| | |</div>
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409BFF" unique-opened 
      :collapse="isCollapse"  :collapse-transition="false"
      :router="true">
    <!-- 一级菜单 -->
      <el-submenu :index="index + ''" v-for="(item,index) in menulist" :key="item.id" >
        <!-- 一级菜单的模板区 -->
        <template slot="title">
                <!-- 图标 -->
            <i :class="iconsObj[item.id]"></i>
                <!-- 文本 -->
            <span>{{item.authName}}</span>
        </template>

        <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                    <!-- 图标 -->
                    <i class="el-icon-menu" ></i>
                    <!-- 文本 -->
                    <span>{{subItem.authName}}</span>
                </template>
            </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Aside",
  data() {
      return {
          //左侧菜单数据
          menulist:[],
          iconsObj:{
              '125':'el-icon-user',
              '103':'el-icon-wind-power',
              '101':'el-icon-s-claim',
              '102':'el-icon-s-order',
              '145':'el-icon-data-line'
          },
          //是否折叠
          isCollapse:false
      }
  },
  created() {
      this.getMenusList()
  },
  methods: {
      //获取所有菜单
      async getMenusList(){
        const {data:res} = await this.$http.get('menus')
            // console.log(res);
            //先判断状态是不是200
            if(res.meta.status !== 200) {
                //如果不是200 则返回失败信息
                return this.$message.error(res.meta.msg)
            }
            // 获取左侧菜单数据
            this.menulist = res.data
        // this.$http.get('menus').then((res) => {
        //     console.log(res);
        //     this.menulist = res.data.data
        // }).catch((err) => {
            
        // });
      },
      toggleClick(){
          this.isCollapse =! this.isCollapse
          this.$emit('zhedie',this.isCollapse)
      }
  },
};
</script>

<style scoped>
    .el-menu{
        border-right: none;
    }
    .toggle-button{
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: white;
        text-align: center;
        cursor: pointer;
    }
</style>