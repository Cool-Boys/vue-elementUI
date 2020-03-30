<template>
  <div class="app-container">
    <div v-show="roleId==5" class="filter-container" style="text-align:center">
      <el-tag type="warning" style="clear:both;"> 付款成功后请耐心等待支付结果！！！ </el-tag>
    </div>
    <!-- <el-col v-for="(o, index) in 2" :key="o" :span="8" :offset="index > 0 ? 2 : 0"> -->
    <el-row :gutter="40">
      <el-col :span="5" :offset="5">
        <el-card :body-style="{ padding: '5px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 7px;">
            <span>充值30得100</span>
            <div class="bottom clearfix">
              <time class="time">这便宜不占？</time>
              <el-button v-waves type="text" class="button" @click="handleSelPay(30)">GO</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card :body-style="{ padding: '5px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 7px;">
            <span>充值50得170</span>
            <div class="bottom clearfix">
              <time class="time">这便宜不占？</time>
              <el-button type="text" class="button" @click="handleSelPay(50)">GOGO</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card :body-style="{ padding: '5px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 7px;">
            <span>充值100得380</span>
            <div class="bottom clearfix">
              <time class="time">这便宜不占？</time>
              <el-button type="text" class="button" @click="handleSelPay(100)">GIAO</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <!-- <el-col v-for="(o, index) in 2" :key="o" :span="8" :offset="index > 0 ? 2 : 0"> -->
      <el-col :span="5" :offset="5">
        <el-card :body-style="{ padding: '5px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 7px;">
            <span>充值150得500</span>
            <div class="bottom clearfix">
              <time class="time">这便宜不占？</time>
              <el-button type="text" class="button" @click="handleSelPay(150)">GIAOGIAO</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card :body-style="{ padding: '5px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 7px;">
            <span>充值200得800</span>
            <div class="bottom clearfix">
              <time class="time">这便宜不占？</time>
              <el-button type="text" class="button" @click="handleSelPay(200)">我咧GIAO</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card :body-style="{ padding: '5px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 7px;">
            <span>占更多便宜</span>
            <div class="bottom clearfix">
              <time class="time">这便宜不占？</time>
              <el-link class="button" type="success" href="tencent://message/?uin=827593830&Site=Sambow&Menu=yes">和客服商量去吧</el-link>
            </div>
          </div>
        </el-card>
      </el-col>

    </el-row>

    <!-- <el-row v-for="(row, index) in goods" :key="index" :gutter="40" style="margin-left:230px">

      <el-col v-for="(item, m) in row" :key="m" :span="5">
        <el-card :body-style="{ padding: '5px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 7px;">
            <span>充值{{ item.amount }}得{{ item.hdamount }}</span>
            <div class="bottom clearfix">
              <time class="time">这便宜不占？</time>
              <el-button type="text" class="button" @click="handleSelPay(item.amount)">GO</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row> -->

    <el-dialog title="支付页面" width="450px" :body-style="{ 'padding': '10px 20px'}" :visible.sync="dialogFormVisible" @close="dialogClose">

      <el-card shadow="never" :body-style="{ padding: '5px','text-align':'center' }">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-tooltip class="item" effect="dark" content="点击后加载二维码" placement="top">
              <el-button type="primary" @click="handlePay(1)">支付宝支付</el-button>
            </el-tooltip>
          </el-col>
          <el-col :span="8">
            <el-tooltip class="item" effect="dark" content="点击后加载二维码" placement="top">
              <el-button type="success" @click="handlePay(3)">微信支付</el-button>
            </el-tooltip>
          </el-col>
          <el-col :span="8">
            <el-tooltip class="item" effect="dark" content="点击后加载二维码" placement="top">
              <el-button type="danger" @click="handlePay(2)">QQ支付</el-button>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row style="margin:10px 0;">
          <el-tag type="warning"> 付款成功后请耐心等待支付结果！！！ </el-tag>
        </el-row>
        <el-row style="margin:10px 0;">
          <el-tag type="danger">注意:一定要支付与金额匹配</el-tag><el-tag type="danger">否则订单支付记录失败</el-tag>
        </el-row>

        <div v-loading="dialogLoading" class="block">
          <el-image :src="zfUrl">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" style="width:210px;height:210px" />
            </div>
          </el-image>
        </div>
        <div style="padding: 14px;">
          <div><el-tag type="success"> 充值金额:{{ payData.price }}</el-tag></div>
          <div class="bottom clearfix">
            <count-down
              :current-time="payData.serverTime"
              :start-time="payData.serverTime"
              :end-time="payData.endTime"
              :tip-text="'距离开始'"
              :tip-text-end="'距离结束'"
              :end-text="'结束自定'"
              :hour-txt="':'"
              :minutes-txt="':'"
              :seconds-txt="''"
              @start_callback="countDownS_cb(1)"
              @end_callback="countDownE_cb(1)"
            />
            <div v-show="!isPayTimeOut">订单失效，点击 <el-link type="danger" @click="handlePayAigen">重刷</el-link></div>
          </div>
        </div>

      </el-card>

    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { findByWhere, insert, update, deleteData } from '@/api/rechrecord'
// import { selectUsers } from '@/api/common'
import { getPayAmountData, getPayAmountDataStatus } from '@/api/common'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import CountDown from 'vue2-countdown'
import store from '@/store'
export default {
  components: { CountDown },
  directives: { waves },
  filters: {
    PlatFilter(status) {
      return status
    },
    rounding(value) {
      return parseFloat(value === '' ? 0 : value).toFixed(2)
    },
    flagFilter1(status) {
      const statusMap = {
        1: '充值',
        2: '转账',
        3: '线上充值'
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
      listLoading: true,
      dialogLoading: false,
      goods: [[{
        id: 1,
        amount: 30,
        hdamount: 100
      },
      {
        id: 2,
        amount: 50,
        hdamount: 170
      },
      {
        id: 3,
        amount: 100,
        hdamount: 380
      }
      ],
      [{
        id: 4,
        amount: 150,
        hdamount: 500
      },
      {
        id: 5,
        amount: 200,
        hdamount: 800
      },
      {
        id: 6,
        amount: '',
        hdamount: ''
      }
      ]
      ],
      listQuery: {
        page: 1,
        pagesize: 20,
        sernum: undefined,
        userId: store.getters.userId
      },
      zfUrl: '',
      payData: {
        endTime: '',
        creatTime: '',
        serverTime: '',
        price: ''
      },
      roleId: store.getters.roleId,
      amount: '',
      zftimer: '',
      isPayTimeOut: true,
      currentDate: new Date(),
      selectOptions: null,
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
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
  },
  beforeDestroy() {
    clearInterval(this.zftimer)
  },
  methods: {
    countDownS_cb: function(x) {
      console.log(x)
    },
    countDownE_cb: function(x) {
      clearInterval(this.zftimer)
      this.isPayTimeOut = true
      // this.handlePay(this.type)
    },
    handlePayAigen() {
      this.handlePay(this.type)
    },
    handlePay(type) {
      this.type = type
      this.dialogLoading = true
      getPayAmountData({ amount: this.amount, type: type, userId: store.getters.userId }).then(response => {
        this.dialogLoading = false
        const data = response.data
        this.payData = data
        this.zfUrl = data.qrcode
        this.dialogFormVisible = true
        this.zftimer = setInterval(this.handlePayStaues, 1000)
      })
    },
    dialogClose() {
      clearInterval(this.zftimer)
      this.zfUrl = ''
      this.payData = {
        endTime: '',
        creatTime: '',
        serverTime: '',
        price: ''
      }
    },
    handlePayStaues() {
      getPayAmountDataStatus({ orderid: this.payData.order_id }).then(response => {
        const data = response.data
        const paystatus = data.status
        console.log(paystatus)
        if (paystatus === 2 || paystatus === 1) {
          this.payStatus = 1
          this.dialogFormVisible = false
          clearInterval(this.zftimer)
          this.$notify({
            title: '成功',
            message: '支付成功,充值已到账！',
            type: 'success'
          })
        } else if (paystatus < 0) {
          this.dialogFormVisible = false
          clearInterval(this.zftimer)
          this.$notify({
            title: '注意',
            message: '支付失败,联系管理员吧！',
            type: 'error'
          })
        }
        // else{

        // }
      })
    },
    handleSelPay(data) {
      this.amount = data
      this.payData.price = data
      this.dialogFormVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

 .time {
    font-size: 9px;
    color: #999;
  }

  .bottom {
    margin-top: 8px;
    line-height: 6px;
  }

  .button {
    padding: 0;
    font-size: 14pt;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
  // .el-card__body{
  //   text-align:center
  // }
  .el-dialog__body{
    padding:10px 20px;
  }
</style>
