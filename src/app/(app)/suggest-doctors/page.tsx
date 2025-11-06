import { Card, CardContent } from "@/components/ui/card";
import { SuggestDoctorsForm } from "./suggest-doctors-form";
import { PageHeader } from "@/components/page-header";

export default function SuggestDoctorsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Asistente de Búsqueda de Doctores"
        description="Utiliza nuestra IA para encontrar el doctor óptimo para tus necesidades. Completa los siguientes campos para obtener una lista de sugerencias."
      />
      <Card>
        <CardContent className="pt-6">
          <SuggestDoctorsForm />
        </CardContent>
      </Card>
    </div>
  );
}
