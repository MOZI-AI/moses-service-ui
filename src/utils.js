export const SERVER_ADDRESS =
  process.env.SERVICE_ADDR || 'http://localhost:5000/';

// Parse moses options from options string to JSON
export function parseMosesOptions(options) {
  const splitString = options.split(' ');
  const mosesOptions = {};
  const additionalParameters = {};

  for (let i = 0; i < splitString.length; i = i + 2) {
    const mapping = MosesOptionsMapping.find(m => m[1] === splitString[i]);
    // check if the string is a numeric value, if so convert it to number
    // if not, assign original value
    let value = isNaN(splitString[i + 1])
      ? splitString[i + 1]
      : +splitString[i + 1];
    // check if the string is a boolean value and if so convert it to boolean
    // if not, assign the original value
    value = value === 'true' || (value === 'false' ? false : value);
    // check if the option is included in moses options, if so use the long moses option name, if not add it to additional parameters
    if (mapping) {
      mosesOptions[mapping[0]] = value;
    } else {
      additionalParameters[splitString[i]] = value;
    }
  }
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

  console.log(optionsString.trim());
  return optionsString.trim();
}

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
