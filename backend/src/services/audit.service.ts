import prisma from '../config/database';

export interface AuditLogInput {
    userId?: string;
    action: string;
    entityType?: string;
    entityId?: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
}

/**
 * Audit Service - Handles logging of security and business events to the database
 */
export const logAction = async (data: AuditLogInput) => {
    try {
        return await prisma.auditLog.create({
            data: {
                userId: data.userId || null,
                action: data.action,
                entityType: data.entityType || null,
                entityId: data.entityId || null,
                metadata: data.metadata || null,
                ipAddress: data.ipAddress || null,
                userAgent: data.userAgent || null,
            },
        });
    } catch (error) {
        // We don't want audit logging failures to crash the request, 
        // but we should definitely log them to the console
        console.error('❌ Audit Log Failure:', error);
        return null; // Ensure all code paths return a value
    }
};

/**
 * Helper to log authentication events
 */
export const logAuthEvent = (userId: string | undefined, action: string, ip?: string, ua?: string, metadata?: any) => {
    return logAction({
        userId,
        action,
        entityType: 'auth',
        ipAddress: ip,
        userAgent: ua,
        metadata
    });
};
