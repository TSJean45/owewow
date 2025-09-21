const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

exports.handler = async (event) => {
  const lambdaClient = new LambdaClient({ region: "ap-southeast-5" });

  try {
    console.log("Received event:", JSON.stringify(event));
    const body = JSON.parse(event.body || "{}");
    const { chat_input, object_key, bucket_name, group_id, step, user_input } =
      body;

    let result;

    if (chat_input || user_input) {
      // Chat flow
      console.log("Routing to conversational AI in Malaysia");
      const command = new InvokeCommand({
        FunctionName:
          "arn:aws:lambda:ap-southeast-5:386782865665:function:owewow-conversational-receipt-ai",
        Payload: JSON.stringify({
          user_input: chat_input || user_input,
          group_id: group_id || "quick-split",
          step: step || "initial",
        }),
      });
      result = await lambdaClient.send(command);
    } else if (object_key) {
      // Upload flow - with debug logging
      console.log("Routing to textract parser in Malaysia");

      const textractPayload = {
        httpMethod: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucket_name: bucket_name || "owewow-uploads-x9k4m292a00-dev",
          object_key: object_key,
          group_id: group_id || "quick-split",
        }),
      };

      // 🔥 DEBUG: Log what we're sending to textract
      console.log(
        "📤 SENDING TO TEXTRACT:",
        JSON.stringify(textractPayload, null, 2)
      );

      const command = new InvokeCommand({
        FunctionName:
          "arn:aws:lambda:ap-southeast-5:386782865665:function:owewow-textract-parser",
        Payload: JSON.stringify(textractPayload),
      });

      result = await lambdaClient.send(command);

      // 🔥 DEBUG: Log what we got back
      console.log("📥 TEXTRACT RESPONSE:", result);
    } else {
      throw new Error(
        "Missing required parameters: need either chat_input or object_key"
      );
    }

    const payloadString = new TextDecoder().decode(result.Payload);

    // 🔥 DEBUG: Log final response
    console.log("🎯 FINAL RESPONSE:", payloadString);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: payloadString,
    };
  } catch (error) {
    console.error("Proxy error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: error.message,
        stage: "proxy_lambda",
      }),
    };
  }
};
