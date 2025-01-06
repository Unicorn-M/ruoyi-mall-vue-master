<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="订单编号" prop="orderId">
        <el-input v-model="queryParams.orderId" placeholder="请输入订单编号" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="orderList" style="width: 100%" v-loading="loading">
      <el-table-column label="图片" width="100">
        <template #default="scope">
          <img :src="`${baseUrl}${scope.row.pic}`" alt="图片" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称" />
      <el-table-column prop="username" label="下单用户" />
      <el-table-column prop="orderid" label="订单编号" />
      <el-table-column prop="price" label="商品价格" />
      <el-table-column prop="status" label="商品状态" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" v-if="scope.row.status !== '已发货'" @click="handleShip(scope.row)">发货</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="queryParams.pageNum" :page-size="queryParams.pageSize" :total="total"
      @current-change="handlePageChange" layout="prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import { listUmsOrder, updateUmsOrder } from "@/api/mall/umsOrder";

export default {
  name: 'OrderManagement',
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
      loading: false,
      total: 0,
      orderList: [],
      showSearch: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: '',
        goodsName: '',
        username: '',
        status: null
      },
    };
  },
  methods: {
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listUmsOrder(query, pageReq).then(response => {
        const { content, totalElements } = response;
        this.orderList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10, orderId: '', goodsName: '', username: '', status: null };
      this.getList();
    },
    handlePageChange(page) {
      this.queryParams.pageNum = page;
      this.getList();
    },
    handleShip(row) {
      this.loading = true;
      row.status = '已发货';
      updateUmsOrder(row).then(() => {
        this.$message.success('发货成功');
        this.getList();
      }).finally(() => {
        this.loading = false;
      });
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
