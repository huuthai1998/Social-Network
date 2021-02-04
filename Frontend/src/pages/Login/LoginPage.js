import React, { useState } from 'react'
import { useAuth } from 'contexts/authContext'
import { Link } from 'react-router-dom'

/**
 * Placeholder for Login Page
 */
const LoginPage = () => {
  const authContext = useAuth()
  const [email, setEmail] = useState('This username does not exist')
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')

  const onChangeHandler = (e) => {
    const { name, value } = e.currentTarget
    if (name === 'email') setEmail(value)
    else if (name === 'password') setPassword(value)
  }

  const loginHandler = async (e) => {
    try {
      e.preventDefault()
      await authContext.logIn(email, password)
    } catch (err) {
      console.error(err)
      setError(err)
    }
  }

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="flex items-center justify-center sm:h-64 h-32 text-white">
        Welcome To The Best Social Network
      </div>
      <main className="container mx-auto max-w-md">
        <div className="bg-gray-800 rounded-t-lg  text-white text-center text-xl py-4">
          Account log in
        </div>
        <form className="bg-gray-700 shadow-md p-8" onSubmit={loginHandler}>
          <fieldset>
            {error && (
              <div className="p-2 bg-red-700 text-gray-100 text-center text-xl mb-4 rounded">
                {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-2 w-full">
              <label
                className="text-white text-lg font-bold"
                htmlFor="username"
              >
                Username
              </label>
              <div className="mb-4 w-full sm:w-2/3">
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  className="shadow appearance-none outline-none rounded w-full py-2 px-3 mb-2
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
                  onChange={onChangeHandler}
                />
                <p className="text-gray-500 text-sm text-right">
                  Enter your username or email address.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-2 w-full">
              <label
                className="text-white text-lg mb-2 font-bold"
                name="password"
                htmlFor="password"
              >
                Password
              </label>
              <div className="mb-4 w-full sm:w-2/3">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="shadow appearance-none outline-none rounded w-full py-2 px-3 mb-2
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
                  onChange={onChangeHandler}
                />
                <p className="text-gray-500 text-sm text-right">
                  <a href="#" className="text-blue-400 font-bold">
                    Forgot your password?
                  </a>
                </p>
              </div>
            </div>
            <button
              className="w-full bg-red-400 text-white font-bold py-2 px-4 rounded 
              focus:outline-none focus:shadow-outline hover:bg-red-500"
              type="submit"
            >
              Go!
            </button>
          </fieldset>
        </form>
        <footer className="bg-gray-800 text-white rounded-b-lg text-center py-4">
          {'Need a new account? '}
          <nobr>
            <Link className="text-blue-400 font-bold" to="/register">
              Register an account
            </Link>
          </nobr>
        </footer>
      </main>
    </div>
  )
}

export default LoginPage
