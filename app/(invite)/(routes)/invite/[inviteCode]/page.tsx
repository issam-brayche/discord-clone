import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
};

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }
  console.log("A1");
  if (!params.inviteCode) {
    console.log("A2");
    return redirect("/");
  }

  console.log("A3");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });
  console.log("A4");
  if (existingServer) {
    console.log("A5");
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          }
        ]
      }
    }
  });
  console.log("A6");
  if (server) {
    console.log("A7");
    return redirect(`/servers/${server.id}`);
  }
  
  return null;
}
 
export default InviteCodePage;