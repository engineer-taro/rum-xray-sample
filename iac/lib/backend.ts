import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import path = require("path");

export class Backend extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Lambda定義
    const successHandler = new NodejsFunction(scope, "SuccessFunction", {
      entry: path.join(__dirname, "functions/success.ts"),
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      tracing: Tracing.ACTIVE,
      bundling: {
        forceDockerBundling: false,
      },
    });

    const failHandler = new NodejsFunction(scope, "FailFunction", {
      entry: path.join(__dirname, "functions/fail.ts"),
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      tracing: Tracing.ACTIVE,
      bundling: {
        forceDockerBundling: false,
      },
    });

    // API Gateway定義
    const defaultAllowHeader = [
      "Content-Type",
      "X-Amz-Date",
      "Authorization",
      "X-Api-Key",
      "X-Amz-Security-Token",
      "X-Amz-User-Agent",
    ];
    const api = new RestApi(scope, "RumSampleApi", {
      restApiName: "RumSampleApi",
      deploy: true,
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
        allowHeaders: [...defaultAllowHeader, "X-Amzn-Trace-Id"],
      },
      deployOptions: {
        stageName: "dev",
        tracingEnabled: true,
      },
    });
    const successIntegration = new LambdaIntegration(successHandler, {
      proxy: true,
    });
    const failIntegration = new LambdaIntegration(failHandler, {
      proxy: true,
    });

    const successResource = api.root.addResource("success");
    successResource.addMethod("GET", successIntegration);

    const failResource = api.root.addResource("fail");
    failResource.addMethod("GET", failIntegration);
  }
}
