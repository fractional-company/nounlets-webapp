import classes from './Modal.module.css'
import ReactDOM from 'react-dom'
import xIcon from '../../assets/x-icon.png'
import React from 'react'
import Image from 'next/image'

export const Backdrop: React.FC<{ onDismiss: () => void }> = (props) => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />
}

const ModalOverlay: React.FC<{
  title?: string
  content?: React.ReactNode
  onDismiss: () => void
}> = (props) => {
  const { title, content, onDismiss } = props
  return (
    <div className={classes.modal}>
      <button className={classes.closeButton} onClick={onDismiss}>
        <Image src={xIcon.src} alt="Button to close modal" />
      </button>
      <h3>{title}</h3>
      <div className={classes.content}>{content}</div>
    </div>
  )
}

const Modal: React.FC<{
  title?: string
  content?: React.ReactNode
  onDismiss: () => void
}> = (props) => {
  const { title, content, onDismiss } = props
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!
      )}
      {ReactDOM.createPortal(
        <ModalOverlay title={title} content={content} onDismiss={onDismiss} />,
        document.getElementById('overlay-root')!
      )}

      {/* <StyledApp>{emojiMarkup}</StyledApp>
        {emojiBubbleMarkup} */}
    </>
  )
}

export default Modal

// function timeout(delay: number) {
//   return new Promise( res => setTimeout(res, delay) );
// }
