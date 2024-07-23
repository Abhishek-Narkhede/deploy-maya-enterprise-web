// AuthListener.js
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthListener = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.user.userData);
    const navigate = useNavigate();
    const location = useLocation();
    const notAuthenticatedRoutes = ['/login', '/signup', '/createPassword', '/VerifyOTP', '/products', '/', '/product/brand/:id', '/product/:id','/contact-us','/faqs']
    useEffect(() => {
        const currentRoute = location.pathname
        const isNotAuthenticatedRoute = notAuthenticatedRoutes.some(route => {
            const pattern = new RegExp('^' + route.replace(/:[^\s/]+/g, '([\\w-]+)') + '$');
            return pattern.test(currentRoute);
        });

        if (!isAuthenticated && !isNotAuthenticatedRoute) {
            navigate('/');
        }
    }, [isAuthenticated, navigate, location]);

    return children;
};

export default AuthListener;
