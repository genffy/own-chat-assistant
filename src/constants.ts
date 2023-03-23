//model options:  https://platform.openai.com/docs/models/gpt-3
interface BASE_INPUT_TYPE {
  key: string;
  name: string;
  desc: string;
  require: boolean;
}
export interface SELEC_INPUT_TYPE extends BASE_INPUT_TYPE {
  type: "select";
  options: string[];
  default: string;
}

export interface NUMBER_INPUT_TYPE extends BASE_INPUT_TYPE {
  type: "number";
  step: number;
  max: number;
  min: number;
  default: number;
}

export type OPENAI_API_CONFIG_PARAMS_TYPE = SELEC_INPUT_TYPE | NUMBER_INPUT_TYPE;

const BASE_COMMON: OPENAI_API_CONFIG_PARAMS_TYPE[] = [
  {
    key: "temperature",
    name: "temperature",
    type: "number",
    require: false,
    step: 0.1,
    max: 2,
    min: 0,
    default: 1,
    desc: `What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
    We generally recommend altering this or top_p but not both.`,
  },
  {
    key: "top_p",
    name: "top_p",
    type: "number",
    require: false,
    step: 0.1,
    max: 1,
    min: 0,
    default: 1,
    desc: `An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
    We generally recommend altering this or temperature but not both.`,
  },
  {
    key: "frequency_penalty",
    name: "frequency_penalty",
    type: "number",
    require: false,
    step: 1,
    max: 2,
    min: -2,
    default: 0,
    desc: `Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.`,
  },
  {
    key: "presence_penalty",
    name: "presence_penalty",
    type: "number",
    require: false,
    step: 1,
    max: 2,
    min: -2,
    default: 0,
    desc: `Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.`,
  },
];

export type OPENAI_API_CONFIG_TYPE = {
  createChatCompletion: OPENAI_API_CONFIG_PARAMS_TYPE[];
  createCompletion: OPENAI_API_CONFIG_PARAMS_TYPE[];
};

export type OPENAI_API_TYPE = keyof OPENAI_API_CONFIG_TYPE;

export const OPENAI_API_CONFIG: OPENAI_API_CONFIG_TYPE = {
  // https://platform.openai.com/docs/api-reference/chat
  createChatCompletion: [
    {
      key: "model",
      name: "model",
      require: true,
      options: [
        "gpt-4",
        "gpt-4-0314",
        "gpt-4-32k",
        "gpt-4-32k-0314",
        "gpt-3.5-turbo",
        "gpt-3.5-turbo-0301",
      ],
      type: "select",
      default: "gpt-3.5-turbo",
      desc: `ID of the model to use. See the [model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility) table for details on which models work with the Chat API.`,
    },
    {
      key: "max_tokens",
      name: "max_tokens",
      type: "number",
      require: false,
      step: 10,
      max: Number.MAX_VALUE,
      min: 1,
      default: 1024,
      desc: `The maximum number of [tokens](https://platform.openai.com/tokenizer) to generate in the chat completion.
        The total length of input tokens and generated tokens is limited by the model's context length.`,
    },
    ...BASE_COMMON,
  ],
  // https://platform.openai.com/docs/api-reference/completions/create
  createCompletion: [
    {
      require: true,
      key: "model",
      name: "model",
      options: [
        "text-davinci-003",
        "text-davinci-002",
        "text-curie-001",
        "text-babbage-001",
        "text-ada-001",
        "davinci",
        "curie",
        "babbage",
        "ada",
      ],
      type: "select",
      default: "text-davinci-003",
      desc: `ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.`,
    },
    {
      require: false,
      key: "max_tokens",
      name: "max_tokens",
      type: "number",
      step: 10,
      max: 4096,
      min: 16,
      default: 1024,
      desc: `The maximum number of [tokens](https://platform.openai.com/tokenizer) to generate in the completion.
      The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).`,
    },
    ...BASE_COMMON,
  ],
};
export type AI_API_CONFIG_TYPE = {
  baidu: AI_API_CONFIG_ITEM_TYPE;
  openai: AI_API_CONFIG_ITEM_TYPE;
  bing: AI_API_CONFIG_ITEM_TYPE;
  bard: AI_API_CONFIG_ITEM_TYPE;
  midjourney: AI_API_CONFIG_ITEM_TYPE;
};
export type AI_API_CONFIG_ITEM_TYPE = {
  disabled: boolean;
  name: string;
  link: string;
  icon: string;
  // FIXME: any
  config: any;
  selected: boolean;
};
export type API_TYPE = keyof AI_API_CONFIG_TYPE;

export const AI_API_CONFIG: AI_API_CONFIG_TYPE = {
  baidu: {
    disabled: true,
    name: "ERNIE Bot",
    link: "https://yiyan.baidu.com/",
    icon: "/yiyan.png",
    config: {},
    selected: false,
  },
  openai: {
    name: "OpenAi Chat",
    link: "https://chat.openai.com/chat",
    icon: "/apple-touch-icon.png",
    config: OPENAI_API_CONFIG,
    selected: true,
    disabled: false,
  },
  bing: {
    disabled: true,
    name: "new Bing",
    icon: "/new-bing.svg",
    link: "https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx",
    config: {},
    selected: false,
  },
  midjourney: {
    disabled: true,
    name: "Midjourney",
    link: "https://www.midjourney.com/home/",
    icon: "/MJ_Favicon.png",
    config: {},
    selected: false,
  },
  bard: {
    disabled: true,
    name: "Bard",
    icon: "/bard.svg",
    link: "https://bard.google.com/",
    config: {},
    selected: false,
  },
};

export const LOCAL_OPENAI_PARAMS_KEY = `openai_params_data_${process.env.NODE_ENV}`;
export const LOCAL_TOGGLE_SETTING_FOLD = `toggle_setting_fold_${process.env.NODE_ENV}`;
