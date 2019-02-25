//设置全局表单提交格式
Vue.http.options.emulateJSON = true;

const {body} = document;
const WIDTH = 1024;
const RATIO = 3;

const api = {
    update: '/SSM-QX-SYS-V1.01/user/update.do',
    info: '/SSM-QX-SYS-V1.01/admin/info.do',
};

// Vue实例
var vm = new Vue({
    el: '#app',
    data() {
        return {
            infomation: {
                id: '',
                username: '',
                email: '',
                nickname: '',
                password: '',
                checkPass: '',
            },
            pass: {
                id: '',
                username: '',
                password: '',
                checkPass: '', //old password
                repassword: '', //repeat password
            },
                id: '',
                username: '',
                email: '',
                nickname: '',
                password: '',
                checkPass: '',

            defaultActive: '9',
            token: {name: ''},

            mobileStatus: false, //是否是移动端
            sidebarStatus: true, //侧边栏状态，true：打开，false：关闭
            sidebarFlag: ' openSidebar ', //侧边栏标志
            
            personal:false,
	        log : false,
	        user:false,
	        role:false,
	        permissions:[]
        }
    },
    methods: {

        //获取当前用户信息
        getUserInfo() {
            this.$http.get(api.info).then(result => {
                this.$refs.infomation.resetFields(); //清空校验状态
                this.$refs.pass.resetFields(); //清空校验状态
                this.infomation.id = result.body.data.id;
                this.infomation.username = result.body.data.username;
                this.infomation.email = result.body.data.email;
                this.infomation.nickname = result.body.data.nickname;
                this.pass.id = result.body.data.id;
                this.token.name = result.body.data.username;
            });
        },

        saveInfo() {
        	//console.log(this.infomation.email);
            if (this.infomation.username == '' || this.infomation.username == null || this.infomation.nickname == '' || this.infomation.nickname == null || this.infomation.email == '' || this.infomation.email == null) {
            	console.log("输入的信息有误");
                this.$message({
                    type: 'info',
                    message: '输入的信息有误',
                    duration: 6000
                });
            } else {
                this.$http.post(api.update, JSON.stringify(this.infomation)).then(result => {
                    if (result.body.code == 20000) {
                    	console.log(this.infomation.username)
                        if (this.infomation.username == this.token.name) {
                            /*window.location.reload();*/
                            this.$message({
                                type: 'success',
                                message: result.body.data,
                                duration: 6000
                            });
                        } else {
                            //修改了用户名，从新登陆
                            //执行/logout请求
                            window.location.href = '/SSM-QX-SYS-V1.01/logout.do'; //更改了密码，注销当前登录状态，重新登录
                        }
                    } else {
                        this.$message({
                            type: 'info',
                            message: result.body.data,
                            duration: 6000
                        });
                        window.location.reload();
                    }
                    this.$refs.infomation.resetFields(); //清空校验状态
                    console.log("清空状态");
                    this.infomation.username = '';
                    this.infomation.nickname = '';
                    this.infomation.email = '';
                });
            }
        },

        changePassword() {
            console.log(this.pass);
            if (this.pass.checkPass.length < 6) {
                this.$message({
                    type: 'error',
                    message: '请重新输入密码，密码长度在6位及以上',
                    duration: 6000
                });
            } else if (this.pass.password == this.pass.checkPass) {
                this.$message({
                    type: 'info',
                    message: '请输入新的密码',
                    duration: 6000
                });
            } else if (this.pass.password != this.pass.repassword) {
                this.$message({
                    type: 'error',
                    message: '两次输入的密码不一致',
                    duration: 6000
                });
            } else if (this.pass.password.length < 6) {
                this.$message({
                    type: 'error',
                    message: '请重新输入密码，密码长度在6位及以上',
                    duration: 6000
                });
                this.clearPass();
            } else {
                this.pass.username = this.infomation.username;
                this.$http.post('/SSM-QX-SYS-V1.01/user/update.do', JSON.stringify(this.pass)).then(result => {
                    if (result.body.code == 20000) {
                        this.$message({
                            type: 'success',
                            message: result.body.data,
                            duration: 6000
                        });

                        //执行/logout请求
                        window.location.href = '/SSM-QX-SYS-V1.01/logout.do'; //更改了密码，注销当前登录状态，重新登录
                    } else {
                        this.$message({
                            type: 'info',
                            message: result.body.data,
                            duration: 6000
                        });
                    }
                    this.clearPass();
                });
            }
        },
        clearPass() {
            this.$refs.pass.resetFields(); //清空校验状态
            this.pass.checkPass = '';
            this.pass.password = '';
            this.pass.repassword = '';
        },

        isMobile() {
            const rect = body.getBoundingClientRect();
            return rect.width - RATIO < WIDTH
        },

        handleSidebar() {
            if (this.sidebarStatus) {
                this.sidebarFlag = ' hideSidebar ';
                this.sidebarStatus = false;

            } else {
                this.sidebarFlag = ' openSidebar ';
                this.sidebarStatus = true;
            }
            const isMobile = this.isMobile();
            if (isMobile) {
                this.sidebarFlag += ' mobile ';
                this.mobileStatus = true;
            }
        },
        //蒙版
        drawerClick() {
            this.sidebarStatus = false;
            this.sidebarFlag = ' hideSidebar mobile '
        }
    },
    // 生命周期函数
    created() {
        this.getUserInfo();

        const isMobile = this.isMobile();
        if (isMobile) {
            //手机访问
            this.sidebarFlag = ' hideSidebar mobile ';
            this.sidebarStatus = false;
            this.mobileStatus = true;
        }
    },
    mounted : function() {
		this.$http.post('/SSM-QX-SYS-V1.01/role/doFindCurrentMenus.do').then(result => {
			this.permissions = result.data.data;
			for(var i =0;i<this.permissions.length;i++){
				switch(this.permissions[i]){
					case 'sys:personal':
						this.personal=true;
						   break;
					case 'sys:log':
						this.log = true;
                        break;
					case 'sys:user':
						this.user = true;
                        break;
					case 'sys:role':
						this.role = true;
                        break;
					case 'sys:root':
						this.role = true;
						this.user = true;
						this.log = true;
						this.personal=true;
                        break;
				}
			}
        });
    }
});
