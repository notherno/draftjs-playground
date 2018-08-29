import React from 'react'
import { Editor, EditorState, RichUtils, convertToRaw, AtomicBlockUtils } from 'draft-js'
import BlockImage from './BlockImage'
import Immutable from 'immutable'

function blockRenderer (contentBlock) {
  const type = contentBlock.getType()

  if (type === 'atomic') {
    return {
      component: BlockImage,
      editable: false,
      props: {
        size: 'large'
      }
    }
  }
}

const blockRenderMap = Immutable.Map({
  'unstyled': {
    element: 'p'
  },
  'atomic': {
    element: 'div'
  }
})

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      imageUrl: ''
    }
    this.onChange = (editorState) => this.setState({ editorState })

    this.onClickBold = () => {
      this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
    }

    this.logContent = () => console.log(convertToRaw(this.state.editorState.getCurrentContent()))

    this.addImage = this.addImage.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
  }

  addImage () {
    const { editorState, imageUrl } = this.state

    const contentState = editorState.getCurrentContent()

    const contentStateWithEntity = contentState.createEntity(
      'image', 'IMMUTABLE', { src: imageUrl }
    )

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

    const newEditorState = EditorState.set(
      editorState, { currentContent: contentStateWithEntity }
    )

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState, entityKey, 'image'
      )
    })
  }

  handleUrlChange (e) {
    this.setState({
      imageUrl: e.target.value
    })
  }

  render() {
    return (
      <div id="content">
        <h1>Draft.js Editor</h1>
        <button type='button' onClick={this.onClickBold}>BOLD</button>
        <button type='button' onClick={this.logContent}>LOG</button>
        <input type='text' value={this.state.url} onChange={this.handleUrlChange}/>
        <button type="button" onClick={this.addImage}>Insert</button>
        <div className="editor">
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            blockRendererFn={blockRenderer}
            blockRendererMap={blockRenderMap}
          />
        </div>
      </div>
    )
  }
}
