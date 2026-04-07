import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { registerUser } from "../api/endpoints";
import useAuth from "../hooks/useAuth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await registerUser(email, username, password);
      login(data.user, data.token);
      navigate("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh", px: 2 }}>
      <Card sx={{ maxWidth: 420, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <SportsSoccerIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
            <Typography variant="h5" fontWeight={800}>Create Account</Typography>
            <Typography variant="body2" color="text.secondary">Join the fantasy football community</Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required inputProps={{ minLength: 3, maxLength: 30 }} sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required inputProps={{ minLength: 6 }} sx={{ mb: 3 }} />
            <Button fullWidth variant="contained" type="submit" disabled={loading} size="large">
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login" style={{ color: "#4A90D9", textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
