<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/categories' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格占位 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        style="margin-top:10px"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效模板 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:skyblue"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类按钮 弹出的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        status-icon
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
            <!-- options指定数据源 -->
            <!-- props用来指定数据对象 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',chilren:'children' ,checkStrictly:'true'}"
              @change="parentCateListChange"
              clearable
              getCheckedNodes="true"
            ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类的数据列表
      cateList: [],
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //总数据条数
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      //控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      //添加分类的表单数据对象
      addCateForm: {
        //要添加的分类名称
        cat_name: "",
        //父级分类的id
        cat_pid: 0,
        //默认要添加的分类等级
        cat_level: 0
      },
      //添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigget: "blur" }
        ]
      },
      //父级分类列表
      parentCateList: [],
        //选中的级联选择项的id
      selectedKeys:[]
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      // console.log(res);
      if (res.meta.status !== 200) return;
      // 获取商品列表
      this.cateList = res.data.result;
      console.log(this.cateList);
      //获取总数据条数
      this.total = res.data.total;
      //   console.log(this.total);
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      // 因为数据改变 所以需要再发一次请求
      this.getCateList();
    },
    //监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    //点击按钮 展示添加分类的对话框
    async showAddCateDialog() {
      //先获取父级列表 再展示对话框
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      // console.log(res.data);
      this.parentCateList = res.data;
    },
    //选择项发生变化触发这个函数
    parentCateListChange(selectedKeys){
        console.table(this.selectedKeys);
        if(this.selectedKeys.length >0){
          this.selectedKeys[this.selectedKeys.length - 1]
          this.addCateForm.cat_level = this.selectedKeys.length
          return
        }
        else{
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0 
        }
    },
    // 点击确定提交表单信息
    async addCate(){
      console.log(this.addCateForm);
        const {data:res} = await this.$http.post('categories',this.addCateForm)
          this.$message.success('添加分类成功')
          this.getCateList()
          this.addCateDialogVisible = false
    },
    //监听对话框的关闭事件 重置表单数据
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0 
    }
  }
};
</script>

<style scoped>
.el-cascader{
    width: 100%;
}
</style>