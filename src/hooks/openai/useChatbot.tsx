// eslint-disable-next-line import/no-extraneous-dependencies
import OpenAI from 'openai';
import { Dispatch, SetStateAction } from 'react';

const apiKey = process.env.REACT_APP_OPENAI_KEY;

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});

export type UseChatbotProps = {
  setLoading: Dispatch<SetStateAction<boolean>>;
  setResponse: Dispatch<SetStateAction<string | null>>;
  prompt: string;
};

const useChatbot = ({ setLoading, setResponse, prompt }: UseChatbotProps) => {
  const ask = () => {
    if (!prompt.length) return;
    (async () => {
      setLoading(true);
      const result = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Talk cordially.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1024,
      });
      setResponse(result.choices[0].message.content);
      setLoading(false);
    })();
  };

  return { ask };
};

export default useChatbot;
