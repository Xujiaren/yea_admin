import './style.scss'
import React from 'react'
import PlayerModal from '../../../components/business/PlayerModal'
import { ContentUtils } from 'braft-utils'

export default class Audio extends React.Component {


  componentDidMount(){
    console.log(this.props)
  }
  onClick = ()=>{
    this.props.onAudioClick(this.props)
  }
  render () {

    const { mediaData, language } = this.props
    const { url, name, meta } = mediaData
    console.log(mediaData)
    return (
      <div className='bf-audio-wrap' style={{position:'relative'}}>

        <PlayerModal type="audio" onRemove={this.removeAudio} poster={meta ? meta.poster || '' : ''} language={language} url={url} name={name} title={language.audioPlayer.title}>
            <div className="bf-audio-player"><audio controls src={url} data-name={name}/></div>
        </PlayerModal>
        <div onClick={this.onClick} style={{position:'absolute',bottom:'10px',color:'#fff',width:'100%',textAlign:'center'}} className='poster-setting'>设置封面</div>
      </div>
    )

  }

  removeAudio = () => {
      this.props.editor.setValue(ContentUtils.removeBlock(this.props.editorState, this.props.block))
  }

}