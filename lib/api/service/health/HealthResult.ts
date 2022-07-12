export interface NodeHeight {
    url: string;
    height: number;
}

export interface HealthResult {
    chain: string;
    healthy: boolean;
    heights: NodeHeight[];
    explorerHeight: number;
    notes: string;      // These are persisted to db
}