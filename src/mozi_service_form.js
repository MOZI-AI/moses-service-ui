import React from 'react';
import { MosesOptionsForm } from './moses_opts';
import { CrossValidationOptionsForm } from './crossval_opts';
import { DatasetUpload } from './dataset_upload';
import { Steps, Divider } from 'antd';
import { stringifyMosesOptions } from './utils';
import { TargetFeatureForm } from './target_feature';
import { AnalysisParameters, CrossValOptions } from './proto/moses_service_pb';

export class MoziServiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mosesOpts: {
        maximumEvals: 1000,
        featureSelectionTargetSize: 4,
        reductKnobBuildingEffort: 0,
        resultCount: 100,
        numberOfThreads: 8,
        featureSelectionAlgorithm: 'simple',
        enableFeatureSelection: true,
        hcWidenSearch: true,
        balance: true,
        hcCrossoverMinNeighbors: 5000,
        hcCrossoverPopSize: 1000
      },
      additionalParameters: {},
      crossValOptions: {
        folds: 1,
        testSize: 0.3,
        randomSeed: 5
      },
      dataset: undefined,
      targetFeature: 'case',
      datasetFile: undefined,
      currentStep: Options.DATASET
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAdditionalParametersAdded = this.handleAdditionalParametersAdded.bind(
      this
    );
    this.handleAdditionalParametersRemoved = this.handleAdditionalParametersRemoved.bind(
      this
    );
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeStep = this.changeStep.bind(this);
  }

  changeStep(step) {
    this.setState({ currentStep: step });
  }

  handleFileUpload(file) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      let encoded = fileReader.result.replace(/^data:(.*;base64,)?/, '');
      encoded.length % 4 > 0 &&
        (encoded += '='.repeat(4 - (encoded.length % 4)));
      console.log(encoded);
      this.setState({ dataset: encoded, datasetFile: file });
    };
  }

  handleInputChange(option, event) {
    const target = event.target;
    const update = { [target.name]: this.parseValue(target) };
    this.setState(state => {
      switch (option) {
        case Options.MOSES_OPTIONS:
          return { mosesOpts: Object.assign({}, state.mosesOpts, update) };
        case Options.CROSS_VALIDATION_OPTIONS:
          return {
            crossValOptions: Object.assign({}, state.crossValOptions, update)
          };
        case Options.TARGET_FEATURE:
          return { targetFeature: update[target.name] };
        default:
          break;
      }
    });
    event.preventDefault();
  }

  handleAdditionalParametersAdded(name, value) {
    const param = Object.assign({}, this.state.additionalParameters, {
      [name]: value
    });
    this.setState({ additionalParameters: param });
  }

  handleAdditionalParametersRemoved(name) {
    const additionalParameters = Object.assign(
      {},
      this.state.additionalParameters
    );
    delete additionalParameters[name];
    this.setState({ additionalParameters: additionalParameters });
  }

  parseValue(target) {
    if (target.value === '') return '';
    let parsedValue =
      target.type === 'checkbox'
        ? !!+target.checked
        : isNaN(target.value)
        ? target.value
        : +target.value;
    return parsedValue;
  }

  handleSubmit() {
    // if a request is being processed, do nothing and wait for it to finish
    if (this.props.busy) {
      return;
    }
    const crossValOptions = new CrossValOptions();
    crossValOptions.setFolds(this.state.crossValOptions.folds);
    crossValOptions.setRandomseed(this.state.crossValOptions.randomSeed);
    crossValOptions.setTestsize(this.state.crossValOptions.testSize);

    const analysisParameters = new AnalysisParameters();
    analysisParameters.setMosesopts(
      stringifyMosesOptions(
        this.state.mosesOpts,
        this.state.additionalParameters
      )
    );
    analysisParameters.setDataset(this.state.dataset);
    analysisParameters.setTargetFeature(this.state.targetFeature);
    analysisParameters.setCrossvalopts(crossValOptions);

    this.props.handleSubmit(analysisParameters);
  }

  render() {
    return (
      <React.Fragment>
        <Steps progressDot size="small" current={this.state.currentStep}>
          <Steps.Step title="Select Dataset" />
          <Steps.Step title="Moses Options" />
          <Steps.Step title="Cross Validation Options" />
          <Steps.Step title="Target feature" />
        </Steps>
        <Divider dashed />

        <DatasetUpload
          show={this.state.currentStep === Options.DATASET}
          uploadedFile={this.state.datasetFile}
          handleFileUpload={this.handleFileUpload}
          next={() => this.changeStep(Options.MOSES_OPTIONS)}
        />
        <MosesOptionsForm
          show={this.state.currentStep === Options.MOSES_OPTIONS}
          defaults={this.state.mosesOpts}
          additionalParameters={this.state.additionalParameters}
          changeInput={event =>
            this.handleInputChange(Options.MOSES_OPTIONS, event)
          }
          addAdditionalParameter={this.handleAdditionalParametersAdded}
          removeAdditionalParameter={this.handleAdditionalParametersRemoved}
          back={() => this.changeStep(Options.DATASET)}
          next={() => this.changeStep(Options.CROSS_VALIDATION_OPTIONS)}
        />
        <CrossValidationOptionsForm
          show={this.state.currentStep === Options.CROSS_VALIDATION_OPTIONS}
          defaults={this.state.crossValOptions}
          changeInput={event =>
            this.handleInputChange(Options.CROSS_VALIDATION_OPTIONS, event)
          }
          back={() => this.changeStep(Options.MOSES_OPTIONS)}
          next={() => this.changeStep(Options.TARGET_FEATURE)}
        />
        <TargetFeatureForm
          show={this.state.currentStep === Options.TARGET_FEATURE}
          defaults={{ targetFeature: this.state.targetFeature }}
          changeInput={event =>
            this.handleInputChange(Options.TARGET_FEATURE, event)
          }
          back={() => this.changeStep(Options.CROSS_VALIDATION_OPTIONS)}
          submit={this.handleSubmit}
        />
      </React.Fragment>
    );
  }
}

const Options = {
  DATASET: 0,
  MOSES_OPTIONS: 1,
  CROSS_VALIDATION_OPTIONS: 2,
  TARGET_FEATURE: 3
};
