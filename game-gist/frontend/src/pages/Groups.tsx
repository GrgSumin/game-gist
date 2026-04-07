import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Grid, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Chip,
  Snackbar, Divider,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { createGroup, joinGroup, getMyGroups } from "../api/endpoints";
import type { Group } from "../types";
import useAuth from "../hooks/useAuth";

export default function GroupsPage() {
  const { isAuthenticated } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [snack, setSnack] = useState("");

  const loadGroups = () => {
    if (!isAuthenticated) { setLoading(false); return; }
    getMyGroups()
      .then((r) => setGroups(r.data.groups))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadGroups(); }, [isAuthenticated]);

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    try {
      await createGroup(groupName);
      setCreateOpen(false);
      setGroupName("");
      loadGroups();
      setSnack("Group created!");
    } catch {
      setSnack("Failed to create group");
    }
  };

  const handleJoin = async () => {
    if (!groupCode.trim()) return;
    try {
      await joinGroup(groupCode);
      setJoinOpen(false);
      setGroupCode("");
      loadGroups();
      setSnack("Joined group!");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to join group";
      setSnack(msg);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setSnack("Code copied!");
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", px: 2, py: 8, textAlign: "center" }}>
        <GroupIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" gutterBottom>Sign in to manage groups</Typography>
        <Typography color="text.secondary">Create or join leagues with friends</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4">My Groups</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>Create</Button>
          <Button variant="outlined" startIcon={<LoginIcon />} onClick={() => setJoinOpen(true)}>Join</Button>
        </Box>
      </Box>

      {loading ? null : groups.length === 0 ? (
        <Card sx={{ textAlign: "center", py: 6 }}>
          <CardContent>
            <GroupIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>No groups yet</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>Create a group and invite friends, or join one with a code.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {groups.map((group) => (
            <Grid item xs={12} sm={6} key={group._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography variant="h6" fontWeight={700}>{group.groupName}</Typography>
                    <Chip
                      label={group.groupCode}
                      size="small"
                      icon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                      onClick={() => copyCode(group.groupCode)}
                      sx={{ cursor: "pointer" }}
                    />
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                    {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                  </Typography>
                  {group.members.map((m) => (
                    <Box key={m.userId?._id || Math.random()} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main", color: "#111", fontSize: "0.75rem", fontWeight: 700 }}>
                        {m.userId?.username?.[0]?.toUpperCase() || "?"}
                      </Avatar>
                      <Typography variant="body2">{m.userId?.username || "Unknown"}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} PaperProps={{ sx: { bgcolor: "background.paper" } }}>
        <DialogTitle>Create Group</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Join Dialog */}
      <Dialog open={joinOpen} onClose={() => setJoinOpen(false)} PaperProps={{ sx: { bgcolor: "background.paper" } }}>
        <DialogTitle>Join Group</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="Group Code" value={groupCode} onChange={(e) => setGroupCode(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleJoin}>Join</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack("")} message={snack} />
    </Box>
  );
}
