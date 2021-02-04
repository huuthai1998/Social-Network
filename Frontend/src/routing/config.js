import routePaths from 'routing/paths'
import HomePage from 'pages/Home/Home'
import LoginPage from 'pages/Login/LoginPage'
import RegisterPage from 'pages/Register/RegisterPage'
import UploadAvatar from 'pages/UploadAvatar/UploadAvatar'
import Profile from 'pages/Profile/Profile'
import SettingPage from 'pages/Setting/SettingPage'
//import ResetPasswordPage from 'pages/ResetPassword/ResetPasswordPage'
//import SettingPage from 'pages/Setting/SettingPage'

const config = [
  {
    path: routePaths.HOME,
    exact: true,
    component: HomePage,
    authOnly: true,
    redirect: routePaths.LOGIN,
  },
  {
    path: routePaths.LOGIN,
    component: LoginPage,
    unAuthOnly: true,
    redirect: routePaths.HOME,
  },
  {
    path: routePaths.REGISTER,
    component: RegisterPage,
    redirect: routePaths.HOME,
    unAuthOnly: true,
  },
  {
    path: routePaths.UPLOAD_AVATAR,
    component: UploadAvatar,
  },
  {
    path: routePaths.PROFILE,
    component: Profile,
    authOnly: true,
    redirect: routePaths.LOGIN,
  },
  {
    path: routePaths.SETTING,
    component: SettingPage,
    authOnly: true,
    redirect: routePaths.LOGIN,
  },
]

export default config
