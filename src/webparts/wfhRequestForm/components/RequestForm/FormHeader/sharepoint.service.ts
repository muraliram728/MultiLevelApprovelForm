import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

let _sp: SPFI;

export const initializeSP = (context: WebPartContext): void => {
  _sp = spfi().using(SPFx(context));
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
  return await _sp.web.lists
    .getByTitle("WorkFromHomeRequests")
    .items
    .getById(id)
    .select("*")(); // or list specific fields if needed
};

export const updateRequest = async (id: number, data: any) => {
  return await _sp.web.lists
    .getByTitle("WorkFromHomeRequests")
    .items
    .getById(id)
    .update(data);
};
