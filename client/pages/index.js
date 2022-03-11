// React
import { useState, useEffect } from 'react';

// Next
import Router from 'next/router';

// Material UI
// Components
import { Link } from "@mui/material";

// Custom
// Services
import { getCurrentUser, signout } from "../services/auth";


const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        setCurrentUser(await getCurrentUser())
      } catch (error) {
        setHasError(true);
      }
      setIsLoading(false);
    };
    fetchCurrentUser();
  }, [setCurrentUser]);

  return (
    <>
      {hasError && <p>Something went wrong.</p>}
      {isLoading ? (
        <p>Loading ...</p>
      ) : (currentUser ? (
        <>
          <div>Hello {currentUser.firstname} {currentUser.lastname}</div>
          <Link href="#" variant="body2" onClick={() => signout({
            onSuccess: () => Router.reload()
          })}>
            Sign out
          </Link>
        </>
      ) : (
        <>
          <Link href="/signup" variant="body2">
            Sign up
          </Link>
          <br></br>
          <Link href="/signin" variant="body2">
            Sign in
          </Link>
        </>
      )
      )}
    </>
  )
}

export default Home;