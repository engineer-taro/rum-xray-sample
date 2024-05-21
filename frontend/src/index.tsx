import Layout from "./Layout";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button, ButtonGroup } from "@mui/material";
import { AwsRum, AwsRumConfig } from "aws-rum-web";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <>
    <SettingRum />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="/about" element={<About />} />{" "}
          <Route path="/api" element={<SampleExternalApi />} />
          <Route path="/api-gateway" element={<SampleApiGateway />} />
          <Route path="/jsError" element={<JsError />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>
);

function SettingRum() {
  try {
    const config: AwsRumConfig = {
      sessionSampleRate: 1,
      identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
      endpoint: "https://dataplane.rum.ap-northeast-1.amazonaws.com",
      telemetries: [
        "performance",
        "errors",
        [
          "http",
          {
            addXRayTraceIdHeader: true,
          },
        ],
      ],
      allowCookies: true,
      enableXRay: true,
    };

    const APPLICATION_ID: string =
      process.env.CLOUDWATCH_RUM_APPLICATION_ID || "";
    const APPLICATION_VERSION: string = "1.0.0";
    const APPLICATION_REGION: string = "ap-northeast-1";

    const awsRum: AwsRum = new AwsRum(
      APPLICATION_ID,
      APPLICATION_VERSION,
      APPLICATION_REGION,
      config
    );
  } catch (error) {
    // Ignore errors thrown during CloudWatch RUM web client initialization
  }
  return <></>;
}

function App() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <>
      <h2>About</h2>
    </>
  );
}

/** 外部APIへのリクエスト */
function SampleExternalApi() {
  const mockApi = "https://httpbin.org/status";
  return (
    <>
      <h2>外部のAPIへのリクエスト</h2>
      <div>
        <ButtonGroup variant="outlined">
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              await fetch(`${mockApi}/200`);
            }}
          >
            200
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              await fetch(`${mockApi}/500`);
            }}
          >
            500
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              await fetch(`${mockApi}/400`);
            }}
          >
            400
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}

/** 自作APIGatewayへのリクエスト */
function SampleApiGateway() {
  const apiGatewayEndpoint = process.env.API_GATEWAY_ENDPOINT || "";
  return (
    <>
      <h2>自前のAPIGatewayへのリクエスト</h2>
      <div>
        <ButtonGroup variant="outlined">
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              await fetch(`${apiGatewayEndpoint}/success`);
            }}
          >
            200
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              await fetch(`${apiGatewayEndpoint}/fail`);
            }}
          >
            500
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}

/** JsErrorをCloudWatchRUMで検知できることを試す画面 */
function JsError() {
  return (
    <>
      <h2>JsErrorを強制的に発生させる画面</h2>
      <div>
        <ButtonGroup variant="outlined">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              throw new Error("error");
            }}
          >
            "throw new Error("error")"
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}
