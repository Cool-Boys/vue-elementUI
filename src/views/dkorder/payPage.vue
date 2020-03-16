<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="handlePay(1)">支付宝支付</el-button>
      <el-button type="primary" @click="handlePay(3)">微信支付</el-button>
      <el-button type="primary" @click="handlePay(2)">QQ支付</el-button>
      <el-tag type="warning"> 付款成功后请耐心等待支付结果！！！ </el-tag>
    </div>
    <el-table
      :key="tableKey1"
      v-loading="listLoading"
      :data="orderList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column v-if="showReviewer" label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sdate.replace('+',' ') | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" min-width="150px">
        <template slot-scope="{row}">
          {{ row.orderNo }}
        </template>
      </el-table-column>

      <el-table-column label="金额" min-width="80px">
        <template slot-scope="{row}">
          {{ row.zfje|rounding }}
        </template>
      </el-table-column>
      <el-table-column label="支付状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.zfStatus|zfstatusFilter1| zfstatusFilter">
            {{ row.zfStatus|zfstatusFilter1 }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template>

          <el-button type="primary" size="small" icon="el-icon-edit" @click="dialogDetailFormVisible=true">
            查看详单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" /> -->
    <el-dialog title="支付页面" width="250px" :visible.sync="dialogFormVisible">
      <el-tag type="danger">注意:一定要支付与金额匹配</el-tag><el-tag type="danger">否则订单支付记录不被记录</el-tag>
      <el-row>
        <el-col>
          <el-card :body-style="{ padding: '0px' }">
            <img :src="zfUrl" class="image">
            <div style="padding: 14px;">
              <div style="padding-left:50px"><el-tag type="warning"> 付款金额:{{ payData.price }}</el-tag></div>
              <div class="bottom clearfix">

                <count-down
                  :current-time="payData.serverTime"
                  :start-time="payData.serverTime"
                  :end-time="payData.endTime"
                  :tip-text="'距离开始'"
                  :tip-text-end="'距离结束'"
                  :end-text="'结束自定'"
                  :hour-txt="':'"
                  :minutes-txt="':'"
                  :seconds-txt="''"
                  @start_callback="countDownS_cb(1)"
                  @end_callback="countDownE_cb(1)"
                />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="订单明细" :visible.sync="dialogDetailFormVisible">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column v-if="showReviewer" label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sdate.replace('+',' ') | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平台" min-width="100px">
          <template slot-scope="{row}">
            {{ row.platformIdName }}
          </template>
        </el-table-column>
        <el-table-column label="订单编号" min-width="150px">
          <template slot-scope="{row}">
            {{ row.orderNo }}
          </template>
        </el-table-column>
        <el-table-column label="用户信息" :show-overflow-tooltip="true" width="150px" align="center">
          <template slot-scope="{row}">
            <span style="color:red;">{{ row.school }} {{ row.userAccount }} {{ row.userPwd }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程名称" :show-overflow-tooltip="true" width="80px">
          <template slot-scope="{row}">
            {{ row.course }}
          </template>
        </el-table-column>
        <el-table-column label="课程信息" min-width="200px">
          <template slot-scope="{row}">
            <el-tag v-if=" row.isvedio=='1'" type="success"> {{ row.isvedio=='1'?'视频':'' }}  </el-tag>
            <el-tag v-if=" row.ishomework=='1'" type="info"> {{ row.ishomework=='1'?'作业':'' }}  </el-tag>
            <el-tag v-if=" row.isexam=='1'" type="warning">  {{ row.isexam=='1'?'考试':'' }} </el-tag>
            <el-tag v-if=" row.isms=='1'" type="danger"> {{ row.isms=='1'?'秒刷':'' }} </el-tag>
            <el-tag v-if=" row.isip=='1'">   {{ row.isip=='1'?'专享IP':'' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="金额" min-width="80px">
          <template slot-scope="{row}">
            {{ row.amount|rounding }}
          </template>
        </el-table-column>
        <el-table-column label="状态" class-name="status-col" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.status|statusFilter1| statusFilter">
              {{ row.status|statusFilter1 }}
            </el-tag>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>
  </div>

</template>

<script>

import { mapGetters } from 'vuex'
import { getDetailById } from '@/api/dkOrderDetail'
import { findByWhere } from '@/api/dkOrder'
import waves from '@/directive/waves' // waves directive
import { getPayData, getPayDataStatus } from '@/api/common'
import CountDown from 'vue2-countdown'
import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination'
// import store from '@/store'
// import axios from 'axios'// r, zfOrder
export default {
  components: { CountDown },
  directives: { waves },
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
    statusFilter1(status) {
      const statusMap = {
        '-1': '未成功',
        0: '安排中',
        1: '进行中',
        2: '完成'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        完成: 'success',
        安排中: 'info',
        进行中: 'warning',
        未成功: 'danger'
      }
      return statusMap[status]
    },
    zfstatusFilter1(status) {
      const statusMap = {
        0: '未支付',
        1: '已支付'
      }
      return statusMap[status]
    },
    zfstatusFilter(status) {
      const statusMap = {
        已支付: 'success',
        未支付: 'danger'
      }
      return statusMap[status]
    },
    rounding(value) {
      return value === '' ? '-' : parseFloat(value).toFixed(2)
    }
  },
  data() {
    return {
      tableKey: 0,
      tableKey1: 1,
      list: null,
      orderList: null,
      total: 0,
      listLoading: true,
      orderId: '',
      listQuery: {
        orderId: this.orderId

      },
      zfUrl: '',
      payStatus: 0,
      payData: {
        endTime: '',
        creatTime: '',
        serverTime: ''
      },
      type: '1',
      sdate: '',
      zftimer: '',
      selectPlatOptions: null,
      showReviewer: false,
      dialogFormVisible: false,
      dialogDetailFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      tempRoute: {}
    }
  },
  computed: {
    // eslint-disable-next-line no-undef
    ...mapGetters([
      'name'
    ])
  },
  mounted() {

  }, beforeDestroy() {
    clearInterval(this.zftimer)
  },
  created() {
    const orderId = this.$route.params && this.$route.params.orderId
    this.orderId = orderId
    // console.log(this.$route.query)

    // axios.get('https://api.xiuxiu888.com/creat_order/?id=10041&token=888888&price=1&pay_id=admin&type=1&page=4').then(function(res) {
    //   console.log(res.data)
    // }).catch(function(error) {
    //   console.log(error)
    // })
    this.getOrderList()
    this.getList()
    debugger
    this.tempRoute = Object.assign({}, this.$route)
    // this.setTagsViewTitle()
  },
  methods: {
    setTagsViewTitle() {
      const title = `支付订单`
      const route = Object.assign({}, this.tempRoute, { title: `${title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = `支付订单`
      document.title = `${title}`
    },
    countDownS_cb: function(x) {
      console.log(x)
    },
    countDownE_cb: function(x) {
      this.handlePay(this.type)
    },
    getList() {
      this.listLoading = true

      getDetailById({ orderId: this.orderId }).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    getOrderList() {
      this.listLoading = true
      findByWhere({ id: this.orderId }).then(response => {
        this.orderList = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    handlePay(type) {
      this.type = type
      getPayData({ orderid: this.orderId, type: type }).then(response => {
        const data = response.data
        this.payData = data
        this.zfUrl = data.qrcode
        this.dialogFormVisible = true
        this.zftimer = setInterval(this.handlePayStaues, 1000)
      })
    },
    handlePayStaues() {
      getPayDataStatus({ orderid: this.orderId }).then(response => {
        const data = response.data
        const paystatus = data.status
        console.log(paystatus)
        if (paystatus === 2 || paystatus === 1) {
          this.payStatus = 1
          this.dialogFormVisible = false
          clearInterval(this.zftimer)
          this.getOrderList()
          this.$notify({
            title: '成功',
            message: '支付成功！',
            type: 'success'
          })
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['sdate', 'content', 'status', 'gkqx']
        const filterVal = ['sdate', 'content', 'status', 'gkqx']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'sdate') {
          return v[j] === '' ? '' : parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style lang="scss" scoped>
.notice {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.line{
  text-align: center;
}
  .image {
      padding-top: 20px;
    display: block;
    margin: 0 auto;
  }
 .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
.bottom{
    padding-left: 60px;
}
  .clearfix:after {
      clear: both
  }
  .el-dialog__body{
      padding: 10px 20px;
  }
</style>
