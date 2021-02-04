import { useAuth } from 'contexts/authContext'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './Post.css'
const axios = require('axios')

const Post = ({
  imageSrc,
  selectFilePosts,
  canEdit,
  id,
  postContent,
  item,
  onCommentSubmit,
  onCommentChange,
  value,
  onLike,
  avatar,
  updatePost,
  onPostChange,
}) => {
  const create = new Date(item.createdAt)
  const date = create.getDate()
  const month = create.getMonth() + 1
  const year = create.getFullYear()
  const hour = create.getHours()
  const minute = create.getMinutes()
  const [dropdown, setDropdown] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState('')
  const uploadImgRef = useRef(null)

  const handleUploadImg = () => {
    uploadImgRef.current.click()
  }

  const enablePosting = () => {
    setDropdown(false)
    setIsPosting(true)
  }
  const disablePosting = () => {
    setIsPosting(false)
  }

  const cancelPost = () => {
    disablePosting()
    setError('')
  }

  const handleUpdatePost = () => {
    updatePost()
    disablePosting()
    setError('')
  }
  const dropdownHandler = () => {
    setDropdown(!dropdown)
  }

  const likers = () => {
    var l = ''
    for (var i = 0; i < 4; ++i) {
      if (i >= item.likers.length) break
      if (i === 0) l += item.likers[i].userName
      else l += `, ${item.likers[i].userName}`
    }
    return l
  }

  return (
    <div className="bg-gray-200 flex-grow rounded-lg p-2 my-4" key={id}>
      <div className="flex justify-between">
        <div className="flex">
          <Link to={`/profile/${item.user}`} className="">
            <img
              src={item.authorAvatar}
              alt="author avatar"
              className="rounded-full bg-gray-300 h-16 w-16 flex items-center justify-center"
            />
          </Link>
          <div className="ml-4">
            <Link to={`/profile/${item.user}`} className="">
              <h1 className="font-bold text-blue-400">{item.author}</h1>
            </Link>
            <p className="">
              {month}/{date}/{year} {hour < 10 ? `0${hour}` : hour}:
              {minute < 10 ? `0${minute}` : minute}
            </p>
          </div>
        </div>
        {canEdit && (
          <span className="flex flex-col mr-5 text-xl text-gray-700 text-bold">
            <span className="rounded-full flex justify-end items-center">
              <button
                onClick={dropdownHandler}
                className="cursor-pointer rounded-full hover:bg-gray-400 p-1 focus:bg-gray-400 focus:outline-none"
              >
                &bull;&bull;&bull;
              </button>
            </span>
            {dropdown && (
              <div className="relative">
                <div className="absolute w-32 text-sm bg-gray-400 p-2 rounded-md post-dropdown shadow-xl">
                  <div
                    onClick={enablePosting}
                    className="cursor-pointer relative flex p-2 items-center hover:bg-gray-500 rounded-md z-20 items-center"
                  >
                    <div className="">
                      <nobr> Edit Post</nobr>
                    </div>
                  </div>
                  <hr className="my-2 border-gray-500" />
                  <div
                    onClick={dropdownHandler}
                    className="cursor-pointer relative flex p-2 items-center hover:bg-gray-500 rounded-md z-20 items-center"
                  >
                    <div className="">
                      <nobr>Delete Post</nobr>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </span>
        )}
        {dropdown && (
          <div
            onClick={dropdownHandler}
            className="h-screen w-screen top-0 left-0 blank-dropdown"
          ></div>
        )}
      </div>
      <div className="border-b border-gray-500">
        {!isPosting ? (
          <h1 className="mt-2 text-md ">{item.content}</h1>
        ) : (
          <div className="mb-4">
            <textarea
              value={postContent}
              name={item._id}
              onChange={onPostChange}
              type="text"
              className="focus:outline-none focus:shadow-outline w-full mt-4 rounded-full pl-5 p-1 px-2 bg-gray-300 placeholder-gray-800 placeholder-opacity-100 text-gray-800"
            />
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Upload Image"
                className="w-32 h-32 my-2 pl-5"
              />
            )}
            <div className="flex justify-end mt-2">
              <button
                className="bg-blue-500 p-2 mr-4 rounded-sm"
                onClick={handleUploadImg}
              >
                <i className="far fa-images fa-2x"></i>
              </button>
              <input
                onChange={selectFilePosts}
                name={item._id}
                id="image"
                type="file"
                ref={uploadImgRef}
                style={{ display: 'none' }}
                className="bg-blue-500 p-2 mr-4 rounded-sm"
              />
              <button
                onClick={cancelPost}
                className="bg-red-500 p-2 mr-4 rounded-sm"
              >
                <i className="fas fa-times fa-2x text-white"></i>
              </button>
              <button
                onClick={handleUpdatePost}
                className="bg-green-500 p-2 rounded-sm mr-4"
              >
                <i className="far fa-check-square fa-2x text-white"></i>
              </button>
            </div>
          </div>
        )}
        {item.image && (
          <img src={item.image} alt="picture" className="w-64 h-64 mt-5" />
        )}
      </div>

      {item.likes > 0 && (
        <div className="border-b border-gray-500 py-2">
          <i className="fas fa-thumbs-up mr-2"></i>
          <span className="">{item.likes}</span>
          {item.likes < 3 ? (
            <span className="ml-3">{likers()} like this</span>
          ) : (
            <span className="ml-3">
              {likers()} and {item.likes - 3} people like this
            </span>
          )}
        </div>
      )}
      <div className="text-blue-400 border-b border-gray-500 w-full">
        {item.like ? (
          <i
            className="ml-5 fa fa-thumbs-up fa-2x py-2 cursor-pointer"
            onClick={onLike}
          ></i>
        ) : (
          <i
            className="ml-5 fa mt-2 fa-thumbs-o-up fa-2x pb-2"
            onClick={onLike}
          ></i>
        )}
      </div>
      {item.comments.map((i, keyComment) => {
        return (
          <div className="pl-8 mt-2 pt-2" key={keyComment}>
            <div className="flex">
              <Link to={`/profile/${i.user}`} className="">
                <img
                  src={i.authorAvatar}
                  alt="commentator's avatar"
                  className="rounded-full bg-gray-300 h-12 w-12 flex items-center justify-center"
                />
              </Link>
              <span className="ml-4 p-2 rounded-lg bg-gray-400 ">
                <Link to={`/profile/${i.user}`} className="">
                  <h1 className="font-bold text-blue-400">{i.author}</h1>
                </Link>
                <span className="">{i.content}</span>
              </span>
            </div>
          </div>
        )
      })}
      <div className="flex mt-4 border-gray-500 py-2">
        <img
          src={avatar}
          alt=""
          className="rounded-full bg-gray-300 h-12 w-12 flex items-center justify-center"
        />
        <form action="" className="flex flex-grow" onSubmit={onCommentSubmit}>
          <input
            name={item._id}
            value={value}
            onChange={onCommentChange}
            type="text"
            placeholder="Write a comment"
            className="h-12 resize-none focus:outline-none focus:shadow-outline flex-grow rounded-full ml-5 p-1 px-2 bg-gray-300 placeholder-gray-800 placeholder-opacity-100 text-gray-800"
          />
        </form>
      </div>
    </div>
  )
}

export default Post
