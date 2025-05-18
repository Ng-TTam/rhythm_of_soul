import ResetPassword from '../pages/login/ResetPassword';
import ResetPasswordVerify from '../pages/login/ResetPasswordVerify';
import LoginForm from '../pages/login/login';
import SignUp from '../pages/login/sign-up';

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
