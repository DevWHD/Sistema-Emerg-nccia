import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Form {
  id: string;
  title: string;
  blood_type: string;
  status: string;
  created_at: string;
}

interface RecentFormsProps {
  forms: Form[];
}

export function RecentForms({ forms }: RecentFormsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Formulários Recentes</h3>
        <p className="text-sm text-muted-foreground">
          Seus formulários de emergência criados recentemente
        </p>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tipo Sanguíneo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  Nenhum formulário criado ainda
                </TableCell>
              </TableRow>
            ) : (
              forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    <Link
                      href={`/forms/${form.id}`}
                      className="font-medium hover:underline"
                    >
                      {form.title}
                    </Link>
                  </TableCell>
                  <TableCell>{form.blood_type || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        form.status === "active" ? "default" : "secondary"
                      }
                    >
                      {form.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(form.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
