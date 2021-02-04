import React, { useState } from 'react'
import * as firebase from 'firebase'
import { useHistory } from 'react-router-dom'
import { useAuth } from 'contexts/authContext'

const axios = require('axios')

const UploadAvatar = () => {
  const { authContext, changeAvatar } = useAuth()
  const history = useHistory()
  var storageRef = firebase.storage().ref()
  const [error, setError] = useState('')
  const [imageSrc, setImageSrc] = useState('')
  const [image, setImage] = useState()
  const [loading, setLoading] = useState(false)

  const skipHandler = () => {
    history.push('/home')
  }

  const submitHandler = async () => {
    try {
      setError('')
      setLoading(true)
      const fd = new FormData()
      fd.append('image', image, image.name)
      var fileRef = storageRef.child(`Avatar/${image.name}`)
      var upload = await fileRef.put(image)
      var imgUrl = await upload.ref.getDownloadURL()
      await changeAvatar(imgUrl)
      setLoading(false)
      history.push('/home')
    } catch (err) {
      console.log(err.response)
      setError(err.response)
    }
  }

  const selectFileHandler = (e) => {
    setImage(e.target.files[0])
    setImageSrc(URL.createObjectURL(e.target.files[0]))
  }
  return (
    <div className="items-center">
      <h1 className="text-center text-4xl">
        Now let's choose an avatar for your profile!
      </h1>
      <div className="flex flex-col sm:flex-row items-baseline justify-between mb-2 w-full">
        <label
          className="text-white text-lg mb-2 font-bold"
          name="image"
          htmlFor="image"
        >
          Image
        </label>
        <div className="mb-4 w-full sm:w-2/3 ">
          <input
            onChange={selectFileHandler}
            id="image"
            type="file"
            className="w-full py-2 px-3 mb-2"
          ></input>
        </div>
      </div>
      {imageSrc !== '' && (
        <div className="flex justify-center">
          <img src={imageSrc} alt="previewUpload" className="h-64 w-64 mb-10" />
        </div>
      )}
      <div className="flex justify-center">
        <button
          onClick={skipHandler}
          className="p-2 bg-yellow-400 rounded-lg hover:bg-yellow-600"
        >
          Maybe later
        </button>
        {loading && <div className="">UPLOADING</div>}
        {error && <div className="text-red-400">{error}</div>}
        {imageSrc !== '' && (
          <button
            onClick={submitHandler}
            className="ml-4 p-2 bg-green-400 rounded-lg hover:bg-green-600"
          >
            Looks good!
          </button>
        )}
      </div>
    </div>
  )
}

export default UploadAvatar
