import Field from "./Field";
import Teamstats from "./team-stats";

function Fantasy() {
  return (
    <div
      style={{
        // backgroundColor: "green",
        height: "100vh",
        width: "100vw",
        padding: "10px",
      }}
    >
      <Teamstats />
      <Field />
    </div>
  );
}

export default Fantasy;
