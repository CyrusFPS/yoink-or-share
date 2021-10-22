import React, { useEffect } from 'react'

const LoginSuccess = () => {
  // Close window after a second
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);

  return (
    <div>
      <h1>Thank you for logging in!</h1>
    </div>
  )
}

export default LoginSuccess