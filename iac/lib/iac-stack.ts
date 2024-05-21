import * as cdk from "aws-cdk-lib";

import { Construct } from "constructs";
import { Frontend } from "./frontend";
import { Backend } from "./backend";

export class RumSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Backend(this, "Backend");
    new Frontend(this, "Frontend");
  }
}
