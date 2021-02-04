import React, { useEffect, useReducer } from 'react'
import Cookies from 'js-cookie'

const axios = require('axios')

const LOGIN_REQUEST = 'LOGIN_REQUEST'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGIN_FAIL = 'LOGIN_FAIL'
const REGISTER_REQUEST = 'REGISTER_REQUEST'
const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
const REGISTER_FAIL = 'REGISTER_FAIL'
const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
const CHECK_AUTH_SUCCESS = 'CHECK_AUTH_SUCCESS'
const CHECK_AUTH_FAIL = 'CHECK_AUTH_FAIL'
const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS'

const authReducer = (state, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
      return { isLoading: true }
    case REGISTER_SUCCESS:
      return { isLoading: false, user: action.payload, authenticated: true }
    case REGISTER_FAIL:
      return { isLoading: false, error: action.payload }
    case LOGIN_REQUEST:
      return { isLoading: true }
    case LOGIN_SUCCESS:
      return { isLoading: false, user: action.payload, authenticated: true }
    case LOGIN_FAIL:
      return { isLoading: false, error: action.payload }
    case LOGOUT_REQUEST:
      return { isLoading: true }
    case LOGOUT_SUCCESS:
      return { isLoading: false, user: undefined }
    case CHECK_AUTH_SUCCESS:
      return { isLoading: false, authenticated: true, user: action.payload }
    case CHECK_AUTH_FAIL:
      return { isLoading: false, authenticated: false, user: undefined }
    case UPDATE_USER_SUCCESS:
      return { isLoading: false, authenticated: true, user: action.payload }
    default:
      return state
  }
}

const initialState = {
  isLoading: true,
  user: undefined,
  error: '',
  authenticated: false,
  token: '',
  address: '',
}

const AuthContext = React.createContext({
  updateUser: () => {},
  logout: async () => {},
  signUp: async (email, password, username, name) => {},
  logIn: async (email, password) => {},
  changeAvatar: async (avatar) => {},
})

export const AuthProvider = ({ children }) => {
  const [authContext, dispatch] = useReducer(authReducer, initialState)
  useEffect(() => {
    updateUser()
  }, [])

  const changeAvatar = (avatar) => {
    axios
      .put(
        `https://social-network-clone-reactnode.herokuapp.com/user/avatar/${authContext.user._id}`,
        { avatar },
        {
          headers: {
            Authorization: 'Bearer ' + authContext.user.token,
          },
        }
      )
      .then(({ data }) => {
        dispatch({
          type: UPDATE_USER_SUCCESS,
          payload: { ...data, token: authContext.user.token },
        })
        Cookies.set(
          'userInfo',
          JSON.stringify({ ...data, token: authContext.user.token }),
          { expires: 7 }
        )
      })
  }
  const updateUser = () => {
    let user = Cookies.getJSON('userInfo')
    if (user !== undefined) {
      axios
        .get(
          'https://social-network-clone-reactnode.herokuapp.com/user/verifyLogin',
          {
            headers: {
              Authorization: 'Bearer ' + user.token,
            },
          }
        )
        .then(({ data }) => {
          if (data.isAuth) dispatch({ type: CHECK_AUTH_SUCCESS, payload: user })
          else dispatch({ type: CHECK_AUTH_FAIL })
        })
    } else dispatch({ type: CHECK_AUTH_FAIL })
  }

  const logIn = async (username, password) => {
    dispatch({ type: LOGIN_REQUEST, payload: { username, password } })
    try {
      const { data } = await axios.post(
        'https://social-network-clone-reactnode.herokuapp.com/user/signIn',
        {
          username,
          password,
        }
      )
      dispatch({ type: LOGIN_SUCCESS, payload: data })
      Cookies.set('userInfo', JSON.stringify(data), { expires: 7 })
    } catch (err) {
      dispatch({ type: LOGIN_FAIL, payload: err.message })
      throw err.message
    } finally {
      console.log(authContext)
    }
  }

  const logout = async () => {
    dispatch({ type: LOGOUT_REQUEST })
    try {
      Cookies.remove('userInfo')
      dispatch({ type: LOGOUT_SUCCESS })
    } catch (error) {
      console.error(error)
      throw error.message
    }
  }

  const signUp = async (email, password, username, name) => {
    dispatch({ type: REGISTER_REQUEST, payload: { email, username, password } })
    try {
      const { data } = await axios.post(
        'https://social-network-clone-reactnode.herokuapp.com/user/signUp',
        {
          email,
          username,
          password,
          name,
        }
      )
      dispatch({ type: REGISTER_SUCCESS, payload: data })
      Cookies.set('userInfo', JSON.stringify(data))
    } catch (err) {
      dispatch({ type: REGISTER_FAIL, payload: err.message })
      throw err.message
    }
  }

  return (
    <AuthContext.Provider
      value={{
        authContext,
        logout,
        signUp,
        logIn,
        updateUser,
        changeAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)
