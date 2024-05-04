import React from "react";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/forms/QuizCreation";
import { auth } from "@clerk/nextjs";

export const metadata = {
  title: "YimaruAI Quiz",
  description: "Quiz yourself with YimaruAI",
};

interface Props {
  searchParams: {
    topic?: string;
  };
}

const Quiz = async ({ searchParams }: Props) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  return <QuizCreation topic={searchParams.topic ?? ""} />;
};

export default Quiz;
