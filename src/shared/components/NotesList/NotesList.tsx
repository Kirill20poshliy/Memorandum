import notesStore from '@shared/stores/notesStore'
import { Flex } from 'antd'
import { observer } from 'mobx-react-lite'
import { type FC } from 'react'
import NoteItem from '../NoteItem/NoteItem'
import filterStore from '@shared/stores/filterStore'

export const NotesList: FC = observer(() => {

    return (
        <Flex vertical gap={".5rem"}>
            {notesStore.getUserNotes
                .slice()
                .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
                .filter(item => filterStore.searchHandler(item))
                .map(note => (
                    <NoteItem 
                        key={note.id} 
                        title={note.title} 
                        createdAt={note.createdAt} 
                        id={note.id} 
                    />
                ))
            }
        </Flex>
    )
})
