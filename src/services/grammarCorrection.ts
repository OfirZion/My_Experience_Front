import OpenAI from 'openai'
const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export async function grammarCorrection(text: string) {
  const response = await client.chat.completions.create({
    model:"gpt-3.5-turbo",
    messages:[
      {
        "role": "system",
        "content": "You will be provided with statements, and your task is to convert them to standard English."
      },
      {
        "role": "user",
        "content": text
      }
    ],
    temperature:0,
    max_tokens:256,
    top_p:1,
    frequency_penalty:0,
    presence_penalty:0
  })
  return response.choices[0].message.content
}