import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Page({ children }: Props) {
  return <div className="flex h-svh w-full flex-col items-center justify-center gap-6">{children}</div>;
}
