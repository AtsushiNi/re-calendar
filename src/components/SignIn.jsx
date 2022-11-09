import '../css/SignIn.css'
import Button from '@mui/material/Button'
import GoogleIcon from '@mui/icons-material/Google';
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
    <div className="background">
      <div className="card">
        <h1>Re-Calender</h1>
        <Button variant="outlined" startIcon={<GoogleIcon />} onClick={handleSignin}>Sign in with Google</Button>
      </div>
    </div>
  )
}

export default SignIn
