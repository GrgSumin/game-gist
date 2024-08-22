import { useEffect, useState } from "react";
import "./News.css";
import Carousel from "react-material-ui-carousel";
import { Link, useNavigate } from "react-router-dom";

function Headline() {
  const [news, setNews] = useState<any[]>([]);
  const [headline, setHeadline] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4001/api/news/getNews", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching news:", errorData);
          // Optionally set some error state here
          return;
        }

        const data = await response.json();
        setHeadline(data.headlines || []); // Ensure default to empty array
        setNews(data.getallNews || []); // Ensure default to empty array
      } catch (error) {
        console.error("Fetch error:", error);
        // Optionally set some error state here
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 style={{ color: "aliceblue", textAlign: "center" }}>News</h1>

      <Carousel animation="slide">
        {headline.length > 0 ? (
          headline.map((item: any, index: number) => (
            <Link key={index} to="/single" state={{ id: item._id }}>
              <div className="headline">
                <div className="img">
                  <img
                    src={`http://localhost:4001/uploads/${item.image}`}
                    alt={item.title}
                    height="400px"
                    width="300px"
                    loading="lazy" // Add lazy loading
                  />
                </div>
                <div className="topics">
                  <h1>{item.title}</h1>
                  <h2>{item.short_desc}</h2>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url}
                  </a>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No headlines available</p>
        )}
      </Carousel>

      <div className="primary">
        {news.length > 0 ? (
          news.map((item: any) => (
            <Link key={item._id} to="/single" state={{ id: item._id }}>
              <div
                className="news"
                onClick={() =>
                  navigate(`/single/${item._id}`, {
                    state: { id: item._id },
                  })
                }
              >
                <div className="img">
                  <img
                    src={`http://localhost:4001/uploads/${item.image}`}
                    alt={item.title}
                    height="300px"
                    width="200px"
                    loading="lazy" // Add lazy loading
                  />
                </div>
                <div className="topics">
                  <h1>{item.title}</h1>
                  <h2>{item.short_desc}</h2>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url}
                  </a>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No news available</p>
        )}
      </div>
    </div>
  );
}

export default Headline;
