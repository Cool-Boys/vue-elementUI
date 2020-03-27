<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>用户信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div style=" font-size: 12px;">账户余额</div>
          <el-tag> {{ user.account.amount }}</el-tag>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">  <el-tag v-if="user.account.groupIdName" type="danger">{{ user.account.groupIdName }}</el-tag> 我的邀请码:{{ user.account.incode }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>公告</span></div>
        <div class="user-bio-section-body">
          <div v-if="notice==''" class="text-muted">
            无
          </div>
          <div v-else class="text-muted">
            {{ notice.content }}
          </div>
        </div>
      </div>

      <!-- <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>Skills</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="18" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="12" />
          </div>
          <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div> -->
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import { getNotice } from '@/api/notice'

export default {
  components: { PanThumb },
  filters: {
    roleFilter(status) {
      const statusMap = {
        1: '管理员',
        2: '一级代理',

        3: '二级代理',
        4: '普通代理',
        5: '零售用户'
      }
      return statusMap[status]
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          roles: ''
        }
      }
    }
  },
  data() {
    return {
      notice: ''
    }
  },
  created() {
    getNotice().then(response => {
      this.notice = response.data
    })
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
