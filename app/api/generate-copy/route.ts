import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface BriefContext {
  campaignName: string
  goal: string
  strategy: string
  audience: string
  audienceInsights: string[]
  messagingDirection: {
    theme: string
    dos: string[]
    donts: string[]
  }
  channel: string
  emailNumber: number
  emailPurpose: string
}

interface RefinementRequest {
  originalCopy: {
    subject: string
    preview: string
    body: string
  }
  refinementPrompt: string
  briefContext: BriefContext
}

// Parse JSON safely from Claude's response, handling unescaped newlines in strings
function parseClaudeJson(text: string): unknown {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in response')
  }

  let jsonStr = jsonMatch[0]

  try {
    return JSON.parse(jsonStr)
  } catch {
    // If parsing fails, try to fix unescaped control characters within string values
    // Process character by character, tracking whether we're inside a string
    let result = ''
    let inString = false
    let escape = false

    for (let i = 0; i < jsonStr.length; i++) {
      const char = jsonStr[i]

      if (escape) {
        result += char
        escape = false
        continue
      }

      if (char === '\\' && inString) {
        result += char
        escape = true
        continue
      }

      if (char === '"') {
        inString = !inString
        result += char
        continue
      }

      if (inString) {
        // Escape control characters inside strings
        if (char === '\n') {
          result += '\\n'
        } else if (char === '\r') {
          result += '\\r'
        } else if (char === '\t') {
          result += '\\t'
        } else {
          result += char
        }
      } else {
        result += char
      }
    }

    try {
      return JSON.parse(result)
    } catch (e) {
      console.error('JSON parse failed even after sanitization')
      throw e
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, briefContext, refinementRequest } = body

    if (action === 'generate') {
      return await generateCopyVariations(briefContext)
    } else if (action === 'refine') {
      return await refineCopy(refinementRequest)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Copy generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate copy' },
      { status: 500 }
    )
  }
}

async function generateCopyVariations(briefContext: BriefContext) {
  const systemPrompt = `You are an expert email copywriter for premium retail brands. You write compelling, on-brand marketing copy that drives action while maintaining brand voice.

Your copy should:
- Be concise and scannable
- Lead with value, not features
- Create emotional connection
- Include clear calls-to-action
- Respect brand guidelines strictly

You will generate 3 variations of email copy, each with a different angle:
1. Variation A: Balanced, recommended approach
2. Variation B: More urgency-focused
3. Variation C: More gift/emotional-focused

Respond in JSON format only.`

  const userPrompt = `Generate 3 email copy variations for this campaign:

CAMPAIGN CONTEXT:
- Campaign: ${briefContext.campaignName}
- Goal: ${briefContext.goal}
- Strategy: ${briefContext.strategy}
- Channel Role: ${briefContext.channel}

TARGET AUDIENCE:
- Segment: ${briefContext.audience}
- Key Insights:
${briefContext.audienceInsights.map(i => `  • ${i}`).join('\n')}

MESSAGING DIRECTION:
- Theme: "${briefContext.messagingDirection.theme}"
- DO:
${briefContext.messagingDirection.dos.map(d => `  • ${d}`).join('\n')}
- DON'T:
${briefContext.messagingDirection.donts.map(d => `  • ${d}`).join('\n')}

EMAIL DETAILS:
- Email ${briefContext.emailNumber}: ${briefContext.emailPurpose}

Generate 3 variations with this exact JSON structure:
{
  "variations": [
    {
      "id": "a",
      "label": "VARIATION A",
      "tag": null,
      "subject": "Subject line with {{name}} personalization",
      "preview": "Preview text (50-90 chars)",
      "body": "Full email body with {{name}} and [CTA button text →]",
      "isRecommended": true,
      "reasoning": "Brief explanation of this approach"
    },
    {
      "id": "b",
      "label": "VARIATION B",
      "tag": "More urgency",
      "subject": "...",
      "preview": "...",
      "body": "...",
      "isRecommended": false,
      "reasoning": "..."
    },
    {
      "id": "c",
      "label": "VARIATION C",
      "tag": "Gift-focused",
      "subject": "...",
      "preview": "...",
      "body": "...",
      "isRecommended": false,
      "reasoning": "..."
    }
  ]
}`

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    system: systemPrompt,
  })

  // Extract text content from response
  const textContent = response.content.find(block => block.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in response')
  }

  // Parse JSON from response using safe parser
  const variations = parseClaudeJson(textContent.text)
  return NextResponse.json(variations)
}

async function refineCopy(refinementRequest: RefinementRequest) {
  const { originalCopy, refinementPrompt, briefContext } = refinementRequest

  const systemPrompt = `You are an expert email copywriter. You're refining existing copy based on specific feedback while maintaining brand voice and campaign objectives.`

  const userPrompt = `Refine this email copy based on the feedback:

ORIGINAL COPY:
Subject: ${originalCopy.subject}
Preview: ${originalCopy.preview}
Body:
${originalCopy.body}

REFINEMENT REQUEST: "${refinementPrompt}"

BRAND CONTEXT:
- Theme: "${briefContext.messagingDirection.theme}"
- DON'T: ${briefContext.messagingDirection.donts.join(', ')}

Provide the refined copy and explain what changes you made.

Respond in this exact JSON format:
{
  "refined": {
    "subject": "Refined subject line",
    "preview": "Refined preview text",
    "body": "Refined body copy"
  },
  "changes": [
    "Description of change 1",
    "Description of change 2",
    "Description of change 3"
  ]
}`

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    system: systemPrompt,
  })

  // Extract text content from response
  const textContent = response.content.find(block => block.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in response')
  }

  // Parse JSON from response using safe parser
  const result = parseClaudeJson(textContent.text)
  return NextResponse.json(result)
}
