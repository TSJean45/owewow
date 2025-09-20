// Updated receipt proxy to handle both upload and chat
exports.handler = async (event) => {
  const AWS = require("aws-sdk");
  const lambda = new AWS.Lambda({ region: "ap-southeast-5" });

  try {
    console.log("Received event:", JSON.stringify(event));

    const body = JSON.parse(event.body || "{}");
    const { chat_input, object_key, bucket_name, group_id, step, user_input } =
      body;

    let result;

    // Route to appropriate Lambda based on input
    if (chat_input || user_input) {
      // Chat flow - call conversational AI
      console.log("Routing to conversational AI");
      result = await lambda
        .invoke({
          FunctionName: "owewow-conversational-receipt-ai",
          Payload: JSON.stringify({
            user_input: chat_input || user_input,
            group_id: group_id || "quick-split",
            step: step || "initial",
          }),
        })
        .promise();
    } else if (object_key) {
      // Upload flow - call textract parser
      console.log("Routing to textract parser");
      result = await lambda
        .invoke({
          FunctionName: "owewow-textract-parser",
          Payload: JSON.stringify({
            bucket_name: bucket_name || "owewow-uploads-x9k4m2",
            object_key: object_key,
            group_id: group_id || "quick-split",
          }),
        })
        .promise();
    } else {
      throw new Error(
        "Missing required parameters: need either chat_input or object_key"
      );
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: result.Payload,
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
