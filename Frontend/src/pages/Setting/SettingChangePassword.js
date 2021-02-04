import React, { useState } from 'react'
import { useAuth } from 'contexts/authContext'

const axios = require('axios')

const SettingChangePassword = (props) => {
  const { authContext } = useAuth()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()
    if (newPassword !== confirm) {
      setError("PASSWORDS AND CONFIRMATION DON'T MATCH")
    } else {
      try {
        setError('')
        await axios.put(
          `https://social-network-clone-reactnode.herokuapp.com/user/${authContext.user._id}`,
          {
            newPassword,
            username: authContext.user.username,
            password: oldPassword,
          },
          {
            headers: {
              Authorization: 'Bearer ' + authContext.user.token,
            },
          }
        )
      } catch (err) {
        console.log(err.response.data.message)
        setError(err.response.data.message)
      }
    }
  }

  const onChangeHandler = (e) => {
    switch (e.target.name) {
      case 'oldPassword':
        setOldPassword(e.target.value)
        break
      case 'newPassword':
        setNewPassword(e.target.value)
        break
      case 'confirmation':
        setConfirm(e.target.value)
        break
    }
  }

  return (
    <form onSubmit={submitHandler} className="bg-gray-700 shadow-md w-2/3 p-8">
      <fieldset>
        {error && (
          <div className="p-2 bg-red-700 text-gray-100 text-center text-xl mb-4 rounded">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-2 w-full">
          <label
            className="text-gray-200 text-lg mb-2 font-bold"
            name="oldPassword"
            htmlFor="oldPassword"
          >
            Old Password
          </label>
          <div className="mb-2 w-full sm:w-2/3">
            <input
              name="oldPassword"
              onChange={onChangeHandler}
              type="password"
              required
              className="shadow appearance-none outline-none rounded w-full py-2 px-3 mb-2
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-2 w-full">
          <label
            className="text-gray-200 text-lg mb-2 font-bold"
            name="newPassword"
            htmlFor="newPassword"
          >
            New Password
          </label>
          <div className="mb-2 w-full sm:w-2/3">
            <input
              name="newPassword"
              onChange={onChangeHandler}
              type="password"
              required
              className="shadow appearance-none outline-none rounded w-full py-2 px-3 mb-2
                  bg-gray-900 text-gray-100 leading-tight focus:shadow-outline"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-2 w-full">
          <label
            className="text-gray-200 text-lg mb-2 font-bold"
            name="confirmation"
            htmlFor="confirmation"
          >
            Confirmation
          </label>
          <div className="mb-2 w-full sm:w-2/3">
            <input
              id="confirmation"
              name="confirmation"
              onChange={onChangeHandler}
              type="password"
              placeholder="Please re-enter your password"
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

export default SettingChangePassword
