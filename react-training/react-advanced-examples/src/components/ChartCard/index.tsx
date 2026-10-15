import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type chartData = { name: string; value: number; fill?: string }[]

const ChartCard = ({ data, index, status, percent }: { data: chartData, index: number, status: string, percent: number} ) => {

  return (
    <Card key={index} className="flex flex-col justify-start w-52 border-none shadow-none gap-0">
      <CardHeader className="items-center pb-0 hidden">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            visitors: { label: "Visitors" },
            ...data.reduce((acc, cur) => {
              acc[cur.name] = { label: cur.name, color: cur.fill };
              return acc;
            }, {} as ChartConfig)
          }}
          className="mx-auto aspect-square max-h-[140px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={35}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {`${percent}%`}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm px-0">
        <div className="flex items-center gap-2 leading-none font-medium">
          {status}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartCard
