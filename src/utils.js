import React from 'react';
import { Snackbar, SnackbarContent, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

export const SERVER_ADDRESS =
  `http://${process.env.SERVICE_ADDR}:7001` || 'http://localhost:7001';

// Parse moses options from options string to JSON
export function parseMosesOptions(mosesOptionString) {
  const mosesOptions = {};
  const additionalParameters = {};

  const optionsArray = mosesOptionString.trim().split(' ');
  const optionKeys = optionsArray.filter((ele, i) => i % 2 === 0);

  optionKeys.map((ele, i) => {
    let value = optionsArray[i * 2 + 1];
    value = isNaN(value) ? value : +value;
    value = value === 'true' || (value === 'false' ? false : value);
    const mapping = MosesOptionsMapping.find(m => m[1] === ele);
    mapping
      ? (mosesOptions[mapping[0]] = [
          '--hc-widen-search',
          '--enable-fs',
          '--balance'
        ].find(k => k === mapping[1])
          ? value == true
          : value)
      : (additionalParameters[ele] = value);
  });

  return {
    mosesOptions: mosesOptions,
    additionalParameters: additionalParameters
  };
}

// convert moses options and additional parameters objects to an option string
export function stringifyMosesOptions(mosesOptions, additionalParameters) {
  const options = Object.assign({}, mosesOptions);
  // if enable feature selection is disabled, remove options related to it
  if (!options.enableFeatureSelection) {
    delete options.featureSelectionAlgorithm;
    delete options.featureSelectionTargetSize;
  }
  // if hcWidenSearch is disabled, remove options related to it
  if (!options.hcWidenSearch) {
    delete options.hcCrossoverMinNeighbors;
    delete options.hcCrossoverPopSize;
  }

  let optionsString = Object.keys(options).reduce((accumulator, key) => {
    return (accumulator += ` ${
      MosesOptionsMapping.find(mapping => mapping[0] === key)[1]
    } ${options[key]}`);
  }, '');

  additionalParameters &&
    (optionsString = Object.keys(additionalParameters).reduce(
      (accumulator, key) => {
        return (accumulator += ` ${key} ${additionalParameters[key]}`);
      },
      optionsString
    ));

  return optionsString.trim();
}

export const checkRequired = value => {
  return value !== ''
    ? null
    : {
        error: true,
        helperText: 'This field is required.'
      };
};

export const checkMin = (value, min) => {
  return value >= min
    ? null
    : {
        error: true,
        helperText: `The value must be ${min} or greater.`
      };
};

export const checkMax = (value, max) => {
  return value <= max
    ? null
    : {
        error: true,
        helperText: `The value must be ${max} or smaller.`
      };
};

export const checkBetween = (value, min, max) => {
  return min <= value && value <= max
    ? null
    : {
        error: true,
        helperText: `The value must be between ${min} and ${max}.`
      };
};

export const checkDuplicate = (value, array) => {
  return array.includes(value)
    ? {
        error: true,
        helperText: `"${value}" already exists.`
      }
    : null;
};

const ErrorSnackbarContent = withStyles({
  root: { background: red[600] },
  message: { color: '#fff' }
})(SnackbarContent);

export const showNotification = ({ message, busy }, callBack) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      style={{ margin: '15px' }}
      open
      autoHideDuration={null}
      onClose={callBack}
    >
      {busy ? (
        <SnackbarContent
          message={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress
                size={24}
                color="secondary"
                style={{ marginRight: '15px' }}
              />
              {message}
            </span>
          }
        />
      ) : (
        <ErrorSnackbarContent message={<span>{message}</span>} />
      )}
    </Snackbar>
  );
};

export const MosesOptionsMapping = [
  ['maximumEvals', '-m'],
  ['resultCount', '--result-count'],
  ['featureSelectionTargetSize', '--fs-target-size'],
  ['numberOfThreads', '-j'],
  ['reductKnobBuildingEffort', '--reduct-knob-building-effort'],
  ['featureSelectionAlgorithm', '--fs-algo'],
  ['complexityRatio', '--complexity-ratio'],
  ['enableFeatureSelection', '--enable-fs'],
  ['hcWidenSearch', '--hc-widen-search'],
  ['balance', '--balance'],
  ['hcCrossoverMinNeighbors', 'hc-crossover-min-neighbors'],
  ['hcCrossoverPopSize', 'hc-crossover-pop-size']
];
