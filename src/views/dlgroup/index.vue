<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.sname" placeholder="分组名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
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

      <el-table-column label="分组名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.sname }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="userId" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status|statusFilter1| statusFilter">
            {{ row.status|statusFilter1 }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='2'" size="mini" @click="handleModifyStatus(row,'2')">
            禁用
          </el-button>
          <el-button v-if="row.status!='1'" size="mini" type="success" @click="handleModifyStatus(row,'1')">
            使用
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="分组名称" prop="sname">
          <el-input v-model="temp.sname" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { findByWhere, insert, update, deleteData } from '@/api/dlgroup'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import store from '@/store'
export default {
  components: { Pagination },
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
        userId: store.getters.userId,
        sname: undefined
      },
      sdate: '',
      statusOptions: [{ value: '1', label: '使用' }, { value: '0', label: '待定' }, { value: '2', label: '禁用' }],
      showReviewer: false,
      temp: {
        id: undefined,
        sname: '',
        userId: store.getters.userId,
        status: '1'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
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
    // eslint-disable-next-line no-undef
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
      findByWhere(this.listQuery).then(response => {
        debugger
        this.list = response.data.list
        this.total = response.data.total

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
    handleModifyStatus(row, status) {
      const tempData = {}
      tempData.id = row.id
      tempData.status = status
      update({ bean: JSON.stringify(tempData) }).then(() => {
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
        row.status = status
      })
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
        sname: '',
        status: '1',
        userId: store.getters.userId
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
        //  this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
        // this.temp.author = 'vue-element-admin'
          // debugger
          // this.temp.sdate = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
          debugger
          this.temp.userId = store.getters.userId
          console.log(this.temp)
          insert({ bean: JSON.stringify(this.temp) }).then(response => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '温馨提示',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
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
          const tempData = Object.assign({}, this.temp)
          update({ bean: JSON.stringify(tempData) }).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '温馨提示',
              message: '更新成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteData({ id: row.id }).then(response => {
        const data = response.data.data
        console.log(data)
        this.$notify({
          title: '温馨提示',
          message: '删除成功！',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
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
