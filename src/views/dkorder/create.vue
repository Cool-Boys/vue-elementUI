<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="不要急,玩命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-tag effect="dark" type="info"> 平台价格：视频单价:{{ sysPrice.spprice|rounding }},作业单价:{{ sysPrice.zyprice|rounding }},考试单价:{{ sysPrice.ksprice|rounding }},秒刷单价:{{ sysPrice.msprice|rounding }},专属IP:{{ sysPrice.ipprice|rounding }}</el-tag>
    <el-row :gutter="20" style="margin-top:5px;">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>填写账号信息</span>
            <el-button round style="float: right;" @click="handleUsers">验证账号并获取课程信息</el-button>
          </div>
          <div class="component-item">
            <el-input
              v-model="userInfos"
              type="textarea"
              :autosize="{ minRows: 10, maxRows:10}"
              placeholder="请输入内容"
            />
          </div>
          <el-tag style="margin:2px;" type="danger">注意：下单格式为账号+空格+密码</el-tag><el-tag style="margin:2px; " type="danger">批量下单目前开放个数为10个账号；</el-tag>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>看课设置</span>
          </div>
          <div class="component-item">
            <el-checkbox v-model="ipChecked">专享IP</el-checkbox>
          </div>
        </el-card>

        <el-card class="box-card" style="margin-top:15px">
          <div slot="header" class="clearfix">
            <span>有什么要嘱咐的</span>
          </div>
          <div class="component-item">
            <el-input
              v-model="orderMemo"
              type="textarea"
              :rows="2"
              placeholder="请输入要嘱咐"
            />
          </div>
        </el-card>
      </el-col>

    </el-row>
    <el-row :gutter="20" style="margin-top:5px;">

      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>课程信息</span>
            <el-button type="success" icon="el-icon-s-promotion" style="float: right;" @click="handleCourseInfo">选择完毕，提交订单</el-button>
          </div>
          <div class="component-item">
            <course-table :data-list="resDataList" />
          </div>

        </el-card>
      </el-col>

    </el-row>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <!-- :before-close="handleClose" -->
      <el-row
        :gutter="20"
        style="margin-top:5px;"
      >
        <el-tag>专属IP:{{ ipChecked?'选择':'未选择' }}</el-tag>

        <el-tag>{{ orderMemo==''?'没啥嘱咐的':orderMemo }}</el-tag>

      </el-row>
      <el-row
        :gutter="20"
        style="margin-top:5px;"
      >
        <el-table :data="checkDataList">
          <el-table-column :show-overflow-tooltip="true" property="info" label="账号信息" width="150" />
          <el-table-column property="courseName" :show-overflow-tooltip="true" label="课程名称" width="200" />
          <el-table-column label="选项">
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.selOpt" :key="item" :type="item|optionFilter" effect="dark">{{ item }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row
        :gutter="20"
        style="margin-top:5px;"
      >
        <el-tag effect="dark" type="danger">结算金额:{{ amount|rounding }}</el-tag>
      </el-row>    <el-row
        :gutter="20"
        style="margin-top:5px;"
      >
        <el-tag effect="dark" type="info">{{ sysPrice.platformIdName }}平台价格：视频单价:{{ sysPrice.spprice }},作业单价:{{ sysPrice.zyprice }},考试单价:{{ sysPrice.ksprice }},秒刷单价:{{ sysPrice.msprice }},专属IP:{{ sysPrice.ipprice|rounding }}</el-tag>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">在看看</el-button>
        <el-button type="primary" @click="handleSaveOrder">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getPricebyId } from '@/api/platformprice'
import { getCourseInfo, saveOrder } from '@/api/dkOrder'
import CourseTable from './components/CourseTable'
import store from '@/store'
import { Message } from 'element-ui'
export default {
  name: 'CreateOrder',
  components: {
    CourseTable
  },
  filters: {
    optionFilter(status) {
      const statusMap = {
        视频: 'success',
        考试: 'warning',
        作业: '',
        秒刷: 'danger'
      }
      return statusMap[status]
    },
    rounding(value) {
      return value === '' ? '-' : '￥' + parseFloat(value).toFixed(2)
    }
  },
  data() {
    return {
      loading: false,
      sysPrice: null,
      id: null,
      ipChecked: false,
      orderMemo: '',
      resDataList: null,
      checkDataList: [],
      order: {},
      orderDetail: [],
      amount: 0,
      userInfos: null,
      dialogVisible: false
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.id = id
    this.fetchData(id)

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
    // set tagsview title
  },
  methods: {
    fetchData(id) {
      getPricebyId({ id: id }).then(
        response => {
          this.sysPrice = response.data
          this.setTagsViewTitle()

          // set page title
          this.setPageTitle()
        }
      )
    },
    setTagsViewTitle() {
      const title = `${this.sysPrice.platformIdName}订单`
      const route = Object.assign({}, this.tempRoute, { title: `${title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = `${this.sysPrice.platformIdName}订单`
      document.title = `${title}`
    },
    handleUsers() {
      this.loading = true
      console.log(this.userInfos.split('\n').length)
      if (this.userInfos.split('\n').length > 10) {
        this.$message.error('不要超过10个账号好吗？')
      } else {
        getCourseInfo({ accounts: this.userInfos }).then(response => {
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index]
            element['selOpt'] = []
            element['checkAll'] = false
            element['isIndeterminate'] = true
          }
          this.resDataList = response.data
          this.loading = false
          this.$message.success('查询成功！')
        })
      }
    },
    handleCourseInfo() {
      console.log(this.resDataList)
      this.checkDataList = []
      this.amount = 0
      this.resDataList.forEach(element => {
        if (element.selOpt.length > 0) {
          this.checkDataList.push(element)
          element.selOpt.forEach(item => {
            if (item === '视频') {
              this.amount += this.sysPrice.spprice
            } else if (item === '作业') {
              this.amount += this.sysPrice.zyprice
            } else if (item === '考试') {
              this.amount += this.sysPrice.ksprice
            } else if (item === '秒刷') {
              this.amount += this.sysPrice.msprice
            }
          })
        }
      })
      if (this.checkDataList.length <= 0) {
        this.$message.error('请选择课程信息！')
      } else {
        this.amount += this.ipChecked ? this.sysPrice.ipprice : 0
        this.dialogVisible = true
      }
    },
    handleSaveOrder() {
      this.order = {}
      this.orderDetail = []
      this.order['userId'] = store.getters.userId
      this.order['platformId'] = this.sysPrice.platformId
      this.order['content'] = this.orderMemo
      this.checkDataList.forEach(element => {
        const temp = {}
        const arr = element.info.split(' ')
        temp['school'] = arr[0]
        temp['userAccount'] = arr[1]
        temp['userPwd'] = arr[2]
        temp['course'] = element.courseName
        temp['isip'] = this.ipChecked ? '1' : '0'
        temp['isvedio'] = '0'
        temp['ishomework'] = '0'
        temp['isexam'] = '0'
        temp['isms'] = '0'
        element.selOpt.forEach(item => {
          if (item === '视频') {
            temp['isvedio'] = '1'
          } else if (item === '作业') {
            temp['ishomework'] = '1'
          } else if (item === '考试') {
            temp['isexam'] = '1'
          } else if (item === '秒刷') {
            temp['isms'] = '1'
          }
        })
        this.orderDetail.push(temp)
      })
      console.log(this.order)
      console.log(this.orderDetail)
      this.loading = true
      saveOrder({ order: JSON.stringify(this.order), orderDetail: JSON.stringify(this.orderDetail) }).then(response => {
        this.loading = false
        if (response.data === 1) {
          this.dialogVisible = false
        }
      }).catch(function(error) {
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
        this.loading = false
        // 处理 getJSON 和 前一个回调函数运行时发生的错误
        console.log('发生错误！', error)
      })
    }

  }
}
</script>

<style>

</style>
