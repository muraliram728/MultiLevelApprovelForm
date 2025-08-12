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
      backgroundColor: '#0078d4', // Fluent UI primary blue
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
      backgroundColor: '#f3f2f1', // Light gray
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
      borderColor: '#0078d4', // Blue border
      color: '#0078d4' // Blue text
    },
    rootHovered: {
      backgroundColor: '#f3f9fd',
      borderColor: '#0078d4'
    }
  }
};

interface IButtonBarProps {
  onSaveDraft?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  onPrint?: () => void;
}

const ButtonBar: React.FC<IButtonBarProps> = ({
  onSaveDraft,
  onSubmit,
  onCancel,
  onPrint,
}) => {
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