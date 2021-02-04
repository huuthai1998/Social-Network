import { useAuth } from 'contexts/authContext'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as firebase from 'firebase'
import './Home.css'
import Post from 'components/Post/Post'
import { set } from 'js-cookie'
const axios = require('axios')

const Home = () => {
  const { authContext } = useAuth()
  var storageRef = firebase.storage().ref()
  const [postContent, setPostContent] = useState('')
  const [posts, setPosts] = useState([])
  const [isPosting, setIsPosting] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const [image, setImage] = useState()
  const [error, setError] = useState('')
  const [postsContent, setPostsContent] = useState({})
  const uploadImgRef = useRef(null)

  useEffect(() => {
    if (authContext.user !== undefined) {
      console.log(authContext.user._id)
      axios
        .get('https://social-network-clone-reactnode.herokuapp.com/posts', {
          params: { user: authContext.user._id },
        })
        .then(({ data }) => {
          setPosts(data.reverse())
        })
    }
  }, [authContext.user])

  const likeHandler = (key) => async (e) => {
    var tempPost = [...posts]
    if (tempPost[key].like) {
      tempPost[key].likers.splice(
        tempPost[key].likers.findIndex(
          (i) => i.userID === authContext.user._id
        ),
        1
      )
      --tempPost[key].likes
    } else {
      tempPost[key].likers.push({
        userID: authContext.user._id,
        userName: authContext.user.name,
      })
      ++tempPost[key].likes
    }
    tempPost[key].like = !tempPost[key].like
    setPosts(tempPost)
    await axios.put(
      `https://social-network-clone-reactnode.herokuapp.com/posts/like/${tempPost[key]._id}`,
      { likes: tempPost[key].likes, likers: tempPost[key].likers },
      {
        headers: {
          Authorization: 'Bearer ' + authContext.user.token,
        },
      }
    )
  }

  const updatePost = (id) => async (e) => {
    if (postsContent[id] !== undefined) {
      if (
        (postsContent[id].content && postsContent[id].content.length > 0) ||
        postsContent[id].imgSrc != undefined
      ) {
        try {
          var postImgUrl
          if (postsContent[id].image !== undefined) {
            const fd = new FormData()
            fd.append(
              'image',
              postsContent[id].image,
              postsContent[id].image.name
            )
            var fileRef = storageRef.child(
              `Posts/${postsContent[id].image.name}`
            )
            var upload = await fileRef.put(postsContent[id].image)
            postImgUrl = await upload.ref.getDownloadURL()
          }
          const postIndex = posts.findIndex((i) => i._id === id)
          const post = {
            content: postsContent[id].content,
            image: postImgUrl,
            like: posts[postIndex].like,
          }
          const { data } = await axios.put(
            `https://social-network-clone-reactnode.herokuapp.com/posts/${id}`,
            {
              post,
            },
            {
              headers: {
                Authorization: 'Bearer ' + authContext.user.token,
              },
            }
          )
          setPosts([
            ...posts.slice(0, postIndex, 1),
            data,
            ...posts.slice(postIndex + 1),
          ])
          disablePosting()
          setPostContent('')
          setError('')
          setImage(undefined)
          setPostsContent({
            ...postsContent,
            [id]: { content: data.content, imgSrc: '', image: undefined },
          })
          setImageSrc('')
        } catch (err) {
          console.log(err)
        }
      } else setError('Please enter something')
    }
  }

  const commentHandler = (id, key) => async (e) => {
    try {
      var comment = {
        content: postsContent[id].comment,
        user: authContext.user._id,
        author: authContext.user.name,
        authorAvatar: authContext.user.avatar,
      }
      e.preventDefault()
      await axios.post(
        `https://social-network-clone-reactnode.herokuapp.com/posts/comments/${id}`,
        {
          comment,
        },
        {
          headers: {
            Authorization: 'Bearer ' + authContext.user.token,
          },
        }
      )
      const postIndex = posts.findIndex((i) => i._id === id)
      setPosts([
        ...posts.slice(0, postIndex, 1),
        { ...posts[key], comments: [...posts[key].comments, comment] },
        ...posts.slice(postIndex + 1),
      ])
      setPostsContent({
        ...postsContent,
        [id]: { ...postContent[id], comment: '' },
      })
    } catch (err) {
      console.log(err)
    }
  }

  const savePost = (postContent, imageSrc, image) => async (e) => {
    if (postContent.length > 0 || imageSrc.length > 0) {
      try {
        var postImgUrl
        if (image !== undefined) {
          const fd = new FormData()
          fd.append('image', image, image.name)
          var fileRef = storageRef.child(`Posts/${image.name}`)
          var upload = await fileRef.put(image)
          postImgUrl = await upload.ref.getDownloadURL()
        }
        const { data } = await axios.post(
          'https://social-network-clone-reactnode.herokuapp.com/posts',
          {
            post: {
              content: postContent,
              image: postImgUrl,
              user: authContext.user._id,
              author: authContext.user.name,
              authorAvatar: authContext.user.avatar,
              like: false,
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + authContext.user.token,
            },
          }
        )
        setPosts([data, ...posts])
        disablePosting()
        setPostContent('')
        setError('')
        setImage(undefined)
        setImageSrc('')
      } catch (err) {
        console.log(err)
      }
    } else setError('Please enter something')
  }

  const handleUploadImg = () => {
    uploadImgRef.current.click()
  }

  const selectFileHandler = (e) => {
    setImage(e.target.files[0])
    setImageSrc(URL.createObjectURL(e.target.files[0]))
  }

  const enablePosting = () => {
    setIsPosting(true)
  }
  const disablePosting = () => {
    setIsPosting(false)
  }

  const cancelPost = () => {
    disablePosting()
    setPostContent('')
    setError('')
    setImage(undefined)
    setImageSrc('')
  }

  const onChangeHandler = (e) => {
    const { name, value } = e.currentTarget
    switch (name) {
      case 'content':
        setPostContent(value)
        break
    }
  }

  const onCommentChange = (e) => {
    const { name, value } = e.currentTarget
    setPostsContent({
      ...postsContent,
      [name]: { ...postsContent[name], comment: value },
    })
  }

  const onPostChange = (e) => {
    const { name, value } = e.currentTarget
    setPostsContent({
      ...postsContent,
      [name]: { ...postsContent[name], content: value },
    })
  }

  const selectFilePosts = (e) => {
    const { name } = e.currentTarget
    setPostsContent({
      ...postsContent,
      [name]: {
        ...postsContent[name],
        image: e.target.files[0],
        imgSrc: URL.createObjectURL(e.target.files[0]),
      },
    })
  }

  return (
    <div className={`min-h-screen p-4 bg-white block`}>
      <div className="flex items-center justify-center">
        {authContext.user && (
          <div className="w-1/2 rounded-lg bg-gray-200 p-4">
            <div className="flex items-center justify-center">
              <Link to={`/profile/${authContext.user._id}`} className="">
                <img
                  src={authContext.user && authContext.user.avatar}
                  alt=""
                  className="rounded-full bg-gray-300 h-16 w-16 flex items-center justify-center"
                />
              </Link>
              <textarea
                value={postContent}
                name="content"
                onChange={onChangeHandler}
                onClick={enablePosting}
                type="text"
                placeholder="Share your thought with others!"
                className="focus:outline-none focus:shadow-outline flex-grow rounded-full ml-5 p-1 px-2 bg-gray-300 placeholder-gray-800 placeholder-opacity-100 text-gray-800"
              />
            </div>
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Upload Image"
                className="w-16 h-16 my-2 ml-20"
              />
            )}
            {error && (
              <h1 className="text-center font-bold text-xl text-red-500">
                {error}
              </h1>
            )}
            {isPosting && (
              <div className="flex justify-end mt-2">
                <button
                  className="bg-blue-500 p-2 mr-4 rounded-sm"
                  onClick={handleUploadImg}
                >
                  <i className="far fa-images fa-2x"></i>
                </button>
                <input
                  onChange={selectFileHandler}
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
                  onClick={savePost(postContent, imageSrc, image)}
                  className="bg-green-500 p-2 rounded-sm mr-4"
                >
                  <i className="far fa-check-square fa-2x text-white"></i>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between items-center mt-10">
        {posts.length > 0 &&
          posts.map((item, key) => {
            return (
              <div key={key} className="w-2/3">
                <Post
                  canEdit={
                    authContext.user && authContext.user._id === item.user
                  }
                  imageSrc={
                    postsContent[item._id] && postsContent[item._id].imgSrc
                  }
                  selectFilePosts={selectFilePosts}
                  updatePost={updatePost(item._id)}
                  onPostChange={onPostChange}
                  id={key}
                  item={item}
                  value={
                    postsContent[item._id] !== undefined
                      ? postsContent[item._id].comment
                      : ''
                  }
                  postContent={
                    postsContent[item._id] !== undefined
                      ? postsContent[item._id].content
                      : item.content
                  }
                  onCommentChange={onCommentChange}
                  onCommentSubmit={commentHandler(item._id, key)}
                  onLike={likeHandler(key)}
                  avatar={authContext.user && authContext.user.avatar}
                />
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Home
