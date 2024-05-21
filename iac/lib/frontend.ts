import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Frontend extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const oai = new cloudfront.OriginAccessIdentity(
      scope,
      "MyOriginAccessIdentity"
    );

    const bucket = new s3.Bucket(scope, "MyStaticSiteBucket", {
      websiteIndexDocument: "index.html",
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 注意: 本番環境ではこの設定は推奨されません
    });
    const webSiteBucketPolicyStatement = new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      effect: iam.Effect.ALLOW,
      principals: [
        new iam.CanonicalUserPrincipal(
          oai.cloudFrontOriginAccessIdentityS3CanonicalUserId
        ),
      ],
      resources: [`${bucket.bucketArn}/*`],
    });

    bucket.addToResourcePolicy(webSiteBucketPolicyStatement);

    new s3deploy.BucketDeployment(scope, "DeployWebsite", {
      sources: [s3deploy.Source.asset("../frontend/build")],
      destinationBucket: bucket,
    });

    new cloudfront.CloudFrontWebDistribution(scope, "MyDistribution", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: oai,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });
  }
}
