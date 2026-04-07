import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Chip,
} from "@mui/material";
import api from "../api";

interface User {
  _id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/users/all")
      .then((r) => setUsers(r.data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={800}>Users</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        {users.length} registered user{users.length !== 1 ? "s" : ""}
      </Typography>

      <Card>
        <CardContent>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height={48} sx={{ mb: 0.5 }} />)
          ) : users.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>No users yet.</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u._id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", color: "#111", fontWeight: 700, fontSize: "0.8rem" }}>
                            {u.username[0]?.toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{u.username}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip label={u.role} size="small" color={u.role === "admin" ? "primary" : "default"} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
