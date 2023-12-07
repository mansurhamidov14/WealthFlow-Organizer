import { JSXElement } from "solid-js";

export type TransactionGroupProps = {
  date: string;
  children: JSXElement | JSXElement[];
}

export function TransactionGroup({ date, children }: TransactionGroupProps) {
  return (
    <div class="flex flex-col gap-3">
      <div class="text-slate-400 font-semibold mt-1">{new Date(date).toLocaleDateString("en-EN", { month: "short", day: "2-digit" })}</div>
      {children}
    </div>
  );
}
