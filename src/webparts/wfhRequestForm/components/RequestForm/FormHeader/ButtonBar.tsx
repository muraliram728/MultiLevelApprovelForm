import * as React from 'react';
import {
  PrimaryButton,
  DefaultButton,
  mergeStyles,
  Stack,
  IButtonStyles
} from '@fluentui/react';

const buttonBarClass = mergeStyles({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 12,
  marginTop: 20,
  paddingTop: 20,
  borderTop: '1px solid #edebe9'
});

// Professional color palette for buttons
const buttonStyles: Record<string, IButtonStyles> = {
  submit: {
    root: {
      backgroundColor: '#0078d4',
      borderColor: '#0078d4',
      color: '#ffffff'
    },
    rootHovered: {
      backgroundColor: '#106ebe',
      borderColor: '#106ebe'
    }
  },
  saveDraft: {
    root: {
      backgroundColor: '#f3f2f1',
      borderColor: '#8a8886',
      color: '#323130'
    },
    rootHovered: {
      backgroundColor: '#e1dfdd',
      borderColor: '#8a8886'
    }
  },
  cancel: {
    root: {
      backgroundColor: '#ffffff',
      borderColor: '#8a8886',
      color: '#323130'
    },
    rootHovered: {
      backgroundColor: '#f3f2f1',
      borderColor: '#8a8886'
    }
  },
  print: {
    root: {
      backgroundColor: '#ffffff',
      borderColor: '#0078d4',
      color: '#0078d4'
    },
    rootHovered: {
      backgroundColor: '#f3f9fd',
      borderColor: '#0078d4'
    }
  },
  approve: {
    root: {
      backgroundColor: '#107c10', // Green for approve
      borderColor: '#107c10',
      color: '#ffffff'
    },
    rootHovered: {
      backgroundColor: '#0e700e',
      borderColor: '#0e700e'
    }
  },
  reject: {
    root: {
      backgroundColor: '#a80000', // Red for reject
      borderColor: '#a80000',
      color: '#ffffff'
    },
    rootHovered: {
      backgroundColor: '#8c0000',
      borderColor: '#8c0000'
    }
  }
};

interface IButtonBarProps {
  onSaveDraft?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  onPrint?: () => void;
  isReadOnly?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  isCurrentApprover?: boolean; // Add this new prop
}

const ButtonBar: React.FC<IButtonBarProps> = ({
  onSaveDraft,
  onSubmit,
  onCancel,
  onPrint,
  isReadOnly = false,
  onApprove,
  onReject,
  isCurrentApprover = false
}) => {
  if (isReadOnly) {
    return (
      <div className={buttonBarClass}>
        <Stack horizontal tokens={{ childrenGap: 12 }}>
          <DefaultButton
            text="Print"
            iconProps={{ iconName: 'Print' }}
            onClick={onPrint}
            styles={buttonStyles.print}
          />
          <DefaultButton
            text="Cancel"
            iconProps={{ iconName: 'Cancel' }}
            onClick={onCancel}
            styles={buttonStyles.cancel}
          />

          {/* Show Approve/Reject only if current user is approver */}
          {isCurrentApprover && (
            <>
              <DefaultButton
                text="Reject"
                iconProps={{ iconName: 'Cancel' }}
                onClick={onReject}
                styles={buttonStyles.reject}
              />
              <PrimaryButton
                text="Approve"
                iconProps={{ iconName: 'CheckMark' }}
                onClick={onApprove}
                styles={buttonStyles.approve}
              />
            </>
          )}
        </Stack>
      </div>
    );
  }

  // Default mode (editable form)
  return (
    <div className={buttonBarClass}>
      <Stack horizontal tokens={{ childrenGap: 12 }}>
        <DefaultButton
          text="Print"
          iconProps={{ iconName: 'Print' }}
          onClick={onPrint}
          styles={buttonStyles.print}
        />
        <DefaultButton
          text="Cancel"
          iconProps={{ iconName: 'Cancel' }}
          onClick={onCancel}
          styles={buttonStyles.cancel}
        />
        <DefaultButton
          text="Save Draft"
          iconProps={{ iconName: 'Save' }}
          onClick={onSaveDraft}
          styles={buttonStyles.saveDraft}
        />
        <PrimaryButton
          text="Submit"
          iconProps={{ iconName: 'Send' }}
          onClick={onSubmit}
          styles={buttonStyles.submit}
        />
      </Stack>
    </div>
  );
};

export default ButtonBar;