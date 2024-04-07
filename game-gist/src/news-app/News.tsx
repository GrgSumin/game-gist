import { useEffect, useState } from "react";

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching data...");
      try {
        const response = await fetch(
          "https://football-news-aggregator-live.p.rapidapi.com/news/fourfourtwo/bundesliga",
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key":
                "706989f66bmsh022e1d4fad03d4fp18255cjsn03bc14bcea6a",
              "X-RapidAPI-Host": "football-news-aggregator-live.p.rapidapi.com",
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData);
          return;
        }

        const data = await response.json();

        setNews(data);
      } catch (error) {
        console.log("error");
        console.log("error", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <h1>News</h1>
      {}
    </div>
  );
};

export default News;
