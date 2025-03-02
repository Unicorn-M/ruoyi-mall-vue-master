<template>
    <div>
        <el-card>
            <!-- 搜索区域 -->
            <div class="search-bar">
                <el-input v-model="queryParams.keyword" placeholder="请输入用户名查询" clearable style="width: 300px;" />
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
                <el-table-column label="头像" width="100">
                    <template #default="scope">
                        <img :src="`${scope.row.pic}`" alt="头像" style="width: 50px; height: 50px;" />
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" />
                <el-table-column prop="nickName" label="姓名" />
                <el-table-column prop="tele" label="电话" />
                <el-table-column prop="email" label="邮箱" />
                <!-- 身份字段映射 -->
                <el-table-column prop="isPoor" label="身份">
                    <template #default="scope">
                        <span>{{ formatIdentity(scope.row.isPoor) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="money" label="余额" />
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
                <img :src="`${dialogImage}`" alt="头像" style="max-width: 100%; margin-top: 20px;"
                    v-if="dialogImage" />
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
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="上传头像" prop="pic">
                    <image-upload v-model="form.pic" :limit="1" :filesize="2"
                        @change="handleImageChange"></image-upload>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="姓名" prop="nickName">
                    <el-input v-model="form.nickName" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="电话" prop="tele">
                    <el-input v-model="form.tele" placeholder="请输入电话" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="身份" prop="isPoor">
                    <el-input v-model="form.isPoor" placeholder="请输入身份(0 普通用户 \\ 1 贫困户)" />
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
import { getUmsInformationByPage, listUmsUser, getUmsUser, delUmsUser, addUmsUser, updateUmsUser, exportUmsUser } from "@/api/mall/user";
export default {
    components: {

    },
    data() {
        return {
            dialogVisible: false, // 对话框显示状态
            dialogTitle: "新增用户", // 对话框标题
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
                username: '',
                nickName: '',
                tele: '',
                email: '',
                isPoor: ''
            },
            rules: {
                pic: [{ required: true, message: "请上传头像", trigger: "change" }],
                username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
                nickName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
                tele: [
                    { required: true, message: "请输入电话", trigger: "blur" },
                    { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号", trigger: "blur" }
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" }
                ],
                isPoor: [
                    { required: true, message: "请输入身份", trigger: "blur" },
                    { pattern: /^[01]$/, message: "身份只能是 0 或 1", trigger: "blur" }
                ]
            },
            deleteRow: null,
        };
    },
    methods: {
        async getUmsInformationByPage() {
            const res = await getUmsInformationByPage(this.queryParams)
            this.dataList = res
        },
        // 映射身份字段
        formatIdentity(isPoor) {
            const identityMap = {
                0: "普通用户",
                1: "贫困户",
            };
            return identityMap[isPoor] || "未知身份";
        },
        handleImageChange(file) {
            console.log("图片上传更改：", file);
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
            listUmsUser({ keyword }, { page: pageNum - 1, size: pageSize }).then(response => {
                this.dataList = response.content;
                this.total = response.totalElements;
            });
        },
        handleAdd() {
            this.dialogTitle = '新增用户';
            this.form = { id: null, title: '', content: '' };
            this.dialogVisible = true;
        },
        handleEdit(row) {
            getUmsUser(row.id).then(response => {
                this.form = response;
                this.dialogTitle = '编辑用户';
                this.dialogVisible = true;
            });
        },
        submitForm() {
            this.$refs.form.validate(valid => {
                if (!valid) {
                    this.$message.error("请检查表单填写是否正确");
                    return;
                }
                const api = this.form.id ? updateUmsUser : addUmsUser;
                api(this.form)
                    .then(() => {
                        this.$message.success(`${this.form.id ? "编辑" : "新增"}成功`);
                        this.dialogVisible = false;
                        this.fetchData(); // 刷新数据
                    })
                    .catch(err => {
                        this.$message.error(`操作失败：${err.message || "未知错误"}`);
                    });
            });
        },
        confirmDelete(row) {
            this.deleteRow = row;
            this.confirmDialogVisible = true;
        },
        handleDelete() {
            delUmsUser(this.deleteRow.id).then(() => {
                this.$message.success('删除成功');
                this.confirmDialogVisible = false;
                this.fetchData();
            });
        },
        confirmBatchDelete() {
            this.batchDeleteDialogVisible = true;
        },
        handleBatchDelete() {
            delUmsUser(this.selectedIds).then(() => {
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