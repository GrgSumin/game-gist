import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Grid, Card, CardContent, CardMedia, Chip, Skeleton, Tabs, Tab,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getNews } from "../api/endpoints";
import type { NewsArticle } from "../types";

export default function NewsPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [headlines, setHeadlines] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0); // 0 = all, 1 = admin only

  useEffect(() => {
    setLoading(true);
    const source = tab === 1 ? "admin" : undefined;
    getNews(1, source)
      .then((r) => {
        setArticles(r.data.articles);
        setHeadlines(r.data.headlines);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const isExternal = (article: NewsArticle) => article._id.startsWith("api-");

  const handleClick = (article: NewsArticle) => {
    if (isExternal(article) && article.url) {
      window.open(article.url, "_blank", "noopener");
    } else {
      navigate(`/news/${article._id}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
      <Typography variant="h4" gutterBottom>Football News</Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="All News" />
        <Tab label="Our Articles" />
      </Tabs>

      {/* Headlines */}
      {headlines.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Card
            sx={{ cursor: "pointer", overflow: "hidden", position: "relative" }}
            onClick={() => handleClick(headlines[0] as NewsArticle)}
          >
            {headlines[0].image && (
              <CardMedia
                component="img"
                height={300}
                image={headlines[0].image.startsWith("/") ? `${import.meta.env.VITE_API_URL || ""}${headlines[0].image}` : headlines[0].image}
                alt={headlines[0].title}
                sx={{ objectFit: "cover" }}
              />
            )}
            <CardContent sx={{
              position: headlines[0].image ? "absolute" : "relative",
              bottom: 0, left: 0, right: 0,
              background: headlines[0].image ? "linear-gradient(transparent, rgba(0,0,0,0.9))" : "transparent",
              pt: headlines[0].image ? 8 : 0,
            }}>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Chip label="HEADLINE" size="small" color="error" />
                {isExternal(headlines[0] as NewsArticle) && (
                  <Chip label={(headlines[0] as NewsArticle).source} size="small" variant="outlined" icon={<OpenInNewIcon sx={{ fontSize: 14 }} />} />
                )}
              </Box>
              <Typography variant="h5" fontWeight={700}>{headlines[0].title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{headlines[0].shortDesc}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={200} />
            </Grid>
          ))}
        </Grid>
      ) : articles.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={8}>
          No news articles yet. {tab === 1 ? "Add articles from the admin panel." : "Configure GNEWS_API_KEY for live football news."}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {articles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article._id}>
              <Card
                sx={{ cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}
                onClick={() => handleClick(article)}
              >
                {article.image && (
                  <CardMedia
                    component="img"
                    height={160}
                    image={article.image.startsWith("/") ? `${import.meta.env.VITE_API_URL || ""}${article.image}` : article.image}
                    alt={article.title}
                    sx={{ objectFit: "cover" }}
                  />
                )}
                <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                    <Chip label={article.category} size="small" variant="outlined" />
                    {isExternal(article) && (
                      <Chip
                        label={article.source}
                        size="small"
                        variant="outlined"
                        color="info"
                        icon={<OpenInNewIcon sx={{ fontSize: 12 }} />}
                      />
                    )}
                    <Typography variant="caption" color="text.secondary">{formatDate(article.createdAt)}</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={700} gutterBottom>{article.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                    {article.shortDesc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
