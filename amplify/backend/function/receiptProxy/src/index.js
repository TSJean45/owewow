const AWS = require("aws-sdk");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

exports.handler = async (event) => {
  const lambdaClient = new LambdaClient({ region: "ap-southeast-5" });
  const dynamodb = new AWS.DynamoDB();

  try {
    console.log("Received event:", JSON.stringify(event));
    const body = JSON.parse(event.body || "{}");
    const {
      chat_input,
      object_key,
      bucket_name,
      group_id,
      step,
      user_input,
      voice_command,
      receiptItems,
      save_assignment,
      receipt_data,
      people_data,
      payment_update,
      person_id,
      payment_status,
      load_assignment,
      receipt_id,
    } = body;

    let result;

    if (save_assignment) {
      console.log("💾 Saving assignments to OweWow table");
      try {
        const assignments = {};
        if (receipt_data && receipt_data.lines && people_data) {
          receipt_data.lines.forEach((line) => {
            const claimants = people_data.filter(
              (person) => person.items && person.items.includes(line.line_id)
            );
            if (claimants.length > 0) {
              assignments[line.line_id] = claimants.map((p) => p.id);
            }
          });
        }

        const putParams = {
          TableName: "OweWow",
          Item: {
            PK: { S: `GROUP#${group_id || "quick-split"}` },
            SK: { S: `ASSIGNMENT#${receipt_data.receiptid}` },
            receipt_id: { S: receipt_data.receiptid },
            group_id: { S: group_id || "quick-split" },
            people_data: { S: JSON.stringify(people_data) },
            assignments: { S: JSON.stringify(assignments) },
            payment_status: { S: JSON.stringify({}) },
            created_at: { S: new Date().toISOString() },
            updated_at: { S: new Date().toISOString() },
            status: { S: "active" },
            timestamp: { N: Date.now().toString() },
          },
        };

        await dynamodb.putItem(putParams).promise();

        result = {
          Payload: new TextEncoder().encode(
            JSON.stringify({
              success: true,
              message: "Assignments saved successfully",
              receiptId: receipt_data.receiptid,
              assignmentsCount: Object.keys(assignments).length,
              peopleCount: people_data.length,
            })
          ),
        };
      } catch (dbError) {
        console.error("DynamoDB save error:", dbError);
        result = {
          Payload: new TextEncoder().encode(
            JSON.stringify({
              success: false,
              error: "Failed to save assignments",
              details: dbError.message,
            })
          ),
        };
      }
    } else if (payment_update) {
      console.log("💳 Updating payment status in OweWow table");
      try {
        const getParams = {
          TableName: "OweWow",
          Key: {
            PK: { S: `GROUP#${group_id || "quick-split"}` },
            SK: { S: `ASSIGNMENT#${receipt_data.receiptid}` },
          },
        };

        const currentRecord = await dynamodb.getItem(getParams).promise();
        let paymentStatusObj = {};

        if (currentRecord.Item && currentRecord.Item.payment_status) {
          paymentStatusObj = JSON.parse(currentRecord.Item.payment_status.S);
        }

        paymentStatusObj[person_id] = {
          status: payment_status,
          updatedAt: new Date().toISOString(),
        };

        const updateParams = {
          TableName: "OweWow",
          Key: {
            PK: { S: `GROUP#${group_id || "quick-split"}` },
            SK: { S: `ASSIGNMENT#${receipt_data.receiptid}` },
          },
          UpdateExpression: "SET payment_status = :ps, updated_at = :ua",
          ExpressionAttributeValues: {
            ":ps": { S: JSON.stringify(paymentStatusObj) },
            ":ua": { S: new Date().toISOString() },
          },
        };

        await dynamodb.updateItem(updateParams).promise();

        result = {
          Payload: new TextEncoder().encode(
            JSON.stringify({
              success: true,
              message: "Payment status updated",
              receiptId: receipt_data.receiptid,
              personId: person_id,
              status: payment_status,
            })
          ),
        };
      } catch (dbError) {
        console.error("Payment update error:", dbError);
        result = {
          Payload: new TextEncoder().encode(
            JSON.stringify({
              success: false,
              error: "Failed to update payment status",
              details: dbError.message,
            })
          ),
        };
      }
    } else if (load_assignment) {
      console.log("📥 Loading assignment from OweWow table");
      try {
        const getParams = {
          TableName: "OweWow",
          Key: {
            PK: { S: `GROUP#${group_id || "quick-split"}` },
            SK: { S: `ASSIGNMENT#${receipt_id}` },
          },
        };

        const response = await dynamodb.getItem(getParams).promise();

        if (response.Item) {
          const assignmentData = {
            receiptId: response.Item.receipt_id.S,
            peopleData: JSON.parse(response.Item.people_data.S),
            assignments: JSON.parse(response.Item.assignments.S),
            paymentStatus: JSON.parse(response.Item.payment_status?.S || "{}"),
            updatedAt: response.Item.updated_at?.S,
          };

          result = {
            Payload: new TextEncoder().encode(
              JSON.stringify({
                success: true,
                data: assignmentData,
              })
            ),
          };
        } else {
          result = {
            Payload: new TextEncoder().encode(
              JSON.stringify({
                success: false,
                message: "Assignment not found",
              })
            ),
          };
        }
      } catch (dbError) {
        console.error("Load assignment error:", dbError);
        result = {
          Payload: new TextEncoder().encode(
            JSON.stringify({
              success: false,
              error: "Failed to load assignment",
              details: dbError.message,
            })
          ),
        };
      }
    } else if (voice_command) {
      console.log("🎤 Routing to voice command processor");
      const command = new InvokeCommand({
        FunctionName:
          "arn:aws:lambda:ap-southeast-5:386782865665:function:owewow-voice-command-processor",
        Payload: JSON.stringify({
          body: JSON.stringify({
            text: voice_command,
            receiptItems: receiptItems || [],
          }),
        }),
      });
      result = await lambdaClient.send(command);
    } else if (chat_input || user_input) {
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
      const command = new InvokeCommand({
        FunctionName:
          "arn:aws:lambda:ap-southeast-5:386782865665:function:owewow-textract-parser",
        Payload: JSON.stringify(textractPayload),
      });
      result = await lambdaClient.send(command);
    } else {
      throw new Error("Missing required parameters");
    }

    const payloadString = new TextDecoder().decode(result.Payload);
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
