import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Define the type for a news item
interface NewsItem {
  title: string;
  description: string;
  image: string;
  url: string;
}

function Single() {
  const location = useLocation();
  const { id } = location.state as { id: string }; // Type assertion
  const [data, setData] = useState<NewsItem | null>(null); // Updated state type

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:4001/api/news/getANews/${id}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          console.error("Error fetching news");
          return;
        }

        const jsonData: NewsItem = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchUser();
  }, [id]);

  // Conditional rendering in case data is not yet loaded
  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
      }}
    >
      <h1 style={{ color: "#84CFDE" }}>{data.title}</h1>
      <img
        src={`http://localhost:4001/uploads/${data.image}`}
        alt={data.title}
        height="400px"
        width="400px"
      />
      <h2 style={{ display: "flex", justifyContent: "center", width: "500px" }}>
        {data.description}
      </h2>
      <a href={data.url} target="_blank" rel="noopener noreferrer">
        {data.url}
      </a>
    </div>
  );
}

export default Single;
