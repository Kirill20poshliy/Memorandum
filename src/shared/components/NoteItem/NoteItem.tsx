import dayjs from 'dayjs'
import type { Timestamp } from 'firebase/firestore'
import { type FC } from 'react'
import { NavLink } from 'react-router-dom'
import "./NoteItem.scss"

const NoteItem: FC<{
    title: string, 
    createdAt: Timestamp, 
    id: string
}> = ({title, createdAt, id}) => {
    return (
        <NavLink to={`/${id}`} className="note-item">
            <p 
                className='title' 
                title={title}
            >
                {title}
            </p>
            <p className='date'>
                {dayjs(createdAt.toDate()).format("DD.MM.YYYY HH:mm")}
            </p>
        </NavLink>
    )
}

export default NoteItem
