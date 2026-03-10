interface ProportionBarProps {
  total: number
  used: number
  usedColor?: string
  remainingColor?: string
}

export function ProportionBar({
  total,
  used,
  usedColor = "bg-red-500",
  remainingColor = "bg-green-500"
}: ProportionBarProps) {

  const usedPercent =
    total > 0 ? Math.min((used / total) * 100, 100) : 0;

  const remainingPercent =
    total > used ? 100 - usedPercent : 0;

  return (
    <div className="w-full h-6 bg-muted rounded-lg overflow-hidden flex">

      <div
        className={`${usedColor} h-full`}
        style={{ width: `${usedPercent}%` }}
      />

      {remainingPercent > 0 && (
        <div
          className={`${remainingColor} h-full`}
          style={{ width: `${remainingPercent}%` }}
        />
      )}

    </div>
  );
}