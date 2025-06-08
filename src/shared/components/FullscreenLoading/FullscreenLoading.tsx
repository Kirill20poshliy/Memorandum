import { Flex, Spin } from 'antd'
import { type FC } from 'react'
import "./FullscreenLoading.scss"

const FullscreenLoading: FC = () => {
    return (
        <Flex 
            className='fullscreen-page loading' 
            justify='center' 
            align='center'
        >
            <Spin size="large" />
        </Flex>
    )
}

export default FullscreenLoading
