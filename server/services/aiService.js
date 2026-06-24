// import { GoogleGenerativeAI } from '@google/generative-ai'

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// const analyzeTicket = async (title, description) => {
//    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

//     const prompt = `You are a customer support AI assistant. Analyze the support ticket below and respond with a JSON object only. No explanation, no markdown, no backticks, no extra text — just raw JSON.

// Ticket Title: "${title}"
// Ticket Description: "${description}"

// Respond with exactly this JSON structure:
// {
//   "category": "Billing" or "Technical" or "Account" or "General",
//   "priority": "Low" or "Medium" or "High",
//   "summary": "One or two sentence professional summary of the core issue"
// }`

//     const result = await model.generateContent(prompt)
//     const rawText = result.response.text().trim()

//     // Gemini sometimes wraps response in ```json ``` even when told not to
//     // This strips it cleanly if present
//     const cleaned = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()

//     return JSON.parse(cleaned)
// }

// export { analyzeTicket }
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const analyzeTicket = async (title, description) => {
    const prompt = `You are a customer support AI assistant. Analyze the support ticket below and respond with a JSON object only. No explanation, no markdown, no backticks, no extra text — just raw JSON.

Ticket Title: "${title}"
Ticket Description: "${description}"

Respond with exactly this JSON structure:
{
  "category": "Billing" or "Technical" or "Account" or "General",
  "priority": "Low" or "Medium" or "High",
  "summary": "One or two sentence professional summary of the core issue"
}`

    // Try models in order until one works
    const modelsToTry = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-2.0-flash-lite',
        'gemini-pro'
    ]

    for (const modelName of modelsToTry) {
        try {
            console.log(`Trying model: ${modelName}`)
            const model = genAI.getGenerativeModel({ model: modelName })
            const result = await model.generateContent(prompt)
            const rawText = result.response.text().trim()
            const cleaned = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
            const parsed = JSON.parse(cleaned)
            console.log(`Success with model: ${modelName}`)
            return parsed
        } catch (err) {
            console.log(`Model ${modelName} failed: ${err.message.slice(0, 80)}`)
            continue
        }
    }

    throw new Error('All Gemini models exhausted')
}

export { analyzeTicket }