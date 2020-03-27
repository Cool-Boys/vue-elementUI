<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        刷新
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

      :height="scrollerHeight"
      @sort-change="sortChange"
    >
      <el-table-column v-if="showReviewer" label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <router-link v-if="scope.row.status==1" :to="'/dkorder/create/'+scope.row.id+'/'+scope.row.platformId">
            <el-button type="primary" size="small" icon="el-icon-edit">
              立即下单
            </el-button>

          </router-link>
          <el-button v-else type="primary" size="small" icon="el-icon-edit" disabled>
            立即下单
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="平台名称" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.platformIdName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台状态" min-width="50px">
        <template slot-scope="{row}">
          <el-tag :type="row.status|statusFilter1| statusFilter">
            {{ row.status|statusFilter1 }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="平台公告" min-width="200px">
        <template slot-scope="{row}">
          <span>{{ row.memo }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listQuery.roleId==1" label="代理等级" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.roleIdName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格说明" min-width="400px">
        <template slot-scope="{row}">
          <span>整刷价格:{{ row.price|rounding }},视频及作业:{{ row.spprice|rounding }},考试单价:{{ row.ksprice|rounding }},独享IP:{{ row.ipprice|rounding }},极速秒刷:{{ row.msprice|rounding }},限时视频:{{ row.xsprice|rounding }}</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryData } from '@/api/platformprice'
import elDragDialog from '@/directive/el-drag-dialog'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import store from '@/store'
export default {
  components: { Pagination },
  directives: { waves, elDragDialog },
  filters: {

    statusFilter1(status) {
      console.log(status)
      const statusMap = {
        1: '可下单',
        0: '维护中'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        可下单: 'success',
        维护中: 'danger'
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
        roleId: store.getters.roleId
      },
      roleId: store.getters.roleId,
      sdate: '',
      selectVal: '2',
      scrollerHeight: '400px',
      selectRoleOptions: null,
      selectPlatOptions: null,
      sysPrice: null,
      showReviewer: false,
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
    this.hh()
  },
  methods: {
    hh() {
      this.scrollerHeight = window.innerHeight - 270 + 'px'
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
    },
    getList() {
      this.listLoading = true
      queryData(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    initData() {
    },
    handleFilter() {
      this.listQuery.page = 1
      console.log(this.listQuery)
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
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
    },
    numberChange(val) {
      console.log(store.getters.roleId)
      if (store.getters.roleId !== 1) {
        const integer = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g // 输入整数(包括0)的正则，解决不能输入负号问题
        if (integer.test(val)) {
          const { spprice } = this.sysPrice.find(val => val.platformId === this.temp.platformId)
          if (spprice > val) {
            this.temp.spprice = spprice
          }
        }
      }
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
