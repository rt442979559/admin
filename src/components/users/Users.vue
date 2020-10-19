<template>
  <div id="Users">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 表格-->
      <el-table :data="userlist" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name">
          <template slot-scope="scope">{{scope.row.role_name}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.mg_state}}
            <!-- 开关 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配权限按钮 -->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-share"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="clearRolefenpei">
      <p>当前用户:{{userInfo.username}}</p>
      <p>当前角色:{{userInfo.role_name}}</p>
      <p>
        分配新角色:
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      //获取用户列表当前参数
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 5
      },
      userlist: [],
      total: 0,
      //控制添加用户的显示与隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加表单的规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "长度在3到10之间",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "长度在6到15之间",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机",
            trigger: "blur"
          }
        ]
      },
      //控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      //需要被分配角色的用户信息
      userInfo: {},
      //所有角色数据列表
      rolesList: [],
      // 已选中的角色id值
      selectedRoleId:'',
    };
  },
  created() {
    this.getUserlist();
  },
  methods: {
    //发送用户列表数据的网络请求
    async getUserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status == !200) {
        return this.$message.error(res.meta.msg);
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserlist();
    },
    //监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserlist();
    },
    //监听 switch 开关状态的改变
    async userStateChanged(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/:${userinfo.mg_state}`
      );
      if (res.meta.status == !200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新状态失败");
      }
      this.$message.success("更新成功");
    },
    //监听 添加用户对话框的关闭事件(重置表单)
    addDialogClosed() {
      //重置表单
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮 添加新用户
    addUser() {
      //预校验
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return;
        //可以发起添加用户请求
        this.$http
          .post("users", this.addForm)
          .then(res => {
            console.log(res);
            this.$message.success("添加用户成功");
          })
          .catch(err => {
            console.log("添加用户失败");
            this.$message.error("添加用户失败");

            //重新刷新用户列表
            this.getUserlist();
          });
      });
    },
    //用户编辑按钮
    showEditDialog() {},
    //用户删除按钮
    async removeUserById(id) {
      console.log(id);
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //如果用户确认删除，则返回字符串 confirm
      //如果用户取消了删除，则返回字符串 cancel
      console.log(res);
      //判断用户按下了哪个按钮
      if (res !== "confirm") {
        //按下取消
        return this.$message.info("已经取消删除");
      }
      //按下删除
      // console.log('确认删除');
      const resdele = await this.$http.delete("users/" + id);
      // console.log(resdele);
      this.$message.success("删除用户成功");
      this.getUserlist();
    },
    //展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      //在展示对话框之前获取所有角色的列表
      const { data: res } = await this.$http.get("roles");
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },
    //点击按钮 保存 分配角色
    async saveRoleInfo(){
      if(!this.selectedRoleId){
        return this.$message.error("请选择分配的角色");
      }
     const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
     this.$message.success('更新列表成功');
     this.getUserlist();
     this.setRoleDialogVisible = false;
    },
    //关闭对话框时 清除当前选中的角色
    clearRolefenpei(){
      this.selectedRoleId = '',
      this.userInfo = {}
    }
  }
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.el-breadcrumb {
  font-size: 12px;
}
.el-card {
  box-shadow: 1px 3px 3px rgba(48, 45, 45, 0.15);
}
.el-table {
  margin-top: 20px;
  font-size: 12px;
}
</style>