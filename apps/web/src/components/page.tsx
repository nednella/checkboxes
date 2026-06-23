import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Page({ children }: Props) {
  return (
    <div className="grid h-svh w-full grid-rows-[max-content_1fr] gap-4 overflow-y-auto px-8 py-4">{children}</div>
  );
}
