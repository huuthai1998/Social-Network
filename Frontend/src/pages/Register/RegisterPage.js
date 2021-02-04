import React, { useState } from 'react'
import { useAuth } from 'contexts/authContext'
import { Link, useHistory } from 'react-router-dom'

/**
 * Placeholder for Register Page
 */
const RegisterPage = () => {
  const history = useHistory()
  const authContext = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const onChangeHandler = (e) => {
    const { name, value } = e.currentTarget
    if (name === 'email') setEmail(value)
    else if (name === 'password') setPassword(value)
    else if (name === 'username') setUsername(value)
    else if (name === 'confirmation') setConfirmation(value)
    else if (name === 'name') setName(value)
  }

  const signUpHandler = async (e) => {
    try {
      e.preventDefault()
      if (confirmation !== password)
        setError("PASSWORDS AND CONFIRMATION DON'T MATCH")
      else {
        setError('')
        await authContext.signUp(email, password, username, name)
        history.push('/upload_avatar')
      }
    } catch (err) {
      setError(err)
    }
  }

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="flex items-center justify-center sm:h-64 h-32 text-white">
        INSERT LOGO HERE
      </div>
      <main className="container mx-auto max-w-md">
        <div className="bg-gray-800 rounded-t-lg  text-white text-center text-xl py-4">
          Account registration
        </div>
        <form className="bg-gray-700 shadow-md p-8" onSubmit={signUpHandler}>
          <fieldset>
            {error && (
              <div className="p-2 bg-red-700 text-gray-100 text-center text-xl mb-4 rounded">
                {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-4 w-full">
              <label
                className="text-white text-lg text-sm font-bold mr-5 w-1/2"
                htmlFor="name"
              >
                Name
              </label>
              <div className="w-full sm:w-2/3">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="shadow appearance-none outline-none rounded w-full py-2 px-3
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-4 w-full">
              <label
                className="text-white text-lg text-sm font-bold mr-5 w-1/2"
                htmlFor="username"
              >
                Username
              </label>
              <div className="w-full sm:w-2/3">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="shadow appearance-none outline-none rounded w-full py-2 px-3
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-4 w-full">
              <label
                className="text-white text-lg text-sm font-bold mr-5 w-1/2"
                htmlFor="email"
              >
                Email
              </label>
              <div className="w-full sm:w-2/3">
                <input
                  id="email"
                  name="email"
                  required
                  className="shadow appearance-none outline-none rounded w-full py-2 px-3
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
                  onChange={onChangeHandler}
                ></input>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-4 w-full">
              <label
                className="text-white text-lg text-sm font-bold mr-5 w-1/2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="w-full sm:w-2/3">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="shadow appearance-none outline-none rounded w-full py-2 px-3
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-baseline justify-between w-full">
              <label
                htmlFor="confirmation"
                className="text-white text-lg text-sm font-bold mr-5 w-1/2"
              >
                Confirmation
              </label>
              <div className="w-full sm:w-2/3">
                <input
                  id="confirmation"
                  name="confirmation"
                  placeholder="Re-enter your password"
                  type="password"
                  required
                  className="shadow appearance-none outline-none rounded w-full py-2 px-3
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
                  onChange={onChangeHandler}
                ></input>
              </div>
            </div>
            <button
              className="w-full bg-red-400 text-white font-bold py-2 px-4 rounded 
              focus:outline-none focus:shadow-outline hover:bg-red-500 mt-4"
              type="submit"
            >
              Register
            </button>
          </fieldset>
        </form>
        <footer className="bg-gray-800 text-white rounded-b-lg text-center py-4">
          {'Already have an account? '}
          <nobr>
            <Link className="text-blue-400" to={`/login`}>
              Log in
            </Link>
          </nobr>
        </footer>
      </main>
    </div>
  )
}

export default RegisterPage
