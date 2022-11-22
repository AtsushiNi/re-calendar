import { useEffect } from 'react'
import '../css/SignIn.css'
import Button from '@mui/material/Button'
import GoogleIcon from '@mui/icons-material/Google';
import { Auth } from 'aws-amplify'
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

const SignIn = () => {
  const navigate = useNavigate()
  const { currentUser, signIn } = useAuthContext()

  useEffect(() => {
    currentUser && navigate("/")
  }, [currentUser])

  const handleSignin = async (event) => {
    try {
      await signIn()
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div className="background">
      <div className="card">
        <h1>Re-Calendar</h1>
        <Button variant="outlined" startIcon={<GoogleIcon />} onClick={handleSignin}>Sign in with Google</Button>
      </div>
    </div>
  )
}

export default SignIn
