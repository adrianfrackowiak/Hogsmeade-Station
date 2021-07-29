import IRoute from '../interfaces/route';
import LoginPage from '../pages/auth/login';
import LogoutPage from '../pages/auth/logout';
import RegisterPage from '../pages/auth/register';
import BooksTrack from '../pages/bookstrack';
import HomePage from '../pages/home';
import ProfilePage from '../pages/profile';
import SortingHatPage from '../pages/sortinghat';
import FavoritesPage from '../pages/favorites';

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
        path: '/logout',
        exact: true,
        component: LogoutPage,
        name: 'Logout Page',
        protected: true,
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
    {
        path: '/favorites',
        exact: true,
        component: FavoritesPage,
        name: 'Favorites Page',
        protected: true,
    },
];

export default routes;
