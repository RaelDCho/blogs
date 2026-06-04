

const Footer = () => {
  const url = 'https://github.com/RaelDCho'

  const footer = {
    position: 'fixed',
    left: 0,
    bottom: 0,
    margin: '1dvh'
  }

  return(
    <div style={footer} className='footer'>
      <em>Blog App, Raphael D. Cho <a href={url}>github.com/RaelDCho</a></em>
    </div>
  )
}

export default Footer