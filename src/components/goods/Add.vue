<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" 
      label-position="top" class="demo-ruleForm">
      <el-tabs tab-position="left" style="height: 200px;" v-model="activeIndex">
        <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">2</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">3</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">4</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">5</el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      //添加商品表单的数据对象
      addForm:{},
      addFormRules:{}
    };
  },
  created() {},
  methods: {}
};
</script>

<style scoped>
.el-steps {
  margin: 15px 0;
}
</style>