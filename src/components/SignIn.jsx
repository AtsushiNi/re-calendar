import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup } from 'firebase/auth'
import { provider } from '../context/AuthContext'

const SignIn = () => {
  const navigate = useNavigate()
  const auth = getAuth()

  const handleSignin = async (event) => {
    try {
      await signInWithPopup(auth, provider)
      navigate("/")
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1>SignIn</h1>
      <Button variant="outlined" onClick={handleSignin}>SignIn</Button>
    </div>
  )
}

export default SignIn
