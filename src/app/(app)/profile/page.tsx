import { ProfileForm } from "./profile-form";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Perfil de Usuario"
        description="Gestiona tu información personal y de contacto."
      />
      <Card>
        <CardContent className="pt-6">
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
