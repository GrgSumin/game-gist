import React, { useEffect, useState } from "react";
import "../fantasy/fantasy.css";

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
        const response = await fetch("http://localhost:4001/fantasynews");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Log the response to inspect its structure
        console.log(data);

        // Check if data is an array
        if (Array.isArray(data)) {
          setNews(data);
        } else {
          setError("Unexpected data format");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(`Failed to fetch news: ${error.message}`);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
