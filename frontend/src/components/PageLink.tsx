import { Link } from "react-router-dom";

export default function PageLink() {
  return (
    <div>
      <p>
        <Link to={"/"}>Home</Link>
      </p>
      <p>
        <Link to="about">About</Link>
      </p>
      <p>
        <Link to="api">Api</Link>
      </p>
      <p>
        <Link to="api-gateway">ApiGateway</Link>
      </p>
      <p>
        <Link to="jsError">JsError</Link>
      </p>
    </div>
  );
}
