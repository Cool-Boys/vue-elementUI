<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.sname" placeholder="用户名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>

    </div>
    <el-scrollbar style="height:10%">
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
        <el-table-column
          type="index"
          :index="1"
        />
        <el-table-column v-if="showReviewer" label="ID" prop="usersId" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.usersId }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="groupId" prop="groupId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.groupId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="roleId" prop="roleId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.roleId }}</span>
        </template>
      </el-table-column> -->
        <el-table-column label="用户名称" min-width="130px">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.sname }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="showReviewer" label="密码" width="100">
          <template slot-scope="{row}">
            <span>{{ row.password }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额" width="100">
          <template slot-scope="{row}">
            <span>{{ row.amount|rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column label="代理级别" width="100">
          <template slot-scope="{row}">
            <span>{{ row.roleIdName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="代理分组" width="100">
          <template slot-scope="{row}">
            <span>{{ row.groupIdName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="QQ号" width="100">
          <template slot-scope="{row}">
            <span>{{ row.qq }}</span>
          </template>
        </el-table-column>
        <el-table-column label="微信号" width="120">
          <template slot-scope="{row}">
            <span>{{ row.wx }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="120">
          <template slot-scope="{row}">
            <span>{{ row.phonum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="100">
          <template slot-scope="{row}">
            <span>{{ row.memo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" class-name="status-col" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.bdel|statusFilter1| statusFilter">
              {{ row.bdel|statusFilter1 }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" align="center" width="250" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button v-if="row.bdel!='2'" size="mini" @click="handleModifyStatus(row,'2')">
              禁用
            </el-button>
            <el-button v-if="row.bdel!='1'" size="mini" type="success" @click="handleModifyStatus(row,'1')">
              使用
            </el-button>
            <el-button v-if="row.bdel!='0'" size="mini" type="danger" @click="handleModifyStatus(row,'0')">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />
    </el-scrollbar>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-position="right" label-width="120px">
        <el-form-item label="用户名称" prop="sname">
          <el-input v-model="temp.sname" placeholder="请输入用户名称" />
        </el-form-item>
        <!-- <el-form-item label="余额" prop="amount">
          <el-input v-model="temp.amount" placeholder="请输入用户余额" />
        </el-form-item> -->
        <el-form-item label="代理级别" prop="roleId">
          <el-select v-model="temp.roleId" class="filter-item" placeholder="请选择代理级别">
            <el-option v-for="item in selectRoleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="代理分组" prop="groupId">
          <el-select v-model="temp.groupId" class="filter-item" placeholder="请选择代理分组">
            <el-option v-for="item in selectDlGroupOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="QQ号" prop="qq">
          <el-input v-model="temp.qq" placeholder="请输入QQ号" />
        </el-form-item>
        <el-form-item label="微信号" prop="wx">
          <el-input v-model="temp.wx" placeholder="请输入微信号" />
        </el-form-item>
        <el-form-item label="手机号" prop="phonum">
          <el-input v-model="temp.phonum" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邀请码" prop="incode">
          <el-input v-model="temp.incode" placeholder="请填入邀请码" />
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="temp.memo" placeholder="请输入备注" />
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
// import { mapGetters } from 'vuex'
import { findByWhere, insert, update, deleteData } from '@/api/user'
import { selectRole, selectDlGroup } from '@/api/common'
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
        0: '删除',
        2: '禁用'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        使用: 'success',
        删除: 'info',
        禁用: 'danger'
      }
      return statusMap[status]
    },
    rounding(value) {
      return parseFloat(value === '' ? 0 : value).toFixed(2)
    }
  },
  data() {
    var checkPrice = (rule, value, callback) => {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (!value && value !== 0) {
        return callback(new Error('输入不能为空'))
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入数字'))
        } else {
          if (value < 0) {
            callback(new Error('必须大于0'))
          } else {
            callback()
          }
        }
      }, 500)
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pagesize: 10,
        sname: undefined,
        userId: store.getters.userId
      },
      sdate: '',
      selectRoleOptions: null,
      selectDlGroupOptions: null,
      showReviewer: false,
      roleId: store.getters.roleId,
      userId: store.getters.userId,
      temp: {
        usersId: undefined,
        sname: '',
        amount: 0,
        roleId: '',
        memo: '',
        bdel: '1',
        pid: store.getters.userId,
        groupId: '',
        qq: '',
        wx: '',
        phonum: '',
        incode: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      scrollerHeight: '400px',
      dialogPvVisible: false,
      pvData: [],
      rules: {
        amount: [{ validator: checkPrice, trigger: 'blur' }],
        sname: [{ required: true, message: '用户名称必填', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择代理级别', trigger: 'change' }],
        groupId: [{ required: true, message: '请选择代理分组', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  computed() {
    // eslint-disable-next-line no-undef
    // ...mapGetters([
    //   'name'
    // ])
    this.hh()
  },
  created() {
    this.getList()
    this.initData()
  },

  methods: {
    hh() {
      this.scrollerHeight = window.innerHeight - 270 + 'px'
    },
    getList() {
      this.listLoading = true
      findByWhere(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    initData() {
      selectRole({ roleId: this.roleId }).then(response => {
        this.selectRoleOptions = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
      selectDlGroup({ userId: this.userId }).then(response => {
        this.selectDlGroupOptions = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, bdel) {
      const tempData = {}
      tempData.usersId = row.usersId
      tempData.bdel = bdel
      update({ bean: JSON.stringify(tempData) }).then(() => {
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
        row.bdel = bdel
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
        usersId: undefined,
        sname: '',
        amount: 0,
        roleId: '',
        memo: '',
        bdel: '1',
        groupId: '',
        pid: store.getters.userId,
        qq: '',
        wx: '',
        phonum: '',
        incode: ''
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
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insert({ bean: JSON.stringify(this.temp) }).then(response => {
            const selectRName = this.selectRoleOptions.find(val => val.value === this.temp.roleId).label
            const selectGName = this.selectDlGroupOptions.find(val => val.value === this.temp.groupId).label
            console.log(selectRName)
            this.temp.roleIdName = selectRName
            this.temp.groupIdName = selectGName
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
            const index = this.list.findIndex(v => v.usersId === this.temp.usersId)
            const selectRName = this.selectRoleOptions.find(val => val.value === this.temp.roleId).label
            const selectGName = this.selectDlGroupOptions.find(val => val.value === this.temp.groupId).label
            console.log(selectRName)
            console.log(selectGName)
            this.temp.roleIdName = selectRName
            this.temp.groupIdName = selectGName
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

<style scoped>

.el-input--medium .el-input__inner{
width: 170px;
}

.el-table--scrollable-y
  .el-table__body-wrapper::-webkit-scrollbar {
    width: 4px;
  }
   .gutter {
    width: 4px !important;
  }

.el-table--scrollable-y
   .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #d8d8d8ff;
    border-radius: 7px;
     /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
  }

/*定义滚动条的轨道颜色、内阴影及圆角*/
.el-table--scrollable-y
   .el-table__body-wrapper::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #fff;
    border-radius: 3px;
  }

</style>
