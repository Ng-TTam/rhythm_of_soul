import ResetPassword from '../pages/auth/ResetPassword';
import ResetPasswordVerify from '../pages/auth/ResetPasswordVerify';
import LoginForm from '../pages/auth/Login';
import SignUp from '../pages/auth/SignUp';

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
