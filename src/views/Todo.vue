<template>
  <div id="Todo">
    <a-input placeholder="请输入任务" class="my_ipt" :value="inputValue" @change="handleInputChange" />
    <a-button type="primary" @click="handleAddList">添加事项</a-button>

    <a-list bordered :dataSource="infolist" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <a-checkbox :checked="item.done" @change="e => handleChecked(e, item.id)">{{ item.info }}</a-checkbox>
        <!-- 删除链接 -->
        <a slot="actions" @click="deleteCurrent(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{ undoneList }}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <a-button :type="viewKey === 'all' ? 'primary' : 'default'" name="all" @click="changeList">全部</a-button>
          <a-button :type="viewKey === 'undone' ? 'primary' : 'default'" name="undone" @click="changeList">未完成</a-button>
          <a-button :type="viewKey === 'done' ? 'primary' : 'default'" name="done" @click="changeList"> 已完成</a-button>
        </a-button-group>
        <!-- 把已经完成的任务清空 -->
        <a @click="deleteDone">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Todo',
  data() {
    return {}
  },
  methods: {
    handleInputChange(e) {
      const { value } = e.target
      if (value.trim()) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$store.commit('getInputvalue', value)
        }, 1000)
      }
    },
    handleAddList() {
      if (!this.inputValue.trim()) {
        return this.$message.warning('文本框内容不能为空！')
      }
      this.$store.commit('addItem')
    },
    changeList(e) {
      this.$store.commit('changeViewkey', e.target.name)
    },
    handleChecked(e, id) {
      const params = {
        id,
        done: e.target.checked
      }
      this.$store.commit('changeDone', params)
    },
    deleteCurrent(id) {
      this.$store.commit('removeCurrentItem', id)
    },
    deleteDone() {
      this.$store.commit('removeDone')
    }
  },
  created() {
    this.$store.dispatch('getList')
  },
  computed: {
    ...mapState(['inputValue', 'viewKey']),
    ...mapGetters(['infolist', 'undoneList'])
  }
}
</script>

<style scoped>
#app {
  padding: 10px;
}

.my_ipt {
  width: 500px;
  margin-right: 10px;
}

.dt_list {
  width: 500px;
  margin-top: 10px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
