import ResetPassword from '../pages/login/ResetPassword';
import ResetPasswordVerify from '../pages/login/ResetPasswordVerify';
import LoginForm from '../pages/login/Login';
import SignUp from '../pages/login/Sign-up';

export const authRouter = [
  {
    path: '/login',
    element: < LoginForm />
  },
  {
    path: '/sign-up',
    element: <SignUp />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  { path: "/reset-password/verify", element: <ResetPasswordVerify /> }

];
