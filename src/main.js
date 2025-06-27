import { createApp, provide, h } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { DefaultApolloClient } from '@vue/apollo-composable';
import App from './App.vue';
import routes from './router';
import apolloClient from './services/apollo';
import { getToken } from './services/auth';
import { decodeJwt } from './utils/jwt';

const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient);
    },
    render: () => h(App)
});

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register'];
    const authRequired = !publicPages.includes(to.path);
    const token = getToken();

    if (authRequired && !token) {
        return next('/login');
    }

    if (to.path === '/export') {
        try {
            const role = decodeJwt(token).role;
            if (role !== 'agent') {
                return next('/dashboard');
            }
        } catch {
            return next('/login');
        }
    }

    return next();
});

app.use(router);
app.mount('#app');
