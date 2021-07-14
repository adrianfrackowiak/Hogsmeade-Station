import IRoute from '../interfaces/route';
import ChangePasswordPage from '../pages/auth/change';
import ForgotPasswordPage from '../pages/auth/forgot';
import LoginPage from '../pages/auth/login';
import LogoutPage from '../pages/auth/logout';
import RegisterPage from '../pages/auth/register';
import ResetPasswordPage from '../pages/auth/reset';
import BooksTrack from '../pages/bookstrack';
import HomePage from '../pages/home';
import ProfilePage from '../pages/profile';
import SortingHatPage from '../pages/sortinghat';

const routes: IRoute[] = [
    {
        path: '/',
        exact: true,
        component: HomePage,
        name: 'Home Page',
        protected: false,
    },
    {
        path: '/register',
        exact: true,
        component: RegisterPage,
        name: 'Register Page',
        protected: false,
    },
    {
        path: '/login',
        exact: true,
        component: LoginPage,
        name: 'Login Page',
        protected: false,
    },
    {
        path: '/change',
        exact: true,
        component: ChangePasswordPage,
        name: 'Change Password Page',
        protected: true,
    },
    {
        path: '/logout',
        exact: true,
        component: LogoutPage,
        name: 'Logout Page',
        protected: true,
    },
    {
        path: '/forget',
        exact: true,
        component: ForgotPasswordPage,
        name: 'Forgot Password Page',
        protected: false,
    },
    {
        path: '/reset',
        exact: true,
        component: ResetPasswordPage,
        name: 'Reset Password Page',
        protected: false,
    },
    {
        path: '/profile',
        exact: true,
        component: ProfilePage,
        name: 'Profile Page',
        protected: true,
    },
    {
        path: '/bookstracker',
        exact: true,
        component: BooksTrack,
        name: 'Books Tracker Page',
        protected: true,
    },
    {
        path: '/sortinghat',
        exact: true,
        component: SortingHatPage,
        name: 'Sorting Hat Page',
        protected: true,
    },
];

export default routes;
