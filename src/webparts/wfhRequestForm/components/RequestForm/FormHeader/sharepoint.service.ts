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

// Get one request item by ID
export const getRequestById = async (id: number) => {
  try {
    return await _sp.web.lists
      .getByTitle("WorkFromHomeRequests")
      .items.getById(id)();
  } catch (error) {
    console.error("Error fetching request:", error);
    throw error;
  }
};


// Get workflow sequence for given CurrentView
export const getWorkflowSequence = async (currentView: number) => {
  try {
    return await _sp.web.lists
      .getByTitle("WorkflowMatrix")
      .items
      .filter(`CurrentView eq ${currentView}`)
      .orderBy("StepNumber", true)();
  } catch (error) {
    console.error("Error fetching workflow sequence:", error);
    throw error;
  }
};