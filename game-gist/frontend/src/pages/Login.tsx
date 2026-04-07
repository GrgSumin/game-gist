import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { loginUser } from "../api/endpoints";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
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
      const { data } = await loginUser(email, password);
      login(data.user, data.token);
      navigate("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Login failed";
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
            <Typography variant="h5" fontWeight={800}>Welcome Back</Typography>
            <Typography variant="body2" color="text.secondary">Sign in to manage your fantasy team</Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 3 }} />
            <Button fullWidth variant="contained" type="submit" disabled={loading} size="large">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
            Don't have an account? <Link to="/register" style={{ color: "#4A90D9", textDecoration: "none", fontWeight: 600 }}>Sign Up</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
