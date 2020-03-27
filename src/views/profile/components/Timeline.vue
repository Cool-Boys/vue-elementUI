<template>
  <div class="block">
    <el-timeline v-loading="listLoading">
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.sdate" placement="top">
        <el-card>
          <h4>{{ item.sernum }}</h4>
          <p>充值金额:{{ item.amount|rounding }},充值结果:  <el-tag :type="item.ischeck| checkFilter1" effect="dark">
            {{ item.ischeck|checkFilter }}
          </el-tag></p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getDataList } from '@/api/rechrecord'
import store from '@/store'
export default {
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
      listQuery: {
        page: 1,
        pagesize: 20,
        sernum: undefined,
        flag: 3,
        userId: store.getters.userId
      },
      listLoading: true,
      timeline: [
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getDataList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.timeline = this.list
        // this.list.forEach(element => {
        //   const temp = {
        //     timestamp: element.sdate,
        //     title: element.sernum
        //   }
        //   this.timeline.push(temp)
        // })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    }
  }
}
</script>
