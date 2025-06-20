import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Dashboard from '../pages/Dashboard.vue';
import TicketDetail from '../pages/TicketDetail.vue';
import TicketCreate from '../pages/TicketCreate.vue';
import Export from '../pages/Export.vue';

export default [
    { path: '/', component: Login },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/dashboard', component: Dashboard },
    { path: '/tickets/new', component: TicketCreate },
    { path: '/tickets/:id', component: TicketDetail },
    { path: '/export', component: Export }
]
