import { useEffect, type FC } from 'react'
import { observer } from 'mobx-react-lite';
import userStore from '@shared/stores/userStore';
import { Button, Flex } from 'antd';
import { FcGoogle } from 'react-icons/fc';
import logo from '@shared/assets/img/logo.svg'
import { useNavigate } from 'react-router-dom';
import FullscreenLoading from '@shared/components/FullscreenLoading/FullscreenLoading';

const Login: FC = observer(() => {
    const navigate = useNavigate()

    useEffect(() => {
        if (userStore.isAuthenticated) {
            navigate('/')
        }
    }, [userStore.isAuthenticated])

    return userStore.isLoading ? (
        <FullscreenLoading />
    ) : (
        <Flex 
            vertical 
            align='center' 
            justify='center' 
            className='fullscreen-page'
            style={{backgroundColor: "#383838"}}
            gap={64}
        >
            <img src={logo} alt="logo" style={{width: '100px'}} />
            <Button 
                type='primary' 
                style={{padding: "24px"}}
                disabled={userStore.isLoading}
                onClick={
                    () => userStore.signInWithGoogle()
                }
            >
                <Flex gap={12}>
                    <FcGoogle size={24}/>
                    <p style={{
                        fontSize: "1.25rem", 
                        fontWeight: 500
                    }}>
                        Sign in with Google
                    </p>
                </Flex>
            </Button>
        </Flex>
    )
})

export default Login
