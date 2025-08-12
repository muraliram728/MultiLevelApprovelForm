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
import { submitFormData, getApproversForView } from './sharepoint.service';

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

    useEffect(() => {
        async function fetchData() {
            const approver = await getApproversForView(2)
            console.log("Multi Level Approver From ApproveMatrix List",approver);

        }
        fetchData()
    }, [requestId])

    const handleSubmit = async () => {
        if (!formData.subject || !formData.startDate || !formData.endDate) {
            alert('Please fill all required fields');
            return;
        }

        const listItem = {
            Title: formData.subject,
            OfficeLocation: formData.officeLocation,
            StartDate: formData.startDate.toISOString(),
            EndDate: formData.endDate.toISOString(),
            Reason: formData.reason,
            Comments: formData.comments,
            Requester: "Prathusha",
            Department: "Information Technology",
            Email: "Prathusha@amlakfinance.com",
            JobTitle: "UI Developer"
        };

        try {
            await submitFormData(listItem);
            setFormData({
                subject: '',
                officeLocation: 'head',
                startDate: null,
                endDate: null,
                reason: '',
                comments: ''
            });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        } catch (error) {
            console.error("Submission failed:", error);
            alert('Submission failed. Please try again.');
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
            <div className={formGridClass}>
                <div>
                    <div className={formItemClass}>
                        <Text className={labelClass}>
                            <Icon iconName="Contact" styles={{ root: { marginRight: 8 } }} />
                            Requester
                        </Text>
                        <Text className={valueClass}>Prathusha</Text>
                    </div>
                    <div className={formItemClass}>
                        <Text className={labelClass}>
                            <Icon iconName="CityNext" styles={{ root: { marginRight: 8 } }} />
                            Department
                        </Text>
                        <Text className={valueClass}>Information Technology</Text>
                    </div>
                    <div className={formItemClass}>
                        <Text className={labelClass}>
                            <Icon iconName="Mail" styles={{ root: { marginRight: 8 } }} />
                            Email
                        </Text>
                        <Text className={valueClass}>Prathusha@amlakfinance.com</Text>
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
                        <Text className={valueClass}>UI Developer</Text>
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
                    />
                </div>
            </div>

            {/* Dates */}
            <div style={{ marginBottom: '24px' }}>
                <Text className={sectionHeaderClass}>Work From Home Plan</Text>
                <div className={dateSectionClass}>
                    <div className={dateGridClass}>
                        <DatePicker
                            label="Start Date *"
                            value={formData.startDate || undefined}
                            onSelectDate={(date) => setFormData({ ...formData, startDate: date || null })}
                        />
                        <DatePicker
                            label="End Date *"
                            value={formData.endDate || undefined}
                            onSelectDate={(date) => setFormData({ ...formData, endDate: date || null })}
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
                        />
                    </label>
                </Stack>
            </div>

            {/* Comments */}
            <Text className={sectionHeaderClass}>Additional Comments</Text>
            <RichTextEditor
                value={formData.comments}
                onChange={(value) => setFormData({ ...formData, comments: value })}
            />

            {/* Buttons */}
            <ButtonBar
                onSubmit={handleSubmit}
                onSaveDraft={() => console.log('Save Draft clicked')}
                onPrint={() => console.log('Print clicked')}
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
