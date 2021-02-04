import NavBar from 'components/NavBar/NavBar'
import React from 'react'
import { AuthProvider } from 'contexts/authContext'
import RoutingSwitch from 'routing/RoutingSwitch'
import { BrowserRouter } from 'react-router-dom'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <RoutingSwitch />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
