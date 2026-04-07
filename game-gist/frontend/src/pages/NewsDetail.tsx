import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, CardMedia, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getNewsById } from "../api/endpoints";
import type { NewsArticle } from "../types";
import LoadingScreen from "../components/LoadingScreen";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getNewsById(id)
      .then((r) => setArticle(r.data.article))
      .catch(() => navigate("/news"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <LoadingScreen />;
  if (!article) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/news")} sx={{ mb: 2, color: "text.secondary" }}>
        Back to News
      </Button>
      <Card>
        {article.image && (
          <CardMedia
            component="img"
            height={350}
            image={article.image.startsWith("/") ? `${import.meta.env.VITE_API_URL || ""}${article.image}` : article.image}
            alt={article.title}
            sx={{ objectFit: "cover" }}
          />
        )}
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="caption" color="text.secondary">
            {new Date(article.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ mt: 1, mb: 2 }}>{article.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>{article.shortDesc}</Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{article.description}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
