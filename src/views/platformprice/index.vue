<template>
  <div class="app-container">
    <div class="filter-container">
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
      <!-- <el-table-column label="platformId" prop="platformId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.platformId|PlatFilter }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="平台名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.platformIdName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="整刷价格" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.price|rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频价格" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.spprice|rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作业价格" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.zyprice|rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试价格" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.ksprice|rounding }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:50px;">
        <el-form-item label="平台名称" prop="platformId">
          <el-select v-model="temp.platformId" class="filter-item" placeholder="请选择平台">
            <el-option v-for="item in selectPlatOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="整刷单价" prop="price">
          <el-input v-model="temp.price" placeholder="请填写整刷单价" />
        </el-form-item>
        <el-form-item label="视频单价" prop="spprice">
          <el-input v-model="temp.spprice" placeholder="请填写视频单价" />
        </el-form-item>
        <el-form-item label="作业单价" prop="zyprice">
          <el-input v-model="temp.zyprice" placeholder="请填写作业单价" />
        </el-form-item>
        <el-form-item label="考试单价" prop="ksprice">
          <el-input v-model="temp.ksprice" placeholder="请填写考试单价" />
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
import { findByWhere, insert, update, deleteData } from '@/api/platformprice'
import { selectPlatform } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import store from '@/store'
export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    PlatFilter(status) {
      // const dd = ''
      // selectPlatform().then(response => {
      //   debugger
      //   // eslint-disable-next-line no-const-assign
      //   dd = response.data
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1 * 500)
      // })
      // const selectName = dd.find(val => val.value === status).label
      // console.log(selectName)
      return status
    },
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    var checkPrice = (rule, value, callback) => {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (!value) {
        return callback(new Error('输入不能为空'))
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
        // else {
        //   if (value < 18) {
        //     callback(new Error('必须年满18岁'))
        //   }

        // }
      }, 1000)
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pagesize: 20,
        sname: undefined
      },
      sdate: '',
      selectVal: '2',
      selectPlatOptions: null,
      showReviewer: false,
      temp: {
        id: undefined,
        price: '',
        spprice: '',
        zyprice: '',
        ksprice: '',
        platformId: '',
        userId: store.getters.userId
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
        price: [{ required: true, validator: checkPrice, trigger: 'blur' }],
        spprice: [{ required: true, validator: checkPrice, trigger: 'blur' }],
        zyprice: [{ required: true, validator: checkPrice, trigger: 'blur' }],
        ksprice: [{ required: true, validator: checkPrice, trigger: 'blur' }],
        platformId: [
          { required: true, message: '请选择平台', trigger: 'change' }
        ]
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
      selectPlatform().then(response => {
        debugger
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
      const tempData = {}
      tempData.id = row.id
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
        price: '',
        spprice: '',
        zyprice: '',
        ksprice: '',
        platformId: '',
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
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
        debugger
        if (valid) {
          insert({ bean: JSON.stringify(this.temp) }).then(response => {
            const selectName = this.selectPlatOptions.find(val => val.value === this.temp.platformId).label
            console.log(selectName)
            this.temp.platformIdName = selectName
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
            const selectName = this.selectPlatOptions.find(val => val.value === this.tempData.platformId).label
            this.temp.platformIdName = selectName
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
