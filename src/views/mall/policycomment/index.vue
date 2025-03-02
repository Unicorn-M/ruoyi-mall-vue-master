<template>
  <div>
    <el-card>
      <!-- 搜索区域 -->
      <div class="search-bar">
        <el-input v-model="queryParams.keyword" placeholder="请输入评论用户查询" clearable style="width: 300px;" />
        <el-button type="primary" @click="getUmsInformationByPage">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button 
          type="danger" 
          @click="confirmBatchDelete" 
          :disabled="!selectedIds.length">
          批量删除
        </el-button>
      </div>

      <!-- 表格 -->
      <el-table 
        :data="UmsNoticeList" 
        border 
        style="width: 100%" 
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column prop="nickName" label="评论用户" />
        <el-table-column prop="content" label="评论内容" />
        <el-table-column prop="policyContent" label="评论政策" />
        <el-table-column prop="createtime" label="评论时间">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createtime, '') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button 
              type="danger" 
              size="small" 
              @click="confirmDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination 
        :current-page="queryParams.pageNum" 
        :page-size="queryParams.pageSize" 
        :total="total"
        @current-change="handlePageChange" 
        @update:current-page="(val) => (queryParams.pageNum = val)"
        @update:page-size="(val) => (queryParams.pageSize = val)" 
        layout="prev, pager, next">
      </el-pagination>
    </el-card>

    <!-- 弹出框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-form-item label="评论用户" prop="title">
          <el-input v-model="form.title" placeholder="请输入评论用户" />
        </el-form-item>
        <el-form-item label="评论内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入评论内容" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量删除确认弹窗 -->
    <el-dialog
      title="确认删除"
      :visible.sync="confirmDeleteDialogVisible"
      width="30%">
      <span>您确定要删除选中的评论吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="confirmDeleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleBatchDelete">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 单条删除确认弹窗 -->
    <el-dialog
      title="确认删除"
      :visible.sync="confirmSingleDeleteDialogVisible"
      width="30%">
      <span>您确定要删除这条评论吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="confirmSingleDeleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleSingleDelete">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {getUmsInformationByPage, listUmsPolicycomment, getUmsPolicycomment, delUmsPolicycomment, addUmsPolicycomment, updateUmsPolicycomment, exportUmsPolicycomment } from "@/api/mall/policycomment";

export default {
  data() {
    return {
      queryParams: {
        keyword: '',
        pageNum: 1,
        pageSize: 10,
      },
      UmsNoticeList: [],
      total: 0,
      selectedIds: [],
      open: false,
      title: "",
      form: {},
      rules: {},
      confirmDeleteDialogVisible: false, // 控制批量删除确认弹窗的显示
      confirmSingleDeleteDialogVisible: false, // 控制单条删除确认弹窗的显示
      deleteRow: null, // 存储当前要删除的单条记录
    };
  },
  methods: {
    async getUmsInformationByPage() {
      const res = await getUmsInformationByPage(this.queryParams)
      this.UmsNoticeList = res
    },
    getList() {
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listUmsPolicycomment(query, pageReq).then((response) => {
        const { content, totalElements } = response;
        this.UmsNoticeList = content;
        this.total = totalElements;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10, title: null, content: null, createtime: null, create: null };
      this.getList();
    },
    handleAdd() {
      this.form = {};
      this.open = true;
      this.title = "新增公告";
    },
    handleUpdate(row) {
      getUmsPolicycomment(row.id).then((response) => {
        this.form = response;
        this.open = true;
        this.title = "编辑公告";
      });
    },
    confirmDelete(row) {
      this.deleteRow = row; // 存储要删除的行
      this.confirmSingleDeleteDialogVisible = true; // 显示删除确认弹窗
    },
    handleSingleDelete() {
      delUmsPolicycomment(this.deleteRow.id).then(() => {
        this.confirmSingleDeleteDialogVisible = false; // 关闭弹窗
        this.getList();
      });
    },
    handleSelectionChange(val) {
      this.selectedIds = val.map((item) => item.id); // 获取选中行的ID集合
    },
    confirmBatchDelete() {
      if (this.selectedIds.length > 0) {
        this.confirmDeleteDialogVisible = true; // 显示批量删除确认弹窗
      }
    },
    handleBatchDelete() {
      delUmsPolicycomment(this.selectedIds).then(() => {
        this.confirmDeleteDialogVisible = false; // 关闭批量删除弹窗
        this.getList();
      });
    },
    handlePageChange(page) {
      this.queryParams.pageNum = page;
      this.getList();
    },
    submitForm() {
      if (this.form.id) {
        updateUmsPolicycomment(this.form).then(() => {
          this.open = false;
          this.getList();
        });
      } else {
        addUmsPolicycomment(this.form).then(() => {
          this.open = false;
          this.getList();
        });
      }
    },
    cancel() {
      this.open = false;
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style>
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.action-buttons {
  margin-bottom: 20px;
}
</style>
