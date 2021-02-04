import React, { useState, useEffect } from 'react'
import { useAuth } from 'contexts/authContext'
import Cookies from 'js-cookie'

const axios = require('axios')

const SettingUserInfo = (props) => {
  const { authContext, updateUser } = useAuth()
  const [name, setName] = useState('')
  const [username, setUsername] = useState(
    authContext.user && authContext.user.username
  )
  const [email, setEmail] = useState(authContext.user && authContext.user.email)

  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await axios.put(
        `https://social-network-clone-reactnode.herokuapp.com/user/${authContext.user._id}`,
        {
          name,
          username,
          password,
          email,
        },
        {
          headers: {
            Authorization: 'Bearer ' + authContext.user.token,
          },
        }
      )
      Cookies.set('userInfo', {
        _id: authContext.user._id,
        name,
        username,
        email,
        isAdmin: authContext.user.isAdmin,
        token: authContext.user.token,
        avatar: authContext.user.avatar,
      })
      updateUser()
      setError('')
    } catch (err) {
      console.log(err.response)
      setError(err.response.data.message)
    }
  }

  const onChangeHandler = (e) => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value)
        break
      case 'email':
        setEmail(e.target.value)
        break
      case 'username':
        setUsername(e.target.value)
        break
      case 'password':
        setPassword(e.target.value)
        break
    }
  }

  useEffect(() => {
    if (authContext.user !== null) {
      setName(authContext.user.name)
      setUsername(authContext.user.username)
      setEmail(authContext.user.email)
    }
  }, [authContext])

  return (
    <form onSubmit={submitHandler} className="bg-gray-700 shadow-md w-2/3 p-8">
      <fieldset>
        {error && (
          <div className="p-2 bg-red-700 text-gray-100 text-center text-xl mb-4 rounded">
            {error}
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-2 w-full">
          <label className="text-gray-200 text-lg font-bold" htmlFor="name">
            Name
          </label>
          <div className="mb-2 w-full sm:w-2/3">
            <input
              name="name"
              type="text"
              defaultValue={name}
              onChange={onChangeHandler}
              required
              className="shadow appearance-none outline-none rounded w-full py-2 px-3 mb-2
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-2 w-full">
          <label className="text-gray-200 text-lg font-bold" htmlFor="username">
            Username
          </label>
          <div className="mb-2 w-full sm:w-2/3">
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={username}
              onChange={onChangeHandler}
              required
              className="shadow appearance-none outline-none rounded w-full py-2 px-3 mb-2
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-2 w-full">
          <label className="text-gray-200 text-lg font-bold" htmlFor="email">
            Email
          </label>
          <div className="mb-2 w-full sm:w-2/3">
            <input
              id="email"
              name="email"
              type="text"
              defaultValue={email}
              onChange={onChangeHandler}
              required
              className="shadow appearance-none outline-none rounded w-full py-2 px-3 mb-2
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-2 w-full">
          <label
            className="text-gray-200 text-lg mb-2 font-bold"
            name="password"
            htmlFor="password"
          >
            Password
          </label>
          <div className="mb-2 w-full sm:w-2/3">
            <input
              id="password"
              name="password"
              onChange={onChangeHandler}
              type="password"
              required
              placeholder="Enter your password for confirmation"
              className="shadow appearance-none outline-none rounded w-full py-2 px-3 mb-2
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
            />
          </div>
        </div>
        <button
          className="w-full bg-red-400 text-gray-200 font-bold py-2 px-4 rounded 
              focus:outline-none focus:shadow-outline hover:bg-red-500"
          type="submit"
        >
          Save
        </button>
      </fieldset>
    </form>
  )
}

export default SettingUserInfo
