import { post } from "aws-amplify/api";

const API_NAME = "receipts";

export const saveAssignmentsToDB = async (
  receiptData: any,
  people: any[],
  groupId: string = "quick-split"
) => {
  try {
    console.log("💾 Saving assignments to database...");

    const restOperation = post({
      apiName: API_NAME,
      path: "/receipts",
      options: {
        body: {
          save_assignment: true,
          receipt_data: receiptData,
          people_data: people,
          group_id: groupId,
        },
      },
    });

    const { body } = await restOperation.response;
    const response = (await body.json()) as any; // Type assertion for API response

    console.log("✅ Assignments saved to database");
    return response;
  } catch (error) {
    console.error("❌ Failed to save assignments:", error);
    throw error;
  }
};

export const updatePaymentStatusInDB = async (
  receiptData: any,
  personId: string,
  status: string,
  groupId: string = "quick-split"
) => {
  try {
    console.log(`💳 Updating payment status: ${personId} -> ${status}`);

    const restOperation = post({
      apiName: API_NAME,
      path: "/receipts",
      options: {
        body: {
          payment_update: true,
          receipt_data: receiptData,
          person_id: personId,
          payment_status: status,
          group_id: groupId,
        },
      },
    });

    const { body } = await restOperation.response;
    const response = (await body.json()) as any; // Type assertion

    console.log("✅ Payment status updated in database");
    return response;
  } catch (error) {
    console.error("❌ Failed to update payment status:", error);
    throw error;
  }
};

export const loadAssignmentFromDB = async (
  receiptId: string,
  groupId: string = "quick-split"
) => {
  try {
    console.log(`📥 Loading assignment from database: ${receiptId}`);

    const restOperation = post({
      apiName: API_NAME,
      path: "/receipts",
      options: {
        body: {
          load_assignment: true,
          receipt_id: receiptId,
          group_id: groupId,
        },
      },
    });

    const { body } = await restOperation.response;
    const response = (await body.json()) as any; // Type assertion

    // Now TypeScript knows response can have success/data properties
    if (response && response.success) {
      console.log("✅ Assignment loaded from database");
      return response.data;
    } else {
      console.log("ℹ️ No assignment found in database");
      return null;
    }
  } catch (error) {
    console.error("❌ Failed to load assignment:", error);
    return null;
  }
};
