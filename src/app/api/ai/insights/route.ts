import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Equipment, AIInsightResponse } from '@/types/equipment';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '' || apiKey === 'your-gemini-api-key-here') {
      return NextResponse.json(
        {
          error:
            'Google Gemini API key is missing or not configured. Please add GEMINI_API_KEY in your .env.local file.',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const equipmentList: Equipment[] = body.equipment || [];

    if (!Array.isArray(equipmentList) || equipmentList.length === 0) {
      return NextResponse.json(
        { error: 'No equipment records provided for AI analysis.' },
        { status: 400 }
      );
    }

    // Initialize Gemini model
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash or gemini-2.0-flash
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    // Format equipment data for the prompt
    const equipmentSummary = equipmentList.map((e) => ({
      name: e.name,
      category: e.category,
      location: e.location,
      status: e.status,
      lastMaintained: e.last_maintained_at,
      maintenanceNotes: e.maintenance_notes || 'None',
    }));

    const prompt = `You are an expert AI Gym Operations & Equipment Optimization Consultant.
Analyze the following live gym equipment data and provide intelligent insights, maintenance priorities, and utilization recommendations.

LIVE GYM EQUIPMENT DATA:
${JSON.stringify(equipmentSummary, null, 2)}

TASK:
1. Provide a concise, professional executive summary of the gym's current equipment availability and operational condition.
2. Identify maintenance priorities: Which equipment items require urgent or upcoming attention based on their status ('maintenance', 'out_of_service') and maintenance notes? Rate urgency as 'high', 'medium', or 'low'.
3. Note demand observations: Which categories or zones appear heavily utilized ('in_use') or under capacity?
4. Provide practical, actionable recommendations for gym staff to improve student/member satisfaction and equipment lifespan.

CRITICAL INSTRUCTION:
- Ground your analysis strictly in the provided data. Do not invent phantom equipment.
- Return ONLY a valid JSON object matching the following TypeScript schema:
{
  "summary": "string",
  "maintenancePriorities": [
    {
      "equipmentName": "string",
      "urgency": "high" | "medium" | "low",
      "reason": "string"
    }
  ],
  "demandObservations": ["string"],
  "recommendations": ["string"],
  "timestamp": "ISO timestamp string"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let parsedData: AIInsightResponse;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // In case json formatting is wrapped in code fences
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    // Fallback timestamp if not provided by model
    if (!parsedData.timestamp) {
      parsedData.timestamp = new Date().toISOString();
    }

    return NextResponse.json(parsedData);
  } catch (error: unknown) {
    console.error('Error generating AI insights:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      { error: `AI analysis failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
