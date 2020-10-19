<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加角色按钮 -->
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 渲染一级权限 -->
            <el-row
              v-for="(item1,index1) in scope.row.children"
              :class="['rowbottom' , index1 === 0 ? 'rowtop':'','vcenter' ]"
              :key="index1.id"
            >
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :class="[index2 === 0 ? '':'rowtop','vcenter']"
                  :key="index2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6" class="left-col">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col class="right-col" :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,index3) in item2.children"
                      :key="index3.id"
                      @close="removeRightById(scope.row,index3.id)"
                      closable
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <pre>
              {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="*"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-lock" size="mini"
              @click="showSetRightLialog(scope.row)"> 设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="cleardefKeys">
      <!-- 树形结构 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox 
      node-key="id" default-expand-all  :default-checked-keys="defKeys" ref="treeRef"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRightLialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      //所有角色列表数据
      rolesList: [],
      // 控制对话框的显示与隐藏
      setRightDialogVisible:false,
      //所有权限的数据
      rightsList:[],
      treeProps: {
          children: 'children',
          label: 'authName'
      },
      //默认勾选的节点id值
      defKeys:[],
      //当前角色ID
      roleId:''
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    async getRoles() {
      const { data: res } = await this.$http.get("/roles");
      if (res.meta.status !== 200) return this.$message.error("获取列表失败");
      this.rolesList = res.data;
      // console.log(this.rolesList);
    },
    //根据id删除对应的权限
    async removeRightById(role, rightID) {
      //弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      console.log(confirmResult);
      if (confirmResult == "cancel") return this.$message.info("取消删除");
      else {
        // roles/:roleId/rights/:rightId
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/:${rightID}`
        );
      }
      // this.getRoles()
      role.children = res.data;
    },
    //展示修改权限对话框
    async showSetRightLialog(role) {
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200) return this.$message.error('获取列表失败')
      //把获取到的权限数据 保存到rightsList中
      this.rightsList = res.data
      this.roleId = role.id
      console.log(this.rightsList);
      this.getleafKeys(role,this.defKeys)
      this.setRightDialogVisible = true
    },
    //通过递归的形式获取当前角色下所有的 三级权限，并保存到defKeys数组中
    getleafKeys(node,arr){
      if(!node.children){
        //如果当前节点不包含chilidren 则是三级节点
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getleafKeys(item,arr)
      });
    },
    //监听对话框关闭
    cleardefKeys(){
      this.defKeys = []
    },
    //点击确定为角色分配权限
    async allotRights(){
      const keys = [...this.$refs.treeRef.getCheckedKeys()
      ,...this.$refs.treeRef.getHalfCheckedKeys()]
      console.log(keys);

      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      this.$message.success('分配权限成功')
      this.getRoles()
      this.setRightDialogVisible = false
    }
  }
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.rowtop {
  border-top: 2px solid rgba(219, 218, 218, 0.3);
}
.rowbottom {
  border-bottom: 2px solid rgba(219, 218, 218, 0.3);
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>