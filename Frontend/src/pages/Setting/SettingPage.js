import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import * as qs from 'qs'
import SettingUserInfo from './SettingUserInfo'
import SettingChangePassword from './SettingChangePassword'

const SettingPage = (props) => {
  const history = useHistory()
  const [tab, setTab] = useState('UserInfo')

  useEffect(() => {
    if (props.location !== undefined)
      setTab(
        qs.parse(props.location.search, {
          ignoreQueryPrefix: true,
        }).tab
      )
  }, [])

  const changeHandler = (mode) => (e) => {
    setTab(mode)
    history.push({ pathname: '/setting', search: `tab=${mode}` })
  }

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="container mx-auto sm:mt-10 flex">
        <div className="text-gray-200 sm:w-1/3 sm:mr-10 my-8 sm:my-0">
          <div
            onClick={changeHandler('UserInfo')}
            className={`cursor-pointer p-4 mb-auto rounded-md flex ${
              tab === 'UserInfo' ? 'bg-blue-400' : ''
            }`}
          >
            <h1 className="font-extrabold text-gray-300"> Account details</h1>
          </div>
          <div
            onClick={changeHandler('ChangePassword')}
            className={`cursor-pointer p-4 mb-auto rounded-md flex ${
              tab === 'ChangePassword' ? 'bg-blue-400' : ''
            }`}
          >
            <h1 className="font-extrabold text-gray-300"> Change Password</h1>
          </div>
        </div>
        {tab === 'ChangePassword' ? (
          <SettingChangePassword />
        ) : (
          <SettingUserInfo />
        )}
      </div>
    </div>
  )
}

export default SettingPage
