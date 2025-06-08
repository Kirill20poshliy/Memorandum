import { useEffect, useState, type FC } from 'react'
import { Button, Flex } from 'antd'
import { FiArrowLeft } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const NotFound: FC = () => {
    const [timer, setTimer] = useState<number>(10)
    const navigate = useNavigate()

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (timer === 0) {
            navigate(-1);
        }
    }, [timer, navigate]);

    return (
        <Flex 
            vertical
            gap={"3rem"} 
            justify='center' 
            align='center' 
            className='fullscreen-page'
        >
            <Flex vertical gap={".75rem"} align='center'>
                <h1 style={{fontSize: 72}}>404</h1>
                <Flex align='center' gap={".5rem"}>
                    <p>Page not found</p>
                    <FiXCircle size={20}/>
                </Flex>
            </Flex>
            <Flex gap={".75rem"} align='center'>
                <Button onClick={() => navigate(-1)}>
                    <Flex align='center' gap={".75rem"}>
                        <Flex align='center' gap={".25rem"}>
                            <FiArrowLeft />
                            <p>Назад</p>
                        </Flex>
                        <p>{timer}...</p>
                    </Flex>
                </Button>
            </Flex>
        </Flex>
    )
}

export default NotFound
