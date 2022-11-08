import { getAuth, signOut } from 'firebase/auth'
import { Button } from "@mui/material"
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const auth = getAuth()

  const handleSignOut = () => {
    signOut(auth)
    navigate("/signin")
  }

  return (
    <div>
      <h1>Home</h1>
      <Button variant="outlined" onClick={handleSignOut}>Sign Out</Button>
    </div>
  )
}

export default Home
