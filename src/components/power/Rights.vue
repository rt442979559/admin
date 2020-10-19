<template>
  <div id="rights">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片视图区 -->

    <el-card>
        <el-table :data="rightsList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="权限" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限层级" prop="level">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'">二级权限</el-tag>
              <el-tag type="warning" v-else>三级权限</el-tag>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      rightsList:[]
    };
  },
  created() {
    this.getRightsPower()
  },
  methods: {
    async getRightsPower() {
      const {data:res} = await this.$http.get('rights/list',{params:this.rightsList})
      console.log(res);
      if(res.meta.status !== 200) return this.$message.error('获取列表失败')
      this.rightsList = res.data
    }
  }
};
</script>

<style scoped>
</style>