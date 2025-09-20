exports.handler = async (event) => {
  const AWS = require("aws-sdk");
  const lambda = new AWS.Lambda({ region: "ap-southeast-5" });

  try {
    const result = await lambda
      .invoke({
        FunctionName: "owewow-textract-parser",
        Payload:
          event.body ||
          JSON.stringify({
            bucket_name: "owewow-uploads-x9k4m2",
            object_key: "receipt.jpg",
            group_id: "demo",
          }),
      })
      .promise();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: result.Payload,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
