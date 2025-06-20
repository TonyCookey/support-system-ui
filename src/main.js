import { createApp, provide, h } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { DefaultApolloClient } from '@vue/apollo-composable';
import App from './App.vue';
import routes from './router';
import apolloClient from './services/apollo';

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

app.use(router);
app.mount('#app');
