import * as React from 'react';
import {
    Text,
    TextField,
    Dropdown,
    IDropdownOption,
    MessageBar,
    MessageBarType,
    Icon,
    Label,
    Stack,
    DatePicker
} from '@fluentui/react';
import RichTextEditor from './RichTextEditor';
import ButtonBar from './ButtonBar';
import { submitFormData, getApproversForView, getCurrentUser, getCurrentWorkflowView, approveWorkFromHomeRequest } from './sharepoint.service';

// Styles
import {
    formContainerClass,
    sectionHeaderClass,
    formGridClass,
    formItemClass,
    labelClass,
    valueClass,
    subjectContainerClass,
    dateSectionClass,
    dateGridClass,
    uploadAreaClass,
    successMsgClass,
} from './FormHeader.styles';
import { useEffect } from 'react';

const hideSharePointElementsCSS = `
  /* Hide the specific primarySet section */
  .primarySet-153 {
    display: none !important;
  }

  /* Hide the very specific flexContainer section */
  .flexContainer-166.flexContainer-166.flexContainer-166.flexContainer-166.flexContainer-166 {
    display: none !important;
  }

  /* Hide the Comments section */
  div[data-sp-feature-tag="Comments"] {
    display: none !important;
  }
`;

interface IFormData {
    subject: string;
    officeLocation: string;
    startDate: Date | null;
    endDate: Date | null;
    reason: string;
    comments: string;
}

interface Props {
    requestId: number;
}

const officeOptions: IDropdownOption[] = [
    { key: 'head', text: 'Head Office' },
    { key: 'branch1', text: 'Branch 1' },
    { key: 'branch2', text: 'Branch 2' }
];

const FormHeader: React.FC<Props> = ({ requestId }) => {
    const [formData, setFormData] = React.useState<IFormData>({
        subject: '',
        officeLocation: 'head',
        startDate: null,
        endDate: null,
        reason: '',
        comments: ''
    });
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState<{
        Title: string;
        Email: string;
        Department: string;
        JobTitle: string;
    } | null>(null);
    const [isReadOnly, setIsReadOnly] = React.useState(false);
    const [isCurrentApprover, setIsCurrentApprover] = React.useState(false);
    const [firstStepApprover, setfirstStepApprover] = React.useState({
        firstStepcomments: ''
    })
    const [generatedRequestId, setGeneratedRequestId] = React.useState<string | null>(null);


    useEffect(() => {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = hideSharePointElementsCSS;
        document.head.appendChild(styleTag);

        async function fetchData() {
            const approver = await getApproversForView(2);
            console.log("Multi Level Approver From ApproveMatrix List", approver);
        }
        const loadUser = async () => {
            const user = await getCurrentUser();
            setCurrentUser(user);
        };
        const loadUserAndApprovers = async () => {
            try {
                // 1. Get current user
                const user = await getCurrentUser();
                setCurrentUser(user);

                // 2. Get approvers for this view
                const approvers = await getApproversForView(2);
                console.log("Approvers from WorkflowMatrix", approvers);

                // 3. Check if current user is in approvers list
                const isApprover = approvers.some(
                    a => a.Approver?.EMail?.toLowerCase() === user?.Email?.toLowerCase()
                );

                setIsCurrentApprover(isApprover);
            } catch (err) {
                console.error("Error loading approvers or user", err);
            }
        };

        loadUserAndApprovers();
        loadUser();
        fetchData();

        return () => {
            document.head.removeChild(styleTag);
        };
    }, [requestId]);


    const handleSubmit = async () => {
        if (!formData.subject || !formData.startDate || !formData.endDate) {
            alert('Please fill all required fields');
            return;
        }
        if (!currentUser) {
            alert('User information not loaded yet');
            return;
        }

        const currentView = await getCurrentWorkflowView();
        const approvers = await getApproversForView(currentView);

        const listItem = {
            Title: formData.subject,
            OfficeLocation: formData.officeLocation,
            StartDate: formData.startDate.toISOString(),
            EndDate: formData.endDate.toISOString(),
            Reason: formData.reason,
            Comments: formData.comments,
            Requester: currentUser.Title,
            Department: currentUser.Department,
            Email: currentUser.Email,
            JobTitle: currentUser.JobTitle,
            CurrentView: currentView,
            CurrentStep: 1,
            Status: "Pending",
            ApproverHistory: JSON.stringify(approvers)
        };

        try {
            // CALL SUBMIT ONLY ONCE
            const result = await submitFormData(listItem);
            setGeneratedRequestId(result.RequestId);
            setIsReadOnly(true);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        } catch (error) {
            console.error("Submission failed:", error);
            alert('Submission failed. Please try again.');
        }
    };

    const handleApprove = async () => {
        try {
            if (!generatedRequestId) {
                alert("RequestId not found. Cannot approve.");
                return;
            }

            // Pass the string RequestId directly
            const result = await approveWorkFromHomeRequest(generatedRequestId);
            alert("Approved successfully:"+ result)
        } catch (error) {
            console.error("Error approving request", error);
        }
    };

    return (
        <div className={formContainerClass}>
            {/* Header */}
            <Text
                variant="xLarge"
                styles={{
                    root: {
                        fontWeight: 600,
                        marginBottom: 24,
                        color: '#0078d4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12,
                    },
                }}
            >
                <Icon iconName="Work" styles={{ root: { fontSize: 24 } }} />
                Work From Home Request Form
            </Text>

            {/* Requester Info */}
            <Text className={sectionHeaderClass}>Requester Information</Text>
            {currentUser && (
                <div className={formGridClass}>
                    <div>
                        <div className={formItemClass}>
                            <Text className={labelClass}>
                                <Icon iconName="Contact" styles={{ root: { marginRight: 8 } }} />
                                Requester
                            </Text>
                            <Text className={valueClass}>{currentUser.Title}</Text>
                        </div>
                        <div className={formItemClass}>
                            <Text className={labelClass}>
                                <Icon iconName="CityNext" styles={{ root: { marginRight: 8 } }} />
                                Department
                            </Text>
                            <Text className={valueClass}>{currentUser.Department}</Text>
                        </div>
                        <div className={formItemClass}>
                            <Text className={labelClass}>
                                <Icon iconName="Mail" styles={{ root: { marginRight: 8 } }} />
                                Email
                            </Text>
                            <Text className={valueClass}>{currentUser.Email}</Text>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        <div className={formItemClass}>
                            <Text className={labelClass}>
                                <Icon iconName="Phone" styles={{ root: { marginRight: 8 } }} />
                                Contact Details
                            </Text>
                            <Text className={valueClass}>-</Text>
                        </div>
                        <div className={formItemClass}>
                            <Text className={labelClass}>
                                <Icon iconName="WorkforceManagement" styles={{ root: { marginRight: 8 } }} />
                                Job Title
                            </Text>
                            <Text className={valueClass}>{currentUser.JobTitle}</Text>
                        </div>
                        <div className={formItemClass}>
                            <Text className={labelClass}>
                                <Icon iconName="POI" styles={{ root: { marginRight: 8 } }} />
                                Office Location *
                            </Text>
                            <Dropdown
                                options={officeOptions}
                                selectedKey={formData.officeLocation}
                                onChange={(_, option) =>
                                    setFormData({
                                        ...formData,
                                        officeLocation: option?.key.toString() || 'head',
                                    })
                                }
                                styles={{ root: { flex: 1, minWidth: 0 } }}
                                disabled={isReadOnly}
                            />
                        </div>
                    </div>

                    {/* Subject */}
                    <div className={subjectContainerClass}>
                        <TextField
                            label="Subject"
                            required
                            value={formData.subject}
                            onChange={(_, newValue) =>
                                setFormData({ ...formData, subject: newValue || '' })
                            }
                            placeholder="Enter your subject"
                            readOnly={isReadOnly}
                        />
                    </div>
                </div>
            )}

            {/* Dates */}
            <div style={{ marginBottom: '24px' }}>
                <Text className={sectionHeaderClass}>Work From Home Plan</Text>
                <div className={dateSectionClass}>
                    <div className={dateGridClass}>
                        <DatePicker
                            label="Start Date *"
                            value={formData.startDate || undefined}
                            onSelectDate={(date) => setFormData({ ...formData, startDate: date || null })}
                            disabled={isReadOnly}
                        />
                        <DatePicker
                            label="End Date *"
                            value={formData.endDate || undefined}
                            onSelectDate={(date) => setFormData({ ...formData, endDate: date || null })}
                            disabled={isReadOnly}
                        />
                    </div>
                </div>
            </div>

            {/* Reason */}
            <div style={{ marginBottom: '24px' }}>
                <Text className={sectionHeaderClass}>Work From Home Reason</Text>
                <RichTextEditor
                    value={formData.reason}
                    onChange={(value) => setFormData({ ...formData, reason: value })}
                    disabled={isReadOnly}
                />
            </div>

            {/* Attachments */}
            <div style={{ marginBottom: '24px' }}>
                <Text className={sectionHeaderClass}>Attachments</Text>
                <Stack tokens={{ childrenGap: 8 }}>
                    <label htmlFor="fileUpload" className={uploadAreaClass}>
                        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
                            <Icon iconName="Upload" styles={{ root: { fontSize: 24, color: '#0078D4' } }} />
                            <Stack>
                                <Label>Drag and drop files here or click to upload</Label>
                                <Text variant="small">
                                    Supported formats: PDF, DOC, JPG, PNG (Max 5MB each)
                                </Text>
                            </Stack>
                        </Stack>
                        <input
                            id="fileUpload"
                            type="file"
                            accept=".pdf,.doc,.jpg,.png"
                            multiple
                            style={{ display: 'none' }}
                            disabled={isReadOnly}
                        />
                    </label>
                </Stack>
            </div>

            {/* Comments */}
            <Text className={sectionHeaderClass}>Additional Comments</Text>
            <RichTextEditor
                value={formData.comments}
                onChange={(value) => setFormData({ ...formData, comments: value })}
                disabled={isReadOnly}
            />

            {isReadOnly && (
                <div style={{ marginTop: '10px' }}>
                    <Text className={sectionHeaderClass}>Step1 Approver Comments</Text>
                    <RichTextEditor
                        value={firstStepApprover.firstStepcomments}
                        onChange={(value) => setfirstStepApprover({ firstStepcomments: value })}
                    />
                </div>

            )}

            {/* Buttons */}
            <ButtonBar
                isReadOnly={isReadOnly}
                isCurrentApprover={isCurrentApprover}
                onSubmit={handleSubmit}
                onSaveDraft={() => console.log('Save Draft clicked')}
                onCancel={() => console.log('Cancel clicked')}
                onPrint={() => console.log('Print clicked')}
                onApprove={handleApprove}
                onReject={() => console.log('Rejected')}
            />
            {showSuccess && (
                <div className={successMsgClass}>
                    <MessageBar messageBarType={MessageBarType.success}>
                        Your request has been submitted successfully!
                    </MessageBar>
                </div>
            )}
        </div>
    );
};

export default FormHeader;