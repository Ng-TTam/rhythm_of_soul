import React from 'react';
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

];
