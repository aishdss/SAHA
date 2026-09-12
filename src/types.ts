export type TransportMode =
  | 'BMTC'
  | 'BMRCL'
  | 'AUTOS'
  | 'TAXIS'
  | 'FASTAG'
  | 'AIRPORT'
  | 'RAILWAYS'
  | 'MAJESTIC';

export type UserRole = 'user' | 'authority';

export type QueryType = 'INFORMATIONAL_QUERY' | 'COMPLAINT' | 'TRANSACTION_REDIRECT';

export type UrgencyLevel = 'CRITICAL_SAFETY' | 'OPERATIONAL_HIGH' | 'OPERATIONAL_MEDIUM' | 'GENERAL_LOW';

export type ComplaintStatus =
  | 'ROUTED'
  | 'VIEWED_BY_AUTHORITY'
  | 'ACTION_IN_PROGRESS'
  | 'RESOLVED'
  | 'HANDED_OFF_TO_HUMAN';

export interface StatusHistoryItem {
  status: ComplaintStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface StructuredComplaintData {
  routeOrLocation: string;
  timeOfIncident: string;
  vehicleRegistration?: string;
  description: string;
}

export interface AIIncidentReport {
  summary: string;
  rootCauseHypothesis: string;
  suggestedAction: string;
  priorityReasoning: string;
  confidenceScore: number;
}

export interface VerifiedAuthorityResponse {
  authorityName: string;
  department: string;
  badge: 'VERIFIED_BMTC' | 'VERIFIED_BMRCL' | 'VERIFIED_TRAFFIC_POLICE' | 'VERIFIED_AIRPORT';
  responseText: string;
  timestamp: string;
  actionTaken: string;
}

export interface HumanHandoffDetails {
  triggered: boolean;
  reason: 'USER_UNSATISFIED' | 'LOW_CONFIDENCE' | 'CRITICAL_SAFETY' | 'SLA_BREACH';
  handoffTime: string;
  agentAssigned?: string;
  resolutionNotes?: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  timestamp: string;
  userId: string;
  userName: string;
  userPhone?: string;
  mode: TransportMode;
  category: 'safety' | 'operational' | 'informational';
  urgency: UrgencyLevel;
  rawMessage: string;
  structured: StructuredComplaintData;
  aiReport: AIIncidentReport;
  assignedDepartment: string;
  status: ComplaintStatus;
  statusHistory: StatusHistoryItem[];
  isMerged: boolean;
  masterIncidentId?: string;
  mergedComplaintIds?: string[];
  verifiedResponse?: VerifiedAuthorityResponse;
  humanHandoff?: HumanHandoffDetails;
}

export interface AIQueryResponse {
  queryType: QueryType;
  mode: TransportMode | 'GENERAL';
  category: 'safety' | 'operational' | 'informational';
  urgency: UrgencyLevel;
  confidence: number;
  answer?: string;
  kannadaAnswer?: string;
  redirectUrl?: string;
  redirectLabel?: string;
  structuredData?: StructuredComplaintData;
  aiReport?: AIIncidentReport;
  complaintCreated?: Complaint;
  duplicateMergedWith?: {
    masterTicketNumber: string;
    existingCount: number;
    incidentSummary: string;
  };
  requiresHumanHandoff?: boolean;
}

export interface CrowdsourcedReport {
  id: string;
  type: 'crowded_bus' | 'auto_refusal' | 'elevator_down' | 'pothole_waterlogging' | 'harassment_alert' | 'metro_delay';
  mode: TransportMode;
  location: string;
  coordinates: { x: number; y: number }; // percentage on city visual map
  title: string;
  description: string;
  timestamp: string;
  upvotes: number;
  userUpvoted?: boolean;
  verifiedByAuthority: boolean;
  status: 'ACTIVE' | 'INVESTIGATING' | 'CLEARED';
}

export interface RouteStop {
  name: string;
  kannadaName: string;
  timeEstimateMinutes: number;
  hasInterchange?: boolean;
  interchangeMode?: TransportMode;
  isTerminal?: boolean;
}

export interface TimetableEntry {
  departureTime: string;
  busOrTrainNumber: string;
  destination: string;
  platformOrBay: string;
  frequencyMinutes?: number;
  status: 'ON_TIME' | 'DELAYED' | 'ARRIVING_NOW' | 'DEPARTED';
  delayMinutes?: number;
}

export interface TransportRouteInfo {
  id: string;
  mode: TransportMode;
  code: string;
  name: string;
  kannadaName: string;
  from: string;
  to: string;
  fareRange: string;
  travelTime: string;
  frequency: string;
  typeBadge: string;
  stops: RouteStop[];
  liveStatus: {
    status: 'ACTIVE' | 'NORMAL' | 'HIGH_DEMAND' | 'DELAYED';
    currentLocation?: string;
    nextArrivalMinutes?: number;
    alerts?: string[];
  };
}

export interface JourneyStep {
  mode: 'WALK' | 'BUS' | 'METRO' | 'AUTO' | 'CAB';
  instruction: string;
  kannadaInstruction: string;
  detail: string;
  durationMinutes: number;
  distanceKm: number;
  fare: number;
  routeCode?: string;
  platform?: string;
  stopsCount?: number;
}

export interface JourneyPlanOption {
  id: string;
  title: string;
  tag: 'FASTEST' | 'CHEAPEST' | 'MIN_TRANSFERS' | 'DIRECT_CAB';
  totalDurationMinutes: number;
  totalCost: number;
  carbonSavingsKg: number;
  steps: JourneyStep[];
}

export interface MajesticPlatformBay {
  bayNumber: number;
  title: string;
  routes: string[];
  primaryDestinations: string[];
  kannadaDestinations: string[];
  busType: 'Ordinary' | 'Vajra' | 'Vayu Vajra' | 'KSRTC Intercity';
  connectingSubway: string;
}

export interface PredictiveAlert {
  id: string;
  mode: TransportMode;
  zone: string;
  hazardOrIssue: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  triggerFactor: string;
  recommendedAction: string;
  timestamp: string;
}

export interface RecurringPattern {
  id: string;
  keyIdentifier: string; // e.g. "Route 500D - Silk Board"
  mode: TransportMode;
  occurrenceCount: number;
  timeframe: string;
  commonCategory: string;
  patternDescription: string;
  suggestedIntervention: string;
}

export interface SLAMetric {
  category: string;
  targetMinutes: number;
  currentAvgMinutes: number;
  totalHandled: number;
  withinSLAPercent: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  authorityDept?: string;
  homeLocation: string;
  workLocation: string;
  language: 'en' | 'kn';
  notificationsEnabled: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'COMPLAINT_UPDATE' | 'TRANSIT_ALERT' | 'MERGE_NOTICE' | 'COMMUNITY_REPORT';
  ticketNumber?: string;
  read: boolean;
}
