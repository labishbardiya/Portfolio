import { StudioLogin } from "./studio-login";

export const dynamic = "force-dynamic";

type StudioLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function StudioLoginPage({ searchParams }: StudioLoginPageProps) {
  const { error } = await searchParams;
  return <StudioLogin initialError={error} />;
}
