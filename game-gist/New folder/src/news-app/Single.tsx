import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Single() {
  const location = useLocation();
  const { id } = location.state;
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:4001/api/news/getANews/${id}`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          console.log("there is an error");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className="">
        <img
          src={`http://localhost:4001/uploads/${data.image}`}
          alt=""
          height="100px"
          width="100px"
        />
        <h1>{data.title}</h1>
        <h2>{data.description}</h2>
        <a href={data.url}>{data.url}</a>
      </div>
    </>
  );
}

export default Single;
