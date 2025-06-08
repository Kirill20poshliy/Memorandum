import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import notesStore from '@shared/stores/notesStore'
import { Button, Flex, Input, Popconfirm, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, type FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "./NoteEditor.scss"
import { FiSave, FiTrash2 } from 'react-icons/fi'
import MenuBar from '../MenuBar/MenuBar'

const NoteEditor: FC = observer(() => {
    const { id } = useParams()
    const navigate = useNavigate()

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
        ],
        content: notesStore.currentNote?.text || '',
        onUpdate: ({ editor }) => {
            notesStore.changeText(editor.getHTML())
        },
    })

    useEffect(() => {
        if (id) {
            notesStore.fetchNoteById(id).then(value => {
                if (editor && value) {
                    editor.commands.setContent(value.text)
                }
            })
        } else if (editor) {
            editor.commands.clearContent()
        }
    }, [id, editor])

    useEffect(() => {
        let timer = undefined
        if (id) {
            timer = setTimeout(() => {
                notesStore.updateNote(id)
            }, 5000)
        }

        return () => {
            if (timer) {
                clearTimeout(timer)
            }
        }
    }, [
        notesStore.currentNote?.text, 
        notesStore.currentNote?.title
    ])

    return notesStore.isItemLoading ? (
        <Flex 
            style={{width: "100%", height: "100%"}} 
            justify='center' 
            align='center'
        >
            <Spin />
        </Flex>
    ) : (
        <Flex 
            vertical 
            className='note-editor'
            gap={".5rem"}
        >
            <Flex gap={".5rem"}>
                <Input 
                    className='title'
                    value={notesStore.currentNote?.title}
                    onChange={(e) => notesStore.changeTitle(e.target.value)}
                />
                <Flex gap={".25rem"}>
                    <Button onClick={() => {
                        if (id) {
                            notesStore.updateNote(id)
                        }
                    }}>
                        <FiSave size={16} />
                    </Button>
                    <Popconfirm 
                        title={"Удалить замекту"}
                        description={"Вы действительно хотите удалить заметку?"}
                        okText={"Да"}
                        cancelText={"Отмена"}
                        onConfirm={() => {
                            if (id) {
                                notesStore.deleteNote(id).then(() => navigate('/'))
                            }
                        }}
                    >
                        <Button>
                            <FiTrash2 size={16} />
                        </Button>
                    </Popconfirm>
                </Flex>
            </Flex>
            <div className="tiptap-editor">
                <MenuBar editor={editor}/>
                <EditorContent editor={editor} />
            </div>
            {notesStore.isSaving && (
                <Flex 
                    align='center' 
                    gap={".75rem"} 
                    className='saving-baner'
                >
                    <p>Сохранение...</p>
                    <Spin size='small'/>
                </Flex>
            )}
        </Flex>
    )
})

export default NoteEditor
