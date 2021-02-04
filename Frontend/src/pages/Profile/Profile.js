import Post from 'components/Post/Post'
import { useAuth } from 'contexts/authContext'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as firebase from 'firebase'
import './Profile.css'
const axios = require('axios')

const Profile = (props) => {
  const id = props.match.params.id
  var storageRef = firebase.storage().ref()
  const { authContext } = useAuth()
  const [user, setUser] = useState()
  const [posts, setPosts] = useState([])
  const [avatarHover, setAvatarHover] = useState(false)
  const [postsContent, setPostsContent] = useState({})
  const [error, setError] = useState('')

  const avatarHoverOn = () => {
    setAvatarHover(true)
  }

  const avatarHoverOff = () => {
    setAvatarHover(false)
  }

  useEffect(() => {
    axios
      .get(
        `https://social-network-clone-reactnode.herokuapp.com/user/profile/${id}`
      )
      .then(({ data }) => {
        setUser(data)
        axios
          .get(
            `https://social-network-clone-reactnode.herokuapp.com/posts/user/${id}`,
            {
              params: { user: authContext.user._id },
            }
          )
          .then((post) => setPosts(post.data.reverse()))
      })
  }, [props.match.params.id])

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
          setError('')
          setPostsContent({
            ...postsContent,
            [id]: { content: data.content, imgSrc: '', image: undefined },
          })
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
        [id]: { ...postsContent[id], comment: '' },
      })
    } catch (err) {
      console.log(err)
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
    <div>
      {user && (
        <div className="">
          <div className="flex items-center text-center justify-center">
            <img
              onMouseEnter={avatarHoverOn}
              onMouseLeave={avatarHoverOff}
              src={user.avatar}
              alt=""
              className="rounded-full bg-gray-300 h-40 w-40 flex items-center justify-center"
            />
            {authContext.user &&
              user._id === authContext.user._id &&
              avatarHover && (
                <Link
                  onMouseEnter={avatarHoverOn}
                  onMouseLeave={avatarHoverOff}
                  to={'/upload_avatar'}
                  className="opacity-75 absolute mx-auto inline-flex bg-red-600 avatar-change p-2 h-20 w-40"
                >
                  Choose a new avatar
                </Link>
              )}
          </div>
          <h1 className="text-4xl text-center"> {user.name}</h1>
        </div>
      )}
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

export default Profile
