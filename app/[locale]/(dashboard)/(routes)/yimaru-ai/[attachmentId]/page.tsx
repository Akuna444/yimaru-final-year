import ChatWrapper from "@/components/chat/ChatWrapper";
import PdfRenderer from "@/components/PdfRenderer";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: {
    attachmentId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { attachmentId } = params;

  const { userId } = auth();

  if (!userId) redirect(`/auth-callback?origin=dashboard/${attachmentId}`);

  const file = await db.attachment.findFirst({
    where: {
      id: attachmentId,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* Main area */}
            <PdfRenderer url={file.url} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper attachmentId={attachmentId} />
        </div>
      </div>
    </div>
  );
};

export default Page;
