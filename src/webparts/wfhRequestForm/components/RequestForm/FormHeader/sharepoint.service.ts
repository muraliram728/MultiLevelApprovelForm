import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";

let _sp: SPFI;

export const initializeSP = (context: WebPartContext): void => {
  _sp = spfi().using(SPFx(context));
};

export const getCurrentUser = async () => {
  try {
    // First get basic user info
    const user = await _sp.web.currentUser();

    // Then get user profile properties
    const profile = await _sp.profiles.getPropertiesFor(user.LoginName);

    // Extract department and job title from user profile
    const department = profile.UserProfileProperties?.find(
      (prop: { Key: string; }) => prop.Key === "Department")?.Value || "Information Technology";

    const jobTitle = profile.UserProfileProperties?.find(
      (prop: { Key: string; }) => prop.Key === "Title")?.Value || "UI Developer";

    return {
      Title: user.Title,
      Email: user.Email,
      Department: department,
      JobTitle: jobTitle,
      LoginName: user.LoginName
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return {
      Title: "Unknown User",
      Email: "",
      Department: "",
      JobTitle: "",
      LoginName: ""
    };
  }
};

export const submitFormData = async (formData: any) => {
  try {
    // 1. Get the current max RequestId number from the list
    const lastItem = await _sp.web.lists
      .getByTitle("WorkFromHomeRequests")
      .items
      .select("RequestId")
      .orderBy("ID", false) // newest first
      .top(1)();

    let nextNumber = 1;
    if (lastItem.length && lastItem[0].RequestId) {
      const match = lastItem[0].RequestId.match(/WFH-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    const newRequestId = `WFH-${("000" + nextNumber).slice(-3)}`;

    // 2. Add it to the formData
    const listItem = {
      ...formData,
      RequestId: newRequestId
    };

    // 3. Create the item
    const result = await _sp.web.lists
      .getByTitle("WorkFromHomeRequests")
      .items.add(listItem);

    return { ...result.data, RequestId: newRequestId };
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};


export const updateWorkFromHomeRequest = async (itemId: number, status: string, nextApproverEmail: string | null) => {
  const updateData: any = {
    Status: status
  };

  // Only include NextApprover if there's an email
  if (nextApproverEmail) {
    updateData.NextApprover = nextApproverEmail;
  }

  return await _sp.web.lists
    .getByTitle("WorkFromHomeRequests")
    .items
    .getById(itemId)
    .update(updateData);
};


export const getCurrentWorkflowView = async (): Promise<number> => {
  const config = await _sp.web.lists
    .getByTitle("WorkflowConfig")
    .items
    .select("CurrentView")
    .top(1)();

  return config.length > 0 ? config[0].CurrentView : 1; // Fallback to 1 if no config
};

export const getApproversForView = async (viewNumber: number) => {
  return await _sp.web.lists
    .getByTitle("WorkflowMatrix")
    .items
    .filter(`CurrentView eq ${viewNumber}`)
    .orderBy("StepNumber", true)
    .select("Approver/Title", "Approver/EMail", "StepNumber", "ApproverRole")
    .expand("Approver")();
};

// Get SharePoint item ID by RequestId
export const getItemIdByRequestId = async (requestId: string): Promise<number | null> => {
  try {
    const items = await _sp.web.lists
      .getByTitle("WorkFromHomeRequests")
      .items
      .filter(`RequestId eq '${requestId}'`)();

    return items.length > 0 ? items[0].ID : null;
  } catch (error) {
    console.error("Error fetching item ID by RequestId:", error);
    return null;
  }
};

/**
 * Approve a Work From Home request.
 * Handles finding current user, determining next approver, and updating status.
 */
export const approveWorkFromHomeRequest = async (requestId: string | number) => {
  try {
    const reqIdStr = requestId.toString();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unable to get current user");
    }

    // 1. Get the existing item
    const existingItem = await _sp.web.lists
      .getByTitle("WorkFromHomeRequests")
      .items
      .filter(`RequestId eq '${reqIdStr}'`)
      .select("ID", "CurrentView", "Status", "CurrentStep")
      .top(1)();

    if (!existingItem || existingItem.length === 0) {
      throw new Error(`No request found with ID: ${reqIdStr}`);
    }

    const itemId = existingItem[0].ID;
    const currentView = existingItem[0].CurrentView || 1;
    const approvers = await getApproversForView(currentView);

    // 2. Find current approver step
    const currentStep = approvers.find(
      (a: any) => a.Approver.EMail.toLowerCase() === currentUser.Email.toLowerCase()
    );

    if (!currentStep) {
      throw new Error("Current user is not an approver for this request");
    }

    // 3. Determine next approver
    const nextStep = approvers.find((a: any) => a.StepNumber === currentStep.StepNumber + 1);
    const nextApproverEmail = nextStep ? nextStep.Approver.EMail : null;
    const newStatus ="Approved";

    // 4. Prepare update data - only the fields that need changing
    const updateData: any = {
      Status: newStatus,
      CurrentStep: nextStep ? currentStep.StepNumber + 1 : currentStep.StepNumber,
      Modified: new Date().toISOString() // Update modified date
    };

    if (nextApproverEmail) {
      updateData.NextApprover = nextApproverEmail;
    }

    // 5. Update the existing item
    await _sp.web.lists
      .getByTitle("WorkFromHomeRequests")
      .items
      .getById(itemId)
      .update(updateData);

    return {
      status: newStatus,
      nextApprover: nextApproverEmail,
      itemId: itemId
    };
  } catch (error) {
    console.error("Error approving request:", error);
    throw error;
  }
};
