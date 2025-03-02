<template>
  <div>
    <el-card>
      <!-- 搜索区域 -->
      <div class="search-bar">
        <el-input v-model="queryParams.keyword" placeholder="请输入商品名称" clearable style="width: 300px;" />
        <el-button type="primary" @click="getUmsInformationByPage">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="success" @click="handleAdd">新增</el-button>
        <el-button type="danger" @click="confirmBatchDelete" :disabled="!selectedIds.length">
          批量删除
        </el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="dataList" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column label="图片" width="100">
          <template #default="scope">
            <img :src="`${scope.row.pic}`" alt="图片" style="width: 50px; height: 50px;" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="商品价格" />
        <el-table-column prop="count" label="商品库存" />
        <el-table-column prop="saleNumber" label="商品销量" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="confirmDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination :current-page="queryParams.pageNum" :page-size="queryParams.pageSize" :total="total"
        @current-change="handlePageChange" layout="prev, pager, next, jumper">
      </el-pagination>

      <!-- 查看内容对话框 -->
      <el-dialog title="查看内容" :visible.sync="isContentDialogVisible" width="50%">
        <div v-html="currentContent"></div>
        <img :src="`${dialogImage}`" alt="图片" style="max-width: 100%; margin-top: 20px;" v-if="dialogImage" />
        <template #footer>
          <el-button @click="isContentDialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </el-card>

    <!-- 删除确认弹窗 -->
    <el-dialog title="确认删除" :visible.sync="confirmDialogVisible" width="30%">
      <span>您确定要删除这条记录吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleDelete">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量删除确认弹窗 -->
    <el-dialog title="确认批量删除" :visible.sync="batchDeleteDialogVisible" width="30%">
      <span>您确定要删除选中的记录吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="batchDeleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleBatchDelete">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新增或编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="上传图片" prop="image">
          <image-upload v-model="form.pic" :limit="1" :filesize="2" @change="handleImageChange"></image-upload>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入商品价格" />
        </el-form-item>
        <el-form-item label="商品库存" prop="count">
          <el-input v-model="form.count" placeholder="请输入商品库存" />
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {getUmsInformationByPage, listGoods, getGoods, delGoods, addGoods, updateGoods, exportGoods } from "@/api/mall/goods";
export default {
  components: {

  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
      isContentDialogVisible: false, // 新的对话框可见性变量
      currentContent: '', // 新的内容变量
      dialogImage: '',
      queryParams: {
        keyword: '',
        pageNum: 1,
        pageSize: 10,
      },
      dataList: [],
      total: 0,
      selectedIds: [],
      confirmDialogVisible: false,
      batchDeleteDialogVisible: false,
      dialogVisible: false,
      dialogTitle: '',
      form: {
        id: null,
        pic: '',
        name: '',
        count: '',
        sale_number: ''
      },
      deleteRow: null,
    };
  },
  methods: {
    async getUmsInformationByPage() {
      const res = await getUmsInformationByPage(this.queryParams)
      this.dataList = res
    },
    showContentDialog(row) {
      this.currentContent = row.content; // 假设内容在 row.content 中
      this.dialogImage = row.pic;
      this.isContentDialogVisible = true;
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.fetchData();
    },
    resetQuery() {
      this.queryParams.keyword = '';
      this.handleQuery();
    },
    fetchData() {
      const { keyword, pageNum, pageSize } = this.queryParams;
      listGoods({ keyword }, { page: pageNum - 1, size: pageSize }).then(response => {
        this.dataList = response.content;
        this.total = response.totalElements;
      });
    },
    handleAdd() {
      this.dialogTitle = '新增资讯';
      this.form = { id: null, title: '', content: '' };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      getGoods(row.id).then(response => {
        this.form = response;
        this.dialogTitle = '编辑资讯';
        this.dialogVisible = true;
      });
    },
    submitForm() {
      // 验证价格和库存
      const price = parseFloat(this.form.price);
      const count = parseInt(this.form.count, 10);

      if (isNaN(price) || price <= 0) {
        this.$message.error('商品价格必须是一个大于 0 的数字');
        return; // 终止提交
      }

      if (isNaN(count) || count <= 0) {
        this.$message.error('商品库存必须是一个大于 0 的整数');
        return; // 终止提交
      }

      // 如果验证通过，继续进行提交的逻辑
      console.log('表单数据:', this.form);
      // 发送到后端的逻辑
      addGoods(this.form)
      this.dialogVisible = false; // 关闭对话框
      fetchData()
    },
    handleImageChange(images) {
      if (images.length > 0) {
        this.form.pic = { url: URL.createObjectURL(images[0]) }; // 处理单张图片
      } else {
        this.form.pic = null; // 如果没有上传图片，重置
      }
    },
    confirmDelete(row) {
      this.deleteRow = row;
      this.confirmDialogVisible = true;
    },
    handleDelete() {
      delGoods(this.deleteRow.id).then(() => {
        this.$message.success('删除成功');
        this.confirmDialogVisible = false;
        this.fetchData();
      });
    },
    confirmBatchDelete() {
      this.batchDeleteDialogVisible = true;
    },
    handleBatchDelete() {
      delGoods(this.selectedIds).then(() => {
        this.$message.success('批量删除成功');
        this.batchDeleteDialogVisible = false;
        this.fetchData();
      });
    },
    handleSelectionChange(selection) {
      this.selectedIds = selection.map(item => item.id);
    },
    handlePageChange(page) {
      this.queryParams.pageNum = page;
      this.fetchData();
    },
    viewContent(row) {
      this.$message.info(`查看内容: ${row.title}`);
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped>
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