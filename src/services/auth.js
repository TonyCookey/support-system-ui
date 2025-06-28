import { ref } from 'vue';

const isLoggedIn = ref(!!localStorage.getItem('token'));

export function useAuthStore() {
    const saveToken = (token) => {
        localStorage.setItem('token', token);
        isLoggedIn.value = true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        isLoggedIn.value = false;
    };

    const getToken = () => {
        return localStorage.getItem('token');
    };

    return { isLoggedIn, saveToken, logout, getToken };
}
