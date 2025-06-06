import { Button, Flex } from "antd"
import { observer } from "mobx-react-lite"
import "./MenuBar.scss"
import type { FC } from "react"
import type { Editor } from "@tiptap/react"
import { FiBold, FiItalic, FiList } from "react-icons/fi"

const MenuBar: FC<{editor: Editor | null}> = observer(({ editor }) => {
    
    if (!editor) return null

    const size = 20

    return (
        <Flex gap=".5rem" className="menu-bar">
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'active' : ''}
                type="text"
            >
                <FiBold size={size} />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'active' : ''}
                type="text"
            >
                <FiItalic size={size}/>
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'active' : ''}
                type="text"
            >
                <FiList size={size}/>
            </Button>
        </Flex>
    )
})

export default MenuBar