import { useEffect, useState } from "react";
import "./News.css";
import Carousel from "react-material-ui-carousel";
import { Link, useNavigate } from "react-router-dom";

function Headline() {
  const [news, setNews] = useState([]);
  const [headline, setHeadline] = useState([]);

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
          console.log(errorData);
          return;
        }

        const data = await response.json();

        setHeadline(data.headlines);
        setNews(data.getallNews);
      } catch (error) {
        console.log("error");
        console.log("error", error);
      }
    };

    fetchData();
    console.log(news);
  }, []);
  return (
    <div>
      <h1 style={{ color: "aliceblue", textAlign: "center" }}>News</h1>

      <Carousel animation="slide">
        {headline.map((headline: any, index) => (
          <Link to="/single" state={{ id: headline._id }}>
            <div key={index} className="headline">
              <div className="img">
                <img
                  src={`http://localhost:4001/uploads/${headline.image}`}
                  alt="football"
                  height="400px"
                  width="300px"
                />
              </div>
              <div className="topics">
                <h1>{headline.title}</h1>
                <h2>{headline.short_desc}</h2>
                <a href={headline.url}>{headline.url}</a>
              </div>
            </div>
          </Link>
        ))}
      </Carousel>
      <div className="primary">
        {news.map((headline: any) => (
          <Link to="/single" state={{ id: headline._id }}>
            <div
              className="news"
              onClick={() =>
                navigate(`./single/${headline._id}`, {
                  state: { id: headline._id },
                })
              }
            >
              <div className="img">
                <img
                  src={`http://localhost:4001/uploads/${headline.image}`}
                  alt="football"
                  height="300px"
                  width="200px"
                />
              </div>
              <div className="topics">
                <h1>{headline.title}</h1>
                <h2>{headline.short_desc}</h2>
                <a href={headline.url}>{headline.url}</a>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Headline;
