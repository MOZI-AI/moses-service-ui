import React from "react";
import {
  Form,
  Input,
  Checkbox,
  Button,
  Icon,
  Divider,
  Row,
  Col,
  Radio,
  Tag
} from "antd";

export class MosesOptions extends React.Component {

  isValid() {
    const fieldsError = this.props.form.getFieldsError();
    return !Object.keys(fieldsError).some(field => fieldsError[field])
      && !this.conditionallyRequired(this.props.defaults.enableFeatureSelection, this.props.defaults.featureSelectionTargetSize)
      && !this.conditionallyRequired(this.props.defaults.hcWidenSearch, this.props.defaults.hcCrossoverMinNeighbors)
      && !this.conditionallyRequired(this.props.defaults.hcWidenSearch, this.props.defaults.hcCrossoverPopSize)
  }

  parseAdditionalParameters() {
    if (!this.props.additionalParameters) return [];
    return Object.keys(this.props.additionalParameters).map(key => { return { name: key, value: this.props.additionalParameters[key] } }
    )
  }

  conditionallyRequired(isRequired, value) {
    return isRequired && !value ? { validateStatus: 'error', help: 'This is required' } : null
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const additionalParameters = this.parseAdditionalParameters();


    return (
      this.props.show && <div className="mosesOptionsFormWrapper">
        <Form>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item>
                {getFieldDecorator("enableFeatureSelection", {
                })(
                  <Checkbox
                    checked={this.props.defaults.enableFeatureSelection}
                    name="enableFeatureSelection"
                    onChange={e => this.props.changeInput(e)}
                  >
                    Enable Feature Selection
                  </Checkbox>
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                {getFieldDecorator("hcWidenSearch", {
                })(
                  <Checkbox
                    checked={this.props.defaults.hcWidenSearch}
                    name="hcWidenSearch"
                    onChange={e => this.props.changeInput(e)}
                  >
                    hc Widen Search
                  </Checkbox>
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                {getFieldDecorator("balance", {
                })(
                  <Checkbox
                    checked={this.props.defaults.balance}
                    name="balance"
                    onChange={e => this.props.changeInput(e)}
                  >
                    Balance
                  </Checkbox>
                )}
              </Form.Item>
            </Col>
          </Row>
          {this.props.defaults.enableFeatureSelection && (
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Feature Selection Algorithm"
                  wrapperCol={{ span: 24 }}
                >
                  {getFieldDecorator("featureSelectionAlgorithm", {
                    initialValue: this.props.defaults.featureSelectionAlgorithm,
                    rules: [
                      {
                        required: true,
                        message: "Please input featureSelectionAlgorithm!"
                      }
                    ]
                  })(
                    <Radio.Group
                      onChange={e => this.props.changeInput(e)}
                      name="featureSelectionAlgorithm"
                    >
                      <Radio.Button value="simple">simple</Radio.Button>
                      <Radio.Button value="inc">inc</Radio.Button>
                      <Radio.Button value="smd">smd</Radio.Button>
                      <Radio.Button value="hc">hc</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {... this.conditionallyRequired(this.props.defaults.enableFeatureSelection, this.props.defaults.featureSelectionTargetSize)}
                  label="Feature Selection Target Size"
                  wrapperCol={{ span: 24 }}
                >
                  {getFieldDecorator("featureSelectionTargetSize", {
                    initialValue: this.props.defaults.featureSelectionTargetSize,
                  })(
                    <Input
                      name="featureSelectionTargetSize"
                      onChange={e => this.props.changeInput(e)}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
          {this.props.defaults.hcWidenSearch && (
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item {... this.conditionallyRequired(this.props.defaults.hcWidenSearch, this.props.defaults.hcCrossoverMinNeighbors)}
                  label="hc Crossover Min Neighbors"
                  wrapperCol={{ span: 24 }}
                >
                  {getFieldDecorator("hcCrossoverMinNeighbors", {
                    initialValue: this.props.defaults.hcCrossoverMinNeighbors,

                  })(
                    <Input
                      name="hcCrossoverMinNeighbors"
                      onChange={e => this.props.changeInput(e)}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {... this.conditionallyRequired(this.props.defaults.hcWidenSearch, this.props.defaults.hcCrossoverPopSize)}
                  label="hc Crossover Pop Size"
                  wrapperCol={{ span: 24 }}
                >
                  {getFieldDecorator("hcCrossoverPopSize", {
                    initialValue: this.props.defaults.hcCrossoverPopSize,

                  })(
                    <Input
                      name="hcCrossoverPopSize"
                      onChange={e => this.props.changeInput(e)}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Maximum evals" wrapperCol={{ span: 24 }}>
                {getFieldDecorator("maximumEvals", {
                  initialValue: this.props.defaults.maximumEvals,
                  rules: [
                    { required: true, message: "Please input maximum evals!" }
                  ]
                })(
                  <Input
                    name="maximumEvals"
                    onChange={e => this.props.changeInput(e)}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Result Count" wrapperCol={{ span: 24 }}>
                {getFieldDecorator("resultCount", {
                  initialValue: this.props.defaults.resultCount,
                  rules: [
                    { required: true, message: "Please input resultCount!" }
                  ]
                })(
                  <Input
                    name="resultCount"
                    onChange={e => this.props.changeInput(e)}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Number Of Threads" wrapperCol={{ span: 24 }}>
                {getFieldDecorator("numberOfThreads", {
                  initialValue: this.props.defaults.numberOfThreads,
                  rules: [
                    { required: true, message: "Please input numberOfThreads!" }
                  ]
                })(
                  <Input
                    name="numberOfThreads"
                    onChange={e => this.props.changeInput(e)}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Reduct Knob Building Effort"
                wrapperCol={{ span: 24 }}
              >
                {getFieldDecorator("reductKnobBuildingEffort", {
                  initialValue: this.props.defaults.reductKnobBuildingEffort,
                  rules: [
                    {
                      required: true,
                      message: "Please input reductKnobBuildingEffort!"
                    }
                  ]
                })(
                  <Radio.Group
                    onChange={e => this.props.changeInput(e)}
                    name="reductKnobBuildingEffort"
                  >
                    <Radio.Button value={0}>0</Radio.Button>
                    <Radio.Button value={1}>1</Radio.Button>
                    <Radio.Button value={2}>2</Radio.Button>
                    <Radio.Button value={3}>3</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Input category" wrapperCol={{ span: 24 }}>
                {getFieldDecorator("inputCategory", {
                  initialValue: this.props.defaults.inputCategory,
                  rules: [
                    { required: true, message: "Please input inputCategory!" }
                  ]
                })(
                  <Input
                    name="inputCategory"
                    onChange={e => this.props.changeInput(e)}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <p>Additional parameters</p>
        {additionalParameters.map(item => {
          return (
            <Tag
              key={item.name}
              onClose={e =>
                this.props.removeAdditionalParameter(item.name)
              }
              closable
              color="blue"
              className="additionalParameter"
            >
              <b>{item.name}</b> {item.value}
            </Tag>
          );
        })}

        <Form layout="inline" style={{ marginTop: "10px" }}>
          <Form.Item>
            {getFieldDecorator("name", {
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (this.props.additionalParameters && this.props.additionalParameters[value]) {
                      callback("The parameter is already added.");
                    }
                    callback();
                  }
                }
              ]
            })(<Input name="name" placeholder="Name" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("value", {})(<Input name="value" placeholder="Value" />)}
          </Form.Item>
          <Button
            className="addAdditionalParameter"
            disabled={this.props.form.getFieldError("name") || !this.props.form.getFieldValue("name") || !this.props.form.getFieldValue("value")}
            onClick={e => {
              this.props.addAdditionalParameter(
                this.props.form.getFieldValue("name"),
                this.props.form.getFieldValue("value")
              );
              this.props.form.setFieldsValue({ name: "" });
              this.props.form.setFieldsValue({ value: "" });
            }}
          >
            <Icon type="plus" /> Add parameter
          </Button>
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
              onClick={e => this.props.next()}
            >
              Next <Icon type="right" />
            </Button>
          </Col>
        </Row>

      </div>
    );
  }
}

export const MosesOptionsForm = Form.create()(MosesOptions);
