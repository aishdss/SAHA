import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  Complaint,
  CrowdsourcedReport,
  AIQueryResponse,
  TransportMode,
  UrgencyLevel,
  JourneyPlanOption
} from "./src/types";
import {
  INITIAL_RECURRING_PATTERNS,
  INITIAL_PREDICTIVE_ALERTS,
  INITIAL_SLA_METRICS,
  INITIAL_CROWDSOURCED_REPORTS
} from "./src/data/transportData";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database for Transport Assist App
let complaintsDb: Complaint[] = [
  {
    id: "inc-101",
    ticketNumber: "INC-2026-0891",
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    userId: "user-1",
    userName: "Rahul Sharma",
    userPhone: "+91 98450 12345",
    mode: "BMTC",
    category: "operational",
    urgency: "OPERATIONAL_HIGH",
    rawMessage: "Bus 500D breakdown right before Marathahalli bridge. Smoke coming from engine, all 65 passengers stranded on outer ring road without alternate bus.",
    structured: {
      routeOrLocation: "BMTC Route 500D near Marathahalli Bridge",
      timeOfIncident: "08:35 AM",
      vehicleRegistration: "KA-01-FA-3942",
      description: "Engine breakdown with smoke emission. Bus stranded in median lane blocking ORR traffic; passengers waiting for depot replacement."
    },
    aiReport: {
      summary: "Engine coolant failure on 500D ORR express bus creating major peak hour bottleneck.",
      rootCauseHypothesis: "Radiator hose blowout under heavy stop-and-go load on Ring Road.",
      suggestedAction: "Dispatch Depot 25 breakdown van immediately and instruct trailing 500D bus KA-01-FA-4100 to onboard stranded passengers.",
      priorityReasoning: "High traffic disruption on arterial Ring Road with 60+ stranded passengers in peak morning commute.",
      confidenceScore: 96
    },
    assignedDepartment: "BMTC Central Traffic Control & Depot 25",
    status: "ACTION_IN_PROGRESS",
    statusHistory: [
      { status: "ROUTED", timestamp: new Date(Date.now() - 34 * 60 * 1000).toISOString(), note: "AI classified as OPERATIONAL_HIGH and routed to BMTC Depot 25", updatedBy: "System AI Classifier" },
      { status: "VIEWED_BY_AUTHORITY", timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), note: "Duty Controller Mr. Venkatesh acknowledged", updatedBy: "BMTC Control Room" },
      { status: "ACTION_IN_PROGRESS", timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), note: "Towing crane and relief bus KA-01-FA-4100 dispatched from HSR depot", updatedBy: "Depot Manager" }
    ],
    isMerged: true,
    mergedComplaintIds: ["inc-102", "inc-103"],
    verifiedResponse: {
      authorityName: "M. Venkatesh (Chief Traffic Controller, BMTC)",
      department: "Bangalore Metropolitan Transport Corporation",
      badge: "VERIFIED_BMTC",
      responseText: "Relief bus KA-01-FA-4100 has arrived at Marathahalli bridge. Stranded passengers have been transferred without additional tickets. Traffic police towing crane is clearing the disabled vehicle from the median lane.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      actionTaken: "Relief bus boarded & traffic lane cleared."
    }
  },
  {
    id: 'inc-104',
    ticketNumber: "INC-2026-0894",
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    userId: "user-2",
    userName: "Sneha Hegde",
    userPhone: "+91 97422 98765",
    mode: "BMRCL",
    category: "safety",
    urgency: "CRITICAL_SAFETY",
    rawMessage: "A man was harassing and following women in the ladies coach at Indiranagar station platform 1. Security guard was absent at that end of the platform.",
    structured: {
      routeOrLocation: "Indiranagar Metro Station Platform 1 (Ladies Coach Area)",
      timeOfIncident: "09:05 AM",
      vehicleRegistration: "Train 04 Purple Line towards Whitefield",
      description: "Severe harassment and intimidation reported in reserved women's coach zone with missing platform security presence."
    },
    aiReport: {
      summary: "Critical safety threat in designated women coach area at Indiranagar Metro concourse.",
      rootCauseHypothesis: "Security post vacancy during shift changeover at platform end.",
      suggestedAction: "Alert next station (Swami Vivekananda Road & Baiyappanahalli) BMRCL station security & Karnataka Industrial Security Force (KISF) officers to inspect coach 1.",
      priorityReasoning: "CRITICAL_SAFETY: Zero tolerance violation involving women safety on mass rapid transit.",
      confidenceScore: 99
    },
    assignedDepartment: "BMRCL Station Security & KISF Emergency Wing",
    status: "HANDED_OFF_TO_HUMAN",
    statusHistory: [
      { status: "ROUTED", timestamp: new Date(Date.now() - 17 * 60 * 1000).toISOString(), note: "AI escalated immediately to Level 1 Safety Alert", updatedBy: "System Safety Trigger" },
      { status: "HANDED_OFF_TO_HUMAN", timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), note: "Auto-escalated to Duty Security Commander with full live transcript", updatedBy: "System Safety Trigger" }
    ],
    isMerged: false,
    humanHandoff: {
      triggered: true,
      reason: "CRITICAL_SAFETY",
      handoffTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      agentAssigned: "Inspector Divya N. (KISF Metro Security)",
      resolutionNotes: "KISF personnel boarded at Baiyappanahalli station; suspect apprehended and taken to custody for questioning. Passenger informed via direct call."
    }
  },
  {
    id: "inc-105",
    ticketNumber: "INC-2026-0897",
    timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    userId: "user-3",
    userName: "Karthik R.",
    userPhone: "+91 99001 54321",
    mode: "AUTOS",
    category: "operational",
    urgency: "OPERATIONAL_MEDIUM",
    rawMessage: "Auto driver KA-04-AB-1928 at MG Road Metro prepaid counter refused to turn on meter and demanded ₹250 for 2.5 km to Richmond Town, threatening to block other autos.",
    structured: {
      routeOrLocation: "MG Road Metro Station Anil Kumble Circle Prepaid Stand",
      timeOfIncident: "08:15 AM",
      vehicleRegistration: "KA-04-AB-1928",
      description: "Meter refusal, overcharging (asking ₹250 instead of official ~₹38 meter fare) and intimidation at designated prepaid counter."
    },
    aiReport: {
      summary: "Commercial auto meter refusal and obstruction of commuters at authorized transit counter.",
      rootCauseHypothesis: "Unregulated rogue driver operating without valid prepaid counter token.",
      suggestedAction: "Log registration KA-04-AB-1928 into Bengaluru Traffic Police (BTP) automated fine e-challan system and dispatch patrol cop at Anil Kumble circle.",
      priorityReasoning: "Consumer protection and regulation enforcement at key transit interchange.",
      confidenceScore: 94
    },
    assignedDepartment: "Bengaluru City Traffic Police (BTP) & RTO Enforcement",
    status: "VIEWED_BY_AUTHORITY",
    statusHistory: [
      { status: "ROUTED", timestamp: new Date(Date.now() - 49 * 60 * 1000).toISOString(), note: "Routed to BTP Traffic Control", updatedBy: "System AI Classifier" },
      { status: "VIEWED_BY_AUTHORITY", timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), note: "Traffic Sub-Inspector review underway", updatedBy: "Cubbon Park Traffic Police Station" }
    ],
    isMerged: false
  }
];

let crowdsourcedReports: CrowdsourcedReport[] = [...INITIAL_CROWDSOURCED_REPORTS];
let informationalQueriesFilteredCount = 142; // Track noise filtering count

// Lazy GenAI initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Helper for Heuristic Fallback Analysis if API Key not present or offline
function fallbackAnalyzeQuery(userText: string, language: 'en' | 'kn' = 'en'): AIQueryResponse {
  const textLower = userText.toLowerCase();

  // Safety keywords
  const isSafety = /harass|molest|assault|emergency|stalk|rob|theft|danger|police|fight|unsafe|help me|accident|bleeding/.test(textLower);
  // Transaction keywords
  const isTransaction = /recharge|buy ticket|purchase ticket|fastag portal|smart card topup|book ticket|irctc booking/.test(textLower);
  // Complaint keywords
  const isComplaint = /complaint|broken|breakdown|refus|overcharg|delay|not arrived|smoke|dirty|pothole|skipped stop|rude|loot|meter/.test(textLower);

  // Detect mode
  let mode: TransportMode = "BMTC";
  if (textLower.includes("metro") || textLower.includes("train") && textLower.includes("purple") || textLower.includes("green line") || textLower.includes("bmrcl")) {
    mode = "BMRCL";
  } else if (textLower.includes("auto") || textLower.includes("rickshaw") || textLower.includes("meter")) {
    mode = "AUTOS";
  } else if (textLower.includes("cab") || textLower.includes("taxi") || textLower.includes("uber") || textLower.includes("ola") || textLower.includes("blusmart")) {
    mode = "TAXIS";
  } else if (textLower.includes("fastag") || textLower.includes("toll") || textLower.includes("plaza")) {
    mode = "FASTAG";
  } else if (textLower.includes("airport") || textLower.includes("flight") || textLower.includes("kia") || textLower.includes("terminal")) {
    mode = "AIRPORT";
  } else if (textLower.includes("railway") || textLower.includes("station") || textLower.includes("ksr") || textLower.includes("yesvantpur") || textLower.includes("smvt")) {
    mode = "RAILWAYS";
  } else if (textLower.includes("majestic") || textLower.includes("platform") || textLower.includes("bay")) {
    mode = "MAJESTIC";
  }

  // 1. TRANSACTION REDIRECT
  if (isTransaction) {
    if (mode === 'FASTAG') {
      return {
        queryType: 'TRANSACTION_REDIRECT',
        mode: 'FASTAG',
        category: 'informational',
        urgency: 'GENERAL_LOW',
        confidence: 95,
        answer: "FASTag recharge is handled strictly through authorized banking and NPCI NETC portals to protect your financial credentials. You can recharge via your bank app, Google Pay/PhonePe, or the official NETC portal.",
        kannadaAnswer: "ಫಾಸ್ಟ್ಯಾಗ್ ರೀಚಾರ್ಜ್ ಅನ್ನು ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು NPCI NETC ಪೋರ್ಟಲ್ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ಮಾಡಬಹುದು. ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಕೆಳಗೆ ನೀಡಿರುವ ಲಿಂಕ್ ಬಳಸಿ.",
        redirectUrl: "https://www.netc.org.in/",
        redirectLabel: "Open NPCI NETC FASTag Portal"
      };
    }
    if (mode === 'BMRCL') {
      return {
        queryType: 'TRANSACTION_REDIRECT',
        mode: 'BMRCL',
        category: 'informational',
        urgency: 'GENERAL_LOW',
        confidence: 95,
        answer: "Metro QR tickets can be booked directly via the official Namma Metro WhatsApp chatbot or the official Namma Metro App.",
        kannadaAnswer: "ನಮ್ಮ ಮೆಟ್ರೋ ಕ್ಯೂಆರ್ ಟಿಕೆಟ್‌ಗಳನ್ನು ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್ (+91 81055 56677) ಅಥವಾ ನಮ್ಮ ಮೆಟ್ರೋ ಆ್ಯಪ್ ಮೂಲಕ ಖರೀದಿಸಬಹುದು.",
        redirectUrl: "https://api.whatsapp.com/send?phone=918105556677&text=Hi",
        redirectLabel: "Open BMRCL WhatsApp Ticket Chat"
      };
    }
    return {
      queryType: 'TRANSACTION_REDIRECT',
      mode: mode,
      category: 'informational',
      urgency: 'GENERAL_LOW',
      confidence: 90,
      answer: "Financial transactions must be executed on certified government and operator portals. Please visit the official authority portal.",
      kannadaAnswer: "ಟಿಕೆಟ್ ಖರೀದಿ ಮತ್ತು ಪಾವತಿಗಳನ್ನು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್ ಮೂಲಕವೇ ಮಾಡಬೇಕು.",
      redirectUrl: "https://mybmtc.karnataka.gov.in/",
      redirectLabel: "Open Official BMTC Portal"
    };
  }

  // 2. CRITICAL SAFETY
  if (isSafety) {
    return {
      queryType: 'COMPLAINT',
      mode: mode,
      category: 'safety',
      urgency: 'CRITICAL_SAFETY',
      confidence: 98,
      answer: "Immediate safety alert logged. Your report has been escalated with the highest priority to security forces and Bangalore Police emergency dispatch (112).",
      kannadaAnswer: "ತುರ್ತು ಸುರಕ್ಷತಾ ದೂರು ದಾಖಲಾಗಿದೆ. ಇದನ್ನು ತಕ್ಷಣವೇ ಬೆಂಗಳೂರು ನಗರ ಪೊಲೀಸ್ ತುರ್ತು ಸಹಾಯವಾಣಿ (112) ಮತ್ತು ಮೆಟ್ರೋ ಭದ್ರತಾ ಸಿಬ್ಬಂದಿಗೆ ರವಾನಿಸಲಾಗಿದೆ.",
      requiresHumanHandoff: true,
      structuredData: {
        routeOrLocation: mode === 'BMRCL' ? 'Metro Concourse / Platform' : 'Transit Point',
        timeOfIncident: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: userText
      },
      aiReport: {
        summary: `Urgent personal safety risk reported in ${mode} sector.`,
        rootCauseHypothesis: "Immediate passenger security jeopardy requiring on-ground security interception.",
        suggestedAction: "Alert patrol officers, station master, and emergency dial 112 with live coordinates.",
        priorityReasoning: "CRITICAL_SAFETY: Top priority tier for passenger well-being and anti-harassment protection.",
        confidenceScore: 99
      }
    };
  }

  // 3. OPERATIONAL COMPLAINT
  if (isComplaint) {
    const urgency: UrgencyLevel = textLower.includes('breakdown') || textLower.includes('smoke') || textLower.includes('stranded') ? 'OPERATIONAL_HIGH' : 'OPERATIONAL_MEDIUM';
    return {
      queryType: 'COMPLAINT',
      mode: mode,
      category: 'operational',
      urgency: urgency,
      confidence: 92,
      answer: `Your issue regarding ${mode} has been structured into an official incident report and dispatched to the duty operations desk. A tracking ticket has been issued.`,
      kannadaAnswer: `${mode} ಗೆ ಸಂಬಂಧಿಸಿದ ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಅಧಿಕೃತ ದೂರು ಎಂದು ದಾಖಲಿಸಿ, ಪರಿಶೀಲನೆಗಾಗಿ ಸಂಬಂಧಪಟ್ಟ ನಿಯಂತ್ರಣ ಕಚೇರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.`,
      structuredData: {
        routeOrLocation: textLower.includes('500d') ? 'Route 500D (Outer Ring Road)' : textLower.includes('marathahalli') ? 'Marathahalli Junction' : `${mode} Transit Network`,
        timeOfIncident: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: userText
      },
      aiReport: {
        summary: `Operational disruption reported on ${mode} network.`,
        rootCauseHypothesis: "Service regularity or fleet mechanical issue affecting commuter schedule.",
        suggestedAction: "Route to divisional depot manager for immediate investigation and status callback.",
        priorityReasoning: "Operational disruption requiring fleet or service intervention.",
        confidenceScore: 91
      }
    };
  }

  // 4. INFORMATIONAL QUERY (Filtered out of complaints queue!)
  informationalQueriesFilteredCount++;
  let directInfo = `Here is information regarding ${mode}:`;
  let kannadaInfo = `${mode} ಕುರಿತ ಮಾಹಿತಿ:`;

  if (textLower.includes('where is my bus') || textLower.includes('500d')) {
    directInfo = "BMTC Route 500D runs from Central Silk Board to Hebbal via Marathahalli & Bellandur. High-frequency service runs every 5 to 8 minutes. Current live status shows active buses every 4-7 minutes along the Outer Ring Road.";
    kannadaInfo = "ಬಿಎಂಟಿಸಿ ಮಾರ್ಗ 500ಡಿ ಸೆಂಟ್ರಲ್ ಸಿಲ್ಕ್ ಬೋರ್ಡ್‌ನಿಂದ ಹೆಬ್ಬಾಳದವರೆಗೆ ಪ್ರತಿ 5-8 ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ಸಂಚರಿಸುತ್ತದೆ. ಪ್ರಸ್ತುತ ಬಸ್ಸುಗಳು ಸಾಮಾನ್ಯ ಸಮಯದಲ್ಲಿ ಸಂಚರಿಸುತ್ತಿವೆ.";
  } else if (textLower.includes('airport') || textLower.includes('kia') || textLower.includes('vayu vajra')) {
    directInfo = "BMTC operates 24x7 Vayu Vajra luxury AC buses to Kempegowda International Airport. From Majestic (KBS Platform 30), take KIA-9 which departs every 15 minutes. Flat fare is ₹250.";
    kannadaInfo = "ಕೆಂಪೇಗೌಡ ಅಂತರರಾಷ್ಟ್ರೀಯ ವಿಮಾನ ನಿಲ್ದಾಣಕ್ಕೆ ಮೆಜೆಸ್ಟಿಕ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 30 ರಿಂದ ಕೆಐಎ-9 ವಾಯು ವಜ್ರ ಬಸ್ ಪ್ರತಿ 15 ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ಹೊರಡುತ್ತದೆ. ದರ ₹250.";
  } else if (textLower.includes('metro') || textLower.includes('timing') || textLower.includes('frequency')) {
    directInfo = "Namma Metro operates daily from 5:00 AM to 11:00 PM (starts 7:00 AM on Sundays). Peak frequency is every 3.5 minutes on the Purple Line and 5 minutes on the Green Line. Interchange is at Nadaprabhu Kempegowda Majestic Station.";
    kannadaInfo = "ನಮ್ಮ ಮೆಟ್ರೋ ಬೆಳಗ್ಗೆ 5:00 ರಿಂದ ರಾತ್ರಿ 11:00 ರವರೆಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ. ಪೀಕ್ ಸಮಯದಲ್ಲಿ ಪ್ರತಿ 3.5 ನಿಮಿಷಕ್ಕೊಂದು ರೈಲು ಇರುತ್ತದೆ.";
  } else if (textLower.includes('auto') || textLower.includes('fare') || textLower.includes('meter')) {
    directInfo = "Official Bangalore Auto Meter Tariff: Minimum fare is ₹30 for the first 2 kilometers. Thereafter, ₹15 per additional kilometer. Night charges (10:00 PM to 5:00 AM) are 1.5x of the daytime meter reading.";
    kannadaInfo = "ಬೆಂಗಳೂರು ಆಟೋ ದರ: ಮೊದಲ 2 ಕಿ.ಮೀ.ಗೆ ಕನಿಷ್ಠ ₹30, ನಂತರ ಪ್ರತಿ ಕಿ.ಮೀ.ಗೆ ₹15. ರಾತ್ರಿ 10 ರಿಂದ ಬೆಳಗ್ಗೆ 5 ರವರೆಗೆ 1.5 ಪಟ್ಟು ದರ.";
  } else if (textLower.includes('majestic') || textLower.includes('platform')) {
    directInfo = "Kempegowda Bus Station (Majestic) Platform Guide: Platforms 1-4 (Hosur Rd / Electronic City), 5-8 (Jayanagar / Banashankari), 9-12 (Mysore Rd / Kengeri), 16-19 (Whitefield / ITPL), 20-24 (Shivajinagar / Hennur), 29-30 (Airport KIA Vayu Vajra).";
    kannadaInfo = "ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣ ಮಾರ್ಗದರ್ಶಿ: ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 1-4 (ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ), 16-19 (ವೈಟ್‌ಫೀಲ್ಡ್), 29-30 (ವಿಮಾನ ನಿಲ್ದಾಣ ವಾಯು ವಜ್ರ).";
  } else {
    directInfo = `Transport Assist response for ${mode}: All routes, live timings, and fare charts are consolidated on the respective mode tabs. Let us know if you need specific route guidance or want to report an issue.`;
    kannadaInfo = `${mode} ಕುರಿತು ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಲಭ್ಯವಿದೆ. ದಯವಿಟ್ಟು ನಿಖರವಾದ ಮಾರ್ಗ ಅಥವಾ ನಿಲ್ದಾಣದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.`;
  }

  return {
    queryType: 'INFORMATIONAL_QUERY',
    mode: mode,
    category: 'informational',
    urgency: 'GENERAL_LOW',
    confidence: 94,
    answer: directInfo,
    kannadaAnswer: kannadaInfo
  };
}

// Check for duplicate complaints to merge
function findDuplicateComplaint(mode: TransportMode, locationOrRoute: string): Complaint | null {
  const cutoffTime = Date.now() - 2 * 60 * 60 * 1000; // within last 2 hours
  const normalizedSearch = locationOrRoute.toLowerCase().trim();

  for (const item of complaintsDb) {
    if (new Date(item.timestamp).getTime() >= cutoffTime && item.mode === mode && item.status !== 'RESOLVED') {
      const existingLoc = (item.structured.routeOrLocation || "").toLowerCase();
      const existingDesc = (item.structured.description || "").toLowerCase();

      // Check keyword similarity
      const tokens = normalizedSearch.split(/\s+/).filter(t => t.length > 3);
      const match = tokens.some(t => existingLoc.includes(t) || existingDesc.includes(t));

      if (match) {
        return item;
      }
    }
  }
  return null;
}

// ---------------- API ROUTES ----------------

// 1. AI 3-Layer Query Pipeline
app.post("/api/ai/query", async (req, res) => {
  try {
    const { userText, userProfile, language = 'en' } = req.body;

    if (!userText || typeof userText !== "string") {
      return res.status(400).json({ error: "Missing or invalid query text" });
    }

    let parsedResult: AIQueryResponse;
    const ai = getGenAI();

    if (ai) {
      try {
        const prompt = `You are the AI core for the "All-in-One Transport Assist" platform for Bengaluru, India (covering BMTC buses, BMRCL metro, Autos, Taxis, FASTag, KIA Airport, Railways, and the Majestic Bus Station).
Classify the user's input with high precision according to the 3-layer pipeline rules:

INPUT: "${userText}"
USER CONTEXT: Name: ${userProfile?.name || 'Commuter'}, Home: ${userProfile?.homeLocation || 'Bangalore'}, Language: ${language}

Pipeline Rules:
1. QUERY CLASSIFICATION (queryType):
   - "INFORMATIONAL_QUERY": When the user asks about routes, timings, where is my bus, platform numbers, fare charts, general directions. In this case, provide a direct, comprehensive answer (English and Kannada). Do NOT log as a complaint!
   - "TRANSACTION_REDIRECT": When the user wants to buy tickets, recharge FASTag, recharge smart card, or do financial transactions. Instruct them why official portals are required and provide redirectUrl and redirectLabel.
   - "COMPLAINT": When the user reports an actual problem, breakdown, harassment, rude behavior, meter refusal, severe delay, waterlogging, pothole, safety issue.
2. MODE: Must be one of ["BMTC", "BMRCL", "AUTOS", "TAXIS", "FASTAG", "AIRPORT", "RAILWAYS", "MAJESTIC", "GENERAL"].
3. CATEGORY: "safety" | "operational" | "informational".
4. URGENCY:
   - "CRITICAL_SAFETY" for harassment, threat, broken signal, emergency, physical danger.
   - "OPERATIONAL_HIGH" for vehicle breakdown, smoke, major route blockage, severe stranded delay.
   - "OPERATIONAL_MEDIUM" for meter refusal, overcharging, rude behavior, skipped stop.
   - "GENERAL_LOW" for informational queries or minor feedback.
5. If COMPLAINT:
   - structuredData: { routeOrLocation, timeOfIncident, vehicleRegistration, description }
   - aiReport: { summary, rootCauseHypothesis, suggestedAction, priorityReasoning }
   - requiresHumanHandoff: true if safety emergency, user expresses extreme distress, or complex case.

Return ONLY valid JSON with this exact structure:
{
  "queryType": "INFORMATIONAL_QUERY" | "COMPLAINT" | "TRANSACTION_REDIRECT",
  "mode": "BMTC" | "BMRCL" | "AUTOS" | "TAXIS" | "FASTAG" | "AIRPORT" | "RAILWAYS" | "MAJESTIC" | "GENERAL",
  "category": "safety" | "operational" | "informational",
  "urgency": "CRITICAL_SAFETY" | "OPERATIONAL_HIGH" | "OPERATIONAL_MEDIUM" | "GENERAL_LOW",
  "confidence": 95,
  "answer": "Clear, helpful English response",
  "kannadaAnswer": "ಸಹಾಯಕವಾದ ಕನ್ನಡ ವಿವರಣೆ",
  "redirectUrl": "optional URL",
  "redirectLabel": "optional button label",
  "structuredData": {
    "routeOrLocation": "string",
    "timeOfIncident": "string",
    "vehicleRegistration": "string or undefined",
    "description": "string"
  },
  "aiReport": {
    "summary": "string",
    "rootCauseHypothesis": "string",
    "suggestedAction": "string",
    "priorityReasoning": "string"
  },
  "requiresHumanHandoff": false
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        const textOutput = response.text || "";
        parsedResult = JSON.parse(textOutput);
      } catch (geminiErr) {
        console.warn("Gemini generation fallback:", geminiErr);
        parsedResult = fallbackAnalyzeQuery(userText, language);
      }
    } else {
      parsedResult = fallbackAnalyzeQuery(userText, language);
    }

    // Now execute Layer 2: Analysis, Duplicate Merge & Queue Routing
    if (parsedResult.queryType === 'INFORMATIONAL_QUERY') {
      informationalQueriesFilteredCount++;
      return res.json(parsedResult);
    }

    if (parsedResult.queryType === 'TRANSACTION_REDIRECT') {
      return res.json(parsedResult);
    }

    // It is an actual COMPLAINT:
    const mode = (parsedResult.mode === 'GENERAL' ? 'BMTC' : parsedResult.mode) as TransportMode;
    const loc = parsedResult.structuredData?.routeOrLocation || parsedResult.mode;

    // Check for duplicate merging
    const existingMaster = findDuplicateComplaint(mode, loc);
    const newId = `inc-${Date.now()}`;
    const newTicketNumber = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    let assignedDept = "BMTC Central Control";
    if (mode === 'BMRCL') assignedDept = "BMRCL Operations & Security";
    else if (mode === 'AUTOS') assignedDept = "Bengaluru Traffic Police & RTO Enforcement";
    else if (mode === 'TAXIS') assignedDept = "RTO Taxi Cell & Transport Commissionerate";
    else if (mode === 'FASTAG') assignedDept = "NHAI & Toll Plaza Operations Cell";
    else if (mode === 'AIRPORT') assignedDept = "Bangalore International Airport Ltd (BIAL) Ground Ops";
    else if (mode === 'RAILWAYS') assignedDept = "South Western Railway Division Control";
    else if (mode === 'MAJESTIC') assignedDept = "Majestic Terminal Station Superintendent";

    const initialStatus = parsedResult.urgency === 'CRITICAL_SAFETY' ? 'HANDED_OFF_TO_HUMAN' : 'ROUTED';

    const newComplaint: Complaint = {
      id: newId,
      ticketNumber: newTicketNumber,
      timestamp: new Date().toISOString(),
      userId: userProfile?.id || 'guest-user',
      userName: userProfile?.name || 'Anonymous Commuter',
      userPhone: userProfile?.phone || '+91 98000 00000',
      mode: mode,
      category: parsedResult.category || 'operational',
      urgency: parsedResult.urgency || 'OPERATIONAL_MEDIUM',
      rawMessage: userText,
      structured: {
        routeOrLocation: parsedResult.structuredData?.routeOrLocation || loc,
        timeOfIncident: parsedResult.structuredData?.timeOfIncident || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        vehicleRegistration: parsedResult.structuredData?.vehicleRegistration,
        description: parsedResult.structuredData?.description || userText
      },
      aiReport: {
        summary: parsedResult.aiReport?.summary || `Incident report filed on ${mode}`,
        rootCauseHypothesis: parsedResult.aiReport?.rootCauseHypothesis || "Service failure requiring investigation",
        suggestedAction: parsedResult.aiReport?.suggestedAction || "Inspect on-ground telemetry and contact duty staff",
        priorityReasoning: parsedResult.aiReport?.priorityReasoning || `Prioritized as ${parsedResult.urgency}`,
        confidenceScore: parsedResult.confidence || 92
      },
      assignedDepartment: assignedDept,
      status: initialStatus,
      statusHistory: [
        {
          status: 'ROUTED',
          timestamp: new Date().toISOString(),
          note: `Classified by AI as ${parsedResult.urgency} and routed to ${assignedDept}`,
          updatedBy: 'AI Classification Engine'
        }
      ],
      isMerged: false
    };

    if (parsedResult.urgency === 'CRITICAL_SAFETY' || parsedResult.requiresHumanHandoff) {
      newComplaint.humanHandoff = {
        triggered: true,
        reason: 'CRITICAL_SAFETY',
        handoffTime: new Date().toISOString(),
        agentAssigned: "Senior Emergency Desk Dispatcher"
      };
      newComplaint.statusHistory.push({
        status: 'HANDED_OFF_TO_HUMAN',
        timestamp: new Date().toISOString(),
        note: "Auto-escalated to human duty officer due to critical safety urgency",
        updatedBy: "Safety Guard Automation"
      });
    }

    if (existingMaster) {
      // Merge with existing master incident!
      newComplaint.isMerged = true;
      newComplaint.masterIncidentId = existingMaster.id;

      if (!existingMaster.mergedComplaintIds) {
        existingMaster.mergedComplaintIds = [];
      }
      existingMaster.mergedComplaintIds.push(newComplaint.id);
      existingMaster.isMerged = true;

      existingMaster.statusHistory.push({
        status: existingMaster.status,
        timestamp: new Date().toISOString(),
        note: `Additional commuter report merged: Ticket ${newTicketNumber} (${userProfile?.name || 'Commuter'}). Total reports: ${existingMaster.mergedComplaintIds.length + 1}`,
        updatedBy: 'Duplicate Auto-Merge Pipeline'
      });

      complaintsDb.unshift(newComplaint);

      parsedResult.complaintCreated = newComplaint;
      parsedResult.duplicateMergedWith = {
        masterTicketNumber: existingMaster.ticketNumber,
        existingCount: existingMaster.mergedComplaintIds.length + 1,
        incidentSummary: existingMaster.aiReport.summary
      };

      return res.json(parsedResult);
    }

    // Insert new complaint
    complaintsDb.unshift(newComplaint);
    parsedResult.complaintCreated = newComplaint;
    return res.json(parsedResult);

  } catch (error) {
    console.error("AI Query processing error:", error);
    res.status(500).json({ error: "Internal error processing query" });
  }
});

// 2. Complaint Management Endpoints
app.get("/api/complaints", (req, res) => {
  const { mode, urgency, status, search, hideMerged } = req.query;
  let filtered = [...complaintsDb];

  if (mode && mode !== 'ALL') {
    filtered = filtered.filter(c => c.mode === mode);
  }
  if (urgency && urgency !== 'ALL') {
    filtered = filtered.filter(c => c.urgency === urgency);
  }
  if (status && status !== 'ALL') {
    filtered = filtered.filter(c => c.status === status);
  }
  if (hideMerged === 'true') {
    filtered = filtered.filter(c => !c.masterIncidentId);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(c =>
      c.ticketNumber.toLowerCase().includes(q) ||
      c.rawMessage.toLowerCase().includes(q) ||
      c.structured.routeOrLocation.toLowerCase().includes(q) ||
      c.userName.toLowerCase().includes(q)
    );
  }

  res.json({
    complaints: filtered,
    totalCount: complaintsDb.length,
    informationalFilteredOut: informationalQueriesFilteredCount
  });
});

app.get("/api/complaints/:id", (req, res) => {
  const found = complaintsDb.find(c => c.id === req.params.id || c.ticketNumber === req.params.id);
  if (!found) return res.status(404).json({ error: "Complaint not found" });

  let mergedChildren: Complaint[] = [];
  if (found.mergedComplaintIds && found.mergedComplaintIds.length > 0) {
    mergedChildren = complaintsDb.filter(c => found.mergedComplaintIds?.includes(c.id));
  }

  res.json({ complaint: found, mergedChildren });
});

app.post("/api/complaints/:id/status", (req, res) => {
  const { status, note, authorityName, department, badge, actionTaken } = req.body;
  const complaint = complaintsDb.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  complaint.status = status;
  complaint.statusHistory.push({
    status: status,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${status}`,
    updatedBy: authorityName || "Duty Authority"
  });

  if (actionTaken || note) {
    complaint.verifiedResponse = {
      authorityName: authorityName || "Verified Transport Officer",
      department: department || complaint.assignedDepartment,
      badge: badge || "VERIFIED_BMTC",
      responseText: note || "Action initiated by verified transport command.",
      timestamp: new Date().toISOString(),
      actionTaken: actionTaken || "Official response logged."
    };
  }

  // If this is a master incident, cascade notification and status to all merged complaints!
  if (complaint.mergedComplaintIds && complaint.mergedComplaintIds.length > 0) {
    for (const childId of complaint.mergedComplaintIds) {
      const child = complaintsDb.find(c => c.id === childId);
      if (child) {
        child.status = status;
        child.statusHistory.push({
          status: status,
          timestamp: new Date().toISOString(),
          note: `Master Incident (${complaint.ticketNumber}) updated: ${note}`,
          updatedBy: `${authorityName} (Master Incident Sync)`
        });
        child.verifiedResponse = complaint.verifiedResponse;
      }
    }
  }

  res.json({ success: true, complaint });
});

app.post("/api/complaints/:id/handoff", (req, res) => {
  const { reason = "USER_UNSATISFIED", notes = "Commuter requested human operator escalation" } = req.body;
  const complaint = complaintsDb.find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  complaint.status = "HANDED_OFF_TO_HUMAN";
  complaint.humanHandoff = {
    triggered: true,
    reason: reason,
    handoffTime: new Date().toISOString(),
    agentAssigned: "Duty Human Support Officer",
    resolutionNotes: notes
  };
  complaint.statusHistory.push({
    status: "HANDED_OFF_TO_HUMAN",
    timestamp: new Date().toISOString(),
    note: `Human Handoff triggered (${reason}): ${notes}`,
    updatedBy: "Escalation Engine"
  });

  res.json({ success: true, complaint });
});

// 3. Authority Dashboard Analytics & Triage
app.get("/api/authority/analytics", (req, res) => {
  const activeCount = complaintsDb.filter(c => c.status !== 'RESOLVED').length;
  const safetyCount = complaintsDb.filter(c => c.urgency === 'CRITICAL_SAFETY' && c.status !== 'RESOLVED').length;
  const highOperationalCount = complaintsDb.filter(c => c.urgency === 'OPERATIONAL_HIGH' && c.status !== 'RESOLVED').length;
  const humanHandoffCount = complaintsDb.filter(c => c.status === 'HANDED_OFF_TO_HUMAN').length;

  res.json({
    metrics: {
      activeComplaints: activeCount,
      criticalSafetyCount: safetyCount,
      highOperationalCount: highOperationalCount,
      humanHandoffQueueCount: humanHandoffCount,
      noiseFilteredCount: informationalQueriesFilteredCount,
      resolvedTotal: complaintsDb.filter(c => c.status === 'RESOLVED').length
    },
    recurringPatterns: INITIAL_RECURRING_PATTERNS,
    predictiveAlerts: INITIAL_PREDICTIVE_ALERTS,
    slaMetrics: INITIAL_SLA_METRICS
  });
});

// 4. Crowdsourced Micro-Reporting Endpoints
app.get("/api/crowdsourced", (req, res) => {
  res.json({ reports: crowdsourcedReports });
});

app.post("/api/crowdsourced", (req, res) => {
  const { type, mode, location, title, description, coordinates } = req.body;
  const newReport: CrowdsourcedReport = {
    id: `crowd-${Date.now()}`,
    type: type || 'crowded_bus',
    mode: mode || 'BMTC',
    location: location || 'Bangalore City',
    coordinates: coordinates || { x: 50, y: 50 },
    title: title || 'Commuter Report',
    description: description || '',
    timestamp: 'Just now',
    upvotes: 1,
    userUpvoted: true,
    verifiedByAuthority: false,
    status: 'ACTIVE'
  };

  crowdsourcedReports.unshift(newReport);
  res.json({ success: true, report: newReport });
});

app.post("/api/crowdsourced/:id/upvote", (req, res) => {
  const report = crowdsourcedReports.find(r => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: "Report not found" });

  if (report.userUpvoted) {
    report.upvotes = Math.max(0, report.upvotes - 1);
    report.userUpvoted = false;
  } else {
    report.upvotes += 1;
    report.userUpvoted = true;
  }

  res.json({ success: true, upvotes: report.upvotes, userUpvoted: report.userUpvoted });
});

// 5. Multi-modal Journey Planner Algorithm
app.post("/api/journey/plan", (req, res) => {
  const { from = "Silk Board", to = "ITPL Whitefield" } = req.body;
  const fromClean = (from as string).trim();
  const toClean = (to as string).trim();

  // Multi-modal intelligent journey generation
  const options: JourneyPlanOption[] = [
    {
      id: "opt-1",
      title: "Smart Multi-Modal (Bus + Metro Feeder)",
      tag: "FASTEST",
      totalDurationMinutes: 48,
      totalCost: 55,
      carbonSavingsKg: 3.8,
      steps: [
        {
          mode: "WALK",
          instruction: `Walk 250m to ${fromClean} Bus Shelter`,
          kannadaInstruction: `${fromClean} ಬಸ್ ನಿಲ್ದಾಣಕ್ಕೆ 250 ಮೀಟರ್ ನಡೆದು ಹೋಗಿ`,
          detail: "Follow pedestrian footpath towards main bus bay",
          durationMinutes: 4,
          distanceKm: 0.25,
          fare: 0
        },
        {
          mode: "BUS",
          instruction: "Board BMTC Vajra 500-D (AC) towards KR Puram",
          kannadaInstruction: "ಕೆ ಆರ್ ಪುರಂ ಕಡೆಗೆ ಬಿಎಂಟಿಸಿ ವಜ್ರ 500-ಡಿ ಬಸ್ ಹತ್ತಿ",
          detail: "Direct Ring Road bus, every 6 mins. Disembark at KR Puram Metro Station",
          durationMinutes: 24,
          distanceKm: 9.2,
          fare: 25,
          routeCode: "500-D",
          stopsCount: 7
        },
        {
          mode: "METRO",
          instruction: "Transfer to BMRCL Purple Line at KR Puram",
          kannadaInstruction: "ಕೆ ಆರ್ ಪುರಂನಲ್ಲಿ ನಮ್ಮ ಮೆಟ್ರೋ ನೇರಳೆ ಮಾರ್ಗಕ್ಕೆ ಬದಲಾಯಿಸಿ",
          detail: "Take train towards Whitefield (Kadugodi). Platform 2",
          durationMinutes: 14,
          distanceKm: 6.8,
          fare: 30,
          platform: "Platform 2 (Eastbound)",
          stopsCount: 6
        },
        {
          mode: "WALK",
          instruction: `Walk 200m to arrive at ${toClean}`,
          kannadaInstruction: `${toClean} ತಲುಪಲು 200 ಮೀಟರ್ ನಡೆಯಿರಿ`,
          detail: "Exit via Skywalk Gate B",
          durationMinutes: 6,
          distanceKm: 0.2,
          fare: 0
        }
      ]
    },
    {
      id: "opt-2",
      title: "Economy Direct BMTC Express Bus",
      tag: "CHEAPEST",
      totalDurationMinutes: 65,
      totalCost: 35,
      carbonSavingsKg: 4.5,
      steps: [
        {
          mode: "WALK",
          instruction: `Walk to ${fromClean} Main Stop`,
          kannadaInstruction: `${fromClean} ಮುಖ್ಯ ನಿಲ್ದಾಣಕ್ಕೆ ನಡೆಯಿರಿ`,
          detail: "Bay 2",
          durationMinutes: 5,
          distanceKm: 0.3,
          fare: 0
        },
        {
          mode: "BUS",
          instruction: `Board Direct BMTC 500-CA Ordinary or Suvarna Bus to ${toClean}`,
          kannadaInstruction: `ನೇರ ಬಿಎಂಟಿಸಿ 500-ಸಿಎ ಬಸ್ ಹತ್ತಿ`,
          detail: "Single bus route, no interchange required",
          durationMinutes: 60,
          distanceKm: 18.5,
          fare: 35,
          routeCode: "500-CA",
          stopsCount: 16
        }
      ]
    },
    {
      id: "opt-3",
      title: "Prepaid Auto Rickshaw (Direct Door-to-Door)",
      tag: "MIN_TRANSFERS",
      totalDurationMinutes: 42,
      totalCost: 195,
      carbonSavingsKg: 1.2,
      steps: [
        {
          mode: "AUTO",
          instruction: `Hire Metered Auto from ${fromClean} to ${toClean}`,
          kannadaInstruction: `${fromClean} ನಿಂದ ${toClean} ಗೆ ಮೀಟರ್ ಆಟೋ ಹತ್ತಿ`,
          detail: "Standard government tariff (₹30 for first 2 km + ₹15/km)",
          durationMinutes: 42,
          distanceKm: 13.0,
          fare: 195
        }
      ]
    },
    {
      id: "opt-4",
      title: "App Cab / Taxi (AC Sedan)",
      tag: "DIRECT_CAB",
      totalDurationMinutes: 38,
      totalCost: 340,
      carbonSavingsKg: 0.4,
      steps: [
        {
          mode: "CAB",
          instruction: `Book Uber / Ola / BluSmart / Namma Yatri Cab to ${toClean}`,
          kannadaInstruction: `${toClean} ಗೆ ಆ್ಯಪ್ ಕ್ಯಾಬ್ ಬುಕ್ ಮಾಡಿ`,
          detail: "Fastest route via Flyover bypass with AC comfort",
          durationMinutes: 38,
          distanceKm: 13.0,
          fare: 340
        }
      ]
    }
  ];

  res.json({ options });
});

// 6. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
