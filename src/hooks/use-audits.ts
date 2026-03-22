import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auditService } from '../lib/api';
import { AuditRequest, AuditRecord, AuditReport, Engine, AuditStatusResponse } from '../lib/types';

export const queryKeys = {
  audits: ['audits'] as const,
  audit: (id: string) => ['audit', id] as const,
  status: (id: string) => ['audit', id, 'status'] as const,
  engines: ['engines'] as const,
};

// Hook for listing recent audits
export function useRecentAudits(limit = 20, offset = 0) {
  return useQuery({
    queryKey: [...queryKeys.audits, { limit, offset }],
    queryFn: () => auditService.listAudits(limit, offset),
  });
}

// Hook for getting full audit results
export function useAuditDetails(auditId: string | null) {
  return useQuery({
    queryKey: queryKeys.audit(auditId || ''),
    queryFn: () => auditService.getAuditResults(auditId!),
    enabled: !!auditId,
  });
}

// Hook for polling audit status
export function useAuditStatus(auditId: string | null) {
  return useQuery({
    queryKey: queryKeys.status(auditId || ''),
    queryFn: () => auditService.getAuditStatus(auditId!),
    enabled: !!auditId,
    // Poll every 2 seconds if not completed
    refetchInterval: (query) => {
      const data = query.state.data as AuditStatusResponse | undefined;
      if (data?.status === 'completed') return false;
      return 2000;
    },
    // Don't refetch on focus during polling to keep it stable
    refetchOnWindowFocus: false,
  });
}

// Hook for starting a new audit
export function useStartAudit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: AuditRequest) => auditService.startAudit(request),
    onSuccess: () => {
      // Invalidate the list so it refreshes
      queryClient.invalidateQueries({ queryKey: queryKeys.audits });
    },
  });
}

// Hook for listing available engines
export function useEngines() {
  return useQuery({
    queryKey: queryKeys.engines,
    queryFn: () => auditService.getEngines(),
    staleTime: 1000 * 60 * 10, // Engines don't change often
  });
}
