import Login from './login';
import Students from './students';
import Reset from './reset';
import NewPassword from './newpassword';
import Register from './register';
import Verify from './verify';
import Settings from './settings';
import Lists from './lists';
import ListCreate from './listcreate';
import ListEdit from './listedit';
import StudentCreate from './studentcreate';
import StudentProfile from './studentprofile';

const Pages = {
    public: [
        {
            restricted: true,
            path: '/',
            title: 'Giriş Yap',
            component: Login
        },
        {
            restricted: true,
            path: '/password/reset',
            title: 'Şifre Sıfırlama',
            component: Reset
        },
        {
            restricted: true,
            path: '/password/reset/:verifyToken',
            title: 'Yeni Şifre Belirle',
            component: NewPassword
        },
        {
            restricted: true,
            path: '/register',
            title: 'Hesap Oluştur',
            component: Register
        },
        {
            restricted: true,
            path: '/verify/:verifyToken',
            title: 'Hesap Doğrulama',
            component: Verify
        },
    ],
    private: [
        {
            title: 'Kursiyerler',
            path: '/students',
            component: Students
        },
        {
            title: 'Hesap Ayarları',
            path: '/settings',
            component: Settings
        },
        {
            title: 'Hedef Listelerim',
            path: '/lists',
            component: Lists
        },
        {
            title: 'Hedef Listesi Oluştur',
            path: '/list/create',
            component: ListCreate
        },
        {
            title: 'Hedef Listesini Düzenle',
            path: '/list/edit/:listId',
            component: ListEdit
        },
        {
            title: 'Kursiyer Hesabı Oluştur',
            path: '/student/create',
            component: StudentCreate
        },
        {
            title: 'Kursiyer Profili',
            path: '/student/profile/:userId',
            component: StudentProfile
        },
    ]
}

export default Pages;