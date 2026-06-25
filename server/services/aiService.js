import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

const analyzeTicket = async (title, description) => {
    const response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'user',
                content: `You are a customer support AI assistant. Analyze the support ticket below and respond with a JSON object only. No explanation, no markdown, no backticks, no extra text — just raw JSON.

Ticket Title: "${title}"
Ticket Description: "${description}"

Respond with exactly this JSON structure:
{
  "category": "Billing" or "Technical" or "Account" or "General",
  "priority": "Low" or "Medium" or "High",
  "summary": "One or two sentence professional summary of the core issue"
}`
            }
        ],
        temperature: 0.3,
        max_tokens: 300
    })

    const rawText = response.choices[0].message.content.trim()
    const cleaned = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    return JSON.parse(cleaned)
}

export { analyzeTicket }