/**
 * Audit Service
 * Handles logging of critical system actions for compliance and debugging.
 */

export interface AuditLogEntry {
  tenantId: string;
  actorId?: string;
  entityType: 'rental' | 'vehicle' | 'client' | 'payment';
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'status_change' | 'approve';
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}

export const logAuditEvent = async (entry: AuditLogEntry) => {
  // In a real application, this would insert into the 'audit_logs' table
  console.log(`[AUDIT LOG] ${new Date().toISOString()}:`, {
    ...entry,
    timestamp: new Date().toISOString(),
  });

  // Simulate DB latency
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return { success: true, id: crypto.randomUUID() };
};

/**
 * Specifically log a rental status change with detailed context
 */
export const logRentalStatusChange = async (
  rentalId: string,
  tenantId: string,
  oldStatus: string,
  newStatus: string,
  actorId: string
) => {
  return await logAuditEvent({
    tenantId,
    actorId,
    entityType: 'rental',
    entityId: rentalId,
    action: 'status_change',
    oldValues: { status: oldStatus },
    newValues: { status: newStatus },
  });
};
