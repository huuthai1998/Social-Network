import React, { useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './NavBar.css'
import { useAuth } from 'contexts/authContext'

const Avatar = ({ authContext }) =>
  useMemo(() => {
    console.log(authContext)
    if (authContext.user) {
      return (
        <img
          src={authContext.user.avatar}
          alt=""
          className="rounded-full bg-gray-300 h-16 w-16 flex items-center justify-center"
        />
      )
      var img = new Image()
      img.src = authContext.user.avatar
      img.className =
        'rounded-full bg-gray-300 h-16 w-16 flex items-center justify-center'
      console.log(img)
      return img
    } else {
      return <div className=""></div>
    }
  }, [authContext.user])

const NavBar = () => {
  const { authContext, logout } = useAuth()
  const [dropdown, setDropdown] = useState(false)

  const history = useHistory()

  const dropdownHandler = () => {
    setDropdown(!dropdown)
  }
  const handleLogOut = (e) => {
    e.preventDefault()
    dropdownHandler()
    logout()
  }

  const DropdownMenu = useMemo(() => {
    return (
      <div className="bg-blue-700 absolute p-2 rounded-md dropdown-menu shadow-xl">
        <Link
          onClick={dropdownHandler}
          to={`/profile/${authContext.user && authContext.user._id}`}
          className="relative flex p-1 items-center hover:bg-gray-600 rounded-md z-20 items-center"
        >
          <div className="rounded-full bg-gray-300 h-16 w-16 flex items-center justify-center">
            <Avatar authContext={authContext} />
          </div>
          <div className="">
            <h1 className="text-white ml-2 text-md font-bold">
              {authContext.user && authContext.user.name}
            </h1>
            <nobr className="text-gray-500 ml-2 text-md"> Your profile</nobr>
          </div>
        </Link>
        <hr className="my-2 border-blue-400" />
        <Link
          to={'/setting'}
          className="relative flex p-1 items-center hover:bg-gray-600 rounded-md z-20 cursor-pointer"
        >
          <div className="rounded-full bg-gray-300 h-8 w-8 flex items-center justify-center">
            <i className="fas fa-user-cog" aria-hidden="true"></i>
          </div>
          <nobr className="text-white ml-2 text-md">Account Setting</nobr>
        </Link>
        <div
          onClick={handleLogOut}
          className="relative flex p-1 items-center hover:bg-gray-600 rounded-md z-20 cursor-pointer"
        >
          <div className="rounded-full bg-gray-300 h-8 w-8 flex items-center justify-center">
            <i className="fa fa-sign-out" aria-hidden="true"></i>
          </div>
          <nobr className="text-white ml-2 text-md">Log out</nobr>
        </div>
      </div>
    )
  }, [authContext.user])

  return (
    <header className="sticky top-0 bg-blue-600 z-10">
      <div className="container sm:items-center">
        <div className="flex items-center p-2 justify-around">
          <Link className="text-center" to="/">
            <h1 className="text-white text-xl">Social Network</h1>
          </Link>
          {authContext.authenticated ? (
            <div className="relative ml-5">
              {dropdown && DropdownMenu}
              <button
                className="bg-gray-400 outline-none focus:outline-none focus:text-red-500 rounded-full h-8 w-8 flex items-center justify-center cursor-pointer hover:bg-gray-500 dropdown-button"
                onClick={dropdownHandler}
              >
                <i className="fas fa-caret-down"></i>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-5 w-24 flex text-white flex cart-wrapper h-8 items-baseline"
            >
              <i className="fa fa-user fa-2x mr-2" aria-hidden="true"></i>
              Login
            </Link>
          )}
          {dropdown && (
            <div
              onClick={dropdownHandler}
              className="h-screen w-screen top-0 left-0 blank-dropdown"
            ></div>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar
