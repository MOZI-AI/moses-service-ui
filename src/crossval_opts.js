import React from "react";
import { Form, Input, Button, Icon, Divider, Row, Col, Tooltip } from "antd";

export class CrossValidationOptions extends React.Component {
  isValid() {
    const fieldsError = this.props.form.getFieldsError();
    return !Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      this.props.show && <div className="crossValidationOptionsFormWrapper">
        <Form>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={(
                  <Tooltip title="Number of folds for cross-validation">
                    Folds&nbsp;
                  </Tooltip>
                )}
                wrapperCol={{ span: 24 }}>
                {getFieldDecorator("folds", {
                  initialValue: this.props.defaults.folds,
                  rules: [{ required: true, message: "Please input folds!" },
                  {
                    validator: (rule, value, callback) => {
                      if (value < 1) {
                        callback("Number of folds must be one or greater.");
                      }
                      callback();
                    }
                  }]
                })(
                  <Input
                    name="folds"
                    onChange={e =>
                      this.props.changeInput(e)
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Random seed"
                wrapperCol={{ span: 24 }}>
                {getFieldDecorator("randomSeed", {
                  initialValue: this.props.defaults.randomSeed,
                  rules: [
                    { required: true, message: "Please input random seed!" },

                  ]
                })(
                  <Input
                    name="randomSeed"
                    onChange={e =>
                      this.props.changeInput(e)
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={(
                  <Tooltip title="The proportion of the dataset that should be included in the test splie">
                    Test size&nbsp;
                  </Tooltip>
                )}
                wrapperCol={{ span: 24 }}>
                {getFieldDecorator("testSize", {
                  initialValue: this.props.defaults.testSize,
                  rules: [
                    { required: true, message: "Please input test size!" },
                    {
                      validator: (rule, value, callback) => {
                        if (value < 0 || value > 1) {
                          callback("Test size must be between zero and one.");
                        }
                        callback();
                      }
                    }
                  ]
                })(
                  <Input
                    name="testSize"
                    onChange={e =>
                      this.props.changeInput(e)
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider dashed />

        <Row type="flex" justify="end">
          <Col>
            <Button
              style={{ marginRight: '15px' }}
              type="default"
              disabled={!this.isValid()}
              onClick={e => this.props.back()}
            >
              <Icon type="left" /> Back
        </Button>
            <Button
              type="primary"
              disabled={!this.isValid()}
              onClick={e => this.props.submit()}
            >
              <Icon type="check" /> Submit
        </Button>
          </Col>
        </Row>

      </div>
    );
  }
}

export const CrossValidationOptionsForm = Form.create()(CrossValidationOptions);
