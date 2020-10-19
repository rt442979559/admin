<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <!-- 头部警告区 -->
      <el-alert title="注意" type="warning" show-icon :closable="false"></el-alert>
      <el-row class="firstelrow">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <div class="block">
            <el-cascader
              v-model="selectedKeys"
              :options="cartList"
              :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',chilren:'children' ,checkStrictly:'true'}"
              @change="handleChange"
            ></el-cascader>
          </div>
        </el-col>
      </el-row>
      <!-- tab标签页区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                  <!-- tag标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable>{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  sizi="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  sizi="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index">索引列</el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  sizi="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  sizi="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- :model绑定的是数据源 -->
      <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + dialogTitle"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- :model绑定的是数据源 -->
      <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editFormRules">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartList: [],
      //   级联选择框双向绑定的数组
      selectedKeys: [],
      //    被激活页签的名称
      activeName: "many",
      //    动态参数参数
      manyTabData: [],
      //    静态参数参数
      onlyTabData: [],
      //    控制添加对话框的显示与隐藏
      addDialogVisible: false,
      //    添加参数的表单数据对象
      addForm: {
        attr_name: ""
      },
      //    添加表单验证规则对象
      addFormRules: {
        attr_name: [{ required: true, message: "请输入内容", trigger: "blur" }]
      },
      //    控制修改对话框的显示
      editDialogVisible: false,
      //    修改的表单数据对象
      editForm: {},
      //    修改表单验证规则对象
      editFormRules: {
        attr_name: [{ required: true, message: "请输入内容", trigger: "blur" }]
      },
    };
  },
  created() {
    //获取所有的商品分类列表
    this.getCartList();
  },
  methods: {
    //获取级联选择器内的cartlist
    async getCartList() {
      const { data: res } = await this.$http.get("/categories");
      this.cartList = res.data;
    },

    //级联选择框变化事件
    handleChange() {
      this.getParamsData();
    },
    //Tab页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData();
    },
    //获取参数
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        return;
      }
      //根据所选id获取对应参数项
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //控制文本框的显示与隐藏
        item.inputVisible = false
        //文本框中输入的内容
        item.inputValue = ''
      });
      console.log(res.data);
      if (this.activeName === "many") {
        this.manyTabData = res.data;
      } else {
        this.onlyTabData = res.data;
      }
      this.$message.success("获取成功");
    },
    //关闭对话框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击确定 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        this.$message.success("添加参数成功");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    //点击按钮 展示修改的对话框
    async showEditDialog(attr_id) {
      // console.log(attr_id);
      //查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      );
      console.log(res);
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    //关闭编辑对话框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //点击按钮 修改参数信息
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const {
          data: res
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败");
        } else {
          this.$message.success("修改参数成功");
          this.getParamsData();
          this.editDialogVisible = false;
        }
      });
    },
    //删除按钮
    async removeParams(attr_id) {
      const result = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (result !== "confirm") return this.$message.info("已取消删除");
      else {
        const { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${attr_id}`
        );
        if (res.meta.status !== 200) {
          return this.$message.error("删除参数失败");
        } else {
          this.$message.success("删除参数成功");
          this.getParamsData();
        }
      }
    },
    //文本框失去焦点 或摁下了enter键事件
    handleInputConfirm(row){
        console.log(row);
        row.inputVisible = false
    },
    //点击按钮 展示文本输入框
    showInput(row){
        row.inputVisible = true
        //文本框自动获得焦点
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    }
  },
  computed: {
    //如果按钮需要被禁用 则返回true 否则则返回false
    isBtnDisabled() {
      return this.selectedKeys.length !== 3 ? true : false;
    },
    //当前选中的三级分类的 id
    cateId() {
      return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null;
    },
    dialogTitle() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    }
  }
};
</script>

<style scoped>
.firstelrow {
  margin: 15px 0;
}
.block {
  display: inline-block;
  margin-left: 15px;
}
.el-tag {
  margin-right: 10px;
}
.el-input{
    width: 100px;
}
</style>