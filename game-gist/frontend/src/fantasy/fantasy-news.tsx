import React, { useEffect, useState } from "react";
import "./fantasy.css";

interface NewsArticle {
  title: string;
  url: string;
  img: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "/api/.netlify/functions/api/news/onefootball"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: NewsArticle[] = await response.json();
        setNews(data);
      } catch (error) {
        setError("Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="news-container">
      {news.map((article, index) => (
        <div key={index} className="news-article">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <img src={article.img} alt={article.title} />
            <h3>{article.title}</h3>
          </a>
        </div>
      ))}
    </div>
  );
};

export default News;
