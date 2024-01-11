前端权限控制按扭是否展示方法：
```
import { isPermissions } from '@/utils/auth'
methods: {
    isPermissions(permissionPath) {
      return isPermissions(permissionPath)
    }
}
<el-button type="primary" v-on:click="handleAdd" v-if="isPermissions('@Post:lv_custom')">新增</el-button>
```

系统维护
main.js 里以下注释打开
// window.location.href='/static/maintenance/index.html'
