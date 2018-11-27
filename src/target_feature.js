import React from 'react';
import { Form, Tooltip, Input, Button, Icon, Row, Col } from 'antd';

class TargetFeature extends React.Component {
  isValid() {
    const fieldsError = this.props.form.getFieldsError();
    return !Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      this.props.show && (
        <React.Fragment>
          <Form>
            <Form.Item
              label={
                <Tooltip title="The name of the target feature column in the dataset">
                  Target feature&nbsp;
                </Tooltip>
              }
              required
            >
              {getFieldDecorator('targetFeature', {
                initialValue: this.props.defaults.targetFeature,
                rules: [
                  {
                    required: true,
                    message: 'Please input target feature!'
                  }
                ]
              })(
                <Input
                  name="targetFeature"
                  onChange={e => this.props.changeInput(e)}
                />
              )}
            </Form.Item>
          </Form>
          <Row type="flex" justify="end">
            <Col>
              <Button
                style={{ marginRight: '15px' }}
                type="default"
                disabled={!this.isValid()}
                onClick={() => this.props.back()}
              >
                <Icon type="left" /> Back
              </Button>
              <Button
                type="primary"
                disabled={!this.isValid()}
                onClick={() => this.props.submit()}
              >
                <Icon type="check" /> Submit
              </Button>
            </Col>
          </Row>
        </React.Fragment>
      )
    );
  }
}

export const TargetFeatureForm = Form.create()(TargetFeature);
