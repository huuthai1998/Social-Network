import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import routePaths from 'routing/paths'
import config from 'routing/config'
import { useAuth } from 'contexts/authContext'

const RoutingSwitch = () => {
  const { authContext } = useAuth()
  return (
    <Switch>
      {config.map(({ component: Component, ...route }) => {
        return (
          <Route
            key={route.path}
            {...route}
            render={(routeProps) => {
              if (route.authOnly && authContext.isLoading)
                return <div>LOADING</div>
              else if (
                (!route.authOnly && !route.unAuthOnly) ||
                (route.adminOnly &&
                  authContext.user &&
                  authContext.user.isAdmin) ||
                (route.unAuthOnly && !authContext.authenticated) ||
                (route.authOnly && authContext.authenticated)
              )
                return <Component {...routeProps} />
              else if (route.redirect) return <Redirect to={route.redirect} />
              else return <Redirect to={routePaths.ERROR} />
            }}
          />
        )
      })}
      {/* Go to Home if route not found */}
      <Redirect to={routePaths.HOME} />
    </Switch>
  )
}

export default RoutingSwitch
