'use client';

import { ProfileForm } from "./profile-form";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/hooks/use-auth-provider";
import { RatingsList } from "@/components/ratings/ratings-list";

export default function ProfilePage() {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';

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

      {/* Show ratings if doctor */}
      {isDoctor && user?.uid && (
        <RatingsList doctorId={user.uid} showAverage={true} />
      )}
    </div>
  );
}
