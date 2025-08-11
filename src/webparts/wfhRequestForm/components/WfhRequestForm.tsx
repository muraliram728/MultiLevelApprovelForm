import * as React from 'react';
import type { IWfhRequestFormProps } from './IWfhRequestFormProps';
import Form from './RequestForm/Form';
import styles from './WfhRequestForm.module.scss';

export default class WfhRequestForm extends React.Component<IWfhRequestFormProps> {
  public render(): React.ReactElement<IWfhRequestFormProps> {

    return (
      <div className={styles.fullPageContainer}>
        <Form />
      </div>
    );
  }
}
