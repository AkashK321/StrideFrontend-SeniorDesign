from aws_cdk import (
    Stack,
    Duration,
    aws_lambda as _lambda,
    aws_apigateway as apigw,
)
from constructs import Construct

class CdkStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # ---------------------------------------------------------------------
        # 1. The Kotlin Lambda Function
        # ---------------------------------------------------------------------
        my_function = _lambda.Function(
            self, "BackendHandler",
            
            # Use Java 21 for modern Kotlin support
            runtime=_lambda.Runtime.JAVA_21,
            
            # Handler format: package.name.ClassName::methodName
            # (Update this to match your actual Kotlin package/class)
            handler="com.handler.Handler",

            # Path to the compiled JAR. 
            # This assumes your Kotlin project folder ('kotlin_app') is in the 
            # same root directory as your CDK app.py
            code=_lambda.Code.from_asset("backend/build/libs/kotlin_app-1.0-all.jar"),

            # JVM Optimization
            memory_size=1024, 
            timeout=Duration.seconds(15),
            
            # SnapStart reduces Cold Start times significantly for Java/Kotlin
            snap_start=_lambda.SnapStartConf.ON_PUBLISHED_VERSIONS
        )

        # ---------------------------------------------------------------------
        # 2. The API Gateway
        # ---------------------------------------------------------------------
        api = apigw.LambdaRestApi(
            self, "MyEndpoint",
            handler=my_function,
            proxy=False 
        )

        # 3. Define the route (GET /items)
        items = api.root.add_resource("items")
        items.add_method("GET")
