<template>
  <div>
    <el-form ref="dataForm" label-position="right" :model="temp" :rules="rules">
      <el-form-item label="QQ" prop="qq">
        <el-input v-model.trim="temp.qq" />
      </el-form-item>
      <el-form-item label="微信" prop="wx">
        <el-input v-model.trim="temp.wx" />
      </el-form-item>
      <!-- <el-form-item label="邀请码">
      <el-input v-model.trim="temp.becode" />
    </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submit">更新绑定</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="dataForm1" :model="temp1" :rules="rules1">
      <el-form-item label="邀请码">

        <!-- <el-input v-if="temp1.becode!==''" v-model.trim="temp1.becode" disabled /> -->
        <el-input v-model.trim="temp1.becode" />
      </el-form-item>
      <el-form-item>
        <el-button v-if="user.account.becode!==''" disabled type="primary" @click="submit1">确定</el-button>
        <el-button v-else type="primary" @click="submit1">确定</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="dataForm2" :model="temp2" :rules="rules2">
      <el-form-item label="旧密码">
        <el-input v-model.trim="temp2.opassword" show-password />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model.trim="temp2.npassword1" show-password />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model.trim="temp2.npassword" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit2">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { update } from '@/api/user'
import { modPwd } from '@/api/common'
import store from '@/store'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          qq: '',
          wx: ''
        }
      }
    }
  },

  data() {
    return {
      temp: {
        usersId: store.getters.userId,
        qq: this.user.account.qq,
        wx: this.user.account.wx
        // becode: this.user.account.becode

      },
      temp1: {
        usersId: store.getters.userId,

        becode: this.user.account.becode

      },
      temp2: {
        usersId: store.getters.userId,
        opassword: '',
        npassword1: '',
        npassword: ''

      },
      rules: {
        qq: [{ required: true, message: '内容必填', trigger: 'blur' }],
        wx: [{ required: true, message: '内容必填', trigger: 'blur' }]
      },
      rules1: {
        becode: [{ required: true, message: '内容必填', trigger: 'blur' }]
      },
      rules2: {
        opassword: [{ required: true, message: '内容必填', trigger: 'blur' }],
        npassword: [{ required: true, message: '内容必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    normalizedSize: function() {
      return this.user.trim()
    }
  },
  methods: {
    submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          update({ bean: JSON.stringify(this.temp) }).then(() => {
            debugger
            this.$message({
              message: '用户信息绑定更新成功！',
              type: 'success',
              duration: 5 * 1000
            })
          })
        }
      })
    },
    submit1() {
      this.$refs['dataForm1'].validate((valid) => {
        if (valid) {
          update({ bean: JSON.stringify(this.temp1) }).then(() => {
            this.$message({
              message: '邀请码绑定更新成功！',
              type: 'success',
              duration: 5 * 1000
            })
          })
        }
      })
    },
    submit2() {
      if (this.temp2.npassword1 !== this.temp2.npassword) {
        this.$message({
          message: '新密码不一致！',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }

      this.$refs['dataForm2'].validate((valid) => {
        if (valid) {
          modPwd({ userId: this.temp2.usersId, opassword: this.temp2.opassword, npassword: this.temp2.npassword }).then(() => {
            this.$message({
              message: '密码修改成功！',
              type: 'success',
              duration: 5 * 1000
            })
          })
        }
      })
    }
  }
}
</script>
