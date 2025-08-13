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
    const result = await _sp.web.lists.getByTitle("WorkFromHomeRequests").items.add(formData);
    return result;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
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

export const getRequestById = async (id: number) => {
  try {
    return await _sp.web.lists
      .getByTitle("WorkFromHomeRequests")
      .items
      .getById(id)
      .select("*")();
  } catch (error) {
    console.error(`Error getting request ${id}:`, error);
    return null;
  }
};

export const updateRequest = async (id: number, data: any) => {
  return await _sp.web.lists
    .getByTitle("WorkFromHomeRequests")
    .items
    .getById(id)
    .update(data);
};