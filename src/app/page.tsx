"use client";

import React, { useEffect, useState } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat, CopilotKitCSSProperties } from "@copilotkit/react-ui";

// Projendeki mevcut tipleri kullanmaya devam ediyoruz
import {
  StockPriceCardProps,
  HistoricalStockDataProps,
  StockData,
  MeetingCardProps,
  EmailSendCardProps,
} from "@/lib/types";



type Step = {
  description: string;
  status: "enabled" | "disabled" | "executing";
};



function StepsFeedback({
  args,
  respond,
  status,
}: {
  args: { steps?: Step[] };
  respond?: (msg: string) => void; // respond opsiyonel olabilir
  status: string;
}) {
  const [localSteps, setLocalSteps] = useState<Step[]>([]);
  const [newStep, setNewStep] = useState("");

  // İlk yüklemede modelden gelen adımları yakala
  useEffect(() => {
    if (
      (status === "executing" || status === "inProgress") &&
      localSteps.length === 0 &&
      Array.isArray(args?.steps)
    ) {
      setLocalSteps(args.steps as Step[]);
    }
  }, [status, args?.steps, localSteps.length]);

  if (!Array.isArray(args?.steps) || args.steps.length === 0) return null;
  const steps: Step[] = localSteps.length > 0 ? localSteps : (args.steps as Step[]);

  const toggle = (i: number) =>
    setLocalSteps((prev) =>
      prev.map((s: Step, idx: number) =>
        idx === i ? { ...s, status: s.status === "enabled" ? "disabled" : "enabled" } : s,
      ),
    );

  const add = () => {
    const t = newStep.trim();
    if (!t) return;
    setLocalSteps((prev) => [...prev, { description: t, status: "enabled" }]);
    setNewStep("");
  };

  return (
    <div className="flex flex-col gap-4 w-[500px] bg-gray-100 rounded-lg p-6">
      <h2 className="text-lg font-bold">Select Steps</h2>

      <div className="space-y-2">
        {steps.map((s: Step, i: number) => (
          <label key={i} className="flex items-center text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={s.status === "enabled"}
              onChange={() => toggle(i)}
            />
            <span className={s.status !== "enabled" ? "line-through" : ""}>{s.description}</span>
          </label>
        ))}
      </div>

      {status === "executing" && (
        <>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded border px-2 py-1"
              placeholder="Add a new step…"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
            <button className="px-3 py-1 rounded bg-gray-800 text-white" onClick={add}>
              Add
            </button>
          </div>

          <button
            className="mt-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white py-2 px-4 rounded font-bold"
            onClick={() => {
              const selected = (localSteps.length ? localSteps : steps)
                .filter((s) => s.status === "enabled")
                .map((s) => s.description);
              // respond opsiyonel olabilir
              respond?.("The user selected the following steps: " + selected.join(", "));
            }}
          >
            ✨ Perform Steps
          </button>
        </>
      )}
    </div>
  );
}



function StockPriceCard({ symbol, price, themeColor }: StockPriceCardProps) {
  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-md w-full mb-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex justify-between w-full">
          <h3 className="text-2xl font-bold text-white">{symbol}</h3>
          <p className="text-gray-200 text-2xl">${price}</p>
        </div>
      </div>
    </div>
  );
}

function HistoricalStockData({ data, args, themeColor }: HistoricalStockDataProps) {
  if (!data) return null;
  const entries = Object.entries(data).slice(0, 5) as [string, StockData][];

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-2xl w-full mb-4"
    >
      <h3 className="text-xl font-bold text-white mb-4">{args.symbol}</h3>
      <p className="text-gray-200 text-sm mb-4">
        Period: {args.period} | Interval: {args.interval}
      </p>
      <div className="space-y-3">
        {entries.map(([timestamp, stockData]) => {
          const date = new Date(parseInt(timestamp));
          const formattedDate = date.toLocaleDateString();
          return (
            <div key={timestamp} className="bg-white/10 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">{formattedDate}</span>
                <span className="text-green-400 font-bold">
                  ${stockData.Close?.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-gray-300">Open</span>
                  <div className="text-white">${stockData.Open?.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-300">High</span>
                  <div className="text-white">${stockData.High?.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-300">Low</span>
                  <div className="text-white">${stockData.Low?.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-300">Volume</span>
                  <div className="text-white">
                    {(stockData.Volume / 1_000_000).toFixed(1)}M
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MeetingCard({
  subject,
  start_time,
  end_time,
  attendees,
  description,
  themeColor,
}: MeetingCardProps) {
  const start = new Date(start_time);
  const end = new Date(end_time);
  const fmt = (d: Date) =>
    `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-xl w-full"
    >
      <h3 className="text-2xl font-bold text-white mb-2">{subject}</h3>
      <p className="text-gray-200 mb-1">
        {fmt(start)} → {fmt(end)}
      </p>
      {attendees?.length ? (
        <p className="text-gray-200 mb-1">Attendees: {attendees.join(", ")}</p>
      ) : null}
      {description ? <p className="text-gray-100 mt-2">{description}</p> : null}
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition">
          Confirm
        </button>
        <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition">
          Edit
        </button>
      </div>
    </div>
  );
}

function EmailSendCard({ to, subject, body, themeColor }: EmailSendCardProps) {
  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-3xl w-full mb-4"
    >
      <h3 className="text-2xl font-bold text-white mb-1">{subject}</h3>
      <p className="text-white/80 text-sm mb-4">
        <span className="font-medium">To:</span> {to}
      </p>
      <div className="bg-white/10 p-4 rounded-lg prose prose-invert max-w-none text-white/90 text-sm whitespace-pre-wrap">
        {body}
      </div>
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition">
          Send another
        </button>
      </div>
    </div>
  );
}



export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState("#6366f1");

  // Frontend action: tema rengi
  useCopilotAction({
    name: "set_theme_color",
    parameters: [{ name: "theme_color", description: "The theme color", required: true }],
    handler({ theme_color }) {
      setThemeColor(theme_color);
    },
  });

  // Opsiyonel/no-op (tam ekran chat'te form açmıyoruz)
  useCopilotAction({
    name: "open_support_form",
    description: "Open a blank support form (no-op in full chat layout).",
    handler: () => {},
  });

  return (
    <main
      className="min-h-screen w-full flex flex-col"
      style={
        {
          // CopilotKit’in tema rengi (butonlar, vurgu vs.)
          "--copilot-kit-primary-color": themeColor,
          // Sayfa arka planı -> set_theme_color ile canlı değişir
          background: themeColor,
        } as CopilotKitCSSProperties
      }
    >
      {/* Üst tarafta senin kartların */}
      <YourMainContent themeColor={themeColor} />
  
      {/* Ortada kart şeklinde chat */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="w-[95vw] max-w-5xl h-[90vh] rounded-2xl shadow-2xl
             bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden"
        >
          <CopilotChat
            className="h-full w-full"
            labels={{
              title: "Assistant",
              initial: `👋 Hi! I'm new at Novus and ready to help.\n\n`,
            }}
          />
        </div>
      </div>
    </main>
  );
  
}

function YourMainContent({ themeColor }: { themeColor: string }) {
  const [proverbs, setProverbs] = useState<string[]>([]);

  useCopilotAction({
    name: "generate_task_steps",
    parameters: [
      {
        name: "steps",
        type: "object[]",
        attributes: [
          { name: "description", type: "string" },
          { name: "status", type: "string", enum: ["enabled", "disabled", "executing"] },
        ],
      },
    ],
    renderAndWaitForResponse: ({ args, respond, status }) => (
      <StepsFeedback args={args} respond={respond} status={status} />
    ),
  });

  /* ------------------------------ Frontend Actions ------------------------------ */
  useCopilotAction({
    name: "add_proverb",
    parameters: [{ name: "proverb", description: "Witty short proverb", required: true }],
    handler: ({ proverb }) => setProverbs((prev) => [...prev, proverb]),
  });

  // Generative UI: anlık fiyat kartı
  useCopilotAction({
    name: "get_current_stock_price",
    render: ({ args, result, status }) => {
      if (status !== "complete") return <div>Loading stock price for {args.symbol}...</div>;
      return (
        <div className="mb-4">
          {result && <StockPriceCard symbol={args.symbol} price={result} themeColor={themeColor} />}
        </div>
      );
    },
  });

  // Generative UI: tarihsel fiyatlar
  useCopilotAction({
    name: "get_historical_stock_prices",
    parameters: [
      { name: "symbol", type: "string", required: true },
      { name: "period", type: "string", required: true },
      { name: "interval", type: "string", required: true },
    ],
    render: ({ args, result, status }) => {
      if (status !== "complete")
        return (
          <div>
            Loading historical prices for {args.symbol} every {args.interval} for the last {args.period}...
          </div>
        );
      return (
        <div className="mb-4">
          {result && <HistoricalStockData data={result} args={args} themeColor={themeColor} />}
        </div>
      );
    },
  });

  // GmailTools send_email sonuç kartı
  useCopilotAction({
    name: "send_email",
    parameters: [
      { name: "to", type: "string", required: true },
      { name: "subject", type: "string", required: true },
      { name: "body", type: "string", required: true },
      { name: "cc", type: "string", required: false },
      { name: "attachments", type: "string[]", required: false },
    ],
    render: ({ args, status }) => {
      if (status !== "complete") return <div className="mb-4">E-posta gönderiliyor…</div>;
      return (
        <EmailSendCard to={args.to} subject={args.subject} body={args.body} themeColor={themeColor} />
      );
    },
  });

  // Meeting card render
  useCopilotAction({
    name: "render_meeting_card",
    parameters: [
      { name: "subject", type: "string", required: true },
      { name: "start_time", type: "string", required: true },
      { name: "end_time", type: "string", required: true },
      { name: "attendees", type: "string[]", required: false },
      { name: "description", type: "string", required: false },
    ],
    render: ({ args, status }) => {
      if (status !== "complete") return <div>Preparing meeting card...</div>;
      return (
        <div className="mb-4">
          <MeetingCard
            subject={args.subject}
            start_time={args.start_time}
            end_time={args.end_time}
            attendees={args.attendees}
            description={args.description}
            themeColor={themeColor}
          />
        </div>
      );
    },
  });

  // (İstersen atasözlerini sayfada göster)
  return (
    <div className="p-4">
      {proverbs.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Proverbs</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {proverbs.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
