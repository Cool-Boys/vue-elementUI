<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">92学习网网课云挂机平台</h3>
      </div>
      <!-- type="border-card" -->
      <el-tabs v-model="loginForm.type" :stretch="true" @tab-click="handleClick">
        <el-tab-pane label="学生登录" name="2">
          <el-form-item>
            <el-select v-model="loginForm.platFormId" placeholder="请选择平台" style="width:100%">
              <el-option v-for="item in platFormOptions" :key="item.value" :label="item.label" :value="item.value">
                <span class="svg-container">
                  <svg-icon icon-class="shopping" />
                </span>
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="loginForm.platFormId==1" prop="school">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>

            <el-input
              ref="school"
              v-model="loginForm.school"
              placeholder="学校信息"
              name="school"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>

          <el-button :loading="loading" type="success" round style="width:50%;margin-bottom:30px;font-size:16pt;" @click.native.prevent="handleLogin2">登录</el-button>
          <el-link style="width:45%;margin-bottom:5px;font-size:10pt;" type="danger" :underline="false" href="tencent://message/?uin=827593830&Site=Sambow&Menu=yes">客服qq：827593830</el-link>
          <div class="title-container">
            <span class="bottom">
              1. 92学习网网课云挂机平台，学生登录您的学习账号下单即可拿到学分（稳定安全，绝无不良）。<br>
              2. 有问题及时私聊客服，会妥善替您解决。<br>
              3. 请勿相信qq/vx/淘宝代刷人员，他们不专业不安全
            </span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="会员登录" name="1">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>

          <el-button :loading="loading" type="primary" round style="width:50%;margin-bottom:30px;font-size:16pt;" @click.native.prevent="handleLogin">登录</el-button>
          <el-link style="width:45%;margin-bottom:5px;font-size:10pt;" type="danger" :underline="false" href="tencent://message/?uin=827593830&Site=Sambow&Menu=yes">客服qq：827593830</el-link>

          <div class="title-container">
            <span class="bottom">
              1. 92学习网网课云挂机平台，学生登录您的学习账号下单即可拿到学分（稳定安全，绝无不良）。<br>
              2. 有问题及时私聊客服，会妥善替您解决。<br>
              3. 请勿相信qq/vx/淘宝代刷人员，他们不专业不安全
            </span>
          </div>
          <div style="position:relative">
            <div class="tips">
              <span />
              <span />
            </div>
            <div class="tips">
              <span style="margin-right:18px;" />
              <span />
            </div>

            <!-- <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
              第三方登录
            </el-button> -->
          </div>
        </el-tab-pane>

      </el-tabs>

    </el-form>

    <el-dialog title="第三方登录" :visible.sync="showDialog">
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      // if (value.length < 3) {
      //   callback(new Error(''))
      // } else {
      callback()
      // }
    }
    return {
      loginForm: {
        type: '2',
        platFormId: '',
        school: '',
        username: '',
        password: ''
      },
      loginRules: {
        platFormId: [
          { required: true, message: '请选择平台', trigger: 'change' }
        ],
        school: [{ required: true, trigger: 'blur', message: '学校必填' }],
        username: [{ required: true, trigger: 'blur', message: '用户名必填' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      platFormOptions: [{ value: '1', label: '超星\\学习通' }, { value: '2', label: '智慧树\\知到(手机号登录)' }],
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    handleClick(tab, event) {
      console.log(tab)
      this.loginForm = {
        type: tab.name,
        platFormId: '',
        school: '',
        username: '',
        password: ''
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleLogin2() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input  input {
    color: $cursor;
  }
}

/* reset element-ui css */

.login-container {
  .el-tabs__item{
    color:aqua
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .bottom {
      font-size: 14px;
      color: $light_gray;
      margin: 0px auto 20px auto;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
