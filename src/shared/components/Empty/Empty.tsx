import { Flex } from 'antd'
import { type FC } from 'react'
import "./Empty.scss"

const Empty: FC = () => {
    return (
        <Flex 
            vertical 
            justify='center' 
            align='center'
            className='empty'
        >
            <h2>Заметка не выбрана</h2>
        </Flex>
    )
}

export default Empty
