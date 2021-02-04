import React from 'react'
import { Link } from 'react-router-dom'

const Error = () => {
  return (
    <div>
      <Link to="/" className="text-blue-400">
        Return to Home page
      </Link>
      <h1 className="text-4xl"> ERROR Page</h1>
    </div>
  )
}

export default Error
