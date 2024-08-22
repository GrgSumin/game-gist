import { useEffect, useState } from "react";
import "./News.css";
import { Link, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";

function News() {
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
  const leagues = [
    "Premier League",
    "Serie A",
    "Ligue 1",
    "Bumdesliga",
    "Saudi pro league",
    "MLS",
  ];

  const matches = [
    {
      teal1: "Liv",
      team2: "Bar",
    },
    {
      teal1: "MNU",
      team2: "MCI",
    },
    {
      teal1: "TOT",
      team2: "ARS",
    },
    {
      teal1: "BAR",
      team2: "DOT",
    },
    {
      teal1: "MIL",
      team2: "INT",
    },
    {
      teal1: "JUV",
      team2: "ROM",
    },
    {
      teal1: "BEN",
      team2: "POR",
    },
    {
      teal1: "REA",
      team2: "BAR",
    },
  ];
  return (
    <div style={{ width: "100vw" }}>
      <div className="main-container">
        {/* <div className="teams">
          <h2 style={{ borderBottom: "2px solid gray" }}>Leagues</h2>
          {leagues.map((league) => (
            <h2>{league}</h2>
          ))}
        </div> */}
        <div className="headline">
          {headline.map((headline: any, index) => (
            <Link to="/single" state={{ id: headline._id }}>
              <div key={index} className="main-headline">
                <img
                  src={`http://localhost:4001/uploads/${headline.image}`}
                  alt="football"
                  height="90%"
                  width="90%"
                  style={{ borderRadius: 20 }}
                />
                <div className="topics">
                  <h1>{headline.title}</h1>
                  <h2>{headline.short_desc}</h2>
                  <a href={headline.url}>{headline.url}</a>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* <div className="matches">
          <h2 style={{ borderBottom: "2px solid gray" }}>Today</h2>
          {matches.map((match) => (
            <>
              <h2>
                {match.teal1} vs {match.team2}
              </h2>
            </>
          ))}
        </div> */}
      </div>
      <Marquee>
        <div style={{ display: "flex" }}>
          {news.map((headline: any) => (
            <div className="small-news">
              <Link to="/single" state={{ id: headline._id }}>
                <div
                  className="news"
                  onClick={() =>
                    navigate(`./single/${headline._id}`, {
                      state: { id: headline._id },
                    })
                  }
                >
                  <img
                    src={`http://localhost:4001/uploads/${headline.image}`}
                    alt="football"
                    style={{
                      height: "100%",
                      width: "30%",
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />
                  <div className="topics">
                    <p style={{ textDecoration: "none" }}>{headline.title}</p>
                    <p style={{ textDecoration: "none" }}>
                      {headline.short_desc}
                    </p>
                    <a href={headline.url} style={{ textDecoration: "none" }}>
                      {headline.url}
                    </a>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}

export default News;
