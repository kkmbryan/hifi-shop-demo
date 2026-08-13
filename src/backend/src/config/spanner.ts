import { Spanner, Database, Instance } from '@google-cloud/spanner';
import dotenv from 'dotenv';

dotenv.config();

export const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'hifi-shop-demo';
export const instanceId = process.env.SPANNER_INSTANCE_ID || process.env.SPANNER_INSTANCE || 'hifi-shop-spanner';
export const databaseId = process.env.SPANNER_DATABASE_ID || process.env.SPANNER_DATABASE || 'hifi-shop-db';

let spannerClient: Spanner | null = null;
let databaseClient: Database | null = null;
let isConnected = false;

try {
  spannerClient = new Spanner({ projectId });
  const instance: Instance = spannerClient.instance(instanceId);
  databaseClient = instance.database(databaseId);
} catch (error) {
  console.warn('[Spanner Config] Failed to initialize Spanner client instance. Backend will use fallback dataset if DB is unreachable.', error);
}

export const getSpannerClient = (): Spanner | null => spannerClient;
export const getDatabase = (): Database | null => databaseClient;

/**
 * Execute a SQL query against Cloud Spanner.
 * Returns rows if successful, or null if Spanner is unavailable or query fails.
 */
export async function executeSpannerSql<T = any>(
  query: string | { sql: string; params?: Record<string, any>; types?: Record<string, any> }
): Promise<T[] | null> {
  if (!databaseClient) {
    return null;
  }

  try {
    const [rows] = await databaseClient.run(query);
    const result = rows.map((row: any) => (row.toJSON ? row.toJSON() : row));
    isConnected = true;
    return result as T[];
  } catch (err) {
    console.warn('[Spanner Query Warning] Cloud Spanner query execution failed or unreachable:', (err as Error).message);
    isConnected = false;
    return null;
  }
}

export function checkSpannerStatus(): { connected: boolean; projectId: string; instanceId: string; databaseId: string } {
  return {
    connected: isConnected,
    projectId,
    instanceId,
    databaseId,
  };
}
