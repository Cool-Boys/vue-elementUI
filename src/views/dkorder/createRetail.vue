<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="不要急,玩命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-tag v-if="spprice!==null" effect="dark" type="info"> 平台价格：视频单价:{{ sysPrice.spprice|rounding }},考试单价:{{ sysPrice.ksprice|rounding }},秒刷单价:{{ sysPrice.msprice|rounding }},专属IP:{{ sysPrice.ipprice|rounding }}</el-tag>
    <el-row :gutter="8" style="margin-top:5px;">
      <el-col :span="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>看课设置</span>
          </div>
          <div class="component-item" style="margin-top: 14px;margin-bottom: 14px;">
            <el-checkbox v-model="ipChecked">专享IP</el-checkbox>

            <!-- <el-button type="primary" @click="openUrl">确 定</el-button> -->

          </div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card class="box-card">
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
        <el-tag effect="dark" type="info">{{ sysPrice.platformIdName }}平台价格：视频单价:{{ sysPrice.spprice }},考试单价:{{ sysPrice.ksprice }},秒刷单价:{{ sysPrice.msprice }},专属IP:{{ sysPrice.ipprice|rounding }}</el-tag>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">在看看</el-button>
        <el-button type="primary" @click="handleSaveOrder">确 定</el-button>

      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getPriceRetail } from '@/api/platformprice'
import { getCourseInfoByUserId, saveOrder } from '@/api/dkOrder'
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
      return value === '' ? '-' : '' + parseFloat(value).toFixed(2)
    }
  },
  data() {
    return {
      loading: false,
      sysPrice: null,
      id: null,
      ipChecked: false,
      userid: store.getters.userId,
      orderMemo: '',
      resDataList: null,
      checkDataList: [],
      order: {},
      orderDetail: [],
      amount: 0,
      zfData: {
        id: 438405,
        type: 1,
        price: this.amount,
        pay_id: this.userid,
        sign: 'ZRte77jYwGG03DXSzq2ZDaBPDBYeb0Bh'
      },
      zfurl: '',
      wxzfurl: '',
      userInfos: null,
      dialogVisible: false
    }
  },
  created() {
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
    // set tagsview title
    this.fetchData()
    this.handleUsers()
  },
  // mounted() {
  //   this.fetchData()
  // },
  methods: {
    fetchData() {
      getPriceRetail({ userId: store.getters.userId }).then(
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
      if (!this.resDataList) {
        getCourseInfoByUserId({ userId: store.getters.userId }).then(response => {
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
      this.checkDataList = []
      this.amount = 0
      this.resDataList.forEach(element => {
        if (element.selOpt.length > 0) {
          this.checkDataList.push(element)
          element.selOpt.forEach(item => {
            if (item === '视频') {
              this.amount += this.sysPrice.spprice
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

        // zfOrder(this.zfData).then(response => {
        //   console.log(response.data)
        // })
        // axios.get('http://api2.xiuxiu888.com/creat_order', this.zfData).then(function(res) {
        //   console.log(res.data)
        // }).catch(function(error) {
        //   console.log(error)
        // })
      }
    },
    callback(data) {
      console.log(data)
    },
    openUrl() {
      this.$router.push({ name: 'orderpayPage', params: { orderId: 10 }})
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
        if (response.data > 0) {
          this.dialogVisible = false
          this.$router.push({ name: 'orderpayPage', params: { orderId: response.data }})
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
