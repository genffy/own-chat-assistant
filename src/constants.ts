
//model options:  https://platform.openai.com/docs/models/gpt-3

export const OPENAI_API_CONFIG = {
  // https://platform.openai.com/docs/api-reference/chat
  createChatCompletion: {
    params: [
      {
        key: 'model',
        name: 'model',
        require: true,
        options: [
          "gpt-4", "gpt-4-0314", "gpt-4-32k", "gpt-4-32k-0314", "gpt-3.5-turbo", "gpt-3.5-turbo-0301"
        ],
        type: 'select',
        default: 'gpt-3.5-turbo'
      },
      {
        key: 'messages',
        name: 'messages',
        // [{"role": "system", "content": "You are a helpful assistant."},
        // {"role": "user", "content": "Who won the world series in 2020?"},
        // {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        // {"role": "user", "content": "Where was it played?"}]
      },
      {
        key: 'temperature',
        name: 'temperature',
        type: 'number',
        steps: 0.1,
        max: 1,
        min: 0,
        default: 0.7,
        desc: ``
      },
      {
        key: 'top_p',
        name: 'top_p',
        type: 'number',
        steps: 1,
        max: 1,
        min: 0,
        default: 1,
        desc: ``
      },
      {
        key: 'frequency_penalty',
        name: 'frequency_penalty',
        type: 'number',
        steps: 1,
        max: 1,
        min: 0,
        default: 0,
        desc: ``
      },
      {
        key: 'presence_penalty',
        name: 'presence_penalty',
        type: 'number',
        steps: 1,
        max: 1,
        min: 0,
        default: 0,
        desc: ``
      },
      {
        key: 'max_tokens',
        name: 'max_tokens',
        type: 'number',
        steps: 1,
        max: 1,
        min: 0,
        default: 500,
        desc: ``
      },
      {
        key: 'n',
        name: 'n',
        type: 'number',
        steps: 1,
        max: 1,
        min: 0,
        default: 1,
        desc: ``
      }
    ]
  },
  // https://platform.openai.com/docs/api-reference/completions/create
  createCompletion: {
    params: [
      {
        key: 'model',
        name: 'model',
        options: [
          "text-davinci-003", "text-davinci-002", "text-curie-001", "text-babbage-001", "text-ada-001", "davinci", "curie", "babbage", "ada"
        ],
        type: 'select',
        default: 'text-davinci-003'
      },

    ]
  }
}
