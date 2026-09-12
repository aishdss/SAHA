export interface AppTranslations {
  appTitle: string;
  tagline: string;
  subTagline: string;
  actionTagline: string;
  stepSearch: string;
  stepAsk: string;
  stepReport: string;
  stepTrack: string;
  stepResolve: string;
  appSubtitle: string;
  publicRole: string;
  authorityRole: string;
  switchRole: string;
  searchPlaceholder: string;
  askAssistant: string;
  aiPipelineTitle: string;
  aiPipelineSubtitle: string;
  journeyPlannerTab: string;
  modesTab: string;
  crowdsourceTab: string;
  authorityDashboardTab: string;
  offlineMode: string;
  onlineMode: string;
  fareCalculator: string;
  emergencyHelpline: string;
  helpFaq: string;
  profile: string;
  smartAiAssistant: string;
  journeyPlanner: string;
  exploreModes: string;
  communityReports: string;
  bmtcBus: string;
  bmrclMetro: string;
  autos: string;
  taxis: string;
  fastag: string;
  airport: string;
  railways: string;
  majesticGuide: string;
}

export const TRANSLATIONS: Record<'en' | 'kn', AppTranslations> = {
  en: {
    appTitle: "SAHA",
    tagline: "Tell Us. We’ll Take It Forward.",
    subTagline: "You don't need to know whom to contact. SAHA does.",
    actionTagline: "Search. Ask. Report. Track. Resolve.",
    stepSearch: "Search",
    stepAsk: "Ask",
    stepReport: "Report",
    stepTrack: "Track",
    stepResolve: "Resolve",
    appSubtitle: "Tell Us. We’ll Take It Forward. • You don't need to know whom to contact. SAHA does.",
    publicRole: "Commuter / Tourist",
    authorityRole: "Verified Authority",
    switchRole: "Switch Mode",
    searchPlaceholder: "Ask anything (e.g. where is bus 500D, auto meter rates, report an issue...)",
    askAssistant: "Ask AI or File Complaint",
    aiPipelineTitle: "3-Layer Smart Transit Assistant",
    aiPipelineSubtitle: "Answers info instantly • Auto-triages complaints • Human handoff with full context",
    journeyPlannerTab: "Multi-Modal Journey",
    modesTab: "Transport Directory",
    crowdsourceTab: "Live Community Pins",
    authorityDashboardTab: "Authority Control Desk",
    offlineMode: "Offline Mode (Cached)",
    onlineMode: "Live System",
    fareCalculator: "Fare Calculator",
    emergencyHelpline: "Emergency 112",
    helpFaq: "Helplines & FAQ",
    profile: "My Profile & Complaints",
    smartAiAssistant: "Smart AI Assistant",
    journeyPlanner: "Multi-Modal Planner",
    exploreModes: "Explore Modes",
    communityReports: "Live Community Pins",
    bmtcBus: "BMTC Buses",
    bmrclMetro: "BMRCL Metro",
    autos: "Auto Rickshaws",
    taxis: "Taxis & Cabs",
    fastag: "FASTag Tolls",
    airport: "KIA Airport",
    railways: "Railway Stations",
    majesticGuide: "Majestic Platform Guide"
  },
  kn: {
    appTitle: "ಸಾಹ (SAHA)",
    tagline: "ನಮಗೆ ತಿಳಿಸಿ. ನಾವು ಮುಂದೆ ಕೊಂಡೊಯ್ಯುತ್ತೇವೆ.",
    subTagline: "ಯಾರನ್ನು ಸಂಪರ್ಕಿಸಬೇಕೆಂದು ನೀವು ತಿಳಿಯಬೇಕಿಲ್ಲ. ಸಾಹಗೆ ತಿಳಿದಿದೆ.",
    actionTagline: "ಹುಡುಕಿ. ಕೇಳಿ. ವರದಿ ಮಾಡಿ. ಟ್ರ್ಯಾಕ್ ಮಾಡಿ. ಪರಿಹರಿಸಿ.",
    stepSearch: "ಹುಡುಕಿ",
    stepAsk: "ಕೇಳಿ",
    stepReport: "ವರದಿ ಮಾಡಿ",
    stepTrack: "ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    stepResolve: "ಪರಿಹರಿಸಿ",
    appSubtitle: "ನಮಗೆ ತಿಳಿಸಿ. ನಾವು ಮುಂದೆ ಕೊಂಡೊಯ್ಯುತ್ತೇವೆ. • ಯಾರನ್ನು ಸಂಪರ್ಕಿಸಬೇಕೆಂದು ನೀವು ತಿಳಿಯಬೇಕಿಲ್ಲ. ಸಾಹಗೆ ತಿಳಿದಿದೆ.",
    publicRole: "ಪ್ರಯಾಣಿಕರು / ಪ್ರವಾಸಿಗರು",
    authorityRole: "ಅಧಿಕೃತ ಸಾರಿಗೆ ಅಧಿಕಾರಿ",
    switchRole: "ಪಾತ್ರ ಬದಲಾಯಿಸಿ",
    searchPlaceholder: "ಏನನ್ನಾದರೂ ಕೇಳಿ (ಉದಾ: ಬಸ್ 500ಡಿ ಎಲ್ಲಿದೆ, ಆಟೋ ಮೀಟರ್ ದರ, ದೂರು ದಾಖಲಿಸಿ...)",
    askAssistant: "ಎಐ ಪ್ರಶ್ನೆ / ದೂರು ಸಲ್ಲಿಸಿ",
    aiPipelineTitle: "3-ಹಂತದ ಸ್ಮಾರ್ಟ್ ಸಾರಿಗೆ ಸಹಾಯಕ",
    aiPipelineSubtitle: "ತಕ್ಷಣ ಮಾಹಿತಿ • ಸ್ವಯಂಚಾಲಿತ ದೂರು ವರ್ಗೀಕರಣ • ಪೂರ್ಣ ವಿವರದೊಂದಿಗೆ ನೇರ ಅಧಿಕಾರಿ ಬೆಂಬಲ",
    journeyPlannerTab: "ಬಹು-ಮಾದರಿ ಪ್ರಯಾಣ ಯೋಜನೆ",
    modesTab: "ಸಾರಿಗೆ ಮಾರ್ಗದರ್ಶಿ",
    crowdsourceTab: "ನೈಜ-ಸಮಯದ ನಕ್ಷೆ ವರದಿಗಳು",
    authorityDashboardTab: "ಅಧಿಕಾರಿಗಳ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    offlineMode: "ಆಫ್‌ಲೈನ್ ಮೋಡ್ (ಸಂಗ್ರಹಿತ)",
    onlineMode: "ಲೈವ್ ಸಂಪರ್ಕ",
    fareCalculator: "ದರ ಲೆಕ್ಕಾಚಾರ",
    emergencyHelpline: "ತುರ್ತು 112",
    helpFaq: "ಸಹಾಯವಾಣಿ & ಪ್ರಶ್ನೋತ್ತರ",
    profile: "ನನ್ನ ವಿವರ & ದೂರುಗಳು",
    smartAiAssistant: "ಸ್ಮಾರ್ಟ್ ಎಐ ಸಹಾಯಕ",
    journeyPlanner: "ಪ್ರಯಾಣ ಯೋಜನೆ",
    exploreModes: "ಸಾರಿಗೆ ಮಾರ್ಗಗಳು",
    communityReports: "ಲೈವ್ ವರದಿಗಳು",
    bmtcBus: "ಬಿಎಂಟಿಸಿ ಬಸ್ಸುಗಳು",
    bmrclMetro: "ನಮ್ಮ ಮೆಟ್ರೋ",
    autos: "ಆಟೋ ರಿಕ್ಷಾ",
    taxis: "ಕ್ಯಾಬ್ ಮತ್ತು ಟ್ಯಾಕ್ಸಿ",
    fastag: "ಫಾಸ್ಟ್ಯಾಗ್ ಸುಂಕ",
    airport: "ಕೆಂಪೇಗೌಡ ವಿಮಾನ ನಿಲ್ದಾಣ",
    railways: "ರೈಲ್ವೆ ನಿಲ್ದಾಣಗಳು",
    majesticGuide: "ಮೆಜೆಸ್ಟಿಕ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಗೈಡ್"
  }
};
