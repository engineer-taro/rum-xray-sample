import { APIGatewayEvent, APIGatewayProxyHandler, Context } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context
) => {
  // eventとcontextはそれぞれAPIGatewayEventとContext型として扱われます
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "failed",
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      "Access-Control-Allow-Headers": "*",
    },
  };
};
