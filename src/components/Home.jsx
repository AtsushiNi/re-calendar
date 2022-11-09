import '../css/Home.css'
import { useState } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { Button, Menu, MenuItem } from "@mui/material"
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const auth = getAuth()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = () => {
    signOut(auth)
    navigate("/signin")
  }

  return (
    <div>
      <header>
        <div className="header-inner">
          <a>
            <h1>Re-Calender</h1>
          </a>
          <nav>
            <ul>
              <li>item1</li>
              <li>item2</li>
              <li>item3</li>
              <Button
                aria-controls={open ? 'menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                Account
              </Button>
              <Menu
                open={open}
                onClose={handleClose}
                anchorEl={anchorEl}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
              </Menu>
            </ul>
          </nav>
        </div>
      </header>
      <h1>Home</h1>
    </div>
  )
}

export default Home
