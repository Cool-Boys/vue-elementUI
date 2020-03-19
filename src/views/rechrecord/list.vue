<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.sernum" placeholder="订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
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

      <el-table-column label="交易单号" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.sernum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.amount|rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易日期" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.sdate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易结果" min-width="100px">
        <template slot-scope="{row}">
          <el-tag :type="row.ischeck| checkFilter1" effect="dark">
            {{ row.ischeck|checkFilter }}
          </el-tag>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDataList } from '@/api/rechrecord'
import { selectUsers } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import store from '@/store'
export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    checkFilter(status) {
      const statusMap = {
        1: '成功',
        0: '交易未达成'
      }
      return statusMap[status]
    },

    checkFilter1(status) {
      const statusMap = {
        1: 'success',

        0: 'wraning'
      }
      return statusMap[status]
    },
    rounding(value) {
      return parseFloat(value === '' ? 0 : value).toFixed(2)
    },
    flagFilter1(status) {
      const statusMap = {
        1: '充值',
        2: '转账',
        3: '在线充值'
      }
      return statusMap[status]
    },
    flagFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'danger',
        3: 'wraning'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      formLoading: true,
      listQuery: {
        page: 1,
        pagesize: 20,
        sernum: undefined,
        flag: 3,
        userId: store.getters.userId
      },
      selectOptions: null,
      showReviewer: false,
      am: 0,
      ye: 0,
      temp: {
        id: undefined,
        userId: store.getters.userId,
        touserId: '',
        amount: '',
        flag: '2'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],

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
      getDataList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    initData() {
      selectUsers({ userId: store.getters.userId }).then(response => {
        this.selectOptions = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
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

    resetTemp() {
      this.temp = {
        id: undefined,
        userId: store.getters.userId,
        touserId: '',
        amount: '',
        flag: '2'
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['日期', '用户名称', '金额', '流水交易号', '交易类型']
        const filterVal = ['sdate', 'userIdName', 'amount', 'sernum', 'flag']
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
          return parseTime(v[j])
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
