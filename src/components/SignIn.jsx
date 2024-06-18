import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { db } from "../firebase";

function SignIn() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const [user,setUser]=useState(null);
  const fetchUserDetails = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid); // Reference to the user document
      const userDoc = await getDoc(userDocRef); // Fetch the document

      if (userDoc.exists()) {
        setUser(userDoc.data()); // Set user data to state
      } else {
        console.error("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
    setLoading(false);
  };



  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      let loginDetails = await login(
        emailRef.current.value,
        passwordRef.current.value
      );
      console.log("logindetails",loginDetails);
       
      // await fetchUserDetails(loginDetails.user.uid);
      console.log("userDetails",user);
      localStorage.setItem(
        "firebase_token",
        loginDetails._tokenResponse.idToken
      );
      const userId=loginDetails.user.uid;
      const users=JSON.parse(localStorage.getItem("users"));
      const logedInUser=users.find(user=>user.userId===userId);
      if(!logedInUser){
        throw new Error("user not found");
      }
      localStorage.setItem("logedInUser",JSON.stringify(logedInUser));
      console.log("logedInUser",logedInUser)
     navigate("/");
    } catch {
      setError("Failed to sign in");
    }

    setLoading(false);
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            inputRef={emailRef}
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            inputRef={passwordRef}
            required
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>
        </Box>
        <Box mt={2}>
          <Typography variant="body2">
            Need an account? <Link to="/signup">Sign Up</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
