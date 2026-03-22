import { create } from 'zustand';
import { auditService } from '../lib/api';
import { 
  AuditReport, 
  AuditSummary, 
  Engine, 
  AuditRequest,
  AuditStatusResponse 
} from '../lib/types';

interface AuditState {
  activeAuditId: string | null;
  setActiveAuditId: (id: string | null) => void;
  // Legacy support for socket updates
  activeAudit: any | null; 
  setActiveAudit: (audit: any | null) => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  activeAuditId: null,
  activeAudit: null,
  setActiveAuditId: (id) => set({ activeAuditId: id }),
  setActiveAudit: (audit) => set({ activeAudit: audit }),
}));
