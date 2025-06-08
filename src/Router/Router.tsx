import { lazy, type FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import RequireAuth from '../Layouts/RequireAuth/RequireAuth'
import MainLayout from '../Layouts/MainLayout/MainLayout'
import Empty from '@shared/components/Empty/Empty'
import NoteEditor from '@shared/components/NoteEditor/NoteEditor'

const NotFound = lazy(() => import('../pages/NotFound/NotFound'))
const Login = lazy(() => import('../pages/Login/Login'))

const Router: FC = () => {
    return (
        <Routes>
            <Route path='/' element={<RequireAuth />}>
                <Route element={<MainLayout />}>
                    <Route index element={<Empty />}/>
                    <Route path=':id' element={<NoteEditor />}/>
                </Route>
            </Route>
            <Route path='sign-in' element={<Login />} />
            <Route path="*" element={<NotFound />}/>
        </Routes>
    )
}

export default Router
