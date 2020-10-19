<template>
  <div id="login">
      <div class="loginbox">
          <!-- 头像区域 -->
          <div class="avatarbox">
              <img src="~assets/img/cat.jpg" alt="">
          </div>
            <!-- 登陆表单区 -->
            <el-form ref="loginFormRef" class="loginfrom" :model="loginForm" :rules="loginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.username">
                    </el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password">
                    </el-input>
                </el-form-item>
                <!-- 按钮区 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="loginClick">登陆</el-button>
                    <el-button type="info" @click="resetClick">重置</el-button>
                </el-form-item>
            </el-form>
      </div>
  </div>
</template>

<script>
export default {
    name:"Login",
    data() {
        return {
            //这是登陆表单的数据绑定对象
            loginForm:{
                username:'admin',
                password:'123456'
            },
            //表单的验证规则
            loginFormRules:{
                username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
                password:[
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        //点击重置表单
        resetClick(){
            this.$refs.loginFormRef.resetFields()
            console.log(this);
        },
        loginClick(){
            this.$refs.loginFormRef.validate(async (valid) => {
                // console.log(valid);
                //判断是否有valid值 没有则直接返回
                if(!valid) return;
                const {data:res} = await this.$http.post('login',this.loginForm)
                // console.log(res);
                // 判断状态值是否为200，不是200则返回登陆失败信息
                if(res.meta.status !== 200){
                    return this.$message.error('登陆失败');
                }else{
                   this.$message.success('登陆成功')
                }
                // 将token储存到sessionStorage中，用来保持用户的登陆状态
                window.sessionStorage.setItem('token',res.data.token);
                this.$router.push('/home')
            })
        }
    },
}
</script>

<style scoped>
    #login{
        background-color: #2b4b6b;
        height: 100%;
    }
    .loginbox{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .avatarbox{
        height: 130px;
        width: 130px;
        border: 1px solid rgb(184, 169, 169);
        border-radius: 50%;
        padding: 8px;
        box-shadow: 0 0 10px rgb(177, 177, 177);
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .avatarbox img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .loginfrom{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btns{
        display: flex;
        justify-content:flex-end ;
    }
</style>