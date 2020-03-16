<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="handleFilter()">刷新</el-button>
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
      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="{row}">
          <router-link v-if="row.zfStatus==0" :to="'/dkorder/payPage/'+row.id">
            <el-button type="success" size="small">
              去支付
            </el-button>
          </router-link>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="getList(row.id)">
            查看详单
          </el-button>
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

    </el-table>
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
import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination'
// import store from '@/store'
// import axios from 'axios'// r, zfOrder
export default {

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
        page: 1,
        pagesize: 20,
        zfStatus: '0'
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
    // console.log(this.$route.query)

    // axios.get('https://api.xiuxiu888.com/creat_order/?id=10041&token=888888&price=1&pay_id=admin&type=1&page=4').then(function(res) {
    //   console.log(res.data)
    // }).catch(function(error) {
    //   console.log(error)
    // })
    this.getOrderList()
    // this.getList()
  },
  methods: {

    getList(id) {
      this.listLoading = true
      this.dialogDetailFormVisible = true
      getDetailById({ orderId: id }).then(response => {
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
      findByWhere(this.listQuery).then(response => {
        this.orderList = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getOrderList()
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
