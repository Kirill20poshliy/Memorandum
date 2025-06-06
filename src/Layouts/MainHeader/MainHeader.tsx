import { type FC } from 'react'
import "./MainHeader.scss"
import { Button, Flex } from 'antd'
import { FiLogOut } from 'react-icons/fi'
import userStore from '@shared/stores/userStore'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import logo from "@shared/assets/img/logo.svg"

const MainHeader: FC = observer(() => {
    const navigate = useNavigate()

    return (
        <header className='main-header'>
            <Flex gap={".75rem"} align='center'>
                <img src={logo} alt="logo" style={{width: 32, height: 32}}/>
                <h2>Memorandum</h2>
            </Flex>
            <Button onClick={() => {
                userStore.logout().then(() => {
                    navigate('sign-in')
                })
            }}>
                <Flex gap={".75rem"}  align='center'>
                    <p>Выйти</p>
                    <FiLogOut />
                </Flex>
            </Button>
        </header>
    )
})

export default MainHeader
