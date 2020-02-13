<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column v-if="showReviewer" label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdate==''?'':row.createdate.replace('+',' ') | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.sname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.bdel|statusFilter1| statusFilter">
            {{ row.bdel|statusFilter1 }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRoles } from '@/api/role'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
export default {
  directives: { waves },
  filters: {
    statusFilter1(status) {
      const statusMap = {
        1: '使用',
        0: '待定',
        2: '禁用'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        使用: 'success',
        暂定: 'info',
        禁用: 'danger'
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
      listQuery: {
        page: 1,
        pagesize: 20,
        sdate: undefined,
        content: undefined
      },
      sdate: '',
      statusOptions: [{ value: '1', label: '使用' }, { value: '0', label: '待定' }, { value: '2', label: '禁用' }],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        content: [{ required: true, message: '内容必填', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRoles().then(response => {
        debugger
        this.list = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'sdate') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style>

</style>
