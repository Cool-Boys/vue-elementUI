<template>
  <div class="app-container">
    <!-- @selection-change="handleSelectionChange" -->
    <div class="filter-container">

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-circle-plus" @click="handleSelect">
        全选
      </el-button>

      <el-button v-waves class="filter-item" type="danger" icon="el-icon-remove" @click="handleCancelSelect">
        取消全选
      </el-button>
    </div>
    <el-table :data="dataList" border style="width: 100%;padding-top: 15px;">
      <!-- <el-table-column
        type="selection"
        width="55"
      /> -->
      <el-table-column :show-overflow-tooltip="true" label="课程信息" width="195" align="center">
        <template slot-scope="scope">
          {{ scope.row.info }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="学期" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.xqname }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="课程名" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.courseName }}
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" label="查询结果" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.msg }}
        </template>
      </el-table-column>
      <el-table-column label="选项" width="500" align="center">
        <template slot-scope="{row,$index}">
          <!-- <el-checkbox v-for="item in selOptions" :key="item" v-model="row.selOpt" :label="item" @change="handleCheckedChange(row,$index)">{{ item }}</el-checkbox> -->
          <el-checkbox v-model="row.checkAll" :indeterminate="row.isIndeterminate" @change="handleCheckAllChange(row,$index)">全选</el-checkbox>

          <el-checkbox-group v-model="row.selOpt" @change="handleCheckedChange(row,$index)">
            <el-checkbox v-for="item in selOptions" :key="item" :label="item">{{ item }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const selectOptions = ['视频', '作业', '考试', '秒刷']
import waves from '@/directive/waves' // waves directive
export default {
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  props: {
    inputName: {
      type: Array,
      default: null
    },
    dataList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      multipleSelection: [],
      checkedSel: [],

      selOptions: selectOptions,

      list: [{ msg: '', data: '获取信息失败！', info: '山东大学 15022589890 sp15022589890' }]
    }
  },
  created() {
    this.dataList = []
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    handleCheckedChange(row, $index) {
      let checkedCount = row.selOpt.length
      row.selOpt.forEach(element => {
        if (element === '秒刷') {
          checkedCount--
        }
      })
      row.checkAll = checkedCount === 3
      row.isIndeterminate = checkedCount > 0 && checkedCount < 3
    },
    handleCheckAllChange(row, $index) {
      let checkedCount = row.selOpt.length
      row.selOpt.forEach(element => {
        if (element === '秒刷') {
          checkedCount--
        }
      })
      if (checkedCount === 3) {
        row.selOpt = []
        row.isIndeterminate = true
        row.checkAll = false
      }
      if (checkedCount === 0) {
        row.selOpt = ['视频', '作业', '考试']
        row.isIndeterminate = false
        row.checkAll = true
      }
    },
    handleSelect() {
      this.dataList.forEach(element => {
        element.selOpt = ['视频', '作业', '考试']
        element.isIndeterminate = false
        element.checkAll = true
      })
    },
    handleCancelSelect() {
      this.dataList.forEach(element => {
        element.selOpt = []
        element.isIndeterminate = true
        element.checkAll = false
      })
    }

  }
}
</script>
