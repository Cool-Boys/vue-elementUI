<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="课程名称">
          <el-input v-model="listQuery.courseName" clearable placeholder="课程名称" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="课程用户">
          <el-input v-model="listQuery.courseUser" clearable placeholder="课程用户" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="课程平台">
          <el-select v-model="listQuery.platformId" clearable class="filter-item" placeholder="请选择平台">
            <el-option v-for="item in selectPlatOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="sdate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="listQuery.orderStatue" clearable class="filter-item" placeholder="请选择订单状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button type="warning" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>

    </div>

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
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status=='2'" size="mini" type="danger" @click="handleModifyStatus(row,'0')">
            重刷
          </el-button>

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
      <el-table-column label="刷课信息" min-width="180px">
        <template slot-scope="{row}">
          {{ row.resInfo }}
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="userAccount">
          <el-input v-model="temp.userAccount" />
        </el-form-item>
        <el-form-item label="密码" prop="userPwd">
          <el-input v-model="temp.userPwd" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { findByWhere, update, UpdateDetail } from '@/api/dkOrderDetail'
import waves from '@/directive/waves' // waves directive
import { selectPlatform } from '@/api/common'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import store from '@/store'
export default {
  components: { Pagination },
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
    rounding(value) {
      return value === '' ? '-' : parseFloat(value).toFixed(2)
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pagesize: 20,
        sdate: '',
        edate: '',
        platFormId: '',
        courseName: '',
        courseUser: '',
        orderStatue: '',
        userId: store.getters.userId
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      sdate: '',
      statusOptions: [{ value: '-1', label: '未成功' }, { value: '0', label: '安排中' }, { value: '1', label: '进行中' }, { value: '2', label: '完成' }],
      selectPlatOptions: null,
      showReviewer: false,
      temp: {
        id: undefined,
        userAccount: '',
        userPwd: '',
        userId: store.getters.userId
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑信息'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        userPwd: [{ required: true, message: '密码必填', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    // eslint-disable-next-line no-undef
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getList()
    this.initData()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log(this.sdate)
      if (this.sdate) {
        this.listQuery.sdate = parseTime(this.sdate[0], '{y}-{m}-{d}')
        this.listQuery.edate = parseTime(this.sdate[1], '{y}-{m}-{d}')
      }

      findByWhere(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    resetForm() {
      this.listQuery = {
        page: 1,
        pagesize: 20,
        sdate: '',
        edate: '',
        platFormId: '',
        courseName: '',
        courseUser: '',
        orderStatue: '',
        userId: store.getters.userId
      }
      this.list = null
      this.total = 0
    },
    initData() {
      selectPlatform().then(response => {
        this.selectPlatOptions = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      // this.$message({
      //   message: '操作成功！',
      //   type: 'success'
      // })

      row.status = status
      const tempData = {}
      tempData.id = row.id
      tempData.status = status
      update({ bean: JSON.stringify(tempData) }).then(() => {
        row.status = status
        this.$notify({
          title: '温馨提示',
          message: '更新成功！',
          type: 'success',
          duration: 2000
        })
      })
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
    resetTemp() {
      this.temp = {
        id: undefined,
        userAccount: '',
        userPwd: '',
        userId: store.getters.userId
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      //  this.temp.sdate = parseTime(this.temp.sdate)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          const tempData = {}
          tempData.id = this.temp.id
          tempData.orderId = this.temp.orderId
          tempData.school = this.temp.school
          tempData.userAccount = this.temp.userAccount
          tempData.userPwd = this.temp.userPwd

          UpdateDetail({ bean: JSON.stringify(tempData) }).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '温馨提示',
              message: '更新成功！',
              type: 'success',
              duration: 2000
            })
            this.handleFilter()
          })
        }
      })
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
</style>
