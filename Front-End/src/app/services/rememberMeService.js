// Service để xử lý chức năng Remember me
const STORAGE_KEYS = {
    REMEMBER_ME: 'rememberMe',
    USER_EMAIL: 'userEmail',
    USER_PASSWORD: 'userPassword'
};

export const rememberMeService = {
    // Lưu thông tin đăng nhập
    saveCredentials(credentials) {
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, credentials.email);
        localStorage.setItem(STORAGE_KEYS.USER_PASSWORD, credentials.password);
    },

    // Xóa thông tin đăng nhập
    clearCredentials() {
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
        localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
        localStorage.removeItem(STORAGE_KEYS.USER_PASSWORD);
    },

    // Lấy thông tin đăng nhập đã lưu
    getStoredCredentials() {
        const isRemembered = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
        if (!isRemembered) return null;

        return {
            email: localStorage.getItem(STORAGE_KEYS.USER_EMAIL),
            password: localStorage.getItem(STORAGE_KEYS.USER_PASSWORD),
            rememberMe: true
        };
    },

    // Kiểm tra xem có thông tin đăng nhập được lưu không
    hasStoredCredentials() {
        return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
    },

    // Cập nhật thông tin đăng nhập nếu Remember me đang được bật
    updateCredentialsIfRemembered(credentials) {
        if (this.hasStoredCredentials()) {
            this.saveCredentials(credentials);
        }
    }
};
