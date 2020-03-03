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
      <el-table-column label="角色名称" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.roleIdName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="整刷价格" min-width="80px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.price|rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频及作业" min-width="80px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.spprice|rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试单价" min-width="80px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.ksprice|rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="独享IP" min-width="80px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.ipprice|rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="极速秒刷" min-width="80px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.msprice|rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="限时视频" min-width="80px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.xsprice|rounding }}</span>
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

    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @dragDialog="handleDrag">
      <el-tag type="warning" style="margin-bottom:10px;margin-left:50px">一级代理再给二级代理单价时不能低于平台单价</el-tag>

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:50px;">
        <el-form-item label="平台名称" prop="platformId">
          <el-select v-model="temp.platformId" class="filter-item" placeholder="请选择平台" @change="selectChange">
            <el-option v-for="item in selectPlatOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="代理级别" prop="roleId">
          <el-select v-model="temp.roleId" clearable class="filter-item" placeholder="请选择代理级别">
            <el-option v-for="item in selectRoleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.platformId>2" label="整刷单价" prop="price">
          <el-input v-model="temp.price" placeholder="请填写整刷单价" />
        </el-form-item>
        <el-form-item label="视频作业" prop="spprice">
          <el-input
            v-if="temp.platformId!=2"
            v-model="temp.spprice"
            placeholder="请填写视频作业单价"
          />
          <el-input
            v-if="temp.platformId==2"
            v-model="temp.spprice"
            placeholder="请填写视频作业讨论见面课单价"
          />
        </el-form-item>

        <!-- <el-form-item label="作业单价" prop="zyprice">
          <el-input v-model="temp.zyprice" placeholder="请填写作业单价" />
        </el-form-item> -->
        <el-form-item label="考试单价" prop="ksprice">
          <el-input v-model="temp.ksprice" placeholder="请填写考试单价" />
        </el-form-item>
        <el-form-item label="专享IP" prop="ipprice">
          <el-input v-model="temp.ipprice" placeholder="请填写专享IP单价" />
        </el-form-item>
        <el-form-item label="极速秒刷" prop="msprice">
          <el-input v-model="temp.msprice" placeholder="请填写秒刷单价" />
        </el-form-item>
        <el-form-item label="限时视频" prop="xsprice">
          <el-input v-model="temp.xsprice" placeholder="请填写限时视频单价" />
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
import { findByWhere, insert, update, deleteData, getPrice } from '@/api/platformprice'
import elDragDialog from '@/directive/el-drag-dialog'
import { selectRole, selectPlatform } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import store from '@/store'
export default {
  components: { Pagination },
  directives: { waves, elDragDialog },
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
      return value === '' ? '-' : parseFloat(value).toFixed(2)
    }
  },
  data() {
    var checkspPrice = (rule, value, callback) => {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (!value) {
        return callback(new Error('输入不能为空'))
      }
      const { spprice } = this.sysPrice.find(val => val.platformId === this.temp.platformId)
      if (spprice > value) {
        this.temp.spprice = spprice
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }, 300)
    }
    var checkzyPrice = (rule, value, callback) => {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (!value) {
        return callback(new Error('输入不能为空'))
      }
      const { zyprice } = this.sysPrice.find(val => val.platformId === this.temp.platformId)
      if (zyprice > value) {
        this.temp.zyprice = zyprice
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }, 300)
    }
    var checkksPrice = (rule, value, callback) => {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (!value) {
        return callback(new Error('输入不能为空'))
      }
      const { ksprice } = this.sysPrice.find(val => val.platformId === this.temp.platformId)
      if (ksprice > value) {
        this.temp.ksprice = ksprice
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }, 300)
    }
    var checkipPrice = (rule, value, callback) => {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (!value) {
        return callback(new Error('输入不能为空'))
      }
      const { ipprice } = this.sysPrice.find(val => val.platformId === this.temp.platformId)
      if (ipprice > value) {
        this.temp.ipprice = ipprice
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }, 300)
    }
    var checkmsPrice = (rule, value, callback) => {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (!value) {
        return callback(new Error('输入不能为空'))
      }
      const { msprice } = this.sysPrice.find(val => val.platformId === this.temp.platformId)
      if (msprice > value) {
        this.temp.msprice = msprice
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }, 300)
    }
    var checkxsPrice = (rule, value, callback) => {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (!value) {
        return callback(new Error('输入不能为空'))
      }
      const { xsprice } = this.sysPrice.find(val => val.platformId === this.temp.platformId)
      if (xsprice > value) {
        this.temp.xsprice = xsprice
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }, 300)
    }
    var checkPrice2 = (rule, value, callback) => {
      const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
      if (value) {
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
        }, 300)
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pagesize: 20,
        sname: undefined,
        userId: store.getters.userId
      },
      sdate: '',
      selectVal: '2',
      selectRoleOptions: null,
      selectPlatOptions: null,
      sysPrice: null,
      showReviewer: false,
      temp: {
        id: undefined,
        roleId: '',
        price: '',
        spprice: '',
        zyprice: '',
        ksprice: '',
        ipprice: '',
        msprice: '',
        xsprice: '',
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
        price: [{ validator: checkPrice2, trigger: 'blur' }],

        spprice: [{ required: true, validator: checkspPrice, trigger: 'blur' }],
        zyprice: [{ required: true, validator: checkzyPrice, trigger: 'blur' }],
        ksprice: [{ required: true, validator: checkksPrice, trigger: 'blur' }],
        ipprice: [{ required: true, validator: checkipPrice, trigger: 'blur' }],
        msprice: [{ required: true, validator: checkmsPrice, trigger: 'blur' }],
        xsprice: [{ required: true, validator: checkxsPrice, trigger: 'blur' }],
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
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
    },
    getList() {
      this.listLoading = true
      findByWhere(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        console.log(this.list)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    initData() {
      selectRole().then(response => {
        this.selectRoleOptions = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
      selectPlatform().then(response => {
        this.selectPlatOptions = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
      getPrice().then(
        response => {
          this.sysPrice = response.data
          console.log(this.sysPrice)
        }
      )
    },
    handleFilter() {
      this.listQuery.page = 1
      console.log(this.listQuery)
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
        roleId: '',
        price: '',
        spprice: '',
        zyprice: '',
        ksprice: '',
        ipprice: '',
        msprice: '',
        xsprice: '',
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
      this.$refs['dataForm'].validate((valid) => {
        debugger
        if (valid) {
          insert({ bean: JSON.stringify(this.temp) }).then(response => {
            // const selectName = this.selectPlatOptions.find(val => val.value === this.temp.platformId).label
            // console.log(selectName)
            // this.temp.platformIdName = selectName
            // this.list.unshift(this.temp)
            this.handleFilter()

            this.$notify({
              title: '温馨提示',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
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
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // const selectName = this.selectPlatOptions.find(val => val.value === this.temp.platformId).label
            // this.temp.platformIdName = selectName
            // this.list.splice(index, 1, this.temp)
            this.handleFilter()

            this.$notify({
              title: '温馨提示',
              message: '更新成功！',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
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
    },
    selectChange(event) {
      console.log(event)
      if (this.sysPrice && store.getters.roleId !== 1) {
        const tempData = this.sysPrice.find(val => val.platformId === event)
        this.temp.price = tempData.price
        this.temp.spprice = tempData.spprice
        this.temp.zyprice = tempData.zyprice
        this.temp.ksprice = tempData.ksprice
        this.temp.msprice = tempData.msprice
        this.temp.ipprice = tempData.ipprice
        this.temp.xsprice = tempData.xsprice
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
