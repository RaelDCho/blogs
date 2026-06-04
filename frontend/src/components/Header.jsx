const Header = ({ onClick, user, name }) => {

  return (
    <div>
      {user ? <p>Welcome, {name}!</p> : ''}
      <button onClick={onClick}>{user ? 'logout' : 'login'}</button>
    </div>
  )
}

export default Header