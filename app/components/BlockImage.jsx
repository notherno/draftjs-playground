import React from 'react'

export default class BlockImage extends React.Component {
  render () {
    const { block, contentState } = this.props
    const entity = contentState.getEntity(block.getEntityAt(0))
    const { size } = this.props.blockProps

    const { src } = entity.getData()
    return (
      <img
        src={src}
        data-size={size}
        style={{maxWidth: '100%', height: 'auto'}}
      />
    )
  }
}
