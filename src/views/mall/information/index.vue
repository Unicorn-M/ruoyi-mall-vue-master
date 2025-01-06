<template>
    <div>
        <el-card>
            <!-- 搜索区域 -->
            <div class="search-bar">
                <el-input v-model="queryParams.keyword" placeholder="请输入关键字查询" clearable style="width: 300px;" />
                <el-button type="primary" @click="handleQuery">查询</el-button>
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
                <el-table-column prop="title" label="资讯标题" />
                <el-table-column label="资讯内容" width="150">
                    <template #default="scope">
                        <el-button type="success" size="small" @click="showContentDialog(scope.row)">点击查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="publishDate" label="发布时间" />
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
                <el-form-item label="资讯标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入资讯标题" />
                </el-form-item>
                <el-form-item label="资讯内容" prop="content">
                    <!-- <el-input type="textarea" v-model="form.content" placeholder="请输入资讯内容" /> -->
                     <!-- <image-upload v-model="form.content" :limit="3" :filesize="2"></image-upload> -->
                    <editor v-model="form.content" :min-height="192"/>
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
import { listUmsInfomation, getUmsInfomation, addUmsInfomation, updateUmsInfomation, delUmsInfomation } from '@/api/mall/information';
// import { QuillEditor } from 'vue-quill-editor';
// import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.bubble.css';
// import 'quill/dist/quill.snow.css';

export default {
    components: {
        
    },
    data() {
        return {
            isContentDialogVisible: false, // 新的对话框可见性变量
            currentContent: '', // 新的内容变量
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
                title: '',
                content: ''
            },
            deleteRow: null,
        };
    },
    methods: {
        showContentDialog(row) {
            this.currentContent = row.content; // 假设内容在 row.content 中
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
            listUmsInfomation({ keyword }, { page: pageNum - 1, size: pageSize }).then(response => {
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
            getUmsInfomation(row.id).then(response => {
                this.form = response;
                this.dialogTitle = '编辑资讯';
                this.dialogVisible = true;
            });
        },
        submitForm() {
            const api = this.form.id ? updateUmsInfomation : addUmsInfomation;
            api(this.form).then(() => {
                this.$message.success(`${this.form.id ? '编辑' : '新增'}成功`);
                this.dialogVisible = false;
                this.fetchData();
            });
        },
        confirmDelete(row) {
            this.deleteRow = row;
            this.confirmDialogVisible = true;
        },
        handleDelete() {
            delUmsInfomation(this.deleteRow.id).then(() => {
                this.$message.success('删除成功');
                this.confirmDialogVisible = false;
                this.fetchData();
            });
        },
        confirmBatchDelete() {
            this.batchDeleteDialogVisible = true;
        },
        handleBatchDelete() {
            delUmsInfomation(this.selectedIds).then(() => {
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