import * as React from 'react';
import FormHeader from './FormHeader/FormHeader';

const Form = () => {
    return (
        <div style={{ width: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
            <FormHeader requestId={1 } />
        </div>
    )
}

export default Form;
