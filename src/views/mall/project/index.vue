<template>
  <div class="app-container">
    <!-- 筛选区域 -->
    <el-row :gutter="20" class="filter-row">
      <el-col :span="6">
        <el-select v-model="filters.status" placeholder="请选择状态" clearable>
          <el-option label="待审核" value="待审核"></el-option>
          <el-option label="审核通过" value="审核通过"></el-option>
          <el-option label="审核拒绝" value="审核拒绝"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="80" />
      <el-table-column prop="username" label="申请用户" />
      <el-table-column prop="applyContent" label="申请说明" />
      <el-table-column prop="createtime" label="申请时间" />
      <el-table-column label="申请资料" width="120">
        <template #default="scope">
          <el-button type="warning" size="small">下载资料</el-button>
        </template>
      </el-table-column>
      <!-- 状态列 -->
      <el-table-column label="审核状态" :formatter="formatStatus" />
      <el-table-column prop="explanation" label="审核说明" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="success" size="small" @click="handleReview(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 分页 -->
    <el-pagination :current-page="queryParams.pageNum" :page-size="queryParams.pageSize" :total="total"
      @current-change="handlePageChange" layout="prev, pager, next, jumper"></el-pagination>

    <!-- 审核对话框 -->
    <el-dialog :visible.sync="reviewDialogVisible" title="助农项目申请" width="400px">
      <el-form :model="reviewForm" label-width="80px">
        <el-form-item label="审核状态">
          <el-select v-model="reviewForm.status" placeholder="请选择状态">
            <el-option label="待审核" :value="0"></el-option>
            <el-option label="审核通过" :value="1"></el-option>
            <el-option label="审核拒绝" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核说明">
          <el-input type="textarea" v-model="reviewForm.explanation" placeholder="请输入审核说明" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReview">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { listUmsProject, getUmsProject, delUmsProject, addUmsProject, updateUmsProject, exportUmsProject } from "@/api/mall/project";

export default {
  data() {
    return {
      filters: {
        status: "",
      },
      queryParams: {
        pageNum: 1, // 当前页码
        pageSize: 10, // 每页条数
      },
      dataList: [], // 表格数据
      total: 0, // 总条数
      reviewDialogVisible: false, // 审核对话框开关
      reviewForm: {
        id: null, // 当前数据的ID
        status: "", // 审核状态
        explanation: "", // 审核说明
      },
      loading: false, // 加载状态
    };
  },
  methods: {
    formatStatus(row) {
      const statusMap = {
        0: "待审核",
        1: "审核通过",
        2: "审核拒绝",
      };
      return statusMap[row.status] || "未知状态";
    },
    fetchData() {
      this.loading = true;
      const query = {
        ...this.filters,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      listUmsProject(query)
        .then((response) => {
          const { content, totalElements } = response;
          this.dataList = content;
          this.total = totalElements;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetFilters() {
      this.filters = { status: "" };
      this.queryParams.pageNum = 1;
      this.fetchData();
    },
    handlePageChange(page) {
      this.queryParams.pageNum = page;
      this.fetchData();
    },
    handleReview(row) {
      this.reviewForm.id = row.id;
      this.reviewForm.status = row.status || "待审核";
      this.reviewForm.explanation = row.explanation || "";
      this.reviewDialogVisible = true;
    },
    submitReview() {
      const { id, status, explanation } = this.reviewForm;
      updateUmsProject({ id, status, explanation }).then(() => {
        this.$message.success("审核成功");
        this.reviewDialogVisible = false;
        this.fetchData();
      });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>


<style scoped>
.filter-row {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
