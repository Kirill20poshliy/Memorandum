import userStore from '@shared/stores/userStore'
import { observer } from 'mobx-react-lite'
import { type FC } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const RequireAuth: FC = observer(() => {
    const isAuth = userStore.isAuthenticated
    return isAuth 
        ? <Outlet />
        : <Navigate to={"sign-in"}/>
})

export default RequireAuth
