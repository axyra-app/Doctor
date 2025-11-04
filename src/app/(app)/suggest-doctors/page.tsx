import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SuggestDoctorsForm } from "./suggest-doctors-form";

export default function SuggestDoctorsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Asistente de Búsqueda de Doctores</CardTitle>
          <CardDescription>
            Utiliza nuestra IA para encontrar el doctor óptimo para tus necesidades. Completa los siguientes campos para obtener una lista de sugerencias.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SuggestDoctorsForm />
        </CardContent>
      </Card>
    </div>
  );
}
