import './style.scss'
import React from 'react'
import PlayerModal from '../../../components/business/PlayerModal'
import { ContentUtils } from 'braft-utils'

export default class Video extends React.Component {

  onClick = ()=>{
    this.props.onAudioClick(this.props)
  }
  render () {

    const { mediaData, language } = this.props
    const { url, name, meta } = mediaData

    return (
      <div className='bf-video-wrap' style={{position:'relative'}}>
        <PlayerModal type="video" onRemove={this.removeVideo} poster={meta ? meta.poster || '' : ''} language={language} url={url} name={name} title={language.videoPlayer.title}>
          <div className="bf-video-player">
            <video controls poster={meta ? meta.poster || '' : ''}>
              <source src={url} />
            </video>
          </div>
        </PlayerModal>
        <div onClick={this.onClick} style={{position:'absolute',bottom:'10px',color:'#fff',width:'100%',textAlign:'center'}} className='poster-setting'>设置封面</div>
      </div>
    )

  }

  removeVideo = () => {
    this.props.editor.setValue(ContentUtils.removeBlock(this.props.editorState, this.props.block))
  }

}