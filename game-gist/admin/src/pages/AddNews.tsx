import { useState } from "react";
import {
  Box, Typography, Card, CardContent, TextField, Button, FormControlLabel, Checkbox,
  Select, MenuItem, InputLabel, FormControl,
} from "@mui/material";
import toast from "react-hot-toast";
import api from "../api";

export default function AddNews() {
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("general");
  const [isHeadline, setIsHeadline] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc || !description) {
      toast.error("Title, short description, and description are required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("shortDesc", shortDesc);
      formData.append("description", description);
      formData.append("url", url);
      formData.append("category", category);
      formData.append("isHeadline", String(isHeadline));
      if (image) formData.append("image", image);

      await api.post("/api/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("News article added!");
      setTitle(""); setShortDesc(""); setDescription(""); setUrl("");
      setCategory("general"); setIsHeadline(false); setImage(null);
    } catch {
      toast.error("Failed to add news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={800}>Add News</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Publish news articles to the frontend feed
      </Typography>

      <Card sx={{ maxWidth: 700 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Short Description" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} required multiline rows={2} sx={{ mb: 2 }} />
            <TextField fullWidth label="Full Description" value={description} onChange={(e) => setDescription(e.target.value)} required multiline rows={4} sx={{ mb: 2 }} />
            <TextField fullWidth label="URL (optional)" value={url} onChange={(e) => setUrl(e.target.value)} sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Category</InputLabel>
                <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="transfer">Transfer</MenuItem>
                  <MenuItem value="match">Match</MenuItem>
                  <MenuItem value="injury">Injury</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Checkbox checked={isHeadline} onChange={(e) => setIsHeadline(e.target.checked)} />}
                label="Headline"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Image (optional)</Typography>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            </Box>

            <Button variant="contained" type="submit" disabled={loading} size="large">
              {loading ? "Publishing..." : "Publish Article"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
