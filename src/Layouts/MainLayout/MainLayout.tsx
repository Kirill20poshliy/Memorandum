import { Button, Flex, Input, Layout, Spin } from 'antd'
import { Content, Footer } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useEffect, type FC } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import './MainLayout.scss'
import { FiPlus } from "react-icons/fi";
import MainHeader from '../MainHeader/MainHeader';
import notesStore from '@shared/stores/notesStore';
import { NotesList } from '@shared/components/NotesList/NotesList';
import userStore from '@shared/stores/userStore';
import { observer } from 'mobx-react-lite';
import filterStore from '@shared/stores/filterStore';
import useDebounce from '@shared/hooks/useDebounce';

const MainLayout: FC = observer(() => {
    const debounce = useDebounce()
    const navigate = useNavigate()

    useEffect(() => {
        if (userStore.isAuthenticated) {
            notesStore.fetchUserNotes()
        }
    }, [userStore.isAuthenticated])

    useEffect(() => {
        filterStore.setSearchString("")
        return () => filterStore.setSearchString("")
    }, [])

    return (
        <Layout className='fullscreen-page'>
            <Sider theme='light'>
                <Input 
                    placeholder='Найти заметку...' 
                    name='search' 
                    onChange={(e) => debounce(() => filterStore.setSearchString(e.target.value))}
                />
                <Button onClick={() => notesStore.createNote().then(value => {
                    if (value) {
                        navigate(`/${value.id}`)
                    }
                })}>
                    <Flex gap={".75rem"} align='center'>
                        <p>Создать</p>
                        <FiPlus size={16}/>
                    </Flex>
                </Button>
                {notesStore.isLoading ? (
                    <Spin size='small'/>
                ) : (
                    <NotesList />
                )}
            </Sider>
            <Layout>
                <MainHeader />
                <Content style={{ margin: '24px 16px 0' }}>
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'end' }}>
                    Memorandum ©2025 Created by KY
                </Footer>
            </Layout>
        </Layout>
    )
})

export default MainLayout
