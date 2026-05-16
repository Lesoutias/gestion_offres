import { Table } from "../../components/ui/Table";
import { auditLogService } from "../../services/auditLogService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function AuditLogsPage() {
  const { data, loading, error } = useAsyncData(() => auditLogService.getAll(), []);
  return (
    <>
      <PageTitle title="Journaux d'audit" />
      <StateBlock loading={loading} error={error}>
        <Table headers={["Date", "Utilisateur", "Action", "Entite", "Description"]}>
          {(data || []).map((log) => (
            <tr key={log.id}><td className="px-4 py-3">{new Date(log.created_at).toLocaleString()}</td><td className="px-4 py-3">{log.user_id}</td><td className="px-4 py-3">{log.action}</td><td className="px-4 py-3">{log.entity_type}</td><td className="px-4 py-3">{log.description}</td></tr>
          ))}
        </Table>
      </StateBlock>
    </>
  );
}
